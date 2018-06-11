import { TestBed, inject } from '@angular/core/testing';

import { Iwe7JssdkService } from './iwe7-jssdk.service';

describe('Iwe7JssdkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Iwe7JssdkService]
    });
  });

  it('should be created', inject([Iwe7JssdkService], (service: Iwe7JssdkService) => {
    expect(service).toBeTruthy();
  }));
});
