import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import {
  Close,
} from '@mui/icons-material';
import { useGemini, useGeminiDispatch, useToastDispatch } from '.';
import { storageClient, suggestTranslation } from '../clients';
import type { Vocab, VocabDetails, VocabDispatch, VocabLibrary } from '../types';

const VocabContext = createContext<VocabLibrary | undefined>(undefined);
const VocabDispatchContext = createContext<VocabDispatch | undefined>(undefined);

const initialState: VocabLibrary = {
  loaded: false,
  vocab: [],
};

type InitializeStateAction = {
  type: 'INITIALIZE_STATE';
  payload: Vocab[];
};

type AddVocabAction = {
  type: 'ADD_VOCAB';
  payload: Vocab;
}

type UpdateVocabAction = {
  type: 'UPDATE_VOCAB';
  payload: Vocab;
}

type DeleteVocabAction = {
  type: 'DELETE_VOCAB';
  id: string;
};

type VocabAction =
  | InitializeStateAction
  | AddVocabAction
  | UpdateVocabAction
  | DeleteVocabAction;

function reduce(state: VocabLibrary, action: VocabAction): VocabLibrary {
  switch (action.type) {
    case 'INITIALIZE_STATE':
      return {
        loaded: true,
        vocab: sorted(action.payload),
      };

    case 'ADD_VOCAB':
      return {
        ...state,
        vocab: sorted([ ...state.vocab, action.payload ]),
      };

    case 'UPDATE_VOCAB':
      return {
        ...state,
        vocab: sorted(state.vocab.map(vocab =>
          vocab.id === action.payload.id ? action.payload : vocab
        )),
      };

    case 'DELETE_VOCAB':
      return {
        ...state,
        vocab: state.vocab.filter(vocab => vocab.id !== action.id),
      };

    default:
      return state;
  }

  function sorted(vocabList: Vocab[]): Vocab[] {
    return vocabList.toSorted((a, b) => a.english.localeCompare(b.english));
  };
};

export function VocabProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const toastDispatch = useToastDispatch();

  const [ state, dispatch ] = useReducer(reduce, initialState);
  const [ addVocabDialogOpen, setAddVocabDialogOpen ] = useState(false);
  const [ selectedUpdateVocab, setSelectedUpdateVocab ] = useState<Vocab | null>(null);
  const [ selectedDeleteVocab, setSelectedDeleteVocab ] = useState<Vocab | null>(null);

  useEffect(() => {
    (async function initialize() {
      try {
        const vocabList = await storageClient.listVocab();
        dispatch({ type: 'INITIALIZE_STATE', payload: vocabList });
      }
      catch (error) {
        toastDispatch.addToast({
          message: 'Failed to load vocab list. Please try again.',
          severity: 'error',
        });
      }
    }());
  }, []);

  const requestAdd = useCallback(() => {
    setAddVocabDialogOpen(true);
  }, []);

  const requestUpdate = useCallback((vocab: Vocab) => {
    setSelectedUpdateVocab(vocab);
  }, []);

  const requestDelete = useCallback((vocab: Vocab) => {
    setSelectedDeleteVocab(vocab);
  }, []);

  const vocabDispatch: VocabDispatch = useMemo(() => ({
    requestAdd,
    requestUpdate,
    requestDelete,
  }), [ requestAdd, requestUpdate, requestDelete ]);

  const onSubmitAddVocab = useCallback((vocabDetails: VocabDetails) => {
    const newVocab: Vocab = {
      ...vocabDetails,
      id: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_VOCAB', payload: newVocab });
    storageClient.saveVocab(newVocab).then(() => {
      toastDispatch.addToast({
        message: `Added "${newVocab.english}"`,
        severity: 'success',
      });
    }).catch(() => {
      toastDispatch.addToast({
        message: `Failed to add "${newVocab.english}", please try again`,
        severity: 'error',
      });
    });
  }, []);

  const onSubmitUpdateVocab = useCallback((vocab: Vocab) => {
    dispatch({ type: 'UPDATE_VOCAB', payload: vocab });
    storageClient.saveVocab(vocab).then(() => {
      toastDispatch.addToast({
        message: `Updated "${vocab.english}"`,
        severity: 'success',
      });
    }).catch(() => {
      toastDispatch.addToast({
        message: `Failed to update "${vocab.english}", please try again`,
        severity: 'error',
      });
    });
  }, []);

  const onSubmitDeleteVocab = useCallback((vocab: Vocab) => {
    dispatch({ type: 'DELETE_VOCAB', id: vocab.id });
    storageClient.deleteVocab(vocab).catch(() => {
      toastDispatch.addToast({
        message: `Failed to delete "${vocab.english}", please try again`,
        severity: 'error',
      });
    });
  }, []);

  return (
    <VocabContext.Provider value={state}>
      <VocabDispatchContext.Provider value={vocabDispatch}>
        <AddVocabDialog
          open={addVocabDialogOpen}
          onSubmit={onSubmitAddVocab}
          onClose={() => setAddVocabDialogOpen(false)}
        />
        <UpdateVocabDialog
          vocab={selectedUpdateVocab}
          onSubmit={onSubmitUpdateVocab}
          onClose={() => setSelectedUpdateVocab(null)}
        />
        <DeleteVocabDialog
          vocab={selectedDeleteVocab}
          onSubmit={onSubmitDeleteVocab}
          onClose={() => setSelectedDeleteVocab(null)}
        />
        {children}
      </VocabDispatchContext.Provider>
    </VocabContext.Provider>
  );
};

