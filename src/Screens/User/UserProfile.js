import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Avatar, Text, TextInput, Chip } from 'react-native-paper';
import { VerifiedIcon } from '../../Components/Misc';
import { getUser } from '../../util';

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontFamily: 'Roboto-Light',
    marginTop: 20,
    textAlign: 'center',
  },
  view: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});

export function UserProfileScreen({ route, navigation }) {
  const userHash = route.params?.user;
  const [user, setUser] = useState();

  useEffect(() => {
    getUser(userHash).then((e) => setUser(e));
  }, [userHash]);
  const date = new Date(user?.joined);
  const joined = user?.joined
    ? `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
    : null;
  return <ScrollView contentContainerStyle={styles.view}>
    <View style={{ alignItems: 'center', marginBottom: 25 }}>
      {user?.photo ? (
        <TouchableHighlight
          onPress={() =>
            navigation.navigate('ImageView', {
              urls: [{ url: user.photo }],
              showShare: false,
            })
          }
        >
          <Avatar.Image source={{ uri: user?.photo }} size={150} />
        </TouchableHighlight>
      ) : (
        <Avatar.Text label={user?.name} size={58} />
      )}
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={styles.name}>{user?.name}</Text>
        {user?.verified && <VerifiedIcon style={{ marginLeft: 4 }} />}
      </View>
    </View>
    {joined && <Chip>Joined on {joined}</Chip>}
    {user?.bio && (
      <TextInput
        mode="outlined"
        label={'Bio'}
        editable={false}
        value={user?.bio}
      />)}
  </ScrollView>;
}
