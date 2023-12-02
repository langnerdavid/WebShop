import {Component} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchText: string | undefined;

  onProfileClick() {
    console.log('Profil-Button geklickt');
    // Fügen Sie hier Ihre Logik für Profil-Button hinzu
  }

  onCartClick() {
    console.log('Warenkorb-Button geklickt');
    // Fügen Sie hier Ihre Logik für Warenkorb-Button hinzu
  }
}
