import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataApiService } from './data-api.service';
import { environment } from '../../../enviroment/enviroment.dev';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.apiUrl;

  constructor(private _dataApiService: DataApiService<any>) {}

  getCategories(request: any): Observable<any> {
    let params = new HttpParams();
    // Add `userId` to params only if it exists
    if (request.userId) {
      params = params.set('userId', request.userId); // Assuming `userId` is already a GUID string
    }
  
    // Add `type` to params only if it exists
    if (request.type != null) {
      params = params.set('type', request.type); // Pass as-is if it's numeric
    }
  
    const url = `${this.baseUrl}/category/get`;
    return this._dataApiService.getAll<any>(url, params);
  }
  

  getCategoryById(id: any): Observable<any> {
    const url = `${this.baseUrl}/category/getById`;
    return this._dataApiService.getById<any>(url, id);
  }

  updateCategory(request: any) {
    return this._dataApiService.update(`${this.baseUrl}/category/update`, 
    {
      id: request.id,
      name: request.name,
      type: request.type,
      userId: request.userId
    })
  }

  deleteCategory(model: any): Observable<any> {
    const url = `${this.baseUrl}/category/${model.categoryId}/${model.userId}`;
    return this._dataApiService.delete(url);
  }

  createCategory(request: any) {
    return this._dataApiService.create(`${this.baseUrl}/category/create`, 
    {
      name: request.name,
      type: request.type,
      userId: request.userId
    })
  }
}
