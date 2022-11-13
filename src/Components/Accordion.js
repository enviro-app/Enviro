import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableRipple } from 'react-native-paper';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  titleStyle: {
    maxWidth: '90%',
  },
});

export function Accordion({
  title,
  titleStyle,
  onPress,
  children,
  containerStyle,
  expanded,
  right,
  showChevron = true,
}) {
  return (
    <View style={containerStyle}>
      <TouchableRipple onPress={onPress}>
        <View style={styles.row}>
          {showChevron && (
            <Icon size={30} name={expanded ? 'chevron-up' : 'chevron-down'} />
          )}
          {title && (
            <Text style={{ ...styles.titleStyle, ...titleStyle }}>{title}</Text>
          )}
          {right}
        </View>
      </TouchableRipple>
      <View style={{ display: expanded ? 'flex' : 'none' }}>{children}</View>
    </View>
  );
}
