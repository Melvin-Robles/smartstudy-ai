import { StudyStore } from './study.store';

describe('StudyStore', () => {
  it('starts with the MVP document states represented', () => {
    const store = new StudyStore();
    expect(store.documents().map((document) => document.status)).toEqual(['READY', 'PROCESSING', 'FAILED']);
  });

  it('rejects unsupported document extensions', () => {
    const store = new StudyStore();
    expect(() => store.upload(new File(['unsafe'], 'script.exe', { type: 'application/octet-stream' }))).toThrowError('Solo se permiten archivos PDF, DOCX o TXT.');
  });

  it('removes a document and its derived flashcards together', () => {
    const store = new StudyStore();
    store.remove('doc-1');
    expect(store.documents().some((document) => document.id === 'doc-1')).toBeFalse();
    expect(store.flashcards().some((card) => card.documentId === 'doc-1')).toBeFalse();
  });
});
