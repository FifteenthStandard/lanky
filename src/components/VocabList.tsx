import {
  Stack,
} from '@mui/material';
import { VocabCard } from '.';
import type { Vocab } from '../types';

export default function VocabList({ vocabList }: { vocabList: Vocab[] }) {
  return (
    <Stack spacing={2}>
      {vocabList.map(vocab => (
        <VocabCard key={vocab.id} vocab={vocab} />
      ))}
    </Stack>
  );
};
