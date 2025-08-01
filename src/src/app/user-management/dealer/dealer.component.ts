import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { first } from "rxjs/operators";
import { AccountService, UsermanagemntService } from "@app/_services";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Master } from "@app/_models";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-dealer",
  templateUrl: "./dealer.component.html",
  styleUrls: ["./dealer.component.less"],
})
export class DealerComponent implements OnInit {
  @ViewChild("exampleModal", { static: true }) exampleModalRef: ElementRef;
  @ViewChild("closeButton") closeButton;
  user = null;
  model = null;
  variant = null;
  form: FormGroup;
  submitted = false;
  loading = false;
  p: number = 1;
  searchText;
  isChecked;
  isEdit = false;
  editMachineData: Master;
  id: string;
  deviceModel;
  market = null;
  zone = null;
  role = null;
  subzone = null;
  states = null;
  dealer: any = [];
  userzone = null;
  usersubzone = null;
  userrole = null;
  usermarket = null;
  userstate = null;
  userdealer = null;
  date = new Date();
  itemsPerPage = 50;

  error_messages = {
    loginName: [
      { type: "required", message: "password is required." },
      { type: "minlength", message: "password length." },
      { type: "maxlength", message: "password length." },
    ],
    password: [
      { type: "required", message: "password is required." },
      { type: "minlength", message: "password length." },
      { type: "maxlength", message: "password length." },
    ],
  };
  maketCode: null;
  name: null;
  zoneCode: null;
  subzoneCode: null;
  stateCode: null;
  code: null;
  up: any;
  deletedealerdata: Object;
  dealers = [];
  mobileNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  params: {};
  addressData: any;
  status: any;

  constructor(
    private usermanagementService: UsermanagemntService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.createUserLOgs();
    this.getAlldealers();

    //add machine
    this.dropdownData();
    this.form = this.formBuilder.group({
      // deviceModel: ['', Validators.required],
      name: ["", Validators.required],
      code: ["", Validators.required],
      marketCode: ["", Validators.required],
      address: [""],
      zoneCode: ["", Validators.required],
      pinCode: [""],
      subzoneCode: ["", Validators.required],
      lat: [""],
      stateCode: ["", Validators.required],
      lng: [""],
      contactNo: ["", Validators.pattern(this.mobileNumberPattern)],
      contactPerson: [""],
    });
  }

