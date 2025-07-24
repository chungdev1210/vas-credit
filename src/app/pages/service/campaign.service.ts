import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CampaignService {
    private baseUrl = 'http://10.101.52.40:9997';
    constructor(private http: HttpClient) {}

    private get<T>(url: string, params?: any): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${url}`, {
            params: params
        });
    }

    private post<T>(url: string, body?: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${url}`, body, {
            headers: this.createHeaders()
        });
    }

    private put<T>(url: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${url}`, body, {
            headers: this.createHeaders()
        });
    }

    private delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}${url}`);
    }

    private createHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json'
        });
    }

    getCampaigns(params?: any) {
        return this.get('/campaigns', { ...params });
    }

    getCampaign(campaignId: any) {
        return this.get(`/api/campaigns/${campaignId}`);
    }

    createCampaign(campaign: any) {
        return this.post('/campaigns', campaign);
    }

    approveContent(body: any) {
        return this.post('/api/InitiateSmsApprovalCommand', body);
    }

    editCampaign(campaignId: any, body: any) {
        return this.put(`/api/campaigns/${campaignId}`, body);
    }

    deleteCampaign(campaignId: any) {
        return this.delete(`/api/campaigns/${campaignId}`);
    }

    createCampaignWithFile(campaign: any) {
        return this.post('/api/campaigns/upload', campaign);
    }

    getPartners(params?: any) {
        return this.get('/sms-command', { ...params });
    }

    createPartner(body: any) {
        return this.post('/sms-command', body);
    }

    getCampaignContents(params?: any) {
        return this.get('/api/GetCampaignContents', { ...params });
    }

    createCampaignContent(body: any) {
        return this.post('/api/CreateCampaignContentCommand', body);
    }

    getCampaignContent(id: any) {
        return this.get(`/sms-contents/${id}`);
    }

    editCampaignContent(id: any, body: any) {
        return this.put(`/sms-contents/${id}`, body);
    }

    deleteCampaignContent(id: any) {
        return this.delete(`/sms-contents/${id}`);
    }

    getBlackList(params?: any) {
        return this.get('/api/blacklist', { ...params });
    }

    createBlackList(body: any) {
        return this.post('/api/blacklist', body);
    }

    deleteBlackListId(id: any) {
        return this.delete(`/api/blacklist/${id}`);
    }
}
