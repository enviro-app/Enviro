import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Linking,
  ToastAndroid,
} from 'react-native';
import {
  TextInput,
  Text,
  Button,
  List,
  Checkbox,
  useTheme,
  Divider,
  Chip,
} from 'react-native-paper';
import fireupload from '@react-native-firebase/storage';

import { Dropdown } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';
import { FlatList } from 'react-native-gesture-handler';
import { storage } from '../../mmkv';
import Toast from 'react-native-toast-message';
import database from '@react-native-firebase/database';
import { sub } from 'react-native-reanimated';

const firebase = database();

const styles = StyleSheet.create({
  view: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 25,
    paddingVertical: 10,
  },
  desc: {
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    //        justifyContent:"center"
  },
  drop: {
    borderColor: 'black',
    borderWidth: 0.5,
    marginVertical: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tval: {
    marginLeft: 10,
    minWidth: 80,
    fontSize: 15,
    height: 35,
  },
  dlabel: {
    fontSize: 20,
    fontFamily: 'Roboto-Light',
  },
  dval: { paddingHorizontal: 10, fontSize: 20 },
  image: {
    height: 80,
    width: 80,
    borderRadius: 15,
    borderWidth: 0.5,
    marginBottom: 10,
    marginHorizontal: 4,
  },
});

const DataType = [
  'Live Event',
  'Need fund for Nature Causes.',
  'Sharing Blog',
  'Other',
].map((d, index) => {
  return { label: d, index: index };
});

const uploadToFirebase = async (item) => {
  let ref = fireupload().ref(`publishuploads/${item.fileName}`);
  let file = await ref.putFile(item.uri);
  if (file.state === 'success') {
    return await ref.getDownloadURL();
  }
};

export function PublishEvent({ navigation }) {
  const { colors } = useTheme();
  const [title, setTitle] = useState();
  const [shortDesc, setShortDesc] = useState();
  const [description, setDesc] = useState();
  const [descError, setDescError] = useState();
  const [target, setTarget] = useState();
  const [loc, setLoc] = useState();

  const [imgs, setimgs] = useState();
  const [drop, setdrop] = useState();
  const [submiting, setsubmiting] = useState(false);

  const renderImage = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('ImageView', {
            urls: imgs.map((d) => {
              return { url: d.uri };
            }),
            showShare: false,
            index: index,
          });
        }}
      >
        <Image
          source={item}
          style={[styles.image, { borderColor: colors.surfaceVariant }]}
        />
      </Pressable>
    );
  };

  const renderDropDown = (item) => {
    return (
      <View style={{ padding: 10, backgroundColor: colors.background }}>
        <Text style={[styles.dlabel]}>{item?.label}</Text>
        <Divider />
      </View>
    );
  };

  const Publish = async () => {
    setsubmiting(true);
    const self = storage.getString('userHash');
    const key = Date.now().toString();
    let Ref = firebase.ref('publish').child(key);
    await Ref.set({
      title: title,
      description: description,
      short_description: shortDesc,
      location: loc,
      funding: drop === 1 ? { target: target } : null,
      author: self,
      status: 'pending',
    });

    if (imgs) {
      imgs.map(async (img) => {
        try {
          await Ref.child('images').push(await uploadToFirebase(img));
        } catch (e) {
          ToastAndroid.show(e.message, ToastAndroid.SHORT);
          console.error(e);
        }
      });
    }
    let ref = firebase.ref('userposts').child(self);
    let previous = (await ref.once('value')).val();
    let ndata = previous ? previous + `_${key}` : key;
    ref.set(ndata);

    Toast.show({
      type: 'custom',
      props: { text2Lines: 5 },
      text1: 'Submitted.',
      text2:
        'Your request is now under-review and will be available to other users after approval.',
      position: 'bottom',
    });
    if (!storage.getBoolean('hasPublished')) {
      storage.set('hasPublished', true);
    }
    navigation.goBack();
    setimgs(null);
    setTitle(null);
    setTarget(null);
    setDesc(null);
    setShortDesc(null);
    setdrop(null);
    setLoc(null);
    setsubmiting(false);
  };
  return (
    <ScrollView style={styles.view}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.title}
        disabled={submiting}
        mode="outlined"
        placeholder={'Title'}
      />
      <TextInput
        value={shortDesc}
        mode="outlined"
        disabled={submiting}
        placeholder="Short description (opt)."
        onChangeText={setShortDesc}
        style={styles.desc}
      />
      <TextInput
        value={description}
        onChangeText={(text) => {
          setDesc(text);
          if (descError) {
            setDescError(null);
          }
        }}
        style={styles.desc}
        mode="outlined"
        label={'Description'}
        disabled={submiting}
        error={descError}
        multiline
        numberOfLines={3}
      />
      <TextInput
        label={'Location'}
        mode="outlined"
        style={styles.desc}
        value={loc}
        onChangeText={setLoc}
      />
      {descError && <Text style={{ color: colors.error }}>{descError}</Text>}
      <Dropdown
        style={styles.drop}
        placeholder="Choose Type."
        data={DataType}
        disable={submiting}
        labelField="label"
        valueField="index"
        selectedTextStyle={[styles.dval, { color: colors.primary }]}
        placeholderStyle={[styles.dval, { color: colors.primary }]}
        onChange={(item) => {
          setdrop(item.index);
        }}
        renderItem={renderDropDown}
      />

      {drop === 1 && (
        <List.Item
          title="Target Value:"
          right={() => (
            <TextInput
              style={styles.tval}
              keyboardType="number-pad"
              mode="outlined"
              value={target}
              onChangeText={setTarget}
            />
          )}
        />
      )}
      <FlatList horizontal data={imgs} renderItem={renderImage} />
      <Button
        mode="outlined"
        style={{ alignSelf: 'flex-start' }}
        disabled={submiting}
        onPress={async () => {
          if (imgs) {
            setimgs(null);
            return;
          }
          let images = await launchImageLibrary({ selectionLimit: 10 });
          if (!images.assets) {
            return;
          }
          setimgs(images.assets);
        }}
      >
        {imgs ? 'Reset' : 'Add Images'}
      </Button>
      <Button
        style={[styles.desc, { alignSelf: 'center', marginBottom: 150 }]}
        mode="contained-tonal"
        loading={submiting}
        onPress={async () => {
          if (!title) {
            ToastAndroid.show("Title can't be empty.", ToastAndroid.SHORT);
            return;
          }
          if (!description || description.length < 120) {
            setDescError('Description should be minimum of 120 characters.');
            return;
          }
          await Publish();
        }}
      >
        Submit
      </Button>
    </ScrollView>
  );
}
