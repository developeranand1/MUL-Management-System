import { Component } from '@angular/core';
import { AdminService } from '../../core/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-summary.component.html',
  styleUrl: './admin-summary.component.css'
})
export class AdminSummaryComponent {
total = 0;
  users: any[] = [];
  constructor(private admin: AdminService) {}

  ngOnInit() {
    this.admin.summary().subscribe((r: any) => {
      this.total = r.totalSystemBalance;
      this.users = r.users;
    });
  }
}