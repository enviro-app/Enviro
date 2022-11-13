import { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Image,
  Pressable,
  ToastAndroid,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import { _auth } from '../App';
import {
  Button,
  Text,
  useTheme,
  FAB,
  Divider,
  Surface,
} from 'react-native-paper';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { storage } from '../mmkv';
import Lottie from 'lottie-react-native';

const styles = StyleSheet.create({
  view: {
    height: '70%',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  card: {
    elevation: 5,
    borderRadius: 20,
    flexGrow: 1,
  },
  name: {
    fontSize: 25,
    fontFamily: 'Roboto-Light',
    padding: 16,
  },
  photo: {
    height: 200,
    width: 200,
    marginTop: 100,
    alignSelf: 'center',
    borderRadius: 50,
    marginBottom: 20,
  },
  enviro: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
});

const colorsChoices = [
  ['#ff00cc', '#333399'],
  ['#a770ef', '#cf8bf3'],
  ['#42275a', '#734b6d'],
  ['#141e30', '#243b55'],
  ['#4ecdc4', '#556270'],
];

export function RewardView() {
  const { colors } = useTheme();

  const user = _auth.currentUser;
  const [index, setIndex] = useState(1);
  const [reward, showReward] = useState(storage.getBoolean('rewardOpen'));

  if (!reward) {
    const anim = useRef(new Animated.Value(0));
    Animated.timing(anim.current, {
      toValue: 1,
      duration: 2000,
      easing: Easing.bounce,
      useNativeDriver: false,
    }).start(() => {
      storage.set('rewardOpen', true);
      showReward(true);
    });
    return (
      <Surface
        style={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}
      >
        <Lottie
          progress={anim.current}
          source={{
            uri: 'https://assets8.lottiefiles.com/packages/lf20_elqubb3f.json',
          }}
          autoPlay
          loop
        />
      </Surface>
    );
  }

  const currentColor = colorsChoices[index];
  const viewRef = useRef();

  const child = (
    <>
      {user?.photoURL && (
        <View style={{ height: '65%' }}>
          <Image style={styles.photo} source={{ uri: user.photoURL }} />
        </View>
      )}
      <View
        style={{
          height: '35%',
          backgroundColor: colors.background,
          borderBottomEndRadius: 20,
          borderBottomStartRadius: 20,
          opacity: 0.8,
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.name}>
          {user?.displayName} {'\n'}
          <Text style={{ fontSize: 18 }}>has completed all Enviro tasks.</Text>
        </Text>
        <View style={[styles.enviro]}>
          <Image
            source={require('../../assets/icon.webp')}
            style={{ height: 50, width: 50 }}
          />
          <Text
            style={{
              fontFamily: 'Roboto-Light',
              fontSize: 20,
              textAlignVertical: 'center',
            }}
          >
            Enviro
          </Text>
        </View>
      </View>
    </>
  );

  const renderColor = ({ item, index }) => (
    <Pressable onPress={() => setIndex(index)}>
      <LinearGradient
        colors={item}
        style={{ height: 80, width: 80, marginHorizontal: 7, borderRadius: 20 }}
      />
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.view}>
        {typeof currentColor === 'object' ? (
          <LinearGradient
            ref={viewRef}
            style={styles.card}
            colors={currentColor}
          >
            {child}
          </LinearGradient>
        ) : (
          <View
            ref={viewRef}
            style={[
              styles.card,
              {
                backgroundColor: currentColor,
              },
            ]}
          >
            {child}
          </View>
        )}
      </View>
      <FlatList
        style={{ marginTop: 15, marginHorizontal: 12 }}
        data={colorsChoices}
        horizontal
        renderItem={renderColor}
      />
      <FAB
        icon={'download'}
        style={{ right: 15, bottom: 10, position: 'absolute' }}
        onPress={async () => {
          let img = await captureRef(viewRef);
          CameraRoll.save(img);
          ToastAndroid.show('Saved to Gallery!', ToastAndroid.SHORT);
        }}
      />
    </ScrollView>
  );
}
