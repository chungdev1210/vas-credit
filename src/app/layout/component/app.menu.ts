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
                    { label: 'Trang chủ', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    {
                        label: 'Quản lý Menu USSD',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/pages/ussd-management']
                    },
                    {
                        label: 'Quản lý SMS Content',
                        icon: 'pi pi-fw pi-comments',
                        routerLink: ['/pages/sms-content']
                    },
                    {
                        label: 'Quản lý SMS Command',
                        icon: 'pi pi-fw pi-expand',
                        routerLink: ['/pages/sms-command']
                    },
                    {
                        label: 'Quản lý gói cước',
                        icon: 'pi pi-fw pi-gift',
                        routerLink: ['/pages/offer-management']
                    }
                ]
            },
            {
                label: 'SYSTEM',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Cấu hình hệ thống',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/system-configs']
                    },
                    {
                        label: 'Quản trị',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/documentation']
                    }
                ]
            }
        ];
    }
}
