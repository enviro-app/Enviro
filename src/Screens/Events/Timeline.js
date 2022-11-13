import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
  FlatList,
  Image,
  Linking,
} from 'react-native';
import { Text, Card, Divider, Chip } from 'react-native-paper';
import { storage } from '../../mmkv';
import { API_URL } from '../../_config';

const styles = StyleSheet.create({
  view: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Light',
  },
});

async function getData(day) {
  let data = await (await fetch(API_URL + `/timeline?day=${day}`)).json();
  let vcount = 0;
  for (var i = 0; i < data.length; i++) {
    let v = data[i].videos;
    for (let m = 0; m < v.length; m++) {
      v[m].index = vcount;
      vcount++;
    }
  }
  return data;
}

export function TimeLine({ navigation }) {
  const [data, setData] = useState();
  const day = storage.getNumber('dayStreak') || 0;

  useEffect(() => {
    getData(day)
      .then(setData)
      .catch((e) => {
        if (e.toString().includes('Network request failed')) {
          ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
          navigation.goBack();
        }
      });
  }, [day]);

  const renderItem = ({ item }) => {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.title}> {item.title}</Text>
        <Divider style={{ marginVertical: 4 }} />
        {item.videos.map((vid, index) => {
          let disabled = vid.index >= day;
          return (
            <Card
              key={index}
              style={{ marginVertical: 8, opacity: disabled ? 0.5 : 1 }}
              onPress={() => {
                if (!disabled) {
                  Linking.openURL(vid.url);
                }
              }}
            >
              <Card.Title
                title={vid.title}
                titleNumberOfLines={4}
                titleStyle={{ maxWidth: '90%' }}
                right={() => (
                  <Image
                    source={{ uri: vid.thumb }}
                    style={{ height: 90, width: 100 }}
                    resizeMode="contain"
                  />
                )}
              />
              {disabled && <Chip>Upcoming...</Chip>}
            </Card>
          );
        })}
      </View>
    );
  };

  return (
    <FlatList style={{ padding: 20 }} data={data} renderItem={renderItem} />
  );
}
