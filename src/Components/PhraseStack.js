import React, {
  useState,
} from 'react';
import {
  Box,
  InputBase,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  Search,
} from '@mui/icons-material';
import {
  alpha,
  styled,
} from '@mui/material/styles';

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const SearchField = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function PhraseStack({ phrases }) {
  const [search, setSearch] = useState('');

  const filteredPhrases = phrases.filter(phrase => {
    return !search
      ? true
      : phrase.props.source.toLowerCase().includes(search.toLowerCase())
        || phrase.props.target.toLowerCase().includes(search.toLowerCase())
        || phrase.props.transliteration.toLowerCase().includes(search.toLowerCase())
  });

  const contents = phrases.length === 0
    ? <Item>
        <Typography variant="h5" component="div">
          You don't have any phrases yet
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Try adding a phrase from the floating action button below
        </Typography>
      </Item>
    : filteredPhrases.length === 0
    ? <Item>
        <Typography variant="h5" component="div">
          No phrases match your search
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Try adding a phrase from the floating action button below
        </Typography>
      </Item>
    : filteredPhrases;
  return <Box sx={{ width: '100%' }}>
    <Paper square sx={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <Box padding={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="buffer"
            value={100.0*phrases.filter(phrase => phrase.props.target).length/1000}
            valueBuffer={100.0*phrases.length/1000}
            sx={{ '&>*:first-of-type': { animation: 'none' } }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${phrases.length}/1000`}</Typography>
        </Box>
      </Box>
      <Box padding={2}>
        <SearchField>
          <SearchIconWrapper>
            <Search />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            value={search}
            onChange={ev => setSearch(ev.target.value)}
            inputProps={{ 'aria-label': 'search' }}
          />
        </SearchField>
      </Box>
    </Paper>
    <Stack spacing={2} padding={1}>{contents}</Stack>
  </Box>;
};
