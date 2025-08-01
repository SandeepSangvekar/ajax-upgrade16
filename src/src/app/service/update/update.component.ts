import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/_services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  model = null;
  p: number = 1;
  searchText;
  date = new Date();

  form: FormGroup;
  realeseForm: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;
  itemsPerPage = 50;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  batchData: any;
  batchFilter: any;
  dateRange: any;
  batchDatadocs: any;
  pinno: any;
  service: any;

  deviceModel: any;
  deviceId: any;
  companyId: any;
  snum: any;
  customerMob: any;
  engineNo: any;
  type: any;

  variant: any;
  items: any;
  totalEngineHours: any;
  category: any;
  categoryDocs: void;
  subcategory: any;
  subcategoryDocs: any;
  releases: any = [];
  release: any = [];
  Concat = [];
  showFromData = false;
  records: any;
  realesesubmitted = false;
  serviceData: any;
  sendData: Object;
  sendNotification: { machineno: any; title: string; pinno: any; message: string; deviceID: any; mobileno: any; companyID: any; deviceModel: any; type: any; status: number; };
  today: string;

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private auth: AuthService,
    private toastr: ToastrService,
    ) {
    this.auth.authFunction(window.location.pathname);
  }
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  selected: string = '';


  ngOnInit() {
    this.createUserLOgs();
    this.getServices();

    this.form = this.formBuilder.group({
      machineno: ['', Validators.required],
      actualcompletiondate: ['', Validators.required],
      remarks: ['', Validators.required],
      cost: ['', Validators.required],
      
      deviceModel1:[''],
      deviceId1: [''],
      snum1: [''],
      companyId1: [''],
      customerMob1: [''],
      engineNo1: [''],
      type1: [''],

    });
    this.realeseForm = this.formBuilder.group({
      category: [''],
      subcategory: [''],
    });

  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"SERVICE",
        "function":"UPDATE",
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
  status(arg0: string, status: any) {
    throw new Error('Method not implemented.');
  }
  get f() { return this.form.controls; }
  get f1() { return this.realeseForm.controls; }
  //event handler for the select element's change event
  select(event: any) {
    //update the ui
    this.selected = event.target.value;
  }
  getService(pinno, deviceModel, snum, variant, totalEngineHours) {
    this.pinno = pinno
    this.deviceModel = deviceModel;
    this.variant = variant;
    this.totalEngineHours = totalEngineHours;
    console.log('ghg', this.deviceModel, variant,)
    this.accountService.getCreatedServicesByMachine(this.pinno, snum)
      .pipe(first())
      .subscribe(service => {
        var data1 = JSON.stringify(service);
        var data2 = JSON.parse(data1)
        this.service = [service]
        this.items = data2.items
        console.log('hgghh', this.items)
        console.log("service ", [service])
      });
  }

  getCategory(pinno, deviceModel, deviceId, companyId, snum, customerMob, engineNo, type) {
    this.form.reset();
    this.realeseForm.reset();
    this.submitted = false;
    this.showFromData = false;
    this.realesesubmitted = false;
    this.release = [];
    this.pinno = pinno;

    this.deviceModel = deviceModel
    this.deviceId = deviceId
    this.companyId = companyId
    this.snum = snum
    this.customerMob = customerMob
    this.engineNo = engineNo
    this.type = type
    
    this.form.controls['machineno'].setValue(pinno);
    //  this.form.value[]=pinno;
    console.log("service num ", snum)

    this.accountService.getCategory()
      .pipe(first())
      .subscribe(category => {
        this.category = category
        this.categoryDocs = this.category.docs
        console.log("Category ", this.categoryDocs)
      });

  }
  getSubCategory() {
    this.batchFilter = {
      name: this.realeseForm.value.category
    }
    this.accountService.getSubCategory(this.batchFilter)
      .pipe(first())
      .subscribe(subcategory => {
        this.subcategory = subcategory
        this.subcategoryDocs = this.subcategory.docs
        console.log("Sub Category ", this.subcategoryDocs)
      });
  }
  onreleaseSubmit() {
    this.realesesubmitted = true;
    if (this.realeseForm.valid) {
      setTimeout(() =>
        this.formGroupDirective.resetForm(), 0)
    }
    this.releases = {
      category: this.realeseForm.value.category,
      subcategory: this.realeseForm.value.subcategory,
      Concat: this.realeseForm.value.category + ' ' + this.realeseForm.value.subcategory
    };

    if ((this.releases.category && this.releases.subcategory && this.releases.Concat)) {
      this.release.push(this.releases)
      this.showFromData = true;
      this.realeseForm.controls['category'].clearValidators();
      this.realeseForm.controls['subcategory'].clearValidators();
    }
    else if (this.release.length > 0) {
      this.showFromData = true;
      this.realeseForm.controls['category'].setValidators([Validators.required]);
      this.realeseForm.controls['subcategory'].setValidators([Validators.required]);
    }
    else {
      this.showFromData = false;
      this.realeseForm.controls['category'].setValidators([Validators.required]);
      this.realeseForm.controls['subcategory'].setValidators([Validators.required]);
    }
  }
  delete(v) {
    // this.release.pop(this.release[v])
    this.release.splice(v, 1);
  }


  onSubmit() {
    this.submitted = true;
    this.realesesubmitted = true;
    if (this.release.length > 0) {
      this.realeseForm.controls['category'].clearValidators();
      this.realeseForm.controls['subcategory'].clearValidators();
    }
    if (this.realeseForm.invalid && this.form.invalid) {
      return;
    } else {
      this.records = {
        actualcompletiondate: this.datePipe.transform(this.form.value.actualcompletiondate, 'dd-MM-yyyy'),
        cost: this.form.value.cost,
        remarks: this.form.value.remarks,
        items: this.release,
        status: "close"
      }
      console.log('data123', this.records)
      this.accountService.serviceUpdate(this.form.value.machineno, this.snum, this.records)
        .subscribe((data) => {
          this.serviceData = data
          const buttonModal = document.getElementById("invoiceMode")
          buttonModal.click()

          if (this.serviceData.message) {

            this.sendNotification ={
              machineno: this.form.value.machineno,
              title: "Service Update",
              pinno: this.form.value.machineno,
              message:  "service no. " + this.form.value.snum1 + " for your vehicle " + this.form.value.machineno + " has completed. Thanks for helping us serve you. AUGTRN",
              deviceID: this.form.value.deviceId1,
              mobileno: this.form.value.customerMob1,
              companyID: this.form.value.companyId1,
              deviceModel: this.form.value.deviceModel1,
              type: this.form.value.type1,
              status: 0
            }
    
            console.log("sendNotification Data ===", this.sendNotification);
    
            this.accountService.createNotification(this.sendNotification)
            .subscribe(data => {
              this.sendData = data
              console.log("Service Message Response ==",this.sendData);
            });

            this.getServices();
            this.toastr.success("Service Updated Successfully !!!")
          }

          error => {
            this.toastr.error(error);
          }
        });

    }

  }

  getServices() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getCreatedServices(data1).subscribe(model => {
      this.model = model
      console.log("models", model)
    });
    console.log("Local Storage ", JSON.parse(localStorage.getItem('user')).loginName)
  }

  // calculateDiff(sentOn){
   
  //       let todayDate = new Date();
  //       let sentOnDate = new Date(sentOn);
  //       sentOnDate.setDate(sentOnDate.getDate());
  //       let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
  //       // To calculate the no. of days between two dates
  //       let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); 
  //       return differenceInDays;
  // }

}






