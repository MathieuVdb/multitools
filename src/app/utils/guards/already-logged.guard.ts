import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedGuard implements CanActivate {

  constructor(
    private authenticationService : AuthenticationService,
    private router: Router
  ) {}
 
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean>  { 
   
    const isLogged = await this.authenticationService.verifyToken();
    if(isLogged) {
      this.router.navigate(['/']);
    } 
    return !isLogged;
  }
  
}
