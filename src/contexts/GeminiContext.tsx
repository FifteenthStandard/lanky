import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const GeminiContext = createContext<string | undefined>(undefined);
const GeminiDispatchContext = createContext<(() => Promise<string>) | undefined>(undefined);

function getInitialState(): string {
  const storedApiKey = localStorage.getItem('geminiApiKey');
  return storedApiKey || '';
};

function setApiKey(apiKey: string): void {
  localStorage.setItem('geminiApiKey', apiKey);
};

export function GeminiProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [ state, setState ] = useState(getInitialState());
  const [ apiKeyDialogOpen, setApiKeyDialogOpen ] = useState(false);
  const promiseRef = useRef<Promise<string> | undefined>(undefined);
  const resolveRef = useRef<((value: string) => void) | undefined>(undefined);

  const onSubmitSetApiKey = useCallback((apiKey: string) => {
    setState(apiKey);
    setApiKey(apiKey);
    setApiKeyDialogOpen(false);
    if (resolveRef.current) {
      resolveRef.current(apiKey);
      promiseRef.current = undefined;
    }
  }, []);

  const requestNewApiKey = useMemo(() => {
    return () => {
      if (!promiseRef.current) {
        setApiKeyDialogOpen(true);
        promiseRef.current = new Promise<string>((resolve) => {
          resolveRef.current = resolve;
        });
      }
      return promiseRef.current;
    };
  }, [ promiseRef, resolveRef ]);

  return (
    <GeminiContext.Provider value={state}>
      <GeminiDispatchContext.Provider value={requestNewApiKey}>
        <ApiKeyDialog
          open={apiKeyDialogOpen}
          onSubmit={onSubmitSetApiKey}
          onClose={() => setApiKeyDialogOpen(false)}
        />
        {children}
      </GeminiDispatchContext.Provider>
    </GeminiContext.Provider>
  );
};

export function useGemini(): string {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
};

export function useGeminiDispatch(): () => Promise<string> {
  const context = useContext(GeminiDispatchContext);
  if (!context) {
    throw new Error('useGeminiDispatch must be used within a GeminiProvider');
  }
  return context;
};

function ApiKeyDialog({
  open,
  onSubmit,
  onClose,
}: {
  open: boolean,
  onSubmit: (apiKey: string) => void,
  onClose: () => void,
}): React.ReactElement {
  const [ apiKey, setApiKey ] = useState('');

  function resetForm() {
    setApiKey('');
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(apiKey);
    resetForm();
    onClose();
  };

  function handleClose() {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={window.innerWidth < 600}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Set Gemini API Key</DialogTitle>
        <DialogContent>
          <TextField
            label="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            autoFocus
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Set
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