export function useVocab(): VocabLibrary {
  const context = useContext(VocabContext);
  if (context === undefined) {
    throw new Error('useVocab must be used within a VocabProvider');
  }
  return context;
};

export function useVocabDispatch(): VocabDispatch {
  const context = useContext(VocabDispatchContext);
  if (context === undefined) {
    throw new Error('useVocabDispatch must be used within a VocabProvider');
  }
  return context;
};

function AddVocabDialog({
  open,
  onSubmit,
  onClose,
}: {
  open: boolean,
  onSubmit: (vocabDetails: VocabDetails) => void,
  onClose: () => void,
}): React.ReactElement {
  const apiKey = useGemini();
  const renewApiKey = useGeminiDispatch();

  const [ english, setEnglish ] = useState('');
  const [ cantonese, setCantonese ] = useState('');
  const [ pinyin, setPinyin ] = useState('');
  const [ jyutping, setJyutping ] = useState('');
  const [ suggestionLoading, setSuggestionLoading ] = useState(false);

  function resetForm() {
    setEnglish('');
    setCantonese('');
    setPinyin('');
    setJyutping('');
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      english,
      cantonese: cantonese || undefined,
      pinyin: pinyin || undefined,
      jyutping: jyutping || undefined,
    });
    resetForm();
    onClose();
  };

  function handleClose() {
    resetForm();
    onClose();
  };

  async function handleSuggestTranslation() {
    setSuggestionLoading(true);
    try {
      const translation = await suggestTranslation(apiKey, english, renewApiKey);
      console.log(translation);
      setCantonese(translation.hanzi || '');
      setJyutping(translation.jyutping || '');
      setPinyin(translation.pinyin || '');
    } finally {
      setSuggestionLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={window.innerWidth < 600}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Add a Word
          <IconButton onClick={handleClose} color="inherit" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="English"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            required
            autoFocus
            fullWidth
            margin="normal"
          />
          <TextField
            label="中文"
            value={cantonese}
            onChange={(e) => setCantonese(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Pinyin"
            value={pinyin}
            onChange={(e) => setPinyin(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Jyutping"
            value={jyutping}
            onChange={(e) => setJyutping(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={handleSuggestTranslation} loading={suggestionLoading} disabled={!english}>Suggest Translation</Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

function UpdateVocabDialog({
  vocab,
  onSubmit,
  onClose,
}: {
  vocab: Vocab | null,
  onSubmit: (vocab: Vocab) => void,
  onClose: () => void,
}): React.ReactElement {
  const apiKey = useGemini();
  const renewApiKey = useGeminiDispatch();

  const [ english, setEnglish ] = useState('');
  const [ cantonese, setCantonese ] = useState('');
  const [ pinyin, setPinyin ] = useState('');
  const [ jyutping, setJyutping ] = useState('');
  const [ suggestionLoading, setSuggestionLoading ] = useState(false);

  useEffect(() => {
    if (vocab) {
      setEnglish(vocab.english);
      setCantonese(vocab.cantonese || '');
      setPinyin(vocab.pinyin || '');
      setJyutping(vocab.jyutping || '');
    }
  }, [ vocab ]);

  function resetForm() {
    setEnglish('');
    setCantonese('');
    setPinyin('');
    setJyutping('');
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (vocab) {
      onSubmit({
        ...vocab,
        english,
        cantonese: cantonese || undefined,
        pinyin: pinyin || undefined,
        jyutping: jyutping || undefined,
      });
    }
    resetForm();
    onClose();
  };

  function handleClose() {
    resetForm();
    onClose();
  };

  async function handleSuggestTranslation() {
    setSuggestionLoading(true);
    try {
      const translation = await suggestTranslation(apiKey, english, renewApiKey);
      console.log(translation);
      setCantonese(translation.hanzi || '');
      setJyutping(translation.jyutping || '');
      setPinyin(translation.pinyin || '');
    } finally {
      setSuggestionLoading(false);
    }
  };

  return (
    <Dialog
      open={vocab !== null}
      onClose={handleClose}
      fullScreen={window.innerWidth < 600}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Edit Word
          <IconButton onClick={handleClose} color="inherit" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="English"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            required
            autoFocus
            fullWidth
            margin="normal"
          />
          <TextField
            label="中文"
            value={cantonese}
            onChange={(e) => setCantonese(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Pinyin"
            value={pinyin}
            onChange={(e) => setPinyin(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Jyutping"
            value={jyutping}
            onChange={(e) => setJyutping(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={handleSuggestTranslation} loading={suggestionLoading} disabled={!english}>Suggest Translation</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

function DeleteVocabDialog({
  vocab,
  onSubmit,
  onClose,
}: {
  vocab: Vocab | null,
  onSubmit: (vocab: Vocab) => void,
  onClose: () => void,
}): React.ReactElement {
  function handleSubmit() {
    if (vocab) {
      onSubmit(vocab);
    }
    onClose();
  };

  function handleClose() {
    onClose();
  };

  return (
    <Dialog
      open={vocab !== null}
      onClose={handleClose}
      fullScreen={window.innerWidth < 600}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Delete Word
          <IconButton onClick={handleClose} color="inherit" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{vocab?.english}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
