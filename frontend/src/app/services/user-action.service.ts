import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserActionService {
  constructor(private http: HttpClient) {}

  logAction(username: string, action: string) {
    const payload = {
      username,
      action,
      timestamp: new Date()
    };
    return this.http.post('http://localhost:5027/api/track', payload).subscribe();
  }
}
