import RNFetchBlob from 'rn-fetch-blob';
import { storage } from './mmkv';
import RNFS from 'react-native-fs';
import { _auth } from './App';
import database from '@react-native-firebase/database';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';

const AppInitScore = 10;
const firebase = database();

export const GetImage = async (url, ext, headers) => {
  let rnfetch = RNFetchBlob.config({ fileCache: true, appendExt: ext });
  return await rnfetch.fetch('GET', url, headers);
};

export function getHourLapse(before) {
  return Math.round(Math.abs(Date.now() - before) / 36e5);
}

export async function SaveCountry() {
  let data = await fetch('https://ipinfo.io/json');
  let json = await data.json();
  storage.set('countryCode', json.country);
  let moreData = await fetch(
    'https://restcountries.com/v2/alpha/' + json.country,
  );
  let cdata = await moreData.json();
  let countryName = cdata.name;
  storage.set('countryData', JSON.stringify(cdata));
  storage.set('countryName', countryName);
}

export async function ValidateOnStart() {
  if (!storage.getString('countryCode')) {
    await SaveCountry().catch((e) => console.error(e));
  }
  if (isInfluencer() && storage.getBoolean('hasPublished') == undefined) {
    const self = storage.getString('userHash');
    if (!self) {
      return;
    }
    let data = (
      await firebase.ref('userpublish').child(self).once('value')
    ).val();
    storage.set('hasPublished', data ? true : false);
  }
}
export async function SetUserId({ user, update }) {
  const _userId = storage.getString('userHash');
  if (!update && _userId) {
    console.debug(`UserHash: ${_userId}`);
    if (!user?.displayName) {
      return;
    }
    let _user = await getUser(_userId);
    let usser = await getProfileRef();
    if (_user.name !== user.displayName) {
      console.debug('user: Updating name.');
      usser.child('name').set(user.displayName);
    }
    if (user?.photoURL && _user.photo !== user.photoURL) {
      console.debug('user: Updating photo.');
      usser.child('photo').set(user.photoURL);
    }
    return;
  }
  console.debug('setting UserHash');
  let users = await firebase.ref('users');
  let userAuth = await firebase.ref(`uidUserID/${user.uid}`);
  let findfromAuth = await (await userAuth.once('value')).val();

  if (findfromAuth) {
    console.debug(`Previous User Identified, User Id: ${findfromAuth}`);
    storage.set('userHash', findfromAuth);
    return;
  }
  if (!user?.displayName) {
    return;
  }

  let userRef = users.push({
    name: user?.displayName,
    photo: user?.photoUrl,
    score: AppInitScore,
    joined: user?.metadata?.creationTime,
  });
  let userHash = userRef.key;

  console.debug(`assigning userHash ${userHash}`);
  storage.set('userHash', userHash);
  await userAuth.set(userHash);
}

export async function getProfileRef() {
  const userId = storage.getString('userHash');
  return database().ref(`users/${userId}`);
}

const _UserCache = {};

export const getUser = async (hash) => {
  if (_UserCache[hash]) {
    return _UserCache[hash];
  }
  let user = (await database().ref(`users/${hash}`).once('value')).val();
  _UserCache[hash] = user;
  return user;
};

export const getSelf = async () => {
  return await getUser(storage.getString('userHash'));
};

export function getRandom(data) {
  return data[Math.floor(Math.random() * data.length)];
}

export const isInfluencer = () => {
  let pref = storage.getString('preferredData');
  if (!pref) {
    return;
  }
  return JSON.parse(pref).includes('influencer');
};

export async function setOrGetScore(score) {
  if (!score) {
    let fromdb = storage.getNumber('userScore');
    if (fromdb) {
      return fromdb;
    }
  }
  let user = await getProfileRef();
  let _score = (await (await user.once('value')).val()).score || 0;
  if (!score) {
    return _score;
  }
  _score += score;
  user.child('score').set(_score);
  storage.set('userScore', _score);
  return _score;
}

const _EventCache = [];

export const getEvent = async (id) => {
  if (_EventCache[id]) {
    return _EventCache[id];
  }
  let data = (await firebase.ref(`publish/${id}`).once('value')).val();
  _EventCache[id] = data;
  return data;
};

export const getEvents = async () => {
  let events = [];

  const Extract = async (key) => {
    let data = (await firebase.ref(`events/${key}`).once('value')).val();
    if (data) {
      events.push(...data.toString().split('_'));
    }
  };
  await Extract('global');
  await Extract(storage.getString('countryCode'));
  let eventwithdata = [];
  for (let i = 0; i < events.length; i++) {
    let event = await getEvent(events[i]);
    event.id = events[i];
    eventwithdata.push(event);
  }
  return eventwithdata;
};

export const getSelfEvents = async () => {
  const self = storage.getString('userHash');
  let data = (await firebase.ref(`userpublish/${self}`).once('value')).val();
  if (!data) {
    return [];
  }
  let events = data.toString().split('_');
  var eventwithdata = [];
  for (let i = 0; i < events.length; i++) {
    eventwithdata.push(await getEvent(events[i]));
  }
  return eventwithdata;
};

export const getTaskProgress = () => {
  const scorebools = [];
  [
    'taskVideoDone',
    'firstSearch',
    'taskPostDone',
    'taskQuizDone',
    'taskShareDone',
  ].map((value) => {
    scorebools.push(storage.getBoolean(value));
  });
  const trues = scorebools.filter((d) => d === true).length;
  return Math.round((trues / scorebools.length) * 10) / 10;
};

export const ShareApp = async () => {
  await Share.open({ message: 'Join Enviro', url: 'https://google.com' }).catch(
    (e) => {
      console.error(e);
    },
  );
  if (!storage.getBoolean('taskShareDone')) {
    storage.set('taskShareDone', true);
    Toast.show({
      text1: 'You completed the share task.',
      type: 'success',
      position: 'bottom',
    });
  }
};
