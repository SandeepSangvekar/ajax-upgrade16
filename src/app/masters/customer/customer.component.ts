import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { AccountService, AlertService, UsermanagemntService} from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Customer, Dealer, Master } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';
import { ExcelService, ExcelServiceXlsx } from '@app/_services/excel.service';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.less']
})
export class CustomerComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  customer : any;
  Custpassword=environment.dpass;
  p: number = 1;
  itemsPerPage = 50;
  searchText;
  form: FormGroup;
  submitted = false;
  isEdit = false;
  inActive = false;
  active = false;
  isChecked;
  editMachineData: Customer;
  id: string;
  isEditMode: boolean;
  stateCode;
  showModal: boolean;
  loading: boolean = false;
  date = new Date();
  dealer: any;
 // dealercode:any;
  registerCustomer:any;
  deletecustomerData: Object;
  customerExcelData=[];
  selectedDealer:any;
  textsadasdasd: any;
  newDealer: any;
  noSpacePattern= "^[a-zA-Z0-9]*$"
  status: any;
  userRecord: any;
  showAddCustomer=true;
  showEditCustomer=true;
  showDeleteCustomer=true;
  result1: any;
  stateData: any;
  isSelected: any;
  phoneType = {id: '1', value: false}
  constructor(private accountService: AccountService,
    private usermanagementService: UsermanagemntService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private toastr: ToastrService
  ) { 
    
    }

  ngOnInit() {
    this.userRecord = JSON.parse(localStorage.getItem('user'));
    if(this.userRecord.roleMenus.customer.add == true)
    {
      this.showAddCustomer=false;
    }
    if(this.userRecord.roleMenus.customer.edit == true)
    {
      this.showEditCustomer=false;
    }
    if(this.userRecord.roleMenus.customer.delete == true)
    {
      this.showDeleteCustomer=false;
    }
    this.createUserLOgs();
    console.log("hello world".split(" ").slice(-1)[0])
      this.getCustomerData();
      this.getAlldealers();
    this.form = this.formBuilder.group({


      loginName: ['', [Validators.required,Validators.minLength(5),Validators.pattern(this.noSpacePattern)]],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      dealerName:['', Validators.required],
    //  dealercode: ['', Validators.required],
      stateCode:['',Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      whatsAppNo: [''],
      isWhatsAppNo: [false,],
      email: ['', Validators.required],
      segmentation:['',Validators.required],
      password:[''],
      createdBy:[''],
      updatedBy:['']
    });
    this.getAllStates();
  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"MASTER",
        "function":"CUSTOMER",
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
 
  getAlldealers() {
    this.usermanagementService.getAlldealers()
      .pipe(first())
      .subscribe(dealer => {
        this.dealer = dealer
        this.dealer = this.dealer.docs;
        this.dealer = this.dealer.docs.filter(it => it.status == 'Active');

       // this.dealercode=this.form.value.dealerName.split(" ").slice(-1)[0];
        this.dealer.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name > b.name ? 1 : 0)
        console.log(this.dealer)
      });

  }
  getAllStates(){
    this.usermanagementService.getAllState().subscribe(res =>{
      this.stateData = res;
      this.stateData = this.stateData.data;
      console.log("state data=>",this.stateData);
    })
  }
  ch(e: any){
    console.log(this.phoneType);
    // console.log(e.checked);
    if(e.checked){
      var phoneval = this.form.controls["phone"].value;
      this.form.controls["whatsAppNo"].setValue(phoneval);
      // this.isSelected.setValue(phoneval);
      // this.isSelected = true;
    }
    else{
      this.form.controls["whatsAppNo"].setValue('');
      // this.isSelected.setValue('');
      // this.isSelected = false;
    }
    
  }
  getState(event) {
    if(event){
    this.dealer.forEach(element => {
      if(element.name == event.target.value) {
        this.newDealer = element;
    this.form.controls['stateCode'].setValue(this.newDealer.stateCode);
    this.selectedDealer=this.newDealer.code;
      }
    });
  }
  else{
    this.form.controls['stateCode'].setValue('');
  }
    console.log(this.newDealer);
  }
  

  getCustomerData(){
    const useType = JSON.parse(localStorage.getItem('user')).useType;
    const dealerCode = JSON.parse(localStorage.getItem('user')).userDealer;
    let data ={
      useType: useType,
      dealerCode: dealerCode
    }
    this.accountService.getAllCustomer(data)
    .pipe(first())
    .subscribe(customer => {

      this.customer = customer;
      this.customer = this.customer.docs.filter(it => it.isActive == true);
      this.customer.forEach(element => {
        this.customerExcelData.push({
          "Username":element.firstName + ' ' + element.lastName,
          "Login Name":element.loginName,
          "Dealer Code":element.userDealer,
          "Dealer Name":element.dealerName,
          "Address":element.address,
          "Contact":element.phone,
          "Status":(element.isActive==true?'Active':'Inactive'),
          "Segmentation":element.segmentation,
          "Created On":new Date(element.createdAt)
        })
      });
      console.log("true ",this.customer)
    });
  }

  inactiveRecords(event: any){

    if(event){
      this.inActive = false;
      let data ={
        useType: JSON.parse(localStorage.getItem("user")).useType,
      } 
    this.accountService.getAllCustomer(data)
    .pipe(first())
    .subscribe(customer => {this.customer = customer
      this.customer = this.customer.docs.filter(it => it.isActive == false);
      this.inActive = true;
    });

  }

  else {
    this.inActive = false;
   this.getCustomerData();

  }
  

  }
  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.customerExcelData, 'CustomerMaster');
  }

  deletecustomer(id: string) {
    const user = this.customer.find(x => x.id === id);
    user.isDeleting = true;
    
    let result = window.confirm("Are you sure you want to delete the record?")
    if (result == true) {
      this.accountService.removeCustomerRow(id).subscribe((data) => {
        this.deletecustomerData = data
        this.toastr.success('Customer deleted successfully');
        this.getCustomerData()
      })
    }
    else {
      user.isDeleting = false;
    }
  } 

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    if (this.isEditMode) {
      this.updateCustomer(this.id);
      this.loading = false;
    }
    else {
      this.createcustomer();
      this.loading = false;
    }


  }


  addcustomer() {
    this.showModal = true;
    this.form.reset();
    this.isEditMode = false;
    this.submitted = false;

  }

  createcustomer() {
    this.form.controls['createdBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
    this.registerCustomer ={
      loginName: this.form.value.loginName,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      dealercode:this.selectedDealer,
     stateCode: this.form.value.stateCode,
      address:this.form.value.address,
      password:this.Custpassword,
      city:this.form.value.city,
      phone:this.form.value.phone,
      email:this.form.value.email,
      segmentation:this.form.value.segmentation,
      createdBy:this.form.value.createdBy
     }
     console.log("form value",this.registerCustomer);
    this.accountService.newCustomer(this.registerCustomer)

      .subscribe(res => {
        console.log(res);
        this.result1=res;
        if(this.result1.status == "success")
        {
          this.toastr.success('User added successfully');
         // this.toastr.success('Customer added successfully');
          // this.router.navigate(['../'], { relativeTo: this.route });
          this.closeButton.nativeElement.click();
          this.getCustomerData();
        }
        else{
          this.closeButton.nativeElement.click();
         // this.toastr.error("Customer is already created");
          this.toastr.error('Customer is already created');
        }
       
       // this.form.reset();
      },
        error => {
          this.toastr.error(error);
        //  this.toastr.error(error);
          this.closeButton.nativeElement.click();
        }
      );

  }





  update(event, index, id) {

    this.showModal = true;
    this.isEditMode = true;
    this.id = id;



    let ids = index;
    if (this.isEditMode) {

      this.accountService.getByIdCustomer(this.id)
        .subscribe(customer => {
          console.log(customer);
          this.customer = customer;
          this.form.patchValue(this.customer);
        });
    }
  }

  updateCustomer(id) {
    this.form.controls['updatedBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
    this.accountService.updateCustomer(id, this.form.value)

      .subscribe(res => {

        this.toastr.success('Update successful');
        this.closeButton.nativeElement.click();
        this.getCustomerData();
      },
        error => {
          this.toastr.error(error);
          this.loading = false;
        }

      );



  }
}
