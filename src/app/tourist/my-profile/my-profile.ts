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

  selector: 'app-my-profile',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './my-profile.html',

  styleUrl: './my-profile.css'

})
export class MyProfile implements OnInit {


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

  user: UserProfile | null = null;


  // =====================================================
  // ORIGINAL PROFILE
  // Used when cancelling changes
  // =====================================================

  originalUser: UserProfile | null = null;


  // =====================================================
  // STATES
  // =====================================================

  loading = false;

  saving = false;

  uploadingImage = false;


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  selectedFile: File | null = null;

  selectedImage =
    'assets/images/default-profile.png';


  // =====================================================
  // PASSWORD FORM
  // =====================================================

  passwordForm = {

    currentPassword: '',

    newPassword: '',

    confirmPassword: ''

  };


  // =====================================================
  // STATISTICS
  // =====================================================

  reportsCount = 0;

  resolvedCount = 0;


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadProfile();

  }


  // =====================================================
  // LOAD LOGGED-IN TOURIST PROFILE
  // =====================================================

  loadProfile(): void {

    this.loading = true;


    this.alert.loading(
      'Loading your profile...'
    );


    /*
     * IMPORTANT:
     *
     * Do NOT look for userId in localStorage.
     *
     * AuthService already knows the authenticated
     * user through the JWT/session.
     *
     * This is the same approach used by Sheha.
     */

    this.auth
      .getProfile()
      .subscribe({

        next: (response: UserProfile) => {

          console.log(
            'TOURIST PROFILE:',
            response
          );


          // ==========================================
          // SAVE PROFILE
          // ==========================================

          this.user = {
            ...response
          };


          // ==========================================
          // SAVE ORIGINAL COPY
          // ==========================================

          this.originalUser =
            JSON.parse(
              JSON.stringify(
                response
              )
            );


          // ==========================================
          // PROFILE IMAGE
          // ==========================================

          this.setProfileImage(
            response.profileImage
          );


          // ==========================================
          // LOCAL STORAGE DISPLAY NAME
          // ==========================================

          if (response.fullName) {

            localStorage.setItem(
              'fullName',
              response.fullName
            );

          }


          // ==========================================
          // STATISTICS
          // ==========================================

          /*
           * If your backend profile response later
           * provides these fields, they will be used.
           *
           * Otherwise they remain 0.
           */

          const profileData: any =
            response;


          this.reportsCount =
            Number(
              profileData?.reportsCount ??
              profileData?.totalReports ??
              0
            );


          this.resolvedCount =
            Number(
              profileData?.resolvedCount ??
              profileData?.resolvedReports ??
              0
            );


          // ==========================================
          // FINISH
          // ==========================================

          this.loading = false;

          this.alert.close();

          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'TOURIST PROFILE ERROR:',
            error
          );


          this.loading = false;

          this.alert.close();


          // ==========================================
          // 401
          // ==========================================

          if (
            error?.status === 401
          ) {

            this.alert.error(

              'Session Expired',

              'Your login session has expired. Please login again.'

            );

          }


          // ==========================================
          // 403
          // ==========================================

          else if (
            error?.status === 403
          ) {

            this.alert.error(

              'Access Denied',

              'You are not authorized to access your profile.'

            );

          }


          // ==========================================
          // OTHER
          // ==========================================

          else {

            const message =
              typeof error?.error === 'string'
                ? error.error
                : error?.error?.message ||
                  'Unable to retrieve your profile information.';


            this.alert.error(

              'Failed to Load Profile',

              message

            );

          }


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

    if (
      !image ||
      !image.trim()
    ) {

      this.selectedImage =
        'assets/images/default-profile.png';

      return;

    }


    // ==========================================
    // FULL URL
    // ==========================================

    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('blob:') ||
      image.startsWith('data:')
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
  // IMAGE SELECT
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
    // TYPE
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
    // SIZE
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
    // SAVE FILE
    // ==========================================

    this.selectedFile =
      file;


    // ==========================================
    // PREVIEW
    // ==========================================

    const previewUrl =
      URL.createObjectURL(file);


    this.selectedImage =
      previewUrl;


    this.cdr.detectChanges();


    // ==========================================
    // UPLOAD
    // ==========================================

    this.uploadProfileImage();

  }


  // =====================================================
  // UPLOAD PROFILE IMAGE
  // =====================================================

  uploadProfileImage(): void {

    if (!this.selectedFile) {

      return;

    }


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
            'TOURIST PROFILE IMAGE RESPONSE:',
            response
          );


          // ==========================================
          // UPDATE PROFILE
          // ==========================================

          if (this.user) {

            this.user = {
              ...this.user,
              ...response
            };

          }


          // ==========================================
          // UPDATE ORIGINAL
          // ==========================================

          this.originalUser =
            JSON.parse(
              JSON.stringify(
                this.user
              )
            );


          // ==========================================
          // BACKEND IMAGE
          // ==========================================

          this.setProfileImage(
            response.profileImage
          );


          // ==========================================
          // CLEAR FILE
          // ==========================================

          this.selectedFile =
            null;

          this.uploadingImage =
            false;


          // ==========================================
          // LOCAL STORAGE
          // ==========================================

          if (
            response.fullName
          ) {

            localStorage.setItem(
              'fullName',
              response.fullName
            );

          }


          this.alert.close();


          this.alert.success(

            'Profile Image Updated',

            'Your profile image has been updated successfully.'

          );


          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'TOURIST PROFILE IMAGE ERROR:',
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
          // RESTORE IMAGE
          // ==========================================

          if (this.user) {

            this.setProfileImage(
              this.user.profileImage
            );

          }


          let message =
            'Unable to upload your profile image. Please try again.';


          if (
            error?.status === 401
          ) {

            message =
              'Your login session is not authorized for profile image upload. Please login again.';

          }

          else if (
            error?.status === 403
          ) {

            message =
              'You are not authorized to upload a profile image.';

          }

          else if (
            error?.status === 413
          ) {

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
  // SAVE PROFILE
  // =====================================================

  saveChanges(): void {

    if (!this.user) {

      return;

    }


    // ==========================================
    // FULL NAME
    // ==========================================

    if (
      !this.user.fullName?.trim()
    ) {

      this.alert.warning(

        'Full Name Required',

        'Please enter your full name.'

      );

      return;

    }


    // ==========================================
    // EMAIL
    // ==========================================

    if (
      !this.user.email?.trim()
    ) {

      this.alert.warning(

        'Email Required',

        'Please enter your email address.'

      );

      return;

    }


    // ==========================================
    // CONFIRM
    // ==========================================

    this.alert.confirm(

      'Save Changes',

      'Are you sure you want to update your profile information?',

      'Save Changes'

    ).then(
      (confirmed: boolean) => {

        if (!confirmed) {

          return;

        }


        this.saving = true;


        this.alert.loading(
          'Saving your profile...'
        );


        // ==========================================
        // PAYLOAD
        // ==========================================

        const data: any = {

          fullName:
            this.user!.fullName.trim(),

          email:
            this.user!.email.trim(),

          phoneNumber:
            this.user!.phoneNumber?.trim() || '',

          age:
            this.user!.age,

          gender:
            this.user!.gender,

          address:
            this.user!.address,

          nationality:
            this.user!.nationality

        };


        // ==========================================
        // UPDATE
        // ==========================================

        this.auth
          .updateProfile(data)
          .subscribe({

            next: (response: UserProfile) => {

              console.log(
                'UPDATED TOURIST PROFILE:',
                response
              );


              this.user = {
                ...this.user!,
                ...response
              };


              this.originalUser =
                JSON.parse(
                  JSON.stringify(
                    this.user
                  )
                );


              if (
                response.fullName
              ) {

                localStorage.setItem(
                  'fullName',
                  response.fullName
                );

              }


              this.setProfileImage(
                response.profileImage
              );


              this.saving = false;

              this.alert.close();


              this.alert.success(

                'Profile Updated',

                'Your profile information has been updated successfully.'

              );


              this.cdr.detectChanges();

            },


            error: (error: any) => {

              console.error(
                'TOURIST PROFILE UPDATE ERROR:',
                error
              );


              this.saving = false;

              this.alert.close();


              const message =
                typeof error?.error === 'string'
                  ? error.error
                  : error?.error?.message ||
                    'Unable to update your profile.';


              if (
                error?.status === 401
              ) {

                this.alert.error(

                  'Session Expired',

                  'Please login again and try again.'

                );

              }

              else if (
                error?.status === 403
              ) {

                this.alert.error(

                  'Access Denied',

                  'You are not authorized to update this profile.'

                );

              }

              else {

                this.alert.error(

                  'Update Failed',

                  message

                );

              }


              this.cdr.detectChanges();

            }

          });

      }

    );

  }


  // =====================================================
  // CANCEL CHANGES
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
  this.user?.profileImage
  );


    this.alert.info(

      'Changes Cancelled',

      'Your unsaved changes have been discarded.'

    );


    this.cdr.detectChanges();

  }


  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  changePassword(): void {

    if (
      !this.passwordForm.currentPassword ||
      !this.passwordForm.newPassword ||
      !this.passwordForm.confirmPassword
    ) {

      this.alert.warning(

        'Incomplete Password Form',

        'Please fill in all password fields.'

      );

      return;

    }


    if (
      this.passwordForm.newPassword !==
      this.passwordForm.confirmPassword
    ) {

      this.alert.error(

        'Passwords Do Not Match',

        'New password and confirmation password must match.'

      );

      return;

    }


    if (
      this.passwordForm.newPassword.length < 6
    ) {

      this.alert.warning(

        'Weak Password',

        'New password must contain at least 6 characters.'

      );

      return;

    }


    this.alert.confirm(

      'Change Password',

      'Are you sure you want to change your password?',

      'Change Password'

    ).then(
      (confirmed: boolean) => {

        if (!confirmed) {

          return;

        }


        /*
         * Your auth model already contains
         * ChangePasswordRequest.
         *
         * If AuthService already has changePassword(),
         * use it here.
         */

        const data = {

          currentPassword:
            this.passwordForm.currentPassword,

          newPassword:
            this.passwordForm.newPassword

        };


        if (
          typeof (this.auth as any).changePassword !==
          'function'
        ) {

          this.alert.error(

            'Password Service Unavailable',

            'The password-change method is not available in AuthService.'

          );

          return;

        }


        this.alert.loading(
          'Changing your password...'
        );


        (this.auth as any)
          .changePassword(data)
          .subscribe({

            next: () => {

              this.alert.close();


              this.resetPasswordForm();


              this.alert.success(

                'Password Changed',

                'Your password has been changed successfully.'

              );


              this.cdr.detectChanges();

            },


            error: (error: any) => {

              console.error(
                'TOURIST PASSWORD ERROR:',
                error
              );


              this.alert.close();


              const message =
                typeof error?.error === 'string'
                  ? error.error
                  : error?.error?.message ||
                    'Unable to change your password.';


              this.alert.error(

                'Password Change Failed',

                message

              );


              this.cdr.detectChanges();

            }

          });

      }

    );

  }


  // =====================================================
  // RESET PASSWORD
  // =====================================================

  resetPasswordForm(): void {

    this.passwordForm = {

      currentPassword: '',

      newPassword: '',

      confirmPassword: ''

    };

  }

}