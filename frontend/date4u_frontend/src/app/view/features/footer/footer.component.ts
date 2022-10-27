import { Component, OnInit } from '@angular/core';

// ng g c view/features/footer

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
