// import { Component, computed } from '@angular/core';
// import { RouterOutlet, RouterLink, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from './core/auth.service';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, RouterLink],
//   templateUrl: './app.component.html',
// })
// export class AppComponent {
//   user = this.auth.user; // ✅ signal
//   isAdmin = computed(() => this.user()?.role === 'ADMIN'); // ✅ call user()

//   constructor(private auth: AuthService, private router: Router) {}

//   logout() {
//     this.auth.logout().subscribe(() => {
//       this.user.set(null);
//       this.router.navigate(['/login']);
//     });
//   }
// }


import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
})
export class AppComponent {
  user = this.auth.user;

  isAdmin = computed(() => this.user()?.role === 'ADMIN');
  isOwner = computed(() => this.user()?.role === 'OWNER');
  isUser  = computed(() => this.user()?.role === 'USER');

  // admin should not see create/downline (as per your choice)
  canSeeUserMenus = computed(() => !!this.user() && !this.isAdmin());

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout().subscribe(() => {
      this.user.set(null);
      this.router.navigate(['/login']);
    });
  }
}
