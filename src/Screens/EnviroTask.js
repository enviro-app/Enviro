import {
  View,
  ScrollView,
  StyleSheet,
  SectionList,
  Image,
  Pressable,
} from 'react-native';
import {
  Badge,
  Button,
  IconButton,
  List,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { storage } from '../mmkv';
import { ShareApp } from '../util';

const styles = StyleSheet.create({
  leftclose: {
    flexDirection: 'row',
    marginLeft: 5,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  view: { flexGrow: 1, padding: 5 },
  end: {
    justifyContent: 'flex-end',
  },
  header: {
    fontSize: 30,
    fontFamily: 'Roboto-Light',
    marginLeft: 18,
  },
  content: {
    marginTop: 20,
    marginHorizontal: 10,
    padding: 5,
  },
  tasktext: {
    fontSize: 17,
  },
  badge: {
    backgroundColor: 'teal',
    marginRight: 8,
    alignSelf: 'center',
    color: 'white',
  },
  task: {
    marginVertical: 8,
    maxWidth: '90%',
  },
  icon: {
    height: 28,
    width: 28,
  },
});

const Icons8 = ({ url, style }) => (
  <Image style={[styles.icon, style]} source={{ uri: url }} />
);

export const EnviroTaskView = ({ navigation }) => {
  const { colors } = useTheme();

  const Task = ({ children, index, completedKey, onPress }) => {
    let completed = completedKey && storage.getBoolean(completedKey);

    return (
      <View style={[styles.row, styles.task]}>
        <Badge children={index} style={styles.badge} />
        <Pressable
          onPress={() => {
            if (onPress && !completed) {
              onPress();
            }
          }}
        >
          <View
            style={{
              borderColor: colors.onBackground,
              borderWidth: 0.2,
              borderStyle: 'dashed',
              borderRadius: 15,
              padding: 20,
            }}
          >
            <Text
              style={[
                styles.tasktext,
                styles.row,
                {
                  textDecorationLine: completed ? 'line-through' : 'none',
                  opacity: completed ? 0.5 : undefined,
                },
              ]}
            >
              {children}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };
  return (
    <ScrollView style={styles.view}>
      <View style={styles.leftclose}>
        <IconButton
          icon="close-box-outline"
          iconColor={colors.onBackground}
          onPress={navigation.goBack}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.header}>
          Join the {'\n'}
          Enviro Fest
        </Text>
        <Image
          source={{
            uri: 'https://img.icons8.com/fluency/100/000000/natural-food.png',
          }}
          style={{
            height: 80,
            //     transform: [{"rotateZ": "45deg" }],
            width: 80,
          }}
        />
      </View>
      <List.Section style={styles.content}>
        <Task index="1" completedKey={'taskVideoDone'}>
          Complete Home Screen feed video
          <Icons8
            url="https://img.icons8.com/fluency/48/000000/video-playlist.png"
            style={{ height: 20, width: 20 }}
          />
          .
        </Task>
        <Task index="2" completedKey={'taskPostDone'}>
          Plant a Tree or find a Nature Spot near you{' '}
          <Icons8
            style={{ height: 20, width: 20 }}
            url="https://img.icons8.com/color/48/000000/camera.png"
          />
          . {'\n'}
          & Share it in Enviro community <Icon name="share-variant" size={18} />
        </Task>
        <Task
          index="3"
          completedKey={'firstSearch'}
          onPress={() => navigation.navigate('Search')}
        >
          complete your first Search <Icon name="magnify" size={20} /> on
          Enviro.
        </Task>
        <Task
          index="4"
          onPress={() => navigation.navigate('Games')}
          completedKey={'taskQuizDone'}
        >
          Play the Quiz in Enviro Games.
          <Icons8 url="https://img.icons8.com/emoji/48/null/bullseye.png" />
        </Task>
        <Task index="5" onPress={ShareApp} completedKey="taskShareDone">
          Share Enviro to your friends{' '}
          <Icons8 url="https://img.icons8.com/external-anggara-flat-anggara-putra/64/000000/external-friends-ui-basic-anggara-flat-anggara-putra.png" />
          .
        </Task>
      </List.Section>
      <View
        style={[styles.row, { justifyContent: 'center', paddingVertical: 5 }]}
      >
        <Button mode="elevated" onPress={navigation.goBack}>
          <Text>Back</Text>
        </Button>
      </View>
    </ScrollView>
  );
};
