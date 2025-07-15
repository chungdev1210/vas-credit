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

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-campaign',
    standalone: true,
    templateUrl: './campaign.component.html',
    imports: [ButtonModule, TableModule, CommonModule, IconFieldModule, InputIconModule, InputTextModule, DialogModule, CalendarModule, DropdownModule, InputNumberModule, FileUploadModule, FormsModule, PaginatorModule, MessageModule, ToastModule],
    providers: [CampaignService, MessageService]
})
export class CampaignComponent {
    loading: boolean = true;
    campaigns: any[] = [];
    partners: any[] = [];
    display: boolean = false;
    targetTypeOptions = [
        { label: 'ALL', value: 'ALL' },
        { label: 'FILE', value: 'FILE' }
    ];
    targetType: string = 'ALL';
    uploadedFile: File[] = [];
    private baseUrl = 'http://10.101.52.40:9997';
    campaignBody: any = {};
    startTime: Date | null = null;
    endTime: Date | null = null;
    first: number = 0;
    rows: number = 99;
    totalRecords: number = 0;
    fieldErrors: any = {
        name: false,
        code: false,
        minBalance: false,
        targetType: false,
        partnerId: false,
        startTime: false,
        endTime: false,
        fileUpload: false
    };
    displayConfirmation: boolean = false;
    deleteId: number | undefined;
    editId: number | undefined;
    isEdit: boolean = false;

    constructor(
        private campaignService: CampaignService,
        private _httpClient: HttpClient,
        private service: MessageService
    ) {}

    ngOnInit() {
        this.getCampaigns();
        this.getPartners();
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

    getCampaignForEdit(id: number, startDate: Date) {
        const campaignStartDate = new Date(startDate);
        const currentTime = new Date();
        if (campaignStartDate < currentTime) {
            this.service.add({
                severity: 'error',
                summary: 'Thông báo',
                detail: 'Không được phép sửa campaign đã bắt đầu',
                life: 10000
            });
            return;
        }
        this.isEdit = true;
        this.editId = id;
        this.campaignService.getCampaign(id).subscribe({
            next: (response: any) => {
                this.campaignBody = response.data;
                if (this.campaignBody.startTime) {
                    this.campaignBody.startTime = new Date(this.campaignBody.startTime);
                }
                if (this.campaignBody.endTime) {
                    this.campaignBody.endTime = new Date(this.campaignBody.endTime);
                }
                this.display = true;
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
                    console.error('Error loading partners:', error);
                }
            });
    }

    submitCreateCampaign() {
        if (this.validateForm()) {
            if (this.uploadedFile.length > 0) {
                this.handleCreateCampaignWithFile();
            } else {
                this.createCampaign();
            }
        }
    }

    createCampaign() {
        this.campaignBody.targetType = this.targetType;
        this.campaignBody.startTime = this.onStartTimeSelect(this.campaignBody.startTime);
        this.campaignBody.endTime = this.onStartTimeSelect(this.campaignBody.endTime);
        if (Object.keys(this.campaignBody).length > 0) {
            if (this.isEdit) {
                this.campaignService.editCampaign(this.editId, this.campaignBody).subscribe({
                    next: (response: any) => {
                        if (response.isSuccess) {
                            this.getCampaigns();
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
                this.campaignService.createCampaign(this.campaignBody).subscribe({
                    next: (response: any) => {
                        if (response.isSuccess) {
                            this.getCampaigns();
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

    deleteCampaign() {
        this.campaignService.deleteCampaign(this.deleteId).subscribe({
            next: (response: any) => {
                if (response.isSuccess) {
                    this.getCampaigns();
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

    handleCreateCampaignWithFile() {
        const updatePriceUrl = `${this.baseUrl}/api/campaigns/upload`;
        const formData = new FormData();
        formData.append('subscriberFile', this.uploadedFile[0]);
        formData.append('targetType', this.targetType);
        formData.append('name', this.campaignBody.name);
        formData.append('code', this.campaignBody.code);
        formData.append('minBalance', this.campaignBody.minBalance);
        formData.append('partnerId', this.campaignBody.partnerId);
        formData.append('startTime', this.onStartTimeSelect(this.campaignBody.startTime).toISOString());
        formData.append('endTime', this.onStartTimeSelect(this.campaignBody.endTime).toISOString());
        this._httpClient.post<any>(updatePriceUrl, formData).subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.getCampaigns();
                    this.display = false;
                    this.service.add({ severity: 'success', summary: 'Thông báo', detail: response.responseStatus.message, life: 3000 });
                }
            },
            error: (error) => {
                this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                this.loading = false;
            }
        });
    }
    onStartTimeSelect(event: Date) {
        const vietnamOffset = 7 * 60;
        const localDate = new Date(event.getTime() - event.getTimezoneOffset() * 60000);
        localDate.setMinutes(localDate.getMinutes() + vietnamOffset);
        return localDate;
    }

    validateForm(): boolean {
        let isValid = true;
        this.fieldErrors = {
            name: false,
            code: false,
            minBalance: false,
            targetType: false,
            partnerId: false,
            startTime: false,
            endTime: false,
            fileUpload: false
        };
        if (!this.campaignBody.name || this.campaignBody.name.trim() === '') {
            this.fieldErrors.name = true;
            isValid = false;
        }
        if (!this.campaignBody.code || this.campaignBody.code.trim() === '') {
            this.fieldErrors.code = true;
            isValid = false;
        }
        if (this.campaignBody.minBalance === null || this.campaignBody.minBalance === undefined) {
            this.fieldErrors.minBalance = true;
            isValid = false;
        }
        if (!this.campaignBody.partnerId) {
            this.fieldErrors.partnerId = true;
            isValid = false;
        }
        if (!this.campaignBody.startTime) {
            this.fieldErrors.startTime = true;
            isValid = false;
        }
        if (!this.campaignBody.endTime) {
            this.fieldErrors.endTime = true;
            isValid = false;
        }
        if (this.targetType === 'FILE' && this.uploadedFile.length == 0) {
            this.service.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng tải file dữ liệu!', life: 10000 });
            isValid = false;
        }
        return isValid;
    }

    clearError(fieldName: string): void {
        this.fieldErrors[fieldName] = false;
    }

    openDelete(id?: number) {
        this.deleteId = id;
        this.displayConfirmation = !this.displayConfirmation;
    }

    onUpload(event: any) {
        const file = event.files[0];
        this.uploadedFile.push(file);
    }

    open() {
        this.display = true;
        this.campaignBody = {};
        this.campaignBody.minBalance = 0;
        this.uploadedFile = [];
    }

    close() {
        this.display = false;
    }
}
