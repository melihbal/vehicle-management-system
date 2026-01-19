
import { HttpInterceptorFn, HttpErrorResponse, HttpClient, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './token-service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError, of } from 'rxjs';

const API_BASE = 'http://localhost:5027';
const REFRESH_URL = `${API_BASE}/api/User/RefreshToken`;
const REVOKE_URL = `${API_BASE}/api/User/RevokeToken`;

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const http = inject(HttpClient);


  if (!(window as any).__refreshTokenSubject) {
    (window as any).__refreshTokenSubject = new BehaviorSubject<string | null>(null);
  }
  if (!(window as any).__isRefreshing) {
    (window as any).__isRefreshing = false;
  }

  const refreshSubject = (window as any).__refreshTokenSubject as BehaviorSubject<string | null>;
  const isRefreshing = () => !!(window as any).__isRefreshing;
  const setRefreshing = (v: boolean) => { (window as any).__isRefreshing = v; };

  // If this is the refresh or revoke endpoint itself, do not attach token or try to refresh
  if (req.url === REFRESH_URL || req.url === REVOKE_URL || req.url.startsWith(REFRESH_URL) || req.url.startsWith(REVOKE_URL)) {
    return next(req);
  }

  const accessToken = tokenService.getToken();
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // If refreshing, wait for it to finish and then retry
      if (isRefreshing()) {
        return refreshSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap((token) => {
            const retryReq = req.clone({
              setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return next(retryReq);
          })
        );
      }

      // Start refresh
      setRefreshing(true);
      refreshSubject.next(null); // mark pending

      // Call refresh endpoint on the API (absolute URL)
      return http.post<{ accessToken: string }>(REFRESH_URL, {}, { withCredentials: true }).pipe(
        switchMap(res => {
          const newToken = res?.accessToken;
          if (!newToken) {
            // no token returned -> logout/clear
            tokenService.clearToken();
            setRefreshing(false);
            refreshSubject.next(null);
            return throwError(() => new Error('Refresh failed: no accessToken returned'));
          }
          tokenService.setToken(newToken);
          setRefreshing(false);
          refreshSubject.next(newToken); // broadcast new token

          // retry original request with new token
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });
          return next(retryReq);
        }),
        catchError(refreshErr => {
          // refresh failed -> clear token, broadcast failure
          tokenService.clearToken();
          setRefreshing(false);
          refreshSubject.next(null);
          return throwError(() => refreshErr);
        })
      );
    })
  );
};
