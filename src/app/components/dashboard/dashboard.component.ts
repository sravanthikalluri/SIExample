import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showRedAlerts:boolean = false;
  constructor() { }

  ngOnInit() {
  }
  subMenuClicked(event){
     switch(event){
      case "Red Alerts":
      this.showRedAlerts = true;
      break; 
      case "Customer Satisfaction":
      this.showRedAlerts = false;
     }
  }
}
