import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { jwtDecode } from 'jwt-decode'; 
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('authToken'); 
 
    if (token && this.isTokenValid(token)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
 
  private isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token); 
      const currentTime = Math.floor(Date.now() / 1000); 
      return decodedToken.exp > currentTime; 
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }
}