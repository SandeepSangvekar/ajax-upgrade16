import { ViewChild } from "@angular/core";
import { ElementRef } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "@app/_services";
import { environment } from "@environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-dservice",
  templateUrl: "./dservice.component.html",
  styleUrls: ["./dservice.component.less"],
})
export class DserviceComponent implements OnInit {
  @ViewChild("exampleModal", { static: true }) exampleModalRef: ElementRef;
  @ViewChild("closeButton") closeButton;
  date = new Date();
  form: FormGroup;
  servicedata: any;
  pinNo = environment.labelpinno;
  selected: string = "upcoming";
  itemsPerPage = 50;
  p: number = 1;
  searchText;
  loading : boolean

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getServiceSchedule();
    this.createUserLOgs();
  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "DASHBOARD",
      "function": "SERVICES",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      // console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }
  select(event: any) {
    //update the ui
    this.selected = event.target.value;
    this.getServiceSchedule();
  }
  get f() {
    return this.form.controls;
  }

  getServiceSchedule() {
    this.servicedata = [];
    this.loading = true;
    const data1 = {
      useType: JSON.parse(localStorage.getItem("user")).useType,
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
    };
    if (this.selected == "upcoming") {
      this.accountService.getServiceSchedule(data1).subscribe((data) => {
        this.servicedata = data;
        this.loading = false;
        this.servicedata = this.servicedata.countAnddetails.upcoming;
        // console.log(" Upcoming Data == ", this.servicedata);
      });
    } else if (this.selected == "overdue") {
      this.accountService.getServiceSchedule(data1).subscribe((data) => {
        this.servicedata = data;
        this.loading = false;
        this.servicedata = this.servicedata.countAnddetails.Overdue;
        // console.log(" Overdue Data == ", this.servicedata);
      });
    } else if (this.selected == "due7") {
      this.accountService.getServiceSchedule(data1).subscribe((data) => {
        this.servicedata = data;
        this.loading = false;
        this.servicedata = this.servicedata.countAnddetails["Overdue Past 7 Days"];
        // console.log(" Overdue 7 Days Data == ", this.servicedata);
      });
    } else if (this.selected == "due30") {
      this.accountService.getServiceSchedule(data1).subscribe((data) => {
        this.servicedata = data;
        this.loading = false;
        this.servicedata = this.servicedata.countAnddetails["Overdue Past 30 Days"];
        // console.log(" Overdue 30 Days Data == ", this.servicedata);
      });
    }
  }
}
