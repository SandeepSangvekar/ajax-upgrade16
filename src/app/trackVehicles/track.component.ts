import { Component, Directive, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { first, retry } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { AccountService, AlertService } from '@app/_services';
import { stringify } from '@angular/compiler/src/util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { environment } from '@environments/environment';
import { ToastrService } from "ngx-toastr";
declare var google: any;

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  today = new Date();
  track = null;
  p: number = 1;
  searchText;
  timeBetween: any;
  isChecked;
  v1: any;
  v2: any;
  startDate: any;
  endDate: any;
  trackdocs: any;
  form: FormGroup;
  isAddMode: boolean;
  submitted: boolean;
  sliderValue: any = 0;
  fromDate: string;
  toDate: string;
  zoom: number = 4;
  date = new Date();
  pinNo = environment.labelpinno;
  devicedata = [];
  isNClick = true;
  mapObject: any;
  parsobj: any;
  parsobj2:any;
  coordinatedata: any;
  // coordinatedata2: any;
  itemsPerPage = 50;
  opacity: number = 1;
  lastLocation: any;
  lastLocationlat: { lat: any; lng: any; };
  lastLocationlng: any;
  filterpath: any;
  path: any;
  messages: any;
  length: any;
  maplat: any;
  maplng: any;
  public pinnumber: any;
  viewType: any = 'hybrid';
  selectedRow: Number;
  setClickedRow: Function;
  endMark = "./../../assets/img/images-removebg-preview.svg";
  mappathIcon = "./../../assets/img/map-marker-hi.svg";
  startMarker = "./../../assets/img/startMarker.svg";
  markerPath;
  start_end_mark = [];
  start_marker: any
  end_marker: any;
  enhr: any;
  tdist: any;
  batchFilter: any;
  engineData: any;
  engineDatadocs: any;
  EngineOnData: any;
  EngineOnDatadocs: any;
  public EngineData: any;
  oilpressure: any;
  fuelLevel: any;
  fromDate1: any;
  fuelLiters: any;
  coolantTemp: any;
  batteryLevel: any;
  clusterData: any;
  rpm: any;
  hydralicOilFilterChoke: any;
  parkingSwitch: any;
  devicePublishTime: any;
  checkModel :any
  dateDiff: any;
  status: any;
  address: any;
  locationInfo: any;
  lat: any;
  lng: any;
  lastlocationlength: number;
  clickType: any;
  parseObjDocs: any;
  params: { loginName: any; module: string; function: string; type: string; };
  days: number;
  alertData: { gte: string; lt: string; pinno: any; };
  fromDt: any;
  toDt: any;
  mappinno: any;
  engineLastOnToDate: any;
  engineLastOnFromDate: any;
  enginLastOn: any;
  EngineOffData: any;
  EngineOffDatadocs: any;
  engineStatus: any;
  tBetween: { gte: any; lt: any; };
  fuelPer: any;
  loader: boolean;
  loading: boolean
  milLamp: string;
  systemLamp: any;
  engineExhaustTemp: any;
  dpfLamp: any;
  waterInFuel: string;
  mNumber: any;
  lastLocPinNo: any;
  lastLocdeviceModel: any;
  lastLocdeviceTime: any;
  mapIconInd: any;
  inActive = false;
  bannerData: any;
  
center: google.maps.LatLngLiteral = { lat: 20.5937, lng: 78.9629 };
  coordinatedata2: any[] = [];
  maplat2 = 0;
  maplng2 = 0;
  @ViewChild('mapModal') mapModal!: ElementRef;
  // @ViewChild('mapContainer') mapContainer!: ElementRef;

  
  private map: any;
  private directionsService: any;
  private directionsRenderer: any;
  private infoWindow: any;

  locationPoints = [
    { lat: 28.627600, lng: 77.368800, name: 'Sector 62', description: 'Main road, Sector 62 Noida' },
    { lat: 28.626400, lng: 77.368300, name: 'Building 1', description: 'Near Stellar IT Park' },
    { lat: 28.624000, lng: 77.373300, name: 'Sector 59', description: 'Sector 59 Metro Station' },
    { lat: 28.622800, lng: 77.375800, name: 'Building 3', description: 'Near Fortis Hospital' },
    { lat: 28.621600, lng: 77.378200, name: 'Building 4', description: 'Near C-Block Road' },
    { lat: 28.620400, lng: 77.380700, name: 'Building 5', description: 'Close to Adobe Noida' },
    { lat: 28.619200, lng: 77.383100, name: 'Road Junction', description: 'Road intersection' },
    { lat: 28.618000, lng: 77.385500, name: 'Corporate Park', description: 'Office complex' },
  ];

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.setClickedRow = function (index) {
      this.selectedRow = index;
    }
  }

  ngOnInit() {
    this.filterDate();
    this.checkAgreement();
    this.getBannerData();
  }

  checkAgreement() {

    if (JSON.parse(localStorage.getItem('user')).role == 'customer' || JSON.parse(localStorage.getItem('user')).role == 'dealer') {
      if (JSON.parse(localStorage.getItem('user')).agreementSignedOn == null) {
        this.accountService.logout();
      } else {
        this.helperFunction();
      }
    }
    else {
      this.helperFunction();
    }
  }

  helperFunction() {
    this.testGetAddress();
    this.getRecord();
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  testGetAddress() {
    console.log("Address")
    this.accountService.getLocationFromlatlang().subscribe((data) => {
      console.log("Address")
      console.log(data)
    })
  }

  filterDate() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);
    this.fromDate = this.datePipe.transform(this.today, "yyyy-MM-dd");
    this.toDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  }

  getRecord() {
    this.startDate = this.fromDate + "T00:00:00.000Z";
    this.startDate = this.startDate.toString();

    this.endDate = this.toDate + "T23:59:00.000Z";
    this.endDate = this.endDate.toString();

    this.timeBetween = {
      gte: this.startDate,
      lt: this.endDate,
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getTrack(this.timeBetween).subscribe((track) => {
      this.track = track
      this.trackdocs = this.track.docs
      this.trackdocs = this.trackdocs.sort((b, a) => a.createdAt - b.createdAt)
      // this.trackdocs.lastDataReceivedAt = this.trackdocs.lastDataReceivedAt.slice(0, 2) + "/" + this.trackdocs.lastDataReceivedAt.slice(2,4) + "/" + this.trackdocs.lastDataReceivedAt.slice(4,6);
      this.trackdocs.forEach(element => {
        if (element.vehicleNumber == "") {
          element.vehicleNumber == element.pinno;
        }
      });
      this.trackdocs.forEach(element1 => {
        if (element1.type == "dvmapb") {
          this.devicedata.push(
            {
              pinno: element1.pinno,
              type: element1.type
            }
          );
        }
        if (element1.type == "bs4") {
          this.devicedata.push(
            {
              pinno: element1.pinno,
              type: element1.type
            }
          );
          console.log("devicedata====", this.devicedata);
        }
      });
      console.log(this.timeBetween)
      console.log(this.trackdocs)
      if (this.trackdocs == undefined) {
        this.toastr.error("No Record Found Between " + this.datePipe.transform(this.today, 'yyyy-MM-dd') + " To " + this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
      }
    })
  }

  calculateDiff(dateSent) {

    let currentDate = new Date(this.form.value.endDate);
    dateSent = new Date(dateSent);

    this.days = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }
  onSubmit() {

    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T23:59:59.000Z",
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getTrack(this.timeBetween).subscribe((track) => {
      this.track = track
      this.trackdocs = this.track.docs
      console.log(this.timeBetween)
      // console.log(this.trackdocs.createdAt);
      this.trackdocs = this.trackdocs.sort((b, a) => a.createdAt - b.createdAt);
      console.log(this.trackdocs);

      if (this.trackdocs == undefined) {
        this.toastr.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
      }
    })
  }

  mapDate(pinno, f1, ind) {
    this.loading = true;
    this.mapIconInd = ind;
    this.calculateDiff(this.form.value.startDate);
    if (this.days <= 2) {
      this.clickType = f1;
      this.mapObject = {
        gte: this.form.value.startDate + "T00:00:00.000Z",
        lt: this.form.value.endDate + "T23:59:59.000Z",
        pinno: pinno
      }
      this.createUserLogs();
      this.mappinno = this.mapObject.pinno;
      this.accountService.getTrackByCompanyID(this.mapObject).subscribe((data) => {
        this.parsobj = data
        console.log("getAllTrackBy =", this.parsobj);
        if (this.parsobj.status == 'Device has empty data') {
          this.toastr.error(this.parsobj.status);
          this.loading = false;
        } else {
          this.length = this.parsobj.docs.length;
          this.coordinatedata = this.parsobj.docs;
          this.coordinatedata = _.sortBy(this.parsobj.docs, (o) => moment["default"](o.createdAt)).reverse();
          // console.log(this.coordinatedata);
          this.fromDt = this.form.value.startDate;
          this.toDt = this.form.value.endDate;
          const buttonModal = document.getElementById("vehicleLocationModalopen");
          buttonModal.click();
          var latlangValue = [];
          for (var i = 0; i < this.length; i += 1) {
            if (this.coordinatedata[i].lat1 == undefined) {
              var latVar = parseFloat(this.coordinatedata[i].lat);
            } else {
              var latVar = parseFloat(this.coordinatedata[i].lat1);
            }

            if (this.coordinatedata[i].lng1 == undefined) {
              var lngVar = parseFloat(this.coordinatedata[i].lng);
            } else {
              var lngVar = parseFloat(this.coordinatedata[i].lng1);
            }
            latlangValue.push({
              lat: latVar,
              lng: lngVar,
              // lat1: parseFloat(this.coordinatedata[i].lat1),
              // lng1: parseFloat(this.coordinatedata[i].lng1),
              time: this.coordinatedata[i].devicePublishTime,
              pinno: this.coordinatedata[i].pinno,
              deviceModel: this.coordinatedata[i].deviceModel,
              engineStatus: this.coordinatedata[i].engineStatus,
              rangedistance: this.coordinatedata[i].extras[0].distance,
              travelspeed: this.coordinatedata[i].extras[0].travelSpeed,
            })
          }

          // var result = _.uniqWith(latlangValue, (a, b) => _.isEqual(a.lat, b.lng));
          this.maplat = latlangValue[0].lat;
          this.maplng = latlangValue[0].lng;
          console.log(latlangValue)
          this.coordinatedata = _.uniqWith(latlangValue, _.isEqual);
          this.start_marker = [
            this.coordinatedata[0]
          ];
          this.end_marker = [latlangValue[latlangValue.length - 1]];
          this.loading = false;
          console.log('mapDate start_marker-->',this.start_marker);
          console.log('mapDate end_marker-->',this.end_marker);
        }
      })
    }
    else {
      this.toastr.error("Date range should not exceed 3 days.Please select valid date");
      this.loading = false;
    }
  }
  
  openMapModal(pinno: string, index: number) {
    if (this.loading) return; // optional
    this.loading = true;
    this.mapIconInd = index;
  
    this.calculateDiff(this.form.value.startDate);
    if (this.days > 2) {
      this.toastr.error("Date range should not exceed 3 days. Please select valid date");
      this.loading = false;
      return;
    }
  
    const mapObj = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T23:59:59.000Z",
      pinno: pinno
    };
  
    this.mappinno = pinno;
    this.accountService.getTrackByCompanyID(mapObj).subscribe((data) => {
      this.parsobj2 = data;
  
      if (this.parsobj2.status === 'Device has empty data') {
        this.toastr.error(this.parsobj2.status);
        this.loading = false;
        return;
      }
  
      this.coordinatedata2 = _.sortBy(data.docs, (o) => moment(o.createdAt)).reverse();
  
      this.fromDt = this.form.value.startDate;
      this.toDt = this.form.value.endDate;
  
      const latlangValue = this.coordinatedata2.map((point) => {
        const lat = parseFloat(point.lat1 || point.lat);
        const lng = parseFloat(point.lng1 || point.lng);
        return {
          lat,
          lng,
          time: point.devicePublishTime,
          pinno: point.pinno,
          deviceModel: point.deviceModel,
          engineStatus: point.engineStatus,
          rangedistance: point.extras?.[0]?.distance || 0,
          travelspeed: point.extras?.[0]?.travelSpeed || 0,
        };
      });
  
      this.coordinatedata2 = _.uniqWith(latlangValue, _.isEqual);
      this.maplat2 = this.coordinatedata2[0]?.lat || 0;
      this.maplng2 = this.coordinatedata2[0]?.lng || 0;
      this.start_marker = [latlangValue[0]];
      console.log('this.start_marker-->', this.start_marker );
  
      this.end_marker = [latlangValue[latlangValue.length - 1]];
      console.log('this.end_marker-->', this.end_marker );

      console.log('START TIME:', this.start_marker[0]?.time);
console.log('END TIME:', this.end_marker[0]?.time)
      setTimeout(() => {
        this.showMapModal();
        this.initMap();
        this.plotRouteWithMarkers();
        this.loading = false; 
      }, 300);
    });
  }
  
  showMapModal() {
    console.log('here first show map modal map');
    const modalElement = this.mapModal.nativeElement;
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    modalElement.removeAttribute('aria-hidden');
    modalElement.setAttribute('aria-modal', 'true');
    document.body.classList.add('modal-open');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
  
  closeMapModal() {
    const modalElement = this.mapModal.nativeElement;
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.removeAttribute('aria-modal');
    document.body.classList.remove('modal-open');

    // Remove backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }

  initMap(): void {
    debugger

    console.log('here first initi map modal:::::',this.coordinatedata2);
    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
       center: this.coordinatedata2[0], // dynamic data
            // center: this.coordinatedata2[0],
    }); 

    console.log('here added map',this.map);
    
  
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 4,
      },
      map: this.map
    });
  
    console.log('here mapped changes ',this.directionsRenderer);
    
    this.infoWindow = new google.maps.InfoWindow();
  }
  
  plotRouteWithMarkers(): void {
    const origin = {
      lat: this.coordinatedata2[0].lat,
      lng: this.coordinatedata2[0].lng
    };
  
    const destination = {
      lat: this.coordinatedata2[this.coordinatedata2.length - 1].lat,
      lng: this.coordinatedata2[this.coordinatedata2.length - 1].lng
    };
  
    const maxWaypoints = 23;
    const waypoints = this.coordinatedata2.slice(1, -1)
      .slice(0, maxWaypoints)
      .map(point => ({
        location: { lat: point.lat, lng: point.lng },
        stopover: true
      }));
  
    const request = {
      origin,
      destination,
      waypoints,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    console.log('Request:', request);
  
    this.directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
        this.addMarkers();
      } else {
        console.error("Route failed:", status);
      }
    });
  }
  
  addMarkers(): void {
    console.log('WELCOME IN THE ADD MARKS ');
    console.log('here coordinates data 2', this.coordinatedata2);
  
    // Add start marker
    if (this.start_marker?.length) {
      this.createMarker(this.end_marker[0], '#32a353', 'Start');
    }
  
    // Add end marker
    if (this.end_marker?.length) {
      this.createMarker(this.start_marker[0], '#f9a825', 'End');
    }
  
    // Add main route markers (except start & end)
    this.coordinatedata2.forEach((point, index) => {
      // Skip start/end duplicates if needed
      if (
        (this.start_marker?.[0]?.lat === point.lat && this.start_marker[0]?.lng === point.lng) ||
        (this.end_marker?.[0]?.lat === point.lat && this.end_marker[0]?.lng === point.lng)
      ) return;
  
      this.createMarker(point, '#0000FF', `Point ${index + 1}`);
    });
  }
  
  formatDateTime(input: string): string {
    return this.datePipe.transform(input, 'dd-MM-yyyy hh:mm:ss a', 'UTC') || input;
  }
  
  // createMarker(location: any, color: string, label: string): void {
  //   const isSpecial = label === 'Start' || label === 'End';
  //   const formattedDateTime = this.formatDateTime(location.time);
  
  //   // Unified log with formatted time
  //   console.log(`${label} Point Data:`, {
  //     ...location,
  //     formattedTime: formattedDateTime
  //   });

  //   const marker = new google.maps.Marker({
  //     position: { lat: location.lat, lng: location.lng },
  //     map: this.map,
  //     icon: {
  //       url: this.getMarkerIcon(color),
  //       scaledSize: isSpecial
  //         ? new google.maps.Size(35, 35) // Larger size for Start/End
  //         : new google.maps.Size(25, 25) // Normal size for route markers
  //     },
  //     title: label,
  //     label: isSpecial ? {
  //       text: label,
  //       // color: color === '#00FF00' ? 'green' : color === '#FFFF00' ? '#ffee00' : 'black',
  //       color: color === '#32a353' ? 'green' : color === '#f9a825' ? '#ffee00' : 'black', // 🟩 Start → green, 🟨 End → orange/yellow
  //       fontWeight: 'bold',
  //       fontSize: '12px'
  //     } : undefined,
  //     animation: isSpecial ? google.maps.Animation.BOUNCE : null,
  //     // draggable: isSpecial ? true : false  // <-- Make Start/End markers draggable
  //     draggable: !isSpecial
  //   });
    
  //   const formatNumber = (v: number) =>
  //     v != null && !isNaN(v)
  //       ? new Intl.NumberFormat('en-IN', {
  //           minimumFractionDigits: 2,
  //           maximumFractionDigits: 4
  //         }).format(v)
  //       : '';
        
  //   const infoContent = `
  //     <div class="map-info-window" style="font-size: 13px; line-height: 1.5;">
  //       <div style="display: flex; align-items: center; margin-bottom: 5px;">
  //         <span style="height: 12px; width: 12px; border-radius: 50%; background-color: ${
  //           label === 'Start' ? 'green' :
  //           label === 'End' ? '#ffee00' : 'blue'
  //         }; display: inline-block; margin-right: 5px;"></span>
  //         <strong style="font-weight: 500;">${label}</strong>
  //       </div>
  //       <strong>Pin No.:</strong> ${location.pinno}<br/>
  //       <strong>Device Model:</strong> ${location.deviceModel}<br/>
  //       <strong>Date Time:</strong> ${formattedDateTime}<br/>
  //       <strong>Lat:</strong> ${location.lat}<br/>
  //       <strong>Lng:</strong> ${location.lng}<br/>
  //       <strong>Engine Status:</strong> ${location.engineStatus || ''}<br/>
  //       <strong>Distance (kms):</strong> ${formatNumber(location.rangedistance)}<br/>
  //       <strong>Speed:</strong> ${location.travelspeed || ''}
  //     </div>
  //   `;

  //   marker.addListener('click', () => {
  //     this.infoWindow.setContent(infoContent);
  //     this.infoWindow.open(this.map, marker);
  //   });
  // }

  createMarker(location: any, color: string, label: string): void {
    const isSpecial = label === 'Start' || label === 'End';
    const isStart = label === 'Start';
    const isEnd = label === 'End';
  
    const formattedDateTime = this.formatDateTime(location.time);
  
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: this.map,
      icon: {
        url: this.getMarkerIcon(color),
        scaledSize: isSpecial
          ? new google.maps.Size(35, 35)
          : new google.maps.Size(25, 25)
      },
      title: label,
      label: isSpecial ? {
        text: label,
        color: isStart ? 'green' : isEnd ? '#ffee00' : 'black',
        fontWeight: 'bold',
        fontSize: '12px'
      } : undefined,
      animation: isSpecial ? google.maps.Animation.BOUNCE : null,
      draggable: !isSpecial
    });
  
    const formatNumber = (v: number) =>
      v != null && !isNaN(v)
        ? new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
          }).format(v)
        : '';
  
    // Build info window content
    let infoContent = `
      <div class="map-info-window" style="font-size: 13px; line-height: 1.5;">
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <span style="height: 12px; width: 12px; border-radius: 50%; background-color: ${
            isStart ? 'green' : isEnd ? '#ffee00' : 'blue'
          }; display: inline-block; margin-right: 5px;"></span>
          <strong style="font-weight: 500;">${label}</strong>
        </div>
        <strong>Pin No.:</strong> ${location.pinno}<br/>
        <strong>Device Model:</strong> ${location.deviceModel}<br/>
        <strong>Date Time:</strong> ${formattedDateTime}<br/>
        <strong>Lat:</strong> ${location.lat}<br/>
        <strong>Lng:</strong> ${location.lng}<br/>
        <strong>Engine Status:</strong> ${location.engineStatus || ''}<br/>`;
  
    // ➕ Only include distance and speed for End or other markers
    if (!isStart) {
      infoContent += `
        <strong>Distance (kms):</strong> ${formatNumber(location.rangedistance)}<br/>
        <strong>Speed:</strong> ${location.travelspeed || ''}<br/>`;
    }
  
    infoContent += `</div>`;
  
    marker.addListener('click', () => {
      this.infoWindow.setContent(infoContent);
      this.infoWindow.open(this.map, marker);
    });
  }
  
  // getMarkerIcon(color: string): string {
  //   switch (color) {
  //     case '#32a353': return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'; // Start
  //     case '#f9a825': return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'; // End
  //     case '#FF0000': return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'; // Unused now
  //     default: return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'; // Route
  //   }
  // }

  getMarkerIcon(color: string): string {
    switch (color) {
      case '#32a353': return 'assets/img/start-marker.png'; // Start
      case '#f9a825': return 'assets/img/end-marker.png'; // End
      case '#FF0000': return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'; // Unused now
      default: return 'assets/img/route-marker.png'; // Route
    }
  }

  // getMarkerIcon(color: string): string {
  //   switch (color) {
  //     case '#32a353':
  //       return 'assets/img/start-marker.svg'; // Start
  //     case '#f9a825':
  //       return 'assets/img/end-marker.svg'; // End
  //     default:
  //       return 'assets/img/route-marker.png'; // Route/others
  //   }
  // }
  
  // added new map code
  alldevicesRecords(event: any) {
    if (event) {
      this.mapObject = {
        gte: this.form.value.startDate + "T00:00:00.000Z",
        lt: this.form.value.endDate + "T23:59:59.000Z",
        pinno: this.pinnumber
      }
      this.accountService.getAllTrackByCompanyID(this.mapObject).subscribe((data) => {
        this.parsobj = data
        if (this.parsobj.status == 'Device has empty data') {
          this.toastr.error(this.parsobj.status);
        } else {
          this.length = this.parsobj.docs.length
          this.coordinatedata = this.parsobj.docs
          this.coordinatedata = _.sortBy(this.parsobj.docs, (o) => moment["default"](o.createdAt)).reverse();
          // console.log(this.coordinatedata);

          const buttonModal = document.getElementById("vehicleLocationModalopen");
          buttonModal.click();
          var latlangValue = [];
          for (var i = 0; i < this.length; i += 1) {
            latlangValue.push({
              lat: parseFloat(this.coordinatedata[i].lat),
              lng: parseFloat(this.coordinatedata[i].lng),
              time: this.coordinatedata[i].devicePublishTime,
              pinno: this.coordinatedata[i].pinno,
              deviceModel: this.coordinatedata[i].deviceModel,
              engineStatus: this.coordinatedata[i].engineStatus,
              rangedistance: this.coordinatedata[i].rangedistance,
            })
          }
          // var result = _.uniqWith(latlangValue, (a, b) => _.isEqual(a.lat, b.lng));
          this.maplat = latlangValue[0].lat;
          this.maplng = latlangValue[0].lng;
          console.log(latlangValue)
          this.coordinatedata = _.uniqWith(latlangValue, _.isEqual);;
          // var a = _.uniqWith(latlangValue, _.isEqual);
          // console.log(this.coordinatedata);

          // var result = _.uniqWith(latlangValue, (a, b) => _.isEqual(a.lat, b.lng));
          // console.log(JSON.parse(JSON.stringify({...result}).replace(/},/g, '},\n ')))


          this.start_marker = [
            this.coordinatedata[0]
          ];
          this.end_marker = [latlangValue[latlangValue.length - 1]];

          console.log(this.start_marker)
          console.log(this.end_marker)

        }
      })
    }
    else {
      // this.inActive = false;
      // this.getMachineData();
    }
  }
  trackVehicleLastLocation(pinno, var2) {
    this.parsobj = [];
    this.parseObjDocs = [];
    this.coordinatedata = [];
    this.mapObject = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T23:59:59.000Z",
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getTrack(this.mapObject).subscribe((data) => {
      this.parsobj = data
      this.parseObjDocs = this.parsobj.docs;
      if (this.parsobj.status == 'Device has empty data') {
        this.toastr.error(this.parsobj.status);
        this.address = '';
      }
      else {
        this.length = this.parseObjDocs.length
        this.parseObjDocs = _.sortBy(this.parseObjDocs, (o) => moment["default"](o.createdDate)).reverse();

        if (var2) {
          const buttonModal = document.getElementById("vehicleLastLocationModalopen")
          buttonModal.click()
        }


        var latlangValue = [];
        for (var i = 0; i < this.length; i++) {

          latlangValue.push({
            pinno: this.parseObjDocs[i].pinno,
            deviceModel: this.parseObjDocs[i].deviceModel,
            time: this.parseObjDocs[i].lastDataReceivedAt,
            lat: parseFloat(this.parseObjDocs[i].lat),
            lng: parseFloat(this.parseObjDocs[i].lng),
          })

        }

        this.coordinatedata = latlangValue
        this.coordinatedata.forEach(element => {
          if (element.pinno == pinno) {
            this.lastLocPinNo = element.pinno
            this.lastLocdeviceModel = element.deviceModel
            this.lastLocdeviceTime = element.time
            this.lastLocationlat = element.lat,
              this.lastLocationlng = element.lng
            // 
          }
        });
        this.getOpenStreetmapData();
        // this.lastLocationlat = this.coordinatedata[0].lat;
        // this.lastLocationlng = this.coordinatedata[0].lng;        
      }
    })
  }
  getOpenStreetmapData() {
    // this.mapData
    this.locationInfo = [];
    const lat = this.lastLocationlat;
    const lon = this.lastLocationlng;
    const appURL = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + lat + "&lon=" + lon;
    //const appURL = "https://nominatim.openstreetmap.org/reverse?format=geojson&lat="+lat+"&lon="+lon;
    this.accountService.getLocationInfo(appURL).subscribe((res) => {
      this.locationInfo = res;
      this.address = this.locationInfo.display_name;
    });
  }

  onNavigate(pinno, deviceModel, totalEngineHours, type) {
    this.calculateDiff(this.form.value.startDate);
    if (this.days <= 2) {
      this.tBetween = {
        gte: this.form.value.startDate,
        lt: this.form.value.endDate
      }
      this.createUserLogs();
      sessionStorage.setItem('dateTimeRange', JSON.stringify(this.tBetween));
      this.router.navigateByUrl(`/details/${pinno}`);
      sessionStorage.setItem('deviceData', JSON.stringify(this.devicedata));
      sessionStorage.setItem('deviceModel', JSON.stringify(deviceModel));
      sessionStorage.setItem('totalEngineHours', JSON.stringify(totalEngineHours));
      sessionStorage.setItem('deviceType', JSON.stringify(type));
    }
    else {
      this.toastr.error("Date range should not exceed 2 days. Please select valid date");
    }
  }

  onEngineLastOnNavigate(engineLastON, pinno, deviceModel, totalEngineHours,type) {
    var today = engineLastON.slice(0,10)
    today = new Date(today);
    today.setDate(today.getDate() - 1);
    var fromDate = this.datePipe.transform(today, "yyyy-MM-dd");
    this.engineLastOnFromDate = fromDate
    this.engineLastOnToDate = this.datePipe.transform(engineLastON, "yyyy-MM-dd")

    this.tBetween = {
      gte: this.engineLastOnFromDate,
      lt: this.engineLastOnToDate
    }
    sessionStorage.setItem('dateTimeRange', JSON.stringify(this.tBetween));
    this.router.navigateByUrl(`/details/${pinno}`);
    sessionStorage.setItem('deviceData', JSON.stringify(this.devicedata));
    sessionStorage.setItem('deviceModel', JSON.stringify(deviceModel));
    sessionStorage.setItem('totalEngineHours', JSON.stringify(totalEngineHours));
    sessionStorage.setItem('deviceType', JSON.stringify(type));
  }

  createUserLogs() {
    if (this.clickType == 'isPinNo') {
      this.params = {
        "loginName": JSON.parse(localStorage.getItem('user')).loginName,
        "module": "TRACK VEHICLES",
        "function": "MACHINE No. CLICK",
        "type": "web"
      }
    }
    else if (this.clickType == 'isMapPath') {
      this.params = {
        "loginName": JSON.parse(localStorage.getItem('user')).loginName,
        "module": "TRACK VEHICLES",
        "function": "MAP PATH CLICK",
        "type": "web"
      }
    }
    else if (this.clickType == 'isMeter') {
      this.params = {
        "loginName": JSON.parse(localStorage.getItem('user')).loginName,
        "module": "TRACK VEHICLES",
        "function": "GAUGE METER CLICK",
        "type": "web"
      }
    }

    this.accountService.createUserlogs(this.params).subscribe((data) => {
      this.status = data['status'];
      console.log("status", this.status);
    },
      error => {
        this.toastr.error(error);
      })
  }

  onSummary(pinno) {
    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T23:59:59.000Z"
    }
    this.tBetween = {
      gte: this.form.value.startDate,
      lt: this.form.value.endDate
    }
    sessionStorage.setItem('dateTimeRange', JSON.stringify(this.tBetween));
    this.router.navigateByUrl(`/track-details/${pinno}`);
  }

  onAlert(pinno) {
    var today = new Date(this.form.value.endDate);
    today.setDate(today.getDate() - 4);
    var fromDate = this.datePipe.transform(today, "yyyy-MM-dd");
    this.alertData = {
      gte: fromDate,
      lt: this.form.value.endDate,
      pinno: pinno,
    }
    sessionStorage.setItem('alertData', JSON.stringify(this.alertData));
    this.router.navigateByUrl(`/analytics/alert`);
    console.log("alert data ===", this.alertData);
  }

  ConvertToInt(val) {
    return parseInt(val);
  }

  meter(enhr, tdist, vnum, pinno, model, engineLastON, f2) {
    this.checkModel = " ";
    this.loader = true;
    
    this.clickType = f2;
    this.enhr = enhr
    this.tdist = tdist
    this.pinnumber = pinno;
    var date1 = new Date(engineLastON);
    var date = date1.getDate();
    var date2 = date1.getDate() - 2;
    var month = 1 + date1.getMonth();
    var year = date1.getFullYear();
    this.engineLastOnToDate = year + "-" + (month <= 9 ? '0' : '') + month + "-" + (date <= 9 ? '0' : '') + date;
    this.engineLastOnFromDate = year + "-" + (month <= 9 ? '0' : '') + month + "-" + (date2 <= 9 ? '0' : '') + date2;
    this.batchFilter = {
      gte: this.engineLastOnFromDate + "T00:00:00.000Z",
      lt: this.engineLastOnToDate + "T23:59:59.000Z",
      pinno: this.pinnumber,
      engineStatus : "ON"
    }
    this.EngineOffDatadocs = [];
    this.EngineOnDatadocs = [];
    this.EngineOffData = [];
    this.EngineOnData = [];
    this.EngineData = "";
    this.oilpressure = "";
    this.fuelLevel = "";
    this.coolantTemp = "";
    this.fuelLiters = "";
    this.fuelPer = "";
    this.batteryLevel = "";
    this.rpm = "";
    this.hydralicOilFilterChoke = "";
    this.parkingSwitch = "";
    this.devicePublishTime = "";
    this.engineStatus = "";
    this.milLamp = " ";
    this.systemLamp = " ";
    this.waterInFuel = "";
    this.engineExhaustTemp = " ";
    this.dpfLamp = " ";
    this.createUserLogs();
    
    // hard coding for model 0514 as asked by AJAX on 25-Nov-2021
    if (model === "ARGO4000" || model === "ARGO2000" || model === "ARGO3500" ||model === "ARGO2300" || pinno === "AF1ARG25PHK000514") {
      this.checkModel = "gauge1"
    }
    else if (model === "ARGO4500" || model === "ARGO2500") {
      this.checkModel = "gauge2"
    }
    else if (model === "ARGO2800" || model === "ARGO4300" || model === "ARGO4800" || model === "ULTRA4") {
      this.checkModel = "gauge3";
      this.mNumber = model 
    }
    else if (model === "ARGO4300BSV") {
      this.checkModel = "gauge4";
      // this.mNumber = model 
    }

    // minus 5 minuts in dateTime
    // var minutesToMinus = 10;
    // var currentDate = new Date();
    // var pDate = new Date(currentDate.getTime() - minutesToMinus * 60000);
    // var pastDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(pDate, 'HH:mm:ss') + ".000Z"
    
    // if (pastDateTime < engineLastON) {
      this.accountService.getLastEngineData(this.batchFilter).subscribe((data) => {
        this.EngineOnData = data;
        this.loader = false;
        console.log("EngineOn Data==", this.EngineOnData)
        this.EngineOnDatadocs = this.EngineOnData.data;
        if (this.EngineOnData.status == true) {
          this.engineStatus = "ON";
          this.EngineData = this.EngineOnDatadocs.extras[0];
          this.oilpressure = this.EngineData.oilpressure;
          this.fuelLevel = this.EngineData.fuelLevel;
          this.fuelPer = this.EngineData.fuelPercentage;
          // this.fuelPer = 100;
          this.coolantTemp = this.EngineData.coolantTemp;
          this.fuelLiters = this.EngineData.fuelInLitres;
          this.batteryLevel = parseFloat(this.EngineData.batteryLevel);
          this.rpm = parseInt(this.EngineData.rpm);
          this.hydralicOilFilterChoke = this.EngineData.hydralicOilFilterChoke;
          this.parkingSwitch = this.EngineData.parkingSwitch;
          this.devicePublishTime = this.EngineOnDatadocs.devicePublishTime;
          this.milLamp = this.EngineOnDatadocs.CanFormdata[2].MalfunctionIndLamp;
          this.systemLamp = this.EngineOnDatadocs.CanFormdata[2].systemLamp;
          this.waterInFuel = this.EngineOnDatadocs.CanFormdata[0].waterinFuelLevel;
          this.engineExhaustTemp = this.EngineData.EngineExhaustTemp;
          this.dpfLamp = this.EngineData.dpfLamp;
        }
        else {
          this.enhr = enhr
          this.tdist = tdist
          this.engineStatus = "OFF";
          this.toastr.error(this.EngineOnData.message);
        }
      })
      // comment else code for showing gauge panel data in ON condition only
    // } else {
    //   this.accountService.getEngineOff(this.batchFilter).subscribe((data) => {
    //     this.EngineOffData = data;
    //     console.log("EngineOff Data==", this.EngineOffData)
    //     this.EngineOffDatadocs = this.EngineOffData.docs;
    //     if (this.EngineOffDatadocs.length) {
    //       this.EngineData = this.EngineOffDatadocs[0].extras[0];
    //       this.oilpressure = this.EngineData.oilpressure;
    //       this.fuelLevel = this.EngineData.fuelLevel;
    //       this.coolantTemp = this.EngineData.coolantTemp;
    //       this.fuelLiters = this.EngineData.fuelInLitres;
    //       this.batteryLevel = parseFloat(this.EngineData.batteryLevel);
    //       this.rpm = parseInt(this.EngineData.rpm);
    //       this.hydralicOilFilterChoke = this.EngineData.hydralicOilFilterChoke;
    //       this.parkingSwitch = this.EngineData.parkingSwitch;
    //       this.devicePublishTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z"
    //       this.engineStatus = "OFF";
    //     }
    //     else {
    //       this.enhr = enhr
    //       this.tdist = tdist
    //       this.engineStatus = "OFF";
    //     }
    //   })
    // }
  }


  gaugeLeft(value) {
    let percentage = 100 - value;
    percentage = (percentage > 90) ? 90 : (percentage < 0) ? 0 : percentage;
    return 'rotate(' + ((0.85 * percentage) + 50) + 'deg)';
  }

  gaugeMiddle(value) {
    let percentage = (value) * 10;
    percentage = (percentage > 50) ? (percentage - 1) : percentage;
    return 'rotate(' + (percentage - 49) + 'deg)';
  }

  gaugeRight(value) {
    let percentage = value;
    percentage = (percentage > 120) ? 120 : (percentage < 40) ? 40 : percentage;
    return 'rotate(' + (percentage - 170) + 'deg)';
  }

  getBannerData() {
    this.inActive = false; // Start loader
    this.bannerData = [];
    this.accountService.getBanner()
      .pipe(first())
      .subscribe((res: any) => {
        if (res?.docs?.length) {
          // Filter only banners for web
          this.bannerData = res.docs.filter((banner: any) => banner.appType === 'web');
          console.log("Banner List:", this.bannerData);
        }else {
          this.toastr.warning("No banner data found.");
        }
        this.inActive = true; // Stop loader in both cases
      },
      error => {
        this.toastr.error(error);
        this.inActive = true;
      });
  }
}
