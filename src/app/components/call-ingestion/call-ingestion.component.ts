import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';
import {UploadService} from '../../shared/upload.service';
import {FileSystemFileEntry} from 'ngx-file-drop';

@Component({
  selector: 'app-call-ingestion',
  templateUrl: './call-ingestion.component.html',
  styleUrls: ['./call-ingestion.component.css']
})
export class CallIngestionComponent implements OnInit {

  time: any;

  @ViewChild('file') file: ElementRef;

  uploadForm: FormGroup;
  fileGuid: string;
  data: any;
  idPattern = '^[a-zA-Z0-9._-]+$';
  fileStatusSubscription: ISubscription;

  constructor(public uploadService: UploadService, private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.uploadForm = this._fb.group({
      jobId: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(this.idPattern)]],
      orderId: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(this.idPattern)]],
      title: ['', [Validators.required, Validators.maxLength(60)]],
      deliveryDate: ['', [Validators.required]],
      customerId: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(this.idPattern)]],
      instructions: ['', [Validators.maxLength(2000)]]
    });
    this.uploadService.uploadingFailed = false;
    this.uploadService.uploadingSuccess = false;
    this.fileStatusSubscription = this.uploadService.trackFile$.subscribe(status => {
      if (status === true) {
        this.uploadForm.reset();
      }
    });
  }

  ngOnDestroy() {
    this.fileStatusSubscription.unsubscribe();
  }

  ondragstart() {
  }

  onDropHandler = function (object) {
    object.preventDefault();
  };

  uploadFiles(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.uploadService.totalFilesLength = 0;
      this.uploadService.fileCounter = 0;
      this.uploadService.totalFilesLength = event.target.files.length;
      for (let i = 0; i < event.target.files.length; i++) {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        const reader = new FileReader();
        const file = event.target.files[i];
        audio.src = URL.createObjectURL(file);
        reader.readAsDataURL(file);
        this.getDuration(audio, file);
      }
    }
  }

  getDuration(audio, file) {
    audio.ondurationchange = () => {
      this.uploadService.fileDuration = audio.duration;
      const t = Math.floor(this.uploadService.fileDuration);
      this.time =
        ('0' + Math.floor(t / 3600) % 24).slice(-2) + ':' + ('0' + Math.floor(t / 60) % 60).slice(-2) + ':' + ('0' + t % 60).slice(-2);
      this.data = {
        fileName: file.name,
        size: (file.size / 1000000),
        duration: this.uploadService.fileDuration,
        jobId: this.uploadForm.controls['jobId'].value,
        customerId: this.uploadForm.controls['customerId'].value,
        title: this.uploadForm.controls['title'].value,
        orderId: this.uploadForm.controls['orderId'].value,
        deliveryDate: this.uploadForm.controls['deliveryDate'].value,
        instruction: this.uploadForm.controls['instructions'].value
      };
      this.uploadService.postFile(this.data, file);
    };
  }

  dropped(event) {
    for (const droppedFile of event.files) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        setTimeout(() => {
          this.uploadService.postFile(this.data, file);
        }, 100);
      });
    }
  }

}
