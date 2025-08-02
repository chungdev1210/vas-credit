import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    constructor(private apiService: ApiService) {}

    reportDaily(params?: any) {
        return this.apiService.get('/reports/daily', { ...params });
    }

    exportReportDaily(params?: any) {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
        const filename = `daily-report-${dateString}.xlsx`;
        return this.apiService.downloadFile('/reports/daily/export', { ...params }, filename);
    }

    remainingCredit(params?: any) {
        return this.apiService.get('/reports/remaining-credit', { ...params });
    }

    exportRemainingCredit(params?: any) {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
        const filename = `remaining-credit-report-${dateString}.xlsx`;
        return this.apiService.downloadFile('/reports/remaining-credit/export', { ...params }, filename);
    }

    badDebt(params?: any) {
        return this.apiService.get('/reports/bad-debt', { ...params });
    }

    exportBadDebt(params?: any) {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
        const filename = `bad-debt-report-${dateString}.xlsx`;
        return this.apiService.downloadFile('/reports/bad-debt/export', { ...params }, filename);
    }

    transactions(params?: any) {
        return this.apiService.get('/logs/transactions', { ...params });
    }

    exportTransactions(params?: any) {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
        const filename = `transactions-report-${dateString}.xlsx`;
        return this.apiService.downloadFile('/logs/transactions/export', { ...params }, filename);
    }
}
