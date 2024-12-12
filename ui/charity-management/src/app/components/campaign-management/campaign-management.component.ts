import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-campaign-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TableModule,
    FormsModule,
    CardModule,
    InputTextareaModule
  ],
  providers: [MessageService],
  templateUrl: './campaign-management.component.html',
  styleUrl: './campaign-management.component.scss'
})
export class CampaignManagementComponent {

  campaigns: any[] = [];
  displayDialog: boolean = false;
  campaign: any = {};

  campaignForm!: FormGroup;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadCampaigns();
    this.initializeForm();
  }

  // Initialize Reactive Form
  initializeForm() {
    this.campaignForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      goal_amount: [0, [Validators.required, Validators.min(1)]]
    });
  }

  loadCampaigns() {
    this.apiService.getCampaigns().subscribe((data: any) => {
      this.campaigns = data;
    });
  }

  showDialog() {
    this.campaign = {};
    this.displayDialog = true;
    this.campaignForm.reset();
  }

  editCampaign(campaign: any) {
    this.campaignForm.patchValue(campaign);
    this.displayDialog = true;
  }

  saveCampaign() {
    if (this.campaignForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
      return;
    }

    const campaignData = this.campaignForm.value;

    if (campaignData.id) {
      // Update existing campaign
      this.apiService.updateCampaign(campaignData.id, campaignData).subscribe(() => {
        this.loadCampaigns();
        this.displayDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Campaign updated successfully' });
      });
    } else {
      // Create new campaign
      this.apiService.createCampaign(campaignData).subscribe(() => {
        this.loadCampaigns();
        this.displayDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Campaign created successfully' });
      });
    }
  }

  deleteCampaign(id: number) {
    this.apiService.deleteCampaign(id).subscribe(() => {
      this.loadCampaigns();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Campaign deleted' });
    });
  }
}
