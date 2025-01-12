import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryCommunicationService {
  private categoryUpdated = new Subject<void>();
  categoryUpdated$ = this.categoryUpdated.asObservable();

  notifyCategoryUpdated() {
    this.categoryUpdated.next();
  }
}
