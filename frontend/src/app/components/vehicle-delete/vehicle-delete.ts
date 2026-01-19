import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DxButtonModule, DxTextBoxModule, DxDateBoxModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-delete',
  imports: [DxButtonModule, DxDateBoxModule, DxTextBoxModule, CommonModule],
  templateUrl: './vehicle-delete.html',
  styleUrl: './vehicle-delete.css'
})
export class VehicleDelete {
  @Input() showTextBoxDelete!: boolean;
  @Input() inputValueIdDelete!: string;
  @Input() inputValueDateDelete!: Date;
  @Input() showWarningDelete!: boolean;
  @Input() warningMessageDelete!: string;

  @Output() showTextBoxDeleteChange = new EventEmitter<boolean>();
  @Output() inputValueIdDeleteChange = new EventEmitter<string>();
  @Output() inputValueDateDeleteChange = new EventEmitter<Date>();
  @Output() showWarningDeleteChange = new EventEmitter<boolean>();

  @Output() clickDeleteVehicle = new EventEmitter<void>();
  @Output() clickDeleteSub = new EventEmitter<void>();


  onInputValueIdChange(value: string) {
    this.inputValueIdDeleteChange.emit(value);
  }

  onInputValueDateChange(value: string | number | Date | null) {
    if (value instanceof Date) {
      this.inputValueDateDeleteChange.emit(value);
    } else {
      console.warn("Invalid date value received:", value);
    }
  }

  onToggleShowTextBox() {
    this.showWarningDeleteChange.emit(false);
    this.showTextBoxDeleteChange.emit(!this.showTextBoxDelete);
  }

  onClickDeleteSub() {
    this.clickDeleteSub.emit();
  } 

  onClickDeleteVehicle() {
    this.clickDeleteVehicle.emit();
  }

  }

