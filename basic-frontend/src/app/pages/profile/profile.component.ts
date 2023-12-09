import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  orders = [
    { id: 'ORD-001', date: '2021-01-15', status: 'Completed', total: '$120.00' },
    { id: 'ORD-002', date: '2021-02-20', status: 'Completed', total: '$75.00' },
    { id: 'ORD-003', date: '2021-03-10', status: 'Pending', total: '$200.00' },
  ];
}
