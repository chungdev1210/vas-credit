import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action d-none" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 34px">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M2 7L12 12" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 22V12" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M22 7L12 12" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M17 4.5L7 9.5" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="font-bold">CMS</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <!-- <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button> -->
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <!-- <span>{{ dataUser.userName }}</span> -->
                    </button>
                    <button type="button" class="layout-topbar-action" (click)="logout()">
                        <i class="pi pi-sign-out"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];
    dataUser: any;

    constructor(
        public layoutService: LayoutService,
        private _authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getToken();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    getToken() {
        this.dataUser = JSON.parse(localStorage.getItem('info') || '{}');
    }

    logout() {
        this._authService.logout().subscribe({
            next: (response: any) => {
                localStorage.removeItem('info');
                this.router.navigate(['auth/login']);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    redirectLogin() {
        if (!this.dataUser) {
            this.router.navigate(['auth/login']);
        }
    }
}
