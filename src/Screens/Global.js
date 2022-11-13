import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  ToastAndroid,
  Pressable,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import {
  IconButton,
  Text,
  TextInput,
  Portal,
  Modal,
  List,
  Button,
  AnimatedFAB,
  Menu,
  Divider,
  Card,
  Appbar,
  Avatar,
  Chip,
  useTheme,
  FAB,
} from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import database from '@react-native-firebase/database';
import { storage } from '../mmkv';
import { getRandom, getUser } from '../util';
import { _auth } from '../App';
import { TouchableHighlight } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Clipboard from '@react-native-clipboard/clipboard';

const DocumentPicker = require('react-native-document-picker');

const styles = StyleSheet.create({
  view: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
  messageview: {
    width: '100%',
    marginHorizontal: 10,
    paddingVertical: 4,
    marginVertical: 8,
  },
  bubble: {
    marginLeft: 8,
    padding: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: '20%',
    maxWidth: '90%',
  },
  bubbleText: {
    fontFamily: 'Roboto-Light',
    fontSize: 18,
  },
  document: {
    borderRadius: 10,
    flexDirection: 'row',
    width: '90%',
    backgroundColor: 'ghostwhite',
    marginBottom: 5,
  },
  listitem: {
    height: 60,
    borderWidth: 0.8,
    borderColor: 'black',
  },
  fab: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderRadius: 20,
  },
});

// TODO: Bottom Sheet View

async function getMessagesRef() {
  const country = storage.getString('countryCode');
  return database().ref(`messages/${country}`);
}

const getMessages = async () => {
  let ref = await getMessagesRef();
  let value = (await ref.orderByKey().limitToLast(500).once('value')).val();
  if (!value) {
    return;
  }
  let data = Object.entries(value);
  let newlist = [];
  for (var i = 0; i < data.length; i++) {
    let ndata = { ...data[i][1] };
    ndata.hash = data[i][0];
    ndata.senderUser = await getUser(ndata.sender);
    newlist.push(ndata);
  }
  return newlist;
};

const AvatarIcon = (props) => {
  let user = props.user;
  return user?.photo ? (
    <Avatar.Image source={{ uri: user?.photo }} {...props} />
  ) : (
    <Avatar.Text label={user?.name} {...props} />
  );
};

