import { Component } from '@angular/core';
import { CampaignService } from '../service/campaign.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule, DatePipe } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DatePickerModule } from 'primeng/datepicker';
import { ReportService } from '../../../services/report.service';

@Component({
    selector: 'app-summary-report',
    standalone: true,
    templateUrl: './summary-report.component.html',
    imports: [ButtonModule, TableModule, CommonModule, IconFieldModule, InputIconModule, InputTextModule, InputNumberModule, FormsModule, PaginatorModule, MessageModule, ToastModule, ProgressSpinnerModule, DatePickerModule],
    providers: [CampaignService, MessageService, DatePipe]
})
export class SummaryReportComponent {
    constructor(
        private _reportService: ReportService,
        private _messageService: MessageService,
        private datePipe: DatePipe
    ) {}
    loading: boolean = false;
    dailys: any[] = [];
    fromDate: Date | undefined;
    toDate: Date | undefined;
    ngOnInit() {
        this.reportDaily();
    }

    reportDaily() {
        this.loading = true;
        this._reportService
            .reportDaily({
                ...(this.fromDate && { fromDate: this.getFormattedDate(this.fromDate) }),
                ...(this.toDate && { toDate: this.getFormattedDate(this.toDate) })
            })
            .subscribe({
                next: (response: any) => {
                    this.dailys = response.data;
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
    }

    exportReportDaily() {
        if (!this.fromDate) {
            this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng nhập ngày bắt đầu', life: 5000 });
            return;
        }
        if (!this.toDate) {
            this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng nhập ngày kết thúc', life: 5000 });
            return;
        }
        this._reportService
            .exportReportDaily({
                ...(this.fromDate && { fromDate: this.getFormattedDate(this.fromDate) }),
                ...(this.toDate && { toDate: this.getFormattedDate(this.toDate) })
            })
            .subscribe({
                next: (response: any) => {
                    console.log(response);
                },
                error: (error) => {
                    this.loading = false;
                    this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
    }

    parseDotNetDate(dotNetDate: string) {
        if (!dotNetDate) return null;
        var match = dotNetDate.match(/\/Date\((-?\d+)(?:[+-]\d{4})?\)\//);
        if (match) {
            return new Date(parseInt(match[1]));
        }
        return new Date(dotNetDate);
    }

    getFormattedDate(date: Date, format: string = 'yyyy-MM-dd'): string {
        return this.datePipe.transform(date, format) || '';
    }
}
