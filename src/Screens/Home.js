import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Share,
  Image,
  Linking,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { PopGame } from './Game/PopGame';
import Toast from 'react-native-toast-message';
import {
  Avatar,
  Banner,
  List,
  Card,
  IconButton,
  Menu,
  Text,
  useTheme,
  Modal,
  Portal,
  ProgressBar,
  FAB,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { _auth } from '../App';
import { API_URL } from '../_config';
import YoutubePlayer from 'react-native-youtube-iframe';
import { storage } from '../mmkv';
import { Accordion } from '../Components/Accordion';
import {
  getHourLapse,
  getTaskProgress,
  setOrGetScore,
  isInfluencer,
  getEvents,
  getRandom,
} from '../util';
import { EnviroTaskView } from './EnviroTask';
import { FlatList } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  view: {
    paddingVertical: 15,
    display: 'flex',
  },
  card: {
    flexDirection: 'row',
    borderRadius: 7,
    backgroundColor: '#c0ebd7',
    marginHorizontal: 10,
    marginBottom: 80,
  },
  facttitle: {
    fontSize: 20,
    fontFamily: 'Karma-Bold',
  },
  factview: {
    marginBottom: 12,
    marginTop: 15,
    paddingVertical: 8,
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 10,
  },
  fabopt: {
    bottom: 15,
    right: 10,
    position: 'absolute',
  },
  fab: {
    borderRadius: 50,
    marginVertical: 8,
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});

