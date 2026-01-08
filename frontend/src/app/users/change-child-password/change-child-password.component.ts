// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { UserService } from '../../core/user.service';

// @Component({
//   standalone: true,
//   selector: 'app-change-child-password',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './change-child-password.component.html',
// })
// export class ChangeChildPasswordComponent implements OnInit {
//   children: any[] = [];
//   childId = '';
//   newPassword = '';

//   constructor(private users: UserService) {}

//   ngOnInit(): void {
//     this.users.children().subscribe((r: any) => (this.children = r.children ?? []));
//   }

//   change() {
//     if (!this.childId) return alert('Select a direct child');
//     if (!this.newPassword || this.newPassword.length < 6) return alert('Password min 6 chars');

//     this.users.changeChildPassword(this.childId, this.newPassword).subscribe({
//       next: () => {
//         alert('Password changed ✅');
//         this.newPassword = '';
//       },
//       error: (e) => alert(e?.error?.message || 'Failed')
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/user.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-change-child-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './change-child-password.component.html',
  styleUrls: ['./change-child-password.component.css']
})
export class ChangeChildPasswordComponent implements OnInit {
  children: any[] = [];
  childId = '';
  newPassword = '';

  constructor(private users: UserService) {}

  ngOnInit(): void {
    this.users.children().subscribe((r: any) => (this.children = r.children ?? []));
  }

  change() {
    if (!this.childId) {
      Swal.fire({
        icon: 'warning',
        title: 'Select a child',
        text: 'Please select a direct child user first.'
      });
      return;
    }

    if (!this.newPassword || this.newPassword.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak password',
        text: 'Password must be at least 6 characters long.'
      });
      return;
    }

    this.users.changeChildPassword(this.childId, this.newPassword).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Password changed',
          text: 'Child password updated successfully ✅'
        });
        this.newPassword = '';
      },
      error: (e) =>
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: e?.error?.message || 'Failed to change password'
        })
    });
  }
}

