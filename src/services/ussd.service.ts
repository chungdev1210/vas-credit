import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class UssdService {
    constructor(private apiService: ApiService) {}

    getCategoryUssd(params?: any) {
        return this.apiService.get('/menu-ussd', { ...params });
    }

    updateConfiguration(id: any, body: any) {
        return this.apiService.put(`/menu-ussd/${id}`, body);
    }
}
