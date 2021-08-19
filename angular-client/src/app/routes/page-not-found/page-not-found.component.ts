import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  constructor(private router: Router) { }

  handleContactSupportClick(){
    window.location.href = `mailto:${environment.supportEmail}`;
  }

  handleHomeClick(){
    this.router.navigate(['./search']);
  }

}