export function HomeScreen({ navigation }) {
  const influencer = isInfluencer();
  const { colors } = useTheme();
  const [data, setData] = useState();
  const [isExpand, setExpand] = useState(true);
  const [isVisible, ShowMenu] = useState(false);
  const [networkError, setNWError] = useState(false);
  const [prog, setProg] = useState(getTaskProgress());
  // Event Toggles.
  const [events, setEvents] = useState();
  const [showall, setshow] = useState(false);
  // influencer FAB
  const [isInExpand, setInExp] = useState(false);

  let playerRef = useRef();

  const ToggleMenu = () => {
    ShowMenu(!isVisible);
  };

  const setFromCache = () => {
    const feeds = storage.getString('cachedFeeds');
    if (!feeds) {
      return;
    }
    let getCache;
    try {
      getCache = JSON.parse(feeds);
    } catch (e) {
      console.error("Can't parse " + feeds);
    }
    console.debug('Loaded Feeds from Cache.');
    setData(getCache);
  };

  const Fetch = () => {
    async function GetData() {
      console.debug('Started fetching Feeds');

      // Fetch Events
      try {
        setEvents(await getEvents());
      } catch (e) {
        console.error(e);
      }

      // Fetch feeds
      let lastFetchTime = storage.getNumber('lastFetchFeeds');
      let timeGap = getHourLapse(lastFetchTime || 0);
      if (lastFetchTime && timeGap < 24 && storage.getString('cachedFeeds')) {
        console.debug(`timelapse: ${timeGap}`);
        setFromCache();
        return;
      }
      let day = storage.getNumber('dayStreak') || 0;
      let data_ = await fetch(`${API_URL}/feeds?day=${day}`);
      if (data_.headers.get('Content-Type').includes('application/json')) {
        let json = await data_.json();
        setData(json);
        console.debug('loaded feeds from network.');
        storage.set('dayStreak', parseInt(day) + 1);
        storage.set('lastFetchFeeds', Date.now());
        try {
          storage.set('cachedFeeds', JSON.stringify(json));
        } catch (e) {
          console.error('Error while saving feeds to DB.', e);
        }
      } else {
        ToastAndroid.show(
          'Error Occured while fetching feeds.',
          ToastAndroid.SHORT,
        );
        console.error('Invalid Data Type recieved from fetch request.');
      }
      if (networkError) {
        setNWError(null);
      }
    }
    GetData().catch((e) => {
      if (e.toString().includes('Network request failed')) {
        setNWError(true);
        return;
      }
      throw e;
    });
  };

  useEffect(() => {
    if (!storage.getBoolean('firstOpenDone')) {
      setTimeout(() => navigation.navigate('EnviroTask'), 8000);
      storage.set('firstOpenDone', true);
    }
    Fetch();
  }, []);

  useEffect(() => {
    setProg(getTaskProgress());
  });

  const _events = showall ? events : events?.slice(0, 1);

  const isYtVideo = data?.video && data?.video['@type'] == 'youtube';
  return (
    <>
      <ScrollView style={{ paddingHorizontal: 15, paddingVertical: 8 }}>
        <Banner
          style={{ borderRadius: 10, backgroundColor: colors.onSecondary }}
          visible={networkError}
          actions={[
            {
              label: 'Retry',
              onPress: Fetch,
            },
          ]}
          icon={() => <Icon name="alert" size={28} />}
        >
          <Text style={{ fontSize: 18, fontFamily: 'Roboto-Light' }}>
            No Internet Connection.
          </Text>
        </Banner>
        {/* <Button>
          Track your Carbon footprint
        </Button> */}
        {events?.length !== 0 && (
          <View style={{ marginBottom: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Roboto-Black',
                  marginLeft: 5,
                  marginVertical: 4,
                }}
              >
                Events
              </Text>
              {events?.length > 1 && (
                <FAB
                  label={showall ? 'View Less' : 'View More'}
                  mode="flat"
                  style={{
                    backgroundColor: colors.secondaryContainer,
                    justifySelf: 'flex-start',
                    alignSelf: 'flex-end',
                  }}
                  customSize={30}
                  icon={showall ? 'chevron-up-circle' : 'chevron-down-circle'}
                  onPress={() => setshow(!showall)}
                  size={30}
                />
              )}
            </View>

            {_events?.map((event, index) => (
              <Card
                key={index}
                style={{ marginBottom: 5, backgroundColor: colors.decent }}
                onPress={() => navigation.navigate('Event', { data: event })}
              >
                <Card.Title
                  title={event.title}
                  left={() => {
                    const imgs = Object.entries(event?.images).map((d) => d[1]);
                    if (imgs?.length > 0) {
                      return (
                        <Image source={{ uri: imgs[0] }} style={styles.thumb} />
                      );
                    }
                  }}
                  subtitle={event.short_description || event.description}
                />
                <Card.Actions>
                  {event.funding && <Button mode="outlined">Donate</Button>}
                </Card.Actions>
              </Card>
            ))}
          </View>
        )}

        {!storage.getBoolean('taskDone') && (
          <Card
            style={{ borderColor: colors.onSurface, borderWidth: 0.2 }}
            onPress={() => {
              if (prog !== 1) {
                navigation.navigate('EnviroTask');
              }
            }}
          >
            <Card.Title
              title={
                prog === 1
                  ? 'You completed all the Fest tasks.!'
                  : 'Complete Enviro fest.'
              }
              titleNumberOfLines={5}
              right={() => {
                if (prog === 1) {
                  return (
                    <Button
                      mode="outlined"
                      style={{ marginRight: 10 }}
                      onPress={() => navigation.navigate('Reward')}
                    >
                      Reward
                    </Button>
                  );
                }
              }}
            />
            {prog !== 1 && (
              <Card.Content>
                <ProgressBar progress={prog} color={colors.progress} />
              </Card.Content>
            )}
          </Card>
        )}
        {!data && !networkError && (
          <ActivityIndicator style={{ marginVertical: 8 }} size="large" />
        )}
        {/*data?.fact && (
          <View
            style={[
              styles.factview,
              {
                backgroundColor: colors.backapp,
              },
            ]}
          >
            <Text style={styles.facttitle}>Fact - {data.fact.title}</Text>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text
                selectable
                style={{
                  maxWidth: data.fact.image ? 250 : null,
                  fontFamily: 'Roboto-Light',
                }}
              >
                {data.fact.fact}
              </Text>
              {data.fact.image && (
                <Image
                  source={{ uri: data.fact.image }}
                  style={{ width: 40, height: 20 }}
                />
              )}
            </View>
            <Text style={{ color: colors.link, textAlign: 'right' }}>
              {data.fact.source}
            </Text>
          </View>
        )*/}
        {
          // THIS NEED A QUITE OF WORK.
          /*data?.story && (
          <Card
            style={{
              borderRadius: 5,
              flexDirection: 'row',
              paddingVertical: 8,
            }}
            elevation={4}
            onPress={() =>
              navigation.navigate('WebView', { url: data.story.url })
            }
          >
            <Card.Content>
              <Text style={{ maxWidth: '90%' }}>
                {data.story.title} {'\n'}
                By {data.story.author}
              </Text>
            </Card.Content>
            {data.story.thumb && (
              <Image
                source={{ uri: data.story.thumb }}
                style={{
                  height: '100%',
                  position: 'absolute',
                  right: 0,
                  width: 80,
                }}
                resizeMode="contain"
              />
            )}
          </Card>
              )*/
        }
        {isYtVideo && (
          <Accordion
            title={data.video.title}
            expanded={isExpand}
            onPress={() => {
              setExpand(!isExpand);
              //            if (!isExpand) {
              //              setPlay(false);}
            }}
            containerStyle={{
              borderRadius: isExpand ? 0 : 8,
              marginVertical: 10,
              marginBottom: 40,
              borderWidth: isExpand ? 0.2 : 1,
              borderColor: 'teal',
              pointerEvents: 'none',
            }}
            titleStyle={{
              fontSize: 15,
              color: colors.onPrimary,
            }}
            showChevron={false}
            right={
              <Menu
                anchor={
                  <IconButton
                    icon="dots-horizontal-circle"
                    onPress={ToggleMenu}
                  />
                }
                visible={isVisible}
                onDismiss={ToggleMenu}
              >
                <Menu.Item
                  title="View Timeline"
                  leadingIcon={'lightning-bolt'}
                  onPress={() => {
                    ToggleMenu();
                    navigation.navigate('Timeline');
                  }}
                />
                <Menu.Item
                  title="Copy URL"
                  leadingIcon={'content-copy'}
                  onPress={() => {
                    Clipboard.setString(
                      'https://youtube.com/v/' + data.video.url,
                    );
                    ToastAndroid.show('Copied!', ToastAndroid.SHORT);
                    ToggleMenu();
                  }}
                />
              </Menu>
            }
          >
            <YoutubePlayer
              ref={playerRef}
              videoId={data.video.url}
              height={205}
              //  play={play}
              webViewProps={{
                incognito: true,
              }}
              webViewStyle={{ opacity: 0.99 }}
              initialPlayerParams={{
                color: 'white',
              }}
              onChangeState={async (e) => {
                if (e === 'ended' && !storage.getBoolean('taskVideoDone')) {
                  Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'Congrats!',
                    text2: "You completed the fest's video Task.",
                  });
                  storage.set('taskVideoDone', true);
                  await setOrGetScore(20);
                  setProg(getTaskProgress());
                }
              }}
            />
          </Accordion>
        )}
      </ScrollView>
      {influencer && (
        <>
          <View style={[styles.fabopt, { alignItems: 'flex-end' }]}>
            {isInExpand && (
              <>
                {storage.getBoolean('hasPublished') && (
                  <FAB
                    icon={'eye'}
                    style={styles.fab}
                    label="Check"
                    onPress={() => navigation.navigate('EventList')}
                  />
                )}
                <FAB
                  icon={'pencil-outline'}
                  style={styles.fab}
                  label="Publish"
                  onPress={() => navigation.navigate('publishEvent')}
                />
              </>
            )}
            <FAB
              style={styles.fab}
              icon={isInExpand ? 'chevron-down' : 'menu'}
              variant="surface"
              onPress={() => setInExp(!isInExpand)}
            />
          </View>
        </>
      )}
    </>
  );
}
