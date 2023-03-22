import React, {
  useEffect,
  useState,
} from 'react';

import {
  Actions,
  PhraseCard,
  PhraseStack,
} from './Components';

/* eslint-disable no-extend-native */
Array.prototype.sorted = function () {
  const newArray = [...this];
  newArray.sort(function (a, b) {
    const numberRegex = /^\d+$/;
    a = a.source;
    b = b.source;
    if (a.match(numberRegex) && b.match(numberRegex)) {
      return parseInt(a) - parseInt(b);
    } else if (a.match(numberRegex)) {
      return -1;
    } else if (b.match(numberRegex)) {
      return 1;
    } else {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    }
  });
  return newArray;
};

Array.prototype.appended = function (value) {
  return [...this, value];
};

Array.prototype.removedAt = function (index) {
  return this.slice(0, index).concat(this.slice(index+1));
};

Array.prototype.replacedAt = function (index, value) {
  return this.slice(0, index).concat([value]).concat(this.slice(index+1));
};
/* eslint-enable no-extend-native */

export default function App() {
  const metadata = {
    'source': 'English',
    'target': 'Cantonese',
    'transliteration': true,
  };

  const storagePhrases = JSON.parse(window.localStorage.getItem('lanky') || '[]').sorted();

  const [ phrases, setPhrases ] = useState(storagePhrases);

  useEffect(() => {
    window.localStorage.setItem('lanky', JSON.stringify(phrases));
  }, [phrases]);

  const addPhrase = phrase => {
    if (phrases.some(p => p.source.toLowerCase() === phrase.source.toLowerCase())) throw new Error('Phrase already exists');
    setPhrases(phrases => phrases.appended(phrase).sorted())
  };
  const editPhrase = ind => phrase => {
    if (phrases.removedAt(ind).some(p => p.source.toLowerCase() === phrase.source.toLowerCase())) throw new Error('Phrase already exists');
    setPhrases(phrases => phrases.replacedAt(ind, phrase).sorted());
  };
  const deletePhrase = ind => () => setPhrases(phrases => phrases.removedAt(ind).sorted());

  const phraseCards = phrases.map(
    (phrase, ind) =>
      <PhraseCard
        metadata={metadata}
        editPhrase={editPhrase(ind)}
        deletePhrase={deletePhrase(ind)}
        {...phrase}
      />
    );

  return <>
    <PhraseStack phrases={phraseCards}/>
    <Actions metadata={metadata} addPhrase={addPhrase} />
  </>;
}
