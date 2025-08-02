import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly API_BASE = '/admin';
    private readonly AUTH_BASE = '/api-auth';

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    // GET request với params
    get<T>(url: string, params?: any): Observable<T> {
        return this.http
            .get<T>(`${this.API_BASE}${url}`, {
                params: params,
                headers: this.createHeaders()
            })
            .pipe(catchError((error) => this.handleError(error)));
    }

    // POST request với headers
    post<T>(url: string, body?: any): Observable<T> {
        return this.http
            .post<T>(`${this.API_BASE}${url}`, body, {
                headers: this.createHeaders()
            })
            .pipe(catchError((error) => this.handleError(error)));
    }

    // PUT request với headers
    put<T>(url: string, body?: any): Observable<T> {
        return this.http
            .put<T>(`${this.API_BASE}${url}`, body, {
                headers: this.createHeaders()
            })
            .pipe(catchError((error) => this.handleError(error)));
    }

    // DELETE request
    delete<T>(url: string): Observable<T> {
        return this.http
            .delete<T>(`${this.API_BASE}${url}`, {
                headers: this.createHeaders()
            })
            .pipe(catchError((error) => this.handleError(error)));
    }

    // === AUTH METHODS ===
    // GET request cho auth endpoints
    authGet<T>(url: string, params?: any): Observable<T> {
        return this.http
            .get<T>(`${this.AUTH_BASE}${url}`, {
                params: params
            })
            .pipe(catchError((error) => this.handleError(error)));
    }

    // POST request cho auth endpoints (login, register, etc.)
    authPost<T>(url: string, body?: any): Observable<T> {
        return this.http
            .post<T>(`${this.AUTH_BASE}${url}`, body, {
                headers: this.createHeaders()
            })
            .pipe(catchError((error) => this.handleError(error)));
    }

    // PUT request cho auth endpoints
    authPut<T>(url: string, body?: any): Observable<T> {
        return this.http
            .put<T>(`${this.AUTH_BASE}${url}`, body, {
                headers: this.createHeaders()
            })
            .pipe(catchError((error) => this.handleError(error)));
    }

    // DELETE request cho auth endpoints
    authDelete<T>(url: string): Observable<T> {
        return this.http
            .delete<T>(`${this.AUTH_BASE}${url}`, {
                headers: this.createHeaders()
            })
            .pipe(catchError((error) => this.handleError(error)));
    }

    downloadFile(url: string, params?: any, filename?: string): Observable<Blob> {
        return this.http
            .get(`${this.API_BASE}${url}`, {
                params: params,
                headers: this.createHeaders(),
                responseType: 'blob'
            })
            .pipe(
                tap((blob) => {
                    if (filename) {
                        this.saveFile(blob, filename);
                    }
                }),
                catchError((error) => this.handleError(error))
            );
    }

    private saveFile(blob: Blob, filename: string): void {
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadURL);
    }

    private createHeaders(): HttpHeaders {
        return new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        });
    }

    private createGetHeaders(): HttpHeaders {
        return new HttpHeaders({
            Accept: 'application/json'
        });
    }

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
