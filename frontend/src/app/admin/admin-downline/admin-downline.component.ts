import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../core/admin.service';
import { NodeComponent } from "./node/node.component";

@Component({
  standalone: true,
  selector: 'app-admin-downline',
  imports: [CommonModule, NodeComponent],
  templateUrl: './admin-downline.component.html',
})
export class AdminDownlineComponent implements OnInit {
  tree: any = null;

  constructor(private route: ActivatedRoute, private admin: AdminService) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId')!;
    this.admin.getDownline(userId).subscribe({
      next: (r: any) => (this.tree = r.root),
      error: (e) => alert(e?.error?.message || 'Failed to load downline')
    });
  }

  // helper for template recursion
  asArray(x: any) {
    return x?.children ?? [];
  }
}
