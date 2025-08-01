import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from './_services';
import { User } from './_models';
import { Machine } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['./app.component.css'] })
export class AppComponent {
    user: User;
    machine: Machine;

    constructor(private accountService: AccountService, public router: Router) {
        this.accountService.user.subscribe((x) => {
            this.user = x
            // console.log(this.user);
        });
    }


    logout() {
        this.accountService.logout();
    }
}