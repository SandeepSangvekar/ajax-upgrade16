import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  today: Date;
  date = new Date();
  p: number = 1;
  searchText;
  type: any;
  oemDetailList: any;
  oemData: any;
  detailList: any;

  constructor(
    private accountService: AccountService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getDetailData();
  }

  getDetailData() {
    debugger
    this.type = this.route.snapshot.params['id'];
    if (this.type === "delivered") {
      this.detailList = [];    
      this.detailList = JSON.parse(sessionStorage.getItem('deliveredDataList')); 
    } else if(this.type === "read") {
      this.detailList = [];
      this.detailList = JSON.parse(sessionStorage.getItem('readDataList'));
    } else if(this.type === "interested") {
      this.detailList = [];
      this.detailList = JSON.parse(sessionStorage.getItem('interestedDataList'));
    } else if(this.type === "notinterested") {
      this.detailList = [];
      this.detailList = JSON.parse(sessionStorage.getItem('notInterestedDataList'));
    } else if(this.type === "callback") {
      this.detailList = [];
      this.detailList = JSON.parse(sessionStorage.getItem('callBackList'));
    }
  }
}
