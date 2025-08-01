import { Component, Directive, Input, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AccountService, AlertService } from '@app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-service',
  templateUrl: './register-service.component.html',
  styleUrls: ['./register-service.component.less']
})
export class RegisterServiceComponent implements OnInit {

  @ViewChild('closeButton') closeButton;
  today = new Date();
  track: any;
  p: number = 1;
  searchText;
  timeBetween: any;
  startDate: any;
  endDate: any;
  trackdocs: any;
  form: FormGroup;
  formDate: FormGroup;
  fromDate: string;
  toDate: string;
  date = new Date();
  pinNo = environment.labelpinno;
  submitted: boolean;
  pinno: any;
  totalEngineHours:any;
  customerCode:any;
  customerMobile:any;
  dealerCode:any;
  data: any;
  updateData: Object;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getRecord();

    this.form = this.formBuilder.group({
      pinno1: ['', Validators.required],
      totalEngineHours1: ['', Validators.required],
      customerCode1: ['', Validators.required],
      customerMobile1: ['', Validators.required],
      category: ['', Validators.required],
      dealerCode1: ['', Validators.required],
      scheduleDate: ['', Validators.required],
      remarks: ['', Validators.required],
    });
  }

  getRecord() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 60);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.startDate = this.fromDate.toString(),
      this.endDate = this.toDate.toString()
    this.timeBetween = {
      gte: this.startDate + "T00:00:00.000Z",
      lt: this.endDate  + "T23:59:59.000Z",
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getTrack(this.timeBetween)
      .subscribe((track) => {
        this.track = track
        this.trackdocs = this.track.docs
      })
    console.log("Time Between==", this.timeBetween);
    console.log("Service Data===", this.trackdocs);
  }

  update(pinno, totalEngineHours, customerMobile, dealerCode, customerCode) {
    this.pinno = pinno,
    this.totalEngineHours = totalEngineHours,
    this.customerMobile = customerMobile,
    this.dealerCode = dealerCode,
    this.customerCode = customerCode
  }


  onSubmit() {
    this.data = {
      loginName:JSON.parse(localStorage.getItem('user')).loginName,
      pinno: this.form.value.pinno1,
      assignedTo:this.form.value.dealerCode1,
      remarks:this.form.value.remarks,
      onDemandServiceCategory:this.form.value.category,
      ScheduleDate:this.form.value.scheduleDate
    }
    console.log("Data ===", this.data);

    this.accountService.createOnDemandService(this.data)
      .subscribe(data => {
        this.updateData = data
        console.log("on demain service ==", this.updateData);
        this.toastr.success("On demand service create successfully..");
        this.closeButton.nativeElement.click();
        this.getRecord();
        // window.location.reload()
      });
  }
}
