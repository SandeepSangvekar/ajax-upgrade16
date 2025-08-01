import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-dbreakdown-stat',
  templateUrl: './dbreakdown-stat.component.html',
  styleUrls: ['./dbreakdown-stat.component.less']
})
export class DbreakdownStatComponent implements OnInit {

  p: number = 1;
  date = new Date();
  searchText;
  data:any;
  useType:any;
  loginName:any;
  breakdownCount :any;
  itemsPerPage = 50;

  constructor(
    private accountService: AccountService, 
    private toastr: ToastrService
    ) { }
  
  ngOnInit(): void {
    this.getRecord();
    this.createUserLOgs(); 
  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "DASHBOARD",
      "function": "BREAKDOWN STATISTICS",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      // console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  getRecord() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName.toUpperCase()
    }
    this.accountService.getBreakdownStatisticsCount(data1)
      .subscribe((data) => {
        this.breakdownCount = data;
        this.breakdownCount = this.breakdownCount.Details;

        // console.log("Breakdown List ====", this.breakdownCount);

      })
  }
}
