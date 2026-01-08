import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDownlineComponent } from './admin-downline.component';

describe('AdminDownlineComponent', () => {
  let component: AdminDownlineComponent;
  let fixture: ComponentFixture<AdminDownlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDownlineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDownlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