  createUserLOgs() {
    let params = {
      loginName: JSON.parse(localStorage.getItem("user")).loginName,
      module: "USER MANAGEMENT",
      function: "DEALER",
      type: "web",
    };
    this.accountService.createUserlogs(params).subscribe(
      (data) => {
        this.status = data["status"];
        //  console.log("status",this.status);
      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }

  getAlldealers() {
    this.usermanagementService.getAlldealers().pipe(first())
      .subscribe((dealer) => {
        this.dealer = dealer;
        this.dealer = this.dealer.docs.filter((it) => it.isActive == "true");
        //   this.dealer =  this.dealer.filter(s => s.includes(s.isActive == true));
      });
    // console.log(this.dealer);
  }
  inactiveRecords(event: any) {
    if (event) {
      this.usermanagementService.getAlldealers().pipe(first())
        .subscribe((dealer) => {
          this.dealer = dealer;
          this.dealer = this.dealer.docs.filter((it) => it.isActive == "false");
        });
    } else {
      this.getAlldealers();
    }
  }

  getrole() {
    this.usermanagementService
      .getRole(this.form.value.useType)
      .subscribe((role) => {
        this.role = role;
        this.role = this.role.docs;
      });
  }

  getZone() {
    this.usermanagementService
      .getZone(this.form.value.marketCode)
      .subscribe((zone) => {
        this.zone = zone;
        this.zone = this.zone.docs;
      });
  }

  getSubZone() {
    const market = this.form.value.marketCode;
    const zonecode = this.form.value.zoneCode;
    const subzoneData = {
      marketCode: market,
      zoneCode: zonecode,
    };

    this.usermanagementService.getSubZone(subzoneData).subscribe((subzone) => {
      this.subzone = subzone;
      this.subzone = this.subzone.docs;
    });
  }
  getState() {
    const market = this.form.value.marketCode;
    const zonecode = this.form.value.zoneCode;
    const subzoneCode = this.form.value.subzoneCode;
    const subzoneData = {
      marketCode: market,
      zoneCode: zonecode,
      subzoneCode: subzoneCode,
    };

    this.usermanagementService.getState(subzoneData).subscribe((state) => {
      this.states = state;
      this.states = this.states.docs;
    });
  }

  getDealers() {
    const subzoneData = {
      marketCode: this.form.value.marketCode,
      zoneCode: this.form.value.zoneCode,
      subzoneCode: this.form.value.subzoneCode,
      stateCode: this.form.value.stateCode.toLowerCase(),
    };

    this.usermanagementService.getDealers(subzoneData).subscribe((dealer) => {
      this.dealer = dealer;
      this.dealer = this.dealer.docs;
    });
  }

  deleteDealer(id: string) {
    const dealer = this.dealer.find((x) => x.id === id);
    dealer.isDeleting = true;
    let result = window.confirm("Are you sure you want to delete the record?");
    if (result == true) {
      this.usermanagementService.deleteDealers(id).subscribe((data) => {
        this.deletedealerdata = data;
        this.toastr.success("Dealer deleted successfully");
        this.getAlldealers();
      });
    } else {
      dealer.isDeleting = false;
    }
  }

  createDealer() {
    // console.log(this.form);
    this.usermanagementService.newDealer(this.form.value)
      .subscribe(
        (res) => {
          this.up = res;

          if (this.up.status == "success") {
            this.toastr.success("Dealer added successfully");
            this.getAlldealers();
          }
          // this.router.navigate(['../'], { relativeTo: this.route });
          this.closeButton.nativeElement.click();
        },
        (error) => {
          this.toastr.error(error);
          this.loading = false;
        }
      );
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.updateDealer(this.id);
    } else {
      this.createDealer();
    }
  }

  dropdownData() {
    this.usermanagementService
      .getMarket()
      .pipe(first())
      .subscribe((market) => {
        this.market = market;
        this.market = this.market.docs;
      });
  }
  get f() {
    return this.form.controls;
  }

  isEditMode: boolean;
  showModal: boolean;
  addDealer() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.zoneCode = null;
    this.subzoneCode = null;
    this.stateCode = null;
    this.submitted = false;
  }

  update(event, index, id) {
    this.showModal = true;
    this.isEditMode = true;
    this.id = id;
    // console.log(this.id);
    let ids = index;
    if (this.isEditMode) {
      this.usermanagementService.getDealerById(this.id).subscribe((dealer) => {
        this.getZone();
        if (dealer) {
          this.dealer = dealer;
          this.form.patchValue(this.dealer);
          // this.form.controls['zoneCode'].patchValue(this.dealer.zoneCode);
          this.zoneCode = this.dealer.zoneCode;
          this.subzoneCode = this.dealer.subzoneCode;
          this.stateCode = this.dealer.stateCode;
        }
        // console.log("Form",this.form)
        this.userzone = this.dealer.zoneCode;
        this.usermarket = this.dealer.marketCode;
        this.usersubzone = this.dealer.subzoneCode;
        this.userstate = this.dealer.stateCode;
      });
    }
  }

  updateDealer(id) {
    this.usermanagementService
      .updateDealer(id, this.form.value)
      .subscribe(
        (res) => {
          // console.log(res);
          this.toastr.success("Dealer updated successfully");
          this.closeButton.nativeElement.click();
          this.getAlldealers();
        },
        (error) => {
          // console.log(error);
          this.toastr.error(error);
          this.loading = false;
          this.closeButton.nativeElement.click();
        }
      );
  }
}
