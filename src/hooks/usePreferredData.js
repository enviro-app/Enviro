// @ts-check
import { useState } from 'react';
import { storage } from '../mmkv';

export function usePreferredData() {
  const data = storage.getString('preferredData');
  let parsed = data ? JSON.parse(data) : null;
  const [state, setState] = useState(
    [
      { key: 'book_reader', content: 'Like to Read Books. 📚' },
      {
        key: 'influencer',
        content: 'Influencer',
        subheading:
          'Being an Influencer allows to publish environment related issues on Enviro.',
      },
    ].map((data) => ({
      ...data,
      selected: parsed && parsed.includes(data.key),
    })),
  );

  const toggle = (index) => {
    setState((_state) => {
      const newState = [..._state];

      // toggle the selected item
      newState[index].selected = !newState[index].selected;

      // Sync Selected Data with MMKV
      const selected = newState
        .filter((data) => data.selected)
        .map((data) => data.key);
      storage.set('preferredData', JSON.stringify(selected));

      return newState;
    });
  };

  return [state, toggle];
}
