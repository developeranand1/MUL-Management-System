import { Component } from '@angular/core';
import { UserService } from '../../core/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-downline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './downline.component.html',
  styleUrl: './downline.component.css'
})
export class DownlineComponent {
 downline: any[] = [];
  constructor(private users: UserService) {}

  ngOnInit() {
    this.users.downline().subscribe((r) => (this.downline = r.downline));
  }
}
