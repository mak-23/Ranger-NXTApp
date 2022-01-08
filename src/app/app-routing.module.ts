import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NXTComponentComponent } from './nxt-component/nxt-component.component';
const routes: Routes = [
  {
    path: ':lang/my-claims/:id',
    component: NXTComponentComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
