import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from '../../model';
import { FormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class Login {

  signupUser: User = {
    username: '',
    email: '',
    password: '',
  }

  loginUser: User = {
    username: '',
    email: '',
    password: '',
  }

  loginErrorMessage: string = '';
  loginSuccessMessage: string = '';
  signUpErrorMessage: string = '';
  signUpSuccessMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  handleSignUp() {
    const url = 'http://localhost:5027/api/User/Registration';
    this.http.post(url, this.signupUser).subscribe({
      next: (res) => {
        console.log("User registered successfully", res)
        this.signupUser.username = '';
        this.signupUser.email = '';
        this.signupUser.password = '';
        this.signUpSuccessMessage = 'User registered successfully';
        this.signUpErrorMessage = '';
      },
      error: (err) => {
        console.error('Error registering user', err)
        this.signUpErrorMessage = 'Error registering user';
        this.signupUser.username = '';
        this.signupUser.email = '';
        this.signupUser.password = '';
      }
    });
  }

  handleLogin() {
    const url = 'http://localhost:5027/api/User/Login';
    const loginData = {
      email: this.loginUser.email,
      password: this.loginUser.password
    }

    this.http.post<any>(url, loginData, { withCredentials: true }).subscribe({
      next: (res) => {
        console.log('Login successful', res);

        //localStorage.setItem('token', res.token);
        // Optionally, store user info if needed
        //localStorage.setItem('user', JSON.stringify(res.user));

        // this.loginUser.email = '';
        // this.loginUser.password = '';
        this.loginSuccessMessage = 'Login Successful.';
        //console.log('Token after login:', localStorage.getItem('token'));

        this.loginErrorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/dashboard']); // your target route
        }, 1000); // 1 second delay

    },
      error: (err) => {
        console.log('Login failed', err);
        this.loginErrorMessage = 'Wrong password or e-mail.';
        this.loginUser.password = '';
      }
  });

  }
}
