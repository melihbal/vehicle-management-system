import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../../model';
import { DxDropDownBoxComponent } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DxDataGridModule, DxDropDownBoxModule, DxTreeViewModule,
  DxButtonModule, DxTextBoxModule, DxDateBoxModule, DxDateRangeBoxModule, DxListModule
} from 'devextreme-angular';
import { VehicleTable } from '../../components/vehicle-table/vehicle-table';
import { VehicleFilter } from '../../components/vehicle-filter/vehicle-filter';
import { VehicleCreate } from '../../components/vehicle-create/vehicle-create';
import { VehicleDelete } from '../../components/vehicle-delete/vehicle-delete';
import { VehicleEdit } from '../../components/vehicle-edit/vehicle-edit';
import { VehicleReport } from '../../components/vehicle-report/vehicle-report';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule, FormsModule,
    DxDataGridModule, DxDropDownBoxModule, DxTreeViewModule,
    DxButtonModule, DxTextBoxModule, DxDateBoxModule, DxDateRangeBoxModule, DxListModule,
    VehicleTable, VehicleFilter, VehicleCreate, VehicleDelete, VehicleEdit, VehicleReport
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  protected readonly title = signal('VehicleSystem');


  @ViewChild('reportDropDownBox') dropDownBox!: DxDropDownBoxComponent;

  showTextBoxCreate = false;
  showTextBoxDelete = false;
  showTextBoxEdit = false;
  showTextBoxReport = false;
  showTextBoxReportEmpty = false;
  showEditGroup = false;

  showWarningReport: boolean = false;
  showWarningCreate: boolean = false;
  showWarningDelete: boolean = false;
  showWarningEdit: boolean = false;

  warningMessageCreate: string = 'Warning: The ID and Lisence Plate values do not match';
  warningMessageDelete: string = 'Warning: No vehicle matching the properties found';
  warningMessageEdit: string = 'Warning: No vehicle matching the properties found';
  warningMessageReport: string = 'Please select at least one vehicle for the report';



  currentIdToDisplay : number = -1;
  vehicleToEdit: Vehicle = {
    aracId: 0,
    aracPlaka: '',
    hiz: 0,
    kmSayaci: 0,
    veriTarihi: ''
  };

  flatDataSource: { ID: number; name: number | string }[] = [];
  selectedVehicleIds: number[] = [];
  isDropDownOpen: boolean = false;
  

  responseCreate: any;
  responseDelete: any;
  responseEdit : any;
  responseReport: any;

  inputValueDateCreate: Date = new Date();
  inputValueIdCreate: string = '';
  inputValuePlakaCreate: string = '';
  inputValueHizCreate: string = '';
  inputValueKmCreate: string = '';

  inputValueIdDelete: string = '';
  inputValueDateDelete: Date = new Date();

  inputValueIdEdit: string = '';
  inputValueDateEdit: Date = new Date();

  inputValueEditGroupHiz: string = '';
  inputValueEditGroupKm: string = '';

  startDateReport: Date = new Date();
  endDateReport: Date = new Date();


  uniqueIds: number[] = [];
  uniqueIdsLisencePlate: string = "";
  treeDataSource: { ID: number; name: string | number; categoryId: null }[] = [];
  vehicles: Vehicle[] = []; // Now using Vehicle interface
  reportData: any[] = [];

  apiUrl = 'http://localhost:5027/api/Vehicle';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.refreshTokens();
    this.loadVehicles();
  }



  loadVehicles() {
    this.http.get<Vehicle[]>(`${this.apiUrl}/GetVehicles`)
      .subscribe({
        next: (data) => {
          this.vehicles = data;
  
          this.uniqueIds = Array.from(new Set(this.vehicles.map(v => v.aracId))).sort((a, b) => a - b);


  
          this.treeDataSource = [
            { ID: -1, name: 'Show All', categoryId: null },
            ...this.uniqueIds.map(id => ({ ID: id, name: id, categoryId: null }))
          ];
  
          this.flatDataSource = this.uniqueIds
            .sort((a, b) => a - b)
            .map(id => ({
              ID: id,
              name: id
            }));
  
          console.log('FlatDataSource:', this.flatDataSource);
        },
        error: err => console.error(err)
      });
  }
  
  

  specificVehicles : Vehicle[] = [];
  specificVehicle(id : number) {
    if (id === -1) {
      this.http.get<Vehicle[]>(`${this.apiUrl}/GetVehicles`)
      .subscribe({
        next: (data) => {
          this.specificVehicles = data;
          this.vehicles = this.specificVehicles;
          console.log('Vehicles loaded2:', data);
        },
        error: (error) => {
          console.error('Error loading vehicles:', error);
        }
      })
    } else {
    this.http.get<Vehicle[]>(`${this.apiUrl}/GetSpesific?vehicleId=${id}`)
      .subscribe({
        next: (data) => {
          this.specificVehicles = data;
          this.vehicles = this.specificVehicles;
          console.log('Vehicles loaded3:', data);
        },
        error: (error) => {
          console.error('Error loading vehicles:', error);
        }
      })
    }
      
  }





  treeBoxValue: any = null; 
  isTreeBoxOpened = false;



  syncTreeViewSelection() {}



  onTreeBoxOptionChanged(event: any) {
    if (event.name === 'value') {
      this.treeBoxValue = event.value;
      // You can call syncTreeViewSelection() here if needed
    }
  }


  onMultipleSelectionChanged(e: any) {
    // This is called when the dropdown value changes
    console.log('Dropdown value changed:', e.value);
  }

  onListSelectionChanged(selectedKeys: number[]) {
    this.selectedVehicleIds = selectedKeys;
  }

  
  lastSelectedId: number | null = null;

  treeView_itemSelectionChanged(event: any) {
    const selectedNode = event.node;
    if (selectedNode) {

      const chosenID = selectedNode.key;
      this.currentIdToDisplay = chosenID;

      if (this.lastSelectedId === chosenID) {
        return; // Do nothing if same ID is selected again
      }

      this.lastSelectedId = chosenID;
      this.treeBoxValue = chosenID; // The key (ID) of the selected TreeView item
      this.isTreeBoxOpened = false; // Close the dropdown
      this.specificVehicle(chosenID);
    }
  }

  clickCreate(e: any): void {
    this.showTextBoxCreate = !this.showTextBoxCreate;
    this.inputValueIdCreate = "";
    this.showWarningCreate = false;
    console.log("Create Button clicked.")
  }

  clickDeleteVehicle(e: any): void {
    this.showTextBoxDelete = !this.showTextBoxDelete;
    this.inputValueIdDelete = "";
    this.showWarningDelete = false;
    console.log("Delete Vehicle Button clicked.")
  }


  clickEditVehicle(): void {
    this.showTextBoxEdit = !this.showTextBoxEdit;
    this.inputValueIdEdit = "";
    if (!this.showTextBoxEdit) {
      this.showEditGroup = false;
    }
    this.showWarningEdit = false;
    console.log("Edit Vehicle Button clicked.");
  }
  
  clickReportVehicle(e: any): void {
    this.showTextBoxReport = !this.showTextBoxReport;
    this.showWarningReport = false;
    console.log("Report button pressed.");
  }

  

  clickAdd(e: any):void {

    const idInput    = this.inputValueIdCreate.trim();
    const plateInput = this.inputValuePlakaCreate.trim();
    const speedInput = this.inputValueHizCreate.trim();
    const kmInput    = this.inputValueKmCreate.trim();
    const dateInput  = this.inputValueDateCreate.toISOString().split('T')[0];

    if (!idInput || !plateInput || !speedInput || !kmInput) {
      this.warningMessageCreate = "All fields are required.";
      this.showWarningCreate = true;
      return;
    }

    if (isNaN(+idInput) || isNaN(+speedInput) || isNaN(+kmInput)) {
      this.warningMessageCreate = "ID, Speed and Km must be numbers.";
      this.showWarningCreate = true;
      return;
    }



    const newVehicle: Vehicle = {
      aracId: parseInt(this.inputValueIdCreate),
      aracPlaka: this.inputValuePlakaCreate,
      hiz: parseInt(this.inputValueHizCreate),
      kmSayaci: parseInt(this.inputValueKmCreate),
      veriTarihi: this.inputValueDateCreate.toISOString().split('T')[0]
    }

    const foundVehicle = this.vehicles.find(vehicle => vehicle.aracId === parseInt(this.inputValueIdCreate));
    if (foundVehicle) {
      if (foundVehicle.aracPlaka === newVehicle.aracPlaka) {
        this.createVehicle(newVehicle);
        this.showWarningCreate = false;

      } else {
        this.inputValueHizCreate = "";
        this.inputValueIdCreate = "";
        this.inputValueKmCreate = "";
        this.inputValuePlakaCreate = "";

        this.showWarningCreate = true;
      }
    } else {
    this.createVehicle(newVehicle);
    this.showWarningCreate = false;
    }
    ;
  }

  clickDeleteSub(e: any): void {
    const dateString = this.inputValueDateDelete.toISOString().split('T')[0];
    const foundVehicle = this.vehicles.find(vehicle => vehicle.aracId === parseInt(this.inputValueIdDelete) &&
      vehicle.veriTarihi === dateString);

    if (foundVehicle) {
      this.deleteVehicle(parseInt(this.inputValueIdDelete), dateString);
      this.showWarningDelete = false;
    } else {
      this.showWarningDelete = true;
    }   
  }

  clickFindToEdit(): void {
    const dateString = this.inputValueDateEdit.toISOString().split('T')[0];
    const foundVehicle = this.vehicles.find(v =>
      v.aracId === parseInt(this.inputValueIdEdit, 10) &&
      v.veriTarihi === dateString
    );
  
    if (foundVehicle) {
      // Pre‑fill the edit fields
      this.inputValueEditGroupHiz = foundVehicle.hiz.toString();
      this.inputValueEditGroupKm  = foundVehicle.kmSayaci.toString();
      this.inputValueDateEdit      = new Date(foundVehicle.veriTarihi);
  
      // Store the whole object in case you need other props
      this.vehicleToEdit = foundVehicle;
  
      // Show the edit form, clear any warning
      this.showEditGroup  = true;
      this.showWarningEdit = false;
    } else {
      // No match: show warning and hide form
      this.showWarningEdit = true;
      this.showEditGroup   = false;
    }
  }
  

  clickConfirmEdit() : void {
    const tempVehicle: Vehicle = {
        aracId: parseInt(this.inputValueIdEdit),
        aracPlaka: this.vehicleToEdit.aracPlaka,
        hiz: parseInt(this.inputValueEditGroupHiz),
        kmSayaci: parseFloat(this.inputValueEditGroupKm),
        veriTarihi: this.inputValueDateEdit.toISOString().split('T')[0]
      }
    this.editVehicle(tempVehicle);
    this.showWarningEdit = false;
    this.showEditGroup = false;
    this.showTextBoxEdit = false;

  }

  clickListReport(e:any) :void {
    if (this.selectedVehicleIds.length === 0) {
      this.showWarningReport = true;
      console.log(this.selectedVehicleIds);
    } else {
      this.showWarningReport = false;
      console.log(this.selectedVehicleIds);
      const dateStringStart = this.startDateReport.toISOString().split('T')[0];
      const dateStringEnd = this.endDateReport.toISOString().split('T')[0];
      this.createReport(this.selectedVehicleIds, dateStringStart, dateStringEnd);
    }
  }

  refreshTokens(){
    this.http.post('http://localhost:5027/api/User/RefreshToken', {}, { withCredentials: true})
      .subscribe({
        next: () => {
          console.log("Tokens refreshed.")
        },
        error: (err) => {
          console.error(err);
        }
      });
  }



  createVehicle(vehicle: Vehicle) {
    this.http.post('http://localhost:5027/api/Vehicle/CreateVehicle', vehicle)
      .subscribe({
        next: (res) => { 
          this.responseCreate = res,
          console.log("Vehicle Added.", vehicle), 
          //this.inputValueDateCreate = new Date();
          this.inputValueHizCreate = "";
          this.inputValueIdCreate = "";
          this.inputValueKmCreate = "";
          this.inputValuePlakaCreate = "";

          this.specificVehicle(this.currentIdToDisplay);
        },
        error: (err) => {
          console.error('Error:', err)
        }
      });
  }

  deleteVehicle(aracId: number, entryDate: string) {
    const url = `http://localhost:5027/api/Vehicle/DeleteEntry?aracId=${aracId}&date=${entryDate}`;
    this.http.delete(url)
      .subscribe({
        next: (res) => {
          this.responseDelete = res,
          console.log("Vehicle Deleted", res),
          this.inputValueIdDelete = "";
          this.specificVehicle(this.currentIdToDisplay);
        },
        error: (err) => {
          console.error('Error:', err)
        }
      });
  }

  editVehicle(vehicle: Vehicle){
    const url = `http://localhost:5027/api/Vehicle/EditEntry`;
    this.http.put(url, vehicle).subscribe({
      next: () => {this.responseEdit = 'Vehicle updated successfully!',
        this.specificVehicle(this.currentIdToDisplay);
      },
      error: err => this.responseEdit = 'Update failed: ' + err.message
    })
  }

  createReport(vehicleIds: number[], startingDate: string, endDate: string) {
    const params = vehicleIds.map(id => `ids=${id}`).join('&');
    const url = `http://localhost:5027/api/Vehicle/CreateReport?startingDate=${startingDate}&endingDate=${endDate}&${params}`;

    console.log(url);
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        console.log(data);
        if (data.length === 0) {
          
          this.noVehicleFoundReport();
          return;
        }
        console.log('Report created successfully')
        this.showTextBoxReportEmpty = true;
        this.responseReport = 'Report created successfully';
        this.reportData = data;
      },
      error: err => this.responseReport = 'Report creation failed: ' + err.message
    });
  }

  noVehicleFoundReport(){
    this.showTextBoxReportEmpty = false;
    this.warningMessageReport = 'Invalid entry date.'
    this.showWarningReport = true;
  }
}