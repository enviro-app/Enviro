import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setOrGetScore } from '../../util';

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Roboto-Light',
    fontSize: 25,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
  },
  card: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 0.2,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headericon: {
    textAlignVertical: 'center',
    marginRight: 10,
  },
  headertext: {
    fontSize: 25,
  },
  point: {
    paddingHorizontal: 8,
    borderRadius: 50,
    borderWidth: 0.1,
    paddingVertical: 8,
    flexDirection: 'row',
  },
});

export function GamePage({ navigation }) {
  const { colors, dark } = useTheme();
  const iconColor = dark ? 'ffffFf' : 'null';
  const [score, setScore] = useState();

  useEffect(() => {
    setOrGetScore().then(setScore);
  });

  return (
    <ScrollView contentContainerStyle={styles.view}>
      <View
        style={[styles.header, { backgroundColor: colors.elevation.level0 }]}
      >
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <Icon
            name="gamepad-variant-outline"
            style={styles.headericon}
            size={28}
            color={colors.inverseSurface}
          />
          <Text style={styles.headertext}>Games</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Ranking')}
          style={[styles.point, { backgroundColor: colors.secondaryContainer }]}
        >
          <Text>{score}</Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/office/16/null/cheap-2.png',
            }}
            style={{ height: 20, width: 20, marginLeft: 5 }}
          />
        </Pressable>
      </View>
      <ImageBackground
        source={require('../../../assets/quiz.webp')}
        style={{ flexGrow: 1 }}
        imageStyle={{ opacity: 0.1 }}
      >
        <View style={styles.content}>
          <Card
            style={styles.card}
            elevation={2}
            onPress={() => navigation.navigate('QuizView')}
          >
            <Card.Title title="Play Quiz" titleStyle={styles.title} />
            <Card.Content>
              <Image
                source={{
                  uri: `https://img.icons8.com/ios-filled/50/${iconColor}/circled-q.png`,
                }}
                style={{ height: 40, width: 40 }}
              />
            </Card.Content>
          </Card>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}
