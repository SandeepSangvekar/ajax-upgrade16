import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

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

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NewTrackVehicleComponent } from './newTrackVehicle/new-track-vehicle.component'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { TrackComponent } from './trackVehicles/track.component';


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        NgxChartsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDITud13UV0N6Y58jk0AWInr5y52lJ4rsY',
            libraries: ['places', 'drawing', 'geometry'],
        }),
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LayoutComponent,
        HeaderComponent,
        FooterComponent,
        NewTrackVehicleComponent,
        TrackComponent,
        SidenavComponent
    
    ],
    providers: [
        DatePipe,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        //fakeBackendProvider
    ],
    schemas:  [ CUSTOM_ELEMENTS_SCHEMA ],
    bootstrap: [AppComponent]
})
export class AppModule { };