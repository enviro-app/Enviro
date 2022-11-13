import {
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  View,
} from 'react-native';
import database from '@react-native-firebase/database';
import { useEffect, useState } from 'react';
import {
  List,
  Text,
  Divider,
  Avatar,
} from 'react-native-paper';
import { storage } from '../mmkv';

const styles = StyleSheet.create({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 15,
  },
  item: {
    paddingHorizontal: 10,
  },
  score: {
    textAlignVertical: 'center',
  },
});

async function getTopUsers() {
  return Object.entries(
    (
      await database()
        .ref('users')
        .orderByChild('score')
        .limitToFirst(25)
        .once('value')
    ).toJSON(),
  );
}

export function RankingView(props) {
  const { navigate } = props.navigation;

  const selfUserId = storage.getString('userHash');
  const [data, setData] = useState();

  const RenderUser = ({ item }) => {
    let isSelf = item[0] === selfUserId;
    let user = item[1];

    return (
      <>
        <List.Item
          onPress={() => {
            if (isSelf) {
              navigate('Profile', { backTo: 'Ranking' });
              return;
            }
            navigate('userProfile', { user: item[0], backTo: 'Ranking' });
          }}
          style={styles.item}
          title={user.name}
          left={() =>
            user.photo ? (
              <Image source={{ uri: user.photo }} style={styles.avatar} />
            ) : (
              <Avatar.Text label={user?.name} size={38} />
            )
          }
          right={() => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.score}>{user.score}</Text>
              <Image
                source={{
                  uri: 'https://img.icons8.com/office/50/null/cheap-2.png',
                }}
                style={{ height: 20, width: 20, marginLeft: 4, marginTop: 2 }}
              />
            </View>
          )}
        />
        <Divider />
      </>
    );
  };

  useEffect(() => {
    getTopUsers().then((e) => {
      setData(e);
    });
  }, []);

  return (
    <FlatList style={{ flexGrow: 1 }} data={data} renderItem={RenderUser} />
  );
}
