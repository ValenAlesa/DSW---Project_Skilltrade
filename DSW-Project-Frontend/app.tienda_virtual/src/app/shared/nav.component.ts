import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service.js';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nav',
  imports: [CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit, OnDestroy {
  userLoginOn = false;
  private subs = new Subscription();

  constructor(private loginService: LoginService, public router: Router) { }


  ngOnInit(): void {
    const sub = this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      }
    });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
