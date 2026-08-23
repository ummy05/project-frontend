// src/app/admin/licenses/licenses.ts

import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LicenseService } from '../../services/license.service';
import { AlertService } from '../../services/alert.service';

import { License } from '../../models/license.model';


@Component({

  selector: 'app-licenses',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './licenses.html',

  styleUrl: './licenses.css'

})
export class Licenses implements OnInit {


  // =====================================================
  // SERVICES
  // =====================================================

  private licenseService =
    inject(LicenseService);

  public alertService =
  inject(AlertService);


  // =====================================================
  // STATE
  // =====================================================

  licenses: License[] = [];

  filteredLicenses: License[] = [];

  selectedLicense: License | null = null;


  search = '';

  status = '';

  loading = false;


  // =====================================================
  // MODALS
  // =====================================================

  showViewModal = false;

  showEditModal = false;

  showAddModal = false;

  showRejectModal = false;


  // =====================================================
  // REJECTION
  // =====================================================

  rejectReason = '';

  licenseToRejectId: number | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadLicenses();

  }


  // =====================================================
  // LOAD ALL LICENSES
  // =====================================================

  loadLicenses(): void {

    this.loading = true;

    this.alertService.loading(
      'Loading licenses...'
    );


    this.licenseService
      .getAll()
      .subscribe({

        next: (res) => {

          this.licenses = res ?? [];

          this.filter();

          this.loading = false;

          this.alertService.close();

          this.cdr.detectChanges();

        },


        error: (error) => {

          this.loading = false;

          this.alertService.close();

          this.alertService.error(
            'Failed to Load Licenses',
            this.getErrorMessage(
              error,
              'Unable to retrieve licenses from the server.'
            )
          );

        }

      });

  }


  // =====================================================
  // FILTER
  // =====================================================

  filter(): void {

    const keyword =
      this.search
        .trim()
        .toLowerCase();


    this.filteredLicenses =
      this.licenses.filter((license) => {

        const matchesSearch =

          !keyword ||

          (license.businessName ?? '')
            .toLowerCase()
            .includes(keyword) ||

          (license.ownerName ?? '')
            .toLowerCase()
            .includes(keyword) ||

          (license.licenseNumber ?? '')
            .toLowerCase()
            .includes(keyword) ||

          (license.ownerEmail ?? '')
            .toLowerCase()
            .includes(keyword);


        const matchesStatus =

          !this.status ||

          license.status === this.status;


        return (
          matchesSearch &&
          matchesStatus
        );

      });

  }


  // =====================================================
  // VIEW LICENSE
  // =====================================================

  openView(
    license: License
  ): void {

    this.selectedLicense = {
      ...license
    };

    this.showViewModal = true;

  }


  // =====================================================
  // EDIT
  // =====================================================

  openEdit(
    license: License
  ): void {

    this.selectedLicense = {
      ...license
    };

    this.showEditModal = true;

  }


  // =====================================================
  // APPROVE LICENSE
  // =====================================================

  async approve(
    license: License
  ): Promise<void> {

    if (
      license.status !== 'PENDING'
    ) {

      return;

    }


    const confirmed =
      await this.alertService.confirm(

        'Approve License?',

        `Are you sure you want to approve ${license.licenseNumber}?`,

        'Approve'

      );


    if (!confirmed) {

      return;

    }


    this.alertService.loading(
      'Approving license...'
    );


    this.licenseService
      .approve(license.id)
      .subscribe({

        next: () => {

          this.alertService.close();

          this.alertService.success(
            'License Approved',
            `${license.licenseNumber} has been approved successfully.`
          );

          this.loadLicenses();

        },


        error: (error) => {

          this.alertService.close();

          this.alertService.error(
            'Approval Failed',
            this.getErrorMessage(
              error,
              'Unable to approve this license.'
            )
          );

        }

      });

  }


  // =====================================================
  // OPEN REJECT MODAL
  // =====================================================

  openReject(
    id: number
  ): void {

    this.licenseToRejectId = id;

    this.rejectReason = '';

    this.showRejectModal = true;

  }


  // =====================================================
  // CONFIRM REJECTION
  // =====================================================

  async confirmReject(): Promise<void> {

    if (
      !this.licenseToRejectId
    ) {

      return;

    }


    if (
      !this.rejectReason.trim()
    ) {

      this.alertService.warning(
        'Rejection Reason Required',
        'Please provide a reason for rejecting this license.'
      );

      return;

    }


    const confirmed =
      await this.alertService.confirm(

        'Reject License?',

        'This license application will be marked as rejected.',

        'Reject License'

      );


    if (!confirmed) {

      return;

    }


    this.alertService.loading(
      'Rejecting license...'
    );


    this.licenseService
      .reject(
        this.licenseToRejectId,
        this.rejectReason.trim()
      )
      .subscribe({

        next: () => {

          this.alertService.close();

          this.showRejectModal = false;

          this.alertService.success(
            'License Rejected',
            'The license application has been rejected successfully.'
          );

          this.resetReject();

          this.loadLicenses();

        },


        error: (error) => {

          this.alertService.close();

          this.alertService.error(
            'Rejection Failed',
            this.getErrorMessage(
              error,
              'Unable to reject this license.'
            )
          );

        }

      });

  }


  // =====================================================
  // CANCEL REJECTION
  // =====================================================

  cancelReject(): void {

    this.showRejectModal = false;

    this.resetReject();

  }


  private resetReject(): void {

    this.rejectReason = '';

    this.licenseToRejectId = null;

  }


  // =====================================================
  // DELETE
  // =====================================================

  async delete(
    license: License
  ): Promise<void> {

    const confirmed =
      await this.alertService.confirm(

        'Delete License?',

        `Are you sure you want to permanently delete ${license.licenseNumber}? This action cannot be undone.`,

        'Delete'

      );


    if (!confirmed) {

      return;

    }


    this.alertService.loading(
      'Deleting license...'
    );


    this.licenseService
      .delete(license.id)
      .subscribe({

        next: () => {

          this.alertService.close();

          this.alertService.success(
            'License Deleted',
            'The license has been deleted successfully.'
          );

          this.loadLicenses();

        },


        error: (error) => {

          this.alertService.close();

          this.alertService.error(
            'Delete Failed',
            this.getErrorMessage(
              error,
              'Unable to delete the license.'
            )
          );

        }

      });

  }


  // =====================================================
  // CLOSE MODALS
  // =====================================================

  closeModals(): void {

    this.showAddModal = false;

    this.showViewModal = false;

    this.showEditModal = false;

    this.showRejectModal = false;

    this.selectedLicense = null;

    this.resetReject();

  }


  // =====================================================
  // BACKEND ERROR MESSAGE
  // =====================================================

  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    if (
      typeof error?.error === 'string'
    ) {

      return error.error;

    }

    if (
      error?.error?.message
    ) {

      return error.error.message;

    }

    if (
      error?.message
    ) {

      return error.message;

    }

    return fallback;

  }

}