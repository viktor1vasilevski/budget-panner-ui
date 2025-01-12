import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment.dev';
import { DataApiService } from './data-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonthService {

  private baseUrl = environment.apiUrl;

  constructor(private _dataApiService: DataApiService<any>) {}


  getMonths(): Observable<any> {
    const url = `${this.baseUrl}/month`;
    return this._dataApiService.getAll<any>(url);
  }
  
}
