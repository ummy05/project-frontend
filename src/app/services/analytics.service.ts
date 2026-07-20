import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private http = inject(HttpClient);

  private api = 'http://localhost:8181/api/analytics';

  adminDashboard() {
    return this.http.get<any>(`${this.api}/admin`);
  }

  reports() {
    return this.http.get<any>(`${this.api}/reports`);
  }

  monthlyRevenue() {
    return this.http.get<any>(`${this.api}/monthly-revenue`);
  }

  monthlyLicenses() {
    return this.http.get<any>(`${this.api}/monthly-licenses`);
  }

  monthlyComplaints() {
    return this.http.get<any>(`${this.api}/monthly-complaints`);
  }


  exportPdf() {

  return this.http.get(

    `${this.api}/export/pdf`,

    {

      responseType: 'blob'

    }

  );

}

exportExcel() {

  return this.http.get(

    `${this.api}/export/excel`,

    {

      responseType: 'blob'

    }

  );

}
}