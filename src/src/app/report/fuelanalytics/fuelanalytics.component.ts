import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from '@environments/environment'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fuelanalytics',
  templateUrl: './fuelanalytics.component.html',
  styleUrls: ['./fuelanalytics.component.less']
})
export class FuelanalyticsComponent implements OnInit {
  today: Date;
  fromDate: any;
  toDate: any;
  startDate: string;
  pinno2 = environment.labelpinno;
  itemsPerPage=50;
  form: FormGroup;
  loading = false;
  isEdit = false;
  endDate: string;
  date = new Date();
  p: number = 1;
  searchText;
  data: any;
  fuelList: any;
  snum: any;
  pinno: any;
  // useType: any;
  // loginName: any;
  parsobj: any;
  parseObjDocs: any;
  coordinatedata: any;
  mapObject: any;
  address: any;
  length: any;
  lastLocationlat: any;
  lastLocationlng: any;
  locationInfo: any;
  status: any;
  pinData: any;
  dataList: any;
  graphData: any;
  graphDataShow = [];
  submit2: boolean;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.createUserLOgs();
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.getRecord();
  }

  colorScheme = {
    domain: ['#999596', '#71aded']
  };

  view: any[] = [950, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Fuel filled on';
  showYAxisLabel = true;
  yAxisLabel = 'Fuel in litres';

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "REPORT",
      "function": "FUEL",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      this.status = data['status'];
      // console.log("status", this.status);
    },
      error => {
        this.toastr.error(error);
      })
  }
  getRecord() {
    this.submit2 = false
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 30);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') ;
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') ;
    this.startDate = this.fromDate.toString();
    this.endDate = this.toDate.toString();

    this.data = {
      fromDate: this.startDate + "T00:00:00.000Z",
      toDate: this.endDate + "T23:59:59.000Z",
    }

    this.accountService.getfuelAnalytics(this.data)
      .subscribe((data) => {
        this.fuelList = data;
        this.fuelList = this.fuelList;
        console.log("Fuel List ====", this.fuelList)
      })
  }

  onSubmit2() {
    this.submit2 = true
    if (this.form.invalid) {
      return;
    }
    else {
      this.data = {
        fromDate: this.form.value.startDate,
        toDate: this.form.value.endDate,
      }
      // console.log('data for date feild==', this.data);

      this.accountService.getfuelAnalytics(this.data)
        .subscribe((data) => {
          this.fuelList = data;
            this.fuelList = this.fuelList;
            // console.log("fuel List after Date filter====", this.fuelList);
        })
    }
  }

  vehicleLastLocation(pinno, var2) {
    if (var2 == true) {
      this.fuelList.forEach(element => {
        if (element.pinno == pinno) {
          this.lastLocationlat = element.lat,
            this.lastLocationlng = element.lng
        }
      });
      this.getOpenStreetmapData();
    }
  }

  getOpenStreetmapData() {
    // this.mapData
    this.locationInfo = [];
    const lat = this.lastLocationlat;
    const lon = this.lastLocationlng;
    const appURL = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + lat + "&lon=" + lon;
    //const appURL = "https://nominatim.openstreetmap.org/reverse?format=geojson&lat="+lat+"&lon="+lon;
    this.accountService.getLocationInfo(appURL).subscribe((res) => {
      this.locationInfo = res;
      this.address = this.locationInfo.display_name;
    });
  }

  getGraphData(pinno) {
    this.graphDataShow = [];
    this.pinData = pinno
    if (this.submit2 == true) {
      this.data = {
        fromDate: this.form.value.startDate + "T00:00:00.000Z",
        toDate: this.form.value.endDate + "T23:59:59.000Z",
        pinno: this.pinData
      }
    } else {
      this.data = {
        fromDate: this.startDate + "T00:00:00.000Z",
        toDate: this.endDate + "T23:59:59.000Z",
        pinno: this.pinData
      }
    }
    // console.log("data==", this.data)
    this.accountService.getlatestFuelAnalyticsRecords(this.data)
      .subscribe((res) => {
        this.graphData = res;
        if(this.graphData.length > 0)
        {
          this.graphData.forEach(element2 => {
            this.graphDataShow.push(
                  {
                    name: element2.devicePublishTime,
                    value: element2.fueladded
                  },
              )
            }
          );
        }
      });
    // console.log("graphData==", this.graphData)
  }
}
