import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';

export const Coin = ({ style }) => {
  return (
    <View
      style={[
        { borderRadius: 20, backgroundColor: 'darkyellow', borderRadius: 50 },
        style,
      ]}
    >
      <Text style={{ marginHorizontal: 10 }}>C</Text>
    </View>
  );
};

export const VerifiedIcon = (props) => (
  <Icon name="check-decagram" size={25} color="lightblue" {...props} />
);
