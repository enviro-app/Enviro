import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { storage } from '../../mmkv';
import { setOrGetScore } from '../../util';

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function QuizResult({ route, navigation }) {
  const { correct } = route.params;
  const { colors } = useTheme();
  const score = correct * 5;

  useEffect(() => {
    if (!storage.getBoolean('taskQuizDone')) {
      Toast.show({
        text1: 'Congrats!',
        text2: 'You completed the quiz task.',
        position: 'bottom',
      });
      storage.set('taskQuizDone', true);
    }
  }, []);

  useEffect(() => {
    if (score) {
      setOrGetScore(score);
    }
  }, [score]);
  return (
    <View style={[styles.view]}>
      <Text
        style={{ fontSize: 25, marginBottom: 10, fontFamily: 'Karma-Bold' }}
      >
        Your Score:
      </Text>
      <View
        style={{
          borderRadius: 150,
          backgroundColor: colors.secondaryContainer,
          height: 200,
          width: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 55,
            marginVertical: 40,
            marginHorizontal: 60,
          }}
        >
          {score}
        </Text>
      </View>
      {/*correct &&
        (<Text style={{ padding: 10, backgroundColor: colors.secondaryContainer, borderRadius: 10, marginTop: 10 }}>
          You got {correct} Q correct!
        </Text>)*/}
      <Button
        mode="contained-tonal"
        style={{ marginTop: 25 }}
        icon={'undo'}
        onPress={() => navigation.navigate('QuizView')}
      >
        Play Again
      </Button>
    </View>
  );
}
