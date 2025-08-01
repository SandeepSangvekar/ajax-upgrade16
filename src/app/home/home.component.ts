import { Component, OnInit, ElementRef, ViewChild, AfterViewInit} from "@angular/core";
import { first } from "rxjs/operators";
import { User } from "@app/_models";
import { Machine } from "@app/_models";
import { AccountService, UsermanagemntService } from "@app/_services";
import { LayoutComponent } from "./layout.component";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Monitor } from "./index";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import * as _ from "lodash";
import { stringify } from "@angular/compiler/src/util";
import { environment } from "@environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  templateUrl: "list.component.html",
  styleUrls: ["list.component.css"],
})
export class HomeComponent implements OnInit {
  @ViewChild("openModal") openModal: ElementRef;
  showModal = true;
  iotNonIOTValue: any;
  iotDirections: any;
  today: Date = new Date();
  pipe = new DatePipe("en-US");
  todayWithPipe = null;
  users: any;
  machines: any;
  currentmonthcount: any;
  lastmonthcount: any;
  currentyearcount: any;
  vehicleparkCount: any;
  pinNo = environment.labelpinno;
  dashboardVehicleCount: any;
  showPolygon: any;
  location: any;
  allModel: any;
  devices: any;
  totalLength: any;
  activeDevices: any;
  parkvehicleCount: any;
  checkSignedon: any;
  east: number;
  west: number;
  north: number;
  south: number;
  central: number;
  allzone: any;
  eastzone: { name: string; value: number }[];
  westzone: { name: string; value: number }[];
  norhtzone: { name: string; value: number }[];
  southzone: any;
  centralzone: { name: string; value: number }[];
  totalvpark: number;
  coordinatedata: any;
  maplat: any;
  maplng: any;
  allModelDocs: any;
  date = new Date();
  iotNonIotValueNew: any;
  count: object;
  Active: any;
  InActive: any;
  monit: string;
  viewType: any = "hybrid";
  active = [];
  inactive = [];
  monitoring = [];
  hideVehPark = false;
  IndividualCount: number;
  InstitutionalCount: number;
  OthersCount: number;
  ContractorCount: number;

