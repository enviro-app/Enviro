import { StyleSheet, Linking, Share, View } from 'react-native';
import { Text, useTheme, Avatar } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { _auth } from '../App';
import { ShareApp, getSelf } from '../util';
import { VerifiedIcon } from './Misc';
import { useEffect, useState } from 'react';

const styles = StyleSheet.create({
  draweruser: { marginTop: 12, fontSize: 16, fontFamily: 'Roboto-Light' },

  drawerhead: {
    padding: 10,
    alignItems: 'center',
  },
  center: {
    flexDirection: 'row',
    textAlignVertical: 'center',
  },
});

export function CustomDrawer(props) {
  const { navigate } = props.navigation;
  const { colors } = useTheme();
  const [euser, setUser] = useState();

  useEffect(() => {
    getSelf().then(setUser);
  }, []);

  const user = _auth.currentUser;
  const size = 100;
  const iconColor = (focused) =>
    focused ? colors.onSurface : colors.onBackground;
  const screens = [
    {
      label: 'Home',
      key: 'home',
      icon: 'home-variant',
      index: 0,
    },
    { label: 'Edit Profile', key: 'Profile', icon: 'account', index: 1 },
    { label: 'Settings', key: '', icon: 'cog-outline', index: 2 },
    //    { label: 'Explore', key: '', icon: 'compass', index: 3 },
    { label: 'Leaderboard', key: 'Ranking', icon: 'star-shooting', index: 3 },
  ];

  return (
    <>
      <DrawerContentScrollView
        style={{
          backgroundColor: colors.background,
        }}
      >
        <TouchableWithoutFeedback
          style={[styles.drawerhead]}
          onPress={() => navigate('Profile')}
        >
          {user?.photoURL ? (
            <Avatar.Image source={{ uri: user?.photoURL }} size={size} />
          ) : (
            <Avatar.Text size={size} label={user?.displayName} />
          )}
          <View style={styles.center}>
            <Text style={[styles.draweruser]}>{user?.displayName}</Text>
            {euser?.verified && (
              <VerifiedIcon style={{ marginLeft: 4, marginTop: 8 }} />
            )}
          </View>
        </TouchableWithoutFeedback>
        {screens.map((screen) => (
          <DrawerItem
            key={screen.key || screen.label}
            style={{ marginTop: 10 }}
            label={screen.label}
            labelStyle={{ color: colors.onSurface }}
            activeTintColor={colors.placeholder}
            onPress={() => {
              navigate(screen.key || screen.label);
            }}
            icon={({ focused, size, color }) => (
              <Icon name={screen.icon} size={size} color={iconColor(focused)} />
            )}
            focused={props.state.index == screen.index}
          />
        ))}
        <DrawerItem
          label="Feedback"
          labelStyle={{ color: colors.onSurface }}
          onPress={() => Linking.openURL('mailto:newdev0@outlook.com')}
          icon={({ focused, color }) => (
            <Icon
              name="human-greeting-proximity"
              color={iconColor(focused)}
              size={22}
            />
          )}
        />
        <DrawerItem
          label="Share App"
          labelStyle={{ color: colors.onSurface }}
          onPress={ShareApp}
          icon={({ focused }) => (
            <Icon name="share" color={iconColor(focused)} size={22} />
          )}
        />
      </DrawerContentScrollView>
    </>
  );
}
