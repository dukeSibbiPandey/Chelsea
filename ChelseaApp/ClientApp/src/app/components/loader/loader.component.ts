import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(private _CommonService: CommonService) { }
  activeLoader: Subject<boolean> = this._CommonService.activeLoader;
  ngOnInit(): void {
  }

}


