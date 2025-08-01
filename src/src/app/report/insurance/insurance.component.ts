import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from '@environments/environment';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.less']
})
export class InsuranceComponent implements OnInit {
  @ViewChild('closeButton') closeButton;
  @ViewChild('closeButton2') closeButton2;
  date = new Date();
  loading = false;
  searchText;
  p: number = 1;
  itemsPerPage = 50;
  pinNo = environment.labelpinno;
  today: Date;
  insuranceList: Object;
  form: FormGroup;
  formData: any;
  submitted = false;
  pinNoList: any;
  batchFilter: any;
  pinData: any;
  form2: FormGroup;
  formData2: any;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getRecord();
    this.form = this.formBuilder.group({
      pinNo: ['', Validators.required],
      model: ['', Validators.required],
      commissionDate: ['', Validators.required],
      customer: ['', Validators.required],
      type: ['', Validators.required],
      insuranceBy: ['', Validators.required],
      policyNo: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      address: ['', Validators.required],
      contact: ['', Validators.required],
      productValue: ['', Validators.required],
      insuranceAmt: ['', Validators.required],
    });

    this.form2 = this.formBuilder.group({
      pinNo2: ['', Validators.required],
      model2: ['', Validators.required],
      commissionDate2: ['', Validators.required],
      customer2: ['', Validators.required],
      type2: ['', Validators.required],
      insuranceBy2: ['', Validators.required],
      policyNo2: ['', Validators.required],
      startDate2: ['', Validators.required],
      endDate2: ['', Validators.required],
      address2: ['', Validators.required],
      contact2: ['', Validators.required],
      productValue2: ['', Validators.required],
      insuranceAmt2: ['', Validators.required],
    });

    this.createUserLogs();
  }

  createUserLogs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "REPORT",
      "function": "INSURANCE",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  getRecord() {
    this.accountService.getInsurance()
      .subscribe((data) => {
        this.insuranceList = data,
          this.insuranceList = this.insuranceList
        console.log("Insurance List ====", this.insuranceList)
      })
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.formData = {
      pinno: this.form.value.pinNo,
      model: this.form.value.model,
      commissionDate: this.datePipe.transform(this.form.value.commissionDate, 'dd-MM-yyyy'),
      customer: this.form.value.customer,
      type: this.form.value.type,
      insuranceBy: this.form.value.insuranceBy,
      policyNumber: this.form.value.policyNo,
      startDate: this.datePipe.transform(this.form.value.startDate, 'dd-MM-yyyy'),
      endDate: this.datePipe.transform(this.form.value.endDate, 'dd-MM-yyyy'),
      address: this.form.value.address,
      contactNo: this.form.value.contact,
      productValue: this.form.value.productValue,
      insuranceAmt: this.form.value.insuranceAmt,
    }
    console.log("Form Data===", this.formData)

    this.accountService.createInsurance(this.formData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('Insurance add successfully.');
          this.closeButton.nativeElement.click();
          this.form.reset();
          this.getRecord();
        },
        error: error => {
          this.toastr.error('Somthing went wrong !!!');
        }
      });
  }

  getPinNo() {
    this.accountService.getPinNoList()
      .pipe(first())
      .subscribe(data => {
        this.pinNoList = data
        console.log("Pin List== ", this.pinNoList)
      });
  }

  fetchData() {
    this.batchFilter = {
      pinno: this.form.value.pinNo
    }
    console.log("Pin No===", this.batchFilter)
    this.accountService.fetchDataByPinNo(this.batchFilter)
      .pipe(first())
      .subscribe(data => {
        this.pinData = data
        console.log("pin data ", this.pinData)
        this.form.controls['address'].setValue(this.pinData[0].address);
        this.form.controls['contact'].setValue(this.pinData[0].contactNumber);
      });
  }

  getRenewData(pinno, contactNo, address, model, commissionDate, customer, insuranceBy, policyNumber, startDate, endDate, productValue, insuranceAmt, type)
  {
    this.form2.controls['pinNo2'].setValue(pinno);
    this.form2.controls['contact2'].setValue(contactNo);
    this.form2.controls['address2'].setValue(address);
    this.form2.controls['model2'].setValue(model);
    // this.form2.controls['commissionDate2'].setValue(this.datePipe.transform(commissionDate, 'dd-MM-yyyy'));
    this.form2.controls['customer2'].setValue(customer);
    this.form2.controls['insuranceBy2'].setValue(insuranceBy);
    this.form2.controls['policyNo2'].setValue(policyNumber);
  }

  renewSubmit() {
    this.formData2 = {
      pinno: this.form2.value.pinNo2,
      model: this.form2.value.model2,
      commissionDate: this.datePipe.transform(this.form2.value.commissionDate2, 'dd-MM-yyyy'),
      customer: this.form2.value.customer2,
      type: this.form2.value.type2,
      insuranceBy: this.form2.value.insuranceBy2,
      policyNumber: this.form2.value.policyNo2,
      startDate: this.datePipe.transform(this.form2.value.startDate2, 'dd-MM-yyyy'),
      endDate: this.datePipe.transform(this.form2.value.endDate2, 'dd-MM-yyyy'),
      address: this.form2.value.address2,
      contactNo: this.form2.value.contact2,
      productValue: this.form2.value.productValue2,
      insuranceAmt: this.form2.value.insuranceAmt2,
    }
    console.log("Form Data===", this.formData2)

    this.accountService.createInsurance(this.formData2)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('Insurance renewal add successfully.');
          this.closeButton2.nativeElement.click();
          this.form2.reset();
          this.getRecord();
        },
        error: error => {
          this.toastr.error('Somthing went wrong !!!');
        }
      });
  }

}
