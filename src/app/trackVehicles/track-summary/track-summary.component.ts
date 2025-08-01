//import { Component, OnInit } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-track-summary',
  templateUrl: './track-summary.component.html',
  styleUrls: ['./track-summary.component.less']
})
export class TrackSummaryComponent implements OnInit {

  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  refresh(): void {
   localStorage['refreshed'] = true;
    window.location.reload();
  }
  model = null;
  p: number = 1;
  searchText;
  date = new Date();
  item1: null;
  form: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;
  math = Math
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  batchData: any;
  batchFilter: any;
  dateRange: any;
  batchDatadocs: any;
  engineHours: any;
  lastOperatedOn: any;
  serviceDueNumber: any;
  serviceDueType: any;
  serviceDueDate: Date;
  averageHours: any;
  engineHoursTotal: any;
  distanceTravelled: any;
  averageDistance: any;
  updatedOn: Date;
  reportData: any;
  reportDatadocs: any;
  consumptionData: any;
  consumptionDatadocs: any;
  batchDataRecent: any;
  summeryReport: any;
  engineData: any;
  engineDatadocs: any;
  pin = this.route.snapshot.params['id'];
  stdate = JSON.parse(sessionStorage.getItem('dateTimeRange')).gte;
  endate = JSON.parse(sessionStorage.getItem('dateTimeRange')).lt;
  EngineOffData: any;
  EngineOffDatadocs: any;
  EngineOnData: any;
  EngineOnDatadocs: any;
  selectedRow : Number;
  setClickedRow : Function;
  locAddress: any;
  pinnum = this.route.snapshot.params['id'];
  summary: any;
  dateDiff :any;
address:any;
  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService, 
    ) { 
      this.setClickedRow = function(index){
        this.selectedRow = index;

    }

    }

  selected: string = 'Summary';

  //event handler for the select element's change event
  select(event: any) {
    //update the ui
    this.selected = event.target.value;
  }
  selected2: string = 'on';

  //event handler for the select element's change event
  select2(event: any) {
    //update the ui
    this.selected2 = event.target.value;
  }


  ngOnInit() {
    

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
    });
    this.batchFilter = {
      gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
      lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt, // Pinno & chasisno both are same
      pinno: this.id = this.route.snapshot.params['id'],
      chasisno: this.id = this.route.snapshot.params['id'],
    }

    this.getVehicleReport();
    this.getVehicleBatch();
    this.getVehicleConsumption();
    this.getEngineHours();
    this.getEngineOff();
    this.getEngineOn();
    this.getSummaryData();

    


  }
  get f() { return this.form.controls; }
  

 getEngineOff(){
  
  this.batchFilter = {
    gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
    lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
    pinno: this.id = this.route.snapshot.params['id']
  }
this.accountService.getEngineOff(this.batchFilter).subscribe((data) => {
  this.EngineOffData = data
  this.EngineOffDatadocs = this.EngineOffData.docs
  console.log(this.EngineOffDatadocs)

  
})
 }
 getEngineOn(){
  
  this.batchFilter = {
    gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
    lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
    pinno: this.id = this.route.snapshot.params['id']
  }
this.accountService.getEngineOn(this.batchFilter).subscribe((data) => {
  this.EngineOnData = data
  this.EngineOnDatadocs = this.EngineOnData.docs
  console.log(this.EngineOnDatadocs)
  
})
 }

  

  getVehicleReport() {
    this.batchFilter = {
      gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
      lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
      pinno: this.id = this.route.snapshot.params['id'],
    }

    this.accountService.getReportData(this.batchFilter).subscribe((data) => {
      this.reportData = data
      console.log( "report data",this.reportData)
      this.reportDatadocs = this.reportData.docs
      this.summeryReport = this.reportDatadocs[0]
      console.log( "Summary Report",this.summeryReport)
    })
  }

  getVehicleBatch() {
    this.batchFilter = {
      gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
      lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
      pinno: this.id = this.route.snapshot.params['id']
    }
    this.accountService.getBatchData(this.batchFilter).subscribe((data) => {
      this.batchData = data
      this.batchDatadocs = this.batchData.docs
      console.log("Batch data "+this.batchDatadocs)

    })
  }

  getVehicleConsumption() {
    this.batchFilter = {
      gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
      lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
      pinno: this.id = this.route.snapshot.params['id']
    }
    this.accountService.getConsumptionData(this.batchFilter).subscribe((data) => {
      this.consumptionData = data
      this.consumptionDatadocs = this.consumptionData.docs
      console.log(this.consumptionDatadocs);
      
    })
  }
  getEngineHours() {
    this.batchFilter = {
      onTimestamp: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
      offTimestamp: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
      pinno: this.id = this.route.snapshot.params['id']
        }
    this.accountService.getEngineDatas(this.batchFilter).subscribe((data) => {
      this.engineData = data
      this.engineDatadocs = this.engineData.docs
      this.engineDatadocs = _.sortBy(this.engineData.docs, (o) => moment["default"](o.createdAt)).reverse();
      console.log(" Engine DATA DOCS",this.engineDatadocs)
    
    })
  }
  getSummaryData() {

    this.batchFilter = {
      pinno: this.id = this.route.snapshot.params['id']
    }
    this.accountService.getSummary(this.batchFilter).subscribe((data) => {
      this.summary = data
      if (this.summary) {
        this.engineHours = this.summary.engineHours.total;
        this.lastOperatedOn = this.summary.lastOperatedOn.time;
        this.updatedOn = this.summary.updatedOn;
        if (this.summary.serviceDue) {
          this.serviceDueNumber = this.summary.serviceDue.number;
          this.serviceDueType = this.summary.serviceDue.type;
          this.serviceDueDate = this.summary.serviceDue.dueDate;
        }

        else if (this.engineHours < 7) {
          this.engineHoursTotal = this.engineHours;
          this.averageHours = this.summary.averageHours;
          this.distanceTravelled = this.summary.distance.distanceTravelled;
          this.averageDistance = this.summary.distance.averageDistance;
        }
        else if (this.engineHours >= 7 && this.engineHours < 14) {
          this.engineHoursTotal = this.engineHours;
          this.averageHours = this.summary.averageHours;
          this.distanceTravelled = this.summary.distance.distanceTravelled;
          this.averageDistance = this.summary.distance.averageDistance;
        }
        else (this.engineHours >= 14)
        {
          this.engineHoursTotal = this.engineHours;
          this.averageHours = this.summary.averageHours;
          this.distanceTravelled = this.summary.distance.distanceTravelled;
          this.averageDistance = this.summary.distance.averageDistance;
        }
      }
      console.log("Summary data oyeeeeeeeeeeeeeeeee ", this.summary)
      let newdate = new Date(this.summary.lastOperatedOn.time)
      console.log("new date", newdate)
      this.dateDiff = Math.abs(Math.floor((Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()) - Date.UTC(newdate.getFullYear(), newdate.getMonth(), newdate.getDate())) / (1000 * 60 * 60 * 24)));
    },
      error => {
        this.alertService.error(error);
        this.clearAlert();
      })

  }
  
  clearAlert() {
    setTimeout(() => {
      this.alertService.clear();
    }, 2000);
  }

}
