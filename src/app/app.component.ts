import { Component, enableProdMode, OnInit } from '@angular/core';
import {  ActivatedRoute,Params } from '@angular/router'; 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Ranger-NXTApp';
  qbId = 'a049D000002qLDVQA2';
  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    
}
}enableProdMode();