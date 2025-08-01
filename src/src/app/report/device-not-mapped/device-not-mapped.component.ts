import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';
import { DatePipe } from '@angular/common';
import { ExcelService, ExcelServiceXlsx } from '@app/_services/excel.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-device-not-mapped',
  templateUrl: './device-not-mapped.component.html',
  styleUrls: ['./device-not-mapped.component.less']
})
export class DeviceNotMappedComponent implements OnInit {
  @ViewChild('exampleModal7', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  @ViewChild('qrCode', { static: true }) exampleModalRef1: ElementRef;
  @ViewChild('fileInput')
  myInputVariable: ElementRef;
  filesToUpload: Array<File> = [];
  devices = null;
  p: number = 1;
  searchText;
  file: File;
  qrCode=false;
  arrayBuffer: any;
  submitted = false;
  loading = false;
  isEdit = false;
  editDeviceData: Device;
  showedit=false;
  showdelete=false;
  showButton=false;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  showModal1: boolean;
  isChecked;
  inActive = false;
  active = false;
  date  = new Date();
  selectedRow : Number;
  setClickedRow : Function;
  currentFile: File;
  workbook: any;
  sheets: any;
  sheet_names: any;
  sheet_name: string;
  sheetNameCount: number;
  itemsPerPage = 50;
  status: any;
  qrData: string;
  deviceID: String;
  // noSpacePattern="^(?=.*[0-9])(?=.*[0-9])([0-9]+)$";
  noSpacePattern= "^[a-zA-Z0-9.]*$"
  userRecord: any;
  showDeleteDevice=true;
  showEditDevice=true;
  showAddDevice=true;
  uploadedData: any;
  response: any;
  data : any;
  
  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private http: HttpClient,
    )
     {
      this.setClickedRow = function(index){
        this.selectedRow = index;
        
    }
 
      
     }

  ngOnInit() {
    this.createUserLOgs();
    this.userRecord = JSON.parse(localStorage.getItem('user'));
      if (this.userRecord.roleMenus.device.add == true) {
      this.showAddDevice = false;
    }
    if (this.userRecord.roleMenus.device.edit == true) {
      this.showEditDevice = false;
    }
    {
      if (this.userRecord.roleMenus.device.delete == true) {
        this.showDeleteDevice = false;
      }
     
    }
    if(this.userRecord.roleMenus.device.edit == false && this.userRecord.roleMenus.device.delete == false)
   {
    this.showButton=true;
   }
   
    this.getDeviceData();

  }

  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"REPORT",
        "function":"DEVICE NOT MAPPED",
        "type":"web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {    
         this.status=data['status'];
         console.log("status",this.status);
      },
        error => {
          this.toastr.error(error);
        })
    }
 
  getDeviceData(){
    this.accountService.getUnmappedDevices()
    .pipe(first())
    .subscribe(devices => {
      let response:any = devices;
      if(response.msg === 'Success'){
        this.devices = response.data;
        //  this.devices = this.devices.docs.filter(it => it.status == 'Active')
        this.inActive = true; 
      }
    });
  }

  qrCodeGen(deviceID: String, devicesim: String, devicereceiptDate: Date, category: string) {
    this.showModal1=true;
    this.qrCode = true;
    var mngDate = new Date(devicereceiptDate);
    var mgDate = mngDate.getDate()+'-'+(1+mngDate.getMonth())+'-'+mngDate.getFullYear();
    // var mgDate = mngDate.getDate()+'-'+mngDate.getMonth()+'-'+mngDate.getFullYear();
    this.qrData = deviceID+', '+devicesim+', '+mgDate+', '+category;
    this.deviceID = deviceID;
  }

}
