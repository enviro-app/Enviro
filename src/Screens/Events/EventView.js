import { useEffect, useState } from 'react';
import {
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  View,
  Pressable,
  Dimensions,
} from 'react-native';
import { Button, Chip, Divider, Text, useTheme } from 'react-native-paper';
import { getUser } from '../../util';

const styles = StyleSheet.create({
  view: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Karma-Bold',
  },
  description: {
    fontSize: 16,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    padding: 10,
    borderRadius: 10,
    fontSize: 22,
  },
  username: {
    fontFamily: 'Roboto-Light',
  },
  userimage: { height: 30, width: 30, borderRadius: 50, margin: 4 },
});

const window = Dimensions.get('screen');

export function EventView({ route, navigation }) {
  const { data } = route.params;
  const [user, setUser] = useState();
  const { colors } = useTheme();

  useEffect(() => {
    getUser(data.author).then(setUser);
  }, []);

  let images = Object.entries(data?.images).map((item) => item[1]);

  return (
    <ScrollView
      style={styles.view}
      contentContainerStyle={{ paddingBottom: 250 }}
    >
      <Text
        style={[styles.title, { backgroundColor: colors.onSecondary }]}
        selectable
      >
        {data.title}
      </Text>
      {data.location && (
        <View style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
          <Chip>Location: {data.location}</Chip>
        </View>
      )}
      <Divider style={{ marginBottom: 10 }} />
      <Text
        selectable
        dataDetectorType={'all'}
        style={[styles.description, { backgroundColor: colors.onSecondary }]}
      >
        {data.description}
      </Text>
      {images.length > 0 && (
        <FlatList
          style={{ marginTop: 20, marginBottom: 10 }}
          data={images}
          horizontal
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() => {
                  let imgs = images.map((d) => {
                    return { url: d };
                  });
                  navigation.navigate('ImageView', {
                    urls: imgs,
                    showShare: false,
                  });
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    minWidth: 200,
                    width: window.width - 80,
                    height: 180,
                    marginHorizontal: 5,
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
              </Pressable>
            );
          }}
        />
      )}
      {data.author && (
        <View
          style={{
            backgroundColor: colors.backapp,
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginVertical: 8,
            marginTop: 20,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
          }}
        >
          <Text>Posted by </Text>

          <Chip
            avatar={
              <Image source={{ uri: user?.photo }} style={styles.userimage} />
            }
            onPress={() =>
              navigation.navigate('userProfile', { user: data.author })
            }
            mode="outlined"
          >
            <Text style={styles.username}>{user?.name}</Text>
          </Chip>
        </View>
      )}
      {data.funding && (
        <Button
          mode="outlined"
          style={{ marginTop: 12 }}
          onPress={() =>
            navigation.navigate('Payment', {
              title: data.title,
              thumb: images?.length > 0 ? images[0] : null,
            })
          }
        >
          Donate
        </Button>
      )}
    </ScrollView>
  );
}
