import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment.dev';
import { DataApiService } from './data-api.service';
import { Observable } from 'rxjs';
import { QueryResponse } from '../models/responses/query-response.model';
import { JobDropdownListModel } from '../models/job/job.dropdownlist.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private baseUrl = environment.apiUrl;

  constructor(private _dataApiService: DataApiService<any>) {}

  getJobDropdownList(): Observable<QueryResponse<JobDropdownListModel>> {
    const url = `${this.baseUrl}/job/GetJobDropdownList`;
    return this._dataApiService.getAll<QueryResponse<JobDropdownListModel>>(url);
  }
}
