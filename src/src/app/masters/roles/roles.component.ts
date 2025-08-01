import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '@app/_services/account.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from '@app/_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.less'],
  providers: [DatePipe]
})
export class RolesComponent implements OnInit {
//  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  xdate : any;
  itemsPerPage = 50;
  searchText;
  rolesData : any;
  rolesForm:FormGroup;
  rolesMenu: any;
  roles : any;
  p: number = 1;
  showModal: boolean;
  up: any;
  constructor(
    private accountservice: AccountService, 
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.getAllRoles();
    this.xdate = new Date();
      this.rolesForm = this.formBuilder.group({ 
    });
    this.createUserLogs();
  }

  createUserLogs() {
    let params = {
      "loginName": JSON.parse(localStorage.getItem('user')).loginName,
      "module": "MASTER",
      "function": "ROLE",
      "type": "web"
    }
    this.accountservice.createUserlogs(params).subscribe((data) => {
      console.log("status", data['status']);
    },
      error => {
        this.toastr.error(error);
      })
  }

  getAllRoles() {
    
    this.accountservice.getAllRoles().subscribe(res => {
      this.roles = res;
     this.rolesData = this.roles.docs;
     console.log('this.rolesData-->', this.rolesData);
     
     // this.rolesData = this.roles;
    });
  }

  getRole(event,index, code) {
    this.showModal = true;
    var data = {
      "code":code
    }
    this.accountservice.getRoleByCode(data).subscribe(res => {
      this.rolesMenu = res;
    });
  }

