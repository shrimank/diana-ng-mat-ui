import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnansweredComponent } from './unanswered.component';

describe('UnansweredComponent', () => {
  let component: UnansweredComponent;
  let fixture: ComponentFixture<UnansweredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnansweredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnansweredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
