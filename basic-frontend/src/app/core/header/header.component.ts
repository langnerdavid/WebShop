import {Component, inject} from '@angular/core';
import {userDataService} from "../services/userData.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private userData = inject(userDataService);
  searchText: string | undefined;
  signedIn:boolean = false;

  ngOnInit(){
    this.signedIn = !(this.userData.role === null || this.userData.id === null || this.userData.password === null);
  }
  onSearch(){
    //TODO
    // SuchLogik -> beim drücken des Icons soll Suche abgeschlossen werden
    // mit BE/DB diie Artikel anzeigen
    console.log('Suche nach:', this.searchText);
  }
}
