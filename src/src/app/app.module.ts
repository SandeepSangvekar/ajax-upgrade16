import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '@environments/environment';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import { MachineComponent } from './masters/machine/machine.component';
import { LayoutComponent } from './home/layout.component';;
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component'
import { CustDashboardComponent }from './home/cust-dashboard/cust-dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
// import { AgmCoreModule } from '@agm/core';
import { AgmCoreModule } from 'ng-agm-core-lib';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { TrackComponent } from './trackVehicles/track.component';
import { EnginehoursPipe } from './pipes/enginehours.pipe';
import { VmonComponent } from './home/vmon/vmon.component';
import { DserviceComponent } from './home/dservice/dservice.component';
import { ExcelService, ExcelServiceXlsx } from '../app/_services/excel.service';;
import { ServiceScheduleComponent } from './masters/service-schedule/service-schedule.component';
import { DtperformerComponent } from './home/dtperformer/dtperformer.component';
import { DcustSegmentationComponent } from './home/dcust-segmentation/dcust-segmentation.component';
import { DscheduleServiceComponent } from './home/dschedule-service/dschedule-service.component';
import { DbreakdownStatComponent } from './home/dbreakdown-stat/dbreakdown-stat.component';
import { ServiceReportComponent } from './report/service-report/service-report.component';
import { DrunHoursComponent } from './home/drun-hours/drun-hours.component';
import { MachineUtilizationComponent } from './report/machine-utilization/machine-utilization.component';
import { SubscriptionComponent } from './report/subscription/subscription.component';
import { NonIotComponent } from './report/non-iot/non-iot.component';
import { BatchComponent } from './report/batch/batch.component';
import { AlertanalyticsComponent } from './report/alertanalytics/alertanalytics.component';
import { BatteryComponent } from './report/battery/battery.component';
import { FuelanalyticsComponent } from './report/fuelanalytics/fuelanalytics.component'
import { UpdateEngHourComponent } from './trackVehicles/update-eng-hour/update-eng-hour.component';
import { RegisterServiceComponent } from './service/register-service/register-service.component'
import { QRCodeModule } from 'angularx-qrcode';
import { MaintenancePageComponent } from './maintenance-page/maintenance-page.component';
import { ToastrModule } from 'ngx-toastr';
import { GoogleChartsModule } from 'angular-google-charts';
import { ReportReferralComponent } from './report/referral/report-referral.component';
import { InsuranceComponent } from './report/insurance/insurance.component';
import { OemManagementComponent } from './oem-management/oem-management.component';
import { DetailComponent } from './oem-management/detail/detail.component'
import { QATestingComponent } from './report/qa-testing/qa-testing.component';
import { DeLinkComponent } from './masters/de-link/de-link.component';
import { DeviceNotMappedComponent } from './report/device-not-mapped/device-not-mapped.component';;
import { BannerComponent } from './masters/banner/banner.component'

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        QRCodeModule,
        ModalModule.forRoot(), 
        NgxChartsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        GoogleChartsModule,
        AgmCoreModule.forRoot({
            // apiKey: 'AIzaSyDITud13UV0N6Y58jk0AWInr5y52lJ4rsY',
            apiKey: environment.mapApiKey,
            libraries: ['places', 'drawing', 'geometry'],            
        }),
        ToastrModule.forRoot()
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LayoutComponent,
        HeaderComponent,
        FooterComponent,
        TrackComponent,
        SidenavComponent,
        EnginehoursPipe,
        VmonComponent,
        DserviceComponent,
        ServiceScheduleComponent,
        CustDashboardComponent,
        DtperformerComponent,
        DcustSegmentationComponent,
        DscheduleServiceComponent,
        DbreakdownStatComponent,
        ServiceReportComponent,
        DrunHoursComponent,
        MachineUtilizationComponent,
        SubscriptionComponent,
        NonIotComponent,
        BatchComponent,
        AlertanalyticsComponent,
        BatteryComponent,
        FuelanalyticsComponent ,
        UpdateEngHourComponent,
        RegisterServiceComponent,
        MaintenancePageComponent,
        ReportReferralComponent,
        InsuranceComponent,
        OemManagementComponent,
        DetailComponent,
        QATestingComponent,
        DeLinkComponent,
        DeviceNotMappedComponent
,
        BannerComponent    ],
    
    providers: [HomeComponent,
        DatePipe,
        ,ExcelService,ExcelServiceXlsx,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        //fakeBackendProvider
    ],
    schemas:  [ CUSTOM_ELEMENTS_SCHEMA ],
    bootstrap: [AppComponent],

})
export class AppModule { };