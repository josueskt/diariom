import { TestBed } from '@angular/core/testing';

import { ExportarExcel } from './exportar-excel';

describe('ExportarExcel', () => {
  let service: ExportarExcel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportarExcel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
