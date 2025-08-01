import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-customer-segmentation',
  templateUrl: './customer-segmentation.component.html',
  styleUrls: ['./customer-segmentation.component.less']
})
export class CustomerSegmentationComponent implements OnInit {
  
  p: number = 1;
  inActive = false;
  date = new Date();
  searchText;
  // p: number = 1;
  selectOne: string='individual';
  individualCustomerSegmentCount: any;
  institutionalCustomerSegmentCount:any;
  othersCustomerSegmentCount:any;
  contractorCustomerSegmentCount:any;
  customerSegmentCount:any;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.getCustomerSegmentation();
  }
 
  changeSegment(){
    this.getCustomerSegmentation();
  }

  getCustomerSegmentation() {
    
    if(this.selectOne=='individual')
    {
      debugger
      this.accountService.getCustomerSegmenttation()
      .pipe(first())
      .subscribe((data) => {
        this.individualCustomerSegmentCount = data;
        this.individualCustomerSegmentCount=this.individualCustomerSegmentCount.IndividualDetails;
        // console.log("lasttopperformerdata", this.lastMonthPerformerData);
        this.customerSegmentCount = this.individualCustomerSegmentCount;
        console.log("individualCustomerSegmentCount", this.customerSegmentCount);
    })
   }

    else if(this.selectOne=='institutional')
    {
      this.accountService.getCustomerSegmenttation()
        .pipe(first())
        .subscribe((data) => {
          this.institutionalCustomerSegmentCount = data;
          this.institutionalCustomerSegmentCount=this.institutionalCustomerSegmentCount.InstitutionalDetails;
          // console.log("currentMonthPerformerData", this.currentMonthPerformerData);
          this.customerSegmentCount = this.institutionalCustomerSegmentCount;
          console.log("institutionalCustomerSegmentCount", this.customerSegmentCount);
      })
    }

    else if(this.selectOne=='others')
    {
      this.accountService.getCustomerSegmenttation()
        .pipe(first())
        .subscribe((data) => {
          this.othersCustomerSegmentCount = data;
          this.othersCustomerSegmentCount=this.othersCustomerSegmentCount.OthersDetails;
          // console.log("currentMonthPerformerData", this.currentMonthPerformerData);
          this.customerSegmentCount = this.othersCustomerSegmentCount;
          console.log("othersCustomerSegmentCount", this.customerSegmentCount);
      })
    }

    else if(this.selectOne=='contractor')
    {
      this.accountService.getCustomerSegmenttation()
        .pipe(first())
        .subscribe((data) => {
          this.contractorCustomerSegmentCount = data;
          this.contractorCustomerSegmentCount=this.contractorCustomerSegmentCount.ContractorDetails;
          // console.log("currentMonthPerformerData", this.currentMonthPerformerData);
          this.customerSegmentCount = this.contractorCustomerSegmentCount;
          console.log("contractorCustomerSegmentCount", this.customerSegmentCount);
      })
    }
   
  }
}
