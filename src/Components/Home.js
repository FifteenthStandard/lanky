import React from 'react';

import {
  Actions,
  PhraseCard,
  PhraseStack,
} from './';

export default function Home(props) {
  const { metadata, phrases, addPhrase, editPhrase, deletePhrase } = props;

  const phraseCards = phrases.map(
    (phrase, ind) =>
      <PhraseCard
        key={phrase.source}
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
