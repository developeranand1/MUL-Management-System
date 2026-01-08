import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/admin.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-level-users',
  imports: [CommonModule],
  templateUrl: './admin-level-users.component.html'
})
export class AdminLevelUsersComponent implements OnInit {
  users: any[] = [];

  
constructor(private admin: AdminService, private router: Router) {}


  ngOnInit() {
    this.admin.nextLevelUsers().subscribe((r: any) => this.users = r.users || []);
  }

  goCredit(userId: string) {
  this.router.navigate(['/admin/credit'], { queryParams: { targetUserId: userId } });
}

viewDownline(userId: string) {
  this.router.navigate(['/admin/downline', userId]);
}
}
