import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Apartment } from './apartment.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/apartments/';

@Injectable({ providedIn: 'root' })
export class ApartmentsService {
  private apartments: Apartment[] = [];
  private apartmentsUpdated = new Subject<{
    apartments: Apartment[];
    apartmentCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getApartments(apartmentsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${apartmentsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; apartments: any; maxApartments: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((apartmentData) => {
          return {
            apartments: apartmentData.apartments.map((apartment) => {
              return {
                title: apartment.title,
                address: apartment.address,
                id: apartment._id,
                imagePath: apartment.imagePath,
                creator: apartment.creator,
              };
            }),
            maxApartments: apartmentData.maxApartments,
          };
        })
      )
      .subscribe((transformedApartmentData) => {
        this.apartments = transformedApartmentData.apartments;
        this.apartmentsUpdated.next({
          apartments: [...this.apartments],
          apartmentCount: transformedApartmentData.maxApartments,
        });
      });
  }

  getApartmentUpdateListener() {
    return this.apartmentsUpdated.asObservable();
  }

  getApartment(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      address: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addApartment(title: string, address: string, image: File) {
    const apartmentData = new FormData();
    apartmentData.append('title', title);
    apartmentData.append('address', address);
    apartmentData.append('image', image, title);
    this.http
      .post<{ message: string; apartment: Apartment }>(
        BACKEND_URL,
        apartmentData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updateApartment(
    id: string,
    title: string,
    address: string,
    image: File | string
  ) {
    let apartmentData: Apartment | FormData;
    if (typeof image === 'object') {
      apartmentData = new FormData();
      apartmentData.append('id', id);
      apartmentData.append('title', title);
      apartmentData.append('address', address);
      apartmentData.append('image', image, title);
    } else {
      apartmentData = {
        id: id,
        title: title,
        address: address,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(BACKEND_URL + id, apartmentData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  deleteApartment(apartmentId: string) {
    return this.http.delete(BACKEND_URL + apartmentId);
  }
}
