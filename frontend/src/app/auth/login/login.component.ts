// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../core/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'] // ✅ plural
// })
// export class LoginComponent implements OnInit {
//   captchaQuestion = '';

//   form = this.fb.group({
//     username: ['', Validators.required],
//     password: ['', Validators.required],
//     captchaAnswer: ['', Validators.required],
//   });

//   constructor(
//     private auth: AuthService,
//     private fb: FormBuilder,
//     private router: Router,
//      private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.refreshCaptcha();
//   }

//   refreshCaptcha(): void {
//     this.auth.captcha().subscribe({
//       next: (r) => {
//         console.log('CAPTCHA response:', r);
//         this.captchaQuestion = r.question;
//       },
//       error: (err) => {
//         console.error('CAPTCHA error:', err);
//         alert('Captcha API not reachable. Check backend + CORS.');
//       }
//     });
//   }

// submit(event?: Event) {
//   event?.preventDefault();
//   event?.stopPropagation();

//   if (this.form.invalid) return;

//   console.log("Submitting login payload:", this.form.value);

//   this.auth.login(this.form.value as any).subscribe({
//     next: () => {
//       this.auth.me().subscribe({
//         next: (me) => {
//           this.auth.user.set(me.user);
//           const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
//           this.router.navigateByUrl(returnUrl);
//         },
//         error: (e) => {
//           console.error("ME failed after login:", e);
//           this.router.navigateByUrl('/');
//         }
//       });
//     },
//     error: (err) => {
//       console.error('LOGIN error', err);
//       this.refreshCaptcha();
//       alert(err?.error?.message || 'Login failed');
//     }
//   });
// }


// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  captchaQuestion = '';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    captchaAnswer: ['', Validators.required],
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.refreshCaptcha();
  }

  refreshCaptcha(): void {
    this.auth.captcha().subscribe({
      next: (r) => {
        console.log('CAPTCHA response:', r);
        this.captchaQuestion = r.question;
      },
      error: (err) => {
        console.error('CAPTCHA error:', err);
        Swal.fire({
          icon: 'warning',
          title: 'Captcha error',
          text: 'Captcha API not reachable. Please check backend / CORS.',
        });
      }
    });
  }

  submit(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Submitting login payload:', this.form.value);

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.auth.me().subscribe({
          next: (me) => {
            this.auth.user.set(me.user);

            // Optional mini toast (pure UI)
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: `Welcome back, ${me.user.username}`,
              showConfirmButton: false,
              timer: 1500
            });

            const returnUrl =
              this.route.snapshot.queryParamMap.get('returnUrl') || '/';
            this.router.navigateByUrl(returnUrl);
          },
          error: (e) => {
            console.error('ME failed after login:', e);
            this.router.navigateByUrl('/');
          }
        });
      },
      error: (err) => {
        console.error('LOGIN error', err);
        this.refreshCaptcha();

        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: err?.error?.message || 'Invalid credentials or CAPTCHA.',
        });
      }
    });
  }
}

