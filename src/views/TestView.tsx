import { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  Check,
  Clear,
} from '@mui/icons-material';
import { useVocab } from '../contexts';
import type { Vocab } from '../types';

export default function TestView(): React.ReactElement {
  const { vocab } = useVocab();

  const [ currentVocab, setCurrentVocab ] = useState<Vocab | null>(null);

  const getRandomVocab = useCallback(() => {
    if (vocab.length === 0) return;
    let randomVocab;
    while (true) {
      const randomIndex = Math.floor(Math.random() * vocab.length);
      randomVocab = vocab[randomIndex];
      if (randomVocab !== currentVocab && randomVocab.cantonese && randomVocab.pinyin && randomVocab.jyutping) break;
    }
    setCurrentVocab(randomVocab);
  }, [ vocab, currentVocab ]);

  useEffect(() => {
    getRandomVocab();
  }, [ vocab ]);

  function onCorrect() {
    getRandomVocab();
  };

  function onIncorrect() {
    getRandomVocab();
  };

  return (currentVocab
      ? <VocabCard
          vocab={currentVocab}
          onCorrect={onCorrect}
          onIncorrect={onIncorrect}
        />
      : <></>
  );
};

function VocabCard({
  vocab,
  onCorrect,
  onIncorrect,
}: {
  vocab: Vocab,
  onCorrect: () => void,
  onIncorrect: () => void,
}): React.ReactElement {
  const [ revealed, setRevealed ] = useState(false);

  function handleClickReveal() {
    setRevealed(true);
  };

  function handleClickCorrect() {
    setRevealed(false);
    onCorrect();
  };

  function handleClickIncorrect() {
    setRevealed(false);
    onIncorrect();
  };

  return (
    <Card>
      <CardContent>
        <Typography>{vocab.english}</Typography>
      </CardContent>
      <CardActionArea onClick={handleClickReveal}>
        {revealed ? (
          <CardContent>
            {vocab.cantonese && <Typography>{vocab.cantonese}</Typography>}
            {vocab.pinyin && <Typography variant="body2">{vocab.pinyin}</Typography>}
            {vocab.jyutping && <Typography variant="body2">{vocab.jyutping}</Typography>}
          </CardContent>
        ) : (
          <CardContent>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </CardContent>
        )}
      </CardActionArea>
      <CardActions
        disableSpacing
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <IconButton onClick={handleClickCorrect}>
          <Check />
        </IconButton>
        <IconButton onClick={handleClickIncorrect}>
          <Clear />
        </IconButton>
      </CardActions>
    </Card>
  );
};
