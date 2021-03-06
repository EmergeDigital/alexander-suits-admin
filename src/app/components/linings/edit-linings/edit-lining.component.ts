import { Component, OnInit } from '@angular/core';
import { Lining } from '../../../models/lining';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { TdLoadingService } from '@covalent/core';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from "../../../services/data.service";

@Component({
  templateUrl: './edit-lining.component.html',
  styleUrls: ['./edit-lining.component.scss']
})
export class EditLiningComponent implements OnInit {

  private coloursMock: string[] = [
    "White",
    "Offwhite",
    "Beige",
    "Orange",
    "Burnt Orange",
    "Light Brown",
    "Brown",
    "Light Pink",
    "Pink",
    "Red",
    "Dark Red",
    "Burgundy",
    "Aubergine",
    "Light Purple/Malve",
    "Purple",
    "Fuchsia /with pink",
    "Light Blue",
    "Medium Blue",
    "Royal Blue",
    "Cobalt Blue",
    "Navy Blue",
    "Dark Navy Blue",
    "Very light grey",
    "Light Grey",
    "Medium Grey",
    "Charcoal Grey",
    "Black",
  ];

  private printsMock: string[] = [
    "Other",
    "Plain"
  ];

  private id: string = "";
  private lining: any = {};
  private isLoading: boolean = false;

  private filteredColours: string[] = [];
  private selectedColours: string[] = [];
  private colourAddition: boolean = true;
  private chipRemoval: boolean = true;

  private uploadedImg: any = {};
  private uploadedThumb: string = "";
  private uploading: boolean = false;
  private fileUploading: string = "";

  constructor(private route: ActivatedRoute, public data: DataService, private _loadingService: TdLoadingService, private toastyService:ToastyService, public router: Router,
    private toastyConfig: ToastyConfig, private ng2ImgToolsService: Ng2ImgToolsService) {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.data.getLining(this.id).then(lining => {
        this.lining = lining;
        console.log(lining);
        this.selectedColours = [this.lining.primary_colour];   
        this.colourAdded();
        this.isLoading = false;
      });
    });
  }

  public ngOnInit(): void {

  }

  private filterColours(value: string): void {
    this.filteredColours = this.coloursMock.filter((item: any) => {
      if (value) {
        return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
      } else {
        return false;
      }
    }).filter((filteredItem: any) => {
      return this.selectedColours ? this.selectedColours.indexOf(filteredItem) < 0 : true;
    });
  }

  private colourAdded(): void {
    if (this.selectedColours.length >= 1)
      this.colourAddition = false;
  }

  private colourRemoved(): void {
    if (this.selectedColours.length < 1)
      this.colourAddition = true;
  }

  private fileUploadSelect(file: File): void {
    this._loadingService.register('overlayStarSyntax');
    this.uploadedImg = file;
    this.ng2ImgToolsService.resizeExactCrop([file], 180, 180).subscribe(result => {
        console.info(result);
        this.data.uploadImage(result).then(_response => {
          this.uploadedThumb = _response;
          this._loadingService.resolve('overlayStarSyntax');
          console.info(_response);
        });
    }, error => {
        this.fileUploadCancel();
        this.error("Thumbnail Creation Failed", "Please try select your image again");
        this._loadingService.resolve('overlayStarSyntax');
    });
  }

  private fileUploadCancel(): void {
    this.uploadedImg = {};
  }

  private updateLining(): void {      
    if(this.uploadedThumb) {
      this._loadingService.register('overlayStarSyntax');
      if(this.checkData()) {
        this.uploading = true;
        this.fileUploading = "Uploading now, please wait.";
        console.log(this.uploadedThumb);
          this.data.uploadImage(this.uploadedImg).then(response => {
            let arr = [];
            arr.push(this.uploadedThumb);
            arr.push(response);

            let lining = this.lining;
            lining.primary_colour = this.selectedColours[0];
            lining.image_urls = arr;

            this.data.updateLining(this.id, lining).then(createdLining => {
              this.clearData();
              console.log(createdLining);
              if(!!createdLining) {
                this.success("Linings updated", "All linings have been processed and updated");
              } else {
                this.error("Lining update failed", "Unknown error, empty response");
              }
            });
        }).catch(ex => {
          this.error("Lining update failed", ex);
          console.log(ex);
          this.uploading = false;
        });
      }
    } else {
      this.error("Lining update failed", "Please select an image.");
    }
  }

  private checkData(): boolean {
    if(!(!!this.lining.name)) {
      this.error("Lining update failed", "Please enter a name.");
      return false;
    } else if(!(!!this.lining.description)) {
      this.error("Lining update failed", "Please enter a short description.");
      return false;
    } else if(!(!!this.lining.price) || this.lining.price === 0) {
      this.error("Lining update failed", "Please enter a price, do you want this to be free?");
      return false;
    }
    return true;
  }

  private clearData(): void {
    this.uploading = false;
    this.fileUploading = "";
    this.lining = {};
    this.selectedColours = [];
    this.uploadedThumb = '';
    this.colourAddition = true;
  }

  private error(title, error): void {
    var toastOptions:ToastOptions = {
     title: title,
     msg: error
    };

    this.toastyService.warning(toastOptions);
    this._loadingService.resolve('overlayStarSyntax');
  }

  private success(title, message): void {
    var toastOptions:ToastOptions = {
     title: title,
     msg: message
    };

    this.toastyService.success(toastOptions);
    this._loadingService.resolve('overlayStarSyntax');
  }

}
