import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'sw';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  // =====================================================
  // CURRENT LANGUAGE
  // =====================================================

  private currentLanguageSubject =
    new BehaviorSubject<Language>(
      this.getSavedLanguage()
    );

  currentLanguage$ =
    this.currentLanguageSubject.asObservable();


  // =====================================================
  // TRANSLATIONS
  // =====================================================

  private translations: Record<
    Language,
    Record<string, string>
  > = {

    en: {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.services": "Services",
      "nav.contact": "Contact",
      "nav.login": "Login",
      "nav.register": "Register",

      "common.save": "Save",
      "common.saveChanges": "Save Changes",
      "common.cancel": "Cancel",
      "common.close": "Close",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.view": "View",
      "common.refresh": "Refresh",
      "common.search": "Search",
      "common.loading": "Loading...",
      "common.submit": "Submit",
      "common.add": "Add",
      "common.update": "Update",
      "common.back": "Back",
      "common.next": "Next",
      "common.previous": "Previous",
      "common.yes": "Yes",
      "common.no": "No",
      "common.ok": "OK",

      "home.tag": "ICT-BASED",
      "home.title1": "Coastal Conservation",
      "home.title2": "& Revenue",
      "home.title3": "Monitoring",
      "home.title4": "System",

      "home.description":
        "A smart digital platform for managing coastal resources, monitoring activities, collecting revenue and protecting our beautiful beaches for a sustainable future.",

      "home.applyLicense": "Apply for License",
      "home.makePayment": "Make a Payment",

      "home.whatWeDo": "WHAT WE DO",

      "home.sustainableTitle":
        "Building a sustainable and thriving coastal environment",

      "home.digitalLicenses": "Digital Licenses",

      "home.digitalLicensesDescription":
        "Apply, track and manage business licenses online with ease.",

      "home.onlinePayments": "Online Payments",

      "home.onlinePaymentsDescription":
        "Make secure payments for permits, fees and services.",

      "home.revenueMonitoring": "Revenue Monitoring",

      "home.revenueMonitoringDescription":
        "Track revenue collection in real-time with accurate reports.",

      "home.enforcement": "Enforcement",

      "home.enforcementDescription":
        "Monitor and manage compliance and enforcement actions.",

      "home.reportIssues": "Report Issues",

      "home.reportIssuesDescription":
        "Report pollution, illegal activities and environmental issues.",

      "home.publicAwareness": "Public Awareness",

      "home.publicAwarenessDescription":
        "Promoting conservation and responsible use of coastal resources.",

      "language.language": "Language",
      "language.english": "English",
      "language.swahili": "Kiswahili"
    },

    sw: {
      "nav.home": "Nyumbani",
      "nav.about": "Kuhusu",
      "nav.services": "Huduma",
      "nav.contact": "Mawasiliano",
      "nav.login": "Ingia",
      "nav.register": "Jisajili",

      "common.save": "Hifadhi",
      "common.saveChanges": "Hifadhi Mabadiliko",
      "common.cancel": "Ghairi",
      "common.close": "Funga",
      "common.delete": "Futa",
      "common.edit": "Hariri",
      "common.view": "Tazama",
      "common.refresh": "Onyesha Upya",
      "common.search": "Tafuta",
      "common.loading": "Inapakia...",
      "common.submit": "Wasilisha",
      "common.add": "Ongeza",
      "common.update": "Sasisha",
      "common.back": "Rudi",
      "common.next": "Endelea",
      "common.previous": "Iliyotangulia",
      "common.yes": "Ndiyo",
      "common.no": "Hapana",
      "common.ok": "Sawa",

      "home.tag": "ICT-BASED",
      "home.title1": "Uhifadhi wa Mazingira",
      "home.title2": "& Mapato",
      "home.title3": "Ufuatiliaji",
      "home.title4": "Mfumo",

      "home.description":
        "Jukwaa la kidijitali lenye akili kwa ajili ya kusimamia rasilimali za pwani, kufuatilia shughuli, kukusanya mapato na kulinda fukwe zetu nzuri kwa ajili ya mustakabali endelevu.",

      "home.applyLicense": "Omba Leseni",
      "home.makePayment": "Fanya Malipo",

      "home.whatWeDo": "TUNACHOFANYA",

      "home.sustainableTitle":
        "Kujenga mazingira ya pwani endelevu na yenye maendeleo",

      "home.digitalLicenses": "Leseni za Kidijitali",

      "home.digitalLicensesDescription":
        "Omba, fuatilia na simamia leseni za biashara mtandaoni kwa urahisi.",

      "home.onlinePayments": "Malipo Mtandaoni",

      "home.onlinePaymentsDescription":
        "Fanya malipo salama kwa vibali, ada na huduma.",

      "home.revenueMonitoring": "Ufuatiliaji wa Mapato",

      "home.revenueMonitoringDescription":
        "Fuatilia ukusanyaji wa mapato kwa wakati halisi kwa kutumia ripoti sahihi.",

      "home.enforcement": "Utekelezaji",

      "home.enforcementDescription":
        "Fuatilia na simamia uzingatiaji wa kanuni na hatua za utekelezaji.",

      "home.reportIssues": "Ripoti Matatizo",

      "home.reportIssuesDescription":
        "Ripoti uchafuzi, shughuli haramu na matatizo ya mazingira.",

      "home.publicAwareness": "Uhamasishaji wa Umma",

      "home.publicAwarenessDescription":
        "Kuhamasisha uhifadhi na matumizi sahihi ya rasilimali za pwani.",

      "language.language": "Lugha",
      "language.english": "English",
      "language.swahili": "Kiswahili"
    }

  };


  // =====================================================
  // GET SAVED LANGUAGE
  // =====================================================

  private getSavedLanguage(): Language {

    const saved =
      localStorage.getItem('language');

    return saved === 'sw'
      ? 'sw'
      : 'en';
  }


  // =====================================================
  // CURRENT LANGUAGE
  // =====================================================

  get currentLanguage(): Language {

    return this.currentLanguageSubject.value;
  }


  // =====================================================
  // CHANGE LANGUAGE
  // =====================================================

  setLanguage(language: Language): void {

    localStorage.setItem(
      'language',
      language
    );

    this.currentLanguageSubject.next(
      language
    );
  }


  // =====================================================
  // TRANSLATE
  // =====================================================

  translate(key: string): string {

    const language =
      this.currentLanguageSubject.value;

    return (
      this.translations[language]?.[key]
      ??
      this.translations.en[key]
      ??
      key
    );
  }

}