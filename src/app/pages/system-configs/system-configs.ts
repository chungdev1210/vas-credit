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
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfigurationService } from '../../../services/configuration.service';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-system-configs',
    standalone: true,
    templateUrl: './system-configs.component.html',
    imports: [
        ButtonModule,
        TableModule,
        CommonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        DialogModule,
        InputNumberModule,
        FormsModule,
        PaginatorModule,
        MessageModule,
        ToastModule,
        TextareaModule,
        ProgressSpinnerModule,
        TagModule,
        ReactiveFormsModule
    ],
    providers: [ConfigurationService, MessageService]
})
export class SystemConfigsComponent {
    loading: boolean = false;
    configLists: any[] = [];
    first: number = 0;
    rows: number = 99;
    totalRecords: number = 0;
    isDialogVisible: boolean = false;
    configForm: FormGroup;
    formKeys: string[] = [];
    currentEditingItem: any;

    constructor(
        private _configurationService: ConfigurationService,
        private _httpClient: HttpClient,
        private _messageService: MessageService,
        private fb: FormBuilder
    ) {
        this.configForm = this.fb.group({});
    }

    ngOnInit() {
        this.getConfigurations();
    }

    getConfigurations() {
        this.loading = true;
        this._configurationService
            .getConfigurations({
                SkipCount: 0,
                MaxResultCount: 99
            })
            .subscribe({
                next: (response: any) => {
                    this.loading = false;
                    this.configLists = response.data.items;
                },
                error: (error) => {
                    this.loading = false;
                    this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
    }

    openEditDialog(id: number): void {
        this.loading = true;
        this._configurationService.getConfiguration(id).subscribe({
            next: (response: any) => {
                this.loading = false;
                this.currentEditingItem = response.data;
                this.buildForm(response.data.configData);
                this.isDialogVisible = true;
            },
            error: (error) => {
                this.loading = false;
                this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
            }
        });
    }

    private buildForm(configData: any): void {
        const controls: { [key: string]: FormControl } = {};
        this.formKeys = Object.keys(configData);

        this.formKeys.forEach((key) => {
            let value = configData[key];
            // Format lại chuỗi JSON cho dễ đọc trong textarea
            if (this.isJsonString(value)) {
                value = JSON.stringify(JSON.parse(value), null, 2);
            }
            controls[key] = new FormControl(value);
        });

        this.configForm = this.fb.group(controls);
    }

    saveChanges(): void {
        this.loading = true;
        const updatedConfigData = { ...this.configForm.value };
        for (const key in updatedConfigData) {
            if (this.isJsonString(updatedConfigData[key])) {
                updatedConfigData[key] = JSON.stringify(JSON.parse(updatedConfigData[key]));
            }
        }
        const payload = {
            // ...this.currentEditingItem,
            configData: updatedConfigData
        };
        this._configurationService.updateConfiguration(this.currentEditingItem.id, payload).subscribe({
            next: () => {
                this._messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật cấu hình thành công' });
                this.isDialogVisible = false;
                this.loading == false;
                this.getConfigurations();
            },
            error: (error) => {
                this.loading == false;
                this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
            }
        });
    }

    hideDialog(): void {
        this.isDialogVisible = false;
    }

    // Hàm tiện ích kiểm tra chuỗi JSON
    isJsonString(value: any): boolean {
        if (typeof value !== 'string') return false;
        try {
            const result = JSON.parse(value);
            return typeof result === 'object' && result !== null;
        } catch (e) {
            return false;
        }
    }
}
