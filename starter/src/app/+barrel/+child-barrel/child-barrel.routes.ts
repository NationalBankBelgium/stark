import { ChildBarrelComponent } from './child-barrel.component';
import { Ng2StateDeclaration } from '@uirouter/angular';

export const CHILD_BARREL_STATES: Ng2StateDeclaration[] = [
  { name: 'childBarrel', url: '/child-barrel', parent: 'barrel', component: ChildBarrelComponent },
];
