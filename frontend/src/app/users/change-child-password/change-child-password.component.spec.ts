import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeChildPasswordComponent } from './change-child-password.component';

describe('ChangeChildPasswordComponent', () => {
  let component: ChangeChildPasswordComponent;
  let fixture: ComponentFixture<ChangeChildPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeChildPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeChildPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