  vehicleParkData: any;
  vehicleParkDataByModel: any;
  totalLegends: any;
  deviceCount: any;
  monitordata: any;
  monitordatacount: any;
  deviceModel: string;
  selectedDeviceModel: string;
  agmmarker = "./../../assets/img/vehicle_icon.svg";
  dealerMarker = "./../../assets/img/dealerIcon.png";
  servicedata: any;
  Vmon: { name: string; value: any }[];
  credentials: { loginName: any; agreementSignedOn: string };
  performer: any;
  performercount: any;
  IOTValue: any;
  NonIOTValue: any;
  selectMonth: string = "currentMonth";
  selectedMonth: string;
  // vehiclePark:any;
  vehiclePark2: { name: string; value: number }[];
  vehiclePark = [];
  monthwise: Object;
  monthwisedata: any;
  modelList: any;
  modelListData: any[] = [];
  vehicleMonitoring: any;
  breakdownStat: any;
  serviceSchedule: any;
  scheduleService: { name: string; value: number }[];
  serviceScheduledStatus: any;
  top5Performers: {
    name: string;
    series: [
      {
        name: string;
        value: number;
      },
      {
        name: string;
        value: number;
      }
    ];
  }[];
  runHour: { name: string; value: number }[];
  runHour2: { name: string; value: number }[];
  runHour3: { name: string; value: number }[];
  customerSegmentation: { name: string; value: number }[];
  customerSegmentationCount: any;
  upcomingServiceCount: number;
  overdueServiceCount: number;
  overdueServiceCountPre: any;
  upcomingServiceCountPre: any;
  pastSevenDaysCount: number;
  pastSevenDaysCountPre: any;
  pastThirtyDaysCountPre: any;
  pastThirtyDaysCount: number;
  showvehiclePark = true;
  showvehiclePark2 = true;
  IOTCount: number;
  NonIOTCount: number;
  TotalCount: number;
  customArray: any[];
  VehicleParkCustomArray: any[];
  vehicleParkDeviceCountData: any;
  directionArray: any[] = [
    { name: "PLANT", value: "PLANT" },
    { name: "east", value: "EAST" },
    { name: "west", value: "WEST" },
    { name: "north", value: "NORTH" },
    { name: "south1", value: "SOUTH1" },
    { name: "south2", value: "SOUTH2" },
  ];
  engineAssembly: number;
  engineAssemblyPre: any;
  gearInputShaft: number;
  gearInputShaftPre: any;
  brakePedalAssembly: number;
  brakePedalAssemblyPre: any;
  paintDefescts: number;
  paintDefesctsPre: any;
  eleSensor: number;
  eleSensorPre: any;
  breakDownDataKeys: string[];
  breakDownDataValues: number[];
  breakDownProgressBar1: any;
  breakDownProgressBar2: any;
  breakDownProgressBar3: any;
  breakDownProgressBar4: any;
  breakDownProgressBar5: any;
  secConvert: any;
  EngineHours2: number;
  vehicleParkDataCountByModel: any;
  tempIOTArray = [];
  tempNONIotArray = [];
  utilizationData: { name: string; value: string }[];
  type: any;
  dealerData: any;
  dealerLtValue: any;
  inActive = false;
  isChecked;
  bannerData: any = [];
  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private usermanagementService: UsermanagemntService,
    private toastr:ToastrService
  ) {
    this.users = this.accountService.userValue;
  }

  ngOnInit() {
    this.getBannerData();
    this.getAll();
  }

  // ************* Chart Controls Start Here *******************
  colorScheme = {
    domain: ["#454397", "#e83e8c"],
  };

  colorSchemeVM = {
    domain: ["#28a745", "#dc3545"],
  };

  colorSchemeUT = {
    domain: ["#28a745", "#dc3545", "#4e35dc"],
  };

  colorSchemeBS = {
    domain: ["#007bff", "#ffc107", "#dc3545", "#28a745"],
  };

  colorSchemeSS = {
    domain: ["#007bff", "#ffc107", "#dc3545", "#28a745"],
  };

  colorSchemeSS2 = {
    domain: ["#007bff", "#28a745"],
  };

  colorSchemeTP = {
    domain: ["#ffc107", "#343a40"],
  };

  colorSchemeRHS = {
    domain: ["#007bff", "#dc3545", "#28a745"],
  };

  colorSchemeCS = {
    domain: ["#28a745", "#007bff", "#ffc107", "#dc3545"],
  };

  view: any[] = [520, 225];
  view2: any[] = [250, 225];
  viewVM: any[] = [200, 230];
  viewVMd: any[] = [260, 230];
  viewUT: any[] = [145, 230];
  viewBS: any[] = [250, 200];
  viewSS: any[] = [250, 300];
  viewSS2: any[] = [340, 150];
  viewTP: any[] = [500, 220];
  viewRHS: any[] = [140, 140];
  viewCS: any[] = [200, 200];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "";
  showYAxisLabel = true;
  yAxisLabel = "";
  yAxisLabelVM = "No. of Vehicles";
  timeline = true;
  lastMonthPerformerData: any;
  currentMonthPerformerData: any;
  EngineHours: number;
  Distance: number;
  breakdownStatisticsdata: any;
  showDealerDiv = false;
  showDiv = false;

  // ***************** Chart Controls End Here *****************
  ngAfterViewInit(): void {
    //  throw new Error('Method not implemented.');
  }

  checkAgreement() {
    //console.log('user',JSON.parse(localStorage.getItem('user')))

    this.type = JSON.parse(localStorage.getItem("user")).role;

    //   if(type=='customer')
    //   {
    //  //  const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'CustDashboardComponent';
    //    this.router.navigateByUrl('CustomerDashboard');
    //  }
    this.checkSignedon = JSON.parse(
      localStorage.getItem("user")
    ).agreementSignedOn;

    if (this.checkSignedon == null) {
      console.log("RoleType", this.type);

      let popupLoaded = JSON.parse(localStorage.getItem("popupLoaded"));

      if (this.type === "dealer" || this.type === "customer") {
        this.showModal = false;
        this.openModal.nativeElement.click();
        //this.agree();
      }
      localStorage.setItem("popupLoaded", "1");
      console.log(
        "popup value ",
        JSON.parse(localStorage.getItem("popupLoaded"))
      );
    } else {
      const returnUrl =
        this.route.snapshot.queryParams["returnUrl"] || "dashboard";
      this.router.navigateByUrl(returnUrl);
    }
  }
  agree() {
    this.credentials = {
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
      agreementSignedOn: this.checkSignedon,
    };
    this.accountService
      .login(this.credentials)
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl =
            this.route.snapshot.queryParams["returnUrl"] || "dashboard";
          this.router.navigateByUrl(returnUrl);
          console.log("abcd");
          this.showModal = true;
        },
      });
  }
  logout() {
    this.accountService.logout();
  }

  getAll() {
    if (JSON.parse(localStorage.getItem("user")).role == "dealer") {
      this.showDealerDiv = true;
      this.showDiv = false;
    } else {
      this.showDiv = true;
      this.showDealerDiv = false;
    }
    this.checkAgreement();
    this.getVehiclePark();
    this.getDeviceModelData();
    this.getVehicleMonitoring();
    this.getBreakdownStat();
    this.getServiceScheduleData();
    this.getScheduleServiceStatus();
    this.getTop5Performers();
    this.getCustomerSegmentation();
    //this.getRunHour();
    this.getCurrentMonth();
    this.getLastMonth();
    this.getAllModel();
    this.getCurrentYear();
    this.getUtilization();
    this.createUserLOgs();
  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "DASHBOARD",
      "function": "DASHBOARD",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  // ************** New Dashboard code start Here *********************

  // ***********VEHICLE PARK Start Here****************

  selectedModel() {
    this.selectedDeviceModel = this.deviceModel;
    this.vehiclePark = [];
    this.getVehiclePark();
  }
  getDeviceModelData() {
    this.accountService
      .getAllModels()
      .pipe(first())
      .subscribe((result) => {
        this.modelList = result;
        this.modelListData = this.modelList.docs.filter(
          (it) => it.status == "Active"
        );
        this.modelListData.sort((a, b) =>
          a.title.toUpperCase() < b.title.toUpperCase()
            ? -1
            : a.title > b.title
            ? 1
            : 0
        );
        //this.selectedModel();
      });
  }
  getVehiclePark() {
    // this.selectedModel();
    if (this.selectedDeviceModel) {
      const data1 = {
        deviceModel: this.selectedDeviceModel,
      };
      this.accountService.getVehicleParkDataByModel(data1).subscribe((data) => {
        this.showvehiclePark = true;
        this.showvehiclePark2 = false;
        this.vehicleParkDataByModel = data;

        this.tempIOTArray = this.vehicleParkDataByModel["iot"];
        if (this.tempIOTArray.length != 0) {
          this.IOTCount = parseInt(this.tempIOTArray[0].total);
        } else {
          this.IOTCount = 0;
        }
        this.tempNONIotArray = this.vehicleParkDataByModel["nonIot"];

        if (this.tempNONIotArray.length != 0) {
          this.NonIOTCount = parseInt(this.tempNONIotArray[0].total);
        } else {
          this.NonIOTCount = 0;
        }
        this.TotalCount = this.IOTCount + this.NonIOTCount;

        if (this.vehicleParkDataByModel) {
          this.directionArray.forEach((dir, ind) => {
            this.vehiclePark.push({
              name: dir.value,
              series: [
                {
                  name: "IOT",
                  value: this.assignval("iot", 0, dir.name),
                },
                {
                  name: "NONIOT",
                  value: this.assignval("nonIot", 0, dir.name),
                },
              ],
            });
          });

          console.log(this.vehiclePark, "vehiclePark");
        } else {
          this.vehiclePark = [];
        }
      });
    } else {
      //let vm=this;
      var iottotal = 0;
      var noniottotal = 0;
      this.accountService
        .getVehicleParkData()
        .pipe(first())
        .subscribe((result) => {
          this.vehicleParkData = result;
          this.showvehiclePark = false;
          this.showvehiclePark2 = true;
          if (this.vehicleParkData) {
            this.vehicleParkData.iot.forEach((iotelement) => {
              iottotal = parseInt(iottotal + iotelement.total);
              //this.tempIOTArray.push(iottotal);
            });
            this.vehicleParkData.nonIot.forEach((nonIotelement) => {
              noniottotal = parseInt(noniottotal + nonIotelement.total);
            });
            this.vehiclePark2 = [
              { name: "IOT", value: iottotal },
              { name: "NONIOT", value: noniottotal },
            ];
            console.log("vehiclepark2", this.vehiclePark2);
          }
          this.IOTCount = iottotal;
          this.NonIOTCount = noniottotal;
          this.TotalCount = this.IOTCount + this.NonIOTCount;
        });
    }
  }

  assignval(type, index, direction) {
    let val: any = 0;
    if (type == "iot") {
      if (
        this.tempIOTArray &&
        this.tempIOTArray.length > 0 &&
        this.tempIOTArray[index][direction]
      ) {
        return this.tempIOTArray[index][direction];
      } else {
        return 0;
      }
    } else {
      if (
        this.tempNONIotArray &&
        this.tempNONIotArray.length > 0 &&
        this.tempNONIotArray[index][direction]
      ) {
        return this.tempNONIotArray[index][direction];
      } else {
        return 0;
      }
    }

    return val;
  }

  // ***********VEHICLE PARK End Here****************

  // ***********VEHICLE MONITORING Start Here****************
  getVehicleMonitoring() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem("user")).useType,
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
    };
    this.accountService.getMonitorData(data1).subscribe((data) => {
      this.monitordata = data;
      console.log("Vehicle Monitoring Data ====   ", this.monitordata);
      this.active = this.monitordata.countAnddetails.Active;
      this.inactive = this.monitordata.countAnddetails.InActive;
      this.vehicleMonitoring = [
        { name: "Active", value: this.active },
        { name: "Inactive", value: this.inactive },
      ];
    });
  }
  navMonitor() {
    this.router.navigateByUrl(`/dashboard/vehicle-monitoring`);
  }

  breakdownSt() {
    this.router.navigateByUrl(`/dashboard/breakdown-statistics`);
  }

  schCompServices() {
    this.router.navigateByUrl(`/dashboard/schedule-complete-services`);
  }

  utilization() {
    this.router.navigateByUrl(`/report/machine-utilization`);
  }

  topPerformers() {
    this.router.navigateByUrl(`/dashboard/top-5-Performers`);
  }

  vehicleRunHour() {
    this.router.navigateByUrl(`/dashboard/run-hour`);
  }

  customerSegment() {
    this.router.navigateByUrl(`/dashboard/customer-segmentation`);
  }

  getAllModel() {
    // debugger;
    // /dashboard/vehiclemon
    const data1 = {
      useType: JSON.parse(localStorage.getItem("user")).useType,
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
    };
    this.accountService.getAllvehiclemonModel(data1).subscribe((data) => {
      this.allModelDocs = data;
      this.allModel = this.allModelDocs.dataconcat;
      console.log("all Models   ", this.allModel);
      this.totalLength = this.allModel.length;
      this.dealerMapData();
      this.viewPolygon();
      this.activeDevices = this.allModel.filter((it) => it.status == "Active");
      this.devices = this.activeDevices.length;
      console.log("devices", this.devices);
    });
  }

  changeDealer(event: any) {
    console.clear();
    this.inActive = event;
    console.log("event=", this.inActive);
  }

  dealerMapData() {
    this.usermanagementService
      .getAlldealers()
      .pipe(first())
      .subscribe((dealer) => {
        this.dealerData = dealer;
        this.dealerData = this.dealerData.docs.filter(
          (it) => it.isActive == "true"
        );

        var dealerValue = [];
        for (var i = 0; i < this.dealerData.length; i++) {
          if(this.dealerData[i].lat) {
            dealerValue.push({
              lat: parseFloat(this.dealerData[i].lat),
              lng: parseFloat(this.dealerData[i].lng),
              name: this.dealerData[i].name,
              code: this.dealerData[i].code,
              address: this.dealerData[i].address.address,
              pinCode: this.dealerData[i].address.pinCode,
              state: this.dealerData[i].address.state,
            });
          }
        }

        this.dealerLtValue = dealerValue;
        console.log("dealerLtValue=", this.dealerLtValue);
      });
  }

  viewPolygon() {
    console.log("show length ", this.allModel.length);

    var latlangValue = [];
    for (var i = 0; i < this.allModel.length; i++) {
      let allModelType = "noniot";
      if (this.allModel[i].type == "dvmap") {
        allModelType = "iot";
      }
      latlangValue.push({
        lat: parseFloat(this.allModel[i].lat),
        lng: parseFloat(this.allModel[i].lng),
        date: moment(this.allModel[i].lastDataReceivedAt).format("DD-MM-YYYY"),
        time: moment(this.allModel[i].lastDataReceivedAt),
        pinno: this.allModel[i].pinno,
        engine_hours: this.allModel[i].totalEngineHours,
        cust_code: this.allModel[i].customerCode,
        mobile_no: this.allModel[i].customerMobile,
        type: allModelType,
      });
    }
    this.maplat = latlangValue[0].lat;
    this.maplng = latlangValue[0].lng;
    this.coordinatedata = latlangValue;
    console.log("coordinates", this.coordinatedata);

    const myLatLng = { lat: this.maplat, lng: this.maplng };

    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 8,
        center: myLatLng,
      }
    );
  }

  // ***********VEHICLE MONITORING End Here****************

  // ***********Utilization Start Here****************
  getUtilization() {
    // const data1 = {
    //  useType: JSON.parse(localStorage.getItem('user')).useType,
    //  loginName:JSON.parse(localStorage.getItem('user')).loginName
    // }
    //  this.accountService.getMonitorData(data1).subscribe((data) => {
    //    this.monitordata = data
    //    console.log("Vehicle Monitoring Data ====   ", this.monitordata);
    //    this.active = this.monitordata.countAnddetails.Active
    //    this.inactive = this.monitordata.countAnddetails.InActive
    this.utilizationData = [
      { name: "Eng. Hrs", value: "12" },
      { name: "Batches", value: "10" },
      { name: "Prod.", value: "5" },
    ];
    //  })
  }
  // ***********Utilization end Here****************

  // ***********BREAKDOWN STATISTICS Start Here****************
  getBreakdownStat() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem("user")).useType,
      loginName: JSON.parse(
        localStorage.getItem("user")
      ).loginName.toUpperCase(),
    };
    this.accountService.getBreakdownStatisticsCount(data1).subscribe((data) => {
      this.breakdownStatisticsdata = data;
      this.breakdownStatisticsdata = this.breakdownStatisticsdata.count;
      console.log(
        "Break Down Statistics Data == ",
        this.breakdownStatisticsdata
      );
      if (this.breakdownStatisticsdata) {
        this.breakDownDataKeys = Object.keys(this.breakdownStatisticsdata);
        this.breakDownDataValues = Object.values(this.breakdownStatisticsdata);

        this.breakDownProgressBar1 = this.breakDownDataValues[0] + "%";
        this.breakDownProgressBar2 = this.breakDownDataValues[1] + "%";
        this.breakDownProgressBar3 = this.breakDownDataValues[2] + "%";
        this.breakDownProgressBar4 = this.breakDownDataValues[3] + "%";
        this.breakDownProgressBar5 = this.breakDownDataValues[4] + "%";
      } else {
        return;
      }
    });

    this.breakdownStat = [
      {
        name: "EH",
        value: 10,
      },
      {
        name: "CB",
        value: 5,
      },
      {
        name: "RAS",
        value: 3,
      },
      {
        name: "EA",
        value: 2,
      },
    ];
  }
  // ***********BREAKDOWN STATISTICS End Here****************

  // ***********SERVICE SCHEDULE Start Here****************
  getServiceScheduleData() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem("user")).useType,
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
    };
    this.accountService.getServiceSchedule(data1).subscribe((data) => {
      this.servicedata = data;
      console.log(" Service Schedule Data == ", this.servicedata);
      if (this.servicedata) {
        this.upcomingServiceCount =
          this.servicedata.countAnddetails.upcomingcount;
        this.upcomingServiceCountPre = this.upcomingServiceCount + "%";
        this.overdueServiceCount =
          this.servicedata.countAnddetails.Overduecount;
        this.overdueServiceCountPre = this.overdueServiceCount + "%";
        this.pastSevenDaysCount =
          this.servicedata.countAnddetails["Overdue Past 7 Days count"];
        this.pastSevenDaysCountPre = this.pastSevenDaysCount + "%";
        this.pastThirtyDaysCount =
          this.servicedata.countAnddetails["Overdue Past 30 Days count"];
        this.pastThirtyDaysCountPre = this.pastThirtyDaysCount + "%";
      } else {
        return;
      }
    });
  }

  getScheduleServiceStatus() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem("user")).useType,
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
    };
    this.accountService.getServiceSchedulesStatus(data1).subscribe((data) => {
      this.serviceScheduledStatus = data;
      console.log(
        " Service Schedule Status Data == ",
        this.serviceScheduledStatus
      );
      this.scheduleService = [
        {
          name: "Scheduled",
          value: this.serviceScheduledStatus.countAnddetails.open,
        },
        {
          name: "Complete",
          value: this.serviceScheduledStatus.countAnddetails.closed,
        },
      ];
    });
  }

  navService() {
    this.router.navigateByUrl(`/dashboard/service`);
  }

  // ***********SERVICE SCHEDULE End Here****************

  // ***********TOP 5 PERFORMERS Start Here****************

  changeMonth() {
    this.getTop5Performers();
  }
  getTop5Performers() {
    if (this.selectMonth == "lastMonth") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };
      this.accountService
        .getLastmonthtopfiveperformer(data1)
        .subscribe((data) => {
          this.lastMonthPerformerData = data;
          this.top5Performers = this.getCustomArrayForTopPerformers(
            this.lastMonthPerformerData
          );
          console.log("lasttopperformerdata", this.lastMonthPerformerData);
        });
    } else if (this.selectMonth == "currentMonth") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };
      this.accountService
        .getCurrentmonthtopfiveperformer(data1)
        .subscribe((data) => {
          this.currentMonthPerformerData = data;
          this.top5Performers = this.getCustomArrayForTopPerformers(
            this.currentMonthPerformerData
          );
          console.log("Distance", this.Distance);
          console.log("topperformerdata", this.top5Performers);
        });
    }
  }

  getCustomArrayForTopPerformers(argumentData) {
    if (argumentData.length > 0) {
      this.customArray = [];
      this.Distance = 0;
      this.EngineHours = 0;
      argumentData.forEach((element, index) => {
        this.Distance = this.Distance + parseInt(element.totalDistance);
        this.EngineHours = this.EngineHours + parseInt(element.totalSecond);
        this.secConvert = this.EngineHours * (1 / 3600);
        this.EngineHours2 = parseInt(this.secConvert);
        this.customArray.push({
          name: element.pinno.slice(-7, -1) + element.pinno.slice(-1),
          series: [
            { name: "Total Hrs", value: element.totalSecond * (1 / 3600) },
            { name: "Total Distance", value: element.totalDistance },
          ],
        });
      });
      return this.customArray;
    }
  }
  // ***********TOP 5 PERFORMERS End Here****************

  // ***********RUN HOUR STATISTICS Start Here****************
  getCurrentMonth() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem("user")).useType,
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
    };
    this.accountService.getCurrentMonthCountInner(data1).subscribe((data) => {
      this.currentmonthcount = data;
      console.log("run hour current month data=== ", this.currentmonthcount);
      if (this.currentmonthcount) {
        this.getRunHour();
      } else {
        return;
      }
    });
  }
  getLastMonth() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem("user")).useType,
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
    };
    this.accountService.getLastMonthCountInner(data1).subscribe((data) => {
      this.lastmonthcount = data;
      console.log(this.lastmonthcount);
      if (this.lastmonthcount) {
        this.getRunHour();
      } else {
        return;
      }
    });
  }
  getCurrentYear() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem("user")).useType,
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
    };
    this.accountService.getCurrentYearCountInner(data1).subscribe((data) => {
      this.currentyearcount = data;
      console.log(this.currentyearcount);
      if (this.currentyearcount) {
        this.getRunHour();
      } else {
        return;
      }
    });
  }

  getRunHour() {
    this.runHour = [
      {
        name: "0 hrs to 50 hrs",
        value: this.currentmonthcount.fiftyCount,
      },
      {
        name: "50 hrs to 100 hrs",
        value: this.currentmonthcount.fiftyplusCount,
      },
      {
        name: "Above 150 hrs",
        value: this.currentmonthcount.onefiftyplusCount,
      },
    ];

    console.log("run hours1==", this.runHour);

    this.runHour2 = [
      {
        name: "0 hrs to 50 hrs",
        value: this.lastmonthcount.fiftyCount,
      },
      {
        name: "50 hrs to 100 hrs",
        value: this.lastmonthcount.fiftyplusCount,
      },
      {
        name: "Above 150 hrs",
        value: this.lastmonthcount.onefiftyplusCount,
      },
    ];
    console.log("run hours2==", this.runHour2);

    this.runHour3 = [
      {
        name: "0 hrs to 50 hrs",
        value: this.currentyearcount.fiftyCount,
      },
      {
        name: "50 hrs to 100 hrs",
        value: this.currentyearcount.fiftyplusCount,
      },
      {
        name: "Above 150 hrs",
        value: this.currentyearcount.onefiftyplusCount,
      },
    ];
    console.log("run hours3==", this.runHour3);
  }
  // ***********RUN HOUR STATISTICS End Here****************

  // ***********Customer Segmentation start Here****************
  getCustomerSegmentation() {
    this.accountService.getCustomerSegmentationCount().subscribe((data) => {
      this.customerSegmentationCount = data;
      console.log(this.customerSegmentationCount);
      if (this.customerSegmentationCount) {
        this.customerSegmentation = [
          {
            name: "Individual",
            value: parseInt(this.customerSegmentationCount.Individual),
          },
          {
            name: "Institutional",
            value: parseInt(this.customerSegmentationCount.Institutional),
          },
          {
            name: "Others",
            value: parseInt(this.customerSegmentationCount.Others),
          },
          {
            name: "Contractor",
            value: parseInt(this.customerSegmentationCount.Contractor),
          },
        ];
      } else {
        return;
      }
      this.IndividualCount = parseInt(
        this.customerSegmentationCount.Individual
      );
      this.InstitutionalCount = parseInt(
        this.customerSegmentationCount.Institutional
      );
      this.OthersCount = parseInt(this.customerSegmentationCount.Others);
      this.ContractorCount = parseInt(
        this.customerSegmentationCount.Contractor
      );
    });
  }
  // ***********Customer Segmentation end Here****************

  // ************** New Dashboard code End Here ***********************
  getBannerData() {
    this.inActive = false; // Start loader
    this.bannerData = [];
    this.accountService.getBanner()
      .pipe(first())
      .subscribe((res: any) => {
        if (res?.docs?.length) {
          // Filter only banners for web
          this.bannerData = res.docs.filter((banner: any) => banner.appType === 'web');
          console.log("Banner List:", this.bannerData);
        }else {
          this.toastr.warning("No banner data found.");
        }
        this.inActive = true; // Stop loader in both cases
      },
      error => {
        this.toastr.error(error);
        this.inActive = true;
      });
  }
}
