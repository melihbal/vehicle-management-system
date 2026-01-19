import { Component } from '@angular/core';
import { DxDropDownBoxModule, DxTreeViewComponent, DxDropDownBoxComponent } from 'devextreme-angular';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vehicle-filter',
  imports: [DxDropDownBoxModule, DxTreeViewComponent, DxDropDownBoxComponent],
  templateUrl: './vehicle-filter.html',
  styleUrl: './vehicle-filter.css'
})
export class VehicleFilter {
  @Input() treeDataSource: any[] = [];
  @Input() treeBoxValue: any = null;
  @Input() isTreeBoxOpened: boolean = false;

  @Output() treeBoxValueChange = new EventEmitter<any>();
  @Output() isTreeBoxOpenedChange = new EventEmitter<boolean>();
  @Output() treeViewSelectionChange = new EventEmitter<any>();

  onValueChanged(e: any) {
    this.treeBoxValueChange.emit(e.value);
  }

  onOptionChanged(e: any) {
    if (e.name === 'value') {
      this.treeBoxValueChange.emit(e.value);

    }
  }

  onItemSelectionChanged(e: any) {
    this.treeViewSelectionChange.emit(e);
    this.isTreeBoxOpened = false;
    this.isTreeBoxOpenedChange.emit(false);
    
  }
}
