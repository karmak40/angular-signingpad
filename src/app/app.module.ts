import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasSignatureComponent } from './canvas-signature/canvas-signature.component';
import { SaveService } from './services/SaveService';

@NgModule({
  declarations: [
    AppComponent,
    CanvasSignatureComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    SaveService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
