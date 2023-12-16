// app.animations.ts
import { trigger, style, animate, transition } from '@angular/animations';

export const shakeAnimation = trigger('shakeAnimation', [
  transition(':enter', []),
  transition('* => shake', [
    style({ transform: 'translate3d(0, 0, 0)', border: '1px solid #ccc' }),
    animate('300ms ease-in-out', style({ transform: 'translate3d(-10px, 0, 0)', border: '1px solid red' })),
    animate('300ms ease-in-out', style({ transform: 'translate3d(10px, 0, 0)', border: '1px solid red' })),
    animate('300ms ease-in-out', style({ transform: 'translate3d(-10px, 0, 0)', border: '1px solid red' })),
    animate('300ms ease-in-out', style({ transform: 'translate3d(10px, 0, 0)', border: '1px solid red' })),
    animate('300ms ease-in-out', style({ transform: 'translate3d(0, 0, 0)', border: '1px solid red' })),
  ]),
]);
