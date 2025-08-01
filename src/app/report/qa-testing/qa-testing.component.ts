import {Component, ElementRef, OnInit, TemplateRef, ViewChild, } from "@angular/core";
import { first } from "rxjs/operators";
import {AccountService, AlertService, UsermanagemntService } from "@app/_services";
import { FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ExcelService, ExcelServiceXlsx } from "../../_services/excel.service";
import { ToastrService } from "ngx-toastr";
import * as moment from 'moment';

@Component({
  selector: "app-qa-testing",
  templateUrl: "./qa-testing.component.html",
  styleUrls: ["./qa-testing.component.less"],
})
export class QATestingComponent implements OnInit {
  device: number = 1;
  p: number = 1;
  searchText;
  date = new Date();
  form: FormGroup;
  submitted = false;
  loading = false;
  dataQA: any;
  itemsPerPage = 50;
  dataQATest: any;
  today: Date;
  fromDate: string;
  toDate: string;
  startDate: string;
  endDate: string;
  timeBetween: any;
  dataQADocs: any;
  dataQaTestDocs: any;
  devicenumberOnClicked: any;
  varantCode: any;
  aqTestForDataId: any;
  dataQATestRowData: any;
  dataQaTesRowDatatDocs: any;
  trFormatedData = true;
  trRowData = false;
  machinedata = false;
  batchdata = false;
  formateAndRowDatashow = false;
  rowDataArray: any;
  msg: string;
  msg1: string;
  type: any;
  shoxlsxbtn = false;
  batchDatas: any;
  batchDatadocs: any;
  actualRowData: any;
  actualRowData1: any;
  dataRow: any;
  selectedRow: Number;
  setClickedRow: Function;
  hideModal: boolean = true;
  machineExcelData = [];
  itemsperpage = 50;
  itemsperpage1 = 50;
  itemsperpage2 = 50;
  itemsperpage3 = 50;
  trRowUnmappedData = false;

  dataQADocs1: any;
  QAUnmappedData: any;
  selected2: string = "Mapped Devices";
  actualUnmappedRawData: any;
  actualUnmappedRawData1: any;
  dataQATestUnmappedRawData: any;
  dataQaTestUnmappedDocs: any;
  trRowUnmappedData1 = false;
  reportDeviceId: any;
  formFilter: FormGroup;
  dateTime: any;
  formUnMap: FormGroup;
  unMapDeviceId: any;

  constructor(
    private accountServices: AccountService,
    private excelxlsxService: ExcelServiceXlsx,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {
    this.setClickedRow = function (index) {
      this.selectedRow = index;
    };
  }

  ngOnInit() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);
    this.fromDate =this.datePipe.transform(this.today, "yyyy-MM-dd");
    this.toDate =this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.startDate = this.fromDate.toString(),
    this.endDate = this.toDate.toString();

    this.getQAData();
    this.getQAUnmappedData();

    this.form = this.formBuilder.group({
      type: "",
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });

