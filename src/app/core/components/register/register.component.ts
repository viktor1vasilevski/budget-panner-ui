import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CityService } from '../../services/city.service';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,}$';
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+$';
  serverErrors: { [key: string]: string[] } = {};
  cities: any[] = [];
  jobs: any[] = [];

  constructor(private fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _cityService: CityService,
    private _jobService: JobService) {
      this.registerForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
        password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
        cityId: ['', Validators.required],
        jobId: ['', Validators.required],
        yearsInCurrentJob: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
        totalYearsOfExperience: [0,[Validators.required, Validators.min(0), Validators.max(100)]],
      });
  }

  ngOnInit(): void {
    this.loadCityDropdown();
    this.loadJobDropdown();
  }

  loadCityDropdown() {
    this._cityService.getCityDropdownList().subscribe({
      next: (response: any) => {
        if(response && response.success && response.data) {
          this.cities = response.data;
        } else {
          this._notificationService.info(response.message);
        }   
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    })
  }

  loadJobDropdown() {
    this._jobService.getJobDropdownList().subscribe({
      next: (response: any) => {
        if(response && response.success && response.data) {
          this.jobs = response.data;
        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    })
  }

  onRegister() {

    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this._authService.registerUser(formData).subscribe({
        next:(response: any) => {
          if (response?.success) {
            this._notificationService.success(response.message);
            this._router.navigate(['login'])
          } else {
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }    
      });
    } else {
      this._notificationService.info("Invalid form");
    }

  }

  login(){
    this._router.navigate(['login'])
  }

  UsernameInput() {
    this.serverErrors['Username'] = []
    
  }
}
