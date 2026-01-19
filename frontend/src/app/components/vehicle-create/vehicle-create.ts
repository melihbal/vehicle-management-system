import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DxButtonComponent, DxTextBoxComponent,DxDateBoxComponent } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { UserActionService } from '../../services/user-action.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vehicle-create',
  imports: [DxButtonComponent, DxTextBoxComponent, DxDateBoxComponent, CommonModule],
  templateUrl: './vehicle-create.html',
  styleUrl: './vehicle-create.css'
})

export class VehicleCreate {

  constructor(
    private actionService:UserActionService,
    private http:HttpClient
  ){}

  username: string = "";

  ngOnInit(): void {
    this.http.get<any>('http://localhost:5027/api/User/Me', { withCredentials: true })
      .subscribe({
        next: (user) => {
          this.username = user.username;
        },
        error: (err) => {
          console.error("Not logged in or token expired", err);
        }
      })
  }

  @Input() showTextBoxCreate!: boolean;
  @Output() showTextBoxCreateChange = new EventEmitter<boolean>();  

  @Input() inputValueIdCreate: string = '';
  @Output() inputValueIdCreateChange = new EventEmitter<string>();

  @Input() inputValuePlakaCreate: string = '';
  @Output() inputValuePlakaCreateChange = new EventEmitter<string>();

  @Input() inputValueHizCreate: string = '';
  @Output() inputValueHizCreateChange = new EventEmitter<string>();

  @Input() inputValueKmCreate: string = '';
  @Output() inputValueKmCreateChange = new EventEmitter<string>();

  @Input() inputValueDateCreate: Date = new Date();
  @Output() inputValueDateCreateChange = new EventEmitter<Date>();

  @Input() showWarningCreate: boolean = false;
  @Input() warningMessageCreate: string = '';

  @Output() clickCreate = new EventEmitter<any>();
  @Output() clickAdd = new EventEmitter<any>();

  onIdChange(value: string) {
    this.inputValueIdCreateChange.emit(value);
  }
  onPlakaChange(value: string) {
    this.inputValuePlakaCreateChange.emit(value);
  }
  onHizChange(value: string) {
    this.inputValueHizCreateChange.emit(value);
  }
  onKmChange(value: string) {
    this.inputValueKmCreateChange.emit(value);
  }
  onDateChange(value: any) {
    this.inputValueDateCreate = value as Date;
  }

  onClickCreate(event: any) {
    this.clickCreate.emit(event);
    this.actionService.logAction(this.username, "Clicked the Create User button.");
  }
  onClickAdd(event: any) {
    this.clickAdd.emit(event);
  }
}