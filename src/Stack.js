import { HomeScreen } from './Screens/Home';
import { ProfileScreen } from './Screens/User/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Appbar, IconButton, useTheme } from 'react-native-paper';
import { WebViewScreen } from './webview';
import { StyleSheet, View } from 'react-native';
import { QuizView } from './Screens/Game/QuizPage';
import { CustomDrawer } from './Components/customDrawer';
import { PublishEvent } from './Screens/Events/PublishEvent';
import { EnviroTaskView } from './Screens/EnviroTask';
import { ImageView } from './Screens/ExternalView';
import { PayScreen } from './Screens/Payments/PayScreen';
import { RewardView } from './Screens/EnviroReward';
import { TimeLine } from './Screens/Events/Timeline';
import { GalleryScreen } from './Screens/Gallery';
import { UserProfileScreen } from './Screens/User/UserProfile';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplashScreen } from './Screens/Splash';
import { Settings } from './Screens/Settings';
import { storage } from './mmkv';
import { QuizResult } from './Screens/Game/QuizResult';
import { EventsList } from './Screens/Events/EventsList';

import {
  LoginStartScreen,
  LoginScreen,
  AskNameScreen,
  VerifyEmailScreen,
  VerifyPhone,
} from './Screens/Login/Login';
import { GlobalScreen, CreatePost } from './Screens/Global';
import { SearchPage } from './Screens/Search';
import { ChoosePreference } from './Screens/Login/Preferences';
import { RankingView } from './Screens/LeaderBoard';
import { GamePage } from './Screens/Game/GamePage';
import { Coin } from './Components/Misc';

import { EventView } from './Screens/Events/EventView';
import { InstructionsScreen } from './Screens/Payments/Instructions';
// import { ExploreScreen } from './Screens/Explore';

const AppDrawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  header: {
    fontFamily: 'Roboto-Light',
  },
});

export const CustomHeader = ({
  navigation,
  route,
  headerTitleStyle,
  headerStyle,
  ...props
}) => {
  const { colors } = useTheme();
  const check = route.name == 'home' || route.name.startsWith('_');
  const display = check ? 'Enviro' : props.options.headerTitle || route.name;
  return (
    <Appbar style={{ height: check ? 75 : 68, elevation: 5 }}>
      <IconButton
        icon={check ? 'menu' : 'arrow-left'}
        iconColor={colors.inverseSurface}
        onPress={check ? navigation.openDrawer : navigation.goBack}
      />
      <Appbar.Content
        title={display}
        titleStyle={[
          styles.header,
          props.options.headerTitleStyle,
          {
            paddingTop: 8,
            fontSize: check ? 30 : 25,
          },
        ]}
      />
      {check && (
        <>
          <Appbar.Action icon={<Coin point={20} />} />
          <Appbar.Action
            icon="magnify"
            iconColor={colors.inverseSurface}
            onPress={() => {
              navigation.push('Search');
            }}
          />
        </>
      )}
    </Appbar>
  );
};

function TabsStack() {
  const { colors } = useTheme();
  const size = 26;

  const iconColor = (focused) => (focused ? colors.primary : colors.navbar);

  const tabIcon =
    (name) =>
    ({ focused }) =>
      (
        <MaterialCommunityIcons
          style={focused ? focusedStyle : {}}
          name={name}
          size={size}
          color={iconColor(focused)}
        />
      );

  const focusedStyle = {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  };

  return (
    <>
      <Tabs.Navigator
        screenOptions={{
          header: (props) => <CustomHeader {...props} />,
          tabBarHideOnKeyboard: true,
          tabBarLabel: '',
          tabBarStyle: {
            backgroundColor: colors.surface,
            height: 60,
          },
          tabBarIconStyle: {
            marginTop: 7,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                style={focused ? focusedStyle : {}}
                name="home"
                size={size}
                color={iconColor(focused)}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="_global"
          component={GlobalScreen}
          options={{
            headerShown: false,
            tabBarIcon: tabIcon('earth'),
          }}
        />
        {!storage.getBoolean('disableGallery') && (
          <Tabs.Screen
            name="_gallery"
            component={GalleryScreen}
            options={{
              headerShown: false,
              tabBarIcon: tabIcon('image'),
            }}
          />
        )}
        {!storage.getBoolean('disableGames') && (
          <Tabs.Screen
            name="Games"
            component={GamePage}
            options={{
              headerShown: false,
              tabBarIcon: tabIcon('gamepad-variant'),
            }}
          />
        )}
      </Tabs.Navigator>
    </>
  );
}

function DrawerStack() {
  const { colors } = useTheme();
  return (
    <AppDrawer.Navigator
      screenOptions={{
        drawerStatusBarAnimation: 'slide',
        header: (props) => <CustomHeader {...props} />,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <AppDrawer.Screen
        name="_"
        component={TabsStack}
        options={{
          headerShown: false,
        }}
      />
      <AppDrawer.Screen name="Profile" component={ProfileScreen} />
      <AppDrawer.Screen name="Settings" component={Settings} />
      <AppDrawer.Screen
        name="publishEvent"
        component={PublishEvent}
        options={{ headerTitle: 'Publish' }}
      />
      <AppDrawer.Screen
        name="EventList"
        component={EventsList}
        options={{
          headerTitle: 'Your Posts.',
        }}
      />
      <AppDrawer.Screen
        name="CreatePost"
        component={CreatePost}
        options={{
          headerTitle: 'Create Post',
          sceneContainerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </AppDrawer.Navigator>
  );
}

export function MainStack({ user }) {
  const theme = useTheme();
  const logged =
    storage.getBoolean('firstOpenDone') ||
    (user && !user.email) ||
    (user && user.email && user?.emailVerified);
  const disabledStart = storage.getBoolean('disableStart');

  return (
    <Stack.Navigator
      initialRouteName={disabledStart ? 'Home' : null}
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        animation: 'fade',
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <>
        {!logged && (
          <Stack.Group>
            <Stack.Screen name="loginstart" component={LoginStartScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="verifyEmail" component={VerifyEmailScreen} />
            <Stack.Screen name="verifyPhone" component={VerifyPhone} />
          </Stack.Group>
        )}
        {!user?.displayName && (
          <Stack.Screen name="AskName" component={AskNameScreen} />
        )}
        <Stack.Screen name="start" component={SplashScreen} />
        <Stack.Screen name="Preference" component={ChoosePreference} />
        <Stack.Screen name="Home" component={DrawerStack} />
        <AppDrawer.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="EnviroTask" component={EnviroTaskView} />
        <Stack.Screen name="WebView" component={WebViewScreen} />
        <Stack.Screen name="ImageView" component={ImageView} />
        <Stack.Screen name="QuizView" component={QuizView} />
        <Stack.Screen
          name="Payment"
          component={PayScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="PayInstruct"
          component={InstructionsScreen}
          options={{ headerShown: true, headerTitle: 'Complete' }}
        />
        {/*
        <Stack.Screen
          name="Explore"
          component={ExploreScreen}
          options={{ headerShown: true }}
        />*/}
        <Stack.Screen
          name="Timeline"
          component={TimeLine}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Event"
          component={EventView}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Reward"
          component={RewardView}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Ranking"
          component={RankingView}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="userProfile"
          component={UserProfileScreen}
          options={{ headerTitle: 'User', headerShown: true }}
        />
        <Stack.Screen
          name="QuizResult"
          component={QuizResult}
          options={{
            headerShown: true,
            headerTitle: 'Back to App',
          }}
        />
      </>
    </Stack.Navigator>
  );
}
