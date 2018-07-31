import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ProfileService {

  userId = '';
  customerId = '';
  profilePath = new Subject<string>();
  companyName = new Subject<string>();
  companyLogo: any;

  constructor(private http: HttpClient) {

  }

  getCustomerId() {
    return this.customerId;
  }

  setCustomerId(id: any) {
    this.customerId = id;
  }

  getUserId() {
    return this.userId;
  }

  setUserId(id: any) {
    this.userId = id;
  }

  setProfilePath(profile: any) {
    this.profilePath.next(profile);
  }

  getCompanyLogo() {
    return this.companyLogo;
  }

  setCompanyLogo(logo: any) {
    this.companyLogo = logo;
  }

  setCompanyName(company: any) {
    this.companyName.next(company);
  }

  public updateProfileInfo(data) {
    return this.http.post(environment.update_profile_Api, data);
  }

  public updateProfilePicture(value, formData, flag) {
    return this.http.post(`${environment.transcription_Api}/api/user/UploadPhoto/${value}/${flag}`, formData);
  }
}
