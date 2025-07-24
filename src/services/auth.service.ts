import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private apiService: ApiService) {}

    /**
     * Gọi API đăng nhập bằng cách sử dụng ApiService.
     * @param credentials - Đối tượng chứa email và password.
     * @returns Observable chứa token và thông tin người dùng.
     */
    login(credentials: any) {
        // Sử dụng phương thức post từ ApiService
        return this.apiService.authPost('/auth', credentials);
    }
    /**
     * Gọi API đăng ký.
     * @param userData - Thông tin người dùng để đăng ký.
     */
    register(userData: any): Observable<any> {
        return this.apiService.post<any>('/auth/register', userData);
    }

    logout() {
        return this.apiService.authPost('/auth', { provider: 'logout' });
    }
}
