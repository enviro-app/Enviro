import { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Animated,
  StatusBar,
  BackHandler,
  Pressable,
  Alert,
  ImageBackground,
} from 'react-native';
import Lottie from 'lottie-react-native';
import { Easing } from 'react-native-reanimated';
import {
  Appbar,
  Card,
  Checkbox,
  ProgressBar,
  Text,
  useTheme,
  List,
  Button,
} from 'react-native-paper';
import { API_URL } from '../../_config';
import App from '../../App';
import { TouchableHighlight } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
  },
  content: {
    padding: 15,
  },
  ques: {
    marginVertical: 10,
    fontSize: 22,
    fontFamily: 'Roboto-Black',
  },
  opt: {
    marginTop: 10,
    borderRadius: 22,
  },
});

async function getQuiz() {
  return await (await fetch(API_URL + '/quiz')).json();
}

export function QuizView({ navigation }) {
  const { colors } = useTheme();

  const [data, setData] = useState();
  const [selected, select] = useState();
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    getQuiz().then((val) => {
      setData(val);
    });
  }, []);

  if (!data) {
    // Loading Animation.
    let anim = new Animated.Value(0);
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
    ).start();
    return (
      <View style={styles.view}>
        <Lottie
          progress={anim}
          autoPlay
          loop
          source={{
            uri: 'https://assets3.lottiefiles.com/packages/lf20_gazb0eeo.json',
          }}
        />
      </View>
    );
  }
  const TotalQ = data.data.length;

  let ques = data.data[index];

  return (
    <ScrollView>
      <StatusBar hidden />
      <Appbar>
        <Appbar.Header
          style={{
            justifyContent: 'space-between',
            display: 'flex',
            width: '80%',
          }}
        >
          <View
            style={{
              borderColor: colors.surfaceVariant,
              borderWidth: 0.5,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text>
              Q{index + 1}/{TotalQ}
            </Text>
          </View>
          <Button
            onPress={() =>
              navigation.replace('QuizResult', { correct: correct })
            }
          >
            Discard
          </Button>
        </Appbar.Header>
      </Appbar>
      <ProgressBar progress={index / TotalQ} />
      <View style={styles.content}>
        <Text style={styles.ques}>{ques.question}</Text>
        {ques.options.map((opt, _index) => {
          const currentSelected = () => selected != null && selected === _index;
          const isCorrectOpt = () =>
            selected != null && ques.correct === _index;
          const color = isCorrectOpt()
            ? '#6dbd75'
            : currentSelected()
            ? '#bd3343'
            : colors.background;

          return (
            <Pressable
              style={[
                styles.opt,
                {
                  elevation: 2,
                  backgroundColor: color,
                },
              ]}
              key={_index}
              onPress={async () => {
                if (selected != null) {
                  return;
                }
                select(_index);

                if (_index === ques.correct) {
                  setCorrect(correct + 1);
                  console.debug(`Updating score: ${correct}`);
                }
                setTimeout(() => {
                  if (index + 1 >= TotalQ) {
                    navigation.replace('QuizResult', { correct: correct });
                    return;
                  }
                  select(null);
                  setIndex(index + 1);
                }, 2000);
              }}
            >
              <List.Item
                title={opt}
                titleStyle={{
                  color: currentSelected()
                    ? colors.background
                    : colors.inverseSurface,
                }}
                left={() => (
                  <Checkbox
                    status={isCorrectOpt() ? 'checked' : 'unchecked'}
                    disabled={selected != null ? true : false}
                  />
                )}
              />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
