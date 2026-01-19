import { Component } from '@angular/core';
import { DxDropDownBoxModule, DxTreeViewComponent, DxDropDownBoxComponent, DxAutocompleteModule, DxTextBoxModule, DxButtonModule } from 'devextreme-angular';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-filter',
  standalone: true,
  imports: [DxDropDownBoxModule, DxAutocompleteModule, DxTextBoxModule, DxButtonModule, CommonModule],
  templateUrl: './user-filter.html',
  styleUrl: './user-filter.css'
})
export class UserFilter {

  @Output() usersUpdated = new EventEmitter<string>();
  @Output() clearClicked = new EventEmitter<string>();

  @Input() noSuchUserFound : boolean = false;

  searchInput: string = '';
  warningMessageNoSuchUser = 'Warning: No such user found.';

  onTextBoxValueChanged(e: any) {
    if (e.value === '') {
      console.log("ontextboxvaluechanged", e.value);
      this.clearClicked.emit('');
    }
  }

  onSearchClicked(){
    console.log('searchInput:', this.searchInput);

    this.usersUpdated.emit(this.searchInput);
  }

}


// <app-user-filter
//       [users]="users"
//       [(treeBoxValue)]="treeBoxValue"
//       [(isTreeBoxOpened)]="isTreeBoxOpened"
//       (treeViewSelectionChange)="treeView_itemSelectionChanged($event)"
//       >
//     </app-user-filter>