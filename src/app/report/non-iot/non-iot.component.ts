import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-non-iot',
  templateUrl: './non-iot.component.html',
  styleUrls: ['./non-iot.component.less']
})
export class NonIotComponent implements OnInit {
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  myInputVariable: ElementRef;
  filesToUpload: Array<File> = [];
  nonIotCount: any;
  file: File;
  itemsPerPage = 50;
  currentFile: File;
  date = new Date();
  loading = false;
  searchText;
  p: number = 1;
  pinNo = environment.labelpinno;
  status: any;
  arrayBuffer: any;
  workbook: any;
  sheets: any;
  sheet_names: any;
  sheet_name: string;
  sheetNameCount: number;

  constructor(
    private accountService: AccountService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.createUserLOgs();
    this.getNonIot();

    this.fileUploadForm = this.formBuilder.group({
      myfile: ['']
    });

  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "DASHBOARD",
      "function": "NONIOT",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      // console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  getNonIot() {
    this.accountService.getNonIotReport()
      .subscribe(data => {
        this.nonIotCount = data
        this.nonIotCount = this.nonIotCount.docs
        // console.log("nonIotCount", this.nonIotCount)
      });
  }


  public downloadDemoFile() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '../../../assets/files/nonIot.xlsx');
    link.setAttribute('download', `nonIot.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  onFileSelect(event) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // console.log(file);

      if (!_.includes(af, file.type)) {
        alert('Only EXCEL Docs Allowed!');
      } else {
        this.fileInputLabel = file.name;
        this.fileUploadForm.get('myfile').setValue(file);
      }
    }
  }


  onFormSubmit() {

    if (!this.fileUploadForm.get('myfile').value) {
      alert('Please fill valid details!');
      return false;
    }

    const formData = new FormData();
    formData.append('file', this.fileUploadForm.get('myfile').value);
    
    var headers_object = new HttpHeaders({ 'companyID': environment.companyID });
    const httpOptions = { headers: headers_object };
    this.http
      .post<any>(`${environment.apiUrl}/noniot/noniotExcelData`, formData, httpOptions).subscribe(response => {
        // console.log("response ===", response);
        if (response.status == 200) {
          // Reset the file input
          this.toastr.success('File uploaded successfully');
          this.getNonIot();
          this.uploadFileInput.nativeElement.value = "";
          this.fileInputLabel = undefined;
        }
        else if(response.status == 400) {
          this.toastr.error('The pinno should be unique. !!!');
        } 
        else
        {
          this.toastr.error('Somthing went wrong !!!');
        }
      }, error => {
        // console.log("error is ==", error);
        this.toastr.error('Somthing went wrong !!!');
      });
  }
}
