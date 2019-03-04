import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeixinComponent } from './components/weixin/weixin.component';
import { LoginComponent } from './auth/components/login/login.component';
import { LoginGuardService } from './auth/services/login-guard.service';
import { ListComponent } from './production/components/list/list.component';
import { ImportComponent } from './production/components/import/import.component';

const routes: Routes = [
    { 
        path: '',
        redirectTo: 'start',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'start',
        component: WeixinComponent,
        canActivate: [LoginGuardService]
    },
    {
        path: 'production',
        canActivate: [LoginGuardService],
        children: [
            { 
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path:'list',
                component: ListComponent            
            },
            {
                path:'import',
                component: ImportComponent            
            }
        ]       
    },
    { 
        path: '**',
        redirectTo: 'start'
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
