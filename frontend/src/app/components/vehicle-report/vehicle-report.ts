import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { DxDateRangeBoxModule } from 'devextreme-angular';
import { DxDropDownBoxModule } from 'devextreme-angular';
import { DxListModule } from 'devextreme-angular';

@Component({
  standalone: true,
  selector: 'app-vehicle-report',
  imports: [
    CommonModule,
    DxButtonModule,
    DxDateRangeBoxModule,
    DxDropDownBoxModule,
    DxListModule,
  ],
  templateUrl: './vehicle-report.html',
  styleUrls: ['./vehicle-report.css']
})
export class VehicleReport {
  @Input() showTextBox = false;
  @Input() showTextBoxEmpty = false;
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Input() flatDataSource: { ID: number; name: number | string }[] = [];
  @Input() selectedVehicleIds: number[] = [];
  @Input() isDropDownOpen = false;
  @Input() reportData: any[] = [];
  @Input() showWarning = false;
  @Input() warningMessage = '';

  @Output() startDateChange = new EventEmitter<Date>();
  @Output() endDateChange   = new EventEmitter<Date>();
  @Output() openReport = new EventEmitter<void>();
  @Output() listReport = new EventEmitter<void>();
  @Output() selectionChanged = new EventEmitter<number[]>();

  onSelectionChanged(e: any) {
    const keys = e.component.option('selectedItemKeys');
    this.selectionChanged.emit(keys);
  }

  handleStartDateChange(value: string | number | Date | null) {
    if (value == null) { return; }
    const date = value instanceof Date ? value : new Date(value);
    this.startDateChange.emit(date);
  }

  handleEndDateChange(value: string | number | Date | null) {
    if (value == null) { return; }
    const date = value instanceof Date ? value : new Date(value);
    this.endDateChange.emit(date);
  }
}
