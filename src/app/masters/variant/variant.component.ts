import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { ExcelService, ExcelServiceXlsx } from '../../_services/excel.service';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Variant } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-variant',
  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.less']
})
export class VariantComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  variant = null;
  p: number = 1;
  searchText;
  itemsPerPage = 50;
  form: FormGroup;
  submitted = false;
  loading = false;
  model = null;
  isEdit = false;
  editDeviceData: Variant;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  isChecked;
  inActive = false;
  active = false;
  date = new Date();
  selectedRow : Number;
  setClickedRow : Function;
  deleteVar: Variant;
  variantExcelData=[];
  status: any;
 // noSpacePattern="^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$";
noSpacePattern= "^[a-zA-Z0-9.]*$";

  result1: any;

  constructor(private accountService: AccountService,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
 ) { 
      this.setClickedRow = function(index){
        this.selectedRow = index;
    }
 
    }

  ngOnInit() {
    this.createUserLOgs();
   this.getVariantData();
    this.dropdownData();

    // add variant
    this.form = this.formBuilder.group({
      deviceModel: ['', Validators.required],
      title: ['',[Validators.required,Validators.pattern(this.noSpacePattern)]],
      createdBy:[''],
      updatedBy:['']
    });

  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"MASTER",
        "function":"VARIANT",
        "type":"web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {    
         this.status=data['status'];
         console.log("status",this.status);
      },
        error => {
          this.toastr.error(error);
        })
    }
  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.variantExcelData, 'VariantMaster');
  }

  getVariantData(){
    this.accountService.getAllVariants()
    .pipe(first())
    .subscribe(variant => {
      this.variant = variant;
    console.log("variant data ",this.variant)
     this.variant = this.variant.docs.filter(it => it.status == 'Active')
     this.inActive = true; 
     this.variant.forEach(element => {
      this.variantExcelData.push({
        "Variant Name":element.title,
        "Model":element.deviceModel,
        "Created On":new Date(element.createdAt),
        "Status":element.status
      })
    });
   
    });
  }


  deleteVariant(id: string) {
    let result = window.confirm("Are you sure you want to delete the record?")
    if (result == true) {
      this.accountService.deleteVariant(id).subscribe((data) => {
        this.deleteVar = data
        this.toastr.success('Variant deleted successfully');
        this.getVariantData()
      })
    }
  }

  inactiveRecords(event: any){

    if(event){
      this.inActive = false;
    this.accountService.getAllVariants()
    .pipe(first())
    .subscribe(variant => {this.variant = variant
      this.variant = this.variant.docs.filter(it => it.status == 'InActive');
      this.inActive = true;
    });

  }

  else {
    this.inActive = false;
    this.getVariantData();

  }
  

  }
dropdownData() {
    this.accountService.getAllModels()
    .pipe(first())
    .subscribe(model => {​​​​​
   
      this.model = model;
       this.model = this.model.docs.filter(it => it.status == 'Active');
          this.model.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title > b.title ? 1 : 0)
    });

  }


  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.isEditMode) {
      this.updateVariant(this.id);
    }
    else {
      this.createVariant();
    }
  }

  addVariant() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;

  }

  createVariant() {
  this.form.controls['createdBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);

    this.accountService.newVariant(this.form.value)
      .pipe(first())
      .subscribe((response)=>{
        this.result1=response;
          if (this.result1.status == "success") {
          this.toastr.success('Variant added successfully');
          // this.router.navigate(['../'], { relativeTo: this.route });
          this.closeButton.nativeElement.click();
          this.getVariantData();
          }
          else{
            this.closeButton.nativeElement.click();
          this.toastr.error('Variant is already created');

          }
        },
        error => {
          this.toastr.error(error);
          this.loading = false;
        }
      );

  }

  update(event, index, id) {

    this.showModal = true;
    this.isEditMode = true;
    this.id = id;

    let ids = index;
    if (this.isEditMode) {

      this.accountService.getByIdVariant(this.id)
        .subscribe(variant => {
          this.variant = variant;
          this.form.patchValue(this.variant);

        });
    }
  }

  updateVariant(id) {
    this.form.controls['updatedBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
    this.accountService.updateVariant(id, this.form.value)

      .subscribe(res => {
        this.toastr.success('Updated successfully');
        this.closeButton.nativeElement.click();
        this.getVariantData();
      },
        error => {
          this.toastr.error(error);
          this.loading = false;
          this.closeButton.nativeElement.click();
        }
      );
  }
}





