import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({

  selector: 'app-add',
  templateUrl: './add.component.html',

})

export class AddComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  master = null;



  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }
  ngOnInit() {
    this.dropdownData();
    this.form = this.formBuilder.group({
      deviceModel: ['', Validators.required],
      variant: ['', Validators.required],
      machineno: ['', Validators.required],
      pinno: ['', Validators.required],
      batterylotno: ['', Validators.required],
      manufacturingDate: ['', Validators.required],
      // deliveryDate: ['', Validators.required],
      // shipmentDate: ['', Validators.required],
      // batteryInstallationDate: ['', Validators.required],

    });
    

  }
  dropdownData(){
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName:JSON.parse(localStorage.getItem('user')).loginName
     }
     this.accountService.getAllMachines1(data1) .subscribe(master =>this.master = master);
  }

  // dropdownData(){
  //   this.accountService.getAllMachines1()
  //           .pipe(first())
  //           .subscribe(master =>this.master = master);
  // }
  get f() { return this.form.controls; }

  onSubmit() {

    this.submitted = true;

    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.accountService.newMC(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Machine added successfully', { keepAfterRouteChange: true });
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

}

