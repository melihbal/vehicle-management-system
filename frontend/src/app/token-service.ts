import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
    private accessToken : string | null = null;


    setToken(token : string) {
        this.accessToken = token;
    }

    getToken() : string | null {
        return this.accessToken;
    }
    

    clearToken() {
        this.accessToken = null;
    }
    
    isLoggedIn() {
        console.log(this.getToken() !== null);
        return this.getToken() !== null;

    }
}