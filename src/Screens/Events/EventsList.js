import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Image } from 'react-native';
import { List, Card, Chip } from 'react-native-paper';
import { getSelfEvents } from '../../util';

const getColor = (_case) => {
  switch (_case) {
    case "rejected": return "red";
    case "active": return "green";
    default: return "yellow";
  }
}

export const EventsList = ({ navigation }) => {
  const [data, setData] = useState();
  useEffect(() => {
    getSelfEvents().then(setData);
  }, []);

  const renderItem = ({ item }) => {
    let images = Object.entries(item?.images);
    images = images.map(d => d[1]);
    return <Card
      style={{ margin: 10, paddingVertical: 8 }}
      onPress={() => navigation.navigate('Event', { data: item })}
    >
      <Card.Title
        title={item.title}
        titleNumberOfLines={2}
        subtitle={item.short_description || item.description}
        subtitleNumberOfLines={2}
        left={() => {
          if (images.length > 0) {
            return <Image source={{ uri: images[0] }} style={{ height: 50, width: 50 }} />
          }
        }}
        right={() => {
          if (item.status) {
            const color = getColor(item.status);
            return <Chip style={{ marginRight: 5, borderColor: color, }} textStyle={{ color: color }} mode="outlined">
              {item.status}
            </Chip>
          }
        }
        }
      />
    </Card>
  };
  return <FlatList data={data} renderItem={renderItem} />;
};
