import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './core/components/register/register.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [ authGuard ] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },


    { path: 'register', component: RegisterComponent, canActivate: [ authGuard ] },
    { 
        path: 'admin/users', 
        loadComponent: () => import('./core/components/admin/admin-users/admin-users.component')
            .then((m) => m.AdminUsersComponent),
        canActivate: [ authGuard ],
        data: { roles: ['Admin'] }
    },

    { 
        path: 'user', 
        loadComponent: () => import('./core/components/user/home/home.component')
            .then((m) => m.HomeComponent),
        canActivate: [ authGuard ],
        data: { roles: ['User'] },
        children : [
            { 
                path: 'report', 
                loadComponent: () => import('./core/components/user/reports/reports.component')
                    .then((m) => m.ReportsComponent),
                canActivate: [ authGuard ]
            },
            { 
                path: 'transaction/:type', 
                loadComponent: () => import('./core/components/user/transaction/transaction.component')
                    .then((m) => m.TransactionComponent),
                canActivate: [ authGuard ]
            },
            { 
                path: 'categories', 
                loadComponent: () => import('./core/components/user/categories/categories.component')
                    .then((m) => m.CategoriesComponent),
                canActivate: [ authGuard ],
                children: [
                    {
                        path: 'create',
                        loadComponent: () =>
                            import('./core/components/user/categories/create-category/create-category.component').then(
                                (m) => m.CreateCategoryComponent
                            ),
                        canActivate: [authGuard],
                    },
                    {
                        path: 'edit/:id',
                        loadComponent: () =>
                            import('./core/components/user/categories/edit-category/edit-category.component').then(
                                (m) => m.EditCategoryComponent
                            ),
                        canActivate: [authGuard],
                    },
                ]
            }
        ]
    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent
    },
  ];
