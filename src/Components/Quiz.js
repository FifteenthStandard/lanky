import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Cancel,
  CheckCircle,
  ExitToApp,
  Visibility,
} from '@mui/icons-material';

export default function Quiz(props) {
  const { phrases } = props;

  const [phrase, setPhrase] = useState({ index: -1, phrase: {} });
  const [revealed, setRevealed] = useState(false);

  const pickRandomPhrase = useCallback(function () {
    setRevealed(false);
    const index = Math.floor(Math.random() * phrases.length);
    setPhrase({ index, phrase: phrases[index] });
  }, [phrases]);

  useEffect(() => {
    pickRandomPhrase();
  }, [phrases, pickRandomPhrase]);

  const { phrase: { source, target, transliteration } } = phrase;

  const buttons = revealed
    ? <>
        <IconButton onClick={pickRandomPhrase}>
          <CheckCircle />
        </IconButton>
        <IconButton onClick={pickRandomPhrase}>
          <Cancel />
        </IconButton>
      </>
    : <>
        <IconButton onClick={() => setRevealed(true)}>
          <Visibility />
        </IconButton>
        <IconButton onClick={() => window.location = '/lanky'}>
          <ExitToApp />
        </IconButton>
      </>;

  const main = <Card>
      <Box sx={{ minWidth: 275, display: 'flex' }}>
        <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography
              variant="h5" component="div"
              sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
            >
              {source}
            </Typography>
          </CardContent>
        </Box>
        <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {revealed && transliteration}
            </Typography>
            <Typography
              variant="h5" component="div"
            >
              {revealed && target}
            </Typography>
          </CardContent>
        </Box>
        <CardActions sx={{ display: 'flex', flexDirection: 'column', '&>:not(:first-of-type)': { marginLeft: 0 } }}>
          {buttons}
        </CardActions>
      </Box>
    </Card>;

    return <Box padding={2}>
      {main}
    </Box>;
}