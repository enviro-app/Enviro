import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Share from 'react-native-share';

import {
  Portal,
  IconButton,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import WebView from 'react-native-webview';
import { GetImage } from './util';

const styles = StyleSheet.create({
  icon: {
    marginTop: 20,
    marginVertical: 15,
  },
  righticons: {
    position: 'absolute',
    right: 10,
    bottom: 40,
  },
  center: {
    position: 'absolute',
    right: '48%',
    top: '50%',
  },
});

export function WebViewScreen({ route, navigation }) {
  let mode = route.params.mode;
  let showBackButton = route.params.showBackButton || true;

  const { colors } = useTheme();
  const icon_size = 25;
  // 1: media

  const [visible, setVisible] = useState(false);
  const iconStyle = [
    styles.icon,
    { backgroundColor: colors.secondaryContainer },
  ];

  // Web View Redirects.
  return (
    <>
      <WebView
        source={{ uri: route.params.url }}
        //  pullToRefreshEnabled={true}
        //   startInLoadingState={true}
        renderLoading={() => (
          <Portal>
            <View
              style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          </Portal>
        )}
        onLoadEnd={() => setVisible(true)}
      />
      <Portal>
        {showBackButton && (
          <IconButton
            icon="arrow-left"
            style={styles.icon}
            onPress={() => navigation.goBack()}
            size={icon_size}
          />
        )}
        {mode === 1 && visible && (
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
                      (await GetImage(route.params.url)).base64(),
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
            />
            <IconButton icon="download" style={iconStyle} size={icon_size} />
          </View>
        )}
      </Portal>
    </>
  );
}
