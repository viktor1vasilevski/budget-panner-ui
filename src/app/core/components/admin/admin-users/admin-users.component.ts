import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {

    users: any[] = [];
  
    constructor(private _userService: UserService) {
  
    }

    ngOnInit(): void {
      this.loadUsers();
    }
  
    loadUsers() {
      this._userService.getUsers().subscribe({
        next: (response: any) => {
          if(response.success) {
            this.users = response.data;
          }
        },
        error: (errorResponse: any) => {

        }
      })
    }
}
