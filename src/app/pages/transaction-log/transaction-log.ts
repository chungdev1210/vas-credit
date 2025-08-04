import { Component, ViewChild } from '@angular/core';
import { CampaignService } from '../service/campaign.service';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
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
    selector: 'app-transaction-log',
    standalone: true,
    templateUrl: './transaction-log.component.html',
    imports: [ButtonModule, TableModule, CommonModule, IconFieldModule, InputIconModule, InputTextModule, InputNumberModule, FormsModule, PaginatorModule, MessageModule, ToastModule, ProgressSpinnerModule, DatePickerModule],
    providers: [CampaignService, MessageService, DatePipe]
})
export class TransactionLogComponent {
    @ViewChild('dt1') table!: Table;
    constructor(
        private _reportService: ReportService,
        private _messageService: MessageService,
        private datePipe: DatePipe
    ) {}
    loading: boolean = false;
    transactions: any[] = [];
    fromDate: Date | undefined;
    toDate: Date | undefined;
    msisdn: string | undefined;
    ngOnInit() {
        this.getTransactions();
    }

    getTransactions() {
        this.loading = true;
        this._reportService
            .transactions({
                ...(this.fromDate && { fromDate: this.getFormattedDate(this.fromDate) }),
                ...(this.toDate && { toDate: this.getFormattedDate(this.toDate) }),
                ...(this.msisdn && { msisdn: this.msisdn }),
                SkipCount: 0,
                MaxResultCount: 99
            })
            .subscribe({
                next: (response: any) => {
                    this.transactions = response.data.items;
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.statusText, life: 10000 });
                }
            });
    }

    exportTransactions() {
        const skipCount = this.table.first || 0;
        const maxResultCount = this.table.rows || 10;
        this._reportService
            .exportTransactions({
                ...(this.fromDate && { fromDate: this.getFormattedDate(this.fromDate) }),
                ...(this.toDate && { toDate: this.getFormattedDate(this.toDate) }),
                ...(this.msisdn && { msisdn: this.msisdn }),
                skipCount: skipCount,
                maxResultCount: maxResultCount
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
