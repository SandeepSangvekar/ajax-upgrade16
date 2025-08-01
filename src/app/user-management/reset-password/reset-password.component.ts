import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { environment } from "@environments/environment";
import { AccountService, AlertService, UsermanagemntService } from "@app/_services";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MustMatch } from "@app/_helpers/must-match";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-reset-password-page",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.less"],
})
export class ResetPasswordPageComponent implements OnInit {
  @ViewChild("exampleModal", { static: true }) exampleModalRef: ElementRef;
  @ViewChild("closeButton") closeButton;
  customer: any;
  Custpassword = environment.dpass;
  p: number = 1;
  searchText;
  form: FormGroup;
  submitted = false;
  public resetPasswordForm: FormGroup;
  public loading = false;
  public openPage = false;
  public resetFormsubmitted = false;
  public status: any;
  public tokenData: any;
  public loading1: boolean;
  public checkPasswordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@!#$%^&+=]).{8,}$";
  isChecked;
  isEditMode: boolean;
  date = new Date();
  dealer: any;
  // dealercode:any;
  registerCustomer: any;
  deletecustomerData: Object;
  openResetPasswordForm = false;
  customerExcelData = [];
  selectedDealer: any;
  textsadasdasd: any;
  newDealer: any;
  userDetails: any;
  enableFetch: true;
  loginnm: any;
  usernm: any;
  contactNo: any;
  id: any;
  result: any;
  //uppercasePattern="^(?=.*?[A-Z]).{6,}$";
  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      loginName: ["", [Validators.required, Validators.minLength(6)]],
      secretCode: ["", Validators.required],
    });
    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: [
          "",
          [Validators.required, Validators.pattern(this.checkPasswordPattern)],
        ],
        cnPassword: ["", Validators.required],
      },
      {
        validator: [MustMatch("newPassword", "cnPassword")],
      }
    );
  }

  get f() {
    return this.form.controls;
  }
  get f3() {
    return this.resetPasswordForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    var params = {
      loginName: this.form.value.loginName,
      secretCode: this.form.value.secretCode,
    };
    this.accountService.getUserDetails(params).subscribe(
      (res) => {
        this.loading = false;
        this.userDetails = res;
        if (this.userDetails.httpCode == 200) {
          this.loginnm = this.userDetails.loginName;
          this.usernm = this.userDetails.loginName;
          this.contactNo = this.userDetails.contactNumber;
          this.id = this.userDetails._id;
          this.openResetPasswordForm = true;
        }
      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }
  onresetFormSubmit() {
    this.resetFormsubmitted = true;
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }
    let params1 = {
      password: this.resetPasswordForm.value.newPassword,
      password2: this.resetPasswordForm.value.cnPassword,
    };

    this.accountService
      .resetPasswordByAdmin(this.id, params1)
      .subscribe((res) => {
        this.result = res;
        if (this.result.httpCode == 200) {
          this.toastr.success("Password updated successfully");
          this.resetPasswordForm.reset();
          this.openResetPasswordForm = false;
          this.form.controls["loginName"].setValue("");
          this.loginnm = "";
          this.usernm = "";
          this.contactNo = "";
        }
      });
  }
}
