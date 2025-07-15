import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { CampaignComponent } from './campaign/campaign';
import { CampaignContentComponent } from './campaign-content/campaign-content';
import { PartnersComponent } from './partners/partners';
import { BlackListComponent } from './blacklist/black-list';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'campaign', component: CampaignComponent },
    { path: 'campaign-content', component: CampaignContentComponent },
    { path: 'partners', component: PartnersComponent },
    { path: 'black-list', component: BlackListComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
