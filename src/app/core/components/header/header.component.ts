import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationManagerService } from '../../services/authentication-manager/authentication-manager.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  role: string | null = "";

  constructor(private _authenticationManagerService: AuthenticationManagerService,
    private router: Router
  ) {
    this._authenticationManagerService.role$.subscribe(role => {
      this.role = role
    });
  }

  logout() {
    this._authenticationManagerService.logout();
    this.router.navigate(['/login'])
  }

}
