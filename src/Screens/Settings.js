import {
  DevSettings,
  Platform,
  SectionList,
  View,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  ToastAndroid,
} from 'react-native';
import {
  Button,
  Text,
  Dialog,
  Portal,
  Paragraph,
  Card,
  Modal,
  List,
  Checkbox,
  Switch,
  useTheme,
} from 'react-native-paper';
import { useEffect, useState } from 'react';
import RNRestart from 'react-native-restart';
import { storage } from '../mmkv';
import { launchImageLibrary } from 'react-native-image-picker';
import { version } from '../../package.json';
import { API_URL } from '../_config';
import { _auth } from '../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function LogOut(navigation) {
  _auth.signOut();
  storage.clearAll();
  RNRestart.Restart();
}

const styles = StyleSheet.create({
  chatbg: {
    height: 80,
    width: 80,
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    paddingTop: 20,
    fontFamily: 'Karma-Bold',
  },
  devopt: {
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 20,
  },
});

async function fetchUpdate() {
  let req = await fetch(API_URL);
  return await req.json();
}

const TogglableCheckBox = (check, setCheck, key, _switch) => () => {
  const onPress = () => {
    setCheck(!check);
    storage.set(key, !storage.getBoolean(key));
  };

  if (_switch) {
    return <Switch value={check} onValueChange={onPress} />;
  }
  return (
    <Checkbox status={check ? 'checked' : 'unchecked'} onPress={onPress} />
  );
};

export function Settings({ navigation }, props) {
  const { colors } = useTheme();

  const [hidden, showHidden] = useState(false);
  const [visible, setVisible] = useState(false);
  const hide = () => setVisible(false);

  const [openInBrowser, setOpenInBrowser] = useState(
    storage.getBoolean('ResultExternalB'),
  );
  const [startanim, disableStart] = useState(
    storage.getBoolean('disableStart'),
  );
  const [gallery, disablegallery] = useState(
    !storage.getBoolean('disableGallery'),
  );
  const [games, disablegames] = useState(!storage.getBoolean('disableGames'));

  const [customBg, setBg] = useState(storage.getString('chatBG'));
  const [update, setUpdate] = useState();

  const getTitle = () => {
    if (update) {
      if (update.version !== version) {
        return 'Update Available.';
      }
      return 'No Updates Available.';
    }
    return 'Check for Updates.';
  };

  useEffect(() => {
    fetchUpdate()
      .catch((e) => {
        if (e.message.includes('Network request failed')) {
          Toast.show({
            text1: 'No Internet Connection.',
            text2: "Can't check for updates.",
            type: 'error',
          });
        } else {
          console.error(e);
        }
      })
      .then(setUpdate);
  }, []);

  const _Icon = (name) => () => <Icon name={name} size={28} />;

  return (
    <ScrollView style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
      <Card onPress={() => navigation.navigate('Preference')}>
        <Card.Title title="Change Preferences." titleStyle={styles.title} />
      </Card>
      <Card style={{ marginVertical: 10 }}>
        <Card.Title title="Tab Buttons." titleStyle={styles.title} />
        <Card.Content>
          <List.Item
            title="Gallery"
            left={_Icon('image')}
            right={TogglableCheckBox(
              gallery,
              disablegallery,
              'disableGallery',
              true,
            )}
          />
          <List.Item
            title="Games"
            left={_Icon('gamepad-variant')}
            right={TogglableCheckBox(games, disablegames, 'disableGames', true)}
          />
        </Card.Content>
      </Card>
      <Card style={{ marginVertical: 10 }}>
        <List.Item
          title="Open search results in external browser."
          titleNumberOfLines={2}
          right={TogglableCheckBox(
            openInBrowser,
            setOpenInBrowser,
            'ResultExternalB',
          )}
        />
        <List.Item
          title="Disable start animation."
          right={TogglableCheckBox(startanim, disableStart, 'disableStart')}
        />
      </Card>
      <Card>
        <Card.Title title="Chat Background" titleStyle={styles.title} />
        <Card.Content>
          <ScrollView horizontal>
            {customBg && (
              <Image
                source={{ uri: customBg }}
                style={[
                  styles.chatbg,
                  {
                    borderColor: 'blue',
                    borderWidth: 0.8,
                  },
                ]}
              />
            )}
            <Pressable
              onPress={() => {
                storage.delete('chatBG'), setBg(null);
              }}
            >
              <Image
                source={require('../../assets/chatBG.webp')}
                style={[
                  styles.chatbg,
                  {
                    borderColor: !customBg ? 'blue' : undefined,
                    marginLeft: customBg ? 8 : 0,
                    borderWidth: 0.8,
                  },
                ]}
              />
            </Pressable>
            <Button
              style={{ marginVertical: 15 }}
              onPress={async () => {
                let images = await launchImageLibrary();
                if (!images.assets) {
                  return;
                }
                let path = images.assets[0].uri;
                setBg(path);
                storage.set('chatBG', path);
              }}
            >
              Choose
            </Button>
          </ScrollView>
        </Card.Content>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Card.Title title={getTitle()} subtitle={update?.version} />
      </Card>
      <Button
        mode="outlined"
        style={{
          borderColor: colors.error,
          borderWidth: 2,
          marginTop: 25,
        }}
        textColor={colors.error}
        onPress={() => setVisible(true)}
      >
        Logout
      </Button>
      <Text
        style={{ textAlign: 'center', marginTop: 8, marginBottom: 140 }}
        onLongPress={() => showHidden(!hidden)}
      >
        Version: {version}
      </Text>
      <Portal>
        <Dialog visible={visible} onDismiss={hide}>
          <Dialog.Content>
            <Paragraph>Are you sure, you want to logout?</Paragraph>
            <Text style={{ color: colors.error }}>
              <Dialog.Icon color={colors.error} icon={'alert'} size={15} />{' '}
              WARNING: {'\n'}
              Logging out will clear your task progress and local settings.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hide}>Cancel</Button>
            <Button onPress={async () => await LogOut(navigation)}>
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Modal
          visible={hidden}
          dismissable
          onDismiss={() => showHidden(!hidden)}
        >
          <View
            style={[
              styles.devopt,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <List.Item
              title="Clear Cache"
              onPress={() => {
                storage.clearAll();
                ToastAndroid.show('Cleared!', ToastAndroid.SHORT);
                showHidden(!hidden);
                RNRestart.Restart();
              }}
            />
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}
