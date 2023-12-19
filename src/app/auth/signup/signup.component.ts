import { Component } from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService, IUserLogin, USERS_KEY} from "../../../core/services/auth/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  constructor(private fb: FormBuilder,
              private router: Router,
              private _snackBar: MatSnackBar,
              private authService: AuthService) {}

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-Яа-я]?[\s\]?[А-Яа-я]{2,29}$/)]],
    email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    passwordRepeat: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]]
  })

  signup(): void {
    const user: IUserLogin = {
      name: this.userName.value,
      email: this.userEmail.value,
      password: this.userPassword.value,
    };

    if (this.signupForm.valid) {
      const users = localStorage.getItem(USERS_KEY);
      const userList: IUserLogin[] = users ? JSON.parse(users) : [];
      const emailIsAlreadyTaken = !!userList.find(user => user.email === this.userEmail.value)

      if (emailIsAlreadyTaken) {
        this._snackBar.open('Пользователь с таким email уже существует');
        return;
      }
      this.authService.signup(user);
      this._snackBar.open('Вы успешно зарегистрировались');
      this.router.navigate(['/books'])
    }

  }

  get userName() {
    return this.signupForm.get('name') as FormControl;
  }
  get userEmail() {
    return this.signupForm.get('email') as FormControl;
  }
  get userPassword() {
    return this.signupForm.get('password') as FormControl;
  }
  get userPasswordRepeat() {
    return this.signupForm.get('passwordRepeat') as FormControl;
  }

}
