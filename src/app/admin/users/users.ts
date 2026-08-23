import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
   countries: string[] = [

  'Afghan',
  'Albanian',
  'Algerian',
  'American',
  'Andorran',
  'Angolan',
  'Argentine',
  'Armenian',
  'Australian',
  'Austrian',
  'Azerbaijani',

  'Bahamian',
  'Bahraini',
  'Bangladeshi',
  'Barbadian',
  'Belarusian',
  'Belgian',
  'Belizean',
  'Beninese',
  'Bhutanese',
  'Bolivian',
  'Bosnian',
  'Botswanan',
  'Brazilian',
  'British',
  'Bruneian',
  'Bulgarian',
  'Burkinabe',
  'Burundian',

  'Cambodian',
  'Cameroonian',
  'Canadian',
  'Cape Verdean',
  'Central African',
  'Chadian',
  'Chilean',
  'Chinese',
  'Colombian',
  'Comorian',
  'Congolese',
  'Costa Rican',
  'Croatian',
  'Cuban',
  'Cypriot',
  'Czech',

  'Danish',
  'Djiboutian',
  'Dominican',
  'Dutch',

  'East Timorese',
  'Ecuadorian',
  'Egyptian',
  'Emirati',
  'Equatorial Guinean',
  'Eritrean',
  'Estonian',
  'Ethiopian',

  'Fijian',
  'Filipino',
  'Finnish',
  'French',

  'Gabonese',
  'Gambian',
  'Georgian',
  'German',
  'Ghanaian',
  'Greek',
  'Grenadian',
  'Guatemalan',
  'Guinean',
  'Guyanese',

  'Haitian',
  'Honduran',
  'Hungarian',

  'Icelandic',
  'Indian',
  'Indonesian',
  'Iranian',
  'Iraqi',
  'Irish',
  'Israeli',
  'Italian',
  'Ivorian',

  'Jamaican',
  'Japanese',
  'Jordanian',

  'Kazakh',
  'Kenyan',
  'Kiribati',
  'Kuwaiti',
  'Kyrgyz',

  'Laotian',
  'Latvian',
  'Lebanese',
  'Lesotho',
  'Liberian',
  'Libyan',
  'Liechtensteiner',
  'Lithuanian',
  'Luxembourgish',

  'Malagasy',
  'Malawian',
  'Malaysian',
  'Maldivian',
  'Malian',
  'Maltese',
  'Marshallese',
  'Mauritanian',
  'Mauritian',
  'Mexican',
  'Micronesian',
  'Moldovan',
  'Monacan',
  'Mongolian',
  'Montenegrin',
  'Moroccan',
  'Mozambican',
  'Myanmar',

  'Namibian',
  'Nauruan',
  'Nepalese',
  'New Zealander',
  'Nicaraguan',
  'Nigerian',
  'Nigerien',
  'North Korean',
  'North Macedonian',
  'Norwegian',

  'Omani',

  'Pakistani',
  'Palauan',
  'Panamanian',
  'Papua New Guinean',
  'Paraguayan',
  'Peruvian',
  'Polish',
  'Portuguese',

  'Qatari',

  'Romanian',
  'Russian',
  'Rwandan',

  'Saint Lucian',
  'Salvadoran',
  'Samoan',
  'San Marinese',
  'Saudi Arabian',
  'Senegalese',
  'Serbian',
  'Seychellois',
  'Sierra Leonean',
  'Singaporean',
  'Slovak',
  'Slovenian',
  'Solomon Islander',
  'Somali',
  'South African',
  'South Korean',
  'South Sudanese',
  'Spanish',
  'Sri Lankan',
  'Sudanese',
  'Surinamese',
  'Swazi',
  'Swedish',
  'Swiss',
  'Syrian',

  'Taiwanese',
  'Tajik',
  'Tanzanian',
  'Thai',
  'Togolese',
  'Tongan',
  'Trinidadian',
  'Tunisian',
  'Turkish',
  'Turkmen',

  'Ugandan',
  'Ukrainian',
  'Uruguayan',
  'Uzbek',

  'Vanuatuan',
  'Vatican citizen',
  'Venezuelan',
  'Vietnamese',

  'Yemeni',

  'Zambian',
  'Zimbabwean'

];

  // =====================================================
  // MODALS
  // =====================================================

  showViewModal = false;
  showEditModal = false;
  showAddModal = false;


  // =====================================================
  // DATA
  // =====================================================

  users: any[] = [];
  filteredUsers: any[] = [];

  selectedUser: any = null;

  search = '';
  role = 'ALL';

  summary = {
    total: 0,
    businessOwners: 0,
    tourists: 0,
    shehas: 0,
    admins: 0,
    active: 0,
    blocked: 0
  };


  // =====================================================
  // NEW USER
  // =====================================================

  newUser: any = this.createEmptyUser();


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadUsers();

  }


  // =====================================================
  // EMPTY USER OBJECT
  // =====================================================

  private createEmptyUser(): any {

    return {

      fullName: '',

      email: '',

      phoneNumber: '',

      password: '',

      age: null,

      gender: 'Male',

      address: '',

      nationality: '',

      shehia: '',

      profileImage: '',

      businessName: '',

      businessType: '',

      businessAddress: '',
      
      businessRegistrationNumber: '',

      role: 'BUSINESS_OWNER',

      enabled: true

    };

  }


  // =====================================================
  // LOAD USERS
  // =====================================================

  loadUsers(): void {

    this.userService.getAll().subscribe({

      next: (res) => {

        this.users = res || [];

        this.filterUsers();

        this.calculateSummary();

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Failed to load users:', error);

        this.alertService.error(
          'Failed to Load Users',
          this.getErrorMessage(
            error,
            'Unable to retrieve users from the server.'
          )
        );

      }

    });

  }


  // =====================================================
  // SUMMARY
  // =====================================================

  calculateSummary(): void {

    this.summary.total =
      this.users.length;

    this.summary.businessOwners =
      this.users.filter(
        user => user.role === 'BUSINESS_OWNER'
      ).length;

    this.summary.tourists =
      this.users.filter(
        user => user.role === 'TOURIST'
      ).length;

    this.summary.shehas =
      this.users.filter(
        user => user.role === 'SHEHA'
      ).length;

    this.summary.admins =
      this.users.filter(
        user => user.role === 'ADMIN'
      ).length;

    this.summary.active =
      this.users.filter(
        user => user.enabled === true
      ).length;

    this.summary.blocked =
      this.users.filter(
        user => user.enabled === false
      ).length;

  }


  // =====================================================
  // SEARCH + ROLE FILTER
  // =====================================================

  filterUsers(): void {

    const keyword =
      this.search.trim().toLowerCase();

    this.filteredUsers =
      this.users.filter(user => {

        const matchesSearch =

          !keyword ||

          (user.fullName || '')
            .toLowerCase()
            .includes(keyword)

          ||

          (user.email || '')
            .toLowerCase()
            .includes(keyword)

          ||

          (user.phoneNumber || '')
            .toLowerCase()
            .includes(keyword)

          ||

          (user.shehia || '')
            .toLowerCase()
            .includes(keyword)

          ||

          (user.businessName || '')
            .toLowerCase()
            .includes(keyword);


        const matchesRole =

          this.role === 'ALL'

          ||

          user.role === this.role;


        return (
          matchesSearch &&
          matchesRole
        );

      });

  }


  // =====================================================
  // OPEN VIEW
  // =====================================================

  openView(user: any): void {

    this.selectedUser = {
      ...user
    };

    this.showViewModal = true;

  }


  // =====================================================
  // OPEN EDIT
  // =====================================================

  openEdit(user: any): void {

    this.selectedUser = {
      ...user
    };

    this.showEditModal = true;

  }


  // =====================================================
  // OPEN ADD
  // =====================================================

  openAdd(): void {

    this.newUser =
      this.createEmptyUser();

    this.showAddModal = true;

  }


  // =====================================================
  // SAVE NEW USER
  // =====================================================

  saveUser(): void {

    // -----------------------------
    // BASIC VALIDATION
    // -----------------------------

    if (
      !this.newUser.fullName?.trim()
    ) {

      this.alertService.warning(
        'Full Name Required',
        'Please enter the user full name.'
      );

      return;

    }


    if (
      !this.newUser.email?.trim()
    ) {

      this.alertService.warning(
        'Email Required',
        'Please enter the user email address.'
      );

      return;

    }


    if (
      !this.newUser.phoneNumber?.trim()
    ) {

      this.alertService.warning(
        'Phone Number Required',
        'Please enter the user phone number.'
      );

      return;

    }


    if (
      !this.newUser.password?.trim()
    ) {

      this.alertService.warning(
        'Password Required',
        'Please provide an initial password.'
      );

      return;

    }


    if (!this.newUser.role) {

      this.alertService.warning(
        'Role Required',
        'Please select the user role.'
      );

      return;

    }


    // -----------------------------
    // LOADING
    // -----------------------------

    this.alertService.loading(
      'Creating user...'
    );


    // -----------------------------
    // SEND TO BACKEND
    // -----------------------------

    this.userService
      .create(this.newUser)
      .subscribe({

        next: () => {

          this.alertService.close();

          this.showAddModal = false;

          this.alertService.success(
            'User Created',
            'The new user has been successfully created.'
          );

          this.newUser =
            this.createEmptyUser();

          this.loadUsers();

        },

        error: (error) => {

          this.alertService.close();

          this.alertService.error(
            'Unable to Create User',
            this.getErrorMessage(
              error,
              'The user could not be created.'
            )
          );

        }

      });

  }


  // =====================================================
  // UPDATE USER
  // =====================================================

  updateUser(): void {

    if (!this.selectedUser) {

      return;

    }


    if (
      !this.selectedUser.fullName?.trim()
    ) {

      this.alertService.warning(
        'Full Name Required',
        'Please enter the user full name.'
      );

      return;

    }


    if (
      !this.selectedUser.email?.trim()
    ) {

      this.alertService.warning(
        'Email Required',
        'Please enter the user email address.'
      );

      return;

    }


    if (
      !this.selectedUser.phoneNumber?.trim()
    ) {

      this.alertService.warning(
        'Phone Number Required',
        'Please enter the user phone number.'
      );

      return;

    }


    this.alertService.loading(
      'Updating user...'
    );


    this.userService
      .update(
        this.selectedUser.id,
        this.selectedUser
      )
      .subscribe({

        next: () => {

          this.alertService.close();

          this.showEditModal = false;

          this.alertService.success(
            'User Updated',
            'User information has been updated successfully.'
          );

          this.loadUsers();

        },

        error: (error) => {

          this.alertService.close();

          this.alertService.error(
            'Update Failed',
            this.getErrorMessage(
              error,
              'Unable to update user information.'
            )
          );

        }

      });

  }


  // =====================================================
  // CHANGE STATUS
  // =====================================================

  async changeStatus(user: any): Promise<void> {

    const action =
      user.enabled
        ? 'block'
        : 'activate';


    const confirmed =
      await this.alertService.confirm(

        user.enabled
          ? 'Block User?'
          : 'Activate User?',

        user.enabled

          ? `Are you sure you want to block ${user.fullName}?`

          : `Are you sure you want to activate ${user.fullName}?`,

        user.enabled
          ? 'Block User'
          : 'Activate User'

      );


    if (!confirmed) {

      return;

    }


    this.alertService.loading(
      `${this.capitalize(action)}ing user...`
    );


    this.userService
      .changeStatus(user.id)
      .subscribe({

        next: () => {

          this.alertService.close();

          this.alertService.success(

            user.enabled
              ? 'User Blocked'
              : 'User Activated',

            user.enabled
              ? `${user.fullName} has been blocked successfully.`
              : `${user.fullName} has been activated successfully.`

          );

          this.loadUsers();

        },

        error: (error) => {

          this.alertService.close();

          this.alertService.error(
            'Status Update Failed',
            this.getErrorMessage(
              error,
              'Unable to change the user status.'
            )
          );

        }

      });

  }


  // =====================================================
  // DELETE USER
  // =====================================================

  async delete(user: any): Promise<void> {

    const confirmed =
      await this.alertService.confirm(

        'Delete User?',

        `Are you sure you want to permanently delete ${user.fullName}? This action cannot be undone.`,

        'Delete User'

      );


    if (!confirmed) {

      return;

    }


    this.alertService.loading(
      'Deleting user...'
    );


    this.userService
      .delete(user.id)
      .subscribe({

        next: () => {

          this.alertService.close();

          this.alertService.success(
            'User Deleted',
            `${user.fullName} has been deleted successfully.`
          );

          this.loadUsers();

        },

        error: (error) => {

          this.alertService.close();

          this.alertService.error(
            'Delete Failed',
            this.getErrorMessage(
              error,
              'Unable to delete the user.'
            )
          );

        }

      });

  }


  // =====================================================
  // CLOSE MODALS
  // =====================================================

  closeModals(): void {

    this.showViewModal = false;

    this.showEditModal = false;

    this.showAddModal = false;

    this.selectedUser = null;

    this.newUser =
      this.createEmptyUser();

  }


  // =====================================================
  // ROLE LABEL
  // =====================================================

  roleLabel(role: string): string {

    if (!role) {
      return '';
    }

    return role
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }


  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    if (
      typeof error?.error === 'string'
      && error.error.trim()
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


  // =====================================================
  // CAPITALIZE
  // =====================================================

  private capitalize(value: string): string {

    return value.charAt(0).toUpperCase()
      + value.slice(1);

  }

}