export interface StorageClient {
  saveVocab(vocab: Vocab): Promise<void>;
  deleteVocab(vocab: Vocab): Promise<void>;
  listVocab(): Promise<Vocab[]>;
}

export type Toast = {
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export interface ToastDispatch {
  addToast(toast: Toast): void;
}

export type Vocab = VocabDetails & {
  id: string;
}

export type VocabDetails = {
  english: string;
  cantonese?: string;
  pinyin?: string;
  jyutping?: string;
}

export interface VocabDispatch {
  requestAdd(): void;
  requestUpdate(vocab: Vocab): void;
  requestDelete(vocab: Vocab): void;
}

export type VocabLibrary = {
  loaded: boolean;
  vocab: Vocab[];
}
