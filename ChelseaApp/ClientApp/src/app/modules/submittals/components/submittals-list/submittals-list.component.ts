import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../components/http.service';

@Component({
  selector: 'app-submittals-list',
  templateUrl: './submittals-list.component.html',
  styleUrls: ['./submittals-list.component.scss']
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
