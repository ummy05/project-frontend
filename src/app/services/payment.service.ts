import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/payments`;

  //===========================
  // GET ALL
  //===========================

  getAll(){

    return this.http.get<any[]>(this.api);

  }

  //===========================
  // GET BY ID
  //===========================

  getById(id:number){

    return this.http.get<any>(

      `${this.api}/${id}`

    );

  }

  //===========================
  // APPROVE
  //===========================

  approve(id:number,remarks:string){

    return this.http.patch(

      `${this.api}/${id}/approve`,

      {remarks}

    );

  }

  //===========================
  // REJECT
  //===========================

  reject(id:number,remarks:string){

    return this.http.patch(

      `${this.api}/${id}/reject`,

      {remarks}

    );

  }

  //===========================
  // DELETE
  //===========================

  delete(id:number){

    return this.http.delete(

      `${this.api}/${id}`

    );

  }

}