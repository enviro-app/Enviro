import {
  Text,
  Avatar,
  Appbar,
  TextInput,
  Button,
  Portal,
  List,
  Modal,
  FAB,
  IconButton,
  AnimatedFAB,
  useTheme,
  Divider,
} from 'react-native-paper';
import { useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { View, StyleSheet, Image, ToastAndroid } from 'react-native';
import { _auth } from '../../App';
import { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { BackHandler } from 'react-native';
import { storage as mmkv } from '../../mmkv';
import { getProfileRef } from '../../util';

const styles = StyleSheet.create({
  header: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 8,
  },
  view: {
    paddingVertical: 25,
    paddingHorizontal: 10,
    display: 'flex',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
  },
});

async function getUserBio() {
  const prof = await getProfileRef();
  return (await (await prof.once('value')).val()).bio;
}

const getBio = async () => {
  let bio = mmkv.getString('userBio');
  if (bio) {
    return bio;
  }
  bio = await getUserBio();
  if (bio) {
    mmkv.set('userBio', bio);
  }
  return bio;
};

export function ProfileScreen(props) {
  const { navigate } = props.navigation;
  const user = _auth.currentUser;
  const [CanEdit, AllowEdit] = useState(false);
  const [name, setName] = useState(user?.displayName);
  const [bio, setBio] = useState();
  const [URL, setImage] = useState();
  const [Country, setCountry] = useState();

  const [countries, setCountries] = useState();
  const { colors } = useTheme();

  const country = mmkv.getString('countryCode');

  useEffect(() => {
    getBio().then((d) => {
      setBio(d);
    });
  }, []);

  useEffect(() => {
    if (CanEdit && !countries) {
      const get = async () => {
        let data = await fetch("https://restcountries.com/v2/all");
        setCountries(await data.json());
      }
      get();
    }
  }, [CanEdit]);

  BackHandler.addEventListener('hardwareBackPress', () => {
    // Destroy State
    if (CanEdit) {
      AllowEdit(false);
    }
  });

  const AvatarIcon = (props) =>
    user?.photoURL ? (
      <TouchableWithoutFeedback
        onPress={() => {
          if (user?.photoURL) {
            navigate('ImageView', {
              urls: [{ url: user.photoURL }],
              showShare: false,
            });
          }
        }}
      >
        <Avatar.Image {...props} source={URL || { uri: user?.photoURL }} />
      </TouchableWithoutFeedback>
    ) : (
      <Avatar.Text label={user?.displayName} {...props} />
    );

  const UploadPhoto = async () => {
    var img = await launchImageLibrary();
    if (!img.assets) {
      return;
    }
    ToastAndroid.show('Uploading...', 1000);
    var image = img.assets[0];
    var path = `uploads/${_auth.currentUser.uid}/${image.fileName}`;
    var reference = storage().ref(path);
    var _url = await reference.putFile(image.uri);
    if (_url.state == 'success') {
      var url = await reference.getDownloadURL();
      setImage(image);
      await (await getProfileRef()).child('photo').set(url);
      await _auth.currentUser.updateProfile({ photoURL: url });
    }
  };

  // const renderDropdown = ({item}) => {
  //   console.log(item);
  //   return <View>
  //     <Text>{item?.name}</Text>
  //   </View>
  // }

  return (
    <>
      <View style={styles.view}>
        <View style={styles.icon}>
          <AvatarIcon size={80} style={{ marginBottom: 15 }} />
          {CanEdit && (
            <Button onPress={() => UploadPhoto(setImage)}>
              <Text>Upload Photo</Text>
            </Button>
          )}
        </View>
        <TextInput
          label={'Name'}
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          mode="outlined"
          disabled={!CanEdit}
        />
        <TextInput
          label={'Bio'}
          style={styles.input}
          placeholder={!bio ? 'Add Bio' : ''}
          value={bio}
          onChangeText={(text) => setBio(text)}
          mode="outlined"
          disabled={!CanEdit}
        />
        {!CanEdit && (
          <>
            {user?.email && (
              <TextInput
                style={styles.input}
                mode="outlined"
                disabled
                value={user?.email}
                label="Email"
              />
            )}

            {user?.phoneNumber && (
              <TextInput
                style={styles.input}
                mode="outlined"
                disabled
                value={user?.phoneNumber}
                label="Phone No."
              />
            )}
          </>
        )}
        {country && !CanEdit ? (
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{
                uri: `https://flagcdn.com/108x81/${country?.toLowerCase()}.png`,
              }}
              style={{ width: 50, height: 20, marginTop: 12 }}
              resizeMode="contain"
            />
            <TextInput
              label={'Country'}
              mode="outlined"
              disabled={!CanEdit}
              value={mmkv.getString('countryName')}
              style={{ minWidth: '87%' }}
            />
          </View>
        ) : <>
          <Dropdown style={{
            marginVertical: 8,
            borderWidth: 0.5,
            paddingVertical: 4,
            paddingLeft: 8,
            borderColor: colors.onBackground,
            borderRadius: 5
            
          }} data={countries} labelField='name' valueField='alpha2Code' value={Country || country}
          inputSearchStyle={{color: colors.onBackground, backgroundColor: colors.inverseOnSurface,
          padding: 0, margin: 0, marginBottom: 0}}
          placeholder='Loading...'
          
            renderItem={item => {
              return <><List.Item style={{ backgroundColor: colors.background }} title={item.name}
              
                right={() => <Image source={{ uri: `https://flagcdn.com/108x81/${item.alpha2Code.toLowerCase()}.png` }}
                  style={{ height: 20, width: 30 }} resizeMode="contain" />} />
                <Divider />
              </>
            }}
            onChange={item => setCountry(item)} search />
        </>}
        <View
          style={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          {CanEdit && (
            <Button
              mode="outlined"
              style={{ marginRight: 10 }}
              onPress={async () => {
                setName(user?.displayName);
                setBio(await getBio());
                AllowEdit(false);
              }}
            >
              <Text>Cancel</Text>
            </Button>
          )}
          <Button
            mode="contained-tonal"
            onPress={async () => {
              if (CanEdit) {
                if (name != user?.displayName) {
                  await _auth.currentUser.updateProfile({ displayName: name });
                }
                if (bio !== (await getUserBio())) {
                  // Set User Bio
                  mmkv.set('userBio', bio);
                  await (await getProfileRef()).child('bio').set(bio);
                }
                if (Country && Country.alpha2Code != country) {
                  mmkv.set("countryCode", Country.alpha2Code);
                  mmkv.set("countryName", Country.name);
                  mmkv.set("countryData", JSON.stringify(Country));
                }
              }
              AllowEdit(!CanEdit);

            }}
          >
            {CanEdit ? 'Save' : 'Edit Profile'}
          </Button>
        </View>
      </View>
    </>
  );
}
