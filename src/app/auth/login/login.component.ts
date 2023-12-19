import { Component } from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService, IUserLogin, USERS_KEY} from "../../../core/services/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private fb: FormBuilder,
              private router: Router,
              private _snakeBar: MatSnackBar,
              private authService: AuthService) {
  }

  loginForm = this.fb.group({
    email: ['', [Validators.pattern(/^\S+@\S+\.\S+$/), Validators.required]],
    password: ['', [Validators.required]]
  })

  get userEmail() {
    return this.loginForm.get('email') as FormControl;
  }
  get userPassword() {
    return this.loginForm.get('password') as FormControl;
  }

  login(): void {
    if (this.loginForm.valid) {
      const users = localStorage.getItem(USERS_KEY);
      const usersList: IUserLogin[] = users ? JSON.parse(users) : [];
      const authUser = usersList.find(user => user.email === this.userEmail.value);

      if (authUser) {
        if (authUser.password === this.userPassword.value) {
          this.authService.login(authUser);
          this._snakeBar.open('Вы успешно авторизовались');
          this.router.navigate(['/books']);
        } else {
          this._snakeBar.open('Пароль не верный');
        }
      } else {
        this._snakeBar.open('Пользователя с таким email не существует');
      }
    }
  }

}
