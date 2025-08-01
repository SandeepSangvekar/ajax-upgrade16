import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { role, Userm, Zone, Dealer   } from  '../_models/userman';

@Injectable({ providedIn: 'root' })
export class UsermanagemntService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
   


    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
       
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

   

    getAllUsers() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.get<User[]>(`${environment.apiUrl}/users`,httpOptions);
    }
   
    getByIdUser(id){

        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.get<Userm>(`${environment.apiUrl}/users/id/${id}`,httpOptions);

    }
    deleteUsers(id){
        //delete User data
 var headers_object = new HttpHeaders({​​​​​​​​​​​​ 'Content-Type':'application/json', 'Authorization':"Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID':environment.companyID }​​​​​​​​​​​​);
    const httpOptions = {​​​​​​​​​​​​ headers:headers_object }​​​​​​​​​​​​;
    const URL = environment.apiUrl + '/users/deleteUser/' + id;
    console.log("url", URL)
    return this.http.put(URL, httpOptions);
    }
    deleteDealers(id){
        //delete dealer data
        var headers_object = new HttpHeaders({​​​​ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID }​​​​);
        const httpOptions = {​​​​ headers: headers_object }​​​​;
        const URL = environment.apiUrl + '/masters/dealer/deleteDealer/' + id;
        console.log("url", URL)
        return this.http.put(URL, httpOptions);
    }
    getDealerById(id){

        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.get(`${environment.apiUrl}/masters/dealer/id/${id}`,httpOptions);

    }
    getMarket(){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.get(`${environment.apiUrl}/masters/market`,httpOptions);
    }

    getzone(){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.get(`${environment.apiUrl}/masters/zone`,httpOptions);

    }


    newUser(user: Userm) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Userm[]>(`${environment.apiUrl}/users/register`, user,httpOptions);


    }


    getRole(id: string){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };


        return this.http.get<role>(`${environment.apiUrl}/roles/${id}`,httpOptions);
    }


    getZone(country: string){

        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Zone>(`${environment.apiUrl}/masters/zone/${country}`,httpOptions);
    }

    getSubZone(zone){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<any>(`${environment.apiUrl}/masters/subzone`, zone ,httpOptions );
    }

    getState(subzone){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<any>(`${environment.apiUrl}/masters/states`, subzone ,httpOptions);
    }
    getStateData(data){
        //Get Admin State list
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
            const httpOptions = { headers: headers_object };
            return this.http.post(`${environment.apiUrl}/users/stateData`,data, httpOptions); 
        }
    getDealers(state){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<any>(`${environment.apiUrl}/masters/dealer`, state ,httpOptions);
    }

    updateUser(id, params) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/users/${id}`, params ,httpOptions)
            .pipe(map((x) => {
                return x;
            }));
    }
    updateDealer(id, params) {
        //Update dealer data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/dealer/update/${id}`, params, httpOptions)
            .pipe(map(x => {
                return x;
            }));
    }
    getAlldealers() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.get<Dealer[]>(`${environment.apiUrl}/masters/dealer/list` ,httpOptions);
    }
    getAllState(){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
            const httpOptions = { headers: headers_object };
            return this.http.post(`${environment.apiUrl}/masters/getStates`, httpOptions); 
    }
    newDealer(dealer: Dealer) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };


        return this.http.post(`${environment.apiUrl}/masters/dealer/create`, dealer ,httpOptions);

    }
    
}