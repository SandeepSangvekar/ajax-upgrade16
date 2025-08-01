import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AccountService, AlertService } from '@app/_services';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Master } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';
import { ExcelService, ExcelServiceXlsx } from '../../_services/excel.service';
import * as XLSX from 'xlsx';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.less'],
  providers: [DatePipe]
})

export class MachineComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  @ViewChild('fileInput')
  myInputVariable: ElementRef;
  comp = environment.companyID;
  message: string;
  fileToUpload: File = null;
  master = null;
  model = null;
  devices = null;
  variant = null;
  form: FormGroup;
  showMapping = false;

  exceltoJson = {};
  deviceform: FormGroup;
  submitted = false;
  loading = false;
  p: number = 1;
  searchText;
  isEdit = false;
  editMachineData: Master;
  id: string;
  isChecked;
  inActive = false;
  active = false;
  arrayBuffer: any;
  itemsPerPage = 50;
  file: File;
  deviceModel;
  date = new Date()
  deviceid: any;
  qrData: any;
  machineNo: String;
  qrCode = false;
  check: any;
  up: any;
  downloadFile: any;
  checkedStatus: any;
  pinNumber: string;
  deleteMachinedata: any;
  machineMaster: any;
  formData: any;
  filesToUpload: Array<File> = [];
  progress = 0;
  currentFile: File;
  workbook: any;
  sheets: any;
  sheet_names: any;
  sheet_name: string;
  sheetNameCount: number;
  pinNo = environment.labelpinno;
  modeltext: string;

  devicetypeValue: string;
  status: any;
 // noSpacePattern = "^(?=.*[0-9]\.\d)(?=.*[a-zA-Z])([a-zA-Z0-9]+)$";
  noSpacePattern= "^[a-zA-Z0-9.]*$"
  engineNoPattern="^[a-zA-Z0-9./-]*$";
  userRecord: any;
  showDeleteMachine = true;
  showAddMachine = true;
  showModal1: boolean;
  showButton=false;
  uploadedData: any;
  result1: any;

  constructor(private accountService: AccountService,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private http: HttpClient
    ) {}

  ngOnInit() {
    this.createUserLOgs();
    this.userRecord = JSON.parse(localStorage.getItem('user'));
   {
      if (this.userRecord.roleMenus.machine.add == true) {
      this.showAddMachine = false;
    }
  }
    {
    if (this.userRecord.roleMenus.machine.delete == true) {
      this.showDeleteMachine = false;
    }
    else
    {
      this.showMapping = false;
    }
  }
    {
    if (this.userRecord.role == 'production') {
      this.showMapping = true;
      this.showButton=true;
    }
  }
    // if(JSON.parse(localStorage.getItem('user')).role =='qainspector')
    // {
    //   this.showAddMachine=true;
    // }
    this.getDeviceName()
    this.getMachineData();
    //add machine
    this.dropdownData();
    this.form = this.formBuilder.group({
      deviceModel: ['', Validators.required],
      variant: ['', Validators.required],
      engineNumber: ['',[Validators.required,Validators.pattern(this.engineNoPattern)]],
      pinno: ['', [Validators.required, Validators.pattern(this.noSpacePattern)]],
      batterylotno: ['', [Validators.required, Validators.pattern(this.noSpacePattern)]],
      manufacturingDate: ['', Validators.required],
      // deliveryDate: ['', Validators.required],
      //  shipmentDate: ['', Validators.required],
      batteryInstallationDate: ['', Validators.required],
      smartBatch: ['', Validators.required],
      createdBy: [''],
      updatedBy: ['']
    });

    this.deviceform = this.formBuilder.group({
      deviceID: ['', Validators.required],
      devicetype: ['']
    })
    this.form.controls['smartBatch'].patchValue('false');
   // this.form.controls['smartBatch'].setValue(false);
  }
  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "MASTER",
      "function": "MACHINE",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      this.status = data['status'];
      console.log("status", this.status);
    },
      error => {
        this.toastr.error(error);
      })
  }
  getDeviceName() {    
    this.accountService.getAllDevice()
      .pipe(first())
      .subscribe(devices => {

        this.devices = devices;
        // this.devices = this.devices.filter(it => it.status == 'Active')
        this.inActive = true;
      });
    console.log(this.devices);
  }
  filterItem(event) {
    
    if (!event.inputType) {
      let deviceValue = [];
      deviceValue = event.target.value.split("-");
      this.devicetypeValue = deviceValue[deviceValue.length - 1]
      let selecteddeviceValue = deviceValue[0];
      this.modeltext = selecteddeviceValue;
      event.target.value = "";
    }
  }

  getMachineData() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getAllMachines1(data1).subscribe(master => {
      this.master = master
      this.master = this.master.docs.filter(it => it.status == 'Active');
      this.inActive = true;
      console.log("machine data", this.master)
    });
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  public downloadMachineMaster() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '../../../assets/files/machinemaster.xlsx');
    link.setAttribute('download', `machinemaster.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  public readFile() {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      this.workbook = XLSX.read(bstr, { type: "binary" });
      this.sheet_names = this.workbook.SheetNames;
      this.sheetNameCount = this.workbook.SheetNames.length;
      this.sheet_name = this.sheet_names[0];
      var worksheet = this.workbook.Sheets[this.sheet_name];

    }

  }

  onFileSelect(fileInput: any) {

    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.file = fileInput.target.files[0];
    this.readFile();
  }

  uploadFile() {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    console.log(files);
    this.currentFile = files[0];

    formData.append("file", files[0]);
    formData.append("dataType", 'items');

    console.log(files[0]);

    if (this.currentFile && this.sheetNameCount == 1 && this.sheet_name == "machinemaster") {
      this.accountService.uploadMachineData(formData).subscribe(
        files => {
          console.log('files', files);
          this.uploadedData = files;
          if(this.uploadedData.duplicateRecords.length == 0)
          {
            this.toastr.success('File uploaded successfully');
            this.getMachineData();
            this.myInputVariable.nativeElement.value = "";
          }
          else
          {
            this.toastr.error(this.uploadedData.duplicateRecords.length+' '+'machine already created');
            this.getMachineData();
          }
        },
        error => {
          this.toastr.error(error);
          this.loading = false;
        }
      )
    }
    else {
      this.myInputVariable.nativeElement.value = "";
      this.toastr.error('Please select valid file');
    }
  }


  // inactiveRecords(event: any) {

  //   if (event) {
  //     this.inActive = false;
  //     this.accountService.getAllMachines1()
  //       .pipe(first())
  //       .subscribe(master => {
  //         this.master = master
  //         this.master = this.master.docs.filter(it => it.status == 'InActive');
  //         this.inActive = true;
  //       });

  //   }
  //   else {
  //     this.inActive = false;
  //     this.getMachineData();
  //   }
  // }

  inactiveRecords(event: any) {
    if (event) {
      this.inActive = false;
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName: JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getAllMachines1(data1).subscribe(master => {
        this.master = master
        // this.master = this.master.docs.filter(it => it.status == 'Active');
        this.master = this.master.docs.filter(it => it.status == 'InActive');
        this.inActive = true;
        console.log("machine data", this.master)
      });
    }
    else {
      this.inActive = false;
      this.getMachineData();
    }
  }
  // deleteUser(id: string) {
  //   
  //   const master = this.master.find(x => x.id === id);
  //   master.isDeleting = true;
  //   this.accountService.deleteMachine(id)
  //     .pipe(first())
  //     .subscribe(() => this.master = this.master.filter(x => x.id !== id));
  // }

  deleteMachine(id: string, pinNo: any) {
    const master = this.master.find(x => x.id === id);
    // master.isDeleting = true;
    let result = window.confirm("Are you sure you want to delete this machine?")
    if (result == true) {
      this.accountService.deleteMachineData(pinNo).subscribe((data:any) => {
        this.deleteMachinedata = data
        if (data.status == true) {
          this.toastr.success(data.msg);
          this.getMachineData()
        } else {
          this.toastr.warning(data.msg);
        }
      })
    }
    else {
      master.isDeleting = false;
    }

  }
  dropdownData() {
    this.accountService.getAllModels()
      .pipe(first())
      .subscribe(model => {
        this.model = model;
        this.model = this.model.docs.filter(it => it.status == 'Active');
        this.model.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title > b.title ? 1 : 0)
        //  this.model.materialSelect();
      });
  }

  get f() { return this.form.controls; }
  get f1() { return this.deviceform.controls }
  getVariant() {
    this.accountService.getVariantModel(this.form.value.deviceModel)
      .subscribe(variant => {
        this.variant = variant;
        this.variant = this.variant.filter(it => it.status == 'Active');
      });
  }
  ondeviceSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.deviceform.invalid) {
      return;
    }
    this.loading = true;
    this.getMachineData();
    this.closeButton.nativeElement.click();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.isEditMode) {
      // this.update();
      this.updateMachine1(this.id);
    }
    else {
      this.createMachine();
    }
  }
  isEditMode: boolean;
  showModal: boolean;
  addMachine() {
    this.showModal = true;
    this.showModal1 = false;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;
  }

  // addDevice() {
  //   this.showModal = true;
  //   this.isEditMode = false;
  //   this.form.reset();
  //   this.submitted = false;
  // }

  // createDevice() {

  //   
  //   this.accountService.newDevice(this.form.value)
  //     .subscribe(res => {
  //       console.log(res);
  //       this.toastr.success('Device added successfully');
  //       this.closeButton.nativeElement.click();
  //       this.getDeviceName();
  //     },
  //       error => {
  //         this.toastr.error(error);
  //         this.loading = false;
  //       }
  //     );


  // }

  createMachine() {
    this.form.controls['createdBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
    this.accountService.newMC(this.form.value)
      .subscribe((res) => {
        console.log(res);
        this.up = res
        if (this.up.status == "success") {
          this.toastr.success('Machine added successfully');
          this.getMachineData();
        this.closeButton.nativeElement.click();
        }
        else {
          this.toastr.error('Machine is already created');
          this.closeButton.nativeElement.click();
        this.loading = false;
        }
      //  this.closeButton.nativeElement.click();
        this.loading = false;
      },
        err => {
          this.toastr.error(err);
          this.loading = false;
        }
      );
  }

  update(event, index, id) {

    this.showModal = true;
    this.showModal1 = false;
    this.isEditMode = true;
    this.id = id;
    let ids = index;
    if (this.isEditMode) {
      this.accountService.getByIdMachine(this.id)
        .subscribe(master => {
          console.log(ids);

          this.master = master;
          this.form.patchValue(this.master);
          this.form.get('deviceModel').setValue(this.master.deviceModel);
          this.form.get('variant').setValue(this.master.variant);
          this.form.value.manufacturingDate.setValue(new Date(this.master.manufacturingDate));
          console.log(this.form)
        });
    }

  }

  mapCheck(deviceId, pinNo, id) {
    this.modeltext = '';
    this.deviceform.controls['deviceID'].setValue(null);
    if (deviceId) {
      this.deviceid = deviceId;
      this.pinNumber = pinNo;
      this.id = id;
      this.accountService.mapCheck(this.deviceid)
        .subscribe(master => {
          console.log(master);
          this.check = master
          this.checkedStatus = this.check.status

        });
      if (this.checkedStatus === "machine is mapped") {
        return this.toastr.error("machine is already mapped")
      }
      // else {
      //   this.id=id;
      //   this.checkedStatus = 'machine is not mapped'
      //   this.getDeviceName();
      //   this.updateDeviceMapping();
      // }
    }
    else {
      this.checkedStatus = 'machine is not mapped'
      this.id = id;
      this.pinNumber = pinNo;
      this.getDeviceName();
    }
  }

  updateMachine1(id) {
    this.form.controls['updatedBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
    this.accountService.updateMachine(id, this.form.value)

      .subscribe(res => {
        console.log(res);
        this.toastr.success('Updated successful');
        // this.router.navigate(['../../'], { relativeTo: this.route });
        this.closeButton.nativeElement.click();
        this.getMachineData();
      },
        error => {
          console.log(error)
          // this.toastr.error(error);
          this.loading = false;
          this.closeButton.nativeElement.click();
        }

      );


  }

  update1(event, index, id) {
    
    this.showModal = true;
    this.isEditMode = true;
    this.id = id;



    let ids = index;
    if (this.isEditMode) {

      this.accountService.getByIdDevice(this.id)
        .subscribe(devices => {

          this.devices = devices;
          this.form.setValue(this.devices);
        });
    }
  }

  updateDeviceMapping() {
    this.deviceform.value.pinno = this.pinNumber;
    if (this.devicetypeValue == "advance") {
      this.deviceform.value.devicetype = "dvmap";
    }
    else if (this.devicetypeValue == "basic") {
      this.deviceform.value.devicetype = "dvmapb";
    }
    else {
      this.deviceform.value.devicetype = this.devicetypeValue;
    }
    let params =
    {
      "deviceID": this.modeltext,
      "devicetype": this.deviceform.value.devicetype,
      "pinno": this.deviceform.value.pinno
    }
    this.accountService.updateDeviceMap(params)
      .subscribe(res => {
      this.result1=res;
      if(this.result1.status == 'success')
      {
        this.toastr.success('Device ID mapped successfully');
        document.getElementById('closeButton1').click();
      }
      else{
        this.toastr.error('Device id is not mapped');
        document.getElementById('closeButton1').click();
      }
      },
        error => {
          this.toastr.error(error);
          this.loading = false;
        }
      );
    console.log("saving device data");
  }

  /*  closeModal(modal){
    document.querySelector('#'+ modal).classList.remove('md-show');
  }
  closeMyModal(event){
   ((event.target.parentElement).parentElement).classList.remove('md-show');
  } 
 */

  qrCodeGen(pinNo: String, model: String, mngDate: Date, engineNumber: string) {
    this.showModal1 = true;
    this.showModal = false;
    this.qrCode = true;
    var mngDate = new Date(mngDate);
    var mgDate = mngDate.getDate() + '-' + (1 + mngDate.getMonth()) + '-' + mngDate.getFullYear();
    // var mgDate = mngDate.getDate()+'-'+mngDate.getMonth()+'-'+mngDate.getFullYear();
    this.qrData = model + ', ' + pinNo + ', ' + engineNumber + ', ' + mgDate;
    this.machineNo = pinNo;
  }
}