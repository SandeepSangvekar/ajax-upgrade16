import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService, UsermanagemntService } from '@app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-oem-management',
  templateUrl: './oem-management.component.html',
  styleUrls: ['./oem-management.component.less']
})
export class OemManagementComponent implements OnInit {
  @ViewChild('closeButton') closeButton;
  today: Date;
  fromDate: string;
  toDate: string;
  startDate: string;
  endDate: string;
  date = new Date();
  loading = false;
  p: number = 1;
  searchText;
  form: FormGroup;
  text: boolean;
  image: boolean;
  video: boolean;
  oemList: any;
  oemListData: any;
  uploadStatus: any;
  fileInputLabel: string;
  imageFile: any[] = [];
  zone: any;
  subzone: any;
  itemsPerPage = 50;
  states: any;
  dTitle: any;
  dValidyDate: any;
  dDescription: any;
  dZone: any;
  dState: any;
  dCreatedAt: any;
  dCreatedBy: any;
  dStatus: any;
  dImages: any;
  dVideoLink: any;
  dType: string;
  readDataCount: any;
  readDataList: any;
  interestedDataList: any;
  notInterestedDataList: any;
  callBackList: any;
  deliveredDataList: any;
  timeBetween: any;
  form2: FormGroup;
  safeSrc: SafeResourceUrl;
  youtubeID: any;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private usermanagementService: UsermanagemntService,
    private toastr: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      validityDate: [''],
      audienceType: [''],
      userZone: [''],
      userSubzone: [''],
      userState: [''],
      description: [''],
      image_1: [''],
      image_2: [''],
      image_3: [''],
      videoSubject: [''],
      videoYoutubelink: [''],
    });

    this.form2 = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.getOemReport();
    this.getZone();
  }

  getType() {
    console.log(this.form.value.type)
    if (this.form.value.type == "text") {
      this.text = true
      this.image = false
      this.video = false
    }

    if (this.form.value.type == "image") {
      this.text = false
      this.image = true
      this.video = false
    }

    if (this.form.value.type == "video") {
      this.text = false
      this.image = false
      this.video = true
    }
  }

  getOemReport() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 30);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.startDate = this.fromDate.toString();
    this.endDate = this.toDate.toString();

    let data = {
      gte: this.startDate + "T00:00:00.000Z",
      lt: this.endDate + "T23:59:59.000Z",
    }

    this.accountService.getAllOem(data).subscribe(data => {
      this.oemList = data;
      if (this.oemList.message == "No data found") {
        this.oemListData = this.oemList;
      } else {
        this.oemListData = this.oemList.data;
        this.oemListData =  _.sortBy(this.oemListData, (o) => moment["default"](o.createdAt)).reverse()
        this.getFilter(this.oemListData);
        this.oemListData = this.oemListData.map(item => {
          this.readDataCount.map(res => {
            if (item._id == res.id) {
              item.deliveredData = res.deliveredData;
              item.readData = res.readData;
              item.interestedData = res.interestedData;
              item.notInterestedData = res.notInterestedData;
              item.callBackData = res.callBackData;
            }
          });
          return item;
        });
        console.log("oemListData=", this.oemListData);
      }
    },
      error => {
        this.toastr.error(error);
      })
  }

  getFilter(oemList: any) {
    this.readDataCount = oemList.map(item => {
      var deliveredData = [];
      var readData = [];
      var interestedData = [];
      var notInterestedData = [];
      var callBackData = [];
      item.targetUsers.filter(i => {
        if (i.userStatus === "delivered" || i.userStatus === "read" || i.userStatus === "responded") {
          deliveredData.push(i);
        }
        if (i.userStatus === "read" || i.userStatus === "responded") {
          readData.push(i);
        }
        if (i.userStatus === "responded") {
          if (i.response === "interested") {
            interestedData.push(i);
          } else if (i.response === "notinterested") {
            notInterestedData.push(i);
          } else {
            callBackData.push(i);
          }
        }
      });
      var resData = {
        id: item._id,
        deliveredData: deliveredData,
        readData: readData,
        interestedData: interestedData,
        notInterestedData: notInterestedData,
        callBackData: callBackData
      };
      return resData;
    });
    // console.clear();
    // console.log(this.readDataCount);
  }

  detailPage(type, detailData) {
    console.log("type", type);
    if (type === "delivered") {
      this.router.navigateByUrl(`/oem/detail/${type}`);
      sessionStorage.setItem('deliveredDataList', JSON.stringify(detailData));
    } else if (type === "read") {
      this.router.navigateByUrl(`/oem/detail/${type}`);
      sessionStorage.setItem('readDataList', JSON.stringify(detailData));
    } else if (type === "interested") {
      this.router.navigateByUrl(`/oem/detail/${type}`);
      sessionStorage.setItem('interestedDataList', JSON.stringify(detailData));
    } else if (type === "notinterested") {
      this.router.navigateByUrl(`/oem/detail/${type}`);
      sessionStorage.setItem('notInterestedDataList', JSON.stringify(detailData));
    } else if (type === "callback") {
      this.router.navigateByUrl(`/oem/detail/${type}`);
      sessionStorage.setItem('callBackList', JSON.stringify(detailData));
    }
  }

  dateWiseFilter() {
    if (this.form2.invalid) {
      return;
    }
    else {
      this.oemListData = [];
      let data = {
        gte: this.form2.value.startDate + "T00:00:00.000Z",
        lt: this.form2.value.endDate + "T23:59:59.000Z",
      }
      this.accountService.getAllOem(data).subscribe(data => {
        this.oemList = data;
        if (this.oemList.message == "No data found") {
          this.oemListData = this.oemList;
          this.toastr.error("No data found in date filter range.");
        } else {
          this.oemListData = this.oemList.data;
          this.getFilter(this.oemListData);
          this.oemListData = this.oemListData.map(item => {
            this.readDataCount.map(res => {
              if (item._id == res.id) {
                item.deliveredData = res.deliveredData;
                item.readData = res.readData;
                item.interestedData = res.interestedData;
                item.notInterestedData = res.notInterestedData;
                item.callBackData = res.callBackData;
              }
            });
            return item;
          });
          console.log("oemListData=", this.oemListData);
        }
      },
        error => {
          this.toastr.error(error);
        })
    }
  }

  onFileSelect1(event) {
    this.imageFile = [];
    var files = event.target.files;
    if (files.length <= 3) {
      for (let i = 0; i < files.length; i++) {
        this.imageFile.push(files[i]);
      }
      console.log(this.imageFile);
    } else {
      this.imageFile = [];
      this.imageFile = files;
      this.toastr.error("Maximum 3 files allowed !!!");
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.loading = true;
    if (this.form.value.type == "") {
      this.toastr.error("Select type first.");
    }
    if (this.form.value.type == "text") {
      let formData: FormData = new FormData();
      formData.append('title', this.form.value.title);
      formData.append('validyDate', this.form.value.validityDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z");
      formData.append('description', this.form.value.description);
      formData.append('audienceType', this.form.value.audienceType);
      formData.append('zone', this.form.value.userZone);
      formData.append('state', this.form.value.userState);
      console.log("formData ==", formData);
      this.accountService.createOem(formData)
        .subscribe(
          files => {
            this.uploadStatus = files;
            this.loading = false;
            if (this.uploadStatus.status == true) {
              this.closeButton.nativeElement.click();
              console.log('SubmitData', this.uploadStatus);
              this.getOemReport();
              this.form.reset();
              this.toastr.success("Text add successfully.");
              window.location.reload()
            } else {
              this.closeButton.nativeElement.click();
              this.toastr.error("Somthing went wrong !!!");
              this.getOemReport();
            }
          },
          error => {
            this.closeButton.nativeElement.click();
            this.toastr.error(error);
            this.loading = false;
            this.getOemReport();
          }
        )
    }

    if (this.form.value.type == "image") {
      if (this.imageFile.length <= 3) {
        const formData: any = new FormData();
        formData.append("title", this.form.value.title);
        formData.append("validyDate", this.form.value.validityDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z");
        formData.append("description", this.form.value.description);
        formData.append("audienceType", this.form.value.audienceType);
        for (let i = 0; i < this.imageFile.length; i++) {
          formData.append('images', this.imageFile[i]);
        }
        formData.append('zone', this.form.value.userZone);
        formData.append('state', this.form.value.userState);
        console.log(this.form.value.images);

        this.accountService.createOem(formData).subscribe(
          files => {
            console.log('SubmitData', files);
            this.loading = false;
            this.uploadStatus = files;
            if (this.uploadStatus.status == true) {
              this.closeButton.nativeElement.click();
              console.log('SubmitData', this.uploadStatus);
              this.getOemReport();
              this.form.reset();
              this.toastr.success("Image add successfully.");
              window.location.reload()
            } else {
              this.closeButton.nativeElement.click();
              this.toastr.error("Somthing went wrong !!!");
              this.getOemReport();
            }
          },
          error => {
            this.closeButton.nativeElement.click();
            this.toastr.error(error);
            this.loading = false;
            this.getOemReport();
          }
        )
      } else {
        this.toastr.error("Maximum 3 files allowed !!!");
      }
    }

    if (this.form.value.type == "video") {
      const formData: any = new FormData();
      formData.append("title", this.form.value.title);
      formData.append("validyDate", this.form.value.validityDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z");
      formData.append("audienceType", this.form.value.audienceType);
      formData.append("videoLink", this.form.value.videoYoutubelink);
      formData.append("videoSubject", this.form.value.videoSubject);
      formData.append('zone', this.form.value.userZone);
      formData.append('state', this.form.value.userState);
      console.log("formData ==", formData);
      this.accountService.createOem(formData).subscribe(
        files => {
          console.log('SubmitData', files);
          this.uploadStatus = files;
          this.loading = false;
          if (this.uploadStatus.status == true) {
            this.closeButton.nativeElement.click();
            this.getOemReport();
            this.form.reset();
            this.toastr.success("Video add successfully.");
            window.location.reload()
          } else {
            this.closeButton.nativeElement.click();
            this.toastr.error("Somthing went wrong !!!");
            this.getOemReport();
          }
        },
        error => {
          this.closeButton.nativeElement.click();
          this.toastr.error(error);
          this.loading = false;
          this.getOemReport();
        }
      )
    }

  }

  getZone() {
    this.usermanagementService.getZone("india")
      .subscribe(zone => {
        this.zone = zone;
        this.zone = this.zone.docs;
      });
  }

  getSubZone() {
    const market = "india";
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
    const market = "india";
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


  getDetails(oem) {
    this.dTitle = oem.title
    this.dValidyDate = oem.validyDate
    this.dCreatedAt = oem.createdAt
    this.dCreatedBy = oem.createdBy
    this.dZone = oem.zone
    this.dState = oem.state
    this.dDescription = oem.description
    this.dStatus = oem.status
    this.dImages = oem.images
    this.dVideoLink = oem.videoLink

    if (this.dImages.length != 0) {
      this.dType = "image";
    } else if (this.dVideoLink != undefined) {
      this.dType = "video";
      this.youtubeID = this.dVideoLink.split("https://youtu.be/").splice("1")
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + this.youtubeID);
    } else {
      this.dType = "text";
    }
  }

  clearDetailData() {
    this.safeSrc = " ";
  }
}
