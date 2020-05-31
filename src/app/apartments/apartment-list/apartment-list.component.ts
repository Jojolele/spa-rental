import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Apartment } from '../apartment.model';
import { ApartmentsService } from '../apartments.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss'],
})
export class ApartmentListComponent implements OnInit, OnDestroy {
  apartments: Apartment[] = [];
  isLoading = false;
  totalApartments = 0;
  apartmentsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10, 15];
  userIsAuthenticated = false;
  userId: string;
  private apartmentsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public apartmentsService: ApartmentsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.apartmentsService.getApartments(
      this.apartmentsPerPage,
      this.currentPage
    );
    this.userId = this.authService.getUserId();
    this.apartmentsSub = this.apartmentsService
      .getApartmentUpdateListener()
      .subscribe(
        (apartmentData: {
          apartments: Apartment[];
          apartmentCount: number;
        }) => {
          this.isLoading = false;
          this.totalApartments = apartmentData.apartmentCount;
          this.apartments = apartmentData.apartments;
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.apartmentsPerPage = pageData.pageSize;
    this.apartmentsService.getApartments(
      this.apartmentsPerPage,
      this.currentPage
    );
  }

  onDelete(apartmentId: string) {
    this.isLoading = true;
    this.apartmentsService.deleteApartment(apartmentId).subscribe(() => {
      this.apartmentsService.getApartments(
        this.apartmentsPerPage,
        this.currentPage
      );
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.apartmentsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
