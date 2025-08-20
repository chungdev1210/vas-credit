import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class SmsContentService {
    constructor(private apiService: ApiService) {}

    getSmsContents(params?: any) {
        return this.apiService.get('/cms/sms-content', { ...params });
    }

    getSmsCategories(params?: any) {
        return this.apiService.get('/cms/sms-content/categories', { ...params });
    }

    getSmsContent(id: any) {
        return this.apiService.get(`/cms/sms-content/${id}`);
    }

    createSmsContent(body: any) {
        return this.apiService.post(`/cms/sms-content`, body);
    }

    updateSmsContent(id: any, body: any) {
        return this.apiService.put(`/cms/sms-content/${id}`, body);
    }

    deleteSmsContent(id: any) {
        return this.apiService.delete(`/cms/sms-content/${id}`);
    }
}
