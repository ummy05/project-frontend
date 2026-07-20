import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private api = 'http://localhost:8181/api/users';

  getAll() {
    return this.http.get<any[]>(this.api);
  }

  getById(id:number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  update(id:number,data:any) {
    return this.http.put(`${this.api}/${id}`,data);
  }

  changeStatus(id:number) {
    return this.http.patch(`${this.api}/${id}/status`,{});
  }

  delete(id:number){
    return this.http.delete(`${this.api}/${id}`);
  }

  search(keyword:string){
    return this.http.get<any[]>(
      `${this.api}/search?keyword=${keyword}`
    );
  }

  role(role:string){
    return this.http.get<any[]>(
      `${this.api}/role/${role}`
    );
  }

  create(data:any){

return this.http.post(this.api,data);

}
  
}