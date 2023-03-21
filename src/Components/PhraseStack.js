import * as React from 'react';
import {
  Box,
  Paper,
  Stack,
} from '@mui/material';
import {
  styled,
} from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function PhraseStack({ phrases }) {
  const contents = phrases.length === 0
    ? <Item>You have no phrases yet</Item>
    : phrases.map((phrase, ind) => <div key={ind}>{phrase}</div>);
  return <Box sx={{ width: '100%' }}>
    <Stack spacing={2}>{contents}</Stack>
  </Box>;
};
