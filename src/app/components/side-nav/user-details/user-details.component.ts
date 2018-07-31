import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthorizationService} from '../../../shared/authorization.service';
import {ProfileService} from '../../profile/shared/profile.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  username: any;
  userRole: any;
  dateTime: string;
  imagePath: any;
  profileSubscription: Subscription;
  details: any;

  constructor(private _authService: AuthorizationService, private _ProfileService: ProfileService) {
  }

  ngOnInit() {
    this.details = JSON.parse(this._authService.getUserData());
    this.dateTime = (new Date()).toString().split(' ').splice(0, 5).join(' ');
    this.username = this._authService.getUsername();
    this.userRole = this._authService.getRole();
    if (this.details['ProfilePhotoPath'] === undefined) {
      this.imagePath = '../assets/images/sample.PNG';
    } else {
      this.imagePath = this.details['ProfilePhotoPath'];
    }
    this.profileSubscription = this._ProfileService.profilePath.subscribe((profile) => {
      this.imagePath = profile;
    });
  }

  ngOnDestroy() {
    this.profileSubscription.unsubscribe();
  }
}
