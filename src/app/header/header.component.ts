import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '.././_helpers/must-match';
import { MustNotMatch } from '.././_helpers/must-not-match';
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams } from '@angular/common/http';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  @ViewChild('closeButton2') closeButton2;
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  returnData: any;
  form: FormGroup;
  showModal: boolean;
  loading = true;
  submitted = false;
  showManual = true;
  loginName = JSON.parse(localStorage.getItem('user')).loginName;
  checkPasswordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@!#$%^&+=]).{8,}$';
  profileData: any;
  form2: any;
  credentials: any;
  fileInputLabel: any;
  uploadStatus: any
  myInputVariable: ElementRef;

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
  }




  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('user')).useType == 'ADMIN') {
      this.showManual = false;
    }
    this.form = this.formBuilder.group({
      loginName: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(this.checkPasswordPattern)]],
      cnPassword: ['', Validators.required]
    },

      {
        validator: [MustMatch('newPassword', 'cnPassword'), MustNotMatch('oldPassword', 'newPassword')]
      },
    )

    this.form2 = this.formBuilder.group({
      photo: [''],
    });

  }

  logout() {
    this.accountService.logout();
  }

  get f() { return this.form.controls; }
  get f2() { return this.form2.controls; }
  clear() {
    //this.form.reset();
    // this.form.controls['loginName'].setValue(this.loginName);
    this.form.controls['newPassword'].setValue('');
    this.form.controls['cnPassword'].setValue('');

  }
  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;

    }
    this.loading = false;
    this.accountService.changePassword(this.form.value).subscribe(data => {
      // console.log(data);
      this.returnData = data
      this.closeButton.nativeElement.click();


      if (this.returnData.message == "Password updated successfully") {
        this.toastr.success(this.returnData.message);
        // var closeAlert = document.getElementsByClassName("close").close()


      } else {
        this.toastr.error(this.returnData.message)

      }

    })

  }

  onFileSelect(event) {
    // let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // console.log(file);
      this.fileInputLabel = file.name;
      this.form2.controls['photo'].setValue(file);

    }
  }



  onSubmit2() {
    if (this.form2.invalid) {
      return;
    }

    const formData: any = new FormData();
    formData.append("photo", this.form2.value.photo);
    //  formData.append("dataType", 'items');

    if (this.form2.value.photo) {
      this.accountService.updateProfilePicture(formData).subscribe(
        files => {
          // console.log('files', files);
          this.uploadStatus = files;
          this.closeButton2.nativeElement.click();
          if(this.uploadStatus.status == "Profile updated successfully.")
          {
            this.form2.reset();
            this.toastr.success('Profile photo updated successfully. Please login again to see the result.');
          }
        },
        error => {
          this.toastr.error(error);
          this.toastr.error('Somthing went wrong.');
        }
      )
    }
  }

}

