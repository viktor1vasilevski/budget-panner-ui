import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../services/category.service';
import { CategoryCommunicationService } from '../../../../services/category-comunication.service';
import { ErrorHandlerService } from '../../../../services/error-handler.service';
import { NotificationService } from '../../../../services/notification.service';
import { AuthenticationManagerService } from '../../../../services/authentication-manager/authentication-manager.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent {

  name = '';
  createCategoryForm: FormGroup;

  constructor(private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _categoryComunicationService: CategoryCommunicationService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,
    private _authenticationManagerService: AuthenticationManagerService,
    private router: Router) {
          this.createCategoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            type: ['', Validators.required],
            });
          }



 onSubmit() {
  if(this.createCategoryForm.valid) {

    const formData = this.createCategoryForm.value;
    formData.type = parseInt(formData.type, 10);
    formData.userId = this._authenticationManagerService.getUserId();


    this._categoryService.createCategory(formData).subscribe({
      next: (response: any) => {

        if(response.success) {
          this._notificationService.success(response.message);
          this._categoryComunicationService.notifyCategoryUpdated();
          this.router.navigate(['/user/categories'])
        } else {

          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: any) => {

        this._errorHandlerService.handleErrors(errorResponse);
      }
    })

  } else {
    this._notificationService.info('Form is invalid');
  }



 }
}
