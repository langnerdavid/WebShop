import {Component, inject} from '@angular/core';
import {userDataService} from "../services/userData.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private userDataService: userDataService, private router: Router) {}

  searchText: string | undefined;
  signedIn:boolean = false;
  shoppingCartNumber:number = 1;

  ngOnInit(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Execute code every time the route changes (component is shown)
      this.userDataService.updateData();
      this.signedIn = this.userDataService.isSignedIn();
    });
    this.userDataService.getCartNumber().then((cartNumber) => {
      this.shoppingCartNumber = cartNumber;
    });
  }
  onSearch(){
    //TODO
    // SuchLogik -> beim drücken des Icons soll Suche abgeschlossen werden
    // mit BE/DB diie Artikel anzeigen
    console.log('Suche nach:', this.searchText);
  }
}