export function GlobalScreen({ navigation }) {
  const appBarHeight = 65;
  const countryCode = storage.getString('countryCode')?.toLowerCase();
  const country = storage.getString('countryName');

  const { colors } = useTheme();
  const [data, setData] = useState();
  const [selected, setSelected] = useState();
  const selfUserId = storage.getString('userHash');
  const [scrollmode, setScrollMode] = useState(false);

  const selectedisSelf = selected && selected.sender === selfUserId;

  useEffect(() => {
    getMessages().then((d) => setData(d));
    getMessagesRef().then((d) => {
      d.on('value', async (dt) => {
        let data = await getMessages();
        setData(data);
      });
    });
  }, []);

  const renderMessages = ({ item }) => {
    let bubbleColor = getRandom(colors.messagebubble);

    const isSelf = selfUserId === item.sender;

    return (
      <Pressable
        onPress={() => {
          setSelected(item);
        }}
      >
        <View
          style={[
            styles.messageview,
            {
              backgroundColor:
                selected?.hash == item.hash ? colors.backdrop : null,
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: isSelf ? 'flex-end' : null,
              marginRight: isSelf ? 20 : 0,
            }}
          >
            {!isSelf && (
              <Pressable
                onPress={() =>
                  navigation.navigate('userProfile', { user: item.sender })
                }
              >
                <AvatarIcon user={item.senderUser} size={32} />
              </Pressable>
            )}
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: isSelf
                    ? colors.backapp
                    : colors.secondaryContainer,
                  borderTopRightRadius: isSelf ? 0 : undefined,
                  borderTopLeftRadius: !isSelf ? 0 : undefined,
                },
              ]}
            >
              <Text style={{ color: bubbleColor }}>
                {isSelf ? 'you' : item.senderUser?.name}
              </Text>
              {item.image && (
                <Pressable
                  onPress={() =>
                    navigation.navigate('ImageView', {
                      urls: [{ url: item.image }],
                      showShare: false,
                    })
                  }
                >
                  <AutoHeightImage
                    width={200}
                    source={{ uri: item.image }}
                    style={{ maxHeight: 350, marginTop: 8 }}
                    resizeMode="contain"
                  />
                </Pressable>
              )}
              {item.message && (
                <Text
                  style={[
                    styles.bubbleText,
                    {
                      color: colors.onSurfaceVariant,
                      maxWidth: 280,
                    },
                  ]}
                >
                  {item.message}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const flatlist = createRef();
  const imageBg = storage.getString('chatBG');
  const background = imageBg
    ? { uri: imageBg }
    : require('../../assets/chatBG.webp');

  return (
    <>
      <ImageBackground
        source={background}
        style={{
          height: '100%',
        }}
        imageStyle={{ opacity: imageBg ? 1 : 0.1 }}
      >
        <>
          <FlatList
            ref={flatlist}
            onScroll={(e) => {
              setScrollMode(e.nativeEvent.contentOffset.y > appBarHeight + 10);
            }}
            ListHeaderComponentStyle={{ maxHeight: '90%' }}
            ListHeaderComponent={
              <>
                <Appbar
                  style={{
                    backgroundColor: colors.background,
                    elevation: 5,
                    height: appBarHeight,
                  }}
                >
                  <Image
                    source={{
                      uri: `https://flagcdn.com/108x81/${countryCode}.png`,
                    }}
                    style={{ width: 50, height: 20, marginLeft: 8 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 25,
                      marginLeft: 2,
                      fontFamily: 'Roboto-Light',
                    }}
                  >{`#${country}`}</Text>
                </Appbar>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 15,
                  }}
                >
                  <Button
                    mode="contained-tonal"
                    onPress={() => navigation.navigate('CreatePost')}
                  >
                    Post message.
                  </Button>
                </View>
              </>
            }
            data={data}
            renderItem={(props) => renderMessages({ ...props })}
          />
          <Portal>
            <Modal
              visible={selected}
              style={{ justifyContent: 'flex-end' }}
              dismissable
              onDismiss={() => setSelected(null)}
            >
              <View style={{ backgroundColor: colors.secondary }}>
                {selected?.message && (
                  <List.Item
                    style={styles.listitem}
                    title="Copy text"
                    left={() => (
                      <Icon
                        name="content-copy"
                        size={25}
                        style={{ marginLeft: 10 }}
                      />
                    )}
                    onPress={() => {
                      Clipboard.setString(selected.message);
                      ToastAndroid.show('Copied', ToastAndroid.SHORT);
                      setSelected(null);
                    }}
                  />
                )}
                {selectedisSelf ? (
                  <List.Item
                    style={styles.listitem}
                    title="Delete"
                    left={() => (
                      <Icon
                        name="delete"
                        color="red"
                        size={25}
                        style={{ marginTop: 5, marginLeft: 10 }}
                      />
                    )}
                    onPress={async () => {
                      if (!selected) {
                        return;
                      }
                      let ref = await getMessagesRef();
                      ref.child(selected.hash).remove();
                      ToastAndroid.show('Deleting', ToastAndroid.SHORT);
                      setSelected(null);
                    }}
                  />
                ) : (
                  <List.Item
                    title="Report"
                    left={() => (
                      <Icon
                        name="alert"
                        color={colors.inverseSurface}
                        size={25}
                        style={{ marginTop: 5, marginLeft: 10 }}
                      />
                    )}
                  />
                )}
              </View>
            </Modal>
          </Portal>
          <FAB
            visible={scrollmode}
            style={[
              styles.fab,
              {
                backgroundColor: colors.primary,
              },
            ]}
            icon={'chevron-up'}
            size={40}
            color={colors.primaryContainer}
            onPress={() => {
              flatlist.current.scrollToOffset({ animated: true, offset: 0 });
            }}
          />
        </>
      </ImageBackground>
    </>
  );
}

