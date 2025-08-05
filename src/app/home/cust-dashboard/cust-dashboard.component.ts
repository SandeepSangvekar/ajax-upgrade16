import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { Machine } from '@app/_models';
import { AccountService, UsermanagemntService } from '@app/_services';
import { DatePipe } from "@angular/common";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router'; 
import * as moment from 'moment';
import * as _ from 'lodash';
// import { stringify } from '@angular/compiler/src/util';

@Component({
  templateUrl: 'cust-dashboard.component.html',
 styleUrls: ['./cust-dashboard.component.less']
})
export class CustDashboardComponent implements OnInit {
  @ViewChild('openModal') openModal: ElementRef;
  showModal = true;
  iotNonIOTValue: any;
  iotDirections: any;
  today: Date = new Date();
  pipe = new DatePipe('en-US');
  todayWithPipe = null;
  users: any;
  machines: any;
  currentmonthcount: any;
  lastmonthcount: any;
  currentyearcount: any;
  vehicleparkCount: any;
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
  eastzone: { name: string; value: number; }[];
  westzone: { name: string; value: number; }[];
  norhtzone: { name: string; value: number; }[];
  southzone: any;
  centralzone: { name: string; value: number; }[];
  totalvpark: number;
  coordinatedata: any;
  maplat: any;
  maplng: any;
  allModelDocs: any;
  date = new Date();
  iotNonIotValueNew: any;
  count: object
  Active: any
  InActive: any
  monit: string
  viewType: any = 'hybrid';
  active = [];
  inactive = [];
  monitoring = [];

  IndividualCount:number;
  InstitutionalCount:number;
  OthersCount:number;
  ContractorCount:number;

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
  Vmon: { name: string; value: any; }[];
  credentials: { loginName: any; agreementSignedOn: string; };
  performer: any;
  performercount: any;
  IOTValue: any;
  NonIOTValue: any;
  selectMonth:string='currentMonth';
  selectedMonth:string;
  // vehiclePark:any;
  vehiclePark2: { name: string, value: number }[];
  vehiclePark:
    {
      name: string,
      series: [
        {
          name: string,
          value: number
        },
        {
          name: string,
          value: number
        }
      ]
    }[];
  monthwise: Object;
  monthwisedata: any;
  modelList: any;
  modelListData: any[] = [];
  vehicleMonitoring: any;
  breakdownStat: any;
  serviceSchedule: any;
  scheduleService:{name:string,value:number}[];
  serviceScheduledStatus:any;
  top5Performers:  {
    name: string,
    series: [
      {
        name: string,
        value: number
      },
      {
        name: string,
        value: number
      }
    ]
  }[];
  runHour:{name:string,value:number}[];
  runHour2:{name:string,value:number}[];
  runHour3:{name:string,value:number}[];

  upcomingServiceCount:number;
  overdueServiceCount:number;
  overdueServiceCountPre:any;
  upcomingServiceCountPre:any;
  pastSevenDaysCount:number;
  pastSevenDaysCountPre:any;
  pastThirtyDaysCountPre:any;
  pastThirtyDaysCount:number;
  showvehiclePark = true;
  showvehiclePark2 = true;
  IOTCount: number;
  NonIOTCount: number;
  TotalCount: number;
  customArray: any[];
  directionArray:any[]=[{name:'east',value:'EAST'},
  {name:'west',value:'WEST'},
  {name:'north',value:'NORTH'},
  {name:'south',value:'SOUTH'},
  {name:'central',value:'CENTRAL'}];
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
  secConvert :any;
  EngineHours2:number;

  constructor(private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private usermanagementService: UsermanagemntService
    ) {
    this.users = this.accountService.userValue;
    console.log('print this')
  }


  ngOnInit() {
    this.getAll();
  }

  // ************* Chart Controls Start Here *******************
  colorScheme = { 
    domain: ['#454397', '#e83e8c']
  };
  
  colorSchemeVM = {
    domain: ['#28a745', '#dc3545']
  };
  
  colorSchemeBS = {
    domain: ['#007bff', '#ffc107', '#dc3545', '#28a745']
  };
  
  colorSchemeSS = {
    domain: ['#007bff', '#ffc107', '#dc3545', '#28a745']
  };
  
