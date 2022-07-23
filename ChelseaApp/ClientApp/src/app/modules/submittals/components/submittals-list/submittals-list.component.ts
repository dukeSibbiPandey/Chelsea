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
  pageSize = 2;
  page = 1;
  httpService: HttpService;
  constructor(httpService: HttpService) {
    this.httpService = httpService;

  }

  bindSubmittalsGrid() {
    let url = `Home/submittal/all?pageNumber=${this.page}&pageSize=${this.pageSize}`
    if (this.searchText) {
      url = url + `&searchText=${this.searchText}`
    }
    this.httpService.get(url).toPromise().then(value => {
      this.list = value["data"] || [];
      this.isListFetch = true;
    });
  }
  searchList() {
    this.bindSubmittalsGrid()
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
  niceBytes(x: any) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
  }
}
