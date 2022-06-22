import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-submittals',
  templateUrl: './submittals.component.html',
  styleUrls: ['./submittals.component.scss']
})
export class SubmittalsComponent implements OnInit {
  list: any = [];
  searchText: string= "";
  httpService: HttpService;
  constructor(httpService: HttpService)
  {
    this.httpService = httpService;
    
  }

  bindSubmittalsGrid(){
    this.httpService.get("Home/submittal/list").toPromise().then(value => {
      this.list = value;
    });
  }
  searchList() {
    this.httpService.get("Home/submittal/list/" + this.searchText).toPromise().then(value => {
      this.list = value;
    });
  }

  ngOnInit(): void {
    this.bindSubmittalsGrid();    
  }
}
