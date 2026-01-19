import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCreate } from './vehicle-create';

describe('VehicleCreate', () => {
  let component: VehicleCreate;
  let fixture: ComponentFixture<VehicleCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
