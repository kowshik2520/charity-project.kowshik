import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ApiService } from '../../services/api.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, // Angular common utilities
    TableModule,  // PrimeNG table module
    ButtonModule, // PrimeNG button module
    CardModule,
    RouterModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  donations: any[] = [];

  displayDialog: boolean = false;
  donationForm: FormGroup;
  editDonationData: any;
  campaigns: any[] = [];

  constructor(private fb: FormBuilder, private apiSrv: ApiService) {
    this.donationForm = this.fb.group({
      donor_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      campaign_id: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCampaigns();
    this.getAllDonations();
  }

  getAllDonations() {
    this.apiSrv.getDonations().subscribe((res: any) => {
      console.log(res, 888);
      this.donations = res;
    })
  }

  loadCampaigns() {
    this.apiSrv.getCampaigns().subscribe((data: any) => {
      console.log(data, "campaigns");

      this.campaigns = data;
    });
  }

  showDialog() {
    this.displayDialog = true;
    this.editDonationData = null;
    this.donationForm.reset();
  }

  addDonation() {
    if (this.donationForm.valid) {
      if (this.editDonationData) {
        this.apiSrv.updateDonation(this.editDonationData.id, this.donationForm.value).subscribe((res: any) => {
          this.getAllDonations();
        });
      } else {
        this.apiSrv.createDonation(this.donationForm.value).subscribe((res: any) => {
          console.log(res, "response");
          this.getAllDonations();
        })
      }
      this.donationForm.reset();
      this.displayDialog = false;
    }
  }

  editDonation(donation: any) {
    this.editDonationData = donation;
    console.log('Edit donation:', donation);
    this.displayDialog = true
    this.donationForm.patchValue(donation);
  }

  deleteDonation(donation: any) {
    this.donations = this.donations.filter((d) => d !== donation);
    this.apiSrv.deleteDonation(donation.id).subscribe((res: any) => {
      this.getAllDonations();
    })
  }

  getCampaignNameById(campaignId: number) {
    return this.campaigns.find((camp: any) => camp.id == campaignId).name ?? "null";
  }
}
