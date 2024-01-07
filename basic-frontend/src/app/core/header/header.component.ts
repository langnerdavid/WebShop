import {Component} from '@angular/core';
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
  signedIn = false;
  isSeller = true;
  shoppingCartNumber = this.userDataService.shoppingCartNumber$;

  ngOnInit(){
    // Initialize UserData depending on whether the user is signed in or not

    if(!this.userDataService.isSeller()){
      this.userDataService.updateCartNumber();
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Execute code every time the route changes (component is shown) to make sure that login/logout process is executed properly
        this.userDataService.updateData();
        this.signedIn = this.userDataService.isSignedIn();
        this.isSeller = this.userDataService.isSeller();

        this.userDataService.updateCartNumber();
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
        // Execute code every time the route changes (component is shown) to make sure that login/logout process is executed properly
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
    this.router.navigate(['/searchResults', this.searchText]).then();
    console.log('Suche nach:', this.searchText);
  }
}
