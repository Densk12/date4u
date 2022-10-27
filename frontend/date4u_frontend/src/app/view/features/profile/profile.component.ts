import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as datepicker from 'js-datepicker';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';

// ng g c view/features/profile

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  // template attributes
  hornlengths: Array<number> | undefined;
  genders: Array<String> = ['Weiblich', 'Männlich', 'Divers'];
  images: Array<String> = [];
  nickname: String = 'Max Mustermann';

  // intern
  private datePicker: any;
  private carousel: bootstrap.Carousel | undefined;
  @ViewChild('datePickerInput') private datePickerInputRef: ElementRef | any;


  constructor() {
    this.hornlengths = Array.from({ length: 30 }, (_, i) => i + 1);

    this.images = ['assets/unicorn001.jpg',
      'assets/unicorn002.jpg',
      'assets/unicorn003.jpg',
      'assets/unicorn004.jpg',
      'assets/unicorn005.jpg',
      'assets/unicorn006.jpg'];
  }

  ngOnInit(): void {
    this.initDatePicker();
  }

  ngAfterViewInit(): void {
    this.initCarousel();
  }

  onDatepickerInputClicked(): void {
    this.datePicker.show();
  }


  onHornlengthSelected(event: any): void {
    console.log(event.target.value);
  }

  onGenderSelected(event: any): void {
    console.log(event.target.value);
  }

  onAttractedToGenderSelected(event: any): void {
    console.log(event.target.value);
  }

  onPrevCarouselButtonClicked(): void {
    this.carousel?.prev();
  }

  onNextCarouselButtonClicked(): void {
    this.carousel?.next();
  }

  onLikeClicked(like: HTMLElement): void {
    if ($(like).hasClass('animated')) {
      $(like).attr('class', 'fa-solid fa-thumbs-up');
    } else {
      $(like).attr('class', 'fa-regular fa-thumbs-up animated');
    }
  }

  onSaveButtonClicked(): void {
    console.log('click');
  }


  private initDatePicker(): void {
    this.datePicker = datepicker('.date-picker', {
      customDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      customMonths: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      onSelect: (instance: any, date: any) => {
        $(this.datePickerInputRef.nativeElement).val(this.formatDate(date));
      }
    });
  }

  private initCarousel(): void {
    const myCarousel = document.querySelector('.profile #profile-carousel')
    this.carousel = new bootstrap.Carousel(myCarousel as any, {
      interval: 1000,
      wrap: true,
      touch: true
    });

    $('.profile').find('.carousel-item').first().attr('class', 'carousel-item active');
  }

  private formatDate(date: any) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

}
