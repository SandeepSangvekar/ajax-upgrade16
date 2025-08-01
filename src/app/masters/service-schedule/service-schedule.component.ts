import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
// import { Master } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-service-schedule',
  templateUrl: './service-schedule.component.html',
  styleUrls: ['./service-schedule.component.less']
})
export class ServiceScheduleComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  services = null;
  model = null;
  devices = null;
  variant = null;
  itemsPerPage = 50;
  form: FormGroup;
  submitted = false;
  loading = false;
  p: number = 1;
  searchText;
  isEditMode = false;
  showModal: boolean;
  // editMachineData: services;
  id: string;
  isChecked;
  inActive = false;
  active = false;
  deviceModel;
  date = new Date()
  deviceid: any;
  check: any;
  up: any;
  status: any;
  response: any;
  
  constructor(
      private accountService: AccountService,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
    ) {}

  ngOnInit(): void {
    this.createUserLOgs();
    this.getAllServices();
    this.dropdownData();
    
    // this.getVariant();
    this.form = this.formBuilder.group({
      deviceModel: ['', Validators.required],
      variant: ['', Validators.required],
      serviceNumber: ['', Validators.required],
      serviceType: ['', Validators.required],
      serviceDueAfterSeconds: ['', Validators.required],
      serviceCreateAfterSeconds: ['', Validators.required],
      intervalSeconds: ['', Validators.required],
      serviceDueAfterDays: ['', Validators.required],
      serviceCreateAfterDays: ['', Validators.required],
      intervalDays: ['', Validators.required],
      message: ['', Validators.required],
      overdueLimit: ['', Validators.required],
      createdBy:['']
    });
  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"MASTER",
        "function":"SERVICE SCHEDULE",
        "type":"web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {    
         this.status=data['status'];
        //  console.log("status",this.status);
      },
        error => {
          this.toastr.error(error);
        })
    }
  getAllServices() {
    this.accountService.getAllServicesMaster()
      .pipe(first())
      .subscribe(services => {
        this.services = services
        this.inActive = true;
        // console.log("services data==== ", this.services)
      });
  }

  dropdownData() {
    this.accountService.getAllModels()
      .pipe(first())
      .subscribe(model => {
        this.model = model;
        this.model = this.model.docs.filter(it => it.status == 'Active');
        this.model.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title > b.title ? 1 : 0)
      });
  }

  get f() { return this.form.controls; }

  getVariant() {
    this.accountService.getVariantModel(this.form.value.deviceModel)
      .subscribe(variant => {
        this.variant = variant;
        this.variant = this.variant.filter(it => it.status == 'Active');
      });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      // console.log("form-invalid")
      return;
    }
    this.loading = true;
    this.createServiceSchedule();
  }

  addServiceSchedule() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;
  }

  createServiceSchedule() {
    this.form.controls['createdBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
    // console.log("Form Value===",this.form.value)
    this.accountService.newServiceSchedule(this.form.value)
      .pipe(first())
      .subscribe(result=>{
       this.response=result;
       if(this.response.status == "success")
       {
        this.toastr.success('Service added successfully');
        // console.log("Form Value2===",this.form.value)
        this.closeButton.nativeElement.click();
        this.getAllServices();
       }
        else{
          this.closeButton.nativeElement.click();
          this.toastr.error("Service is already created");
        }
        },
       error => {
          this.toastr.error(error);
          this.loading = false;
        }
      );
  }

}