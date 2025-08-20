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
import { ConfigurationService } from '../../../services/configuration.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-offfer-management',
    standalone: true,
    templateUrl: './offer-management.component.html',
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
        ProgressSpinnerModule,
        RadioButtonModule,
        TagModule
    ],
    providers: [CampaignService, MessageService]
})
export class OfferManagementComponent {
    constructor(
        private _configurationService: ConfigurationService,
        private _messageService: MessageService
    ) {}
    loading: boolean = false;
    display: boolean = false;
    displayDelete: boolean = false;
    isEdit: boolean = false;
    bundleOffers: any[] = [];
    offerTypeOptions = [
        { label: 'Balance', value: 'Balance' },
        { label: 'Data', value: 'Data' },
        { label: 'Voice', value: 'Voice' }
    ];
    targetArpuSegment = [
        { label: 'ARPU_LOW', value: 'ARPU_LOW' },
        { label: 'ARPU_HIGH', value: 'ARPU_HIGH' },
        { label: 'ANY', value: 'ANY' }
    ];
    activeOptions = [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
    ];
    fieldErrors: any = {};
    offerBody: any = {
        vasCode: '',
        ocsOfferName: '',
        offerType: '',
        benefitMinutes: 0,
        benefitMB: 0,
        price: 0,
        targetArpuSegment: '',
        fixedServiceFee: 0,
        validityDays: 0
    };
    vasCode: string = '';

    ngOnInit() {
        this.getBundleOffers();
    }

    getBundleOffers() {
        this.loading = true;
        this._configurationService
            .getBundleOffers({
                SkipCount: 0,
                MaxResultCount: 99
            })
            .subscribe({
                next: (response: any) => {
                    this.bundleOffers = response.data.items;
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
    }

    createBundleOffers() {
        this.validateForm();
        if (Object.keys(this.fieldErrors).length > 0) {
            return;
        }
        this.loading = true;
        if (!this.isEdit) {
            this._configurationService.createBundleOffer(this.offerBody).subscribe({
                next: (response: any) => {
                    this.getBundleOffers();
                    this.display = false;
                    this.loading = false;
                    this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: response.responseStatus.message, life: 3000 });
                },
                error: (error: any) => {
                    this.loading = false;
                    this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
        } else {
            this._configurationService.updateBundleOffer(this.vasCode, this.offerBody).subscribe({
                next: (response: any) => {
                    this.getBundleOffers();
                    this.display = false;
                    this.vasCode = '';
                    this.loading = false;
                    this.isEdit = false;
                    this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: response.responseStatus.message, life: 3000 });
                },
                error: (error) => {
                    this.loading = false;
                    this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
        }
    }

    getBundleOfferForEdit(vasCode: string) {
        this.isEdit = true;
        this.vasCode = vasCode;
        this._configurationService.getBundleOffer(vasCode).subscribe({
            next: (response: any) => {
                this.offerBody = response.data;
                this.offerBody.offerType = this.capitalize(this.offerBody.offerType);
                this.display = true;
            },
            error: (error) => {
                this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
            }
        });
    }

    deleteBundleOffer() {
        this.loading = true;
        this._configurationService.deleteBundleOffer(this.vasCode).subscribe({
            next: (response: any) => {
                this.getBundleOffers();
                this.loading = false;
                this.displayDelete = false;
                this.vasCode = '';
            },
            error: (error) => {
                this.loading = false;
                this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
            }
        });
    }

    validateForm() {
        if (!this.offerBody.vasCode) {
            this.fieldErrors.vasCode = true;
        }
        if (!this.offerBody.ocsOfferName) {
            this.fieldErrors.ocsOfferName = true;
        }
        if (!this.offerBody.offerType) {
            this.fieldErrors.offerType = true;
        }
        if (!this.offerBody.offerType) {
            this.fieldErrors.offerType = true;
        }
        if (this.offerBody.offerType === 'Voice' && this.offerBody.benefitMinutes === undefined) {
            this.fieldErrors.benefitMinutes = true;
        }
        if (this.offerBody.offerType === 'Data' && this.offerBody.benefitMB === undefined) {
            this.fieldErrors.benefitMinutes = true;
        }
        if (this.offerBody.price === undefined) {
            this.fieldErrors.price = true;
        }
        if (!this.offerBody.targetArpuSegment) {
            this.fieldErrors.targetArpuSegment = true;
        }
        if (this.offerBody.validityDays === undefined) {
            this.fieldErrors.validityDays = true;
        }
        if (this.offerBody.fixedServiceFee === undefined) {
            this.fieldErrors.fixedServiceFee = true;
        }
    }

    onlyNumbers(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    open() {
        this.offerBody = {
            vasCode: '',
            ocsOfferName: '',
            offerType: '',
            benefitMinutes: 0,
            benefitMB: 0,
            price: 0,
            targetArpuSegment: '',
            fixedServiceFee: 0,
            validityDays: 0,
            benefitSms: null,
            serviceFeeRate: null,
            mpsCategory: '',
            mpsSubService: '',
            mpsCode: '',
            mpsPriceCommandValue: null,
            isActive: true,
            description: ''
        };
        this.display = true;
    }

    close() {
        this.display = false;
    }

    openDelete(vasCode: string) {
        this.vasCode = vasCode;
        this.displayDelete = true;
    }

    closeDelete() {
        this.displayDelete = false;
    }
}
