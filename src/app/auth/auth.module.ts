import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { UserService } from './services/user.service';
import { LoginGuardService } from './services/login-guard.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule.forChild()
  ],
  entryComponents:[LoginComponent],
  providers: [LoginGuardService, UserService]
})
export class AuthModule { }
