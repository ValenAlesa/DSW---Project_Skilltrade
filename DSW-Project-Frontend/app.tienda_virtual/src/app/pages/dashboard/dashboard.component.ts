import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service.js';
import { User } from '../../models/user.js';
import { Nav } from '../../shared/nav.component.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Nav],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userLoginOn: boolean = false;
  userData?: User;
  
  constructor(private loginService: LoginService) {}

  ngOnDestroy(): void {
    this.loginService.currentUserLoginOn.unsubscribe();
    this.loginService.currentUserData.unsubscribe();
  }
  
  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe(
      {
        next: (userLoginOn) => {
          this.userLoginOn = userLoginOn;
        }
      });

    this.loginService.currentUserData.subscribe(
      {
        next: (userData) => {
          this.userData = userData;
        }
      });
  }
}
