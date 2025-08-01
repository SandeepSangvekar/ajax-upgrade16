import { Component, OnInit } from "@angular/core";
import { AccountService, AlertService } from "@app/_services";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { first } from "rxjs/operators";
import { threadId } from "worker_threads";
import { environment } from "@environments/environment";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import * as _ from "lodash";

@Component({
  selector: "app-alertanalytics",
  templateUrl: "./alertanalytics.component.html",
  styleUrls: ["./alertanalytics.component.less"],
})
export class AlertanalyticsComponent implements OnInit {
  title = "Alert Analytics Graph";
  type = "ComboChart";
  alertAnalytics = [];
  alertCoolantTempAnalytics = [];
  alertOilPressureAnalytics = [];
  alertFuelAnalytics = [];
  options = {
    vAxis: {
      ticks: [0, 2, 4, 6, 8],
    },
    hAxis: {
      textStyle: {
        fontSize: 10,
      },
    },
    colors: ["#3162a3", "#d15715", "#fa8e00", "#117325", "#8007b8"],
    lineWidth: 2,
    seriesType: "bars",
    series: { 2: { type: "line" }, 3: { type: "line" }, 4: { type: "line" } },
  };
  coolantTempOptions = {
    vAxis: {
      ticks: [0, 2, 4, 6, 8],
    },
    hAxis: {
      textStyle: {
        fontSize: 10,
      },
    },
    colors: ["#3162a3", "#d15715", "#fa8e00"],
    lineWidth: 2,
    seriesType: "bars",
    series: { 2: { type: "line" } },
  };
  fuelOptions = {
    vAxis: {
      ticks: [0, 2, 4, 6, 8],
    },
    hAxis: {
      textStyle: {
        fontSize: 10,
      },
    },
    colors: ["#3162a3", "#d15715", "#8007b8"],
    lineWidth: 2,
    seriesType: "bars",
    series: { 2: { type: "line" } },
  };
  OilPressureOptions = {
    vAxis: {
      ticks: [0, 2, 4, 6, 8],
    },
    hAxis: {
      textStyle: {
        fontSize: 10,
      },
    },
    colors: ["#3162a3", "#d15715", "#117325"],
    lineWidth: 2,
    seriesType: "bars",
    series: { 2: { type: "line" } },
  };
  width = 600;
  height = 400;
  date = new Date();
  p: number = 1;
  searchText;
  stdate = JSON.parse(sessionStorage.getItem("alertData")).gte;
  endate = JSON.parse(sessionStorage.getItem("alertData")).lt;
  pinno = JSON.parse(sessionStorage.getItem("alertData")).pinno;
  data: { fromDate: any; toDate: any; pinno: any };
  alertData: any;
  alertDataDocs: any;
  form: FormGroup;
  itemsPerPage = 50;
  status: any;
  showModal: boolean;
  customArray: any[];
  Distance: number;
  EngineHours: number;
  hours: number;
  totalHours: number;
  batteryhours: number;
  totalbatteryHours: number;
  coolantTemphours: number;
  totalcoolantTempHours: number;
  fuelhours: number;
  totalfuelHours: number;
  showCoolantTempDetails = false;
  showOilPressureDetails = false;
  showFuelDetails = false;
  showAllDetails = true;
  customBatteryArray: any[];
  oilpressurehours: number;
  totaloilpressureHours: number;
  customOilPressureArray: any;
  customCoolantTempArray: any;
  customFuelArray: any;
  todayDate: any;
  lastDate: any;
  pinNo = environment.labelpinno;
  loading = false;
  mapIconInd: any;
  days: number;
  clickType: any;
  mapObject: any;
  mappinno: any;
  parsobj: any;
  length: any;
  coordinatedata: any;
  fromDt: any;
  toDt: any;
  maplat: any;
  maplng: any;
  start_marker: any;
  end_marker: any;
  endMark = "./../../assets/img/images-removebg-preview.svg";
  mappathIcon = "./../../assets/img/map-marker-hi.svg";
  startMarker = "./../../assets/img/startMarker.svg";
  markerPath;
  viewType: any = "hybrid";

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getRecord();
    this.createUserLOgs();
    this.form = this.formBuilder.group({
      stdate: ["", Validators.required],
      endate: ["", Validators.required],
    });

