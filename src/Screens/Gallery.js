import { useEffect, useState } from 'react';
import { API_URL } from '../_config';

import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableHighlight,
  Modal,
  Animated,
  ImageBackground,
  Pressable,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import WebView from 'react-native-webview';
import {
  ActivityIndicator,
  FAB,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AutoHeightImage from 'react-native-auto-height-image';

const Tab = createMaterialTopTabNavigator();
const screen = Dimensions.get('screen');

const styles = StyleSheet.create({
  video: {
    height: 400,
    width: 182,
    display: 'flex',
    justifyContent: 'center',
  },
  playbutton: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

function renderVideo({ item, navigation }) {
  return (
    <Pressable
      style={{ margin: 7 }}
      onPress={() => navigation.navigate('WebView', { url: item.src })}
    >
      <ImageBackground
        source={{ uri: item.thumb }}
        style={styles.video}
        imageStyle={{ borderRadius: 10 }}
      >
        <Icon name="play-circle" style={styles.playbutton} size={50} />
      </ImageBackground>
    </Pressable>
  );
}

export function MediaScreen({ navigation, route }) {
  let type = route.params.type;
  let isVideo = type == 'video';
  const { colors } = useTheme();

  const [gridView, setGridView] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    async function GetData() {
      let d = await fetch(API_URL + `/media?type=${type}`);
      setData(await d.json());
    }
    GetData().catch((e) => {
      if (e.toString().includes('Network request failed')) {
        ToastAndroid.showWithGravity(
          'No Internet Connection!',
          2000,
          ToastAndroid.CENTER,
        );
      }
    });
  }, []);

  const renderData = ({ item, index }) => {
    if (!item) {
      return;
    }
    return (
      <Pressable
        onPress={() => {
          let imageUrls = data.map((img) => {
            return { url: img?.src };
          });

          navigation.navigate('ImageView', { urls: imageUrls, index: index });
        }}
      >
        {
          <Image
            source={{ uri: item.src }}
            style={{
              width: !gridView ? '100%' : screen.width / 2,
              height: 400,
            }}
            resizeMode="cover"
          />
        }
      </Pressable>
    );
  };

  const Render = isVideo ? renderVideo : renderData;

  return (
    <View>
      <FlatList
        numColumns={gridView || isVideo ? 2 : 0}
        key={gridView ? 1 : 2}
        data={data}
        renderItem={(prop) => Render({ ...prop, navigation })}
        ListFooterComponent={
          !data && <ActivityIndicator style={{ marginTop: 5 }} size="large" />
        }
      />
      {data && !isVideo && (
        <FAB
          icon={!gridView ? 'grid-large' : 'view-list'}
          style={styles.fab}
          onPress={() => setGridView(!gridView)}
        />
      )}
    </View>
  );
}

export function GalleryScreen() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          color: colors.inverseSurface,
        },
      }}
    >
      <Tab.Screen
        name="Images"
        component={MediaScreen}
        initialParams={{ type: 'image' }}
      />
      <Tab.Screen
        name="Videos"
        component={MediaScreen}
        initialParams={{ type: 'video' }}
      />
    </Tab.Navigator>
  );
}
