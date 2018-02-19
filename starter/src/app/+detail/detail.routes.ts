import { DetailComponent } from './detail.component';
import { Ng2StateDeclaration } from '@uirouter/angular';

export const DETAIL_STATES: Ng2StateDeclaration[] = [
    {name: 'detail', url: '/detail', component: DetailComponent},
    {
        name: 'childDetail.**',
        url: '/child-detail',
        loadChildren: './+child-detail/child-detail.module#ChildDetailModule'
    }
];
