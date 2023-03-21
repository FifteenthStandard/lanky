import React, {
  useState,
} from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Modal,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  Delete,
  Edit,
  ExpandMore,
  MoreVert,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ExpandButton = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function PhraseCard({ source, target, transliteration, metadata, editPhrase, deletePhrase }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [editPhraseOpen, setEditPhraseOpen] = useState(false);
  const [editSource, setEditSource] = useState(source);
  const [editTarget, setEditTarget] = useState(target);
  const [editTransliteration, setEditTransliteration] = useState(transliteration);

  const disableSubmit = !editSource && !editTarget && !editTransliteration;

  const submit = function (ev) {
    ev.preventDefault();
    if (disableSubmit) return;
    editPhrase({ source: editSource, target: editTarget, transliteration: editTransliteration });
    setEditPhraseOpen(false);
  };

  return <>
    <Card>
      <Box sx={{ minWidth: 275, display: 'flex' }}>
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
        <CardActions sx={{ display: 'flex', flexDirection: 'column', '&>:not(:first-of-type)': { marginLeft: 0 } }}>
          <IconButton onClick={ev => setAnchorEl(ev.currentTarget)}>
            <MoreVert />
          </IconButton>
          <ExpandButton expand={expanded} onClick={handleExpandClick}>
            <ExpandMore />
          </ExpandButton>
        </CardActions>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>Details</Typography>
        </CardContent>
      </Collapse>
    </Card>
    <Menu
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem onClick={() => { setEditPhraseOpen(true); setAnchorEl(null); }}>
        <ListItemIcon><Edit /></ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem onClick={deletePhrase}>
        <ListItemIcon><Delete /></ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
    <Modal open={editPhraseOpen} onClose={() => setEditPhraseOpen(false)}>
      <Paper sx={{ width: '80vw', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4 }}>
        <form onSubmit={submit}>
          <TextField
            label={metadata.source}
            fullWidth
            sx={theme => ({ paddingBlock: theme.spacing(1) })}
            value={editSource}
            onInput={ev => setEditSource(ev.target.value)}
          />
          <TextField
            label={metadata.target}
            fullWidth
            sx={theme => ({ paddingBlock: theme.spacing(1) })}
            value={editTarget}
            onInput={ev => setEditTarget(ev.target.value)}
          />
          <TextField
            label="Transliteration"
            fullWidth
            sx={theme => ({ paddingBlock: theme.spacing(1) })}
            value={editTransliteration}
            onInput={ev => setEditTransliteration(ev.target.value)}
          />
          <Button fullWidth variant="contained" onClick={submit} disabled={disableSubmit} >Edit Phrase</Button>
          <input type="submit" hidden />
        </form>
      </Paper>
    </Modal>
  </>;
};

