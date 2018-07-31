import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {AuthorizationService} from '../../shared/authorization.service';
import {ProfileService} from '../profile/shared/profile.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  @Output() onSubMenuClicked: EventEmitter<string> = new EventEmitter();
  activatedSubmenu: any = '';
  details: any;

  constructor(private _authService: AuthorizationService, private _ProfileService: ProfileService) {
    this.details = JSON.parse(this._authService.getUserData());
    console.log(this.details);
    this._ProfileService.setCustomerId(this.details['CustomerId']);
    this._ProfileService.setUserId(this.details['UserId']);
    this._ProfileService.setProfilePath(this.details['ProfilePhotoPath']);
    this._ProfileService.setCompanyName(this.details['CompanyName']);
    this._ProfileService.setCompanyLogo(this.details['CompanyLogo']);
  }

  public parentIndex: any;
  public currentMenu: any;
  menus: Object[] = [
    {
      'name': 'Dashboard',
      'subMenu': false,
      'isActive': true,
    },
    {
      'name': 'Call Ingestion',
      'subMenu': false,
      'link': 'callIngestion',
      'isActive': true,
    },
    {
      'name': 'Call Recordings',
      'subMenu': false,
      'link': 'callRecordings',
      'isActive': true,
    },
    {
      'name': 'Call Transcripts',
      'subMenu': false,
      'link': 'callTranscripts',
      'isActive': true,
    },
    {
      'name': 'Call Analytics',
      'subMenu': true,
      'subMenuItems': [
        {
          'name': 'Customer Satisfaction',
          'isActive': true,
          'link': 'customerSatisfaction'
        },
        {
          'name': 'Red Alerts',
          'isActive': true,
          'link': 'redAlerts'
        },
        {
          'name': 'Agent Performance',
          'link': 'agentPerformance'
        }
      ]
    }
  ];

  toggleMenu: boolean;

  ngOnInit() {
    this.toggleMenu = true;
    this.currentMenu = 'Customer Satisfaction';
  }

  menuClicked(menu, name, index) {
    alert('dfk');
    this.parentIndex = index;
    this.currentMenu = name;
    this.activatedSubmenu = '';
    if (menu.subMenu) {
      this.toggleMenu = !this.toggleMenu;
    }
  }

  subMenuClicked(subMenu, event) {

    this.toggleMenu = !this.toggleMenu;
    this.currentMenu = subMenu.name;
    event.preventDefault();
    console.log(this.activatedSubmenu);
    this.onSubMenuClicked.emit(subMenu);
  }

  public navigateToLink(menu) {
    this.currentMenu = menu.name;
  }

  public showSubmenu() {
    this.toggleMenu = !this.toggleMenu;
  }
}
