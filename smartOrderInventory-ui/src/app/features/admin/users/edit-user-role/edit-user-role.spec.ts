import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserRoleComponent } from './edit-user-role';

describe('EditUserRole', () => {
  let component: EditUserRoleComponent;
  let fixture: ComponentFixture<EditUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserRoleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
