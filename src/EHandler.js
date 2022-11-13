import { Alert, AlertButton } from 'react-native';
// import Toast  from 'react-native-toast-message';
import { setJSExceptionHandler } from 'react-native-exception-handler';

// Global Exception handler
// TODO: post Errors via API.

setJSExceptionHandler((e, isFatal) => {
  if (isFatal) {
    Alert.alert('Unhandled Exception has Occured!', e.message);
    return;
  }
  console.log(e);
}, true);