export function CreatePost({ navigation }) {
  const selfUserId = storage.getString('userHash');

  const [text, setText] = useState();
  const [image, setImage] = useState('');
  const [document, setDocument] = useState();
  const [showMenu, MenuVisible] = useState(false);
  var img = image && image.assets ? image.assets[0] : image;

  const ToggleMenu = () => MenuVisible(!showMenu);

  const ChooseImage = async () => {
    ToggleMenu();
    await launchImageLibrary({}, setImage);
  };
  const CameraClick = async () => {
    await launchCamera({}, setImage);
  };
  const PickDocument = async () => {
    var document = await DocumentPicker.pickMultiple();
    if (document) {
      setDocument(document);
    }
  };

  return (
    <View style={styles.view}>
      {img && (
        <>
          <ImageBackground
            source={img}
            style={{
              maxWidth: '90%',
              maxHeight: '40%',
              minHeight: 200,
              minWidth: 500,
              marginTop: 25,
            }}
            resizeMode="contain"
          />
          <Pressable
            onPress={() => setImage(null)}
            style={{ position: 'absolute', right: 10, top: 15 }}
          >
            <Entypo name="squared-cross" size={35} />
          </Pressable>
        </>
      )}
      {document &&
        document.map((doc) => {
          return (
            <Card
              key={document.indexOf(doc)}
              style={styles.document}
              onPress={() => {
                Linking.openURL(doc.uri);
              }}
            >
              <Card.Content
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingHorizontal: 7,
                }}
              >
                <Icon name="file" size={28} />
                <Text style={{ marginLeft: 7, marginTop: 5, maxWidth: '80%' }}>
                  {doc.name}
                </Text>
              </Card.Content>
            </Card>
          );
        })}
      <TextInput
        multiline
        placeholder="Create Post."
        style={{ width: '90%', marginTop: 8 }}
        mode="outlined"
        value={text}
        onImageChange={(e) => {
          setImage({ uri: e.nativeEvent.linkUri });
        }}
        onChangeText={setText}
      />
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <IconButton icon="camera-plus" onPress={CameraClick} />

        <Menu
          style={{ marginLeft: 12, marginTop: 28 }}
          contentStyle={{ borderRadius: 20 }}
          visible={showMenu}
          anchor={<IconButton icon="attachment" onPress={ToggleMenu} />}
          onDismiss={ToggleMenu}
        >
          <Menu.Item onPress={ChooseImage} icon="image" title="Image" />
          <Divider />
          {
            // <Menu.Item onPress={PickDocument} icon="file-document" title="File" />
          }
        </Menu>
        <IconButton
          icon="send"
          onPress={async () => {
            let imgUrl;
            if (!(img || text || document)) {
              return;
            } else if (img?.uri && !img.uri.startsWith('file://')) {
              imgUrl = img.uri;
            } else if (img) {
              console.debug('Uploading Image.');
              let data = await RNFetchBlob.fetch(
                'POST',
                'https://graph.org/upload',
                {
                  'Content-Type': 'application/octet-stream',
                },
                [
                  {
                    name: img.fileName,
                    filename: img.fileName,
                    data: RNFetchBlob.wrap(img.uri),
                  },
                ],
              );
              let jsondata = await data.json();
              if (jsondata.error) {
                ToastAndroid.show(jsondata.error, ToastAndroid.SHORT);
                return;
              }
              imgUrl = 'https://graph.org' + jsondata[0].src;
              /*
              form.append("file", fs.createReadStream(img.uri));
              var emg = await fetch("https://graph.org/upload", {
                method: "POST",
                body: form
              });
              var dta = await emg.json();
              return;
              let ref = fireupload().ref(
                `uploads/${_auth?.currentUser?.uid}/${img.fileName}`,
              );
              let _url = await ref.putFile(img.uri);
              if (_url.state == 'success') {
                imgUrl = await ref.getDownloadURL();
              }
              */
            }
            let timestamp = Date.now().toString();
            await (await getMessagesRef()).child(timestamp).set({
              message: text,
              sender: selfUserId,
              image: imgUrl,
            });
            if (imgUrl && !storage.getString('taskPostDone')) {
              Toast.show({
                text1: 'Congrats',
                text2: 'You completed the post task.',
                position: 'bottom',
              });
              storage.set('taskPostDone', true);
            }
            setImage(null);
            setText('');
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}
