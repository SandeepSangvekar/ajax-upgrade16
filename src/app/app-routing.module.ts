import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { VmonComponent } from './home/vmon/vmon.component';
import { DserviceComponent } from './home/dservice/dservice.component';
import{ CustDashboardComponent }from './home/cust-dashboard/cust-dashboard.component';
//import { LocationComponent } from './location/location.component';
import { AuthGuard } from './_helpers';
import { TrackComponent } from './trackVehicles/track.component';
import { ServiceScheduleComponent } from './masters/service-schedule/service-schedule.component';
import { DtperformerComponent } from './home/dtperformer/dtperformer.component';
import { DbreakdownStatComponent } from './home/dbreakdown-stat/dbreakdown-stat.component';
import { DscheduleServiceComponent } from './home/dschedule-service/dschedule-service.component';
import { DcustSegmentationComponent } from './home/dcust-segmentation/dcust-segmentation.component';
import { ServiceReportComponent } from './report/service-report/service-report.component';
import { DrunHoursComponent } from './home/drun-hours/drun-hours.component';
import { MachineUtilizationComponent } from './report/machine-utilization/machine-utilization.component';
import { SubscriptionComponent } from './report/subscription/subscription.component';
import { NonIotComponent } from './report/non-iot/non-iot.component';
import { UserlogsComponent } from './report/userlogs/userlogs.component';
import { BatchComponent } from './report/batch/batch.component';
import { AlertanalyticsComponent } from './report/alertanalytics/alertanalytics.component';
import { BatteryComponent } from './report/battery/battery.component';
import { FuelanalyticsComponent } from './report/fuelanalytics/fuelanalytics.component';
import { UpdateEngHourComponent } from './trackVehicles/update-eng-hour/update-eng-hour.component';
import { RegisterServiceComponent } from './service/register-service/register-service.component';
import { RolesComponent } from './masters/roles/roles.component';
import { ReportReferralComponent } from './report/referral/report-referral.component';
import { InsuranceComponent } from './report/insurance/insurance.component';
import { OemManagementComponent } from './oem-management/oem-management.component';
import { DetailComponent } from './oem-management/detail/detail.component';
import { QATestingComponent } from './report/qa-testing/qa-testing.component';
import { DeLinkComponent } from './masters/de-link/de-link.component';
import { DeviceNotMappedComponent } from './report/device-not-mapped/device-not-mapped.component';
import { BannerComponent } from './masters/banner/banner.component';
// import { TrackComponent } from './track/track/track.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const machineModule = () => import('./masters/machine/machine.module').then(x => x.MachineModule);
const deviceModule = () => import('./masters/device/device.module').then(x => x.DeviceModule);
const modelModule = () => import('./masters/model/model.module').then(x => x.ModelModule);
const variantModule = () => import('./masters/variant/variant.module').then(x => x.VariantModule);
const customerModule = () => import('./masters/customer/customer.module').then(x => x.CustomerModule);
const locationModule = () => import('./masters/location/location.module').then(x => x.LocationModule);
// const trackModule = () => import('./trackVehicles/track.module').then(x => x.TrackModule);
const geofencingModule = () => import('./masters/geofencing/geofencing.module').then(x => x.GeofencingModule);
const detailsModule = () => import('./details/details.module').then(x => x.DetailsModule);
const serviceModule = () => import('./service/service.module').then(x => x.ServiceModule);
const userModule = () => import('./user-management/user.module').then(x => x.UserModule);
const shipmentModule = () => import('./masters/shipment/shipment.module').then(x => x.ShipmentModule);
const reportModule = () => import('./report/report.module').then(x => x.ReportModule);
const notificationModule = () => import('./notifications/notifications.module').then(x => x.NotificationsModule);
const rolesModule = () => import('./masters/roles/roles.module').then(x=>x.RolesModule);



