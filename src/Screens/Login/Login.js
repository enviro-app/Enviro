import auth from '@react-native-firebase/auth';
import React, { useReducer, useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  ScrollView,
  Easing,
  Alert,
} from 'react-native';
import Lottie from 'lottie-react-native';
import {
  Card,
  Button,
  IconButton,
  Divider,
  Text,
  FAB,
  TextInput,
  useTheme,
  Portal,
  Modal,
  ActivityIndicator,
} from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEBCLIENT_ID } from '../../_config';
import {
  Swipeable,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { _auth } from '../../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PagerView from 'react-native-pager-view';
import Toast from 'react-native-toast-message';

GoogleSignin.configure({ webClientId: WEBCLIENT_ID, offlineAccess: false });

const styles = StyleSheet.create({
  header: {
    fontSize: 80,
    color: '#8CCFB9',
    fontFamily: 'Roboto-Light',
  },
  view: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#e7f4ed',
    flexGrow: 1,
  },
  centerview: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  head: {
    fontSize: 20,
  },
  tagline: {
    fontSize: 20,
    fontFamily: 'Roboto-Light',
  },
  mini: {
    height: 50,
    width: 50,
  },
  main: {
    marginTop: '5%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: 'whitesmoke',
  },
  button: {
    marginTop: 15,
    padding: 5,
  },
  logincard: {
    maxHeight: '50%',
    backgroundColor: 'whitesmoke',
    marginTop: 30,
    width: '80%',
    padding: 5,
    marginBottom: 80,
  },
  skipbut: {
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  input: {
    borderRadius: 8,
    marginBottom: 5,
    fontSize: 15,
  },
  title: {
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 20,
  },
  labelError: {
    color: 'red',
    marginLeft: 8,
  },
  icon: {
    alignSelf: 'center',
  },
  startcard: {
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 15,
  },
});

const CustomToast = ({ text, time, error }, props) =>
  Toast.show({
    ...props,
    position: 'bottom',
    visibilityTime: time || 8000,
    text1: text,
    type: 'custom',
    props: {
      text1Lines: 10,
      text2Lines: 10,
      style: { borderLeftColor: error ? '#FE6301' : undefined },
    },
  });

const EnvHeader = (
  <View
    style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}
  >
    <Text style={styles.header}>Enviro</Text>
    <Image source={{ uri: 'asset:/icon.webp' }} />
  </View>
);

