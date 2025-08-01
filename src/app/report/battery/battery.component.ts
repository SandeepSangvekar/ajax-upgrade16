import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.less']
})
export class BatteryComponent implements OnInit {

  today: Date;
  fromDate: string;
  toDate: string;
  startDate: string;
  itemsPerPage =50;
  form: FormGroup;
  loading = false;
  endDate: string;
  date = new Date();
  p: number = 1;
  searchText;
  remainingDate;
  data: any;
  batchList: any;
  snum: any;
  pinno: any;
  useType: any;
  loginName: any;
  batteryList: any;
  remainform: FormGroup;
  searchDays = 2000;
  remainDay = [];
  status:any;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.createUserLOgs();
    this.remainform = this.formBuilder.group({
      remainingDate: [null, Validators.required],
    });

    this.getRecord();
  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"REPORT",
        "function":"BATTERY",
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

  getRecord() {
    this.data = {
      searchDays: this.searchDays,
    }
    this.accountService.getBatteryAnalytics(this.data)
      .subscribe((data) => {
        this.batteryList = data,
        this.batteryList = this.batteryList.sort((a, b) => a.totalDaysRemaning - b.totalDaysRemaning);          
        // console.log("battery List ====", this.batteryList)
      })
  }

  onSubmit() {
    this.data = {
      searchDays: this.remainform.value.remainingDate,
    }
    this.accountService.getBatteryAnalytics(this.data)
      .subscribe((data) => {
        this.batteryList = data,
          this.batteryList = this.batteryList.sort((a, b) => a.totalDaysRemaning - b.totalDaysRemaning);
      })
  }
}
