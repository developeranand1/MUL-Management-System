import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLevelUsersComponent } from './admin-level-users.component';

describe('AdminLevelUsersComponent', () => {
  let component: AdminLevelUsersComponent;
  let fixture: ComponentFixture<AdminLevelUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLevelUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLevelUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
