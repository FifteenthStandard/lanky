import {
  Fab,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import {
  useVocabDispatch,
} from '../contexts';

export default function Actions(): React.ReactElement {
  const dispatch = useVocabDispatch();

  function handleClick() {
    dispatch.requestAdd();
  };

  return (
    <Fab
      color="primary"
      aria-label="add"
      onClick={handleClick}
      sx={{
        position: 'fixed',
        bottom: 72,
        right: 16,
      }}
    >
      <Add />
    </Fab>
  );
};
