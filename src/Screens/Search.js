import { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Linking, Image } from 'react-native';
import wiki from 'wikipedia';
import Toast from 'react-native-toast-message';
import {
  TextInput,
  Card,
  Text,
  Searchbar,
  ActivityIndicator,
  useTheme,
  TouchableRipple,
  IconButton,
  Divider,
} from 'react-native-paper';
import { API_URL } from '../_config';
import { storage } from '../mmkv';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import BottomSheet from "@gorhom/bottom-sheet";

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
  },
  input: {
    borderRadius: 25,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 15,
    display: 'flex',
  },
  meancard: {
    paddingHorizontal: 21,
    marginVertical: 10,
    paddingVertical: 8,
    borderBottomRightRadius: 20,
    borderWidth: 0.2,
    borderColor: 'white',
  },
  meaning: {
    fontFamily: 'Roboto-Light',
  },
});

const renderItem = ({ item, navigation, openInBrowser, colors }) => {
  // WikiPedia Result
  if (item.extract) {
    return (
      <Card style={styles.card}>
        {item.originalimage && (
          <Card.Cover source={{ uri: item.originalimage.source }} />
        )}
        <Card.Title title={item.title} titleStyle={styles.title} />
        <Card.Content>
          <Text>{item.extract}</Text>
        </Card.Content>
        <Card.Actions>
          <IconButton
            icon="open-in-new"
            onPress={() => Linking.openURL(item.content_urls.mobile.page)}
          />
        </Card.Actions>
      </Card>
    );
  }
  const img = item.meta?.image || item.icon || item.thumb;
  return (
    <Card
      style={styles.card}
      onPress={() => {
        if (openInBrowser) {
          Linking.openURL(item.url);
          return;
        }
        navigation.navigate('WebView', { url: item.url });
      }}
      onLongPress={() => Linking.openURL(item.url)}
    >
      <View style={{ display: 'flex', flexDirection: 'row', padding: 10 }}>
        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              maxWidth: img ? '90%' : '100%',
            }}
          >
            {item.title}
          </Text>
          <Text style={{ color: colors.link, marginTop: 5 }}>
            {item.source}
          </Text>
        </View>
        {img && (
          <Image
            source={{ uri: img }}
            style={{
              width: '20%',
              height: '80%',
              position: 'absolute',
              right: 10,
              top: 15,
              borderRadius: 7,
            }}
          />
        )}
      </View>
    </Card>
  );
};

function renderBooks({ item }) {
  return (
    <Card
      style={{ margin: 5 }}
      onPress={() => Linking.openURL(item.productUrl)}
    >
      <Card.Cover
        source={{ uri: item.imageUrl }}
        style={{ width: 150 }}
        resizeMode="contain"
      />
      <Card.Title
        title={item.title}
        titleStyle={{ flexWrap: 'wrap', maxWidth: 150 }}
      />
      {/*item.price != 0 && <Card.Content>
      <Text>
        ${item.price}
      </Text>
</Card.Content>*/}
    </Card>
  );
}

export function SearchPage({ navigation }) {
  const theme = useTheme();
  const colors = theme.colors;
  const [query, setQuery] = useState('');
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);
  const [searchWiki, setWiki] = useState();
  let openInBrowser = storage.getBoolean('ResultExternalB');
  const pref = storage.getString('preferredData');
  const books = pref ? JSON.parse(pref).includes('book_reader') : false;
  const _data = searchWiki ? searchWiki : data?.results;

  /*
  const bottomref = useRef(null);
  const snapPoints = useMemo(() => ["20%", "50%"], []);
  const HandleChange = useCallback((index) => { }, [])
  */

  return (
    <View style={styles.view}>
      <FlatList
        renderItem={({ item }) =>
          renderItem({
            item: item,
            navigation: navigation,
            openInBrowser: openInBrowser,
            colors: colors,
          })
        }
        data={_data}
        ListHeaderComponent={
          <>
            <Searchbar
              style={{ ...styles.input, marginVertical: 15 }}
              mode="outlined"
              placeholder="Search about Climate"
              value={query}
              onChangeText={(text) => setQuery(text)}
              blurOnSubmit={true}
              onSubmitEditing={async () => {
                setWiki(null);
                setData(null);
                if (!query) {
                  return;
                }
                setLoading(true);
                let data = await fetch(
                  `${API_URL}/search?q=${query}&books=${books}`,
                );
                if (
                  data.headers.get('Content-Type').includes('application/json')
                ) {
                  let array = await data.json();
                  setData(array);
                  if (!storage.getBoolean('firstSearch')) {
                    Toast.show({
                      text1: 'Congrats!',
                      text2: 'You completed the search task.',
                      position: 'bottom',
                    });
                    storage.set('firstSearch', true);
                  }
                }
                setLoading(false);
              }}
            />
            {query && data?.results.length > 0 && (
              <Text style={{ marginRight: 15, textAlign: 'right' }}>
                {`Showing ${data.results.length} Results.`}
              </Text>
            )}
            {data?.meaning && (
              <>
                <View
                  style={[
                    styles.meancard,
                    {
                      backgroundColor: colors.secondary,
                    },
                  ]}
                >
                  <Text selectable style={styles.meaning}>
                    {data?.meaning}
                  </Text>
                </View>
              </>
            )}
            {isLoading && <ActivityIndicator size="large" />}
          </>
        }
        ListFooterComponent={
          <>
            {query && _data && _data.length == 0 && (
              <View
                style={{
                  marginVertical: data?.books.length > 0 ? 50 : 150,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name={searchWiki ? 'wikipedia' : 'package-variant'}
                  size={150}
                />
                <Text style={{ fontSize: 25 }}>No Results Found.</Text>
                {!searchWiki && (
                  <TouchableRipple
                    onPress={async () => {
                      let dat = [];
                      let results = (await wiki.search(query)).results.slice(
                        0,
                        3,
                      );
                      for (let i = 0; i < results.length; i++) {
                        dat.push(await wiki.summary(results[i].title));
                      }
                      setWiki(dat);
                    }}
                  >
                    <Text style={{ color: colors.link }}>
                      Search on Wikipedia.
                    </Text>
                  </TouchableRipple>
                )}
              </View>
            )}
            {data?.books?.length > 0 && (
              <View
                style={{
                  marginHorizontal: 10,
                  marginBottom: 40,
                  minHeight: 200,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Roboto-Light',
                    fontSize: 25,
                    marginLeft: 5,
                    marginVertical: 7,
                  }}
                >
                  Books on Kindle
                </Text>
                <FlatList
                  horizontal={true}
                  data={data.books}
                  renderItem={({ item }) => renderBooks({ item, navigation })}
                  contentContainerStyle={{
                    flexGrow: 1,
                  }}
                />
              </View>
            )}
          </>
        }
      />
    </View>
  );
}
