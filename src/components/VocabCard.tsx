import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useVocabDispatch } from '../contexts'
import type { Vocab } from '../types';

export default function VocabCard({ vocab }: { vocab: Vocab }) {
  const dispatch = useVocabDispatch();

  const [ expanded, setExpanded ] = useState(false);

  useEffect(() => {
    if (expanded) {
      window.addEventListener('scroll', handle);
      return () => window.removeEventListener('scroll', handle);
    }
    function handle() { setExpanded(false); }
  }, [ expanded ]);

  function handleClickCard() {
    setExpanded(!expanded);
  };

  function handleClickEdit() {
    dispatch.requestUpdate(vocab);
  };

  function handleClickDelete() {
    dispatch.requestDelete(vocab);
  };

  return (
    <Card>
      <CardActionArea onClick={handleClickCard}>
        <Stack direction="row" spacing={2}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <TextLarge>{vocab.english}</TextLarge>
          </CardContent>
          <Divider orientation="vertical" flexItem />
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {vocab.cantonese && <TextLarge>{vocab.cantonese}</TextLarge>}
            {vocab.pinyin && <TextSmall>{vocab.pinyin}</TextSmall>}
            {vocab.jyutping && <TextSmall>{vocab.jyutping}</TextSmall>}
          </CardContent>
        </Stack>
      </CardActionArea>
      <Divider orientation="horizontal" />
      <CardActions sx={{ p: 0, transition: 'max-height 0.2s ease-in-out', overflowY: 'hidden', maxHeight: expanded ? '100px' : '0px' }}>
        <Stack direction="row" sx={{ width: '100%' }}>
          <Button onClick={handleClickEdit} fullWidth>Edit</Button>
          <Divider orientation="vertical" flexItem />
          <Button onClick={handleClickDelete} fullWidth color="error">Delete</Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

function TextLarge({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h6">{children}</Typography>
  );
};

function TextSmall({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body2" color="textSecondary">{children}</Typography>
  );
};