  colorSchemeSS2 = {
    domain: ['#007bff', '#28a745']
  };

  colorSchemeTP = {
    domain: ['#ffc107', '#343a40']
  };

  colorSchemeRHS = {
    domain: ['#007bff', '#dc3545', '#28a745']
  };

  colorSchemeCS = {
    domain: ['#28a745', '#007bff', '#ffc107', '#dc3545']
  };

  view: any[] = [420, 200];
  viewVM: any[] = [250, 250];
  viewBS: any[] = [250, 200];
  viewSS: any[] = [250, 300];
  viewSS2: any[] = [340, 150];
  viewTP: any[] = [250, 220];
  viewRHS: any[] = [140, 140];
  viewCS: any[] = [200, 200];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  yAxisLabelVM = 'No. of Vehicles';
  timeline = true;
  lastMonthPerformerData:any;
  currentMonthPerformerData:any;
  EngineHours:number;
  Distance:number;
  breakdownStatisticsdata:any;
  dealerData: any;
  dealerLtValue: any;
  inActive = false;
  isChecked;

  // ***************** Chart Controls End Here *****************
  ngAfterViewInit(): void {
  }


  checkAgreement() {
  console.log('user',JSON.parse(localStorage.getItem('user')))
    this.checkSignedon = JSON.parse(localStorage.getItem('user')).agreementSignedOn;

    if (this.checkSignedon == null) {
      let type = JSON.parse(localStorage.getItem('user')).role;
      console.log('RoleType',type);
      let popupLoaded = JSON.parse(localStorage.getItem('popupLoaded'));
      if (type === 'customer') {
        this.showModal = false;
        this.openModal.nativeElement.click();
        //this.agree();
      }
      localStorage.setItem('popupLoaded', '1');
      console.log("popup value ", JSON.parse(localStorage.getItem('popupLoaded')))
    }
  }
  agree() {
   
    this.credentials = {
      loginName: JSON.parse(localStorage.getItem('user')).loginName,
      agreementSignedOn: this.checkSignedon
    }
    this.accountService.login(this.credentials)
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
          this.router.navigateByUrl(returnUrl);
          console.log("abcd");
          this.showModal = true;
        }
      });


  }
  logout() {
    this.accountService.logout();
  }

  // Remove Vehicle Park and Customer Segmentation Methods
  getAll() {
   this.checkAgreement();
    this.getVehicleMonitoring();
    this.getBreakdownStat();
    this.getServiceScheduleData();
   this.getScheduleServiceStatus();
    this.getTop5Performers();
    //this.getRunHour();
    this.getCurrentMonth();
    this.getLastMonth();
    this.getAllModel();
    this.getCurrentYear();
  }

  // ************** New Dashboard code start Here *********************

  // ***********Remove VEHICLE PARK Code****************

  // ***********VEHICLE MONITORING Start Here****************
  getVehicleMonitoring() {
    // debugger
      const data1 = {
       useType: JSON.parse(localStorage.getItem('user')).useType,
       loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
     this.accountService.getMonitorData(data1).subscribe((data) => {
       this.monitordata = data
       console.log("Vehicle Monitoring Data ====   ", this.monitordata);
       this.active = this.monitordata.countAnddetails.Active
       this.inactive = this.monitordata.countAnddetails.InActive
       this.vehicleMonitoring = [
         { name: "Active", value: this.active },
         { name: "Inactive", value: this.inactive },
       ]
     })
   
  }
  navMonitor() {
    this.router.navigateByUrl(`/dashboard/vehicle-monitoring`);
  }

  getAllModel() {
    // /dashboard/vehiclemon
    
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName:JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getAllvehiclemonModel(data1).subscribe((data) => {
      this.allModelDocs = data
      this.allModel = this.allModelDocs.dataconcat;
      console.log("all Models   ", this.allModel);
      this.totalLength = this.allModel.length

      this.dealerMapData();
      this.viewPolygon();

      this.activeDevices = this.allModel.filter(it => it.status == "Active");
      this.devices = this.activeDevices.length;
     console.log('devices',this.devices);
    })
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
    console.log('show length ', this.allModel.length);

    var latlangValue = [];
    for (var i = 0; i < this.allModel.length; i++) {
      latlangValue.push({
        lat: parseFloat(this.allModel[i].lat),
        lng: parseFloat(this.allModel[i].lng),
        date: this.allModel[i].lastDataReceivedAt,
        time: moment(this.allModel[i].lastDataReceivedAt),
      //  date: moment(this.allModel[i].lastDataReceivedAt).format('DD-MM-YYYY'),
      //  time: moment(this.allModel[i].lastDataReceivedAt).format('HH:mm:ss'),
        pinno: this.allModel[i].pinno
      })
    }
    this.maplat = latlangValue[0].lat;
    this.maplng = latlangValue[0].lng;
    this.coordinatedata = latlangValue
console.log("coordinates",this.coordinatedata);

    const myLatLng = { lat: this.maplat, lng: this.maplng };

    // const map = new google.maps.Map(
    //   document.getElementById("map") as HTMLElement,
    //   {
    //     zoom: 8,
    //     center: myLatLng,
    //   }
    // );


  }

  // ***********VEHICLE MONITORING End Here****************

  // ***********BREAKDOWN STATISTICS Start Here****************
  getBreakdownStat() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName:JSON.parse(localStorage.getItem('user')).loginName.toUpperCase( )
    }
    this.accountService.getBreakdownStatisticsCount(data1).subscribe((data) => {
      this.breakdownStatisticsdata = data;
      this.breakdownStatisticsdata = this.breakdownStatisticsdata.count;
      console.log("Break Down Statistics Data == ", this.breakdownStatisticsdata);
      if(this.breakdownStatisticsdata)
      {
        this.breakDownDataKeys=Object.keys(this.breakdownStatisticsdata);
        this.breakDownDataValues=Object.values(this.breakdownStatisticsdata);

         this.breakDownProgressBar1=(this.breakDownDataValues[0])+'%';
         this.breakDownProgressBar2=(this.breakDownDataValues[1])+'%';
         this.breakDownProgressBar3=(this.breakDownDataValues[2])+'%';
         this.breakDownProgressBar4=(this.breakDownDataValues[3])+'%';
        this.breakDownProgressBar5=(this.breakDownDataValues[4])+'%';
      }
  else{
    return;
  }
    })
   
    this.breakdownStat = 
    [
      {
        "name": "EH",
        "value": 10
      },
      {
        "name": "CB",
        "value": 5
      },
      {
        "name": "RAS",
        "value": 3
      },
      {
        "name": "EA",
        "value": 2
      },
    ]
  }
  // ***********BREAKDOWN STATISTICS End Here****************

  // ***********SERVICE SCHEDULE Start Here****************
  getServiceScheduleData() {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getServiceSchedule(data1).subscribe((data) => {
        this.servicedata = data;
        console.log(" Service Schedule Data == ", this.servicedata);
        if(this.servicedata)
        {
          this.upcomingServiceCount=this.servicedata.countAnddetails.upcomingcount;
          this.upcomingServiceCountPre=(this.upcomingServiceCount)+'%';
          this.overdueServiceCount=this.servicedata.countAnddetails.Overduecount;
          this.overdueServiceCountPre=(this.overdueServiceCount)+'%';
          this.pastSevenDaysCount=this.servicedata.countAnddetails['Overdue Past 7 Days count'];
          this.pastSevenDaysCountPre=(this.pastSevenDaysCount)+'%';
          this.pastThirtyDaysCount=this.servicedata.countAnddetails['Overdue Past 30 Days count'];
          this.pastThirtyDaysCountPre=(this.pastThirtyDaysCount)+'%';

        }
    else{
      return;
    }
      })
     
  }

  getScheduleServiceStatus() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName:JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getServiceSchedulesStatus(data1).subscribe((data) => {
      this.serviceScheduledStatus = data;
      console.log(" Service Schedule Status Data == ", this.serviceScheduledStatus);
      this.scheduleService = 
      [
        {
          "name": "Scheduled",
          "value":this.serviceScheduledStatus.countAnddetails.open
        },
        {
          "name": "Complete",
          "value": this.serviceScheduledStatus.countAnddetails.closed
        }
      ]
    })

  
  }

  navService() {
    this.router.navigateByUrl(`/dashboard/service`);
  }

  // ***********SERVICE SCHEDULE End Here****************

  // ***********TOP 5 PERFORMERS Start Here****************
  
   
  changeMonth(){
    
    this.getTop5Performers();
  }
  getTop5Performers() {
    
    if(this.selectMonth=='lastMonth')
    {
      debugger
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getLastmonthtopfiveperformer(data1).subscribe((data) => {
      this.lastMonthPerformerData = data;
      this.top5Performers = this.getCustomArrayForTopPerformers(this.lastMonthPerformerData);
      console.log("lasttopperformerdata", this.lastMonthPerformerData);
    })
 

  }
    else if(this.selectMonth=='currentMonth')
    {
      debugger
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getCurrentmonthtopfiveperformer(data1).subscribe((data) => {
      this.currentMonthPerformerData = data;
      this.top5Performers = this.getCustomArrayForTopPerformers(this.currentMonthPerformerData);
      console.log("Distance",this.Distance);
      console.log("topperformerdata", this.top5Performers);
    })
   
    }
   
  }

  getCustomArrayForTopPerformers(argumentData) {
    if(argumentData.length > 0) {
      this.customArray = [];
      this.Distance=0;
      this.EngineHours=0;
      argumentData.forEach((element, index) => {
       this.Distance=this.Distance + parseInt(element.totalDistance);
       this.EngineHours=this.EngineHours + parseInt(element.totalSecond);
       this.secConvert = (this.EngineHours)*(1/3600);
       this.EngineHours2 = parseInt(this.secConvert);
        this.customArray.push({
          name:element.pinno.slice(-7,-1)+element.pinno.slice(-1),
          series: [{name: "Total Hrs", value: (element.totalSecond)*(1/3600)},{name: "Total Distance",value: element.totalDistance}]
        }) 
      });
      return this.customArray;
    
    }
  }
  // ***********TOP 5 PERFORMERS End Here****************
  
  // ***********RUN HOUR STATISTICS Start Here****************
  getCurrentMonth() {
 
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName:JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getCurrentMonthCount(data1).subscribe((data) => {
      this.currentmonthcount = Object.values(data)
      console.log('current month data=== ',this.currentmonthcount);
      if(this.currentmonthcount)
      {
         this.getRunHour();
      }
      else
      {
        return;
      }
    })
  }
  getLastMonth() {
 
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName:JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getLastMonthCount(data1).subscribe((data) => {
      this.lastmonthcount = Object.values(data)
      console.log(this.lastmonthcount);
      if(this.lastmonthcount)
      {
         this.getRunHour();
      }
      else{
        return;
      }
    })
  }
  getCurrentYear() {
    
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName:JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getCurrentYearCount(data1).subscribe((data) => {
      this.currentyearcount = Object.values(data)
      console.log(this.currentyearcount);
      if(this.currentyearcount)
      {
         this.getRunHour();
      }
      else{
        return;
      }
    })
  }

  getRunHour() {
   
   this.runHour = 
    [
      { 
        'name' : "0 hrs to 50 hrs", 'value' : this.currentmonthcount[0]
      },
      {
        'name' : "50 hrs to 100 hrs", 'value' : this.currentmonthcount[1]
      },
      {
        'name' : "Above 150 hrs", 'value' : this.currentmonthcount[2]
      },
    ]

    this.runHour2 = 
    [
      { 
        'name' : "0 hrs to 50 hrs", 'value' : this.lastmonthcount[0]
      },
      {
        'name' : "50 hrs to 100 hrs", 'value' : this.lastmonthcount[1]
      },
      {
        'name' : "Above 150 hrs", 'value' : this.lastmonthcount[2]
      },
    ]

    this.runHour3 = 
    [
      { 
        'name' : "0 hrs to 50 hrs", 'value' : this.currentyearcount[0]
      },
      {
        'name' : "50 hrs to 100 hrs", 'value' : this.currentyearcount[1]
      },
      {
        'name' : "Above 150 hrs", 'value' : this.currentyearcount[2]
      }
    ]
    console.log('run hour====',this.runHour);
  }
  // ***********RUN HOUR STATISTICS End Here****************
 
   // ***********Remove Customer Segmentation****************

  // ************** New Dashboard code End Here ***********************

}
