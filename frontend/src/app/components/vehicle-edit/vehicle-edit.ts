import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DxButtonModule, DxDateBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-edit',
  imports: [DxButtonModule, DxDateBoxModule, DxTextBoxModule, CommonModule],
  templateUrl: './vehicle-edit.html',
  styleUrl: './vehicle-edit.css'
})
export class VehicleEdit {
  @Input() showTextBoxEdit!: boolean;
  @Output() showTextBoxEditChange = new EventEmitter<boolean>();

  // The ID & date to find
  @Input() inputValueIdEdit!: string;
  @Output() inputValueIdEditChange = new EventEmitter<string>();

  @Input() inputValueDateEdit!: Date;
  @Output() inputValueDateEditChange = new EventEmitter<Date>();

  // After “Find”, show the second group
  @Input() showEditGroup!: boolean;
  @Output() showEditGroupChange = new EventEmitter<boolean>();

  // Fields in the edit form
  @Input() inputValueEditGroupHiz!: string;
  @Output() inputValueEditGroupHizChange = new EventEmitter<string>();

  @Input() inputValueEditGroupKm!: string;
  @Output() inputValueEditGroupKmChange = new EventEmitter<string>();

  // Warnings
  @Input() showWarningEdit!: boolean;
  @Input() warningMessageEdit!: string;
  @Output() showWarningEditChange = new EventEmitter<boolean>();

  // Actions
  @Output() clickEditVehicle = new EventEmitter<void>();
  @Output() clickFindToEdit   = new EventEmitter<void>();
  @Output() clickConfirmEdit  = new EventEmitter<void>();

  onToggleShowTextBox(){
    this.showTextBoxEditChange.emit(!this.showTextBoxEdit);
    this.showWarningEditChange.emit(false);
    if (this.showTextBoxEdit) {
      this.showEditGroupChange.emit(!this.showTextBoxEdit)
    }
  }

  onIdChange(value: string) {
    this.inputValueIdEditChange.emit(value);
  }
  
  onDateChange(value: Date | string | number | null) {
    if (value instanceof Date) {
      this.inputValueDateEditChange.emit(value);
    } else {
      console.warn("Invalid date value received:", value);
    }
  }

  onToggleEditGroup(value: boolean) {
    this.showEditGroupChange.emit(value);
  }

  onHizChange(value: string) {
    this.inputValueEditGroupHizChange.emit(value);
  }

  onKmChange(value: string) {
    this.inputValueEditGroupKmChange.emit(value);
  }

  onClickEditVehicle() {
    this.clickEditVehicle.emit();
  }

  onClickFindToEdit() {
    this.clickFindToEdit.emit();
  }

  onClickConfirmEdit() {
    this.clickConfirmEdit.emit();
  }
}
