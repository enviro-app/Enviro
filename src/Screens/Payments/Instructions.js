import { View, StyleSheet, Image, Linking, FlatList } from 'react-native';
import {
  Text,
  Divider,
  useTheme,
  TouchableRipple,
  List,
  Badge,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
    padding: 10,
  },
  icon: { height: 120, width: 120, alignSelf: 'center' },
  margin: { marginVertical: 8 },
  title: {
    fontSize: 20,
    marginHorizontal: 8,
  },
});

const getIcon = (category) => {
  switch (category) {
    case 'ewallet':
      return 'https://img.icons8.com/external-xnimrodx-lineal-color-xnimrodx/120/null/external-ewallet-shopping-mall-xnimrodx-lineal-color-xnimrodx.png';
    case 'bank_redirect':
      return 'https://img.icons8.com/fluency/120/null/merchant-account.png';
    case 'card':
      return 'https://img.icons8.com/fluency/120/null/credit-card-front.png';
    default:
      return 'https://img.icons8.com/color/120/null/internet--v1.png';
  }
};
export const InstructionsScreen = ({ navigation, route }) => {
  const { colors } = useTheme();

  const { data } = route.params;
  const instructions =
    data['instructions'].length != 0 &&
    data['instructions'][0]['steps'].map((inst) =>
      Object.entries(inst).map((d) => d[1]),
    );
  const category = data['payment_method_data']['category'];
  // console.log(Math.round(Math.abs(parseInt(data["expiration"]) - Date.now()) / 36e5));

  return (
    <View style={styles.view}>
      <Image source={{ uri: getIcon(category) }} style={styles.icon} />
      {data.redirect_url && (
        <TouchableRipple
          style={styles.margin}
          c
          onPress={() => Linking.openURL(data.redirect_url)}
        >
          <>
            <List.Item
              title={
                'Click here and follow the Instructions to complete payment.'
              }
              right={() => <Icon name="open-in-new" size={20} />}
              titleNumberOfLines={5}
              titleStyle={[
                styles.title,
                { color: colors.link, minWidth: '98%' },
              ]}
            />
          </>
        </TouchableRipple>
      )}
      {instructions && (
        <View>
          {instructions.map((item, index) => {
            return (
              <List.Item
                key={index}
                left={() => (
                  <Badge style={{ backgroundColor: colors.onSurfaceVariant }}>
                    <Text style={{ color: colors.surfaceVariant }}>
                      {index + 1}
                    </Text>
                  </Badge>
                )}
                title={item[0]}
                titleNumberOfLines={5}
              />
            );
          })}
        </View>
      )}
    </View>);
}
