import { Component, Input, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  @Input() errorMsg: string;

  constructor() { 
    this.errorMsg = '';
  }

  ngOnInit(): void {
  }

  onCloseButtonClicked(): void {
    $('#error-comp').hide();
  }

}
