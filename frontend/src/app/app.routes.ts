import { Routes, RouterModule } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Users } from './pages/users/users';
// import { AuthGuard } from './auth.guard';


export const routes: Routes = [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
},
{
    path: 'login',
    component: Login

},
{
    path: '',
    component: Layout,
    children: [
        {
            path: 'dashboard',
            component: Dashboard
        },
        {
            path: 'users',
            component: Users
        }
    ]
}
];
