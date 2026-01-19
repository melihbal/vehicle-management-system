import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTable } from './vehicle-table';

describe('VehicleTable', () => {
  let component: VehicleTable;
  let fixture: ComponentFixture<VehicleTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
