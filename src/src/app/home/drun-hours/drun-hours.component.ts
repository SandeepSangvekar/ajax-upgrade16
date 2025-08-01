import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AccountService } from "@app/_services";
import { first } from "rxjs/operators";
import { AuthService } from "@app/_services/auth.service";
import { environment } from "@environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-drun-hours",
  templateUrl: "./drun-hours.component.html",
  styleUrls: ["./drun-hours.component.less"],
})
export class DrunHoursComponent implements OnInit {
  selectCount: string = "fiftyCount";
  selectCount2: string = "fiftyCount";
  selectCount3: string = "fiftyCount";
  fiftyCountData: any;
  fiftyplusCount: any;
  onefiftyplusCount: any;
  countData: any;
  date = new Date();
  currentCountData: any;
  currentYCountData: any;
  p: number = 1;
  searchText;
  selected: string = "lastmonth";
  pinNo = environment.labelpinno;
  itemsPerPage = 50;
  loading: boolean

  constructor(
    private accountService: AccountService,
    private toastr:ToastrService,
    ) {}

  ngOnInit(): void {
    this.getLastRunHour();
    this.getCurrentRunHour();
    this.getCurrentYRunHour();
    this.createUserLOgs();
  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "DASHBOARD",
      "function": "RUN HOUR STATISTICS",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  select(event: any) {
    //update the ui
    this.selected = event.target.value;
  }

  changeLastMonth() {
    this.getLastRunHour();
  }

  changeCurrentMonth() {
    this.getCurrentRunHour();
  }

  changeCurrentYear() {
    this.getCurrentYRunHour();
  }

  getLastRunHour() {
    this.countData = []
    this.loading = true;
    if (this.selectCount == "fiftyCount") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };

      this.accountService
        .getLastMonthCountInner(data1)
        .pipe(first())
        .subscribe((data) => {
          this.fiftyCountData = data;
          this.loading = false;
          this.countData = this.fiftyCountData.fiftydetails;
          if(this.countData.length == 0) {
            this.toastr.error("No Data Found");
          }
          console.log("fiftyCountdata", this.countData);
        });
    } else if (this.selectCount == "fiftyplusCount") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };

      this.accountService
        .getLastMonthCountInner(data1)
        .pipe(first())
        .subscribe((data) => {
          this.fiftyplusCount = data;
          this.loading = false;
          this.countData = this.fiftyplusCount.fiftyplussdetails;
          if(this.countData.length == 0) {
            this.toastr.error("No Data Found");
          }
          console.log("fiftyplusCount", this.countData);
        });
    } else if (this.selectCount == "onefiftyplusCount") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };

      this.accountService
        .getLastMonthCountInner(data1)
        .pipe(first())
        .subscribe((data) => {
          this.onefiftyplusCount = data;
          this.loading = false;
          this.countData = this.onefiftyplusCount.onefiftyplussdetails;
          console.log("onefiftyplusCount", this.countData);
          if(this.countData.length == 0) {
            this.toastr.error("No Data Found");
          }
        });
    }
  }

  getCurrentRunHour() {
    this.currentCountData = [];
    this.loading = true;
    if (this.selectCount2 == "fiftyCount") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };

      this.accountService
        .getCurrentMonthCountInner(data1)
        .pipe(first())
        .subscribe((data) => {
          this.fiftyCountData = data;
          this.loading = false;
          this.currentCountData = this.fiftyCountData.fiftydetails;
          console.log("fiftyCountdata", this.currentCountData);
          if(this.currentCountData.length == 0) {
            this.toastr.error("No Data Found");
          }
        });
    } else if (this.selectCount2 == "fiftyplusCount") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };

      this.accountService
        .getCurrentMonthCountInner(data1)
        .pipe(first())
        .subscribe((data) => {
          this.fiftyplusCount = data;
          this.loading = false;
          this.currentCountData = this.fiftyplusCount.fiftyplussdetails;
          console.log("fiftyplusCount", this.currentCountData);
          if(this.currentCountData.length == 0) {
            this.toastr.error("No Data Found");
          }
        });
    } else if (this.selectCount2 == "onefiftyplusCount") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };

      this.accountService
        .getCurrentMonthCountInner(data1)
        .pipe(first())
        .subscribe((data) => {
          this.onefiftyplusCount = data;
          this.loading = false;
          this.currentCountData = this.onefiftyplusCount.onefiftyplussdetails;
          console.log("onefiftyplusCount", this.currentCountData);
          if(this.currentCountData.length == 0) {
            this.toastr.error("No Data Found");
          }
        });
    }
  }

  getCurrentYRunHour() {
    this.currentYCountData = [];
    this.loading = true;
    if (this.selectCount3 == "fiftyCount") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };

      this.accountService
        .getCurrentYearCountInner(data1)
        .pipe(first())
        .subscribe((data) => {
          this.fiftyCountData = data;
          this.loading = false;
          this.currentYCountData = this.fiftyCountData.fiftydetails;
          console.log("fiftyCountdata", this.currentYCountData);
          if(this.currentYCountData.length == 0) {
            this.toastr.error("No Data Found");
          }
        });
    } else if (this.selectCount3 == "fiftyplusCount") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };

      this.accountService
        .getCurrentYearCountInner(data1)
        .pipe(first())
        .subscribe((data) => {
          this.fiftyplusCount = data;
          this.loading = false;
          this.currentYCountData = this.fiftyplusCount.fiftyplussdetails;
          console.log("fiftyplusCount", this.currentYCountData);
          if(this.currentYCountData.length == 0) {
            this.toastr.error("No Data Found");
          }
        });
    } else if (this.selectCount3 == "onefiftyplusCount") {
      const data1 = {
        useType: JSON.parse(localStorage.getItem("user")).useType,
        loginName: JSON.parse(localStorage.getItem("user")).loginName,
      };

      this.accountService
        .getCurrentYearCountInner(data1)
        .pipe(first())
        .subscribe((data) => {
          this.onefiftyplusCount = data;
          this.loading = false;
          this.currentYCountData = this.onefiftyplusCount.onefiftyplussdetails;
          console.log("onefiftyplusCount", this.currentYCountData);
          if(this.currentYCountData.length == 0) {
            this.toastr.error("No Data Found");
          }
        });
    }
  }
}
