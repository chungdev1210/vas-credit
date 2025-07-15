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

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-campaign-content',
    standalone: true,
    templateUrl: './campaign-content.component.html',
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
export class CampaignContentComponent {
    loading: boolean = true;
    campaigns: any[] = [];
    partners: any[] = [];
    compaignContents: any[] = [];
    display: boolean = false;
    typeOptions = [{ label: 'NOTIFY', value: 'NOTIFY' }];
    customerAgreeOptions = [
        { label: 'Agree', value: 1 },
        { label: 'Dismiss', value: 2 }
    ];
    uploadedFile: File[] = [];
    private baseUrl = 'http://10.101.52.40:9997';
    campaignContentBody: any = {};
    first: number = 0;
    rows: number = 99;
    totalRecords: number = 0;
    fieldErrors: any = {
        campaignId: false,
        volume: false,
        partnerId: false,
        content: false
    };

    deleteId: number | undefined;
    editId: number | undefined;
    approveId: number | undefined;
    isEdit: boolean = false;
    displayConfirmation: boolean = false;
    displayApprove: boolean = false;
    phone: string | undefined;

    constructor(
        private campaignService: CampaignService,
        private _httpClient: HttpClient,
        private service: MessageService
    ) {}

    ngOnInit() {
        this.getCampaignContents();
        this.getPartners();
        this.getCampaigns();
    }

    getCampaignContents() {
        this.loading = true;
        this.campaignService
            .getCampaignContents({
                SkipCount: this.first,
                MaxResultCount: this.rows
            })
            .subscribe({
                next: (response: any) => {
                    this.compaignContents = response.items;
                    this.loading = false;
                },
                error: (error) => {
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                    this.loading = false;
                }
            });
    }

    getCampaignContentForEdit(id: number) {
        this.isEdit = true;
        this.editId = id;
        this.campaignService.getCampaignContent(id).subscribe({
            next: (response: any) => {
                if (response.isSuccess) {
                    this.campaignContentBody = response.data;
                    this.display = true;
                }
                if (response.isError) {
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: response.responseStatus.message, life: 10000 });
                }
            },
            error: (error) => {
                this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                this.loading = false;
            }
        });
    }

    getCampaigns() {
        this.loading = true;
        this.campaignService
            .getCampaigns({
                SkipCount: this.first,
                MaxResultCount: this.rows
            })
            .subscribe({
                next: (response: any) => {
                    this.campaigns = response.items;
                    this.loading = false;
                },
                error: (error) => {
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                    this.loading = false;
                }
            });
    }

    getPartners() {
        this.campaignService
            .getPartners({
                HasActiveCampaigns: false,
                SkipCount: this.first,
                MaxResultCount: this.rows
            })
            .subscribe({
                next: (response: any) => {
                    this.partners = response.items;
                },
                error: (error) => {
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
    }

    submitCreateCampaign() {
        if (this.validateForm()) {
            this.createCampaignContent();
        }
    }

    deleteCampaignContent() {
        this.campaignService.deleteCampaignContent(this.deleteId).subscribe({
            next: (response: any) => {
                if (response.isSuccess) {
                    this.getCampaignContents();
                    this.displayConfirmation = false;
                    this.service.add({ severity: 'success', summary: 'Thông báo', detail: response.responseStatus.message, life: 3000 });
                }
                if (response.isError) {
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: response.responseStatus.message, life: 10000 });
                }
                this.loading = false;
            },
            error: (error) => {
                this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                this.loading = false;
            }
        });
    }

    createCampaignContent() {
        if (Object.keys(this.campaignContentBody).length > 0) {
            if (!this.isEdit) {
                this.campaignService.createCampaignContent(this.campaignContentBody).subscribe({
                    next: (response: any) => {
                        if (response.isSuccess) {
                            this.getCampaignContents();
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
            } else {
                this.campaignService.editCampaignContent(this.editId, this.campaignContentBody).subscribe({
                    next: (response: any) => {
                        if (response.isSuccess) {
                            this.getCampaignContents();
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
    }

    approveConfirm() {
        let isValid = true;
        if (!this.phone) {
            this.fieldErrors.phone = true;
            isValid = false;
            return;
        }
        const body = {
            id: this.approveId,
            phoneNumber: this.phone
        };
        this.campaignService.approveContent(body).subscribe({
            next: (response: any) => {
                if (response.isSuccess) {
                    this.getCampaignContents();
                    this.displayApprove = false;
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

    onlyNumbers(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    validateForm(): boolean {
        let isValid = true;
        this.fieldErrors = {
            campaignId: false,
            volume: false,
            partnerId: false,
            content: false
        };
        if (!this.campaignContentBody.partnerId) {
            this.fieldErrors.partnerId = true;
            isValid = false;
        }
        if (!this.campaignContentBody.campaignId) {
            this.fieldErrors.campaignId = true;
            isValid = false;
        }
        if (!this.campaignContentBody.volume) {
            this.fieldErrors.volume = true;
            isValid = false;
        }
        if (!this.campaignContentBody.content) {
            this.fieldErrors.content = true;
            isValid = false;
        }
        return isValid;
    }

    clearError(fieldName: string): void {
        this.fieldErrors[fieldName] = false;
    }

    onUpload(event: any) {
        const file = event.files[0];
        this.uploadedFile[0] = file;
    }

    openDelete(id?: number) {
        this.deleteId = id;
        this.displayConfirmation = !this.displayConfirmation;
    }

    openApprove(id?: number) {
        this.approveId = id;
        this.phone = undefined;
        this.displayApprove = !this.displayApprove;
    }

    open() {
        this.display = true;
        this.campaignContentBody = {};
        this.campaignContentBody.customerAgree = 1;
        this.campaignContentBody.volume = 0;
        this.campaignContentBody.type = 'NOTIFY';
        this.fieldErrors = {
            campaignId: false,
            volume: false,
            partnerId: false,
            content: false
        };
    }

    close() {
        this.display = false;
    }
}
