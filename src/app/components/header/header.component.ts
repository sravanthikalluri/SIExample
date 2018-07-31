import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../shared/authorization.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router:Router , private auth: AuthorizationService) { }

  ngOnInit() {
    
  }

 
  doLogout(){    
    this.auth.logOut();
    this.router.navigateByUrl('/home');
  }

  home() {
    this.router.navigate(['/home']);
  }

}
