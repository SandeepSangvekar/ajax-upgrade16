import { Component, OnInit } from "@angular/core";
import { AccountService, AlertService } from "@app/_services";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { first } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-service-report",
  templateUrl: "./service-report.component.html",
  styleUrls: ["./service-report.component.less"],
})
export class ServiceReportComponent implements OnInit {
  today: Date;
  fromDate: string;
  toDate: string;
  startDate: string;
  itemsPerPage = 50;
  form: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;
  endDate: string;
  date = new Date();
  p: number = 1;
  form1: FormGroup;
  searchText;
  useType;
  loginName;
  data: any;
  serviceList: any;
  snum: any;
  pinno: any;
  batchFilter: any;
  category: any;
  categoryDocs: any;
  subcategory: any;
  subcategoryDocs: any;
  releases: any = [];
  release: any = [];
  Concat = [];
  showFromData = false;
  records: any;
  deviceModel: any;
  variant: any;
  service: any;
  serviceNumber: any;
  serviceData: any;
  closeButton: any;
  isEditMode: boolean;
  serviceById: any;
  serviceByValue: any;
  returnData: any;
  serviceDataCategory: any;
  status: any;
  strRemarks: any;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.createUserLOgs();
    this.form = this.formBuilder.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });

    this.form1 = this.formBuilder.group({
      category: [""],
      subcategory: [""],
      deviceModel: ["", Validators.required],
      pinno: ["", Validators.required],
      cost: ["", Validators.required],
      totalEngineHours: ["", Validators.required],
      serviceNumber: ["", Validators.required],
      remarks1: ["", Validators.required],
      status: ["", Validators.required],
    });

    this.getRecord();
    this.getCategory();
  }

  createUserLOgs() {
    let params = {
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
      module: "REPORT",
      function: "SERVICE",
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
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 30);
    this.fromDate = this.datePipe.transform(this.today, "yyyy-MM-dd");
    this.toDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.startDate = this.fromDate.toString();
    this.endDate = this.toDate.toString();

    this.data = {
      fromDate: this.startDate + "T00:00:00.000Z",
      toDate: this.endDate + "T23:59:59.000Z",
    };

    this.accountService.getServiceReport(this.data).subscribe((data) => {
      (this.serviceList = data);
        (this.serviceList = this.serviceList);
        // console.log("service List ====", this.serviceList);
    });
  }

  getCategory() {
    // this.snum = snum
    // this.pinno = pinno
    this.accountService
      .getCategory()
      .pipe(first())
      .subscribe((category) => {
        (this.category = category);
          (this.categoryDocs = this.category);
          (this.categoryDocs = this.categoryDocs.docs);
          // console.log("Category ", this.categoryDocs);
      });
  }

  getSubCategory() {
    this.batchFilter = {
      name: this.form1.value.category,
    };
    this.accountService
      .getSubCategory(this.batchFilter)
      .pipe(first())
      .subscribe((subcategory) => {
        this.subcategory = subcategory;
        this.subcategoryDocs = this.subcategory;
        this.subcategoryDocs = this.subcategoryDocs.docs;
        // console.log("Sub Category ", this.subcategoryDocs);
      });
  }

  addDetails() {
    this.releases = {
      category: this.form1.value.category,
      subcategory: this.form1.value.subcategory,
      Concat: this.form1.value.category + " " + this.form1.value.subcategory,
    };
    this.release.push(this.releases);
    // console.log("Release ==", this.release);
    this.showFromData = true;
  }

  delete(v) {
    this.release.pop(this.release[v]);
  }

  get f() {
    return this.form1.controls;
  }

  getServiceById(pinno, serviceNumber) {
    this.serviceById = " ";
    this.strRemarks = " ";
    this.serviceByValue = " ";
    this.serviceData = " ";
    this.pinno = pinno;
    this.serviceNumber = serviceNumber;
    // this.isEditMode = true;
    // console.log("ghg ==", this.pinno, this.serviceNumber);
    this.accountService
      .getServiceReportById(this.pinno, this.serviceNumber)
      .pipe(first())
      .subscribe((data) => {
        this.serviceById = data;
        this.serviceData = data;
        this.serviceDataCategory = this.serviceData.items;
        this.strRemarks = this.serviceData.remarks;
        this.serviceByValue = this.form1.patchValue(this.serviceById);
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form1.invalid) {
      return;
    } else {
      this.records = {
        pinno: this.form1.value.pinno,
        serviceNumber: this.form1.value.serviceNumber,
        cost: this.form1.value.cost,
        items: this.release,
        status: this.form1.value.status,
        // remarks: this.form1.value.remarks + ' by ' + JSON.parse(localStorage.getItem('user')).loginName + ' ' + this.datePipe.transform(new Date(), 'dd-MM-yyyy')  + ' ' + this.datePipe.transform(new Date(), 'hh:mm:ss a') + ' <br> ',

        remarks: this.form1.value.remarks1,
        createdBy: JSON.parse(localStorage.getItem("user")).loginName,
      };
      // console.log("Update Data", this.records);

      this.accountService
        .updateServiceReport(this.records)
        .subscribe((data) => {
          // console.log(data);
          this.returnData = data;
          const buttonModal = document.getElementById("clickClose");
          buttonModal.click();
          this.getRecord();
          // window.location.reload();

          if (this.returnData) {
            this.toastr.success("Service record updated successfully");
          } else {
            this.toastr.error("Somthing Went Wrong !!!");
          }
        });
    }
  }

  onSubmit2() {
    if (this.form.invalid) {
      return;
    } else {
      this.data = {
        fromDate: this.form.value.startDate,
        toDate: this.form.value.endDate,
      };

      // console.log("data for date feild==", this.data);

      this.accountService.getServiceReport(this.data).subscribe((data) => {
        (this.serviceList = data);
          (this.serviceList = this.serviceList);
          // console.log("service List by Date filter====", this.serviceList);
      });
    }
  }
}
