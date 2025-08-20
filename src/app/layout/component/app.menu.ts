import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'PAGES',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    {
                        label: 'USSD Menu',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/pages/ussd-management']
                    },
                    {
                        label: 'SMS Content',
                        icon: 'pi pi-fw pi-comments',
                        routerLink: ['/pages/sms-content']
                    },
                    {
                        label: 'SMS Command',
                        icon: 'pi pi-fw pi-expand',
                        routerLink: ['/pages/sms-command']
                    },
                    {
                        label: 'Offer Management',
                        icon: 'pi pi-fw pi-gift',
                        routerLink: ['/pages/offer-management']
                    },
                    {
                        label: 'Summary Report',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/pages/summary-report']
                    },
                    {
                        label: 'Transaction Log',
                        icon: 'pi pi-fw pi-database',
                        routerLink: ['/pages/transaction-log']
                    },
                    {
                        label: 'Balance Management',
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: ['/pages/remaining-credit']
                    },
                    {
                        label: 'Bad Debt Management',
                        icon: 'pi pi-fw pi-ban',
                        routerLink: ['/pages/bad-debt']
                    }
                ]
            },
            {
                label: 'SYSTEM',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'System Configuration',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/system-configs']
                    },
                    {
                        label: 'Administration',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/documentation']
                    }
                ]
            }
        ];
    }
}
