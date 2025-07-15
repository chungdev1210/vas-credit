import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'https://your-api-domain.com/api';

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    // GET request
    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${endpoint}`).pipe(catchError((error) => this.handleError(error)));
    }

    // POST request
    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${endpoint}`, body).pipe(catchError((error) => this.handleError(error)));
    }

    // PUT request
    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${endpoint}`, body).pipe(catchError((error) => this.handleError(error)));
    }

    // DELETE request
    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}${endpoint}`).pipe(catchError((error) => this.handleError(error)));
    }

    // Xử lý lỗi tập trung và hiển thị bằng PrimeNG Message
    private handleError(error: any): Observable<never> {
        let errorMessage = 'Đã xảy ra lỗi!';

        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        // Hiển thị thông báo lỗi bằng PrimeNG
        this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: errorMessage,
            life: 5000
        });

        console.error('API Error:', error);
        return throwError(() => new Error(errorMessage));
    }
}
