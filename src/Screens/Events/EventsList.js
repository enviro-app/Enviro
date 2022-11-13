import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { List, Card, Chip } from 'react-native-paper';
import { getSelfEvents } from '../../util';

export const EventsList = ({ navigation }) => {
  const [data, setData] = useState();
  useEffect(() => {
    getSelfEvents().then(setData);
  }, []);

  const renderItem = ({ item }) => (
    <Card
      style={{ margin: 10, paddingVertical: 8 }}
      onPress={() => navigation.navigate('Event', { data: item })}
    >
      <Card.Title
        title={item.title}
        titleNumberOfLines={2}
        subtitle={item.short_description || item.description}
        subtitleNumberOfLines={2}
        right={() =>
          item.status && (
            <Chip style={{ marginRight: 5 }} mode="outlined">
              {item.status}
            </Chip>
          )
        }
      />
    </Card>
  );
  return <FlatList data={data} renderItem={renderItem} />;
};
