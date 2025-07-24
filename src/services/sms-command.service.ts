import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class SmsCommandsService {
    constructor(private apiService: ApiService) {}

    getSmsCommands(params?: any) {
        return this.apiService.get('/sms-commands', { ...params });
    }

    getSmsCommand(id: any) {
        return this.apiService.get(`/sms-commands/${id}`);
    }

    createSmsCommand(body: any) {
        return this.apiService.post(`/sms-commands`, body);
    }

    updateSmsCommand(id: any, body: any) {
        return this.apiService.put(`/sms-commands/${id}`, body);
    }

    deleteSmsCommand(id: any) {
        return this.apiService.delete(`/sms-commands/${id}`);
    }
}
