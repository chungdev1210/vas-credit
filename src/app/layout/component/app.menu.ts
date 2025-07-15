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
                label: 'Home',
                items: [{ label: 'Trang chủ', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Campaign',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/campaign']
                    },
                    {
                        label: 'Campaign content',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/pages/campaign-content']
                    },
                    {
                        label: 'Partners',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/partners']
                    },
                    {
                        label: 'Black list',
                        icon: 'pi pi-fw pi-address-book',
                        routerLink: ['/pages/black-list']
                    }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    }
                ]
            }
        ];
    }
}
