import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { JwtRepositoryService } from 'src/app/db/repository/jwt-repository/jwt-repository.service';
import { UserLoginBorder } from 'src/app/logic/borderclasses/UserLoginBorder';
import { AuthenticationGatewayService } from 'src/app/logic/gateway/authentication-gateway/authentication-gateway.service';

// ng g c view/features/login

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // template data
  errorMsg: string = '';

  constructor(
    private authGateway: AuthenticationGatewayService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmitButtonClicked(form: NgForm, button: HTMLButtonElement): void {
    if ($(button).find('.spinner-border').is(':hidden')) {
      $(button).find('spinner-border').show();

      this.authGateway.login({
        email: form.value.email,
        password: form.value.password
      } as UserLoginBorder).subscribe(authenticated => {
        $(button).find('.spinner-border').hide();

        if (authenticated) {
          this.router.navigate(['/search']);
        } else {
          $('#error-comp').show();
          this.errorMsg = 'Email oder Passwort falsch!';
        }
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
