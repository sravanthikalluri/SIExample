import { Component, Input } from '@angular/core';
import { ProfileService } from '../shared/profile.service';
import {DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css', '../../side-nav/user-details/user-details.component.css']
})
export class PḥotoUploadComponent {
    @Input() title: string;
    @Input() editable: boolean;
    public canEdit: boolean = false;
    public imagePath: any;
	constructor(private _sanitizer: DomSanitizer, private _ProfileService: ProfileService) {
        this.imagePath = 'assets/images/sample.PNG';
    }
    public onEdit() {
       this.canEdit = true;
    }
    public onSave() {
       this.canEdit = false;
    }
    public upload(event) {
       if ( event.target.files[0].size < (200 * 1024)) {
         var reader = new FileReader();
         reader.onload = (e) =>  {
           console.log(e);
           var img = new Image();
           img.src = URL.createObjectURL(event.target.files[0]);
           img.onload = () => {
             if ( img.width == 150 && img.height == 150) {
               this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(event.target.files[0]));
             } else {
               alert('Image should be of 300 * 300 px');
             }
           }
         }
         reader.readAsDataURL(event.target.files[0]);
       } else  {
         alert('Image size should not exceed 200kb');
       }

    }

    

    uploadCompanyLogo(event: any) {
      console.log(event.target.files[0]);
      const formData = new FormData();
      formData.append(event.target.files[0].name, event.target.files[0]);
      this.uploadPhoto(formData, true);
    }

    uploadPhoto(formData: any, flag) {
      this._ProfileService.updateProfilePicture(this._ProfileService.getCustomerId(), formData, flag).subscribe(res => {
        console.log(res)
      });
    }
}
