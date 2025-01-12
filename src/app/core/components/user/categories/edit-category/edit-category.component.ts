import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../services/category.service';
import { CategoryCommunicationService } from '../../../../services/category-comunication.service';
import { ErrorHandlerService } from '../../../../services/error-handler.service';
import { NotificationService } from '../../../../services/notification.service';
import { switchMap } from 'rxjs';

interface EditCategory {
  userId: string | null;
  type: string | null;
  name: string | null;
  id: string
}

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  @Output() categoryUpdated = new EventEmitter<void>();

  editCategoryForm: FormGroup;

  categoryId: string | null = null;

  category : EditCategory = {
    userId: '',
    type: null,
    id: '',
    name: ''
  }

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _categoryService: CategoryService,
    private _categoryComunicationService: CategoryCommunicationService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService
  ) {
      this.editCategoryForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        type: ['', Validators.required],
      });
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          this.categoryId = id;
          return this.loadCategoryById(id);
        })
      )
      .subscribe();
  }


  loadCategoryById(id: any) {
    return this._categoryService.getCategoryById(id).pipe(
      switchMap((response: any) => {
        if (response.success) {  
          this.category = response.data;

          this.editCategoryForm.patchValue({
            name: this.category.name,
            type: this.category.type
          });

        } else {
          this._notificationService.info(response.message);
        }
        return [];
      })
    );
  }

onSubmit() {
  if (this.editCategoryForm.valid) {
    const formData = this.editCategoryForm.value;
    const model = {
      ...formData,
      id: this.categoryId,
      userId: this.category.userId
    };

    model.type = parseInt(model.type, 10);

    // Call the service to update the category
    this._categoryService.updateCategory(model).subscribe({
      next: (response: any) => {
        if (response.success) {
          this._notificationService.success(response.message);
          this._categoryComunicationService.notifyCategoryUpdated();
          this.router.navigate(['/user/categories']);
        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    });
  } else {
    this._notificationService.info('Form is invalid');
  }
}


}
