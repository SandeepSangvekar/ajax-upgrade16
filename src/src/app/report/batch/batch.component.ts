import { Component, OnInit } from "@angular/core";
import { AccountService, AlertService } from "@app/_services";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-batch",
  templateUrl: "./batch.component.html",
  styleUrls: ["./batch.component.less"],
})

export class BatchComponent implements OnInit {
  today: Date;
  fromDate: string;
  toDate: string;
  startDate: string;
  itemsPerPage = 50;
  form: FormGroup;
  loading = false;
  isEdit = false;
  endDate: string;
  date = new Date();
  p: number = 1;
  searchText;
  data: any;
  batchList: any;
  snum: any;
  pinno: any;
  useType: any;
  loginName: any;
  status: any;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.createUserLOgs();
    this.form = this.formBuilder.group({
      startDate: [" ", Validators.required],
      endDate: [" ", Validators.required],
    });

    this.getRecord();
  }

  createUserLOgs() {
    let params = {
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
      module: "REPORT",
      function: "BATCH",
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
    this.useType = JSON.parse(localStorage.getItem("user")).useType;
    this.loginName = JSON.parse(localStorage.getItem("user")).loginName;
    this.loginName = this.loginName.toUpperCase();
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 7);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.startDate = this.fromDate.toString();
    this.endDate = this.toDate.toString();

    this.data = {
      fromDate: this.startDate + "T00:00:00.000Z",
      toDate: this.endDate + "T23:59:59.000Z",
      loginName: this.loginName,
      useType: this.useType,
    };

    this.accountService.getBatchReport(this.data).subscribe((data) => {
      (this.batchList = data);
        (this.batchList = this.batchList);
        // console.log("Batch List ====", this.batchList);
    });
  }

  onSubmit2() {
    if (this.form.invalid) {
      return;
    } else {
      this.useType = JSON.parse(localStorage.getItem("user")).useType;
      this.loginName = JSON.parse(localStorage.getItem("user")).loginName;
      this.loginName = this.loginName.toUpperCase();
      this.data = {
        fromDate: this.form.value.startDate + "T00:00:00.000Z",
        toDate: this.form.value.endDate + "T23:59:59.000Z",
        loginName: this.loginName,
        useType: this.useType,
      };

      // console.log("data for date feild==", this.data);

      this.accountService.getBatchReport(this.data).subscribe((data) => {
        (this.batchList = data);
          (this.batchList = this.batchList);
          // console.log("Batch List after Date filter====", this.batchList);
      });
    }
  }
}
