import { Component, OnInit } from "@angular/core";
import { first, retry } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { AccountService, AlertService } from "@app/_services";
// import { stringify } from "@angular/compiler/src/util";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from "moment";
import * as _ from "lodash";
import { AuthService } from "@app/_services/auth.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.less"],
})
export class NotificationsComponent implements OnInit {
  today: Date;
  fromDate: string;
  toDate: string;
  startDate: string;
  itemsPerPage = 100;
  endDate: string;
  timeBetween: { gte: string; lt: string; useType: string; loginName: string };
  notificationList: any;
  form: FormGroup;
  submitted = false;
  analogInputs = "./../../assets/img/notification-icons/analog-inputs.png";
  automatedTrips = "./../../assets/img/notification-icons/automated-trips.png";
  coolant = "./../../assets/img/notification-icons/coolant.png";
  distanceTravelled = "./../../assets/img/notification-icons/distance-travelled.png";
  engineHours = "./../../assets/img/notification-icons/engine-hours.png";
  engineOilPressure = "./../../assets/img/notification-icons/engine-oil-pressure.png";
  fuelLevelConsumption = "./../../assets/img/notification-icons/fuel-level-consumption.png";
  geoFenceAlerts = "./../../assets/img/notification-icons/geo-fence-alerts.png";
  gpsTracking = "./../../assets/img/notification-icons/gps-tracking.png";
  internalStorage = "./../../assets/img/notification-icons/internal-storage.png";
  locationCapture = "./../../assets/img/notification-icons/location-capture.png";
  otaEnabled = "./../../assets/img/notification-icons/ota-enabled.png";
  overstay = "./../../assets/img/notification-icons/overstay.png";
  routePlanning = "./../../assets/img/notification-icons/route-planning.png";
  security = "./../../assets/img/notification-icons/security.png";
  speedTracking = "./../../assets/img/notification-icons/speed-tracking.png";
  vehicleBatteryVoltage = "./../../assets/img/notification-icons/vehicle-battery-voltage.png";
  vehicleImmobilization = "./../../assets/img/notification-icons/vehicle-immobilization.png";
  noIcon = "./../../assets/img/notification-icons/notification.png";
  notification: any;
  date = new Date();
  p: number = 1;
  searchText;
  useType;
  loginName;
  data: any;
  status: any;
  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private auth: AuthService
  ) {
    this.auth.authFunction(window.location.pathname);
  }

  ngOnInit() {
    this.createUserLOgs();
    this.getRecord();
    this.form = this.formBuilder.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"NOTIFICATION",
        "function":"NOTIFICATION",
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
 
  get f() {
    return this.form.controls;
  }

  getRecord() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 7);
    this.fromDate = this.datePipe.transform(this.today, "yyyy-MM-dd");
    this.toDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.startDate = this.fromDate.toString();
    this.endDate = this.toDate.toString();
    this.useType = JSON.parse(localStorage.getItem("user")).useType;
    this.loginName = JSON.parse(localStorage.getItem("user")).loginName;
    this.loginName = this.loginName.toUpperCase();
    this.data = {
      useType: this.useType,
      gte: this.startDate + "T00:00:00.000Z",
      lte: this.endDate + "T23:59:59.000Z",
    };
    
    this.accountService.getNotificationListAll(this.data).subscribe(
      (notification) => {
        this.notificationList = notification;
        this.notification = this.notificationList.docs;

        console.log("Notification List2 ====", this.notificationList);

        // this.trackdocs = _.sortBy(this.trackdocs, (o) => moment["default"](o.createdAt)).reverse();
        // if (this.trackdocs == undefined) {
        //   this.toastr.error("No Record Found Between " + this.datePipe.transform(this.today, 'yyyy-MM-dd') + " To " + this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
        // }
      });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T23:59:59.000Z",
      useType: JSON.parse(localStorage.getItem("user")).useType,
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
    };
    this.accountService
      .getNotificationList(this.timeBetween)
      .subscribe((notification) => {
        this.notificationList = notification;
        this.notification = this.notificationList.docs;

        // console.log("Notification List ===", this.notificationList);
        // this.track = track
        // this.trackdocs = this.track.docs
        // // console.log(this.trackdocs.createdAt);
        // this.trackdocs = _.sortBy(this.trackdocs, (o) => moment["default"](o.createdAt)).reverse();
        // console.log(this.trackdocs);

        // if (this.trackdocs == undefined) {
        //   this.toastr.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
        // }
      });
  }
}
