import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MonthService } from '../../../services/month.service';
import { CategoryService } from '../../../services/category.service';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthenticationManagerService } from '../../../services/authentication-manager/authentication-manager.service';
import { TransactionService } from '../../../services/transaction.service';
declare var bootstrap: any;

interface CategoryRequest {
  userId: string | null;
  type: number | null | undefined;
}


@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})

export class TransactionComponent implements OnInit {

  type: 'expenses' | 'incomes' = 'expenses';
  transactionForm!: FormGroup;
  editTransactionForm!: FormGroup;

  transactions: any[] = [];
  categories: any[] = [];
  selectedTransaction: any = {};

  months: string[] = [];
  selectedMonth: string = '';

  years: number[] = [];
  selectedYear: number = new Date().getFullYear();

  activeUserId: string | null = '';

  categoryRequest: CategoryRequest = {
    userId: null,
    type: null
  };

  constructor(private route: ActivatedRoute, 
    private fb: FormBuilder,
    private _monthService: MonthService,
    private _categoryService: CategoryService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,
    private _authenticationManagerService: AuthenticationManagerService,
    private _transactionService: TransactionService) {
    this.transactionForm = this.fb.group({
          month: ['', Validators.required],
          year: [new Date().getFullYear(), Validators.required],
          category: ['', Validators.required],
          amount: [0.00, [Validators.required, Validators.min(0.01)]],
          valueType: ['', Validators.required]
        });

        this.editTransactionForm = this.fb.group({
          month: ['', Validators.required],
          year: ['', Validators.required],
          amount: ['', [Validators.required, Validators.min(0.01)]]
        });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const typeParam = params.get('type') as 'expenses' | 'incomes';
      this.type = typeParam || 'expenses';
      this.activeUserId = this._authenticationManagerService.getUserId();
      this.resetCategoryInputAndValidationErrors()
      this.loadCategories();
      this.loadMonths();
      this.loadYears();
      this.loadTransactions();
    });
  }

  loadCategories(): void { 
    this.type === 'expenses' ? this.categoryRequest.type = 1 : this.categoryRequest.type = 2;
    this.categoryRequest.userId = this.activeUserId;
    this._categoryService.getCategories(this.categoryRequest).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = response.data;
        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    });
  }

  loadMonths(): void {
    this._monthService.getMonths().subscribe({
      next: (response: any) => {
        this.months = response;
        this.selectedMonth = this.months[new Date().getMonth()];
        this.transactionForm.get('month')?.setValue(this.selectedMonth);
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    });
  }

  loadYears(): void {
    const currentYear = new Date().getFullYear();
    const maxYear = 2035;
    this.years = Array.from({ length: maxYear - currentYear + 1 }, (_, i) => currentYear + i);
  }

  loadTransactions() {
    let type;
    this.type === 'expenses' ? type = 1 : type = 2;
    let request = {userId: this.activeUserId, type: type};
    this._transactionService.getTransactionsForUser(request).subscribe({
      next: (response: any) => {
        if(response.success) {
          this.transactions = this.transformTransactionDates(response.data);

        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    })
  }

  transformTransactionDates(transactions: any[]): any[] {
    return transactions.map(transaction => {
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      const month = this.months[date.getMonth()];
      return {
        ...transaction,
        year,
        month,
      };
    });
  }



  formatAmount(amount: number): string {
    return amount.toFixed(2);
  }



  openEditModal(transaction: any) { 
    this.selectedTransaction = transaction;
    this.editTransactionForm.patchValue({
      month: this.selectedTransaction?.month,
      year: this.selectedTransaction?.year,
      amount: this.selectedTransaction?.amount
    });
    const editModal = new bootstrap.Modal(document.getElementById('editModal')!);
    editModal.show();
  }

  updateTransaction(): void {
    if (this.editTransactionForm.valid) {
      const editTransactionData = this.editTransactionForm.value;
      editTransactionData.userId = this._authenticationManagerService.getUserId();
      editTransactionData.id = this.selectedTransaction.id;
      editTransactionData.amount = this.formatAmount(parseFloat(this.editTransactionForm.get('amount')?.value))
      this._transactionService.updateTransaction(editTransactionData).subscribe({
        next: (response: any) => {
          if(response.success) {
            this._notificationService.success('Transaction updated successfully!');
            this.loadTransactions();
            this.closeEditModal();
          } else {
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      });
    } else {
      this._notificationService.info('The form is invalid');
    }
  }
  

  saveTransaction(): void {
    if (this.transactionForm.valid) {
      const transactionData = { 
        ...this.transactionForm.value, 
        amount: this.formatAmount(parseFloat(this.transactionForm.get('amount')?.value)),
        userId: this._authenticationManagerService.getUserId(),
      };
      transactionData.valueType = parseInt(transactionData.valueType);

      this._transactionService.createTransaction(transactionData).subscribe({
        next: (response: any) => {
          if(response.success) {
            this.transactions = response.data;  
            this.loadTransactions();
            this.reloadData();
            this.resetForm();
            this._notificationService.success(response.message);
          } else {
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      })
      
    }
    this.transactionForm.reset();
  }

  openDeleteModal(transaction: any): void {
    this.selectedTransaction = transaction;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal')!);
    deleteModal.show();
  }

  confirmDelete() {
    let deleteTransactionModel = {
      userId: this.activeUserId,
      transactionId: this.selectedTransaction.id
    }
    this._transactionService.deleteTransaction(deleteTransactionModel).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this._notificationService.success(response.message);
          this.loadTransactions();
          this.closeDeleteModal();
        } else {
          this._notificationService.info(response.message);
          this.closeDeleteModal();
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
        this.closeDeleteModal();
      }
    });
  }



  cancelEdit(): void {
    this.editTransactionForm.reset({
      month: '',
      year: '',
      amount: ''
    });
  }
  closeEditModal() {
    const editModalElement = document.getElementById('editModal');
    if (editModalElement) {
      const modalInstance = bootstrap.Modal.getInstance(editModalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
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

  resetForm(): void {
    this.transactionForm.reset({
      month: this.selectedMonth || '',
      year: this.selectedYear || new Date().getFullYear(),
      category: '',
      amount: 0.00,
      valueType: ''
    });
    this.transactionForm.markAsPristine();
    this.transactionForm.markAsUntouched();
    this.transactionForm.updateValueAndValidity();
  }

  reloadData(): void {
    this.loadMonths();
    this.loadYears();
    this.loadCategories();
    this.loadTransactions();
  }
  
  resetCategoryInputAndValidationErrors() {
    this.transactionForm.get('category')?.setValue('');
    this.transactionForm.get('category')?.markAsUntouched();
    this.transactionForm.get('category')?.updateValueAndValidity();
  }
}
