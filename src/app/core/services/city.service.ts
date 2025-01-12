import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment.dev';
import { Observable } from 'rxjs';
import { DataApiService } from './data-api.service';
import { QueryResponse } from '../models/responses/query-response.model';
import { CityDropdownListModel } from '../models/city/city.dropdownlist.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private baseUrl = environment.apiUrl;

  constructor(private _dataApiService: DataApiService<any>) {}

  getCityDropdownList(): Observable<QueryResponse<CityDropdownListModel>> {
    const url = `${this.baseUrl}/city/GetCityDropdownList`;
    return this._dataApiService.getAll<QueryResponse<CityDropdownListModel>>(url);
  }
}
