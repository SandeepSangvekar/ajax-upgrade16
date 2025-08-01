import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  userRecord: any;
  userType: any;
  userMenu: any;
  masters: boolean;
  dashboard: boolean;
  model: boolean;
  reports: boolean;
  variant: boolean;
  machine: boolean;
  device: boolean;
  customer: boolean;
  location: boolean;
  geofence: boolean;
  shipment: boolean;
  serviceMaster: boolean;
  trackvehicles: boolean;
  services: boolean;
  schedules: boolean;
  update: boolean;
  usermanagement: boolean;
  users: boolean;
  dealers: boolean;
  analytics: boolean;
  machineUtilization: boolean;
  serviceReport: boolean;
  qatesting: boolean;
  subscription: boolean;
  noniotMachines: boolean;
  userlogs: boolean;
  roles: boolean;
  refferal: boolean;
  insurance: boolean;
  devicenotmapped: boolean;
  batch: any;
  battery: any;
  fuel: any;
  createondemand: any;
  vehicle: any;
  userProfile : any;

  constructor() { } 
   
  ngOnInit(): void {
    this.getUserroleRecord()
  }   
  getUserroleRecord(){
    this.userRecord = JSON.parse(localStorage.getItem('user'));
    this.userType =  this.userRecord.role.toString();
    this.masters = this.userRecord.roleMenus.masters ? this.userRecord.roleMenus.masters.link : false;
    this.dashboard = this.userRecord.roleMenus.dashboard ? this.userRecord.roleMenus.dashboard.link : false;
    this.services = this.userRecord.roleMenus.services ? this.userRecord.roleMenus.services.link : false;
    this.reports = this.userRecord.roleMenus.reports ? this.userRecord.roleMenus.reports.link : false;
    this.model = this.userRecord.roleMenus.model ? this.userRecord.roleMenus.model.link : false;
    this.machine = this.userRecord.roleMenus.machine ? this.userRecord.roleMenus.machine.link : false;
    this.device = this.userRecord.roleMenus.device ? this.userRecord.roleMenus.device.link : false;
    this.location = this.userRecord.roleMenus.location ? this.userRecord.roleMenus.location.link : false;
    this.schedules = this.userRecord.roleMenus.schedules ? this.userRecord.roleMenus.schedules.link : false;
    this.users = this.userRecord.roleMenus.users ? this.userRecord.roleMenus.users.link : false;
    this.variant = this.userRecord.roleMenus.variant ? this.userRecord.roleMenus.variant.link : false;
    this.customer = this.userRecord.roleMenus.customer ? this.userRecord.roleMenus.customer.link : false;
    this.geofence = this.userRecord.roleMenus.geofence ?  this.userRecord.roleMenus.geofence.link : false;
    this.shipment = this.userRecord.roleMenus.shipment ? this.userRecord.roleMenus.shipment.link : false;
    this.serviceMaster = this.userRecord.roleMenus.service ? this.userRecord.roleMenus.service.link : false;
    this.trackvehicles = this.userRecord.roleMenus.trackvehicles ? this.userRecord.roleMenus.trackvehicles.link : false;
    this.update = this.userRecord.roleMenus.update ? this.userRecord.roleMenus.update.link : false;
    this.usermanagement = this.userRecord.roleMenus.usermanagement ? this.userRecord.roleMenus.usermanagement.link : false;
    this.dealers = this.userRecord.roleMenus.dealers ? this.userRecord.roleMenus.dealers.link : false;
    this.vehicle = this.userRecord.roleMenus.vehicle ? this.userRecord.roleMenus.vehicle.link : false;
    this.analytics= this.userRecord.roleMenus.analytics ? this.userRecord.roleMenus.analytics.link : false;
    this.machineUtilization= this.userRecord.roleMenus.machineUtilization ? this.userRecord.roleMenus.machineUtilization.link : false;
    this.serviceReport= this.userRecord.roleMenus.serviceReport ?  this.userRecord.roleMenus.serviceReport.link : false;
    this.qatesting= this.userRecord.roleMenus.qatesting ? this.userRecord.roleMenus.qatesting.link : false;
    this.subscription= this.userRecord.roleMenus.subscription ?  this.userRecord.roleMenus.subscription.link : false;
    this.noniotMachines= this.userRecord.roleMenus.noniotMachines ? this.userRecord.roleMenus.noniotMachines.link :false;
    this.userlogs= this.userRecord.roleMenus.userlogs ?  this.userRecord.roleMenus.userlogs.link : false;
    this.roles= this.userRecord.roleMenus.roles ?  this.userRecord.roleMenus.roles.link : false;
    this.batch= this.userRecord.roleMenus.batch ? this.userRecord.roleMenus.batch.link : false;
    this.battery= this.userRecord.roleMenus.battery ?  this.userRecord.roleMenus.battery.link : false;
    this.fuel= this.userRecord.roleMenus.fuel ?  this.userRecord.roleMenus.fuel.link : false;
    this.createondemand = this.userRecord.roleMenus.createondemand ?  this.userRecord.roleMenus.createondemand.link : false;
    this.userProfile = this.userRecord.photo
    this.refferal= this.userRecord.roleMenus.refferal ?  this.userRecord.roleMenus.refferal.link : false;
    this.insurance= this.userRecord.roleMenus.insurance ?  this.userRecord.roleMenus.insurance.link : false;
    this.devicenotmapped= this.userRecord.roleMenus?.deviceNotMappedReport ?  this.userRecord.roleMenus.deviceNotMappedReport.link : false;
  }
}
    


