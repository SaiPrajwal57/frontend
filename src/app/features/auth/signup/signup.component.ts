import { Component, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'; 

import { REGEX } from '../constants/regex.constants';
 
@Component({

  selector: 'app-signup',

  standalone: true,

  templateUrl: './signup.component.html',

  styleUrls: ['./signup.component.css'],

  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule, FormsModule], 

})

export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  submitted = false;

  showModal = false;

  showPassword = false;

  passwordStrength: number = 0;

  emailVerified: boolean = false;

  verificationCodeSent: boolean = false;

  enteredVerificationCode: string = '';

  errorMessage: string = '';
 
  securityQuestions: string[] = [

    'What was your childhood nickname?',

    'What is the name of your favorite childhood friend?',

    'What is your mother’s maiden name?',

    'What was the name of your first pet?',

    'What is your favorite book?',

  ];
 
  constructor(

    private fb: FormBuilder,

    private http: HttpClient,

    private router: Router

  ) {}
 
  ngOnInit(): void {

    this.signupForm = this.fb.group(

      {

        name: ['', [Validators.required, Validators.pattern(REGEX.name)]],

        UserName: ['', [Validators.required, Validators.pattern(REGEX.name)]],

        email: ['', [Validators.required, Validators.pattern(REGEX.email)]],

        password: ['', [

          Validators.required,

          Validators.minLength(6),

          Validators.pattern(REGEX.password)

        ]],

        confirmPassword: ['', [

          Validators.required,

          Validators.minLength(6),

          Validators.pattern(REGEX.password)

        ]],

        securityQuestion: ['', Validators.required],

        securityAnswer: ['', Validators.required],

        verificationCode: [''], 

      },

      { validators: this.passwordMatchValidator }

    );
 
    this.signupForm.get('password')?.valueChanges.subscribe(value => {

      this.passwordStrength = this.calculatePasswordStrength(value);

    });

  }
 
  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {

    const password = group.get('password')?.value;

    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };

  };
 
  calculatePasswordStrength(password: string): number {

    let strength = 0;

    if (password.length >= 6) strength += 25;

    if (/[A-Z]/.test(password)) strength += 25;

    if (/[0-9]/.test(password)) strength += 25;

    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    return Math.min(strength, 100);

  }
 
  getStrengthClass(strength: number): string {

    if (strength === 100) return 'bg-success';

    if (strength > 75) return 'bg-info';

    if (strength > 50) return 'bg-warning';

    return 'bg-danger';

  }
 
  getStrengthLabel(strength: number): string {

    if (strength === 100) return 'Strong';

    if (strength > 75) return 'Good';

    if (strength > 50) return 'Fair';

    return 'Weak';

  }
 
  getStrengthTextClass(strength: number): string {

    if (strength === 100) return 'text-success';

    if (strength > 75) return 'text-info';

    if (strength > 50) return 'text-warning';

    return 'text-danger';

  }
 
  get f() {

    return this.signupForm.controls;

  }
 
  sendVerificationCode(): void {

    const email = this.signupForm.get('email')?.value;
 
    if (!this.signupForm.get('email')?.valid) {

      this.errorMessage = 'Please enter a valid email address.';

      return;

    }
 
    this.errorMessage = ''; 
 
    this.http.post('http://localhost:5154/api/EmailVerification/send', { email }).subscribe({

      next: (response: any) => {

        if (response?.success) {

          this.verificationCodeSent = true;

          alert(response.message || `Verification code sent to ${email}`);

        } else {

          this.verificationCodeSent = false;

          this.errorMessage = response?.message || 'Failed to send verification code.';

        }

      },

      error: (error) => {

        console.error('Error sending verification code', error);

        this.errorMessage = 'Failed to send verification code. Please try again.';

      },

    });

  }
 
  verifyCode(): void {

    const email = this.signupForm.get('email')?.value;

    const code = this.signupForm.get('verificationCode')?.value;
 
    console.log('Sending to backend:', { email, code });
 
    this.http.post('http://localhost:5154/api/EmailVerification/verify', { email, code }).subscribe({

      next: (response: any) => {

        if (response?.success) {

          this.emailVerified = true;

          this.errorMessage = '';

          alert(response.message);

        } else {

          this.emailVerified = false;

          this.errorMessage = response.message;

        }

      },

      error: (error) => {

        console.error('Verify error:', error);

        const backendMessage = error?.error?.message;

        this.errorMessage = backendMessage || 'Verification failed.';

      }

    });

  }
 
  async onSubmit() {

    this.submitted = true;

    const form = this.signupForm.value;
 
    // Check if passwords match

    if (form.password !== form.confirmPassword) {

      alert('Passwords do not match');

      return;

    }
 
    if (!this.emailVerified) {

      this.errorMessage = 'Please verify your email before submitting the form.';

      return;

    }
 
    try {

      const newUser = {

        Id: 0,

        Name: form.name,

        Email: form.email,

        UserName: form.UserName,

        Password: form.password,

        ConfirmPassword: form.confirmPassword,

        SecurityQuestion: form.securityQuestion,

        SecurityAnswer: form.securityAnswer,

      };
 
      console.log('New user:', newUser);
 
      // Send the new user object to the backend

      this.http.post('http://localhost:5154/api/Auth/register', newUser).subscribe({

        next: (response) => {

          console.log('Response:', response);

          alert("Successfully registered");

          this.signupForm.reset();

        },

        error: (error) => {

          console.error('Signup error:', error);

          alert('Something went wrong. Please try again.');

        },

      });

    } catch (error) {

      console.error('Unexpected error:', error);

      alert('Something went wrong. Please try again.');

    }

  }
 
  togglePasswordVisibility(): void {

    this.showPassword = !this.showPassword;

  }
 
  closeModal(): void {

    this.showModal = false;

    this.router.navigate(['/login']);

  }

}
 