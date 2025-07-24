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
import { AccordionModule } from 'primeng/accordion';
import { UssdService } from '../../../services/ussd.service';
import { ConfigurationService } from '../../../services/configuration.service';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-campaign',
    standalone: true,
    templateUrl: './ussd-management.component.html',
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
        AccordionModule
    ],
    providers: [CampaignService, MessageService]
})
export class UssdManagementComponent {
    loading: boolean = true;
    package1: any = {};
    package2: any = {};
    package3: any = {};
    editData: any = {
        id: 0,
        shortCode: '',
        displayText: '',
        serviceCode: '',
        arpuSegment: '',
        triggerContext: '',
        menuOrder: 0,
        isActive: false,
        serviceInfo: {
            amount: '',
            fee: '',
            serviceType: ''
        }
    };
    serviceInfoExpanded: boolean = true;
    visible: boolean = false;
    bundleOffers: any[] = [];
    constructor(
        private _ussdService: UssdService,
        private _messageService: MessageService,
        private _configurationService: ConfigurationService
    ) {}

    ngOnInit() {
        this.getCategoryUssd();
    }

    getCategoryUssd() {
        this.loading = true;
        this._ussdService
            .getCategoryUssd({
                SkipCount: 0,
                MaxResultCount: 99
            })
            .subscribe({
                next: (response: any) => {
                    this.package1 = response.data.categories['201'];
                    this.package2 = response.data.categories['202'];
                    this.package3 = response.data.categories['203'];
                    this.loading = false;
                },
                error: (error) => {
                    this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                    this.loading = false;
                }
            });
    }

    getBundleOffers(offerType: string, targetArpuSegment: string) {
        if (offerType === 'MONEY') {
            offerType = 'Balance';
        }
        let params = {
            offerType: this.capitalize(offerType),
            targetArpuSegment: targetArpuSegment,
            SkipCount: 0,
            MaxResultCount: 99
        };
        this._configurationService.getBundleOffers(params).subscribe({
            next: (response: any) => {
                this.bundleOffers = response.data.items;
            },
            error: (error) => {
                this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
            }
        });
    }

    capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    openUpdateUssd(data: any) {
        this.getBundleOffers(data.serviceInfo.serviceType, data.arpuSegment);
        this.editData = data;
        this.visible = true;
    }

    updateUssd() {
        this.loading = true;
        let payload = this.editData;
        payload.defaultResponseMessage = this.editData.displayText;
        this._ussdService.updateConfiguration(payload.id, payload).subscribe({
            next: () => {
                this._messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật cấu hình thành công' });
                this.visible = false;
                this.loading == false;
                this.getCategoryUssd();
            },
            error: (error) => {
                this.loading == false;
                this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
            }
        });
    }

    onSave() {
        this.visible = false;
    }

    onCancel() {
        this.visible = false;
    }
}
