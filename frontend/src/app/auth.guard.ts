// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
// import { TokenService } from './token-service';
// import { retry } from 'rxjs';


// @Injectable({
//     providedIn: 'root'
//   })
// export class AuthGuard implements CanActivate {
//     constructor(private tokenService:TokenService, private router:Router){}

//     canActivate(): boolean {
//         if (this.tokenService.isLoggedIn()) {
//             return true;
//         }
//         console.log("hello there.")
//         console.log("this.tokenService.isLoggedIn() ", this.tokenService.isLoggedIn())
//         this.router.navigate(['/login']);
//         return false;
//     }

// }