export function LoginStartScreen({ navigation }) {
  const { colors } = useTheme();
  let lottieanim = useRef(new Animated.Value(0));
  let anim = useRef(new Animated.Value(0));

  let pager = useRef(null);

  Animated.loop(
    Animated.timing(lottieanim.current, {
      toValue: 1,
      duration: 3000,
      easing: Easing.bounce,
      useNativeDriver: false,
    }),
    {
      iterations: 5,
    },
  ).start();

  Animated.timing(anim.current, {
    toValue: 20,
    duration: 220,
    useNativeDriver: false,
  }).start();

  return (
    <PagerView style={{ flexGrow: 1 }} ref={pager}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Animated.View
          style={{
            marginVertical: 20,
            borderRadius: 10,
            padding: 8,
            transform: [
              {
                translateX: anim.current,
              },
            ],
          }}
        >
          <Text style={[styles.header]}>Enviro</Text>
          <Text style={[styles.tagline, { marginLeft: 8 }]}>
            A better way to connect with nature.
          </Text>
        </Animated.View>
        <Lottie
          style={{ width: 300, height: 300, alignSelf: 'center' }}
          progress={lottieanim.current}
          source={{
            uri: 'https://assets6.lottiefiles.com/packages/lf20_yr9es9la.json',
          }}
          loop
          autoPlay
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: 10,
          }}
        >
          <FAB
            customSize={70}
            icon="arrow-right"
            style={[
              { backgroundColor: colors.surfaceVariant, borderRadius: 40 },
            ]}
            onPress={() => pager.current.setPage(1)}
          />
        </View>
      </ScrollView>
      <ScrollView
        style={{ paddingVertical: 10, flexGrow: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <Text
          style={[
            styles.header,
            { textAlign: 'center', fontSize: 34, marginBottom: 50 },
          ]}
        >
          Enviro <Image source={require('../../../assets/icon.webp')} />
        </Text>
        <Card style={styles.startcard}>
          <Card.Title
            title="Generate funds for your climate contributions."
            titleNumberOfLines={2}
            left={() => (
              <Image
                source={{
                  uri: 'https://img.icons8.com/external-wanicon-flat-wanicon/64/null/external-funds-stock-market-wanicon-flat-wanicon.png',
                }}
                style={styles.mini}
              />
            )}
          />
        </Card>
        <Card style={styles.startcard}>
          <Card.Title
            left={() => (
              <Image
                source={{ uri: 'https://img.icons8.com/nolan/64/share-2.png' }}
                style={styles.mini}
              />
            )}
            title="Empowering Nature Activists and Explorers."
            titleNumberOfLines={5}
            subtitle="Enviro can connect you to the people easily."
            subtitleNumberOfLines={5}
          />
        </Card>
        <Card style={styles.startcard}>
          <Card.Title
            left={() => (
              <Image
                source={{
                  uri: 'https://img.icons8.com/color-glass/48/null/search--v1.png',
                }}
                style={styles.mini}
              />
            )}
            title="Make your Search Easy."
            subtitleNumberOfLines={5}
            subtitle="Enviro comes with the collection of nature related topic, blogs, etc."
          />
        </Card>
        <Card style={[styles.startcard, { marginBottom: 50 }]}>
          <Card.Title
            left={() => (
              <Image
                source={{
                  uri: 'https://img.icons8.com/external-flatart-icons-flat-flatarticons/84/000000/external-achievement-achievements-and-badges-flatart-icons-flat-flatarticons-1.png',
                }}
                style={styles.mini}
              />
            )}
            title="Local LeaderBoards."
            subtitle="Complete the tasks and get Ranked!"
            subtitleNumberOfLines={5}
          />
        </Card>
        <Button
          mode="contained-tonal"
          style={{ paddingVertical: 4 }}
          onPress={() => navigation.navigate('Login')}
        >
          Continue
        </Button>
      </ScrollView>
    </PagerView>
  );
}

async function GoogleLogin() {
  const token = await GoogleSignin.signIn();
  const credential = auth.GoogleAuthProvider.credential(token.idToken);
  _auth.signInWithCredential(credential);
}

async function EmailLogin(email, password, navigation) {
  try {
    await _auth.signInWithEmailAndPassword(email, password);
    return;
  } catch (e) {
    if (e.toString().includes('auth/user-not-found')) {
      await _auth.createUserWithEmailAndPassword(email, password);
      console.debug('created new user.');
      return;
    }
    throw e;
  }
}

