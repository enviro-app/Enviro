import { useState } from 'react';
import { Modal, StatusBar, StyleSheet, ToastAndroid, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import {
  ActivityIndicator,
  IconButton,
  Portal,
  useTheme,
} from 'react-native-paper';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import { GetImage } from '../util';

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    left: 8,
    top: 0,
  },
  righticons: {
    position: 'absolute',
    right: 10,
    bottom: 80,
  },
});

export function ImageView({ route, navigation }) {
  const params = route.params;
  const [current, setCurrent] = useState(params.index);
  const { colors } = useTheme();
  const showShare = params.showShare;
  const icon_size = 27;
  const iconStyle = [{ backgroundColor: colors.secondaryContainer }];
  return (
    <>
      <StatusBar hidden />
      <ImageViewer
        imageUrls={params.urls}
        index={params.index}
        loadingRender={() => <ActivityIndicator size="large" />}
        onChange={(index) => setCurrent(index)}
      />
      <Portal>
        <IconButton
          icon={'arrow-left'}
          style={styles.icon}
          iconColor="white"
          onPress={navigation.goBack}
        />
        {(showShare == undefined || showShare == true) && (
          <View style={styles.righticons}>
            <IconButton
              icon="share"
              style={iconStyle}
              size={icon_size}
              onPress={async () => {
                try {
                  await Share.open({
                    url:
                      'data:image/png;base64,' +
                      (await GetImage(route.params.urls[current].url)).base64(),
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
            />
            <IconButton
              icon="download"
              style={iconStyle}
              size={icon_size}
              onPress={async () => {
                let path = await (
                  await GetImage(route.params.urls[current].url, 'png')
                ).path();
                console.debug(`saving '${path}' to Gallery.`);
                await CameraRoll.save(path);
                Toast.show({
                  type: 'success',
                  position: 'bottom',
                  text1: 'Saved to Gallery!',
                });
              }}
            />
          </View>
        )}
      </Portal>
    </>
  );
}
