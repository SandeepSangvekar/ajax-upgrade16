import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/_services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.less']
})
export class ServiceComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  model = null;
  p: number = 1;
  searchText;
  date = new Date();
  form: FormGroup;
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
  deviceModel: any;
  deviceId:any;
  companyId:any;
  customerMob:any;
  engineNo:any;
  type:any;
  customerLat:any;
  customerLong:any;
  dealerCode:any;
  customerScheduleDate:any;
  customerRemarks:any;
  registerService: any;
  returnData: any;
  snum: any;
  enhr: any;
  sendData: Object;
  sendNotification:any;
  today: any;

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private auth: AuthService,
    private toastr: ToastrService,
    ) {
    this.auth.authFunction(window.location.pathname);
  }

  selected: string = '';
  select(event: any) {
    //update the ui
    this.selected = event.target.value;
  }

  ngOnInit() {
    this.createUserLOgs();
    this.checkAgreement();
   }
   createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"SERVICE",
        "function":"SCHEDULE",
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
 
   checkAgreement(){
     if(JSON.parse(localStorage.getItem('user')).role =='customer' || JSON.parse(localStorage.getItem('user')).role == 'dealer')
     {
       if(JSON.parse(localStorage.getItem('user')).agreementSignedOn == null)
       {
         this.accountService.logout();
       } else {
   this.helperFunction();
       }
     }
     else
     {
       this.helperFunction();
     }
   }
 
   helperFunction(){
     this.getServices();
     this.form = this.formBuilder.group({
       title: '',
       dmodel: '',
       pinno: '',
       enhr: [''],
       serviceNumber: ['', Validators.required],
       serveng: [''],
       scheduledCompletionDate: ['', Validators.required],
       serviceengineer: "serviceengineer",
       serviceengineerid: "servicenegineerid2",
       status: "open",
       serviceType: "paid",
       gdate: [''],
       deviceId1: [''],
       companyId1: [''],
       customerMob1: [''],
       engineNo1: [''],
       type1: [''],
       customerLat1: [''],
       customerLong1: [''],
       dealerCode1: [''],
       customerRemarks1: [''],
 
     });
   }
  get f() { return this.form.controls; }
  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.RegisterService();
  }
  
  register(pinno, enhr, snum, deviceModel, deviceId, companyId, customerMob, engineNo, type, customerLat, customerLong, dealerCode, customerScheduleDate, customerRemarks) {
    //  alert(pinno);
    this.snum = snum
    this.enhr = enhr
    console.log("Engine Hour ",enhr)
    console.log("service number ",snum)
    this.pinno = pinno
    this.deviceModel = deviceModel
    this.deviceId = deviceId
    this.companyId = companyId
    this.customerMob = customerMob
    this.engineNo = engineNo
    this.type = type
    this.customerLat = customerLat
    this.customerLong = customerLong
    this.dealerCode = dealerCode
    this.customerScheduleDate = this.datePipe.transform(customerScheduleDate, 'yyyy-MM-dd')
    this.customerRemarks = customerRemarks
    console.log("data==", this.customerLat ,this.customerLong,this.dealerCode,this.customerScheduleDate,this.customerRemarks)

  }

  getServices(){
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName:JSON.parse(localStorage.getItem('user')).loginName
     }
    this.accountService.getUpcomingServices(data1).subscribe(result => {
      this.model = result
      this.model=this.model.docs;
      console.log("models==",this.model);

      this.today = this.datePipe.transform(this.date, 'yyyy-MM-dd') + "T00:00:00.000Z";
      console.log("Today date==", this.today)
    });
  }

  RegisterService() {
    console.log(typeof this.form.value);
    this.registerService ={
      serviceengineer: 'abcd',
      servicenegineerid: "servicenegineerid",
      scheduledCompletionDate: this.form.value.scheduledCompletionDate,
      serviceNumber: this.form.value.serviceNumber,
      serviceType:"free",
      status:"open"
     }
    console.log("Register Data ====", this.registerService);

    // return
    
    this.accountService.registerService(this.pinno, this.registerService).subscribe(data => {
      console.log(data);
      this.returnData = data
      this.closeButton.nativeElement.click();

      if(this.returnData.message == "Service record updated successfully"){
        this.toastr.success(this.returnData.code+" : "+this.returnData.message);
        // var closeAlert = document.getElementsByClassName("close").close()
        
        this.sendNotification ={
          machineno: this.form.value.pinno,
          title: "Service",
          pinno: this.form.value.pinno,
          message:"Service No. " + this.form.value.serviceNumber + " for your vehicle " + this.form.value.pinno + " has been scheduled on " + this.datePipe.transform(this.form.value.gdate, 'dd-MM-yyyy') + " Pls bring your vehicle to dealership on " + this.datePipe.transform(this.form.value.gdate, 'dd-MM-yyyy') + ". AUGTRN",
          deviceID: this.form.value.deviceId1,
          mobileno: this.form.value.customerMob1,
          companyID: this.form.value.companyId1,
          deviceModel: this.form.value.dmodel,
          type: this.form.value.type1,
          status: 0
        }

        console.log("sendNotification Data ===", this.sendNotification);

        this.accountService.createNotification(this.sendNotification)
        .subscribe(data => {
          this.sendData = data
          console.log("Service Message Response ==",this.sendData);
        });

      }else{
        this.toastr.error("Machine service scheduled already!") 
      }
    });
    this.getServices()
  }

}