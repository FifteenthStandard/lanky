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

  const disableSubmit = !editSource;

  const submit = function (ev) {
    ev.preventDefault();
    if (disableSubmit) return;
    try {
      editPhrase({ source: editSource, target: editTarget, transliteration: editTransliteration });
    } catch {
      return;
    }
    setEditPhraseOpen(false);
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  const setClipboard = function (ev) {
    navigator.clipboard.writeText(ev.target.innerText);
  };

  return <>
    <Card>
      <Box sx={{ minWidth: 275, display: 'flex' }}>
        <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography
              variant="h5" component="div"
              sx={{ height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={setClipboard}
            >
              {source}
            </Typography>
          </CardContent>
        </Box>
        <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography
              sx={{ fontSize: 14, cursor: 'pointer' }}
              color="text.secondary"
              gutterBottom
              onClick={setClipboard}
            >
              {transliteration}
            </Typography>
            <Typography
              variant="h5" component="div"
              sx={{ cursor: 'pointer' }}
              onClick={setClipboard}
            >
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
      <MenuItem onClick={() => { setDeleteOpen(true); setAnchorEl(null); }}>
        <ListItemIcon><Delete /></ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
    <Modal open={editPhraseOpen} onClose={() => setEditPhraseOpen(false)}>
      <Paper sx={{ width: '80vw', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4 }}>
        <form onSubmit={submit}>
          <TextField
            label={metadata.source}
            required
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
    <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
      <Paper sx={{ width: '80vw', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4 }}>
        <Typography variant="h5">Delete phrase</Typography>
        <Typography>Are you sure you want to delete this phrase? This action is irreversible.</Typography>
        <Box sx={{ minWidth: 275, display: 'flex' }}>
          <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography
                variant="h5" component="div"
                sx={{ height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                {source}
              </Typography>
            </CardContent>
          </Box>
          <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography
                sx={{ fontSize: 14, cursor: 'pointer' }}
                color="text.secondary"
                gutterBottom
              >
                {transliteration}
              </Typography>
              <Typography
                variant="h5" component="div"
                sx={{ cursor: 'pointer' }}
              >
                {target}
              </Typography>
            </CardContent>
          </Box>
        </Box>
        <Box sx={{display: 'flex'}}>
          <Box>
            <Button variant="outlined" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          </Box>
          <Box sx={{ flex: '1 0 auto', textAlign: 'right' }}>
            <Button
              variant="contained" color="error"
              startIcon={<Delete />}
              onClick={deletePhrase}
            >
              Permanently delete
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  </>;
};

