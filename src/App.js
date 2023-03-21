import React, {
  useEffect,
  useState,
} from 'react';

import {
  Actions,
  PhraseCard,
  PhraseStack,
} from './Components';


export default function App() {
  const metadata = {
    'source': 'English',
    'target': 'Cantonese',
    'transliteration': true,
  };

  const storagePhrases = JSON.parse(window.localStorage.getItem('lanky') || '[]');

  const [ phrases, setPhrases ] = useState(storagePhrases);

  useEffect(() => {
    window.localStorage.setItem('lanky', JSON.stringify(phrases));
  }, [phrases]);

  const addPhrase = phrase => setPhrases(phrases => [...phrases, phrase]);
  const editPhrase = ind => phrase => setPhrases(phrases => phrases.slice(0, ind).concat([ phrase ]).concat(phrases.slice(ind+1)));
  const deletePhrase = ind => () => setPhrases(phrases => phrases.slice(0, ind).concat(phrases.slice(ind+1)));

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
