import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { UserLoginBorder } from 'src/app/business_logic/borderclasses/UserLoginBorder';
import { AuthGatewayService } from 'src/app/business_logic/service/auth-gateway/auth-gateway.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // template data
  errorMsg: string = '';

  constructor(
    private authGateway: AuthGatewayService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmitButtonClicked(form: NgForm, button: HTMLButtonElement): void {
    if ($(button).find('.spinner-border').hasClass('d-none')) {
      $(button).find('.spinner-border').removeClass('d-none');

      this.authGateway.login({
        email: form.value.email,
        password: form.value.password
      } as UserLoginBorder).subscribe(authenticated => {
        setTimeout((): void => {
          $(button).find('.spinner-border').addClass('d-none');

          if (authenticated) {
            this.router.navigate(['/search']);
          } else {
            if ($('#error-comp').is(':hidden')) {
              $('#error-comp').show();
            }
            this.errorMsg = 'Email und/oder Passwort falsch!';
          }
        }, 1000);
      });
    }
  }

  onPasswordButtonClicked(passwdInput: HTMLInputElement): void {
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
}
