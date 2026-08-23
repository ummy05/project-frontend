import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  AuthService
} from '../../services/auth.service';

import {
  UserService
} from '../../services/user.service';

import {
  UserProfile
} from '../../models/auth.model';

import {
  AlertService
} from '../../services/alert.service';

import {
  environment
} from '../../environment/environment';


@Component({

  selector: 'app-sheha-profile',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './sheha-profile.html',

  styleUrl: './sheha-profile.css'

})
export class ShehaProfile implements OnInit {


  // =====================================================
  // SERVICES
  // =====================================================

  private auth =
    inject(AuthService);

  private userService =
    inject(UserService);

  private alert =
    inject(AlertService);

  private cdr =
    inject(ChangeDetectorRef);


  // =====================================================
  // PROFILE
  // =====================================================

  profile: UserProfile | null = null;


  // =====================================================
  // ORIGINAL PROFILE
  // Used when cancelling edit
  // =====================================================

  originalProfile: UserProfile | null = null;


  // =====================================================
  // STATES
  // =====================================================

  loading = false;

  saving = false;

  uploadingImage = false;

  editing = false;


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  selectedFile: File | null = null;

  selectedImage =
    'assets/images/default-profile.png';


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadProfile();

  }


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  loadProfile(): void {

    this.loading = true;

    this.alert.loading(
      'Loading your profile...'
    );


    this.auth
      .getProfile()
      .subscribe({

        next: (response: UserProfile) => {

          console.log(
            'SHEHA PROFILE:',
            response
          );


          // ==========================================
          // SAVE PROFILE
          // ==========================================

          this.profile = {
            ...response
          };


          // ==========================================
          // SAVE ORIGINAL COPY
          // ==========================================

          this.originalProfile =
            JSON.parse(
              JSON.stringify(
                response
              )
            );


          // ==========================================
          // SET PROFILE IMAGE
          // ==========================================

          this.setProfileImage(
            response.profileImage
          );


          // ==========================================
          // UPDATE LOCAL STORAGE
          // ==========================================

          if (response.fullName) {

            localStorage.setItem(
              'fullName',
              response.fullName
            );

          }


          this.loading = false;

          this.alert.close();

          this.cdr.detectChanges();

        },


        error: (error: unknown) => {

          console.error(
            'Profile loading failed:',
            error
          );


          this.loading = false;

          this.alert.close();


          this.alert.error(

            'Failed to Load Profile',

            'Unable to retrieve your profile information.'

          );


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // SET PROFILE IMAGE
  // =====================================================

  setProfileImage(
    image: string | null | undefined
  ): void {

    // ==========================================
    // NO IMAGE
    // ==========================================

    if (!image || !image.trim()) {

      this.selectedImage =
        'assets/images/default-profile.png';

      return;

    }


    // ==========================================
    // FULL URL
    // ==========================================

    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {

      this.selectedImage =
        image;

      return;

    }


    // ==========================================
    // BACKEND BASE URL
    // ==========================================

    const serverUrl =
      environment.apiUrl.replace(
        '/api',
        ''
      );


    // ==========================================
    // CLEAN IMAGE PATH
    // ==========================================

    const cleanImage =
      image.startsWith('/')
        ? image
        : `/${image}`;


    // ==========================================
    // FINAL IMAGE URL
    // ==========================================

    this.selectedImage =
      `${serverUrl}${cleanImage}`;

  }


  // =====================================================
  // START EDITING
  // =====================================================

  startEditing(): void {

    if (!this.profile) {

      return;

    }


    this.editing = true;


    this.cdr.detectChanges();

  }


  // =====================================================
  // CANCEL EDITING
  // =====================================================

  cancelEditing(): void {

    if (!this.originalProfile) {

      this.editing = false;

      return;

    }


    // ==========================================
    // RESTORE ORIGINAL PROFILE
    // ==========================================

    this.profile =
      JSON.parse(
        JSON.stringify(
          this.originalProfile
        )
      );


    // ==========================================
    // CLEAR UNSAVED FILE
    // ==========================================

    this.selectedFile =
      null;


    // ==========================================
    // RESTORE IMAGE
    // ==========================================

    this.setProfileImage(
  this.profile?.profileImage
);


    this.editing = false;


    this.alert.info(

      'Changes Cancelled',

      'Your unsaved changes have been discarded.'

    );


    this.cdr.detectChanges();

  }


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  saveProfile(): void {

    if (!this.profile) {

      return;

    }


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !this.profile.fullName?.trim()
    ) {

      this.alert.warning(
        'Full name is required.'
      );

      return;

    }


    if (
      !this.profile.phoneNumber?.trim()
    ) {

      this.alert.warning(
        'Phone number is required.'
      );

      return;

    }


    this.saving = true;


    this.alert.loading(
      'Saving your profile...'
    );


    // ==========================================
    // PROFILE DATA
    // ==========================================

    const data: Partial<UserProfile> = {

      fullName:
        this.profile.fullName.trim(),

      phoneNumber:
        this.profile.phoneNumber.trim(),

      age:
        this.profile.age,

      gender:
        this.profile.gender,

      address:
        this.profile.address,

      nationality:
        this.profile.nationality,

      shehia:
        this.profile.shehia

    };


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    this.auth
      .updateProfile(data)
      .subscribe({

        next: (response: UserProfile) => {

          console.log(
            'UPDATED SHEHA PROFILE:',
            response
          );


          // ==========================================
          // UPDATE PROFILE
          // ==========================================

          this.profile = {
            ...this.profile!,
            ...response
          };


          // ==========================================
          // SAVE ORIGINAL COPY
          // ==========================================

          this.originalProfile =
            JSON.parse(
              JSON.stringify(
                this.profile
              )
            );


          // ==========================================
          // EXIT EDIT MODE
          // ==========================================

          this.editing = false;

          this.saving = false;


          // ==========================================
          // UPDATE LOCAL STORAGE
          // ==========================================

          localStorage.setItem(
            'fullName',
            response.fullName
          );


          // ==========================================
          // UPDATE IMAGE
          // ==========================================

          this.setProfileImage(
            response.profileImage
          );


          // ==========================================
          // CLOSE LOADING
          // ==========================================

          this.alert.close();


          // ==========================================
          // SUCCESS
          // ==========================================

          this.alert.success(

            'Profile Updated',

            'Your profile information has been updated successfully.'

          );


          this.cdr.detectChanges();

        },


        error: (error: unknown) => {

          console.error(
            'Profile update failed:',
            error
          );


          this.saving = false;

          this.alert.close();


          this.alert.error(

            'Update Failed',

            'Unable to update your profile. Please try again.'

          );


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // SELECT PROFILE IMAGE
  // =====================================================

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    // ==========================================
    // NO FILE
    // ==========================================

    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const file =
      input.files[0];


    // ==========================================
    // VALIDATE IMAGE TYPE
    // ==========================================

    if (
      !file.type.startsWith('image/')
    ) {

      this.alert.error(

        'Invalid Image',

        'Please select a valid image file.'

      );


      input.value = '';

      return;

    }


    // ==========================================
    // MAXIMUM 5MB
    // ==========================================

    if (
      file.size > 5 * 1024 * 1024
    ) {

      this.alert.error(

        'Image Too Large',

        'Profile image must not exceed 5MB.'

      );


      input.value = '';

      return;

    }


    // ==========================================
    // SAVE SELECTED FILE
    // ==========================================

    this.selectedFile =
      file;


    // ==========================================
    // SHOW IMMEDIATE PREVIEW
    // ==========================================

    const reader =
      new FileReader();


    reader.onload = () => {

      this.selectedImage =
        reader.result as string;


      this.cdr.detectChanges();

    };


    reader.onerror = () => {

      this.alert.error(

        'Preview Failed',

        'Unable to preview the selected image.'

      );

    };


    reader.readAsDataURL(file);


    // ==========================================
    // UPLOAD
    // SAME OWNER ENDPOINT
    // ==========================================

    this.uploadProfileImage();

  }


  // =====================================================
  // UPLOAD PROFILE IMAGE
  // =====================================================
  //
  // SAME ENDPOINT USED BY BUSINESS OWNER
  //
  // POST:
  // /api/users/me/profile-image
  //
  // multipart/form-data
  //
  // Backend accepts:
  // BUSINESS_OWNER
  // SHEHA
  // TOURIST
  //
  // =====================================================

  uploadProfileImage(): void {

    if (!this.selectedFile) {

      return;

    }


    // ==========================================
    // PREVENT DOUBLE UPLOAD
    // ==========================================

    if (this.uploadingImage) {

      return;

    }


    this.uploadingImage =
      true;


    this.alert.loading(
      'Uploading profile image...'
    );


    this.userService
      .uploadProfileImage(
        this.selectedFile
      )
      .subscribe({

        next: (response: UserProfile) => {

          console.log(
            'PROFILE IMAGE RESPONSE:',
            response
          );


          // ==========================================
          // UPDATE PROFILE
          // ==========================================

          this.profile = {
            ...response
          };


          // ==========================================
          // SAVE ORIGINAL COPY
          // ==========================================

          this.originalProfile =
            JSON.parse(
              JSON.stringify(
                response
              )
            );


          // ==========================================
          // SET BACKEND IMAGE
          // ==========================================

          this.setProfileImage(
            response.profileImage
          );


          // ==========================================
          // CLEAR SELECTED FILE
          // ==========================================

          this.selectedFile =
            null;


          this.uploadingImage =
            false;


          // ==========================================
          // UPDATE LOCAL STORAGE
          // ==========================================

          if (response.fullName) {

            localStorage.setItem(
              'fullName',
              response.fullName
            );

          }


          // ==========================================
          // CLOSE LOADING
          // ==========================================

          this.alert.close();


          // ==========================================
          // SUCCESS
          // ==========================================

          this.alert.success(

            'Profile Image Updated',

            'Your profile image has been updated successfully.'

          );


          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'Profile image upload failed:',
            error
          );


          console.error(
            'STATUS:',
            error?.status
          );


          console.error(
            'ERROR BODY:',
            error?.error
          );


          console.error(
            'REQUEST URL:',
            error?.url
          );


          this.uploadingImage =
            false;


          this.selectedFile =
            null;


          this.alert.close();


          // ==========================================
          // RESTORE PREVIOUS IMAGE
          // ==========================================

          if (this.profile) {

            this.setProfileImage(
              this.profile.profileImage
            );

          }

          else {

            this.selectedImage =
              'assets/images/default-profile.png';

          }


          // ==========================================
          // ERROR MESSAGE
          // ==========================================

          let message =
            'Unable to upload your profile image. Please try again.';


          if (error?.status === 401) {

            message =
              'Your login session is not authorized for profile image upload. Please login again.';

          }

          else if (error?.status === 403) {

            message =
              'You are not authorized to upload a profile image.';

          }

          else if (error?.status === 413) {

            message =
              'The selected image is too large.';

          }

          else if (
            typeof error?.error === 'string' &&
            error.error.trim()
          ) {

            message =
              error.error;

          }


          this.alert.error(

            'Upload Failed',

            message

          );


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // GET ROLE NAME
  // =====================================================

  getRoleName(): string {

    if (
      !this.profile?.role
    ) {

      return 'Sheha';

    }


    return this.profile.role

      .replaceAll(
        '_',
        ' '
      )

      .replace(

        /\b\w/g,

        (char: string) =>
          char.toUpperCase()

      );

  }


  // =====================================================
  // GET PROFILE IMAGE
  // =====================================================

  getProfileImage(): string {

    return this.selectedImage;

  }


  // =====================================================
  // GET DISPLAY NAME
  // =====================================================

  getDisplayName(): string {

    return this.profile?.fullName ||
      'Sheha';

  }


  // =====================================================
  // GET SHEHIA
  // =====================================================

  getShehia(): string {

    return this.profile?.shehia ||
      'Not assigned';

  }

}