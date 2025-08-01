import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dcust-segmentation',
  templateUrl: './dcust-segmentation.component.html',
  styleUrls: ['./dcust-segmentation.component.less']
})
export class DcustSegmentationComponent implements OnInit {

  p: number = 1;
  date = new Date();
  searchText;
  selectOne: string='individual';
  individualCustomerSegmentCount: any;
  institutionalCustomerSegmentCount:any;
  othersCustomerSegmentCount:any;
  contractorCustomerSegmentCount:any;
  customerSegmentCount:any;
  itemsPerPage = 50;
  loading: boolean;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.getCustomerSegmentation();
    this.createUserLOgs();
  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "DASHBOARD",
      "function": "CUSTOMER SEGMENTATION",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      // console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }
 
  changeSegment(){
    this.getCustomerSegmentation();
  }

  getCustomerSegmentation() {
    this.customerSegmentCount = [];
    this.loading = true;
    if(this.selectOne=='individual')
    {
      this.accountService.getCustomerSegmentationCount()
      .pipe(first())
      .subscribe((data) => {
        this.individualCustomerSegmentCount = data;
        this.loading = false;
        this.individualCustomerSegmentCount=this.individualCustomerSegmentCount.IndividualDetails;
        this.customerSegmentCount = this.individualCustomerSegmentCount;
        // console.log("individualCustomerSegmentCount", this.customerSegmentCount);
    })
   }

    else if(this.selectOne=='institutional')
    {
      this.accountService.getCustomerSegmentationCount()
        .pipe(first())
        .subscribe((data) => {
          this.institutionalCustomerSegmentCount = data;
          this.loading = false;
          this.institutionalCustomerSegmentCount=this.institutionalCustomerSegmentCount.InstitutionalDetails;
          this.customerSegmentCount = this.institutionalCustomerSegmentCount;
          // console.log("institutionalCustomerSegmentCount", this.customerSegmentCount);
      })
    }

    else if(this.selectOne=='others')
    {
      this.accountService.getCustomerSegmentationCount()
        .pipe(first())
        .subscribe((data) => {
          this.othersCustomerSegmentCount = data;
          this.loading = false;
          this.othersCustomerSegmentCount=this.othersCustomerSegmentCount.OthersDetails;
          this.customerSegmentCount = this.othersCustomerSegmentCount;
          // console.log("othersCustomerSegmentCount", this.customerSegmentCount);
      })
    }

    else if(this.selectOne=='contractor')
    {
      this.accountService.getCustomerSegmentationCount()
        .pipe(first())
        .subscribe((data) => {
          this.contractorCustomerSegmentCount = data;
          this.loading = false;
          this.contractorCustomerSegmentCount=this.contractorCustomerSegmentCount.ContractorDetails;
          this.customerSegmentCount = this.contractorCustomerSegmentCount;
          // console.log("contractorCustomerSegmentCount", this.customerSegmentCount);
      })
    }
  }
}