  rolesSubmit(code) {
    const data = {
    roleMenus: {
      dashboard: {
        link: (<HTMLInputElement>document.getElementById("linkDashboard")).checked,
        add: (<HTMLInputElement>document.getElementById("addDashboard")).checked,
        edit: (<HTMLInputElement>document.getElementById("editDashboard")).checked,
        delete: (<HTMLInputElement>document.getElementById("deleteDashboard")).checked,
        level: this.rolesMenu[0].roleMenus.dashboard ? this.rolesMenu[0].roleMenus.dashboard.level : 0
      },
      roles: {
        link: (<HTMLInputElement>document.getElementById("linkrolesMaster")).checked,
        add: (<HTMLInputElement>document.getElementById("addrolesMaster")).checked,
        edit: (<HTMLInputElement>document.getElementById("editrolesMaster")).checked,
        delete: (<HTMLInputElement>document.getElementById("deleterolesMaster")).checked,
        level: this.rolesMenu[0].roleMenus.roles ?  this.rolesMenu[0].roleMenus.roles.level : 1
      },
      masters: {
        link: (<HTMLInputElement>document.getElementById("linkmasters")).checked,
        add: (<HTMLInputElement>document.getElementById("addmasters")).checked,
        edit: (<HTMLInputElement>document.getElementById("editmasters")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletemasters")).checked,
        level: this.rolesMenu[0].roleMenus.masters ?  this.rolesMenu[0].roleMenus.masters.level : 0
      },
      model: {
        link: (<HTMLInputElement>document.getElementById("linkmodel")).checked,
        add: (<HTMLInputElement>document.getElementById("addmodel")).checked,
        edit: (<HTMLInputElement>document.getElementById("editmodel")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletemodel")).checked,
        level: this.rolesMenu[0].roleMenus.model ? this.rolesMenu[0].roleMenus.model.level : 1
      },
      variant: {
        link: (<HTMLInputElement>document.getElementById("linkvariant")).checked,
        add: (<HTMLInputElement>document.getElementById("addvariant")).checked,
        edit: (<HTMLInputElement>document.getElementById("editvariant")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletevariant")).checked,
        level: this.rolesMenu[0].roleMenus.variant ? this.rolesMenu[0].roleMenus.variant.level : 1
      },
      machine: {
        link: (<HTMLInputElement>document.getElementById("linkmachine")).checked,
        add: (<HTMLInputElement>document.getElementById("addmachine")).checked,
        edit: (<HTMLInputElement>document.getElementById("editmachine")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletemachine")).checked,
        level: this.rolesMenu[0].roleMenus.machine ? this.rolesMenu[0].roleMenus.machine.level : 1
      },
      device: {
        link: (<HTMLInputElement>document.getElementById("linkdevice")).checked,
        add: (<HTMLInputElement>document.getElementById("adddevice")).checked,
        edit: (<HTMLInputElement>document.getElementById("editdevice")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletedevice")).checked,
        level: this.rolesMenu[0].roleMenus.device ? this.rolesMenu[0].roleMenus.device.level : 1
      },
      customer: {
        link: (<HTMLInputElement>document.getElementById("linkcustomer")).checked,
        add: (<HTMLInputElement>document.getElementById("addcustomer")).checked,
        edit: (<HTMLInputElement>document.getElementById("editcustomer")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletecustomer")).checked,
        level: this.rolesMenu[0].roleMenus.customer ? this.rolesMenu[0].roleMenus.customer.level : 1
      },
      location: {
        link: (<HTMLInputElement>document.getElementById("linklocation")).checked,
        add: (<HTMLInputElement>document.getElementById("addlocation")).checked,
        edit: (<HTMLInputElement>document.getElementById("editlocation")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletelocation")).checked,
       level: this.rolesMenu[0].roleMenus.location ? this.rolesMenu[0].roleMenus.location.level : 1
      },
      geofence: {
        link: (<HTMLInputElement>document.getElementById("linkgeofence")).checked,
        add: (<HTMLInputElement>document.getElementById("addgeofence")).checked,
        edit: (<HTMLInputElement>document.getElementById("editgeofence")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletegeofence")).checked,
        level: this.rolesMenu[0].roleMenus.geofence ? this.rolesMenu[0].roleMenus.geofence.level : 1
      },
      shipment: {
        link: (<HTMLInputElement>document.getElementById("linkshipment")).checked,
        add: (<HTMLInputElement>document.getElementById("addshipment")).checked,
        edit: (<HTMLInputElement>document.getElementById("editshipment")).checked,
        delete: (<HTMLInputElement>document.getElementById("deleteshipment")).checked,
        level: this.rolesMenu[0].roleMenus.shipment ?  this.rolesMenu[0].roleMenus.shipment.level : 1
      },
      service: {
        link: (<HTMLInputElement>document.getElementById("linkservice")).checked,
        add: (<HTMLInputElement>document.getElementById("addservice")).checked,
        edit: (<HTMLInputElement>document.getElementById("editservice")).checked,
        delete: (<HTMLInputElement>document.getElementById("deleteservice")).checked,
        level: this.rolesMenu[0].roleMenus.service ? this.rolesMenu[0].roleMenus.service.level : 1
      },
      reports: {
        link: (<HTMLInputElement>document.getElementById("linkreports")).checked,
        add: (<HTMLInputElement>document.getElementById("addreports")).checked,
        edit: (<HTMLInputElement>document.getElementById("editreports")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletereports")).checked,
        level: this.rolesMenu[0].roleMenus.reports ? this.rolesMenu[0].roleMenus.reports.level : 0
      },
      trackvehicles: {
        link: (<HTMLInputElement>document.getElementById("linktrackvehicles")).checked,
        add: (<HTMLInputElement>document.getElementById("addtrackvehicles")).checked,
        edit: (<HTMLInputElement>document.getElementById("edittrackvehicles")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletetrackvehicles")).checked,
        level: this.rolesMenu[0].roleMenus.trackvehicles ? this.rolesMenu[0].roleMenus.trackvehicles.level : 0
      },
      services: {
        link: (<HTMLInputElement>document.getElementById("linkservices")).checked,
        add: (<HTMLInputElement>document.getElementById("addservices")).checked,
        edit: (<HTMLInputElement>document.getElementById("editservices")).checked,
        delete: (<HTMLInputElement>document.getElementById("deleteservices")).checked,
        level: this.rolesMenu[0].roleMenus.services ? this.rolesMenu[0].roleMenus.services.level : 0
      },
      schedules: {
        link: (<HTMLInputElement>document.getElementById("linkschedules")).checked,
        add: (<HTMLInputElement>document.getElementById("addschedules")).checked,
        edit: (<HTMLInputElement>document.getElementById("editschedules")).checked,
        delete: (<HTMLInputElement>document.getElementById("deleteschedules")).checked,
        level: this.rolesMenu[0].roleMenus.schedules ? this.rolesMenu[0].roleMenus.schedules.level : 1
      },
      update: {
        link: (<HTMLInputElement>document.getElementById("linkupdate")).checked,
        add: (<HTMLInputElement>document.getElementById("addupdate")).checked,
        edit: (<HTMLInputElement>document.getElementById("editupdate")).checked,
        delete: (<HTMLInputElement>document.getElementById("deleteupdate")).checked,
        level: this.rolesMenu[0].roleMenus.update ? this.rolesMenu[0].roleMenus.update.level : 1
      },
      createondemand: {
        link: (<HTMLInputElement>document.getElementById("linkcreateondemand")).checked,
        add: (<HTMLInputElement>document.getElementById("addcreateondemand")).checked,
        edit: (<HTMLInputElement>document.getElementById("editcreateondemand")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletecreateondemand")).checked,
        level: this.rolesMenu[0].roleMenus.createondemand ? this.rolesMenu[0].roleMenus.createondemand.level : 1
      },
      usermanagement: {
        link: (<HTMLInputElement>document.getElementById("linkusermanagement")).checked,
        add: (<HTMLInputElement>document.getElementById("addusermanagement")).checked,
        edit: (<HTMLInputElement>document.getElementById("editusermanagement")).checked,
        delete: (<HTMLInputElement>document.getElementById("deleteusermanagement")).checked,
        level: this.rolesMenu[0].roleMenus.usermanagement ? this.rolesMenu[0].roleMenus.usermanagement.level : 0
      },
      users: {
       link: (<HTMLInputElement>document.getElementById("linkusers")).checked,
        add: (<HTMLInputElement>document.getElementById("addusers")).checked,
        edit: (<HTMLInputElement>document.getElementById("editusers")).checked,
        delete: (<HTMLInputElement>document.getElementById("deleteusers")).checked,
        level: this.rolesMenu[0].roleMenus.users ? this.rolesMenu[0].roleMenus.users.level : 1
      },
      dealers: {
       link: (<HTMLInputElement>document.getElementById("linkdealers")).checked,
        add: (<HTMLInputElement>document.getElementById("adddealers")).checked,
        edit: (<HTMLInputElement>document.getElementById("editdealers")).checked,
        delete: (<HTMLInputElement>document.getElementById("deletedealers")).checked,
        level: this.rolesMenu[0].roleMenus.dealers ? this.rolesMenu[0].roleMenus.dealers.level : 1
      },
      vehicle: {
        link: (<HTMLInputElement>document.getElementById("linkvehreport")).checked,
         add: (<HTMLInputElement>document.getElementById("addvehreport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editvehreport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deletevehreport")).checked,
         level: this.rolesMenu[0].roleMenus.vehicle ? this.rolesMenu[0].roleMenus.vehicle.level : 1
       },
       batch: {
        link: (<HTMLInputElement>document.getElementById("linkbatchreport")).checked,
         add: (<HTMLInputElement>document.getElementById("addbatchreport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editbatchreport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deletebatchreport")).checked,
         level: this.rolesMenu[0].roleMenus.batch ? this.rolesMenu[0].roleMenus.batch.level : 1
       },
       serviceReport: {
        link: (<HTMLInputElement>document.getElementById("linkservicereport")).checked,
         add: (<HTMLInputElement>document.getElementById("addservicereport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editservicereport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deleteservicereport")).checked,
         level: this.rolesMenu[0].roleMenus.serviceReport ? this.rolesMenu[0].roleMenus.serviceReport.level : 1
       },
       machineUtilization: {
        link: (<HTMLInputElement>document.getElementById("linkutireport")).checked,
         add: (<HTMLInputElement>document.getElementById("addutireport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editutireport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deleteutireport")).checked,
         level: this.rolesMenu[0].roleMenus.machineUtilization ? this.rolesMenu[0].roleMenus.machineUtilization.level : 1
       },
       qatesting: {
        link: (<HTMLInputElement>document.getElementById("linkqareport")).checked,
         add: (<HTMLInputElement>document.getElementById("addqareport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editqareport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deleteqareport")).checked,
         level: this.rolesMenu[0].roleMenus.qatesting ? this.rolesMenu[0].roleMenus.qatesting.level : 1
       },
       analytics: {
        link: (<HTMLInputElement>document.getElementById("linkanalyticsreport")).checked,
         add: (<HTMLInputElement>document.getElementById("addanalyticsreport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editanalyticsreport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deleteanalyticsreport")).checked,
         level: this.rolesMenu[0].roleMenus.analytics ? this.rolesMenu[0].roleMenus.analytics.level : 0
       },
       subscription: {
        link: (<HTMLInputElement>document.getElementById("linksubscriptionreport")).checked,
         add: (<HTMLInputElement>document.getElementById("addsubscriptionreport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editsubscriptionreport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deletesubscriptionreport")).checked,
         level: this.rolesMenu[0].roleMenus.subscription ?  this.rolesMenu[0].roleMenus.subscription.level : 1
       },
       noniotMachines: {
        link: (<HTMLInputElement>document.getElementById("linknoniotreport")).checked,
         add: (<HTMLInputElement>document.getElementById("addnoniotreport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editnoniotreport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deletenoniotreport")).checked,
         level: this.rolesMenu[0].roleMenus.noniotMachines ? this.rolesMenu[0].roleMenus.noniotMachines.level : 1
       },
       userlogs: {
        link: (<HTMLInputElement>document.getElementById("linkuserlogsreport")).checked,
         add: (<HTMLInputElement>document.getElementById("adduserlogsreport")).checked,
         edit: (<HTMLInputElement>document.getElementById("edituserlogsreport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deleteuserlogsreport")).checked,
         level: this.rolesMenu[0].roleMenus.userlogs ? this.rolesMenu[0].roleMenus.userlogs.level : 1
       },
       refferal: {
        link: (<HTMLInputElement>document.getElementById("linkrefferalreport")).checked,
         add: (<HTMLInputElement>document.getElementById("addrefferalreport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editrefferalreport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deleterefferalreport")).checked,
         level: this.rolesMenu[0].roleMenus.refferal ? this.rolesMenu[0].roleMenus.refferal.level : 1
       },
       insurance: {
        link: (<HTMLInputElement>document.getElementById("linkinsurancereport")).checked,
         add: (<HTMLInputElement>document.getElementById("addinsurancereport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editinsurancereport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deleteinsurancereport")).checked,
         level: this.rolesMenu[0].roleMenus.insurance ? this.rolesMenu[0].roleMenus.insurance.level : 1
       },
       deviceNotMappedReport: {
        link: (<HTMLInputElement>document.getElementById("linkdevicenotmappedreport")).checked,
         add: (<HTMLInputElement>document.getElementById("adddevicenotmappedreport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editdevicenotmappedreport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deletedevicenotmappedreport")).checked,
         level: this.rolesMenu[0].roleMenus.deviceNotMappedReport ? this.rolesMenu[0].roleMenus.deviceNotMappedReport.level : 1
       },
       battery: {
        link: (<HTMLInputElement>document.getElementById("linkbatteryreport")).checked,
         add: (<HTMLInputElement>document.getElementById("addbatteryreport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editbatteryreport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deletebatteryreport")).checked,
         level: this.rolesMenu[0].roleMenus.battery ? this.rolesMenu[0].roleMenus.battery.level : 1
       },
       fuel: {
        link: (<HTMLInputElement>document.getElementById("linkfuelreport")).checked,
         add: (<HTMLInputElement>document.getElementById("addfuelreport")).checked,
         edit: (<HTMLInputElement>document.getElementById("editfuelreport")).checked,
         delete: (<HTMLInputElement>document.getElementById("deletefuelreport")).checked,
         level: this.rolesMenu[0].roleMenus.fuel ? this.rolesMenu[0].roleMenus.fuel.level : 1
       }
    },
    // "roleIDs": this.rolesMenu[0].roleIDs,
    // "alternateIDs": this.rolesMenu[0].alternateIDs,
    // "isActive": true,
    // "name": this.rolesMenu[0].name,
    // "useType": this.rolesMenu[0].useType,
    // "description": this.rolesMenu[0].description,
    // "companyID": this.rolesMenu[0].companyID,
    // "createdBy": this.rolesMenu[0].createdBy,
    // "code": this.rolesMenu[0].code,
    // "createdAt": this.rolesMenu[0].createdAt,
    // "updatedAt": new Date(),
    // "updatedBy": this.rolesMenu[0].updatedBy,
    // "createdDate": this.rolesMenu[0].createdDate,
    // "id": this.rolesMenu[0].id
  }
    this.accountservice.updateRoleByCode(code, data).subscribe(res => {
      this.up = res;
      if(this.up.status)
      {
        this.toastr.success("Roles updated successfully");
        this.getAllRoles();
      }
      this.closeButton.nativeElement.click();
    });
  }
}
