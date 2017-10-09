import {NgModule} from '@angular/core';

//Import all material.io components here
import {MatButtonModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material';
import {MatMenuModule} from '@angular/material';
import {MatSidenavModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material';
import {MatIconModule} from '@angular/material';
import {MatCardModule} from '@angular/material';
import {MatInputModule} from '@angular/material';
import {MatGridListModule} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material';
import {MatSelectModule} from '@angular/material';
import {MatDialogModule} from '@angular/material';
import {MatRadioModule} from '@angular/material';
import {MatSlideToggleModule} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule, MatMenuModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatCardModule, MatInputModule,
    MatGridListModule, MatProgressSpinnerModule, MatSelectModule, MatDialogModule, MatRadioModule, MatAutocompleteModule
  ],
  exports: [
    MatButtonModule, MatMenuModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatCardModule, MatInputModule,
    MatGridListModule, MatProgressSpinnerModule, MatSelectModule, MatDialogModule, MatRadioModule, MatAutocompleteModule
  ]
})
export class MaterialComponents { }
