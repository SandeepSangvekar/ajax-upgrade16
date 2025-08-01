import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, UsermanagemntService } from '@app/_services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Master } from '@app/_models';
import { DatePipe } from '@angular/common';
import { environment } from '@environments/environment';
import { ToastrService } from "ngx-toastr";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {


  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  user = null;
  model = null;
  variant = null;
  form: FormGroup;
  fieldTextType: boolean;
  fieldTextType1: boolean;
  showPassword = false;
  submitted = false;
  loading = false;
  p: number = 1;
  searchText;
  isEdit = false;
  editMachineData: Master;
  id: string;
  deviceModel;
  isChecked;
  market = null;
  zone = null;
  role = null;
  subzone = null;
  disable = false;
  states = null;
  ifZone=false;
  dealer = null;
  userzone = null;
  usersubzone = null;
  userrole = null;
  usermarket = null;
  userstate = null;
  userdealer = null;
  date = new Date();
  disableField = false;
  comp = environment.companyID;
  disableZone=false;
  itemsPerPage = 50;
  stateData:any;

  error_messages = {
    'loginName': [
      { type: 'required', message: 'login name is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ],
    'password': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ],

  }
  userDetail: any;
  selectZone: any;
  selectedUserType: any;
  ifMZone=false;
  ifAZone=false;
  status: any;

  constructor(
    private usermanagementService: UsermanagemntService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
   ) { 
  }

  ngOnInit() {
    this.createUserLOgs();
    this.userDetail = JSON.parse(localStorage.getItem('user'));
    this.selectedUserType=this.userDetail.useType;
    if(this.userDetail.useType == "ZONE")
    {
      this.ifMZone=false;
      this.ifAZone=false;
    }
    else{
      this.ifMZone=true;
      this.ifAZone=true;
    }
    this.getAllUser();

    //add machine
    this.dropdownData();
    this.form = this.formBuilder.group({
      // deviceModel: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(10)]],
      email: [''],
      companyID: [''],
      useType: ['', Validators.required],
      role: ['', Validators.required],
      userZone: [''],
      userSubzone: [''],
      userState: ['', Validators.required],
      loginName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ])),
      agreementSignedOn: [''],
      createdAtmuserMarket: ['india', Validators.required],
      pincode: ['', Validators.required],
      city: ['', Validators.required],
      userDealer: [''],
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ])),
      confirmpassword: ['', Validators.required]
    });
    this.getAllStates();
  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"USER MANAGEMENT",
        "function":"USER",
        "type":"web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {    
         this.status=data['status'];
        //  console.log("status",this.status);
      },
        error => {
          this.toastr.error(error);
        })
    }
  checkDisableFields() {
    if (this.isEditMode) {
      this.form.controls['useType'].disable();
      this.form.controls['role'].disable();
      this.form.controls['loginName'].disable();
      this.form.controls['password'].disable();
      this.form.controls['confirmpassword'].disable();
      //this.addMachine();
    }
    else {
      this.form.controls['useType'].enable();
      this.form.controls['role'].enable();
      this.form.controls['loginName'].enable();
      this.form.controls['password'].enable();
      this.form.controls['confirmpassword'].enable();
      //  this.addMachine();
    }
  }



  getAllUser() {
    this.usermanagementService.getAllUsers()
      .pipe(first())
      .subscribe(user => {
        this.user = user
        this.user = this.user.docs.filter(it => it.isActive == true);

      });
    // console.log(this.user);
  }

  inactiveRecords(event: any) {
    if (event) {
      this.usermanagementService.getAllUsers()
        .pipe(first())
        .subscribe(user => {
          this.user = user
          this.user = this.user.docs.filter(it => it.isActive == false);
        });

    }

    else {

      this.getAllUser();

    }
  }

  getrole() {
    this.usermanagementService.getRole(this.form.value.useType)
      .subscribe(role => {
        if (role) {
          this.role = role;
         // this.role = this.role.docs;
        }
      });
  }

  getZone() {
    if(this.userDetail.useType == "ZONE")
    {
      this.selectZone=this.userDetail.userZone;
      this.userzone= this.selectZone;
      this.disableZone = true;
     
    }
    else
    {
      this.disableZone = false;   
      this.userzone = null;
      this.usermanagementService.getZone(this.form.value.createdAtmuserMarket)
      .subscribe(zone => {
        this.zone = zone;
        this.zone = this.zone.docs;

      });
    
    }
   

  }

  getSubZone() {

    const market = this.form.value.createdAtmuserMarket;
    const zonecode = this.form.value.userZone;
    const subzoneData = {
      "marketCode": market,
      "zoneCode": zonecode
    }

    this.usermanagementService.getSubZone(subzoneData)
      .subscribe(subzone => {
        this.subzone = subzone;
        this.subzone = this.subzone.docs;


      });


  }

  getState() {

    const market = this.form.value.createdAtmuserMarket;
    const zonecode = this.form.value.userZone;
    const subzoneCode = this.form.value.userSubzone;
    const subzoneData = {
      "marketCode": market,
      "zoneCode": zonecode,
      "subzoneCode": subzoneCode
    }

    this.usermanagementService.getState(subzoneData)
      .subscribe(state => {
        this.states = state;
        this.states = this.states.docs;


      });


  }
  getAllStates(){
    this.usermanagementService.getAllState().subscribe(res =>{
      this.stateData = res;
      this.stateData = this.stateData.data;
      // console.log("state data=>",this.stateData);
    })
  }
  getDealers() {


    const subzoneData = {
      "marketCode": this.form.value.createdAtmuserMarket,
      "zoneCode": this.form.value.userZone,
      "subzoneCode": this.form.value.userSubzone,
      "stateCode": this.form.value.userState.toLowerCase()
    }

    this.usermanagementService.getDealers(subzoneData)
      .subscribe(dealer => {
        this.dealer = dealer;
        this.dealer = this.dealer.docs;


      });


  }

  deleteUser(id: string) {
    const user = this.user.find(x => x.id === id);
    user.isDeleting = true;
    this.usermanagementService.deleteUsers(id)
      .pipe(first())
      .subscribe(() => this.user = this.user.filter(x => x.id !== id));
  }


  dropdownData() {

    this.usermanagementService.getMarket()
      .pipe(first())
      .subscribe(market => {
        this.market = market;
        this.market = this.market.docs;
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
      this.updateUser(this.id);
    }
    else {
      this.createUser();

    }

  }



  isEditMode: boolean;
  showModal: boolean;
  addMachine() {
    this.showModal = true;
    this.isEditMode = false;
    this.checkDisableFields();
    this.form.reset();
    this.userzone = null;
    this.userrole = null;
    this.usermarket = null;
    this.usersubzone = null;
    this.userstate = null;
    this.userdealer = null;

    this.submitted = false;
  }


  createUser() {
    if (this.form.value.useType == 'DEALER' || this.form.value.useType == 'CUSTOMER') {
      this.form.value.agreementSignedOn = '';
    }
    else {
      // this.form.value.agreementSignedOn = new Date();
      this.form.value.agreementSignedOn = '';
    }
    this.form.value.companyID = this.comp;
    this.usermanagementService.newUser(this.form.value)
      // .pipe(first())
      .subscribe(res => {
        //next: () 
        // console.log(res)
        this.toastr.success('User added successfully');
        // this.router.navigate(['../'], { relativeTo: this.route });
        this.closeButton.nativeElement.click();
        this.getAllUser();
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
    this.checkDisableFields();
    this.id = id;
    let ids = index;
    this.usermanagementService.getByIdUser(this.id)
      .subscribe((user) => {
        this.user = user;
        this.form.patchValue(this.user);
        this.userzone = this.user.userZone;
        this.userrole = this.user.role;
        this.usermarket = this.user.createdAtmuserMarket;
        this.usersubzone = this.user.userSubzone;
        this.userstate = this.user.userState;
        this.userdealer = this.user.userDealer;


      });
  }





  updateUser(id) {
    // console.log(this.form.value);
    this.usermanagementService.updateUser(id, this.form.value)

      .subscribe(res => {
        // console.log(res);
        this.toastr.success('Updated successful');
        this.closeButton.nativeElement.click();
        this.getAllUser();
      },
        error => {
          // console.log(error)
          this.toastr.error(error);
          this.loading = false;
          this.closeButton.nativeElement.click();
        }

      );


  }
  toggleFieldTextType() {
    if (this.isEditMode == false) {
      this.fieldTextType = !this.fieldTextType;
    }
  }

  toggleFieldTextType1() {
    if (this.isEditMode == true) {
      this.fieldTextType1 = !this.fieldTextType1;
    }
  }


}