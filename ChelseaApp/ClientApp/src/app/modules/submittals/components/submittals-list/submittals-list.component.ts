import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../components/http.service';

@Component({
  selector: 'app-submittals-list',
  templateUrl: './submittals-list.component.html',
  styleUrls: ['./submittals-list.component.scss']
})
export class SubmittalsComponent implements OnInit {
  list: any = [];
  isListFetch = false;
  placeholder = 'http://placehold.it/200x200';
  searchText: string = "";
  limit = 2;
  page = 0;
  httpService: HttpService;
  constructor(httpService: HttpService) {
    this.httpService = httpService;

  }

  bindSubmittalsGrid() {
    this.httpService.get("Home/submittal/list").toPromise().then(value => {
      this.list = value || [];
      this.isListFetch = true;
    });
  }
  searchList() {
    this.httpService.get("Home/submittal/list/" + this.searchText).toPromise().then(value => {
      this.list = value || [];
      this.isListFetch = true;
    });
  }

  ngOnInit(): void {
    this.bindSubmittalsGrid();
  }

  paginate(event: any) {
    if (this.page !== event.page) {
      this.page = event.page;
      this.bindSubmittalsGrid();
    }
  }
  errorHandler(event: any) {
    console.debug(event);
    event.target.src = "../../../../../assets/images/merge-icons/edit.png";
  }
}