const routes: Routes = [
  
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/CustomerDashboard', component:CustDashboardComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/vehicle-monitoring', component: VmonComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/service', component: DserviceComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/top-5-Performers', component: DtperformerComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/breakdown-statistics', component: DbreakdownStatComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/schedule-complete-services', component: DscheduleServiceComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/customer-segmentation', component: DcustSegmentationComponent, canActivate: [AuthGuard] },
    { path: 'dashboard/run-hour', component: DrunHoursComponent, canActivate: [AuthGuard] },
    
    //{ path: 'location', component: LocationComponent, canActivate: [AuthGuard] },
    { path: 'masters/model', loadChildren: modelModule, canActivate: [AuthGuard] },
    { path: 'masters/machine', loadChildren: machineModule, canActivate: [AuthGuard] },
    { path: 'masters/device', loadChildren: deviceModule, canActivate: [AuthGuard] },
    { path: 'masters/variant', loadChildren: variantModule, canActivate: [AuthGuard] },
    { path: 'masters/customer', loadChildren: customerModule, canActivate: [AuthGuard] },
    { path: 'masters/location', loadChildren: locationModule, canActivate: [AuthGuard] },
    { path: 'masters/service', component: ServiceScheduleComponent, canActivate: [AuthGuard] },
    {path:'masters/roles',component: RolesComponent, canActivate: [AuthGuard] },
    {path:'masters/banner',component: BannerComponent, canActivate: [AuthGuard] },
    { path: 'track', component: TrackComponent, canActivate: [AuthGuard]},
    { path: 'report/service-report', component: ServiceReportComponent, canActivate: [AuthGuard] },
    { path: 'report/machine_utilization_report', component: MachineUtilizationComponent, canActivate: [AuthGuard] },
    { path: 'report/subscription', component: SubscriptionComponent, canActivate: [AuthGuard] },
    { path: 'report/non-iot-machines-report', component: NonIotComponent, canActivate: [AuthGuard] },
    { path: 'report/batch-report', component: BatchComponent, canActivate: [AuthGuard] },
    { path: 'analytics/alert', component: AlertanalyticsComponent, canActivate: [AuthGuard] },
    { path: 'analytics/battery', component: BatteryComponent, canActivate: [AuthGuard] },
    { path: 'analytics/fuel', component: FuelanalyticsComponent, canActivate: [AuthGuard] },
    { path: 'update-EngHour', component: UpdateEngHourComponent, canActivate: [AuthGuard] },
    { path: 'service/register-service-report', component: RegisterServiceComponent, canActivate: [AuthGuard] },
    { path: 'report/userLogs_report', component: UserlogsComponent, canActivate: [AuthGuard] },
    { path: 'details/:id', loadChildren: detailsModule, canActivate: [AuthGuard] },
    { path: 'service', loadChildren: serviceModule, canActivate: [AuthGuard] },
    { path: 'user', loadChildren: userModule, canActivate: [AuthGuard] },
    { path: 'masters/shipment', loadChildren: shipmentModule, canActivate: [AuthGuard] },
    { path : 'masters/geofencing',loadChildren : geofencingModule, canActivate: [AuthGuard]},
    { path: 'report', loadChildren: reportModule, canActivate: [AuthGuard] },
    { path: 'notifications', loadChildren: notificationModule, canActivate: [AuthGuard] },
    {​​​​​​ path:'report/refferal', component:ReportReferralComponent, canActivate: [AuthGuard] }​​​​​​,
    {​​​​​​ path:'report/insurance', component:InsuranceComponent, canActivate: [AuthGuard] }​​​​​​,
    {​​​​​​ path:'report/qa-testing', component:QATestingComponent, canActivate: [AuthGuard] }​​​​​​,
    {​​​​​​ path:'oem-management', component:OemManagementComponent, canActivate: [AuthGuard] }​​​​​​,
    {​​​​​​ path:'oem/detail/:id', component: DetailComponent, canActivate: [AuthGuard] }​​​​​​,
    {​​​​​​ path:'de-link-device', component: DeLinkComponent }​​​​​​,
    {​​​​​​ path:'report/device-not-mapped', component: DeviceNotMappedComponent }​​​​​​,
    { path: '', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
