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
    //TODO
    // weiterleiten auf Profilseite
  }

  onCartClick() {
    console.log('Warenkorb-Button geklickt');
    //TODO
    // weiterleiten zum Warenkorb
  }

  onSearch(){
    //TODO
    // SuchLogik -> beim drücken des Icons soll Suche abgeschlossen werden
    // mit BE/DB diie Artikel anzeigen
    console.log('Suche nach:', this.searchText);
  }
}
