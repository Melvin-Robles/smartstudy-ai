import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { API_BASE_URL } from './api.config';
import { StudyStore } from './study.store';

describe('StudyStore', () => {
  let store: StudyStore;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudyStore, provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(StudyStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the authenticated user documents from the API', () => {
    store.loadDocuments().subscribe();
    const request = http.expectOne(`${API_BASE_URL}/documents`);
    request.flush([{
      id: 'doc-1',
      originalName: 'notas.txt',
      mimeType: 'text/plain',
      sizeBytes: 2048,
      status: 'READY',
      failureReason: null,
      createdAt: '2026-11-27T12:00:00.000Z',
      updatedAt: '2026-11-27T12:00:00.000Z',
    }]);

    expect(store.documents().length).toBe(1);
    expect(store.documents()[0].name).toBe('notas.txt');
    expect(store.documents()[0].status).toBe('READY');
  });

  it('sends a document as multipart form data', fakeAsync(() => {
    const file = new File(['contenido'], 'notas.txt', { type: 'text/plain' });
    store.upload(file).subscribe();
    const request = http.expectOne(`${API_BASE_URL}/documents`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body instanceof FormData).toBeTrue();
    request.flush({
      id: 'doc-2',
      originalName: 'notas.txt',
      mimeType: 'text/plain',
      sizeBytes: 9,
      status: 'UPLOADED',
      failureReason: null,
      createdAt: '2026-11-27T12:00:00.000Z',
      updatedAt: '2026-11-27T12:00:00.000Z',
    });
    tick();
    const statusRequest = http.expectOne(`${API_BASE_URL}/documents/doc-2`);
    statusRequest.flush({
      id: 'doc-2',
      originalName: 'notas.txt',
      mimeType: 'text/plain',
      sizeBytes: 9,
      status: 'READY',
      failureReason: null,
      createdAt: '2026-11-27T12:00:00.000Z',
      updatedAt: '2026-11-27T12:00:00.000Z',
    });
    expect(store.documents()[0].id).toBe('doc-2');
  }));
});
