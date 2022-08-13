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
  pageSize = 10;
  page = 1;
  totalRecords;
  rowsPerPageOptions = [10, 20, 30];
  pagingInfo:any;
  httpService: HttpService;
  constructor(httpService: HttpService) {
    this.httpService = httpService;

  }

  bindSubmittalsGrid() {
    let url = `Home/submittal/all?pageNumber=${this.page}&pageSize=${this.pageSize}`
    if (this.searchText) {
      url = url + `&searchText=${this.searchText}`
    }
    this.httpService.get(url).toPromise().then((value: any) => {
      this.list = value["data"] || [];
      this.totalRecords = value.totalCount
      this.isListFetch = true;
      this.renderPaging()
    });
  }
  renderPaging = () => {
    this.pagingInfo={
      start:((this.page - 1) * this.pageSize + 1),
      end: (this.pageSize * this.page > this.totalRecords ? this.totalRecords : this.pageSize * this.page)
    }
    
  }
  searchList() {
    this.bindSubmittalsGrid()
  }

  paginate = (event) => {
    if (this.page - 1 != (event.first / event.rows)) {
      this.page = (event.first / event.rows) + 1;
      this.bindSubmittalsGrid();
    }

  }

  nextPage = (event) => {
    if (this.pageSize != event.rows) {
      this.page = 0;
      this.pageSize = event.rows;
      this.bindSubmittalsGrid();
    }
  }

  ngOnInit(): void {
    this.bindSubmittalsGrid();
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
