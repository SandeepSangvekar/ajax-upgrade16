import { Injectable } from '@angular/core';
import { AccountService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    loginRecord: any;
    itrolesUrl = [
        { url: '/dashboard' },
        { url: '/track' },  
     ];
    adminUrl = [
        { url: '/dashboard' },
        { url: '/masters/model' },
        { url: '/users' },
        { url: '/masters/machine' },
        { url: '/masters/machine/add' },
        { url: '/masters/device' },
        { url: '/masters/variant' },
        { url: '/masters/customer' },
        { url: '/masters/location' },
        { url: '/masters/geofencing' },
        
        { url: '/track' },
        { url: 'details/:**' },
        { url: '/masters/shipment' },
        { url: '/summary' },
        { url: '/service' },
        { url: '/service/register-service-report' },
        { url: '/user' },
        { url: '/user/userlist' },
        { url: '/user/dealer' },
        { url: '/notifications' },
        { url: '/testing/test' },
        { url: '/testing/main' },
        { url: '/report' },
        { url: '/users' },
        { url: '/users/add' },
        { url: '/users/edit' },
        
    ];

    serviceEngineerUrl = [
        { url: '/dashboard' },
        { url: '/track' },
        { url: 'details/:**' },
        { url: '/summary' },
        { url: '/service/schedule' },
        { url: '/service/update' },
     ];
 
    delearUrl = [
        { url: '/dashboard' },
        { url: '/track' },
        { url: 'details/:**' },
        { url: '/report' },
        { url: '/service' },
        { url: '/masters/model' },
        { url: '/testing/test' },
        { url: '/masters/machine' },
        { url: '/masters/machine/add' },
        { url: '/masters/device' },
        { url: '/masters/variant' },
        { url: '/masters/customer' },
        { url: '/masters/location' },
        { url: '/masters/shipment' },
        { url: '/service/schedule' },
        { url: '/service/update' },
 
    ];

    officeroUrl = [
        { url: '/dashboard' },
        { url: '/track' },
        { url: 'details/:**' },
        { url: '/report' },
        { url: '/masters/model' },
        { url: '/masters/machine' },
        { url: '/masters/machine/add' },
        { url: '/masters/device' },
        { url: '/masters/variant' },
        { url: '/masters/customer' },
        { url: '/masters/location' },
        { url: '/masters/shipment' },
       
        { url: '/summary' },
        { url: '/service' },
        { url: '/user' },
        { url: '/user/userlist' },
        { url: '/user/dealer' },
        { url: '/notifications' },
        { url: '/testing/test' },
        { url: '/testing/main' },
        { url: '/report' },
        { url: '/users' },
        { url: '/users/add' },
        { url: '/users/edit' },


    ];

servicezoneUrl = [
        { url: '/dashboard' },
        { url: '/masters/machine' },
        { url: '/masters/machine/add' },
        { url: '/masters/customer' },
        { url: '/masters/location' },
        { url: '/masters/geofencing' },
        { url: '/track' },
        { url: 'details/:**' },
        { url: '/masters/shipment' },
        { url: '/summary' },
        { url: '/service' },
        { url: '/service/schedule' },
        { url: '/service/update' },
        { url: '/notifications' },
        { url: '/report' },
        { url: '/user/dealer' },
        { url: '/user/userlist' }
     ];
 
     saleszoneUrl = [
        { url: '/dashboard' },
        { url: '/masters/machine' },
        { url: '/masters/machine/add' },
        { url: '/masters/customer' },
        { url: '/masters/location' },
        { url: '/masters/geofencing' },
        { url: '/track' },
        { url: 'details/:**' },
        { url: '/summary' },
        { url: '/notifications' },
        { url: '/report' },
        { url: '/user/dealer' },
        { url: '/user/userlist' }
     ];
     engineeringUrl = [
        { url: '/dashboard' },
        { url: '/masters/model' },
        { url: '/users' },
        { url: '/masters/machine' },
        { url: '/masters/machine/add' },
        { url: '/masters/device' },
        { url: '/masters/variant' },
        { url: '/masters/customer' },
        { url: '/masters/location' },
        { url: '/masters/geofencing' },
        
        { url: '/track'},
        { url: 'details/:**' },
        { url: '/masters/shipment' },
        { url: '/summary' },
        { url: '/service' },
        { url: '/user' },
        { url: '/user/userlist' },
        { url: '/user/dealer' },
        { url: '/notifications' },
     { url: '/testing/test' },
        // { url: '/testing/main' },
        { url: '/report' },
        { url: '/users' },
        { url: '/users/add' },
        { url: '/users/edit' },
    ];
 
    productionUrl = [
        { url: '/dashboard' },
        { url: '/masters/machine' },
        { url: '/masters/device' },
        { url: '/report' },
    ];
    qainspectorUrl = [
        { url: '/dashboard' },
        { url: '/masters/machine' },
        { url: '/testing/test' },
        { url: '/report' }
    ];
    getUrl: any;
    getUrlDelear: any;
    customerUrl = [
        { url: '/dashboard/CustomerDashboard' },
        { url: '/masters/location' },
        { url: '/masters/geofencing' },
        { url: '/track' },
        { url: 'details/:**' },
        { url: '/service/schedule' },
     
     ];
    constructor(private accountService: AccountService, private route: ActivatedRoute, private router: Router, ) { }
    authFunction(b) {
        console.log(JSON.parse(localStorage.getItem('user')));
        
        console.log("bb ", b);

        if (JSON.parse(localStorage.getItem('user')).role == "ADMIN") {
            this.getUrl = this.adminUrl.find(x => x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {
                console.log("Okk Authorized")
            } else {
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
                this.router.navigateByUrl(returnUrl);
                console.log("Not authoriszed");
            }
        }
        if(JSON.parse(localStorage.getItem('user')).role == "officero"){
            this.getUrl = this.officeroUrl.find(x => x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {
                console.log("Okk Authorized")
            } else {
                console.log("Not authoriszed");
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
                this.router.navigateByUrl(returnUrl);
            }

        }
  if(JSON.parse(localStorage.getItem('user')).role == "serviceandsales"){
            this.getUrl = this.servicezoneUrl.find(x => x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {
                console.log("Okk Authorized")
            } else {
                console.log("Not authoriszed");
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
                this.router.navigateByUrl(returnUrl);
            }
 
        }
        if(JSON.parse(localStorage.getItem('user')).role == "saleszonal"){
            this.getUrl = this.saleszoneUrl.find(x => x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {
                console.log("Okk Authorized")
            } else {
                console.log("Not authoriszed");
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
                this.router.navigateByUrl(returnUrl);
            }
 
        }
        if(JSON.parse(localStorage.getItem('user')).role == "engineering"){​​​​​​​​
            this.getUrl = this.engineeringUrl.find(x=>x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {​​​​​​​​
            console.log("Okk Authorized")
                        }​​​​​​​​ else {​​​​​​​​
            console.log("Not authoriszed");
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
            this.router.navigateByUrl(returnUrl);
                        }​​​​​​​​
             
                    }​​​​​​​​
            if(JSON.parse(localStorage.getItem('user')).role == "customer"){
                        this.getUrl = this.customerUrl.find(x => x.url == b);
                        console.log(this.getUrl);
                        if (this.getUrl.url == b) {
                            console.log("Okk Authorized")
                        } else {
                            console.log("Not authoriszed");
                            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
                            this.router.navigateByUrl(returnUrl);
                        }
                    }
            if(JSON.parse(localStorage.getItem('user')).role == "production"){​​​​​​​​
            this.getUrl = this.productionUrl.find(x=>x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {​​​​​​​​
            console.log("Okk Authorized")
                        }​​​​​​​​ else {​​​​​​​​
            console.log("Not authoriszed");
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
            this.router.navigateByUrl(returnUrl);
                        }​​​​​​​​
             
                    }​​​​​​​​
            if(JSON.parse(localStorage.getItem('user')).role == "qainspector"){​​​​​​​​
            this.getUrl = this.qainspectorUrl.find(x=>x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {​​​​​​​​
            console.log("Okk Authorized")
                        }​​​​​​​​ else {​​​​​​​​
            console.log("Not authoriszed");
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
            this.router.navigateByUrl(returnUrl);
                        }​​​​​​​​
             
                    }​​​​​​​​
            
               
            
            if(JSON.parse(localStorage.getItem('user')).role == "it"){​​​​​​​​
            this.getUrl = this.itrolesUrl.find(x=>x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {​​​​​​​​
            console.log("Okk Authorized")
                        }​​​​​​​​ 
            else {​​​​​​​​
            console.log("Not authoriszed");
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
            this.router.navigateByUrl(returnUrl);
                        }​​​​​​​​
                    }​​​​​​​​
            if(JSON.parse(localStorage.getItem('user')).role == "dealer"){​​​​​​​​
            this.getUrl = this.delearUrl.find(x=>x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {​​​​​​​​
            console.log("Okk Authorized")
                        }​​​​​​​​ else {​​​​​​​​
            console.log("Not authoriszed");
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
            this.router.navigateByUrl(returnUrl);
                        }​​​​​​​​
             
                    }​​​​​​​​
            if (JSON.parse(localStorage.getItem('user')).role == "serviceengineer") {​​​​​​​​
            this.getUrl = this.serviceEngineerUrl.find(x=>x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {​​​​​​​​
            console.log("Okk Authorized")
                        }​​​​​​​​ else {​​​​​​​​
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
            this.router.navigateByUrl(returnUrl);
            console.log("Not authoriszed");
                        }​​​​​​​​
                    }​​​​​​​​
                }​​​​​​
            

       
      
}