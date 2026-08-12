import { useMemo, useState } from 'react';
import {
  Button,
  Container,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { FilterBar, VocabList } from '../components';
import { useVocab, useVocabDispatch } from '../contexts';
import type { Vocab } from '../types';

export default function VocabView(): React.ReactElement {
  const { loaded, vocab } = useVocab();

  const [ filter, setFilter ] = useState('');
  const filteredVocab = useMemo(() => filterVocab(vocab, filter), [ vocab, filter ]);

  return (
    <Stack spacing={2} sx={{ pb: '72px' }}>
      <FilterBar value={filter} onChange={setFilter} />
      { !loaded
        ? <SkeletonVocabList />
        : ( filteredVocab.length === 0
          ? <EmptyVocabList />
          : <VocabList vocabList={filteredVocab} />
        )
      }
    </Stack>
  );
};

function EmptyVocabList(): React.ReactElement {
  const dispatch = useVocabDispatch();

  function handleClickAdd() {
    dispatch.requestAdd();
  };

  return (
    <Container sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="body1">
        No words found
      </Typography>
      <Button onClick={handleClickAdd} variant="contained" sx={{ mt: 2 }}>Add a word</Button>
    </Container>
  );
};

function SkeletonVocabList(): React.ReactElement {
  return (
    <Stack>
      <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
    </Stack>
  );
};

function filterVocab(vocabList: Vocab[], filter: string): Vocab[] {
  if (!filter) {
    return vocabList;
  }

  const filterLower = filter.toLowerCase();

  return vocabList.filter(vocab => (
    vocab.english.toLowerCase().includes(filterLower)
    || vocab.cantonese?.toLowerCase().includes(filterLower)
    || vocab.pinyin?.toLowerCase().includes(filterLower)
    || vocab.jyutping?.toLowerCase().includes(filterLower)
  ));
};
