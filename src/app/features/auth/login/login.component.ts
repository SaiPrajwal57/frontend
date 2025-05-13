import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../../core/services/auth.service';
import { response } from 'express';
 
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; 
 
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth:AuthService
  ) {}
 
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
 
  async onSubmit() {
    if (this.loginForm.invalid) {
      alert('Please enter valid credentials.');
      return;
    }
 
    const { email, password } = this.loginForm.value;
    const credentials = {
      email: email,
      password: password,
    };
 
    console.log('Sending credentials:', credentials); // Debugging
 
    try {
      this.auth.login(credentials).subscribe({
        next: (response) => {
          console.log('Login response:', response); // Debugging
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userId', response.userId);
 
            this.auth.setUser(response.user);
            this.router.navigate(['/dashboard']);
          } else {
            alert('Invalid credentials. Please try again.');
          }
        },
        error: (error) => {
          console.error('Login error:', error); // Debugging
          alert('Login failed. Please check your credentials.');
        },
      });
    } catch (error) {
      console.error('Unexpected error:', error); // Debugging
      alert('Something went wrong. Please try again.');
    }
  }
}