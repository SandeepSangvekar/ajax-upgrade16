import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dschedule-service',
  templateUrl: './dschedule-service.component.html',
  styleUrls: ['./dschedule-service.component.less']
})
export class DscheduleServiceComponent implements OnInit {

  p: number = 1;
  date = new Date();
  searchText;
  selectOne: string='completed';
  scheduledServices : any;
  completedServices : any;
  servicesCount : any;
  pinNo=environment.labelpinno;
  itemsPerPage = 50;
  loading: boolean;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.getServiceScheduled();
    this.createUserLOgs();
  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "DASHBOARD",
      "function": "SCHEDULED SERVICE",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  changeSegment(){
    this.getServiceScheduled();
  }

  getServiceScheduled() {
    this.loading = true;
    this.servicesCount = []
    if(this.selectOne=='scheduled')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getServiceSchedulesStatus(data1)
      .pipe(first())
      .subscribe((data) => {
        this.scheduledServices = data;
        this.loading = false;
        this.scheduledServices=this.scheduledServices.countAnddetails;
        this.scheduledServices=this.scheduledServices.openDeatials;
        this.servicesCount = this.scheduledServices;
        // console.log("scheduledServices", this.servicesCount);
    })
   }

    else if(this.selectOne=='completed')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getServiceSchedulesStatus(data1)
        .pipe(first())
        .subscribe((data) => {
          this.completedServices = data;
          this.loading = false;
          this.completedServices=this.completedServices.countAnddetails;
          this.completedServices=this.completedServices.closedDetails;
          this.servicesCount = this.completedServices;
          // console.log("completedServices", this.servicesCount);
      })
    }
   
  }

}
