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
  isBuyer:boolean = false;
  isSeller: boolean = true;
  shoppingCartNumber = this.userDataService.shoppingCartNumber$;

  ngOnInit(){
    if(!this.userDataService.isSeller()){
      this.userDataService.updateCartNumberTest();
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Execute code every time the route changes (component is shown)
        this.userDataService.updateData();
        this.signedIn = this.userDataService.isSignedIn();
        this.isSeller = this.userDataService.isSeller();

        this.userDataService.updateCartNumberTest();
      });
      this.userDataService.cartNumber$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((cartNumber) => {
          this.shoppingCartNumber = cartNumber;
        });
    }else{
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        console.log('subscribechange')
        // Execute code every time the route changes (component is shown)
        this.userDataService.updateData();
        this.signedIn = this.userDataService.isSignedIn();
        this.isSeller = this.userDataService.isSeller();

      });
    }
  }
  ngOnDestroy() {
    console.log('onDestroy')
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  onSearch(){
    //TODO
    // SuchLogik -> beim drücken des Icons soll Suche abgeschlossen werden
    // mit BE/DB diie Artikel anzeigen
    this.router.navigate(['/searchResults', this.searchText]);
    console.log('Suche nach:', this.searchText);
  }
}
