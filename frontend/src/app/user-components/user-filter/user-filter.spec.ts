import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFilter } from './user-filter';

describe('UserFilter', () => {
  let component: UserFilter;
  let fixture: ComponentFixture<UserFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
