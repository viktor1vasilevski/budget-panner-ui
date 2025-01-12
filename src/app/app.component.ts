import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/components/header/header.component";
import { AuthenticationManagerService } from './core/services/authentication-manager/authentication-manager.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isLoggedIn: boolean = false;
  

  constructor(private _authenticationManagerService: AuthenticationManagerService) {
    this._authenticationManagerService.loggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn
    });
  }
}
