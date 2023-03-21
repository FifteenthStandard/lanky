import React, {
  useState,
} from 'react';

import {
  Actions,
  PhraseCard,
  PhraseStack,
} from './Components';


export default function App() {
  const [lang, setLang] = useState('zh-HK');
  const [ phrases, setPhrases ] = useState([
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
    {
      'source': 'Good morning',
      'target': '早晨',
      'transliteration': 'zou2 san4',
    },
  ]);

  const speak = function (target) {
    if (window.speechSynthesis.speaking) {
      console.log('Already speaking');
      return;
    }
    const voice = window.speechSynthesis.getVoices().find(voice => voice.lang === lang);
    if (voice === undefined) return;
    const utterance = new SpeechSynthesisUtterance(target);
    utterance.start = function (ev) { console.log(ev); };
    utterance.error = function (ev) { console.log(ev); };
    utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
    console.log(`Saying ${target} in ${voice.lang}`);
  };

  const phraseCards = phrases.map(phrase => <PhraseCard {...phrase} speak={speak} />);

  return <>
    <PhraseStack phrases={phraseCards}/>
    <Actions setPhrases={setPhrases} setLang={setLang} />
  </>;
}
