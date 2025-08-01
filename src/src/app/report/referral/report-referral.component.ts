import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService, AlertService } from '@app/_services';
import { ExcelServiceXlsx } from '@app/_services/excel.service';
import { ToastrService } from 'ngx-toastr';
//import { AnyARecord } from 'dns';
@Component({
  selector: 'app-report-referral',
  templateUrl: './report-referral.component.html',
  styleUrls: ['./report-referral.component.less']
})
export class ReportReferralComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  searchText;
  p: number = 1;
  date = new Date();
  reportListExcel = [];
  submitted = false;
  refReport: any;
  form: FormGroup;
  inActive = false;
  itemsPerPage = 50;
  showModal = false;
  modelList: any[] = [];
  modelFormData: any;
  isModelAdd: boolean = true;
  refData: any;
  refSingleData: any;
  disableButton: boolean = false;
  constructor(
    private accountService: AccountService, 
    private excelxlsxService: ExcelServiceXlsx,
    private toastr:ToastrService
    ) { }

  ngOnInit(): void {
    this.getreferralList();
    this.getModelList();
    this.form = new FormGroup({
      'referralStatus': new FormControl('', Validators.required),
      'referralModel': new FormControl('', Validators.required),
      'referralRemark': new FormControl('', Validators.required),
      'referralName': new FormControl('')
    })
  }

  createUserLogs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "REPORT",
      "function": "REFERRAL",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  getreferralList(): void {
    
    this.accountService.getReferrals().subscribe((res: any) => {
      this.refReport = res;
      console.log(this.refReport);
    }, (error) => {
      this.toastr.error(error);
    });
  }

  get f() { return this.form.controls; }

  getModelList() {
    this.accountService.getAllModels().subscribe((res: any) => {
      this.modelList = res.docs.filter(it => it.status == 'Active')
      // this.modelList = res.docs;
      console.log(this.modelList);
    }, (error) => {
      this.toastr.error(error);
    });
  }

  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.refReport, 'Referral_Report');
  }

  onSubmit(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const id = this.refData.id;
    const data = {
      "prospectName": this.form.value.referralName,
      "model": this.form.value.referralModel,
      "status": this.form.value.referralStatus,
      "remark": this.form.value.referralRemark
    };
    // console.log(data);
    this.accountService.updateReferral(id, data).subscribe((res: any) => {
      if (res.status === 'success') {
        console.log(res);
        this.toastr.success("Referral report updated successfully")
        this.form.reset();
        this.getreferralList();
        this.isModelAdd = true;

      } else {
        console.log(res);
      }
    });
  }

  rowData(ref: any): void {
    this.isModelAdd = false;
    this.refData = ref;
    this.form.controls['referralName'].setValue(ref.prospectName);
    this.form.controls['referralStatus'].setValue(ref.status);
    this.form.controls['referralModel'].setValue(ref.model);
    this.form.controls['referralRemark'].setValue(ref.remark);
    if (this.form.value.referralStatus === 'won' || this.form.value.referralStatus === 'lost') {
      this.disableButton = true;
      this.submitted = false;
      this.form.controls['referralRemark'].clearValidators();
    }
    else {
      this.disableButton = false;
    }
  }
}