    this.todayDate = this.datePipe.transform(this.endate, "yyyy-MM-dd");
    this.lastDate = this.datePipe.transform(this.stdate, "yyyy-MM-dd");
  }

  createUserLOgs() {
    let params = {
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
      module: "REPORT",
      function: "ALERT_ANALYTICS",
      type: "web",
    };
    this.accountService.createUserlogs(params).subscribe(
      (data) => {
        this.status = data["status"];
        // console.log("status", this.status);
      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }

  getRecord() {
    this.data = {
      fromDate: this.stdate,
      toDate: this.endate,
      pinno: this.pinno,
    };
    // console.log("Data === ", this.data);
    this.accountService.getAlertAnalytics(this.data).subscribe((result) => {
      this.alertData = result;
      this.alertDataDocs = this.alertData;
      // console.log("alert Data Docs ===", this.alertDataDocs);
      if (this.alertDataDocs == undefined) {
        this.toastr.error("No Record Found Between ");
      }
    });
  }

  showcoolantTempGraph() {
    this.showAllDetails = false;
    this.showOilPressureDetails = false;
    this.showCoolantTempDetails = true;
    this.showFuelDetails = false;
    if (this.alertDataDocs) {
      this.alertCoolantTempAnalytics = this.getCustomArrayForAlertAnalytics(
        this.alertDataDocs
      );
    }
  }

  showoilPressureGraph() {
    this.showAllDetails = false;
    this.showOilPressureDetails = true;
    this.showCoolantTempDetails = false;
    this.showFuelDetails = false;
    if (this.alertDataDocs) {
      this.alertOilPressureAnalytics = this.getCustomArrayForAlertAnalytics(
        this.alertDataDocs
      );
    }
  }

  showFuelGraph() {
    this.showAllDetails = false;
    this.showFuelDetails = true;
    this.showOilPressureDetails = false;
    this.showCoolantTempDetails = false;
    if (this.alertDataDocs) {
      this.alertFuelAnalytics = this.getCustomArrayForAlertAnalytics(
        this.alertDataDocs
      );
    }
  }

  getCustomArrayForAlertAnalytics(argumentData) {
    if (this.showAllDetails == true) {
      if (argumentData.length > 0) {
        this.customArray = [];
        this.Distance = 0;
        this.EngineHours = 0;
        argumentData.forEach((element, index) => {
          var a = element.totalEngineHours.split(":");
          this.hours = Number(a[1]) / 60;
          this.totalHours = Number(a[0]) + this.hours;
          var b = element.oilpressure.normal.split(":");
          this.oilpressurehours = Number(b[1]) / 60;
          this.totaloilpressureHours = Number(b[0]) + this.oilpressurehours;
          var c = element.coolantTemp.normal.split(":");
          this.coolantTemphours = Number(c[1]) / 60;
          this.totalcoolantTempHours = Number(c[0]) + this.coolantTemphours;
          var d = element.fuel.normal.split(":");
          this.fuelhours = Number(d[1]) / 60;
          this.totalfuelHours = Number(d[0]) + this.fuelhours;
          this.Distance = this.Distance + parseInt(element.totalDistance);
          this.EngineHours = this.EngineHours + this.totalHours;
          this.customFuelArray = [];
          this.customCoolantTempArray = [];
          this.customOilPressureArray = [];
          this.customArray.push([
            this.datePipe.transform(element.date, "dd-MM-yyyy"),
            this.totalHours,
            element.totalDistance,
            this.totaloilpressureHours,
            this.totalcoolantTempHours,
            this.totalfuelHours,
          ]);
        });
        return this.customArray;
      }
    }

    if (this.showCoolantTempDetails == true) {
      if (argumentData.length > 0) {
        this.customCoolantTempArray = [];
        this.Distance = 0;
        this.EngineHours = 0;
        argumentData.forEach((element, index) => {
          var a = element.totalEngineHours.split(":");
          this.hours = Number(a[1]) / 60;
          this.totalHours = Number(a[0]) + this.hours;
          var c = element.coolantTemp.normal.split(":");
          this.coolantTemphours = Number(c[1]) / 60;
          this.totalcoolantTempHours = Number(c[0]) + this.coolantTemphours;
          this.Distance = this.Distance + parseInt(element.totalDistance);
          this.EngineHours = this.EngineHours + this.totalHours;
          this.customArray = [];
          this.customCoolantTempArray.push([
            this.datePipe.transform(element.date, "dd-MM-yyyy"),
            this.totalHours,
            element.totalDistance,
            this.totalcoolantTempHours,
          ]);
        });
        return this.customCoolantTempArray;
      }
    }
    if (this.showOilPressureDetails == true) {
      if (argumentData.length > 0) {
        this.customOilPressureArray = [];
        this.Distance = 0;
        this.EngineHours = 0;
        argumentData.forEach((element, index) => {
          var a = element.totalEngineHours.split(":");
          this.hours = Number(a[1]) / 60;
          this.totalHours = Number(a[0]) + this.hours;
          var b = element.oilpressure.normal.split(":");
          this.oilpressurehours = Number(b[1]) / 60;
          this.totaloilpressureHours = Number(b[0]) + this.oilpressurehours;
          this.Distance = this.Distance + parseInt(element.totalDistance);
          this.EngineHours = this.EngineHours + this.totalHours;
          this.customArray = [];
          this.customCoolantTempArray = [];
          this.customOilPressureArray.push([
            this.datePipe.transform(element.date, "dd-MM-yyyy"),
            this.totalHours,
            element.totalDistance,
            this.totaloilpressureHours,
          ]);
        });
        return this.customOilPressureArray;
      }
    }
    if (this.showFuelDetails == true) {
      if (argumentData.length > 0) {
        this.customFuelArray = [];
        this.Distance = 0;
        this.EngineHours = 0;
        argumentData.forEach((element, index) => {
          var a = element.totalEngineHours.split(":");
          this.hours = Number(a[1]) / 60;
          this.totalHours = Number(a[0]) + this.hours;
          var d = element.fuel.normal.split(":");
          this.fuelhours = Number(d[1]) / 60;
          this.totalfuelHours = Number(d[0]) + this.fuelhours;
          this.Distance = this.Distance + parseInt(element.totalDistance);
          this.EngineHours = this.EngineHours + this.totalHours;
          this.customArray = [];
          this.customCoolantTempArray = [];
          this.customOilPressureArray = [];
          this.customFuelArray.push([
            this.datePipe.transform(element.date, "dd-MM-yyyy"),
            this.totalHours,
            element.totalDistance,
            this.totalfuelHours,
          ]);
        });
        return this.customFuelArray;
      }
    }
  }

  showGraph() {
    this.showAllDetails = true;
    this.showFuelDetails = false;
    this.showOilPressureDetails = false;
    this.showCoolantTempDetails = false;
    if (this.alertDataDocs) {
      this.alertAnalytics = this.getCustomArrayForAlertAnalytics(
        this.alertDataDocs
      );
    }
  }

  onSubmit() {
    this.data = {
      fromDate: this.form.value.stdate + "T00:00:00.000Z",
      toDate:this.form.value.endate + "T23:59:59.000Z",
      pinno: this.pinno,
    };
    // console.log("Data === ", this.data);
    this.accountService.getAlertAnalytics(this.data).subscribe((result) => {
      this.alertData = result;
      this.alertDataDocs = this.alertData;
      // console.log("alert date filter Data ===", this.alertDataDocs);

      if (this.alertDataDocs == undefined) {
        this.toastr.error("No Record Found Between ");
      }
    });
  }

  mapDate(pinno, f1, ind, devicePublishTime) {
    var devicePublishTime = devicePublishTime.slice(0, 10);
    this.loading = true;
    this.mapIconInd = ind;
    this.clickType = f1;
    this.mapObject = {
      gte: devicePublishTime + "T00:00:00.000Z",
      lt: devicePublishTime + "T23:59:59.000Z",
      pinno: pinno,
    };
    // this.createUserLogs();
    this.mappinno = this.mapObject.pinno;
    this.accountService
      .getTrackByCompanyID(this.mapObject)
      .subscribe((data) => {
        this.parsobj = data;
        // console.log("getAllTrackBy =", this.parsobj);
        if (this.parsobj.status == "Device has empty data") {
          this.toastr.error(this.parsobj.status);
          this.loading = false;
        } else {
          this.length = this.parsobj.docs.length;
          this.coordinatedata = this.parsobj.docs;
          this.coordinatedata = _.sortBy(this.parsobj.docs, (o) =>
            moment["default"](o.createdAt)
          ).reverse();
          // console.log(this.coordinatedata);
          this.toDt = devicePublishTime;
          const buttonModal = document.getElementById(
            "vehicleLocationModalopen"
          );
          buttonModal.click();
          var latlangValue = [];
          for (var i = 0; i < this.length; i += 1) {
            if (this.coordinatedata[i].lat1 == undefined) {
              var latVar = parseFloat(this.coordinatedata[i].lat);
            } else {
              var latVar = parseFloat(this.coordinatedata[i].lat1);
            }

            if (this.coordinatedata[i].lng1 == undefined) {
              var lngVar = parseFloat(this.coordinatedata[i].lng);
            } else {
              var lngVar = parseFloat(this.coordinatedata[i].lng1);
            }
            latlangValue.push({
              lat: latVar,
              lng: lngVar,
              // lat1: parseFloat(this.coordinatedata[i].lat1),
              // lng1: parseFloat(this.coordinatedata[i].lng1),
              time: this.coordinatedata[i].devicePublishTime,
              pinno: this.coordinatedata[i].pinno,
              deviceModel: this.coordinatedata[i].deviceModel,
              engineStatus: this.coordinatedata[i].engineStatus,
              rangedistance: this.coordinatedata[i].extras[0].distance,
              travelspeed: this.coordinatedata[i].extras[0].travelSpeed,
            });
          }

          // var result = _.uniqWith(latlangValue, (a, b) => _.isEqual(a.lat, b.lng));
          this.maplat = latlangValue[0].lat;
          this.maplng = latlangValue[0].lng;
          // console.log(latlangValue);
          this.coordinatedata = _.uniqWith(latlangValue, _.isEqual);
          this.start_marker = [this.coordinatedata[0]];
          this.end_marker = [latlangValue[latlangValue.length - 1]];
          this.loading = false;
          // console.log(this.start_marker);
          // console.log(this.end_marker);
        }
      });
  }

  // createUserLogs() {
  //   if (this.clickType == 'isPinNo') {
  //     this.params = {
  //       "loginName": JSON.parse(localStorage.getItem('user')).loginName,
  //       "module": "TRACK VEHICLES",
  //       "function": "MACHINE No. CLICK",
  //       "type": "web"
  //     }
  //   }
  //   else if (this.clickType == 'isMapPath') {
  //     this.params = {
  //       "loginName": JSON.parse(localStorage.getItem('user')).loginName,
  //       "module": "TRACK VEHICLES",
  //       "function": "MAP PATH CLICK",
  //       "type": "web"
  //     }
  //   }
  //   else if (this.clickType == 'isMeter') {
  //     this.params = {
  //       "loginName": JSON.parse(localStorage.getItem('user')).loginName,
  //       "module": "TRACK VEHICLES",
  //       "function": "GAUGE METER CLICK",
  //       "type": "web"
  //     }
  //   }

  //   this.accountService.createUserlogs(this.params).subscribe((data) => {
  //     this.status = data['status'];
  //     console.log("status", this.status);
  //   },
  //     error => {
  //       this.toastr.error(error);
  //     })
  // }
}
