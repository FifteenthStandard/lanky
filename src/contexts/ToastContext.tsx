import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import {
  Alert,
  Snackbar,
} from '@mui/material';
import type { Toast, ToastDispatch } from '../types';

type ToastWithId = Toast & { id: string };

const ToastContext = createContext<ToastWithId[] | undefined>(undefined);
const ToastDispatchContext = createContext<ToastDispatch | undefined>(undefined);

const initialState: ToastWithId[] = [];

type AddToastAction = {
  type: 'ADD_TOAST';
  payload: ToastWithId;
};

type RemoveToastAction = {
  type: 'REMOVE_TOAST';
  id: string;
};

type ToastAction =
  | AddToastAction
  | RemoveToastAction;

function reduce(state: ToastWithId[], action: ToastAction): ToastWithId[] {
  switch (action.type) {
    case 'ADD_TOAST':
      return [ ...state, action.payload ];

    case 'REMOVE_TOAST':
      return state.filter(toast => toast.id !== action.id);

    default:
      return state;
  }
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [ state, dispatch ] = useReducer(reduce, initialState);

  const activeToast = useMemo(() => state.length > 0 ? state[0] : null, [ state ]);

  const addToast = useCallback((toast: Toast) => {
    const id = new Date().toISOString();
    dispatch({ type: 'ADD_TOAST', payload: { ...toast, id } });
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id });
  }, []);

  const toastDispatch: ToastDispatch = useMemo(() => ({
    addToast,
  }), [ addToast ]);

  const handleDismiss = useCallback(() => {
    if (activeToast) {
      removeToast(activeToast.id);
    }
  }, [ activeToast, removeToast ]);

  return (
    <ToastContext.Provider value={state}>
      <ToastDispatchContext.Provider value={toastDispatch}>
        <ToastSnackbar
          toast={activeToast}
          onDismiss={handleDismiss}
        />
        {children}
      </ToastDispatchContext.Provider>
    </ToastContext.Provider>
  );
};

export function useToastDispatch(): ToastDispatch {
  const context = useContext(ToastDispatchContext);
  if (context === undefined) {
    throw new Error('useToastDispatch must be used within a ToastProvider');
  }
  return context;
};

function ToastSnackbar({
  toast,
  onDismiss,
}: {
  toast: ToastWithId | null,
  onDismiss: () => void,
}) {
  return ( toast &&
    <Snackbar
      open={toast !== null}
      autoHideDuration={5000}
      onClose={onDismiss}
    >
      <Alert
        onClose={onDismiss}
        severity={toast?.severity ?? 'info'}
      >
        {toast?.message}
      </Alert>
    </Snackbar>
  );
};
