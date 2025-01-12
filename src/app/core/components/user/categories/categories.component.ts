import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CategoryCommunicationService } from '../../../services/category-comunication.service';
import { AuthenticationManagerService } from '../../../services/authentication-manager/authentication-manager.service';
declare var bootstrap: any;

interface CategoryRequest {
  userId: string | null;
  type: number | null
}


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  categories: any[] = [];
  selectedCategory: any = {};
  isCategoryListEmpty: boolean = false;

  categoryRequest : CategoryRequest = {
    userId: null,
    type : null
  }

  constructor(private _categoryService: CategoryService,
        private _errorHandlerService: ErrorHandlerService,
        private _notificationService: NotificationService,
        private _categoryComunicationService: CategoryCommunicationService,
        private _authenticationManagerService: AuthenticationManagerService
  ) {
    this._categoryComunicationService.categoryUpdated$.subscribe(() => {
      this.loadGategories();
    });
  }


  ngOnInit(): void {
    this.loadGategories();
  }

  loadGategories() {
    this.categoryRequest.userId = this._authenticationManagerService.getUserId();
    this._categoryService.getCategories(this.categoryRequest).subscribe({
      next: (response: any) => {
        if(response.success) {
          this.categories = response.data;
          this.isCategoryListEmpty = false;
        } else {
          this._notificationService.info(response.message);
          this.isCategoryListEmpty = true;
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
        this.isCategoryListEmpty = true;
      }
    })
  }

  openDeleteModal(category: any) {
    this.selectedCategory.id = category.id;
    this.selectedCategory.name = category.name;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal')!);
    deleteModal.show();
  }


  confirmDelete() {

    let deleteCategoryModel = {
      userId: this._authenticationManagerService.getUserId(),
      categoryId: this.selectedCategory.id
    }

    this._categoryService.deleteCategory(deleteCategoryModel).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this._notificationService.success(response.message);
          this.loadGategories();
          this.closeDeleteModal()
        } else {
          this._notificationService.info(response.message);
          this.closeDeleteModal()
        }
  

      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
        this.closeDeleteModal()
      }
    });
  }

  closeDeleteModal() {
    const deleteModalElement = document.getElementById('deleteModal');
    if (deleteModalElement) {
      const modalInstance = bootstrap.Modal.getInstance(deleteModalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

}
