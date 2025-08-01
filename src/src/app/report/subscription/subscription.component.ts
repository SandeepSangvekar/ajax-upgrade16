import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/internal/operators/first';
import { environment } from '@environments/environment';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { ExcelService, ExcelServiceXlsx } from '../../_services/excel.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.less']
})
export class SubscriptionComponent implements OnInit {
  @ViewChild('closeButton') closeButton;
  data1: any;
  subscriptionList: any;
  date = new Date();
  p: number = 1;
  searchText;
  itemsPerPage = 50;
  status: any;
  loading: boolean = false;
  submitted = false;
  form: FormGroup;
  pinNo = environment.labelpinno;
  renewSubscription: any;
  expiryDate: any;
  subListExcelData=[];
  subStartDate: any;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private excelxlsxService: ExcelServiceXlsx,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      pinNo: ['', Validators.required],
      deviceModel: ['', Validators.required],
      // startDate: ['', Validators.required],
      renewalDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      duration: ['', Validators.required],
      secretKey: ['', Validators.required],
    });

    this.createUserLOgs();
    this.getRecord();
  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "REPORT",
      "function": "SUBSCRIPTION",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      this.status = data['status'];
    },
      error => {
        this.alertService.error(error);
      })
  }

  getRecord() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName.toUpperCase(),
    }

    this.accountService.getSubscriptionReportCount(data1)
      .pipe(first())
      .subscribe((data) => {
        this.subscriptionList = data;
        this.subscriptionList = _.sortBy(this.subscriptionList, (o) => moment["default"](o.ExpireDate))

        this.subscriptionList.forEach(element => {
          this.subListExcelData.push({
            "Model":element.deviceModel,
            "Pin No.":element.pinno,
            "Total Hrs":element.totalEngineHours,
            "Mapping Date":new Date(element.MappingDate),
            "Device Delivery Date":new Date(element.deliveryDate),
            // "Bootstrap Days":element.BootstrapDays,
            "Comm. Date":new Date(element.commisionDate),
            "Subscription Start Date":new Date(element.subStartDt),
            "Subscription Duration":element.Duration,
            "Subscription Expiry Date":new Date(element.ExpireDate),
            "Subscription Expiring (Days)":element.ExpiringDays,
            "Customer Name":element.Name,
            "Customer Contact":element.Contact,
            "Customer State":element.State,
            "Device ID":element.deviceID,
          })
        });
      })
  }

  get f() { return this.form.controls; }

  getRenewData(pinno, deviceModel, ExpireDate, commisionDate, startDt) {
    debugger
    this.form.controls['pinNo'].setValue(pinno);
    this.form.controls['deviceModel'].setValue(deviceModel);
    this.form.controls['renewalDate'].setValue(this.datePipe.transform(ExpireDate, 'yyyy-MM-dd'));
    // this.form.controls['startDate'].setValue(this.datePipe.transform(startDt, 'yyyy-MM-dd'));    
  }

  updateDate() {
    this.expiryDate = moment(new Date(this.form.controls.renewalDate.value)).add(this.form.controls.duration.value, 'M');
    this.expiryDate = this.datePipe.transform(this.expiryDate, 'yyyy-MM-dd');
    this.form.controls['expiryDate'].setValue(this.expiryDate);
  }

  onSubmit() {
    debugger
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    this.expiryDate = moment(new Date(this.form.controls.renewalDate.value)).add(this.form.controls.duration.value, 'M');
    this.expiryDate = this.datePipe.transform(this.expiryDate, 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z";

    const data1 = {
      pinno: this.form.controls.pinNo.value,
      // expireDate: this.form.controls.expiryDate.value + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      subscriptionStartDate: this.form.controls.renewalDate.value + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      subscriptionEndDate: this.form.controls.expiryDate.value + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      subscriptionMonths: this.form.controls.duration.value,
      secretCode: this.form.controls.secretKey.value,
    }


    this.accountService.updateSubscription(data1)
      .pipe(first())
      .subscribe((data) => {
        this.renewSubscription = data;

        if(this.renewSubscription.status == "success") {
          this.toastr.success("Subscription renew successfully.");
          this.closeButton.nativeElement.click();
          this.getRecord();
          this.loading = false;
        } else {
          this.toastr.error("Somthing went wrong !!!");
          this.loading = false;
        }

      })
  }
  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.subListExcelData, 'Subscription_Report');
  }
}
