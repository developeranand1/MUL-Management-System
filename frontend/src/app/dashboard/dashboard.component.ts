

import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BalanceService } from '../core/balance.service';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  balance = 0;
  children: any[] = [];
  transactions: any[] = [];

  // Transfer
  receiverId = '';
  amount = 0;

  isAdmin = computed(() => this.user()?.role === 'ADMIN');
canTransfer = computed(() => !!this.user() && !this.isAdmin());   // OWNER + USER
canSeeStatement = computed(() => !!this.user() && !this.isAdmin());

  // Owner Recharge (optional but recommended)
  rechargeAmount = 0;

  user = this.auth.user;
  isOwner = computed(() => this.user()?.role === 'OWNER');

  constructor(
    private bal: BalanceService,
    private users: UserService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
  // Admin dashboard pe balance/statement/children load mat karo
  if (this.isAdmin()) {
    this.balance = 0;
    this.transactions = [];
    this.children = [];
    return;
  }

  this.bal.statement().subscribe((r: any) => {
    this.balance = r.balance ?? 0;
    this.transactions = r.transactions ?? [];
  });

  this.users.children().subscribe((r: any) => {
    this.children = r.children ?? [];
  });
}

  ownerRecharge() {
    if (!this.isOwner()) return;
    if (this.rechargeAmount <= 0) return;

    this.bal.selfRecharge(Number(this.rechargeAmount), 'Owner fund').subscribe({
      next: () => {
        alert('Owner recharged ✅');
        this.rechargeAmount = 0;
        this.load();
      },
      error: (e) => alert(e?.error?.message || 'Recharge failed')
    });
  }

  transferToChild() {
    console.log('Transfer payload:', { receiverId: this.receiverId, amount: this.amount });

    if (!this.receiverId) return alert('Select child user');
    if (this.amount <= 0) return alert('Enter valid amount');

    this.bal.transfer(this.receiverId, Number(this.amount), 'Owner to user transfer').subscribe({
      next: () => {
        alert('Transfer success ✅');
        this.amount = 0;
        this.load();
      },
      error: (e) => alert(e?.error?.message || 'Transfer failed')
    });
  }
}

