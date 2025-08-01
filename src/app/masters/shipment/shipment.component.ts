import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, UsermanagemntService } from '@app/_services';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { validate } from 'json-schema';
import { AuthService } from '@app/_services/auth.service';
import { ExcelService, ExcelServiceXlsx } from '@app/_services/excel.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.less']
})
export class ShipmentComponent implements OnInit {
  [x: string]: Object;
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  @ViewChild('myInput') myInput;

  customer: any;
  p: number = 1;
  searchText;
  form: FormGroup;
  realeseForm: FormGroup;
  submitted = false;
  isEdit = false;
  itemsPerPage = 50;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  loading: boolean = false;
  date = new Date();
  dealsrList: any;
  dealsrListDocs: any;
  invoiceList: any;
  inovoiceListDocs: any;
  releases: any = [];
  release: any = [];
  jsondata: any;
  jsonobh: any;
  batchFilter: any;
  showFromData = false
  records: any;
  createInvoid: any;
  model: any;
  variant: any;
  invoiePreview: any;
  invoiePreviewDetails: any;
  invoicePreviewModelPop = false;
  dealers: any
  checkStatus: any;
  invoiceListExcelData = [];
  realesesubmitted = false;

  constructor(private accountService: AccountService,
    private usermanagementService: UsermanagemntService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private toastr: ToastrService
  ) {

  }
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  ngOnInit(): void {
    this.createUserLOgs();
    this.form = this.formBuilder.group({
      dealer: ['', Validators.required],
      invoiceno: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      dispatchDate: ['', Validators.required],
      fromAddress: ['', Validators.required],
      toAddress: ['', Validators.required],
      dealerCode: [''],
      createdBy: ['']
    });
    this.realeseForm = this.formBuilder.group({
      deviceModel: ['', Validators.required],
      variant: ['', Validators.required],
      pinno: ['', Validators.required,]
    });
    this.getAllInvoice()
    this.dropdownData()
    this.getAlldealers()
    this.getPinNoList()

  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "MASTER",
      "function": "SHIPMENT",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      this.checkStatus = data['status'];
      console.log("status", this.checkStatus);
    },
      error => {
        this.toastr.error(error);
      })
  }
  get f() { return this.form.controls; }

  get f1() { return this.realeseForm.controls; }
  dropdownData() {
    this.accountService.getAllModels()
      .pipe(first())
      .subscribe(model => {

        this.model = model;
        this.model = this.model.docs.filter(it => it.status == 'Active');
        this.model.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title > b.title ? 1 : 0)
      });

    // this.accountService.getAllVariants()
    //   .pipe(first())
    //   .subscribe(variant => {
    //     this.variant = variant;
    //     this.variant =this.variant.docs;
    //   });

  }
  getVariant() {
    console.log(this.realeseForm.value.deviceModel);
    this.accountService.getVariantModel(this.realeseForm.value.deviceModel)
      .subscribe(variant => {
        this.variant = variant;
        this.variant = this.variant.filter(it => it.status == 'Active');
      });

  }


  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
  getAlldealers() {
    this.usermanagementService.getAlldealers()
      .pipe(first())
      .subscribe(dealers => {
        this.dealers = dealers
        this.dealers = this.dealers.docs;
        this.dealers = this.dealers.docs.filter(it => it.status == 'Active');
        this.dealers.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name > b.name ? 1 : 0)
        console.log("Dealers ", this.dealers)
      });

  }


  getPinNoList() {
    this.batchFilter = {
      deviceModel: this.realeseForm.value.deviceModel,
      variant: this.realeseForm.value.variant
    }
    console.log(this.batchFilter)
    this.accountService.getPinno(this.batchFilter)
      .subscribe(pin => {
        this.pin = pin;
        console.log(this.pin)
      });
  }

  getAllInvoice() {
    this.accountService.getAllInvoiceList().subscribe((data) => {
      this.invoiceList = data
      this.inovoiceListDocs = this.invoiceList.docs
      this.inovoiceListDocs.forEach(element => {
        this.invoiceListExcelData.push({
          "Invoice No.": element.invoiceno,
          "Invoice Date": new Date(element.invoicedate),
          "Quantity": element.qty,
          "From Plant": element.from,
          "To Dealer": element.to,
          "Shipment Date": new Date(element.shipdate)
        })
      });
    })
  }

  addShipment() {
    this.showModal = true;
    // this.isEditMode = false;
    this.form.reset();
    this.realeseForm.reset();
    this.submitted = false;
    this.showFromData = false;
    this.realesesubmitted = false;
    this.release = [];
  }

  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.invoiceListExcelData, 'ShipmentMaster');
  }
  getInvoicPreview(i) {
    this.invoicePreviewModelPop = true;
    this.invoiePreview = this.inovoiceListDocs[i];
    this.invoiePreviewDetails = this.invoiePreview.details
    console.log(this.invoiePreview);

    console.log(this.invoiePreviewDetails);

  }


  onreleaseSubmit() {
    this.realesesubmitted = true;
    if (this.realeseForm.valid) {
      setTimeout(() =>
        this.formGroupDirective.resetForm(), 0)
    }
    this.releases = {
      deviceModel: this.realeseForm.value.deviceModel,
      variant: this.realeseForm.value.variant,
      pinno: this.realeseForm.value.pinno,
    };
    if ((this.releases.deviceModel && this.releases.variant && this.releases.pinno)) {
      this.release.push(this.releases)
      this.showFromData = true;
    }
    else if (this.release.length > 0) {
      this.showFromData = true;
    }
    else {
      this.showFromData = false;

    }

    //  this.realeseForm.reset();
  }

  delete(v) {
    this.release.splice(v, 1);
  }

  onSubmit() {
    if (this.realesesubmitted == true) {
      this.form.controls['createdBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
      this.submitted = true;
      this.realesesubmitted = true;
      let dealer = [];
      dealer = this.form.value.dealer.split(" ");
      let selectedDealer = dealer[dealer.length - 1];
      // var fields = this.form.value.dealer.split(" ").slice(-1)[0];
      if (this.form.invalid) {
        return;
      }

      this.release.forEach(element => {
        this.release.push({
          'dealerCode': selectedDealer
        });
      });

      this.records = {
        details: this.release,
        qty: this.release.length,
        dealerCode: selectedDealer,
        invoiceno: this.form.value.invoiceno,
        shipdate: this.form.value.dispatchDate,
        invoicedate: this.form.value.invoiceDate,
        pinno: this.releases.pinno,
        from: this.form.value.fromAddress,
        to: this.form.value.toAddress,
        createdBy: this.form.value.createdBy
      }
      console.log(this.records);
      this.accountService.createInvoiceList(this.records).subscribe((invoice) => {
        this.createInvoid = invoice
        if (this.createInvoid.status == 'success') {
          this.toastr.success('Shipment created Sucessfully');
          this.closeButton.nativeElement.click();
          //    this.exampleModalRef.nativeElement.
          //  this.form.reset();
          const buttonModal = document.getElementById("invoiceMode")
          buttonModal.click()
          this.getAllInvoice()
        }
        else {
          this.toastr.error('Shipment is already created');
          this.closeButton.nativeElement.click();
        }
      })
    } else {
      this.toastr.error("First click on '+' button in form!!!");
    }

  }
  assignCopy() {
    this.model = Object.assign([], this.items);
  }
  filterItem(value) {
    if (!value) {
      this.assignCopy();
    } // when nothing has typed
    this.model = Object.assign([], this.items).filter(
      device => device.title.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }
}
