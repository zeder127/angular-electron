import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.userService.isAuthenticated)
      return true;
    else{
      this.router.navigate(['login'],{
        queryParams: {
          redirect: state.url
        }
      });
      return false;
    }
  }

  constructor(private userService: UserService, private router: Router) { }
}