export function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const [pressed, setPressed] = useState();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState();
  const [phoneError, setPhoneError] = useState('');
  const [usePhone, setMode] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);

  const TogglePhoneCode = () => setPhoneModalVisible(!phoneModalVisible);

  return (
    <ScrollView
      style={[
        styles.view,
        { paddingHorizontal: 8, backgroundColor: colors.backgroundVariant },
      ]}
    >
      <Button
        disabled={pressed == 'anon'}
        loading={pressed == 'anon'}
        mode="text"
        style={styles.skipbut}
        onPress={() => {
          setPressed('anon');
          _auth.signInAnonymously();
          navigation.replace('AskName');
        }}
      >
        <Text style={{ ...styles.head, fontSize: 15 }}>Skip</Text>
      </Button>
      <View style={{ display: 'flex', marginTop: 30, flexGrow: 1 }}>
        <Card style={{ borderRadius: 8 }}>
          <Text style={styles.title}>Sign In</Text>
          <Card.Content>
            {usePhone ? (
              <>
                <TextInput
                  keyboardType="phone-pad"
                  placeholder="Enter Phone Number"
                  autoComplete="tel-country-code"
                  onChangeText={(phone) => setPhone(phone)}
                  value={phone}
                  error={phoneError}
                  mode="outlined"
                  style={{ borderRadius: 20 }}
                  maxLength={13}
                />
                {phoneError && (
                  <Text style={styles.labelError}>{phoneError}</Text>
                )}
              </>
            ) : (
              <>
                <TextInput
                  autoComplete="email"
                  placeholder="Enter Email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  error={emailError}
                />
                {emailError && (
                  <Text style={styles.labelError}>{emailError}</Text>
                )}
                <TextInput
                  autoComplete="password"
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureEntry}
                  right={
                    <TextInput.Icon
                      icon={secureEntry ? 'eye' : 'eye-off'}
                      onPress={() => setSecureEntry(!secureEntry)}
                    />
                  }
                  error={passwordError}
                  style={{ marginTop: 8 }}
                />
                {passwordError && (
                  <Text style={styles.labelError}>{passwordError}</Text>
                )}
              </>
            )}
            <Button
              onPress={async () => {
                // check if email login or phone login
                if (usePhone) {
                  if (!phone) {
                    setPhoneError("Phone Number can't be empty.");
                    return;
                  } else if (phone.length < 10) {
                    setPhoneError('Phone Number is Invalid.');
                    return;
                  }
                  navigation.navigate('verifyPhone', { phone: phone });
                  return;
                } else {
                  if (!email) {
                    setEmailError('Email be not empty.');
                    return;
                  } else if (emailError) {
                    setEmailError('');
                  }
                  if (!password) {
                    setPasswordError('Password must be non Empty!');
                    return;
                  } else if (passwordError) {
                    setPasswordError('');
                  }
                  setPressed('email');
                  try {
                    await EmailLogin(
                      email.replace(' ', ''),
                      password,
                      navigation,
                    );
                  } catch (e) {
                    setPressed('');
                    const error = e.toString();
                    if (error.includes('auth/wrong-password')) {
                      setPasswordError('Invalid Password.');
                    } else if (e.toString().includes('auth/invalid-email')) {
                      setEmailError('Provided email address is Invalid');
                    } else if (error.includes('auth/too-many-requests')) {
                      CustomToast({ text: 'Too many requests!' });
                    } else if (error.includes('auth/user-disabled')) {
                      CustomToast({ text: 'User disabled!' });
                    } else {
                      // show error
                      Alert.alert('Error', e.message);
                    }
                    return;
                  }
                  if (_auth.currentUser && !_auth.currentUser.emailVerified) {
                    // send email verification
                    await _auth.currentUser.sendEmailVerification();
                    navigation.navigate('verifyEmail');
                  }
                }
              }}
              style={{ marginTop: 20 }}
              loading={pressed === 'email'}
              mode="outlined"
            >
              <Text>{usePhone ? 'Send Code' : 'Submit'}</Text>
            </Button>
            <TouchableWithoutFeedback style={{ marginTop: 20 }}>
              <Text
                style={{ color: colors.link }}
                onPress={() => setMode(!usePhone)}
              >
                Continue with {usePhone ? 'Email' : 'Phone'}?
              </Text>
            </TouchableWithoutFeedback>
          </Card.Content>
        </Card>

        <Divider />
        <Button
          onPress={async () => {
            setPressed('google');
            try {
              await GoogleLogin();
            } catch (e) {
              setPressed('');
              CustomToast({ text: e.message });
            }
          }}
          icon={'google'}
          mode="contained-tonal"
          loading={pressed === 'google'}
          style={{
            marginTop: 40,
            borderRadius: 10,
            padding: 10,
            marginHorizontal: 10,
          }}
        >
          Continue with Google
        </Button>
        <Portal>
          <Modal
            visible={phoneModalVisible && usePhone}
            onDismiss={TogglePhoneCode}
            dismissable={false}
          >
            <TextInput label={'Enter Code'} />
          </Modal>
        </Portal>
      </View>
    </ScrollView>
  );
}

const askStyle = StyleSheet.create({
  view: {
    padding: 10,
  },
  text: {
    fontSize: 25,
    marginTop: 20,
  },
  image: {
    width: 80,
    height: 80,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30%',
  },
});

