import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEdit } from './vehicle-edit';

describe('VehicleEdit', () => {
  let component: VehicleEdit;
  let fixture: ComponentFixture<VehicleEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
