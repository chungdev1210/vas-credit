import { Component } from '@angular/core';
import { CampaignService } from '../service/campaign.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-partners',
    standalone: true,
    templateUrl: './partners.component.html',
    imports: [
        ButtonModule,
        TableModule,
        CommonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        DialogModule,
        CalendarModule,
        DropdownModule,
        InputNumberModule,
        FileUploadModule,
        FormsModule,
        PaginatorModule,
        MessageModule,
        ToastModule,
        TextareaModule
    ],
    providers: [CampaignService, MessageService]
})
export class PartnersComponent {
    loading: boolean = false;
    partners: any[] = [];
    display: boolean = false;
    first: number = 0;
    rows: number = 99;
    totalRecords: number = 0;
    fieldErrors: any = {
        name: false,
        code: false,
        url: false,
        body: false
    };
    partnerData: any = {};

    constructor(
        private campaignService: CampaignService,
        private _httpClient: HttpClient,
        private service: MessageService
    ) {}

    ngOnInit() {
        this.getPartners();
    }

    getPartners() {
        this.loading = true;
        this.campaignService
            .getPartners({
                HasActiveCampaigns: false,
                SkipCount: this.first,
                MaxResultCount: this.rows
            })
            .subscribe({
                next: (response: any) => {
                    this.partners = response.items;
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
    }

    createPartner() {
        this.validateForm();
        if (Object.keys(this.partnerData).length > 0) {
            this.campaignService.createPartner(this.partnerData).subscribe({
                next: (response: any) => {
                    if (response.isSuccess) {
                        this.getPartners();
                        this.display = false;
                        this.service.add({ severity: 'success', summary: 'Thông báo', detail: response.responseStatus.message, life: 3000 });
                    }
                    if (response.isError) {
                        this.service.add({ severity: 'error', summary: 'Thông báo', detail: response.responseStatus.message, life: 10000 });
                    }
                },
                error: (error) => {
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
        }
    }

    validateForm(): boolean {
        let isValid = true;
        this.fieldErrors = {
            name: false,
            code: false,
            url: false,
            body: false
        };
        if (!this.partnerData.name) {
            this.fieldErrors.name = true;
            isValid = false;
        }
        if (!this.partnerData.code) {
            this.fieldErrors.code = true;
            isValid = false;
        }
        if (!this.partnerData.url) {
            this.fieldErrors.url = true;
            isValid = false;
        }
        if (!this.partnerData.body) {
            this.fieldErrors.body = true;
            isValid = false;
        }
        return isValid;
    }

    open() {
        this.display = true;
        this.partnerData = {};
        this.fieldErrors = {
            name: false,
            code: false,
            url: false,
            body: false
        };
    }

    close() {
        this.display = false;
    }
}