export function VerifyEmailScreen({ navigation }) {
  return (
    // link sent in email
    <View style={askStyle.view}>
      <Text
        style={[
          askStyle.text,
          {
            textAlign: 'center',
          },
        ]}
      >
        Verify Email
      </Text>
      <View style={askStyle.row}>
        <Image
          style={askStyle.image}
          source={{
            uri: 'https://img.icons8.com/color/120/000000/email.png',
          }}
        />
        <Text style={{ fontSize: 20, marginLeft: 10 }}>
          A link has been sent to your email. Please verify your email.
        </Text>
      </View>
      <Button
        mode="contained-tonal"
        onPress={async () => {
          await _auth.currentUser.reload();
          let user = _auth.currentUser;
          if (!user.emailVerified) {
            Toast.show({
              position: 'bottom',
              text1: 'Verify your Email to Continue.',

              type: 'error',
            });
            return;
          }
          navigation.navigate('AskName');
        }}
        style={{ marginTop: 20 }}
      >
        Continue
      </Button>
    </View>
  );
}

export function VerifyPhone({ navigation, route }) {
  // Phone Verification
  const params = route.params;
  let phone = params.phone;
  if (!phone.startsWith('+')) {
    phone = `+${phone}`;
  }
  const [confirm, setConfirm] = useState();
  const { colors } = useTheme();
  const [input, setInput] = useState('');
  const animationProgress = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 8000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [confirm]);

  useEffect(() => {
    _auth
      .signInWithPhoneNumber(phone)
      .then((d) => {
        setConfirm(d);
      })
      .catch((e) => {
        navigation.goBack();
        CustomToast({ text: e.message, error: true });
      });
  }, []);

  if (!confirm) {
    return (
      <View style={{ justifyContent: 'center', flexGrow: 1, display: 'flex' }}>
        <ActivityIndicator size={'large'} style={{ marginVertical: 10 }} />
        <Text style={{ textAlign: 'center', fontSize: 22 }}>
          Sending Code...
        </Text>
      </View>
    );
  }
  return (
    <View style={[askStyle.view, { display: 'flex', alignItems: 'center' }]}>
      <Text style={[askStyle.text, { maxWidth: '90%', flexWrap: 'wrap' }]}>
        A verification code has been sent to your number
        <Text style={{ color: colors.link }}> {params.phone}</Text>.
      </Text>
      <Lottie
        autoPlay
        loop
        speed={0.3}
        progress={animationProgress.current}
        style={{ width: 250, height: 250 }}
        source={{
          uri: 'https://assets3.lottiefiles.com/private_files/lf30_BB1X5K.json',
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
          style={{ minWidth: '80%', marginVertical: 10 }}
          mode="outlined"
          label="Enter Code."
        />
      </View>
      <IconButton
        icon="arrow-right"
        style={{ backgroundColor: colors.onSurface, marginTop: 15 }}
        iconColor={colors.background}
        size={42}
        onPress={async () => {
          try {
            await confirm?.confirm(input);
          } catch (e) {
            CustomToast({ text: e.message });
            console.error(e);
          }
        }}
      />
    </View>
  );
}
export function AskNameScreen({ navigation }) {
  const _auth = auth();
  const [name, setName] = useState();
  const [error, showError] = useState(false);

  return (
    <View style={askStyle.view}>
      {EnvHeader}
      <Text style={askStyle.text}>What should we call you?</Text>
      <TextInput
        error={error}
        placeholder="Enter your name."
        mode="outlined"
        style={{ marginTop: 10, fontSize: 18 }}
        onChangeText={(text) => {
          setName(text);
          if (error == true && text) {
            showError(false);
          }
        }}
      />
      <View style={askStyle.row}>
        <IconButton
          size={80}
          color="teal"
          icon="arrow-right-circle"
          onPress={async () => {
            if (!name || name.length == 0) {
              showError(true);
              return;
            }
            await _auth.currentUser.updateProfile({
              displayName: name,
            });
            navigation.replace('Preference');
          }}
        />
      </View>
    </View>
  );
}
