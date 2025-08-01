import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dtperformer',
  templateUrl: './dtperformer.component.html',
  styleUrls: ['./dtperformer.component.less']
})
export class DtperformerComponent implements OnInit {
  
  selectMonth:string='currentMonth';
  lastMonthPerformerData:any;
  date = new Date();
  top5Performers: any;
  getCustomArrayForTopPerformers: any;
  currentMonthPerformerData : any;
  p: number = 1;
  searchText;
  itemsPerPage = 50;
  loading = true;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.getTop5Performers();
    this.createUserLOgs();
  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "DASHBOARD",
      "function": "TOP 5 PERFORMANCE",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  changeMonth(){
    this.getTop5Performers();
  }

  getTop5Performers() {
    this.loading = true;
    this.top5Performers = [];
    if(this.selectMonth=='lastMonth')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getLastmonthtopfiveperformer(data1)
      .pipe(first())
      .subscribe((data) => {
        this.lastMonthPerformerData = data;
        this.loading = false;
        this.top5Performers = this.lastMonthPerformerData;
        // console.log("lasttopperformerdata", this.top5Performers);
    })
   }
    else if(this.selectMonth=='currentMonth')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getCurrentmonthtopfiveperformer(data1)
      .pipe(first())
      .subscribe((data) => {
        this.currentMonthPerformerData = data;
        this.loading = false;
        this.top5Performers = this.currentMonthPerformerData;
        // console.log("currentMonthPerformerData", this.top5Performers);
    })
   
    }
   
  }

}
