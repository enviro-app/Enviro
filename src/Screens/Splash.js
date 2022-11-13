import React from 'react';
import Lottie from 'lottie-react-native';
import { StyleSheet, Animated, Easing, View } from 'react-native';
import { storage } from '../mmkv';
import { Text } from 'react-native-paper';

const styles = StyleSheet.create({
  start: {
    color: 'green',
    backgroundColor: 'lightgreen',
    padding: 20,
    borderRadius: 10,
    fontSize: 20,
    fontFamily: 'Roboto-Light',
  },
});

export function SplashScreen({ navigation }) {
  const animationProgress = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      if (!storage.getString('preferredData')) {
        navigation.replace('Preference');
        return;
      }
      navigation.replace('Home');
    });
  }, []);

  return (
    <>
      <View
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <Lottie
          source={require('../../assets/start_tree.json')}
          progress={animationProgress.current}
          speed={0.7}
        />
        <Text style={styles.start}>Enviro</Text>
      </View>
    </>
  );
}
