import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { MustMatch } from "../../_helpers/must-match";
import { AccountService, AlertService } from "@app/_services";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.less"],
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild("closeButton") closeButton;
  public resetPasswordForm: FormGroup;
  public loading = false;
  public showModal: boolean;
  public showModal1: boolean;
  public openPage = false;
  public checkSession: any;
  public resetFormsubmitted = false;
  public status: any;
  public tokenData: any;
  public loading1: boolean;
  public checkPasswordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@!#$%^&+=]).{8,}$";
  public resetPasswordData: any;
  resultData: any;
  openResetModel = false;
  url: string;
  urlData: any;
  public loginnm: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.checkToken();
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
  checkToken() {
    this.url = this.router.url;
    this.urlData = this.url.split("/", 4);
    this.accountService
      .getEmailIDToken(this.urlData[2], this.urlData[3])
      .subscribe((result) => {
        this.resultData = result;
        if (this.resultData.httpCode == 200) {
          this.loginnm = this.resultData.loginName;
          this.openResetModel = true;
        } else {
          this.toastr.error("Link is not valid");
          const returnUrl =
            this.route.snapshot.queryParams["returnUrl"] || "login";
          window.location.href = returnUrl;
        }
      });
  }

  // convenience getter for easy access to form fields
  get f3() {
    return this.resetPasswordForm.controls;
  }

  clear() {
    this.resetPasswordForm.controls["newPassword"].setValue("");
    this.resetPasswordForm.controls["cnPassword"].setValue("");
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
    let resetData = {
      _id: this.resultData._id,
      token: this.resultData.token,
    };
    this.accountService.resetPassword(params1, resetData).subscribe(
      (res) => {
        // console.log(res);

        this.resetPasswordData = res;
        if (this.resetPasswordData.httpCode == 200) {
          this.toastr.success("Password updated successfully");
          const returnUrl =
            this.route.snapshot.queryParams["returnUrl"] || "login";
          window.location.href = returnUrl;
        } else {
          this.toastr.error("Failed to reset password,Please try again");
        }
      },
      (err) => {
        this.toastr.error(err);
      }
    );
  }
}
