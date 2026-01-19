import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDelete } from './user-delete';

describe('UserDelete', () => {
  let component: UserDelete;
  let fixture: ComponentFixture<UserDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