    this.formFilter = this.formBuilder.group({
      type: "",
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
    this.formUnMap = this.formBuilder.group({
      endDate: ["", Validators.required],
    });

    this.createUserLogs();
  }

  createUserLogs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "REPORT",
      "function": "QA TESTING",
      "type": "web"
    }
    this.accountServices.createUserlogs(params).subscribe((data) => {
      // console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }
  get f() {
    return this.form.controls;
  }
  select2(event: any) {
    this.selected2 = event.target.value;
    if (this.selected2 == "Mapped Devices") {
      this.getQAData();
    } else if (this.selected2 == "Unmapped Devices") {
      this.getQAUnmappedData();
    }
  }
  getQAData() {
    this.dataQADocs = " ";
    this.loading = true;
    this.timeBetween = {
      gte: this.startDate + "T00:00:00.000Z",
      lt: this.endDate + "T23:59:59.000Z",
    };
    this.accountServices
      .getReportQATestMappedData(this.timeBetween)
      .subscribe((data) => {
        this.dataQA = data;
        if (this.dataQA.status == "Device has empty data") {
          this.toastr.error(this.dataQA.status);

          
          this.loading = false;
        } else {
          this.dataQADocs = this.dataQA.array;
          // console.log("Data QA Docs ", this.dataQADocs);
        }
      });
  }

  getQAUnmappedData() {
    this.QAUnmappedData = " ";
    this.loading = true;
    // this.accountServices.getReportQATestUnmappedData()
    //   .pipe(first())
    //   .subscribe((result) => {
    //     this.QAUnmappedData = result;
    //   });
    this.accountServices.getAllDevice()
      .pipe(first())
      .subscribe((result) => {
        this.loading = false;
        this.QAUnmappedData = result;
      });
  }

  onSubmitFilter() {
    this.dataQADocs = " ";
    this.QAUnmappedData = " ";
    this.loading = true;
    this.timeBetween = {
      gte: this.formFilter.value.startDate + "T00:00:00.000Z",
      lt: this.formFilter.value.endDate + "T23:59:59.000Z",
    };
    if (this.selected2 == "Mapped Devices") {
      this.accountServices
      .getReportQATestMappedData(this.timeBetween)
      .subscribe((data) => {
        this.dataQA = data;
        if (this.dataQA.status == "Device has empty data") {
          this.toastr.error(this.dataQA.status);
          
          this.loading = false;
        } else {
          this.dataQADocs = this.dataQA.array;
          // console.log("Data QA Docs ", this.dataQADocs);
        }
      });  
    } else if (this.selected2 == "Unmapped Devices") {
      this.getQAUnmappedData();
    }
  }

  getReportQAUnmappedRawData(deviceID) {
    this.trRowUnmappedData = true;
    this.msg1 = "Raw Data - Device No : " + deviceID;
    this.loading = true;
    this.dataQATestUnmappedRawData = [];
    this.dataQaTestUnmappedDocs = [];
    this.unMapDeviceId = deviceID;

    let params = {
      deviceID: this.unMapDeviceId,
      runningDate: this.formUnMap.value.endDate
    };
    this.accountServices.getReportQATestUnmappedRawData(params)
      .subscribe((data) => {
        this.loading = false;
        this.dataQATestUnmappedRawData = data;
        if (this.dataQATestUnmappedRawData.status == "Device has empty data") {
          this.toastr.error(this.dataQATestUnmappedRawData.status);
          
          this.dataQATestUnmappedRawData = [];
        }
        if (this.dataQATestUnmappedRawData) {
          this.dataQaTestUnmappedDocs = this.dataQATestUnmappedRawData;
          var dataArray = this.dataQaTestUnmappedDocs.Rawdata[9] + this.dataQaTestUnmappedDocs.Rawdata[10];
          var dateString = dataArray.substring(0, 14);
          this.dateTime = moment(dateString + "UTC", "DDMMYYYYHHmmssZ");
          this.dateTime = new Date(this.dateTime);
          this.dateTime.setHours(this.dateTime.getHours() + 5);
          this.dateTime.setMinutes(this.dateTime.getMinutes() + 30);
          this.dateTime = this.dateTime.toISOString();
        }
      });
  }

  getReportQATestForMachineData(deviceID, deviceModel, type) {
    this.hideModal = false;
    this.trFormatedData = true;
    this.trRowData = false;
    this.reportDeviceId = deviceID;
    this.formateAndRowDatashow = true;
    this.shoxlsxbtn = true;
    this.type = type;
    this.dataQaTestDocs = [];
    this.varantCode = deviceModel;
    this.aqTestForDataId = "5fe2e88d7cc3536c2c7bf2d9";
    this.devicenumberOnClicked = deviceID;
    this.msg = "Machine Data - Device No : " + deviceID + " - Model : " + deviceModel;
    this.machinedata = true;
    this.batchdata = false;
    this.loading = true;
    this.timeBetween = {
      gte: this.formFilter.value.startDate + "T00:00:00.000Z",
      lt: this.formFilter.value.endDate + "T23:59:59.000Z",
      deviceID: deviceID,
    };
    this.accountServices
      .getQATestMachineData(this.timeBetween)
      .subscribe((data) => {
        this.loading = false;
        this.dataQATest = data;
        if (data) {
          if (this.dataQATest.status == "Device has empty data") {
            this.toastr.error(this.dataQATest.status);
            
            this.batchdata = false;
            this.hideModal = true;
          } else {
            this.dataQaTestDocs = this.dataQATest.docs;
            this.dataQaTestDocs.forEach((element) => {
              if (element.extras) {
                element.extras.forEach((element1) => {
                  this.machineExcelData.push({
                    "Date & Time": element.devicePublishTime,
                    Latitude: element.lat,
                    Longitude: element.lng,
                    "Power Source": element1.powerSource,
                    "Battery Level(Volts)": element1.batteryLevel,
                    "Fuel Level": element1.fuelLevel,
                    "Coolant Temp": element1.coolantTemp,
                    "Oil Pressure(bar)": element1.oilpressure,
                    "Ignition Status(Volts)": element1.ignitionStatus,
                    RPM: element1.rpm,
                    "Parking Switch": element1.parkingSwitch,
                    "Hydraulic Oil Filter": element1.hydralicOilFilterChoke,
                  });
                });
              }
            });

            this.hideModal = false;
          }
        }
      });
  }

  clearData() {
    this.hideModal = true;
  }
  getReportQATestForRowData() {
    this.loading = true;
    this.shoxlsxbtn = false;
    //  if (this.machinedata == true) {
    this.actualRowData = [];
    this.actualRowData1 = [];
    this.dataQaTestDocs = [];
    this.accountServices
      .getQATestMachineData(this.timeBetween)
      .subscribe((data) => {
        this.loading = false;
        this.dataQATestRowData = data;
        if (this.dataQATestRowData.status == "Device has empty data") {
          this.toastr.error(this.dataQATest.status);
          
          this.loading = false;
          this.dataQaTestDocs = [];
        } else {
          this.dataQaTestDocs = this.dataQATestRowData.docs;
          this.actualRowData = [];
          this.actualRowData1 = [];
          var rowDataArray = [];
          for (var i = 0; i < this.dataQaTestDocs.length; i++) {
            rowDataArray.push({
              rowData: this.dataQaTestDocs[i].rawData
                .replace("[", "")
                .replace("]", "")
                .split(","),
            });
          }
          rowDataArray.forEach((element) => {
            if (element.rowData.length == 47) {
              this.actualRowData1 = rowDataArray;
              this.actualRowData = [];
            } else {
              this.actualRowData = rowDataArray;
              this.actualRowData1 = [];
            }
          });
          // console.log("rowData", this.actualRowData1);
        }
      });
    // }
  }

  getReportQATestForBatchData(deviceID, deviceModel, type) {
    this.formateAndRowDatashow = false;
    this.batchDatadocs = [];
    this.machinedata = false;
    this.batchdata = true;
    this.type = type;
    this.shoxlsxbtn = false;
    this.varantCode = deviceModel;
    this.aqTestForDataId = "5fe2e88d7cc3536c2c7bf2d9";
    this.devicenumberOnClicked = deviceID;
    this.loading = true;
    this.msg = "Batch Data - Device No : " + deviceID + " - Model : " + deviceModel;
    this.timeBetween = {
      gte: this.formFilter.value.startDate + "T00:00:00.000Z",
      lt: this.formFilter.value.endDate + "T23:59:59.000Z",
      deviceID: this.devicenumberOnClicked,
    };
    this.accountServices.getQATestBatchData(this.timeBetween)
      .subscribe((data) => {
        this.loading = false;
        this.batchDatas = data;
        if (this.batchDatas.status == "Device has empty data") {
          this.loading = false;
          this.batchdata = false;
          this.hideModal = true;
          this.batchDatadocs = [];
          this.toastr.error(this.batchDatas.status);
          
        } else {
          this.batchdata = true;
          this.batchDatadocs = this.batchDatas.docs;
          this.loading = false;
          this.hideModal = false;
        }
      });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    } else if (this.form.value.type == "report") {
      this.batchdata = false;
      this.machinedata = true;
      this.trRowData = false;
      this.trFormatedData = true;
      this.shoxlsxbtn = true;
      this.dataQaTestDocs = [];
      this.timeBetween = {
        gte: this.form.value.startDate + "T00:00:00.000Z",
        lt: this.form.value.endDate + "T23:59:59.000Z",
        deviceID: this.reportDeviceId,
      };
      // console.log(this.timeBetween);
      this.loading = true;
      this.accountServices
        .getQATestMachineData(this.timeBetween)
        .subscribe((data) => {
          this.loading = false;
          this.formateAndRowDatashow = true;
          this.dataQATest = data;
          if (this.dataQATest.status == "Device has empty data") {
            this.toastr.error(this.dataQATest.status);
            
            this.loading = false;
            this.batchdata = false;
          } else {
            this.dataQaTestDocs = this.dataQATest.docs;
            this.dataQaTestDocs.forEach((element) => {
              if (element.extras) {
                element.extras.forEach((element1) => {
                  this.machineExcelData.push({
                    "Date & Time": element.devicePublishTime,
                    Latitude: element.lat,
                    Longitude: element.lng,
                    "Power Source": element1.powerSource,
                    "Battery Level(Volts)": element1.batteryLevel,
                    "Fuel Level": element1.fuelLevel,
                    "Coolant Temp": element1.coolantTemp,
                    "Oil Pressure(bar)": element1.oilpressure,
                    "Ignition Status(Volts)": element1.ignitionStatus,
                    RPM: element1.rpm,
                    "Parking Switch": element1.parkingSwitch,
                    "Hydraulic Oil Filter": element1.hydralicOilFilterChoke,
                  });
                });
              }
            });
            // console.log(this.dataQaTestDocs);
            this.loading = false;
            this.machinedata = true;
            // if (this.trRowData == true) {
            //   this.actualRowData = [];
            //   this.actualRowData1 = [];
            //   this.getReportQATestForRowData();
            // }
          }

          this.getReportQATestForRowData();
        });
    } else if (this.form.value.type == "batch") {
      this.formateAndRowDatashow = false;
      this.loading = true;
      this.batchDatadocs = [];
      this.batchdata = true;
      this.machinedata = false;
      this.shoxlsxbtn = false;
      // this.trRowData=false;
      this.timeBetween = {
        gte: this.form.value.startDate + "T00:00:00.000Z",
        lt: this.form.value.endDate + "T23:59:59.000Z",
        deviceID: this.devicenumberOnClicked,
      };
      // console.log(this.timeBetween);

      this.accountServices
        .getQATestBatchData(this.timeBetween)
        .subscribe((data) => {
          this.loading = false;
          this.batchDatas = data;
          if (this.batchDatas.status == "Device has empty data") {
            this.batchDatadocs = [];
            this.hideModal = true;
            this.toastr.error(this.batchDatas.status);
            
            this.loading = false;
            this.machinedata = false;
          } else {
            this.batchDatadocs = this.batchDatas.docs;
            // console.log("Batch ", this.batchDatas);
            this.loading = false;
            this.batchdata = true;
          }

          this.getReportQATestForRowData();
        });
    }
    this.getQAData();
  }

  formatedData() {
    this.shoxlsxbtn = true;
    this.trFormatedData = true;
    //this.trFormatedData1 = true;
    this.trRowData = false;
    this.formateAndRowDatashow = true;
  }
  rowData() {
    this.trFormatedData = false;
    this.trRowData = true;
    this.shoxlsxbtn = false;
    this.actualRowData = [];
    this.actualRowData1 = [];
    this.getReportQATestForRowData();
  }

  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.dataQADocs, "QA_Testing");
  }
  exportAsXLSXMachine(): void {
    this.excelxlsxService.exportAsExcelFile(
      this.machineExcelData,
      "QA_Machine"
    );
  }
}
