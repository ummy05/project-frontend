import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Inspection } from '../models/inspection.model';
import { environment } from '../environment/environment';


@Injectable({
  providedIn:'root'
})
export class InspectionService{

    private http=inject(HttpClient);

    private api=`${environment.apiUrl}/inspections`;

    getAll():Observable<Inspection[]>{

        return this.http.get<Inspection[]>(this.api);

    }

    getPending(){

        return this.http.get<Inspection[]>(

            `${this.api}/pending`

        );

    }

    getById(id:number){

        return this.http.get<Inspection>(

            `${this.api}/${id}`

        );

    }

    pass(id:number){

        return this.http.patch(

            `${this.api}/${id}/pass`,

            {}

        );

    }

    fail(id:number){

        return this.http.patch(

            `${this.api}/${id}/fail`,

            {}

        );

    }

    delete(id:number){

        return this.http.delete(

            `${this.api}/${id}`

        );

    }

}