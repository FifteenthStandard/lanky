import React, {
  useState,
} from 'react';
import {
  Button,
  Modal,
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
} from '@mui/material';
import {
  AddComment,
  Quiz,
} from '@mui/icons-material';

export default function Actions({ metadata, addPhrase }) {
  const [addPhraseOpen, setAddPhraseOpen] = useState(false);
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [transliteration, setTransliteration] = useState('');

  const disableSubmit = !source;

  const submit = function (ev) {
    ev.preventDefault();
    if (disableSubmit) return;
    try {
      addPhrase({ source: source, target: target, transliteration: transliteration });
    } catch {
      return;
    }
    setAddPhraseOpen(false);
    setSource('');
    setTarget('');
    setTransliteration('');
  };

  return <>
    <SpeedDial
      ariaLabel="Speed Dial"
      icon={<SpeedDialIcon />}
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
    >
      <SpeedDialAction
        icon={<AddComment />}
        tooltipTitle="Add&nbsp;Phrase"
        tooltipOpen={true}
        onClick={() => setAddPhraseOpen(true)}
      />
      <SpeedDialAction
        icon={<Quiz />}
        tooltipTitle="Quiz"
        tooltipOpen={true}
        onClick={() => window.location = '/lanky/quiz'}
      />
    </SpeedDial>
    <Modal open={addPhraseOpen} onClose={() => setAddPhraseOpen(false)}>
      <Paper sx={{ width: '80vw', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4 }}>
        <form onSubmit={submit}>
          <TextField
            label={metadata.source}
            required
            fullWidth
            sx={theme => ({ paddingBlock: theme.spacing(1) })}
            value={source}
            onInput={ev => setSource(ev.target.value)}
          />
          <TextField
            label={metadata.target}
            fullWidth
            sx={theme => ({ paddingBlock: theme.spacing(1) })}
            value={target}
            onInput={ev => setTarget(ev.target.value)}
          />
          <TextField
            label="Transliteration"
            fullWidth
            sx={theme => ({ paddingBlock: theme.spacing(1) })}
            value={transliteration}
            onInput={ev => setTransliteration(ev.target.value)}
          />
          <Button fullWidth variant="contained" onClick={submit} disabled={disableSubmit} >Add Phrase</Button>
          <input type="submit" hidden />
        </form>
      </Paper>
    </Modal>
  </>;
};
