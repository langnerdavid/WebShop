import {Component, inject} from '@angular/core';
import {userDataService} from "../services/userData.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private unsubscribe$ = new Subject<void>();
  constructor(private userDataService: userDataService, private router: Router) {}

  searchText: string | undefined;
  signedIn:boolean = false;
  shoppingCartNumber = this.userDataService.shoppingCartNumber$;

  ngOnInit(){
    this.userDataService.updateCartNumberTest();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Execute code every time the route changes (component is shown)
      this.userDataService.updateData();
      this.signedIn = this.userDataService.isSignedIn();

      this.userDataService.updateCartNumberTest();
    });
    this.userDataService.cartNumber$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cartNumber) => {
        this.shoppingCartNumber = cartNumber;
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  onSearch(){
    //TODO
    // SuchLogik -> beim drücken des Icons soll Suche abgeschlossen werden
    // mit BE/DB diie Artikel anzeigen
    console.log('Suche nach:', this.searchText);
  }
}
