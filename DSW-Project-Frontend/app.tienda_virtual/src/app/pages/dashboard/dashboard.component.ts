import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service.js';
import { User } from '../../models/user.js';
import { Nav } from '../../shared/nav.component.js';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Nav],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userLoginOn = false;
  userData?: User;

  private subs = new Subscription();
  
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    const s1 = this.loginService.currentUserLoginOn.
    subscribe(
      v => this.userLoginOn = v
    );

    const s2 = this.loginService.currentUserData.
    subscribe(
      u => this.userData = u
    );

    this.subs.add(s1);
    this.subs.add(s2);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
