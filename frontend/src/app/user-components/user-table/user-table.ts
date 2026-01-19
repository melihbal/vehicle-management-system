import { Component, Input } from '@angular/core';
import { UserDisplay, Vehicle } from '../../model';
import { DxDataGridModule } from 'devextreme-angular';

@Component({
  standalone: true,
  selector: 'app-user-table',
  imports: [DxDataGridModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css'
})
export class UserTable {
  @Input() users: UserDisplay[] = [];
}
