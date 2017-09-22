import {NgModule} from '@angular/core';

//Import all material.io components here
import {MdButtonModule} from '@angular/material';
import {MdCheckboxModule} from '@angular/material';
import {MdMenuModule} from '@angular/material';
import {MdSidenavModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdIconModule} from '@angular/material';
import {MdCardModule} from '@angular/material';
import {MdInputModule} from '@angular/material';
import {MdGridListModule} from '@angular/material';
import {MdProgressSpinnerModule} from '@angular/material';
import {MdSelectModule} from '@angular/material';
import {MdDialogModule} from '@angular/material';
import {MdRadioModule} from '@angular/material';
import {MdSlideToggleModule} from '@angular/material';
import {MdAutocompleteModule} from '@angular/material';

@NgModule({
  imports: [
    MdButtonModule, MdMenuModule, MdCheckboxModule, MdSidenavModule, MdToolbarModule, MdIconModule, MdCardModule, MdInputModule,
    MdGridListModule, MdProgressSpinnerModule, MdSelectModule, MdDialogModule, MdRadioModule, MdAutocompleteModule
  ],
  exports: [
    MdButtonModule, MdMenuModule, MdCheckboxModule, MdSidenavModule, MdToolbarModule, MdIconModule, MdCardModule, MdInputModule,
    MdGridListModule, MdProgressSpinnerModule, MdSelectModule, MdDialogModule, MdRadioModule, MdAutocompleteModule
  ]
})
export class MaterialComponents { }
