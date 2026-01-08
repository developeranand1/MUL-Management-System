// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { AdminService } from '../../core/admin.service';

// @Component({
//   standalone: true,
//   selector: 'app-admin-credit',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './admin-credit.component.html'
// })
// export class AdminCreditComponent implements OnInit {
//   targetUserId = '';
//   amount = 0;
//   note = 'Admin credit';

//   constructor(private admin: AdminService, private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.queryParamMap.get('targetUserId');
//     if (id) this.targetUserId = id;
//   }

//   credit() {
//     console.log('Admin credit payload:', { targetUserId: this.targetUserId, amount: this.amount });

//     if (!this.targetUserId) return alert('Target userId missing');
//     if (!this.amount || this.amount <= 0) return alert('Enter valid amount');

//     this.admin.credit(this.targetUserId, Number(this.amount), this.note).subscribe({
//       next: () => alert('Credited ✅ (deducted from parent automatically)'),
//       error: (e) => {
//         console.error('Credit error:', e);
//         alert(e?.error?.message || 'Credit failed');
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../core/admin.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-admin-credit',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-credit.component.html',
  styleUrls: ['./admin-credit.component.css']
})
export class AdminCreditComponent implements OnInit {
  targetUserId = '';
  amount = 0;
  note = 'Admin credit';

  constructor(private admin: AdminService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('targetUserId');
    if (id) this.targetUserId = id;
  }

  credit() {
    console.log('Admin credit payload:', { targetUserId: this.targetUserId, amount: this.amount });

    if (!this.targetUserId) {
      Swal.fire({
        icon: 'warning',
        title: 'Target user missing',
        text: 'Please enter a valid target user ID.'
      });
      return;
    }

    if (!this.amount || this.amount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid amount',
        text: 'Please enter a valid amount to credit.'
      });
      return;
    }

    this.admin.credit(this.targetUserId, Number(this.amount), this.note).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Credit successful',
          text: 'Credited ✅ (deducted from parent automatically)'
        });
      },
      error: (e) => {
        console.error('Credit error:', e);
        Swal.fire({
          icon: 'error',
          title: 'Credit failed',
          text: e?.error?.message || 'Credit failed'
        });
      }
    });
  }
}
