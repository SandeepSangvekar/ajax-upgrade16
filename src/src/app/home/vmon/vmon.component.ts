import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit, Directive, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from '../home.component'
import { AccountService } from '@app/_services';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vmon',
  templateUrl: './vmon.component.html',
  styleUrls: ['./vmon.component.less']
})
export class VmonComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  date = new Date();
  form: FormGroup;
  monitordata: any;
  servicedata: any;
  p: number = 1;
  searchText;
  selectOne: string='active';
  pinNo=environment.labelpinno;
  itemsPerPage = 50
  loading = true;


  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private homeComponent: HomeComponent,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getMonitorData();
    this.createUserLOgs();
  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "DASHBOARD",
      "function": "VEHICLE MONITORING",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  changeMonitor(){
    this.getMonitorData();
  }

  getMonitorData() {
    this.loading = true;
    this.monitordata = [];
    if(this.selectOne=='active')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getMonitorData(data1)
      .subscribe((data) => {
        this.monitordata = data
        this.loading = false;
        this.monitordata = this.monitordata.countAnddetails.Activedetails
        console.log("Active data ", this.monitordata);
    })
   }
    else if(this.selectOne=='inactive')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getMonitorData(data1)
      .subscribe((data) => {
        this.monitordata = data
        this.loading = false;
        this.monitordata = this.monitordata.countAnddetails.InActivedetails
        console.log("InActive data ", this.monitordata);
      })
    }
   
  }

}
