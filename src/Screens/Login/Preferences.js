import React, { useState } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { Button, Checkbox, Card, Text, TextInput } from 'react-native-paper';
import { useMMKVObject } from 'react-native-mmkv';

import { usePreferredData } from '../../hooks/usePreferredData';
import { storage } from '../../mmkv';

const Header = () => (
  <>
    <View style={styles.header}>
      <Text style={styles.heading}>Enviro</Text>
      <Image source={{ uri: 'asset:/icon.webp' }} />
    </View>
    <Text style={{ fontSize: 25 }}>Choose your Preferences:</Text>
  </>
);

export function ChoosePreference({ navigation }) {
  const [prefs, toggle] = usePreferredData();

  return (
    <FlatList
      ListHeaderComponent={<Header />}
      contentContainerStyle={styles.main}
      data={prefs}
      renderItem={({ item, index }) => (
        <Card key={item.key} style={styles.card}>
          <Card.Title
            titleStyle={{ fontSize: 17, fontWeight: 'normal' }}
            title={item.content}
            // eslint-disable-next-line react/no-unstable-nested-components
            left={() => (
              <Checkbox
                status={item.selected ? 'checked' : 'unchecked'}
                onPress={() => toggle(index)}
              />
            )}
          />
          {item.subheading && (
            <Card.Content style={{ marginLeft: 20 }}>
              <Text>{item.subheading}</Text>
            </Card.Content>
          )}
        </Card>
      )}
      ListFooterComponent={
        <Button
          mode="contained-tonal"
          style={{ marginTop: 40, padding: 5 }}
          onPress={() => {
            if (!storage.getString('preferredData')) {
              storage.set('preferredData', '[]');
            }
            navigation.replace('Home');
          }}
        >
          <Text style={{ fontSize: 22 }}>Next</Text>
        </Button>
      }
    />
  );
}

const styles = StyleSheet.create({
  heading: {
    color: '#8CCFB9',
    fontSize: 38,
    fontWeight: 'bold',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  main: {
    paddingHorizontal: 20,
    paddingTop: 20,
    display: 'flex',
  },
  card: {
    padding: 10,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
