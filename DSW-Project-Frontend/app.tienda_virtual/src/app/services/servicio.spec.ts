import { TestBed } from '@angular/core/testing';

import { Servicio } from './servicio.service.js';

describe('Servicio', () => {
  let service: Servicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Servicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
