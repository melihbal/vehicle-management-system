import { Component, Input } from '@angular/core';
import { Vehicle } from '../../model';
import { DxDataGridModule } from 'devextreme-angular';

@Component({
  standalone: true,
  selector: 'app-vehicle-table',
  imports: [DxDataGridModule],
  templateUrl: './vehicle-table.html',
  styleUrl: './vehicle-table.css'
})
export class VehicleTable {
  @Input() vehicles: Vehicle[] = [];
}
