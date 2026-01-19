import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDelete } from './vehicle-delete';

describe('VehicleDelete', () => {
  let component: VehicleDelete;
  let fixture: ComponentFixture<VehicleDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
