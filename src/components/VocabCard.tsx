import { useState } from 'react';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  Delete,
  Edit,
  ExpandLess,
} from '@mui/icons-material';
import { useVocabDispatch } from '../contexts'
import type { Vocab } from '../types';

export default function VocabCard({ vocab }: { vocab: Vocab }) {
  const dispatch = useVocabDispatch();

  const [ expanded, setExpanded ] = useState(false);

  function handleClickCard() {
    setExpanded(true);
  };

  function handleClickEdit() {
    dispatch.requestUpdate(vocab);
  };

  function handleClickDelete() {
    dispatch.requestDelete(vocab);
  };

  function handleClickCollapse() {
    setExpanded(false);
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
      {expanded && (
        <CardActions disableSpacing>
          <IconButton onClick={handleClickEdit}>
            <Edit />
          </IconButton>
          <IconButton onClick={handleClickDelete}>
            <Delete />
          </IconButton>
          <IconButton sx={{ ml: 'auto' }} onClick={handleClickCollapse}>
            <ExpandLess />
          </IconButton>
        </CardActions>
      )}
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
