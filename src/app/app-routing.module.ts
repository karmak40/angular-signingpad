import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CanvasSignatureComponent } from './canvas-signature/canvas-signature.component';

const routes: Routes = [
  { path: 'canvas-signature', component:  CanvasSignatureComponent},
  { path: '.', component:  AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


