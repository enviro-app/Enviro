import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as Dark,
} from 'react-native-paper';

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    onPrimary: 'teal',
    //    onSurfaceVariant: "#f5f3ed",
    background: 'whitesmoke',
    secondary: 'white',
    link: '#3549bd',
    backapp: '#dde7f0',
    navbar: '#606e6d',
    messagebubble: ['darkgreen'],
    backgroundVariant: 'ghostwhite',
    progress: 'purple',
    decent: 'white',
  },
};

export const DarkTheme = {
  ...Dark,
  colors: {
    ...Dark.colors,
    onPrimary: 'teal',
    onSurfaceVariant: '#f5f3ed',
    background: '#161616',
    link: 'lightblue',
    secondary: '#0e1221',
    icon: 'white',
    backapp: '#252436',
    messagebubble: ['darkorange'],
    navbar: 'whitesmoke',
    progress: '#373d69',
    decent: '#3f2f45',
    pack: ['#2f3845', '#3f2f45', '#2f4535'],
  },
};
