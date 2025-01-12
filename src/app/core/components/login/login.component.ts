import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AuthenticationManagerService } from '../../services/authentication-manager/authentication-manager.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,}$';

  constructor(private fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _authenticateManagerService: AuthenticationManagerService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService
  ) {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(5)]],
        password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this._authService.loginUser(formData).subscribe({
        next: (response: any) => {
          if (response.success) {

            const token = response.data.token;
            const role = response.data.role;
            const userId = response.data.id;

            this._authenticateManagerService.setSession(token, role, userId);
            this._authenticateManagerService.setLoggedInState(true, role);

            role == 'Admin' ? this._router.navigate(['/admin/users']) : this._router.navigate(['/user']);
            this._notificationService.success(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      })
    } else {
      this._notificationService.info("Invalid form");
    }


  }

  register() {
    this._router.navigate(['register'])
  }

}
