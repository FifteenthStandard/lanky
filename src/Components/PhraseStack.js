import * as React from 'react';
import {
  Box,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  styled,
} from '@mui/material/styles';

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function PhraseStack({ phrases }) {
  const contents = phrases.length === 0
    ? <Item>
        <Typography variant="h5" component="div">
          You don't have any phrases yet
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Try adding a phrase from the floating action button below
        </Typography>
      </Item>
    : phrases.map((phrase, ind) => <div key={ind}>{phrase}</div>);
  return <Box sx={{ width: '100%' }}>
    <Paper square sx={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <Box padding={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={100.0*phrases.length/1000} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${phrases.length}/1000`}</Typography>
        </Box>
      </Box>
    </Paper>
    <Stack spacing={2} padding={1}>{contents}</Stack>
  </Box>;
};
