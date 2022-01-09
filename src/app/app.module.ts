import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyDatePickerModule } from 'mydatepicker';
import { NxtAppModule } from 'nxt-app';
//import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
//import {TranslateHttpLoader} from '@ngx-translate/http-loader';
//import {HttpClient, HttpClientModule} from '@angular/common/http';
import { NXTComponentComponent } from './nxt-component/nxt-component.component';


@NgModule({
  declarations: [
    AppComponent,
    NXTComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NxtAppModule,
    MyDatePickerModule,
  ],
  exports: [ NXTComponentComponent]
 
})
export class AppModule { }
