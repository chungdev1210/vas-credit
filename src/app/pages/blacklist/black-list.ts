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
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-black-list',
    standalone: true,
    templateUrl: './black-list.component.html',
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
        TextareaModule,
        ProgressSpinnerModule
    ],
    providers: [CampaignService, MessageService]
})
export class BlackListComponent {
    loading: boolean = false;
    blacklists: any[] = [];
    display: boolean = false;
    displayDelete: boolean = false;
    first: number = 0;
    rows: number = 99;
    totalRecords: number = 0;
    fieldErrors: any = {
        phoneNumber: false,
        reason: false
    };
    blackListData: any = {};
    deleteId: number | undefined;

    constructor(
        private campaignService: CampaignService,
        private _httpClient: HttpClient,
        private service: MessageService
    ) {}

    ngOnInit() {
        this.getBlackList();
    }

    getBlackList() {
        this.loading = true;
        this.campaignService.getBlackList().subscribe({
            next: (response: any) => {
                this.blacklists = response.data.items;
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
            }
        });
    }

    createBlackList() {
        this.validateForm();
        if (Object.keys(this.blackListData).length > 0) {
            this.campaignService.createBlackList(this.blackListData).subscribe({
                next: (response: any) => {
                    if (response.isSuccess) {
                        this.getBlackList();
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

    deleteBlackListId() {
        this.campaignService.deleteBlackListId(this.deleteId).subscribe({
            next: (response: any) => {
                if (response.isSuccess) {
                    this.getBlackList();
                    this.displayDelete = false;
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

    openDelete(id?: number) {
        this.deleteId = id;
        this.displayDelete = !this.display;
    }

    validateForm(): boolean {
        let isValid = true;
        this.fieldErrors = {
            phoneNumber: false,
            reason: false
        };
        if (!this.blackListData.phoneNumber) {
            this.fieldErrors.phoneNumber = true;
            isValid = false;
        }
        if (!this.blackListData.reason) {
            this.fieldErrors.reason = true;
            isValid = false;
        }
        return isValid;
    }

    open() {
        this.display = true;
        this.blackListData = {};
        this.fieldErrors = {
            phoneNumber: false,
            reason: false
        };
    }

    close() {
        this.display = false;
    }
}
