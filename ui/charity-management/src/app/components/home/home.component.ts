import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CampaignManagementComponent } from '../campaign-management/campaign-management.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TabViewModule, CommonModule, ButtonModule, CampaignManagementComponent, DashboardComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  activeIndex: number = 0;

  onTabChange(event: any) {
    this.activeIndex = event.index;
  }
}
