import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment.dev';
import { DataApiService } from './data-api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl = environment.apiUrl;

  constructor(private _dataApiService: DataApiService<any>) {}

  getTransactionsForUser(request: any): Observable<any> {
    let params = new HttpParams();
    params = params.set('userId', request.userId);
    params = params.set('type', request.type);
    
    const url = `${this.baseUrl}/transaction/get`;
    return this._dataApiService.getAll<any>(url, params);
  }

  getReportForUser(id: any): Observable<any> {
    const url = `${this.baseUrl}/transaction/getReport`;
    return this._dataApiService.getById(url, id);
  }


  getTransactionById(id: any): Observable<any> {
    const url = `${this.baseUrl}/transaction/getById`;
    return this._dataApiService.getById<any>(url, id);
  }

  createTransaction(request: any) {
    return this._dataApiService.create(`${this.baseUrl}/transaction/create`, 
    {
      amount: request.amount,
      transactionStatus: request.valueType,
      userId: request.userId,
      categoryId: request.category,
      month: request.month,
      year: request.year
    })
  }

  updateTransaction(request: any) {
    return this._dataApiService.update(`${this.baseUrl}/transaction/update`, 
    {
      transactionId: request.id,
      userId: request.userId,
      month: request.month,
      year: request.year,
      amount: request.amount
    })
  }


  deleteTransaction(model: any): Observable<any> {
    const url = `${this.baseUrl}/transaction/${model.transactionId}/${model.userId}`;
    return this._dataApiService.delete(url);
  }
}
