import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, AlertService } from '@app/_services';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-userlogs',
  templateUrl: './userlogs.component.html',
  styleUrls: ['./userlogs.component.less']
})
export class UserlogsComponent implements OnInit {
  p: number = 1;
  itemsPerPage=200;
  searchText;
  startDate: any;
  endDate: any;
  form: FormGroup;
  showDetails=false;
  showSummary=false;
  submitted: boolean;
  timeBetween: any;
  date = new Date();
  today = new Date();
  fromDate: string;
  toDate: string;
  mutilizationdata:any;
  mutilizationdatadocs:any;
  userLogsData: any;
  userLogsDataDocs: any;
  userLogsSummaryData: any;
  userLogs: any;
  userLogsDetails: any;
  status: any;
  constructor(
    private accountService: AccountService,
    private datePipe: DatePipe, 
    private formBuilder: FormBuilder, 
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
    this.createUserLOgs();
    this.getRecord();
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  getRecord() {
    this.showSummary=true;
    this.today = new Date();
    this.today.setDate(this.today.getDate() -1);
    this.today.setMonth(this.today.getMonth() - 1);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
   this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
   this.startDate = this.fromDate.toString(),
    this.endDate = this.toDate.toString()

    this.timeBetween = {
      gte: this.startDate  + "T00:00:00.000Z",
      lt: this.endDate  + "T23:59:59.000Z",
    }
    this.accountService.GetUserlogsSummaryData(this.timeBetween).subscribe((result) => {
      this.userLogsData = result
      this.userLogsSummaryData= this.userLogsData.docs;
      console.log(this.timeBetween)
      console.log("Log Summary Data...", this.userLogsSummaryData)
      this.userLogsSummaryData = this.userLogsSummaryData.sort((a,b) => b.count - a.count);

      if (this.userLogsSummaryData == undefined) {
        this.toastr.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
      }
    })
  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"REPORT",
        "function":"USERLOGS",
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
  showSummaryData() {
    this.submitted = true;
    this.showSummary=true;
    this.showDetails=false;
    if (this.form.invalid) {
      return;
    }

    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T23:59:59.000Z",
    }
    this.accountService.GetUserlogsSummaryData(this.timeBetween).subscribe((result) => {
      this.userLogsData = result
      this.userLogsSummaryData= this.userLogsData.docs;
      this.userLogsSummaryData = this.userLogsSummaryData.sort((a,b) => b.count - a.count);
      console.log(this.timeBetween);
      console.log("log Summary..", this.userLogsSummaryData);
      
      if (this.userLogsSummaryData == undefined) {
        this.toastr.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
      }

    })
  }
  showDetailsData(){
    this.submitted = true;
    this.showSummary=false;
    this.showDetails=true;
    if (this.form.invalid) {
      return;
    }

    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T23:59:59.000Z",
    }
    this.accountService.GetUserlogsDetailsData(this.timeBetween).subscribe((result) => {
      this.userLogs = result
      this.userLogsDetails = this.userLogs.docs;
      this.userLogsDetails = this.userLogsDetails.sort((a,b) => b.count - a.count);
      console.log(this.timeBetween);
      console.log("user log...", this.userLogsDetails);
      if (this.userLogsDetails == undefined) {
        this.toastr.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
      }
    })

  }
}
