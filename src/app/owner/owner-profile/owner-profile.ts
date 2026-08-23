import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

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
  AlertService
} from '../../services/alert.service';

import {
  environment
} from '../../environment/environment';


@Component({

  selector: 'app-owner-profile',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './owner-profile.html',

  styleUrl: './owner-profile.css'

})
export class OwnerProfile implements OnInit {


  // =====================================================
  // USER
  // =====================================================

  user: any = {

    id: null,

    fullName: '',

    email: '',

    phoneNumber: '',

    age: null,

    gender: '',

    address: '',

    nationality: '',

    role: '',

    enabled: true,

    profileImage: '',

    businessName: '',

    businessType: '',

    businessAddress: '',

    businessRegistrationNumber: '',

    shehia: ''

  };


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  selectedImage =
    'assets/images/default-profile.png';

  selectedFile:
    File | null = null;


  // =====================================================
  // ORIGINAL USER
  // =====================================================

  originalUser:
    any = null;


  // =====================================================
  // LOADING
  // =====================================================

  loading =
    false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private authService:
      AuthService,

    private userService:
      UserService,

    private alert:
      AlertService,

    private cdr:
      ChangeDetectorRef

  ) {}


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


    this.authService
      .getProfile()
      .subscribe({

        next: (response) => {

          console.log(
            'PROFILE RESPONSE:',
            response
          );


          this.user = {
            ...response
          };


          // ==========================================
          // SAVE ORIGINAL COPY
          // ==========================================

          this.originalUser =
            JSON.parse(
              JSON.stringify(
                this.user
              )
            );


          // ==========================================
          // LOAD PROFILE IMAGE
          // ==========================================

          this.setProfileImage(
            this.user.profileImage
          );


          this.loading = false;

          this.alert.close();

          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            'PROFILE LOAD ERROR:',
            err
          );


          this.loading = false;

          this.alert.close();


          this.alert.error(

            'Failed to Load Profile',

            err?.error ||
            'Unable to load your profile information.'

          );

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

    if (!image) {

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


    const cleanImage =
      image.startsWith('/')
        ? image
        : `/${image}`;


    this.selectedImage =
      `${serverUrl}${cleanImage}`;

  }


  // =====================================================
  // CHANGE PROFILE IMAGE
  // =====================================================

  onImageChange(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


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
    // BROWSER PREVIEW
    // ==========================================

    const reader =
      new FileReader();


    reader.onload = () => {

      this.selectedImage =
        reader.result as string;


      this.cdr.detectChanges();

    };


    reader.readAsDataURL(file);

  }


  // =====================================================
  // SAVE CHANGES
  // =====================================================

  saveChanges(): void {

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !this.user.fullName?.trim()
    ) {

      this.alert.warning(
        'Full name is required.'
      );

      return;

    }


    if (
      !this.user.phoneNumber?.trim()
    ) {

      this.alert.warning(
        'Phone number is required.'
      );

      return;

    }


    this.loading = true;


    this.alert.loading(
      'Saving your profile...'
    );


    // ==========================================
    // PROFILE DATA
    // ==========================================

    const profileData = {

      fullName:
        this.user.fullName,

      phoneNumber:
        this.user.phoneNumber,

      age:
        this.user.age,

      gender:
        this.user.gender,

      address:
        this.user.address,

      nationality:
        this.user.nationality,

      businessName:
        this.user.businessName,

      businessType:
        this.user.businessType,

      businessAddress:
        this.user.businessAddress,

      businessRegistrationNumber:
        this.user.businessRegistrationNumber,

      shehia:
        this.user.shehia

    };


    // ==========================================
    // UPDATE NORMAL PROFILE INFORMATION
    // ==========================================

    this.authService
      .updateProfile(profileData)
      .subscribe({

        next: (updatedUser) => {

          this.user = {

            ...this.user,

            ...updatedUser

          };


          // ==========================================
          // UPLOAD IMAGE IF SELECTED
          // ==========================================

          if (this.selectedFile) {

            this.uploadProfileImage();

          }

          else {

            this.finishSave();

          }

        },


        error: (err) => {

          console.error(
            'PROFILE UPDATE ERROR:',
            err
          );


          this.loading = false;

          this.alert.close();


          this.alert.error(

            'Update Failed',

            err?.error ||
            'Unable to update your profile.'

          );

        }

      });

  }


  // =====================================================
  // UPLOAD PROFILE IMAGE
  // =====================================================

  uploadProfileImage(): void {

    if (!this.selectedFile) {

      this.finishSave();

      return;

    }


    this.alert.loading(
      'Uploading profile photo...'
    );


    this.userService
      .uploadProfileImage(
        this.selectedFile
      )
      .subscribe({

        next: (response) => {

          console.log(
            'PROFILE IMAGE UPLOAD RESPONSE:',
            response
          );


          // ==========================================
          // UPDATE USER
          // ==========================================

          this.user = {

            ...this.user,

            ...response

          };


          // ==========================================
          // SET REAL BACKEND IMAGE
          // ==========================================

          this.setProfileImage(
            response.profileImage
          );


          // ==========================================
          // CLEAR FILE
          // ==========================================

          this.selectedFile =
            null;


          // ==========================================
          // FINISH
          // ==========================================

          this.finishSave();

        },


        error: (err) => {

          console.error(
            'PROFILE IMAGE ERROR:',
            err
          );


          this.loading = false;

          this.alert.close();


          this.alert.error(

            'Profile Image Upload Failed',

            err?.error ||
            'Your profile information was saved, but the profile photo could not be uploaded.'

          );

        }

      });

  }


  // =====================================================
  // FINISH SAVE
  // =====================================================

  finishSave(): void {

    this.originalUser =
      JSON.parse(
        JSON.stringify(
          this.user
        )
      );


    this.loading = false;

    this.alert.close();


    this.alert.success(

      'Profile Updated',

      'Your profile information has been updated successfully.'

    );


    this.cdr.detectChanges();

  }


  // =====================================================
  // CANCEL
  // =====================================================

  cancelChanges(): void {

    if (!this.originalUser) {

      return;

    }


    this.user =
      JSON.parse(
        JSON.stringify(
          this.originalUser
        )
      );


    this.selectedFile =
      null;


    this.setProfileImage(
      this.user.profileImage
    );


    this.alert.info(

      'Changes Cancelled',

      'Your unsaved changes have been discarded.'

    );


    this.cdr.detectChanges();

  }


  // =====================================================
  // DISPLAY ROLE
  // =====================================================

  getRoleName(): string {

    if (!this.user.role) {

      return 'Business Owner';

    }


    return this.user.role

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

}