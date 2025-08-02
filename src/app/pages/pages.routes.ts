import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { UssdManagementComponent } from './ussd-management/ussd-management';
import { SmsContentComponent } from './sms-content/sms-content';
import { SmsCommandComponent } from './sms-command/sms-command';
import { OfferManagementComponent } from './offer-management/offer-management';
import { SystemConfigsComponent } from './system-configs/system-configs';
import { SummaryReportComponent } from './summary-report/summary-report';
import { TransactionLogComponent } from './transaction-log/transaction-log';
import { RemainingCreditComponent } from './remaining-credit/remaining-credit';
import { BadDebtComponent } from './bad-debt/bad-debt';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'ussd-management', component: UssdManagementComponent },
    { path: 'sms-content', component: SmsContentComponent },
    { path: 'sms-command', component: SmsCommandComponent },
    { path: 'offer-management', component: OfferManagementComponent },
    { path: 'system-configs', component: SystemConfigsComponent },
    { path: 'summary-report', component: SummaryReportComponent },
    { path: 'transaction-log', component: TransactionLogComponent },
    { path: 'remaining-credit', component: RemainingCreditComponent },
    { path: 'bad-debt', component: BadDebtComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
