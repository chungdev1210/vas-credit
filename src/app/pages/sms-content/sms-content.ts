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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { SmsContentService } from '../../../services/sms-content.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-sms-content',
    standalone: true,
    templateUrl: './sms-content.component.html',
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
        InputGroupModule,
        InputGroupAddonModule,
        SelectModule,
        TagModule,
        ToggleSwitchModule
    ],
    providers: [CampaignService, MessageService]
})
export class SmsContentComponent {
    loading: boolean = false;
    isLoading: boolean = false;
    isActive: boolean = false;
    smsContents: any[] = [];
    display: boolean = false;
    messageType = [
        { label: 'LOANSUCCESSMONEY', value: 'LOANSUCCESSMONEY' },
        { label: 'LOADSUCCESSDATA', value: 'LOADSUCCESSDATA' },
        { label: 'LOANSUCCESSVOICE', value: 'LOANSUCCESSVOICE' },
        { label: 'LOANSUCCESSSMS', value: 'LOANSUCCESSSMS' },
        { label: 'LOANSUCCESSBUNDLE', value: 'LOANSUCCESSBUNDLE' }
    ];
    languageOptions = [
        { label: 'en', value: 'en' },
        { label: 'sw', value: 'sw' }
    ];
    smsBody: any = {};
    fieldErrors: any = {};
    deleteId: number | undefined;
    editId: number | undefined;
    isEdit: boolean = false;
    displayConfirmation: boolean = false;
    bundleOffers: any[] = [];

    constructor(
        private _smsContentService: SmsContentService,
        private _configurationService: ConfigurationService,
        private service: MessageService
    ) {}

    ngOnInit() {
        this.getSmsContents();
        this.getBundleOffers();
    }

    getSmsContents() {
        this.isLoading = true;
        this._smsContentService
            .getSmsContents({
                SkipCount: 0,
                MaxResultCount: 99
            })
            .subscribe({
                next: (response: any) => {
                    this.smsContents = response.data.items;
                    this.isLoading = false;
                },
                error: (error) => {
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                    this.isLoading = false;
                }
            });
    }

    parseDate(dateString: string): Date | null {
        const match = dateString.match(/\/Date\((\d+)([+-]\d{4})?\)\//);
        return match ? new Date(parseInt(match[1])) : null;
    }

    getSmsContentForEdit(id: number) {
        this.isEdit = true;
        this.editId = id;
        this._smsContentService.getSmsContent(id).subscribe({
            next: (response: any) => {
                this.smsBody = response.data;
                // this.isActive = this.smsBody.isActive;
                this.display = true;
            },
            error: (error) => {
                this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                this.loading = false;
            }
        });
    }

    deleteSmsContent() {
        this._smsContentService.deleteSmsContent(this.deleteId).subscribe({
            next: (response: any) => {
                this.getSmsContents();
                this.displayConfirmation = false;
            },
            error: (error) => {
                this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
            }
        });
    }

    getBundleOffers() {
        this._configurationService
            .getBundleOffers({
                SkipCount: 0,
                MaxResultCount: 99
            })
            .subscribe({
                next: (response: any) => {
                    this.bundleOffers = response.data.items;
                },
                error: (error) => {
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
    }

    createSmsContent() {
        this.validateForm();
        if (Object.keys(this.fieldErrors).length > 0) {
            return;
        }
        this.loading = true;
        this.smsBody.content = this.smsBody.messageContent;
        // this.smsBody.isActive = this.isActive;
        if (!this.isEdit) {
            this._smsContentService.createSmsContent(this.smsBody).subscribe({
                next: (response: any) => {
                    this.getSmsContents();
                    this.display = false;
                    this.loading = false;
                    this.service.add({ severity: 'success', summary: 'Thông báo', detail: response.responseStatus.message, life: 3000 });
                },
                error: (error: any) => {
                    this.loading = false;
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
        } else {
            this._smsContentService.updateSmsContent(this.editId, this.smsBody).subscribe({
                next: (response: any) => {
                    this.getSmsContents();
                    this.display = false;
                    this.loading = false;
                    this.service.add({ severity: 'success', summary: 'Thông báo', detail: response.responseStatus.message, life: 3000 });
                },
                error: (error) => {
                    this.loading = false;
                    this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
        }
    }

    onlyNumbers(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    validateForm() {
        if (!this.smsBody.offerCode) {
            this.fieldErrors.offerCode = true;
        }
        if (!this.smsBody.messageType) {
            this.fieldErrors.messageType = true;
        }
        if (!this.smsBody.language) {
            this.fieldErrors.language = true;
        }
        if (!this.smsBody.shortCode) {
            this.fieldErrors.shortCode = true;
        }
        if (!this.smsBody.messageContent) {
            this.fieldErrors.messageContent = true;
        }
    }

    openDelete(id?: number) {
        this.deleteId = id;
        this.displayConfirmation = !this.displayConfirmation;
    }

    open() {
        this.smsBody = {};
        this.display = true;
    }

    close() {
        this.display = false;
    }
}
