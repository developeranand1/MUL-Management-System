// import { Component } from '@angular/core';
// import { UserService } from '../../core/user.service';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-create-user',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './create-user.component.html',
//   styleUrl: './create-user.component.css'
// })
// export class CreateUserComponent {
//   username = '';
//   password = '';

//   constructor(private users: UserService) {}

//   create() {
//     this.users.createUser({ username: this.username, password: this.password }).subscribe({
//       next: () => alert('User created'),
//       error: (e) => alert(e?.error?.message || 'Error'),
//     });
//   }
// }

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  username = '';
  password = '';

  constructor(private users: UserService) {}

  create() {
    this.users.createUser({ username: this.username, password: this.password }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'User created',
          text: `User "${this.username}" created successfully.`
        });
        this.username = '';
        this.password = '';
      },
      error: (e) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: e?.error?.message || 'Error creating user'
        });
      }
    });
  }
}

