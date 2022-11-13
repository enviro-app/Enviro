import './EHandler';

import Toast, { BaseToast } from 'react-native-toast-message';
import React from 'react';
import CodePush from 'react-native-code-push';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, useColorScheme, StatusBar } from 'react-native';
import { Provider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

import { MainStack } from './Stack';
import { LightTheme, DarkTheme } from './Theme';
import { storage } from './mmkv';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { SaveCountry, SetUserId, ValidateOnStart } from './util';

export const _auth = auth();

const styles = StyleSheet.create({
  view: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function ScreenWhenLoading() {
  return (
    <View style={styles.view}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const ToastConfig = {
  custom: (props) => {
    let p = props.props;
    return (
      <BaseToast
        {...props}
        style={[p.style]}
        renderLeadingIcon={p.renderLeadingIcon}
        renderTrailingIcon={p.renderTrailingIcon}
        text2NumberOfLines={p.text2Lines}
        text1NumberOfLines={p.text1Lines}
      />
    );
  },
};

const App = () => {
  const [user, setUser] = React.useState();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? DarkTheme : LightTheme;
  const [process, setProcessed] = React.useState(false);

  React.useEffect(() => {
    _auth.onUserChanged((user) => {
      setUser(user);
    });

    ValidateOnStart();
  }, []);

  if (!process && user && user.displayName) {
    setProcessed(true);
    SetUserId({ user });
  }

  React.useEffect(() => {
    SystemNavigationBar.setNavigationColor(
      theme.colors.surface,
      !isDark ? 'dark' : 'light',
      'navigation',
    );
  }, [theme]);

  if (user === undefined) {
    return <ScreenWhenLoading />;
  }

  return (
    <Provider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          <StatusBar
            barStyle={theme.dark ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.background}
          />
          <MainStack user={user} />
          <Toast config={ToastConfig} />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default CodePush(App);
