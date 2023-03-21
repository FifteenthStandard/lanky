import * as React from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';
import {
  VolumeUp,
} from '@mui/icons-material';

export default function PhraseCard({ source, target, transliteration, speak }) {
  return <Card sx={{ minWidth: 275, display: 'flex' }}>
    <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography variant="h5" component="div" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          {source}
        </Typography>
      </CardContent>
    </Box>
    <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {transliteration}
        </Typography>
        <Typography variant="h5" component="div">
          {target}
        </Typography>
      </CardContent>
    </Box>
    <CardActions>
      <IconButton onClick={() => speak(target)}>
        <VolumeUp />
      </IconButton>
    </CardActions>
  </Card>;
};

