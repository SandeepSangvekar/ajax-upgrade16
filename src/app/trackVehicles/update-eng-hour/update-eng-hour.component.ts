import { Component, Directive, Input, OnInit, ViewChild } from '@angular/core';
import { first, retry } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { AccountService, AlertService } from '@app/_services';
// import { stringify } from '@angular/compiler/src/util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-update-eng-hour',
  templateUrl: './update-eng-hour.component.html',
  styleUrls: ['./update-eng-hour.component.less']
})
export class UpdateEngHourComponent implements OnInit {
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
  updateEngHour = [];
  submitted: boolean;
  pinno: any;
  pinno1: any;
  data: any;
  updateData: Object;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {

    this.getRecord();

    this.formDate = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.form = this.formBuilder.group({
      pinno1: ['', Validators.required],
      hours: ['', Validators.required],
      minutes: ['', Validators.required],
      seconds: ['', Validators.required],

    });

  }

  getRecord() {
    debugger
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 60);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') + "T00:00:00.000Z";
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T00:00:00.000Z";
    this.startDate = this.fromDate.toString(),
      this.endDate = this.toDate.toString()
    // debugger
    this.timeBetween = {
      gte: this.startDate,
      lt: this.endDate,
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getTrack(this.timeBetween)
      .subscribe((track) => {
        this.track = track
        this.trackdocs = this.track.docs

        this.trackdocs.forEach(element1 => {
          if (element1.totalEngineHours < "05:00:00") {
            this.updateEngHour.push(element1);
          }
        });
        // if (this.trackdocs == undefined) {
        //   this.alertService.error("No Record Found Between " + this.datePipe.transform(this.today, 'yyyy-MM-dd') + " To " + this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
        // }
      })
    console.log("Time Between==", this.timeBetween);
    console.log("Update Engine Hour===", this.updateEngHour);
  }

  // onSubmitDate() {
  //   debugger
  //   this.submitted = true;
  //   if (this.form.invalid) {
  //     return;
  //   }

  //   this.timeBetween = {
  //     gte: this.formDate.value.startDate + "T00:00:00.000Z",
  //     lt: this.formDate.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
  //     useType: JSON.parse(localStorage.getItem('user')).useType,
  //     loginName: JSON.parse(localStorage.getItem('user')).loginName
  //   }

  //   this.accountService.getTrack(this.timeBetween).subscribe((track) => {
  //     this.track = track
  //     this.trackdocs = this.track.docs

  //     this.trackdocs.forEach(element1 => {
  //       if (element1.totalEngineHours < "05:00:00") {
  //         this.updateEngHour.push(element1);
  //         element1 = null;
  //       }
  //     });

  //     console.log("Filter Date===", this.timeBetween);
  //     console.log("Filter Update Data===", this.updateEngHour);

  //     if (this.trackdocs == undefined) {
  //       this.alertService.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
  //     }
  //   })
  // }


  update(pinno) {
    this.pinno = pinno
  }

  onSubmit() {
    this.data = {
      pinno: this.form.value.pinno1,
      hours: this.form.value.hours,
      minutes: this.form.value.minutes,
      seconds: this.form.value.seconds,
    }
    console.log("Update Data ===", this.data);

    this.accountService.updateEngHours(this.data)
      .subscribe(data => {
        this.updateData = data
        console.log("Update ENgine Hours ==", this.updateData);
        this.alertService.success("Engine Hours Update Successfull..");
        this.closeButton.nativeElement.click();
        this.getRecord();
        window.location.reload()
      });
  }

}
