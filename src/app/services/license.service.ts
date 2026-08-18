import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { License } from '../models/license.model';

@Injectable({
  providedIn:'root'
})
export class LicenseService{

  private http=inject(HttpClient);

  private api=`${environment.apiUrl}/licenses`;

  // =======================
  // ADMIN
  // =======================

  getAll():Observable<License[]>{

    return this.http.get<License[]>(this.api);

  }

  getPending(){

    return this.http.get<License[]>(

      `${this.api}/pending`

    );

  }

  approve(id:number){

    return this.http.patch(

      `${this.api}/${id}/approve`,

      {}

    );

  }

 reject(id:number, reason:string){

return this.http.patch(

`${this.api}/${id}/reject`,

{
  reason: reason
}

);

}

  delete(id:number){

    return this.http.delete(

      `${this.api}/${id}`

    );

  }

  // =======================
  // BUSINESS OWNER
  // =======================

  myLicenses(){

    return this.http.get<License[]>(

      `${this.api}/my`

    );

  }

  calculateFee(

      type:string,

      duration:number){

    return this.http.get<number>(

      `${this.api}/calculate-fee?type=${type}&durationMonths=${duration}`

    );

  }

  apply(data:any){

    return this.http.post(

      `${this.api}/apply`,

      data

    );

  }

  renew(

      id:number,

      months:number){

    return this.http.post(

      `${this.api}/${id}/renew?durationMonths=${months}`,

      {}

    );

  }

  getById(id:number){

    return this.http.get(

      `${this.api}/${id}`

    );

  }

}