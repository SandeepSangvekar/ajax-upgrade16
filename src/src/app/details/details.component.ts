import { Component, ElementRef, NgZone, OnInit, ViewChild, } from "@angular/core";
import { first } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { AccountService, AlertService } from "@app/_services";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { AuthService } from "@app/_services/auth.service";
import { environment } from "@environments/environment";

import * as moment from "moment";
import * as _ from "lodash";
import { stringify } from "@angular/compiler/src/util";
import { ExcelService, ExcelServiceXlsx } from "@app/_services/excel.service";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.less"],
})
export class DetailsComponent implements OnInit {
  @ViewChild("exampleModal", { static: true }) exampleModalRef: ElementRef;
  @ViewChild("closeButton") closeButton;
  title = "Vehicle Reports";
  p: number = 1;
  address: any;
  lat: any;
  lng: any;
  engineHours: any;
  lastOperatedOn: any;
  serviceDueNumber: any;
  serviceDueType: any;
  serviceDueDate: Date;
  averageHours: any;
  engineHoursTotal: any;
  distanceTravelled: any;
  averageDistance: any;
  alertValues = environment.alertValues;
  updatedOn: Date;
  zoom: number;
  isChecked = false;
  tempvAR: boolean;
  locationInfo: any;
  serviceType: string;
  days: number;
  engineONExcelData = [];
  showOffCANData = true;
  showOnCANData = true;
  showOnBs5ExtraData = true;
  shareLinkData: any;
  fromDate: any;
  toDate: any;
  url: any;
  showFuel = false;
  smartBatch=  true;
  noSmartBatch=  false;
  filterData: any;
  refresh(): void {
    window.location.reload();
  }
  model = null;
  searchText;
  checkButtonClick = false;
  date = new Date();
  item1: null;
  form: FormGroup;
  dtform: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;
  math = Math;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  batchData: any;
  batchFilter: any;
  timestampFilter: any;
  dateRange: any;
  batchDatadocs: any;
  reportData: any;
  reportDatadocs: any;
  consumptionData: any;
  consumptionDatadocs: any;
  batchDataRecent: any;
  summeryReport: any;
  engineData: any;
  engineDatadocs: any;
  pin = this.route.snapshot.params["id"];
  stdate = JSON.parse(sessionStorage.getItem("dateTimeRange")).gte;
  endate = JSON.parse(sessionStorage.getItem("dateTimeRange")).lt;
  deviceModel = JSON.parse(sessionStorage.getItem("deviceModel"));
  totalEngineHours = JSON.parse(sessionStorage.getItem("totalEngineHours"));
  today = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  EngineOffData: any;
  EngineOffDatadocs: any;
  EngineOnData: any;
  EngineOnDatadocs: any;
  selectedRow: Number;
  setClickedRow: Function;
  locAddress: any;
  alertEngineData: any[] = [];
  pinnum = this.route.snapshot.params["id"];
  summary: any;
  dateDiff: any;
  // typeOfDevice = JSON.parse(sessionStorage.getItem("deviceData"));
  deviceType = JSON.parse(sessionStorage.getItem("deviceType"));
  showOffColumns = false;
  showOnColumns = false;
  batchExcelData = [];
  engineHoursExcelData = [];
  pinNo = environment.labelpinno;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private http: HttpClient,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private ngZone: NgZone,
    private toastr: ToastrService
  ) {
    this.setClickedRow = function (index) {
      this.selectedRow = index;
    };
  }

  selected: string = "Report";

  //event handler for the select element's change event
  select(event: any) {
    //update the ui
    this.selected = event.target.value;
    if (this.selected == "Report") {
      this.getVehicleReport();
    } else if (this.selected == "Consumption") {
      this.getVehicleConsumption();
    } else if (this.selected == "Batch") {
      this.getVehicleBatch();
    } else if ((this.selected = "Engine")) {
      this.getEngineHours();
    }
  }
  selected2: string = "on";

  //event handler for the select element's change event
  select2(event: any) {
    //update the ui
    this.isChecked = !this.isChecked;
    this.selected2 = event.target.value;
    if (this.selected2 == "on") {
      this.getEngineOn();
    } else if (this.selected2 == "off") {
      this.getEngineOff();
    }
  }

  ngOnInit() {
    this.dtform = this.formBuilder.group({
      stdate: ["", Validators.required],
      endate: ["", Validators.required],
    });

    this.form = this.formBuilder.group({
      title: ["", Validators.required],
    });
    
        if (this.deviceType == "dvmapb") {
          this.showOnColumns = true;
          this.showOffColumns = true;
          console.log("showOnColumns ==", this.showOnColumns);

        } else if (this.deviceType == "bs4") {
          this.showOnCANData = false;
          this.showOffCANData = false;
          this.showFuel= true;
        }else if (this.deviceType == "bs5") {
          this.showOnBs5ExtraData = false;
          this.showOffCANData = false;
          this.showFuel= true;
        }

    this.getVehicleReport();
    this.getEngineOn();
    this.getSummaryData();
    this.createUserLogs();
  } 

  createUserLogs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "TRACK VEHICLE",
      "function": "DETAIL",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }
  get f() {
    return this.form.controls;
  }

  calculateDiff(dateSent) {
    let currentDate = new Date(this.dtform.value.endate);
    dateSent = new Date(dateSent);

    this.days = Math.floor(
      (Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) -
        Date.UTC(
          dateSent.getFullYear(),
          dateSent.getMonth(),
          dateSent.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
  }

  getSharelinkData() {
    if (this.submitted) {
      this.batchFilter = {
        fromDate: this.dtform.value.stdate + "T00:00:00.000Z",
        toDate: this.dtform.value.endate + "T23:59:59.000Z",
        pinno: (this.id = this.route.snapshot.params["id"]),
      };
      this.loading = true;
      this.shareLinkData = [];
      this.accountService.getShareLink(this.batchFilter).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.fromDate = this.dtform.value.stdate;
            this.toDate = this.dtform.value.endate;
            this.shareLinkData = data;

            if (this.shareLinkData.status == "Success") {
              this.shareLinkData = data;
              this.url = this.shareLinkData.link;
            } else {
              this.toastr.error("No share link found");

              //  this.EngineOffDatadocs = this.shareLinkData.docs
              // this.isChecked = false;
              //   console.log("engine off data", this.EngineOffDatadocs);
              // this.getalertEngineData();
            }
          } else {
            this.loading = false;
            this.toastr.error("No share link found");
          }
        },
        (error) => {
          this.loading = false;
          this.toastr.error(error);
        }
      );
    } else {
      this.batchFilter = {
        fromDate: this.stdate + "T00:00:00.000Z",
        toDate: this.endate + "T23:59:59.000Z",
        pinno: (this.id = this.route.snapshot.params["id"]),
      };
      this.loading = true;
      this.fromDate = this.datePipe.transform(this.stdate, "dd-MM-yyyy");
      this.toDate = this.datePipe.transform(this.endate, "dd-MM-yyyy");
      this.shareLinkData = [];
      this.accountService.getShareLink(this.batchFilter).subscribe(
        (data) => {
          console.log("Dataaaa==", data);
          if (data) {
            this.loading = false;
            this.shareLinkData = data;
            if (this.shareLinkData.status == "Success") {
              this.shareLinkData = data;
              this.url = this.shareLinkData.link;
            } else {
              this.toastr.error("No share link found");
              // this.EngineOffDatadocs = this.EngineOffData.docs
              //  this.isChecked = false;
              //  console.log(this.EngineOffDatadocs);
              // this.getalertEngineData();
            }
          } else {
            this.loading = false;
            this.toastr.error("No sahre link found");
          }
        },
        (error) => {
          this.loading = false;
          this.toastr.error(error);
        }
      );
    }
  }
  // validateDate(){
  //   this.calculateDiff(this.form.value.stdate);
  //   if(this.days<=9)
  //   {
  //     this.EngineOffData();
  //     this.EngineOnData();
  //     this.getVehicleReport();
  //     this.getSummaryData();
  //     this.getVehicleConsumption();
  //     this.getVehicleBatch();
  //     this.getEngineHours();
  //   }
  //   else
  //   {
  //     this.alertService.error("Please select valid date")
  //   }
  // }
  getEngineOff() {
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate);
      if (this.days <= 9) {
        this.batchFilter = {
          gte: this.dtform.value.stdate + "T00:00:00.000Z",
          lt: this.dtform.value.endate + "T23:59:59.000Z",
          pinno: (this.id = this.route.snapshot.params["id"]),
        };
        this.loading = true;
        this.EngineOffDatadocs = [];
        this.accountService.getEngineOff(this.batchFilter).subscribe(
          (data) => {
            if (data) {
              this.loading = false;
              this.EngineOffData = data;
              console.log("OFF DATA ==", this.EngineOffData);

              if (this.EngineOffData.status) {
                this.toastr.error("No engine off data found");
              } else {
                this.EngineOffData = data;
                this.EngineOffDatadocs = this.EngineOffData.docs;
                this.isChecked = false;
                console.log("engine off data", this.EngineOffDatadocs);
                // this.getalertEngineData();
              }
            } else {
              this.loading = false;
              this.toastr.error("No engine off data found");
            }
          },
          (error) => {
            this.loading = false;
            this.toastr.error(error);
          }
        );
      } else {
        this.toastr.error(
          "Date range should not exceed 10 days.Please select valid date for engine off data"
        );
      }
    } else {
      this.batchFilter = {
        gte: this.stdate + "T00:00:00.000Z",
        lt: this.endate + "T23:59:59.000Z",
        pinno: (this.id = this.route.snapshot.params["id"]),
      };
      this.loading = true;
      this.EngineOffDatadocs = [];
      this.accountService.getEngineOff(this.batchFilter).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.EngineOffData = data;
            if (this.EngineOffData.status) {
              this.toastr.error("No engine off data found");
            } else {
              this.EngineOffData = data;
              this.EngineOffDatadocs = this.EngineOffData.docs;
              this.isChecked = false;
              console.log(this.EngineOffDatadocs);
              // this.getalertEngineData();
            }
          } else {
            this.loading = false;
            this.toastr.error("No engine off data found");
          }
        },
        (error) => {
          this.loading = false;
          this.toastr.error(error);
        }
      );
    }
  }

  getEngineOn() {
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate);
      if (this.days <= 9) {
        this.batchFilter = {
          gte: this.dtform.value.stdate + "T00:00:00.000Z",
          lt: this.dtform.value.endate + "T23:59:59.000Z",
          pinno: (this.id = this.route.snapshot.params["id"]),
        };
        this.loading = true;
        this.EngineOnDatadocs = [];
        this.accountService.getEngineOn(this.batchFilter).subscribe(
          (data) => {
            if (data) {
              this.loading = false;
              this.EngineOnData = data;
              if (this.EngineOnData.status) {
                this.toastr.error("No engine on data found");
              } else {
                this.EngineOnDatadocs = this.EngineOnData.docs;
                console.log("on data", this.EngineOnDatadocs);
                this.EngineOnDatadocs.forEach((element) => {
                  element.extras.forEach((element1) => {
                    const date = element.devicePublishTime;
                    const event = new Date(date);
                    const reqDate = event.toLocaleString('en-IN', { timeZone: 'UTC' });
                    const formattedDistance = element1.distance !== undefined ? element1.distance.toFixed(5) : undefined; 
                    const formattedEngHours = element.engineHours !== undefined ? element.engineHours.toFixed(2) : undefined; 
                    this.engineONExcelData.push({
                      "Date & Time": reqDate,
                      "Fuel Level": element1.fuelLevel,
                      Engine: element.engineStatus,
                      "Engine Hours": formattedEngHours,
                      RPM: element1.rpm,
                      "Coolant Temprature": element1.coolantTemp,
                      "Battery Level(volt)": element1.batteryLevel,
                      "Travel Speed(Km/h)": element1.travelSpeed,
                      "Parking Switch": element1.parkingSwitch,
                      "Hydraulic Oil Filter Choke":
                        element1.hydralicOilFilterChoke,
                      "Oil Pressure(Bar)": element1.oilpressure,
                      "Fuel(L)": element1.fuelInLitres,
                      "Distance(kms)": formattedDistance,
                    });
                  });
                });
                this.isChecked = false;
                // this.getalertEngineData();
              }
            } else {
              this.loading = false;
              this.toastr.error("No engine on data found");
            }
          },
          (error) => {
            this.loading = false;
            this.toastr.error(error);
          }
        );
      } else {
        this.toastr.error(
          "Date range should not exceed 10 days.Please select valid date for engine on data"
        );
      }
    } else {
      this.batchFilter = {
        gte: this.stdate + "T00:00:00.000Z",
        lt: this.endate + "T23:59:59.000Z",
        pinno: (this.id = this.route.snapshot.params["id"]),
      };
      this.loading = true;
      this.EngineOnDatadocs = [];
      this.accountService.getEngineOn(this.batchFilter).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.EngineOnData = data;
            if (this.EngineOnData.status) {
              this.toastr.error("No engine on data found");
            } else {
              if (this.deviceType == "dvmapb" || this.deviceType == "Advance" || this.deviceType == "advance" || this.deviceType == "dvmap") {
                this.EngineOnDatadocs = this.EngineOnData.docs;
                console.log("on data", this.EngineOnDatadocs);
                this.EngineOnDatadocs.forEach((element) => {
                  element.extras.forEach((element1) => {
                    const date = element.devicePublishTime;
                    const event = new Date(date);
                    const reqDate = event.toLocaleString('en-IN', { timeZone: 'UTC' });
                    const formattedDistance = element1.distance !== undefined ? element1.distance.toFixed(5) : undefined; 
                    this.engineONExcelData.push({
                      // "Date & Time": new Date(element.devicePublishTime),
                      "Date & Time": reqDate,
                      "Fuel Level": element1.fuelLevel + "("+element1.fuelPercentage+")",
                      "Fuel %": element1.fuelPercentage,
                      "Coolant Temprature": element1.coolantTemp,
                      "Oil Pressure(Bar)": element1.oilpressure,
                      Engine: element.engineStatus,
                      RPM: element1.rpm,
                      "Battery Level(volt)": element1.batteryLevel,
                      "Parking Switch": element1.parkingSwitch,
                      "Hydraulic Oil Filter Choke": element1.hydralicOilFilterChoke,
                      "Travel Speed(Km/h)": element1.travelSpeed,
                      // "Fuel(L)": element1.fuelInLitres,
                      "Distance(kms)": formattedDistance,
                    });
                  });
                });
                this.isChecked = false;
                // this.getalertEngineData();
              }else if(this.deviceType == "bs4"){
                this.EngineOnDatadocs = this.EngineOnData.docs;
                console.log("on data", this.EngineOnDatadocs);
                this.EngineOnDatadocs.forEach((element) => {
                  element.extras.forEach((element1) => {
                    const date = element.devicePublishTime;
                    const event = new Date(date);
                    const reqDate = event.toLocaleString('en-IN', { timeZone: 'UTC' });
                    const formattedDistance = element1.distance !== undefined ? element1.distance.toFixed(5) : undefined; 
                    const formattedEngHours = element1.engineHours !== undefined ? element1.engineHours.toFixed(2) : undefined;
                    this.engineONExcelData.push({
                      // "Date & Time": new Date(element.devicePublishTime),
                      "Date & Time": reqDate,
                      "Fuel Level": element1.fuelLevel + "("+element1.fuelPercentage+")",
                      "Coolant Temprature": element1.coolantTemp,
                      "Oil Pressure(Bar)": element1.oilpressure,
                      Engine: element.engineStatus,
                      "Engine Hours": formattedEngHours,
                      RPM: element1.rpm,
                      "Battery Level(volt)": element1.batteryLevel,
                      "Parking Switch": element1.parkingSwitch,
                      "Hydraulic Oil Filter Choke": element1.hydralicOilFilterChoke,
                      "Travel Speed(Km/h)": element1.travelSpeed,
                      // "Fuel(L)": element1.fuelInLitres,
                      "Distance(kms)": formattedDistance,
                      "WaterIn Fuel Level": element1.waterinFuelLevel,
                      "Cold Start Lamp": element1.coldStartLamp,
                      "MI Lamp": element1.MalfunctionIndLamp,
                      "System Lamp": element1.systemLamp,
                      "Diesel Exhaust fluid1": element1.dieselExhaustfluid1,
                      "Diesel Exhaust fluid2": element1.dieselExhaustfluid2,
                    });
                  });
                });
                this.isChecked = false;
                // this.getalertEngineData();
              }else if(this.deviceType == "bs5"){
                this.EngineOnDatadocs = this.EngineOnData.docs;
                console.log("on data", this.EngineOnDatadocs);
                this.EngineOnDatadocs.forEach((element) => {
                  element.extras.forEach((element1) => {
                    const date = element.devicePublishTime;
                    const event = new Date(date);
                    const reqDate = event.toLocaleString('en-IN', { timeZone: 'UTC' });
                    const formattedDistance = element1.distance !== undefined ? element1.distance.toFixed(5) : undefined; 
                    const formattedEngHours = element1.engineHours !== undefined ? element1.engineHours.toFixed(2) : undefined;
                    this.engineONExcelData.push({
                      // "Date & Time": new Date(element.devicePublishTime),
                      "Date & Time": reqDate,
                      "Fuel Level": element1.fuelLevel + "("+element1.fuelPercentage+")",
                      "Coolant Temprature": element1.coolantTemp,
                      "Oil Pressure(Bar)": element1.oilpressure,
                      Engine: element.engineStatus,
                      "Engine Hours": formattedEngHours,
                      RPM: element1.rpm,
                      "Battery Level(volt)": element1.batteryLevel,
                      "Parking Switch": element1.parkingSwitch,
                      "Hydraulic Oil Filter Choke": element1.hydralicOilFilterChoke,
                      "Travel Speed(Km/h)": element1.travelSpeed,
                      // "Fuel(L)": element1.fuelInLitres,
                      "Distance(kms)": formattedDistance,
                      "WaterIn Fuel Level": element1.waterinFuelLevel,
                      "Cold Start Lamp": element1.coldStartLamp,
                      "MI Lamp": element1.MalfunctionIndLamp,
                      "System Lamp": element1.systemLamp,
                      "Diesel Exhaust fluid1": element1.dieselExhaustfluid1,
                      "Diesel Exhaust fluid2": element1.dieselExhaustfluid2,
                      "Dpf Lamp": element1.dpfLamp,
                      "Engine Exhaust Temp": element1.EngineExhaustTemp,
                    });
                  });
                });
                this.isChecked = false;
                // this.getalertEngineData();
              }
              
            }
          } else {
            this.loading = false;
            this.toastr.error("No engine on data found");
          }
        },
        (error) => {
          this.loading = false;
          this.toastr.error(error);
        }
      );
    }
  }
  // inactiveRecords(event: any){

  //   if(event){
  //     this.inActive = false;
  //   this.accountService.getAllDevice2()
  //   .pipe(first())
  //   .subscribe(devices => {this.devices = devices
  //     this.devices = this.devices.docs.filter(it => it.status == 'InActive');
  //     this.inActive = true;
  //   });

  // }

  // else {
  //   this.inActive = false;
  //  this.getDeviceData();

  // }

  // }

  exportEngineOnXLSX() {
    if (this.engineONExcelData.length > 0) {
      this.excelxlsxService.exportAsExcelFile(
        this.engineONExcelData,
        "EngineON Master"
      );
    } else {
      this.toastr.error("No excel data found");
    }
  }
  getalertEngineData(event) {
    this.calculateDiff(this.dtform.value.stdate);
    if (this.days <= 9) {
      if (event.target.checked) {
        this.alertEngineData = [];
        this.isChecked = true;
        if (this.selected2 == "on") {
          this.EngineOnDatadocs.forEach((element) => {
            if (element.extras) {
              element.extras.forEach((element1) => {
                if (
                  element1.fuelLevel == this.alertValues[0].fuelLevelw1 ||
                  element1.fuelLevel == this.alertValues[0].fuelLevelc ||
                  (element1.coolantTemp >= this.alertValues[0].coolantTempw1 &&
                    element1.coolantTemp <=
                      this.alertValues[0].coolantTempw2) ||
                  element1.coolantTemp >= this.alertValues[0].coolantTempc ||
                  (element1.batteryLevel <=
                    this.alertValues[0].batteryLevelw1 &&
                    element1.batteryLevel >=
                      this.alertValues[0].batteryLevelc) ||
                  element1.batteryLevel <= this.alertValues[0].batteryLevelc ||
                  element1.hydralicOilFilterChoke ==
                    this.alertValues[0].hydralicOilFilterChokec ||
                  element1.oilpressure == this.alertValues[0].oilpressurec
                ) {
                  this.alertEngineData.push(element);
                }
              });
            }
          });
          this.EngineOnDatadocs = [];
          this.p = 1;
          this.EngineOnDatadocs = this.alertEngineData;
        } else if (this.selected2 == "off") {
          this.EngineOffDatadocs.forEach((element) => {
            if (element.extras) {
              element.extras.forEach((element1) => {
                if (
                  (element1.batteryLevel <=
                    this.alertValues[0].batteryLevelw1 &&
                    element1.batteryLevel >=
                      this.alertValues[0].batteryLevelc) ||
                  element1.batteryLevel <= this.alertValues[0].batteryLevelc
                ) {
                  this.alertEngineData.push(element);
                }
              });
            }
          });
          this.EngineOffDatadocs = [];
          this.p = 1;
          this.EngineOffDatadocs = this.alertEngineData;
          console.log("AlertEngineOffData", this.EngineOffDatadocs);
        }
      } else {
        this.isChecked = false;
        if (this.selected2 == "on") {
          this.getEngineOn();
        } else if (this.selected2 == "off") {
          this.getEngineOff();
        }
      }
    } else {
      this.toastr.error(
        "Date range should not exceed 10 days.Please select valid date alert engine data"
      );
    }
  }

  getVehicleReport() {
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate);
      if (this.days <= 9) {
        this.batchFilter = {
          gte: this.dtform.value.stdate + "T00:00:00.000Z",
          lt: this.dtform.value.endate + "T23:59:59.000Z",
          pinno: (this.id = this.route.snapshot.params["id"]),
        };
        this.loading = true;
        this.reportDatadocs = [];
        this.accountService.getVehicleTrackReport(this.batchFilter).subscribe(
          (data) => {
            this.reportData = data;
            console.log("report data", this.reportData.docs);
            if (this.reportData) {
              this.loading = false;
              if (this.reportData.status) {
                this.toastr.error("No report data found");
              } else {
                if (this.reportData.docs) {
                  this.reportDatadocs = this.reportData.docs;
                  console.log("Summary Report", this.reportDatadocs);
                  this.lat = Number(this.reportDatadocs.lat.toString());
                  this.lng = Number(this.reportDatadocs.lng.toString());
                  this.getOpenStreetmapData();
                  console.log("Summary Report 2", this.lat, this.lng);
                } else {
                  return false;
                }
              }
            } else {
              this.loading = false;
              this.toastr.error("No report data found");
            }
          },
          (error) => {
            this.loading = false;
            this.toastr.error(error);
          }
        );
      } else {
        this.toastr.error(
          "Date range should not exceed 10 days.Please select valid date for report data"
        );
      }
    } else {
      this.batchFilter = {
        gte: this.stdate + "T00:00:00.000Z",
        lt: this.endate + "T23:59:59.000Z",
        pinno: (this.id = this.route.snapshot.params["id"]),
      };
      this.loading = true;
      this.reportDatadocs = [];
      this.accountService.getVehicleTrackReport(this.batchFilter).subscribe(
        (data) => {
          this.reportData = data;
          if (this.reportData) {
            this.loading = false;
            if (this.reportData.status) {
              this.toastr.error("No report data found");
            } else {
              if (this.reportData.docs) { 
                this.reportDatadocs = this.reportData.docs;
                console.log("Summary Report", this.reportDatadocs);
                this.lat = Number(this.reportDatadocs.lat.toString());
                this.lng = Number(this.reportDatadocs.lng.toString());
                this.getOpenStreetmapData();
                console.log("Summary Report 2", this.lat, this.lng);
              } else {
                return false;
              }
            }
          } else {
            this.loading = false;
            this.toastr.error("No report data found");
          }
        },
        (error) => {
          this.loading = false;
          this.toastr.error(error);
        }
      );
    }
  }

  geocodeLatLng(lat, lng) {
    const latlng = {
      lat: this.lat,

      lng: this.lng,
    };

    this.loading = true;

    this.ngZone.run(() => {
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: latlng }, (results, status) => {
        console.log(results, status);

        if (status !== google.maps.GeocoderStatus.OK) {
          this.loading = false;

          alert(status);
        } else if (status == google.maps.GeocoderStatus.OK) {
          this.loading = false;

          console.log(results);

          this.address = results[0].formatted_address;
        } else {
          this.loading = false;

          this.toastr.error("No address found");
        }
      });
    });
  }

  getOpenStreetmapData() {
    const lat = this.lat;
    const lon = this.lng;
    const appURL = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + lat + "&lon=" + lon;
    //const appURL = "https://nominatim.openstreetmap.org/reverse?format=geojson&lat="+lat+"&lon="+lon;
    this.accountService.getLocationInfo(appURL).subscribe((res) => {
      this.locationInfo = res;
      this.address = this.locationInfo.display_name;
    });
  }
  getVehicleBatch() {
    debugger
    this.filterData = [];
    this.smartBatch = true;
    this.noSmartBatch = false;
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate);
      if (this.days <= 9) {
        this.batchFilter = {
          gte: this.dtform.value.stdate + "T00:00:00.000Z",
          lt: this.dtform.value.endate + "T23:59:59.000Z",
          pinno: (this.id = this.route.snapshot.params["id"]),
        };
        this.loading = true;
        this.batchDatadocs = [];
        this.accountService.getBatchDatas(this.batchFilter).subscribe(
          (data) => {
            if (data) {
              this.loading = false;
              this.batchData = data;
              if (this.batchData.status) {
                this.toastr.error("No batch data found");
              } else {
                this.batchExcelData = [];
                this.batchDatadocs = this.batchData.docs;
                this.filterData = this.batchDatadocs.filter(it => it.project);
              
                if (this.filterData.length > 0) {
                  this.smartBatch = false
                  this.noSmartBatch = true
                } else {
                  this.smartBatch = true
                  this.noSmartBatch = false
                }

                this.batchDatadocs.forEach((element) => {
                  this.batchExcelData.push({
                    "Batch No.": element.batchNo,
                    "Machine ID": element.machineID,
                    "Batch Date": this.datePipe.transform(element.batchDate, "dd-MM-yyyy") + " " + element.batchTime,
                    AGGT10mm: element.aggt10mm,
                    AGGT20mm: element.aggt20mm,
                    AGGT30mm: element.aggt30mm,
                    CEMT01: element.cement01mm,
                    CEMT02: element.cement02mm,
                    SAND01: element.sand01mm,
                    SAND02: element.sand02mm,
                    Water: element.water,
                    Additive: element.additive1,
                    "Total WT": element.totalWT,
                    CuM: element.cum,
                  });
                });
                console.log("Batch data " + this.batchDatadocs);
              }
            } else {
              this.loading = false;
              this.toastr.error("No batch data found");
            }
          },
          (error) => {
            this.loading = false;
            this.toastr.error(error);
          }
        );
      } else {
        this.toastr.error(
          "Date range should not exceed 10 days.Please select valid date for batch data"
        );
      }
    } else {
      this.batchFilter = {
        gte: this.stdate + "T00:00:00.000Z",
        lt: this.endate + "T23:59:59.000Z",
        pinno: (this.id = this.route.snapshot.params["id"]),
      };
      this.loading = true;
      this.batchDatadocs = [];
      this.accountService.getBatchDatas(this.batchFilter).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.batchData = data;
            if (this.batchData.status) {
              this.toastr.error("No batch data found");
            } else {
              this.batchExcelData = [];
              this.batchDatadocs = this.batchData.docs;
              this.filterData = this.batchDatadocs.filter(it => it.project);
              
              if (this.filterData.length > 0) {
                this.smartBatch = false
                this.noSmartBatch = true
              } else {
                this.smartBatch = true
                this.noSmartBatch = false
              }
              
              this.batchDatadocs.forEach((element) => {
                this.batchExcelData.push({
                  "Batch No.": element.batchNo,
                  "Machine ID": element.machineID,
                  "Batch Date":
                    this.datePipe.transform(element.batchDate, "dd-MM-yyyy") +
                    " " +
                    element.batchTime,
                  AGGT10mm: element.aggt10mm,
                  AGGT20mm: element.aggt20mm,
                  AGGT30mm: element.aggt30mm,
                  CEMT01: element.cement01mm,
                  CEMT02: element.cement02mm,
                  SAND01: element.sand01mm,
                  SAND02: element.sand02mm,
                  Water: element.water,
                  Additive: element.additive1,
                  "Total WT": element.totalWT,
                  CuM: element.cum,
                });
              });
              console.log("Batch data " + this.batchDatadocs);
            }
          } else {
            this.loading = false;
            this.toastr.error("No batch data found");
          }
        },
        (error) => {
          this.loading = false;
          this.toastr.error(error);
        }
      );
    }
  }

  getVehicleConsumption() {
    //let vm = this;
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate);
      if (this.days <= 9) {
        this.batchFilter = {
          gte: this.dtform.value.stdate + "T00:00:00.000Z",
          lt: this.dtform.value.endate + "T23:59:59.000Z",
          pinno: (this.id = this.route.snapshot.params["id"]),
        };
        this.loading = true;
        this.consumptionDatadocs = [];
        //this.alertService.error("No consumption data found");
        this.accountService.getsumConsumptionData(this.batchFilter).subscribe(
          (data) => {
            if (data) {
              this.loading = false;
              this.consumptionData = data;
              if (this.consumptionData.status) {
                this.toastr.error("No consumption data found");
              } else {
                this.consumptionDatadocs = this.consumptionData.docs;
              }
            }
          },
          (error) => {
            this.loading = false;
            this.toastr.error(error);
          }
        );
      } else {
        this.toastr.error(
          "Date range should not exceed 10 days.Please select valid date for vehicle consumption data"
        );
      }
    } else {
      this.batchFilter = {
        gte: this.stdate + "T00:00:00.000Z",
        lt: this.endate + "T23:59:59.000Z",
        pinno: (this.id = this.route.snapshot.params["id"]),
      };
      this.loading = true;
      this.consumptionDatadocs = [];
      //this.alertService.error("No consumption data found");
      this.accountService.getsumConsumptionData(this.batchFilter).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.consumptionData = data;
            if (this.consumptionData.status) {
              this.toastr.error("No consumption data found");
            } else {
              this.consumptionDatadocs = this.consumptionData.docs;
            }
          }
        },
        (error) => {
          this.loading = false;
          this.toastr.error(error);
        }
      );
    }
  }
  getEngineHours() {
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate);
      if (this.days <= 9) {
        this.timestampFilter = {
          onTimestamp: this.dtform.value.stdate + "T00:00:00.000Z",
          offTimestamp: this.dtform.value.endate + "T23:59:59.000Z",
          pinno: (this.id = this.route.snapshot.params["id"]),
        };
        this.loading = true;
        this.engineDatadocs = true;
        this.engineDatadocs = [];
        this.accountService.getEngineDatas(this.timestampFilter).subscribe(
          (data) => {
            if (data) {
              this.loading = false;
              this.engineData = data;
              if (this.engineData.status) {
                this.toastr.error("No engine hours data found");
              } else {
                this.engineDatadocs = this.engineData.docs;
                this.engineDatadocs = _.sortBy(this.engineData.docs, (o) =>
                  moment["default"](o.createdAt)
                ).reverse();
                this.engineDatadocs.forEach((element) => {
                  this.engineHoursExcelData.push({
                    "Engine OnTime": this.datePipe.transform(
                      element.onTimestamp,
                      "dd-MM-yyyy h:mm:ss a",
                      "+0000"
                    ),
                    "Engine OffTime": this.datePipe.transform(
                      element.offTimestamp,
                      "dd-MM-yyyy h:mm:ss a",
                      "+0000"
                    ),
                    Duration: element.engineHours,
                  });
                });
                console.log("Engine DATA DOCS", this.engineDatadocs);
              }
            } else {
              this.loading = false;
              this.toastr.error("No engine hours data found");
            }
          },
          (error) => {
            this.toastr.error(error);
          }
        );
      } else {
        this.toastr.error(
          "Date range should not exceed 10 days.Please select valid date for engine hours data"
        );
      }
    } else {
      this.timestampFilter = {
        onTimestamp: this.stdate + "T00:00:00.000Z",
        offTimestamp: this.endate + "T23:59:59.000Z",
        pinno: (this.id = this.route.snapshot.params["id"]),
      };
      this.loading = true;
      this.engineDatadocs = true;
      this.engineDatadocs = [];
      this.accountService.getEngineDatas(this.timestampFilter).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.engineData = data;
            if (this.engineData.status) {
              this.toastr.error("No engine hours data found");
            } else {
              this.engineDatadocs = this.engineData.docs;
              this.engineDatadocs = _.sortBy(this.engineData.docs, (o) =>
                moment["default"](o.createdAt)
              ).reverse();
              this.engineDatadocs.forEach((element) => {
                this.engineHoursExcelData.push({
                  "Engine OnTime": this.datePipe.transform(
                    element.onTimestamp,
                    "dd-MM-yyyy h:mm:ss a",
                    "+0000"
                  ),
                  "Engine OffTime": this.datePipe.transform(
                    element.offTimestamp,
                    "dd-MM-yyyy h:mm:ss a",
                    "+0000"
                  ),
                  Duration: element.engineHours,
                });
              });
              console.log("Engine DATA DOCS", this.engineDatadocs);
            }
          } else {
            this.loading = false;
            this.toastr.error("No engine hours data found");
          }
        },
        (error) => {
          this.toastr.error(error);
        }
      );
    }
  }
  getSummaryData() {
    this.batchFilter = {
      pinno: (this.id = this.route.snapshot.params["id"]),
    };
    this.accountService.getSummary(this.batchFilter).subscribe(
      (data) => {
        this.summary = data;
        if (this.summary) {
          if (this.summary.message) {
            this.toastr.error("No summary data found");
          } else {
            this.engineHours = this.summary.engineHours.total;
            this.lastOperatedOn = this.summary.lastOperatedOn.time;
            this.updatedOn = this.summary.updatedOn;
            if (this.summary.serviceDue) {
              this.serviceDueNumber = this.summary.serviceDue.number;
              if (this.serviceDueNumber == 1) {
                this.serviceType = "st";
              } else if (this.serviceDueNumber == 2) {
                this.serviceType = "nd";
              } else if (this.serviceDueNumber == 3) {
                this.serviceType = "rd";
              } else {
                this.serviceType = "th";
              }
              this.serviceDueType = this.summary.serviceDue.type;
              this.serviceDueDate = this.summary.serviceDue.dueDate;
            } else if (this.engineHours < 7) {
              this.engineHoursTotal = this.engineHours;
              this.averageHours = this.summary.averageHours;
              this.distanceTravelled = this.summary.distance.distanceTravelled;
              this.averageDistance = this.summary.distance.averageDistance;
            } else if (this.engineHours >= 7 && this.engineHours < 14) {
              this.engineHoursTotal = this.engineHours;
              this.averageHours = this.summary.averageHours;
              this.distanceTravelled = this.summary.distance.distanceTravelled;
              this.averageDistance = this.summary.distance.averageDistance;
            } else this.engineHours >= 14;
            {
              this.engineHoursTotal = this.engineHours;
              this.averageHours = this.summary.averageHours;
              this.distanceTravelled = this.summary.distance.distanceTravelled;
              this.averageDistance = this.summary.distance.averageDistance;
            }
          }
        } else {
          this.loading = false;
          this.toastr.error("No summary data found");
        }
        console.log("Summary data", this.summary);
        let newdate = new Date(this.summary.lastOperatedOn.time);
        console.log("new date", newdate);
        this.dateDiff = Math.abs(
          Math.floor(
            (Date.UTC(
              this.date.getFullYear(),
              this.date.getMonth(),
              this.date.getDate()
            ) -
              Date.UTC(
                newdate.getFullYear(),
                newdate.getMonth(),
                newdate.getDate()
              )) /
              (1000 * 60 * 60 * 24)
          )
        );
      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }
  exportAsXLSX(): void {
    if (this.selected == "Batch") {
      this.excelxlsxService.exportAsExcelFile(
        this.batchExcelData,
        "BatchMaster"
      );
    } else if (this.selected == "Engine") {
      this.excelxlsxService.exportAsExcelFile(
        this.engineHoursExcelData,
        "EngineMaster"
      );
    }
  }

  // onSubmit() {
  //   this.submitted = true;

  //   if (this.dtform.invalid) {
  //     return;
  //   }
  //   this.getSummaryData();
  //  if (this.selected == 'Report') {
  //     this.getVehicleReport();
  //   }
  //  if (this.selected2 == "on") {
  //     this.getEngineOn();
  //   }
  //   else if (this.selected2 == "off") {
  //     this.getEngineOff();
  //   }
  //   else if (this.selected == 'Batch') {
  //     this.getVehicleBatch();
  //   }
  //   else if (this.selected == 'Consumption') {
  //     this.getVehicleConsumption();
  //   }
  //   else if(this.selected == 'Engine')
  //   {
  //     this.getEngineHours();
  //   }
  //   //  this.getVehicleBatch();
  // }

  onSubmit() {
    this.submitted = true;

    if (this.dtform.invalid) {
      return;
    }
    this.getSummaryData();
    if (this.selected == "Report") {
      this.getVehicleReport();
      if (this.selected2 == "on") {
        this.getEngineOn();
      }
      elseif(this.selected2 == "off")
      {
        this.getEngineOff();
      }
    }
    if(this.selected == "Batch")
    {
      this.getVehicleBatch();
    }

    if(this.selected == "Consumption")
    {
      this.getVehicleConsumption();
    }
    
    if(this.selected == "Engine")
    {
      this.getEngineHours();
    }
  }

  clearAlert() {
    setTimeout(() => {
      this.alertService.clear();
    }, 2000);
  }
}

function elseif(arg0: boolean) {
  throw new Error("Function not implemented.");
}
