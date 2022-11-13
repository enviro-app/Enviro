/*
DISABLED as for MVP

import { ScrollView, StyleSheet, Linking, View, Image } from 'react-native';
import { useTheme, List } from 'react-native-paper';

const styles = StyleSheet.create({
    earthCard: {
        marginVertical: 12,
        borderWidth: 1,
        borderRadius: 20,
        padding: 8,
    },
});

export const ExploreScreen = () => {
    const { colors } = useTheme();

    return (
        <ScrollView style={{ padding: 10 }}>
            <View
                style={[
                    styles.earthCard,
                    {
                        borderColor: colors.link,
                        backgroundColor: colors.secondary,
                    },
                ]}
                onPress={() =>
                    Linking.openURL(
                        'https://earth.google.com/web/data=CiQSIhIgZDJkMzVhNTk2ZTQ3MTFlOGJhM2Y0ZGJhNDk1NmM3YjQ',
                    )
                }
            >
                <List.Item
                    title="Check Climate Impact on Google Earth"
                    titleNumberOfLines={5}
                    left={() => (
                        <Image
                            source={{ uri: 'https://www.gstatic.com/earth/00-favicon.ico' }}
                            style={{ width: 30, height: 30 }}
                        />
                    )}
                    leftStyle={{ marginRight: 0 }}
                />
            </View>
        </ScrollView>);
};


*/
