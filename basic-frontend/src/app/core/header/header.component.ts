import {Component} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchText: string | undefined;

  onSearch(){
    //TODO
    // SuchLogik -> beim drücken des Icons soll Suche abgeschlossen werden
    // mit BE/DB diie Artikel anzeigen
    console.log('Suche nach:', this.searchText);
  }
}
