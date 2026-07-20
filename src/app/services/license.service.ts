import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { License } from '../models/license.model';

@Injectable({
  providedIn:'root'
})
export class LicenseService{

  private http=inject(HttpClient);

  private api=`${environment.apiUrl}/licenses`;

  getAll():Observable<License[]>{

    return this.http.get<License[]>(this.api);

  }

  getPending():Observable<License[]>{

    return this.http.get<License[]>(

      `${this.api}/pending`

    );

  }

  getById(id:number){

    return this.http.get<License>(

      `${this.api}/${id}`

    );

  }

  approve(id:number){

    return this.http.patch(

      `${this.api}/${id}/approve`,

      {}

    );

  }

  reject(id:number){

    return this.http.patch(

      `${this.api}/${id}/reject`,

      {}

    );

  }

  delete(id:number){

    return this.http.delete(

      `${this.api}/${id}`

    );

  }

}