import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {
    constructor(private apiService: ApiService) {}

    getConfigurations(params?: any) {
        return this.apiService.get('/configurations', { ...params });
    }

    getConfiguration(id: any) {
        return this.apiService.get(`/configurations/${id}`);
    }

    updateConfiguration(id: any, body: any) {
        return this.apiService.put(`/configurations/${id}`, body);
    }

    getBundleOffers(params?: any) {
        return this.apiService.get('/bundle-offers', { ...params });
    }

    getBundleOffer(vasCode: string) {
        return this.apiService.get(`/bundle-offers/${vasCode}`);
    }

    createBundleOffer(body: any) {
        return this.apiService.post('/bundle-offer', body);
    }

    updateBundleOffer(vasCode: string, body: any) {
        return this.apiService.put(`/bundle-offers/${vasCode}`, body);
    }

    deleteBundleOffer(vasCode: string) {
        return this.apiService.delete(`/bundle-offers/${vasCode}`);
    }
}
