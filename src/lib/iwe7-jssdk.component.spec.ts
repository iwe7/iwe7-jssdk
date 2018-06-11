import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Iwe7JssdkComponent } from './iwe7-jssdk.component';

describe('Iwe7JssdkComponent', () => {
  let component: Iwe7JssdkComponent;
  let fixture: ComponentFixture<Iwe7JssdkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Iwe7JssdkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Iwe7JssdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
