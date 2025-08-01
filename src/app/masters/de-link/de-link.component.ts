import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';
import { ExcelService, ExcelServiceXlsx } from '@app/_services/excel.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-de-link',
  templateUrl: './de-link.component.html',
  styleUrls: ['./de-link.component.less']
})
export class DeLinkComponent implements OnInit {
  @ViewChild('closeButton') closeButton;
  loading = false;
  isEdit = false;
  inActive = false;
  active = false;
  date = new Date();
  noSpacePattern = "^[a-zA-Z0-9.]*$"
  form: FormGroup;
  fetchForm: FormGroup;
  deviceData: any;
  linkedData: any;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.deviceData = [];
    this.createUserLOgs();
    this.fetchForm = this.formBuilder.group({
      deviceId: ['', Validators.required]
    });

    this.form = this.formBuilder.group({
      deviceID: ['', Validators.required],
      pinNo: ['', Validators.required],
      type: ['', Validators.required],
      secretKey: ['', Validators.required],
      remarks: ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "MASTER",
      "function": "De-Link Device",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      let status:any = data['status'];
    },
      error => {
        this.toastr.error(error);
      })
  }

  fetchData() {
    if(!this.fetchForm.valid) {
      this.toastr.error('Device Id is required');
    } else{
      let deviceID = this.fetchForm.value.deviceId;
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName: JSON.parse(localStorage.getItem('user')).loginName
      }
      this.deviceData = [];
      this.accountService.getAllMachines1(data1).subscribe(data => {
        let response:any = data
        let responseData = response.docs.filter(doc => doc.deviceID == deviceID);
        if (responseData.length > 0) {
          this.deviceData = responseData;
        } else {
          this.toastr.error('No Device founded with id: ' + deviceID);
        }
        }, error => {
          this.toastr.error('Something went wrong.');
        });
    }
  }

  onSubmit() {
    if(!this.form.valid){
      this.toastr.error('From is not valid please try again!');
    } else {
      let data = {
        deviceID: this.form.value.deviceID,
        pinno: this.form.value.pinNo,
        type: this.form.value.type,
        secretkey: this.form.value.secretKey,
        remarks: this.form.value.remarks,
      }
      this.accountService.deLinkDevice(data).subscribe(res => {
        let response:any = res
        if (response.status === "201") {
          this.form.reset();
          this.fetchData();
          this.toastr.success(response.msg);
          this.closeButton.nativeElement.click();
        } else {
          this.toastr.error(response.msg);
          this.closeButton.nativeElement.click();
        }
      }, error => {
        this.toastr.error("Something went wrong.");
        this.closeButton.nativeElement.click();
      });
    }
  }

  deLinkDevice(data){
    this.linkedData = data;
    this.form.controls['deviceID'].setValue(this.linkedData.deviceID);
    this.form.controls['pinNo'].setValue(this.linkedData.pinno);
    this.form.controls['type'].setValue(this.linkedData.type);
  }



}
