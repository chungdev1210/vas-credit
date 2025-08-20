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
import { SmsCommandsService } from '../../../services/sms-command.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-sms-command',
    standalone: true,
    templateUrl: './sms-command.component.html',
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
export class SmsCommandComponent {
    loading: boolean = false;
    isLoading: boolean = false;
    isActive: boolean = true;
    smsContents: any[] = [];
    display: boolean = false;
    commandTypeOptions = [{ label: 'OFFERREQUEST', value: 'OFFERREQUEST' }];
    offerTypeOptions = [
        { label: 'Balance', value: 'Balance' },
        { label: 'Data', value: 'Data' },
        { label: 'Voice', value: 'Voice' }
    ];
    smsBody: any = {};
    fieldErrors: any = {};
    deleteId: number | undefined;
    editId: number | undefined;
    isEdit: boolean = false;
    displayConfirmation: boolean = false;
    bundleOffers: any[] = [];

    constructor(
        private _smsCommandsService: SmsCommandsService,
        private _configurationService: ConfigurationService,
        private service: MessageService
    ) {}

    ngOnInit() {
        this.getSmsCommands();
        this.getBundleOffers();
    }

    getSmsCommands() {
        this.isLoading = true;
        this._smsCommandsService
            .getSmsCommands({
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

    onOfferCodeChange(selectedValue: string) {
        if (selectedValue) {
            const selectedOffer = this.bundleOffers.find((offer) => offer.vasCode === selectedValue);
            if (selectedOffer) {
                this.smsBody.price = selectedOffer.price.toString();
                this.smsBody.serviceFee = selectedOffer.fixedServiceFee ? selectedOffer.fixedServiceFee : 0;
                this.smsBody.offerType = this.capitalize(selectedOffer.offerType);
            }
        } else {
            this.smsBody.price = '';
            this.smsBody.serviceFee = '';
            this.smsBody.offerType = '';
        }
    }

    getSmsCommandForEdit(id: number) {
        this.isEdit = true;
        this.editId = id;
        this._smsCommandsService.getSmsCommand(id).subscribe({
            next: (response: any) => {
                this.smsBody = response.data;
                if (this.smsBody.offerType) this.smsBody.offerType = this.capitalize(this.smsBody.offerType);
                this.isActive = this.smsBody.isActive;
                this.display = true;
            },
            error: (error) => {
                this.service.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
            }
        });
    }

    deleteSmsCommand() {
        this.loading = true;
        this._smsCommandsService.deleteSmsCommand(this.deleteId).subscribe({
            next: (response: any) => {
                this.getSmsCommands();
                this.loading = false;
                this.displayConfirmation = false;
            },
            error: (error) => {
                this.loading = false;
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

    createSmsCommand() {
        this.validateForm();
        console.log(this.fieldErrors);
        if (Object.keys(this.fieldErrors).length > 0) {
            return;
        }
        this.loading = true;
        this.smsBody.isActive = this.isActive;
        if (!this.isEdit) {
            this._smsCommandsService.createSmsCommand(this.smsBody).subscribe({
                next: (response: any) => {
                    this.getSmsCommands();
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
            this._smsCommandsService.updateSmsCommand(this.editId, this.smsBody).subscribe({
                next: (response: any) => {
                    this.getSmsCommands();
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

    capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    validateForm() {
        if (!this.smsBody.command) {
            this.fieldErrors.command = true;
        }
        if (!this.smsBody.commandType) {
            this.fieldErrors.commandType = true;
        }
        if (!this.smsBody.offerCode) {
            this.fieldErrors.offerCode = true;
        }
        if (!this.smsBody.offerType) {
            this.fieldErrors.offerType = true;
        }
        if (!this.smsBody.serviceFee && this.smsBody.serviceFee < 0) {
            this.fieldErrors.serviceFee = true;
        }
        if (!this.smsBody.price) {
            this.fieldErrors.price = true;
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
