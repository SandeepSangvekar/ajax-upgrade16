import { Component, OnInit, AfterViewInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, AlertService } from '@app/_services';
import { MapLoaderService } from "./map.loader";
import { JsonPipe } from '@angular/common';
import * as moment from 'moment';
import { AuthService } from '@app/_services/auth.service';
import { ToastrService } from 'ngx-toastr';
declare var google: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  location = null;
  searchText:string;
  form: FormGroup;
  date = new Date();
  itemsPerPage = 50;
  submitted = false;
  formdata: any;
  addMasterData: any;
  map: any;
  drawingManager: any;
  deleteCredential: any;
  polygon: any;
  locationValue: any;
  newdata: string;
  parsobj: any;
  lanNewValue: any[];
  polygonMAP: any;
  polygonMsg: string = '';
  showPolygon: any;
  p: number = 1;
  areaDetails = { fieldName: '', companyID: '', maxIdealTime: '' };
  deletePoi: any;
  locationDocs: any;
  locationDetails: any;
  constructor(
    private accountService: AccountService, 
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService
    ) {
    this.auth.authFunction(window.location.pathname);
  }

  ngAfterViewInit() {
    MapLoaderService.load().then(() => {
      this.drawPolygon();
    });
  }

  drawPolygon() {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 12.9716, lng: 77.5946 },
      zoom: 8
    });

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ["polygon"]
      }
    });

    this.drawingManager.setMap(this.map);
    google.maps.event.addListener(
      this.drawingManager,
      "overlaycomplete",
      event => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          // alert(event.overlay.getPath().getArray());
          this.locationValue = event.overlay.getPath().getArray();
          this.newdata = JSON.stringify(this.locationValue)
          this.parsobj = JSON.parse(this.newdata)
          var latlangValue = [];
          for (var i = 0; i < this.parsobj.length; i++) {
            latlangValue.push({
              lat: parseFloat(this.parsobj[i].lat),
              lng: parseFloat(this.parsobj[i].lng)
            })
          }
          return this.polygonMAP = latlangValue;
        }
      }
    );
  }

  ngOnInit() {
    this.checkAgreement();
  }

  createUserLOgs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "MASTER",
      "function": "LOCATION",
      "type": "web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {
      console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  checkAgreement(){
    if(JSON.parse(localStorage.getItem('user')).role =='customer' || JSON.parse(localStorage.getItem('user')).role == 'dealer')
    {
      if(JSON.parse(localStorage.getItem('user')).agreementSignedOn == null)
      {
        this.accountService.logout();
      } else {
  this.helperFunction();
      }
    }
    else
    {
      this.helperFunction();
    }
  }
  clear(){
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 12.9716, lng: 77.5946 },
      zoom: 8
    });

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ["polygon"]
      }
    });

    this.drawingManager.setMap(this.map);
    google.maps.event.addListener(
      this.drawingManager,
      "overlaycomplete",
      event => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          // alert(event.overlay.getPath().getArray());
          this.locationValue = event.overlay.getPath().getArray();
          this.newdata = JSON.stringify(this.locationValue)
          this.parsobj = JSON.parse(this.newdata)
          var latlangValue = [];
          for (var i = 0; i < this.parsobj.length; i++) {
            latlangValue.push({
              lat: parseFloat(this.parsobj[i].lat),
              lng: parseFloat(this.parsobj[i].lng)
            })
          }
          return this.polygonMAP = latlangValue;
        }
      }
    );
  this.form.controls['fieldName'].setValue('');
  }
  helperFunction(){
    this.getAllLocatin()
    this.form = this.formBuilder.group({
      fieldName: ['', Validators.required],
      location: ['', Validators.required],
      maxIdealTime: ['', Validators.required,],
      // overlayType: ['', Validators.required],
      // stateCode: ['', Validators.required]
      createdBy:[''],
    });
  }
  get f() { return this.form.controls; }

  getAllLocatin() {
    let params=
    {
      "useType":JSON.parse(localStorage.getItem('user')).useType,
    "loginName":JSON.parse(localStorage.getItem('user')).loginName, 
}
    this.accountService.getAllLocation(params)
      .pipe(first())
      .subscribe((location) => {
        this.locationDocs = location
        this.location = this.locationDocs.docs
        console.log(this.location);

        return this.location
      });
  }
  deletePoiRow(id: string) {
    let result = window.confirm("Are you sure you want to delete the record?")
    if (result == true) {
      this.accountService.deletePoiAreaRow(id).subscribe((data) => {
        this.deletePoi = data
        this.toastr.success('Location deleted successfully');
        this.getAllLocatin()
      })
    }
  }

  onSubmit() {
    debugger
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    else {
      if (this.polygonMAP == undefined) {
        alert("Polygon Map undefined!");
        return
      } else {
        this.form.controls['createdBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
        this.formdata = {
          loginName:JSON.parse(localStorage.getItem('user')).loginName,
          fieldName: this.form.value.fieldName,
          radius: 0,
          maxIdealTime: this.form.value.maxIdealTime,
          overlayType: this.form.value.location,
          field: this.polygonMAP,
          locationType: this.form.value.location,
          clientID: "aY6w4GyyR1",
          zoneCode: "central",
          marketCode: "india",
          subzoneCode: "central",
          type: "locationmaster",
          createdBy:this.form.value.createdBy
        }
        this.accountService.addMasterLocation(this.formdata).subscribe((data) => {
          this.addMasterData = data
          var btn = document.getElementById('addModelClosebtn');
          btn.click();
          if (this.addMasterData.status == 'success') {
            this.toastr.success("Location added successfully");
            this.getAllLocatin();
          } else
           {
            this.toastr.error("Location is already created");
            var btn = document.getElementById('addModelClosebtn');
            btn.click();
          }
        })
      }
    }
  }
  viewPolygon(id) {
    debugger
    this.locationDetails = {};
    this.accountService.getLocationDetails(id)
    .subscribe(result => {

      this.locationDetails = result;
   
    if(this.locationDetails)
    {
      this.areaDetails = {
        fieldName: this.locationDetails.fieldName,
        companyID:this.locationDetails.companyID,
        maxIdealTime:this.locationDetails.maxIdealTime
      }
      this.showPolygon =this.locationDetails.field;
      const map = new google.maps.Map(document.getElementById("maparea"), {
        zoom: 12,
        center: { lat: this.showPolygon[0].lat, lng: this.showPolygon[0].lng },
        mapTypeId: "terrain",
      });
  
      const triangleCoords = this.locationDetails.field;
      const polygonAngles = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      });
      polygonAngles.setMap(map);
    }
  });
  }

}
