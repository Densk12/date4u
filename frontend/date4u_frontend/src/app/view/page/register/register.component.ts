import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { UserRegistrationBorder } from 'src/app/business_logic/borderclasses/UserRegistrationBorder';
import { AuthService } from 'src/app/business_logic/service/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  // template attributes
  errorMsg = '';
  hornlengths: number[] | undefined;
  genders: Array<string> = ['Weiblich', 'Männlich', 'Divers'];
  birthday: string | undefined;
  hornlength = 1;
  gender = 0;
  attractedToGender = 0;

  // internal attributes
  @ViewChild('datePickerInput') private datePickerInputRef: ElementRef | any;
  @ViewChild('passwordInput') private passwordInputRef: ElementRef | any;
  @ViewChild('passwordInputRepeat') private passwordInputRepeatRef: ElementRef | any;
  private profilePhoto: File | undefined;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.birthday = this.formatDate(new Date().setMilliseconds(new Date().getMilliseconds() - (18 * 365 * 24 * 60 * 60 * 1000)));
    this.hornlengths = Array.from({ length: 30 }, (_, i) => i + 1);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    $((): void => {
      $(this.datePickerInputRef.nativeElement).on('change keydown paste input propertychange keyup blur', (): void => {
        if (this.birthday === '') {
          this.birthday = this.formatDate(new Date().setMilliseconds(new Date().getMilliseconds() - (18 * 365 * 24 * 60 * 60 * 1000)));
        }
      });
    });
  }

  onProfilePhotoInputAdded(event: any): void {
    this.profilePhoto = event.target.files[0];
  }

  onPasswordButtonClicked(passwdInput: HTMLElement): void {
    if ($(passwdInput).attr('type') === 'password') {
      $(passwdInput).attr('type', 'text');

      $(passwdInput)
        .parent()
        .find('i')
        .attr('class', 'fa-sharp fa-solid fa-eye-slash');

    } else {
      $(passwdInput).attr('type', 'password');

      $(passwdInput)
        .parent()
        .find('i')
        .attr('class', 'fa-sharp fa-solid fa-eye');
    }
  }

  onSubmitButtonClicked(form: NgForm, button: HTMLButtonElement): void {
    if ($(button).find('.spinner-border').hasClass('d-none')) {
      const $firstInputPasswordfield = $(this.passwordInputRef.nativeElement);
      const $secondInputPasswordfield = $(this.passwordInputRepeatRef.nativeElement);

      if ($firstInputPasswordfield.val() !== $secondInputPasswordfield.val()) {
        if ($('#error-comp').is(':hidden')) {
          $('#error-comp').show();
        }
        this.errorMsg = 'Passwörter stimmen nicht überein!';
        return;
      }

      $(button).find('.spinner-border').removeClass('d-none');

      this.authService.register({
        email: form.value.email,
        password: form.value.password,
        birthday: this.birthday,
        nickname: form.value.nickname,
        hornlength: this.hornlength,
        gender: this.gender,
        attractedToGender: this.attractedToGender,
        description: form.value.description
      } as UserRegistrationBorder,
        this.profilePhoto as any)
        .subscribe((authenticated: boolean) => {
          setTimeout((): void => {
            $(button).find('.spinner-border').addClass('d-none');

            if (authenticated) {
              this.router.navigate(['/search']);
            } else {
              if ($('#error-comp').is(':hidden')) {
                $('#error-comp').show();
              }
              this.errorMsg = 'Die Email-Adresse ist bereits vergeben!';
            }
          }, 1000);
        });
    }
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
