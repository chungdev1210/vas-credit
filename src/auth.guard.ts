// src/app/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of, timeout, TimeoutError } from 'rxjs';
import { ApiService } from './services/api.service';

export const authGuard: CanActivateFn = (route, state) => {
    const apiService = inject(ApiService);
    const router = inject(Router);
    const TIMEOUT_DURATION = 10000;
    return apiService.authGet<any>('/secure', { withCredentials: true }).pipe(
        timeout(TIMEOUT_DURATION),
        map((res) => {
            if (res) {
                localStorage.setItem('info', JSON.stringify(res));
                return true;
            } else {
                router.navigate(['/auth/login'], {
                    queryParams: { returnUrl: state.url }
                });
                return false;
            }
        }),
        catchError((error) => {
            if (error instanceof TimeoutError) {
                router.navigate(['/auth/error'], {
                    queryParams: {
                        type: 'timeout',
                        message: 'Server không phản hồi, vui lòng thử lại sau',
                        returnUrl: state.url
                    }
                });
            } else {
                router.navigate(['/auth/login'], {
                    queryParams: { returnUrl: state.url }
                });
            }
            return of(false);
        })
    );
};
