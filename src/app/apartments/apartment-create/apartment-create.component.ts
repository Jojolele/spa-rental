import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ApartmentsService } from '../apartments.service';
import { Apartment } from '../apartment.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-apartment-create',
  templateUrl: './apartment-create.component.html',
  styleUrls: ['./apartment-create.component.scss'],
})
export class ApartmentCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredAddress = '';
  enteredPrice = '';
  enteredPhoneNumber = '';
  enteredBedroomCount = '';
  enteredBathroomCount = '';
  enteredKitchenCount = '';
  enteredGarageCount = '';
  apartment: Apartment;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private apartmentId: string;
  private authStatusSub: Subscription;

  constructor(
    public apartmentsService: ApartmentsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      address: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      price: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      phoneNumber: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      bedroomCount: new FormControl(null, {
        validators: [Validators.required],
      }),
      bathroomCount: new FormControl(null, {
        validators: [Validators.required],
      }),
      kitchenCount: new FormControl(null, {
        validators: [Validators.required],
      }),
      garageCount: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('apartmentId')) {
        this.mode = 'edit';
        this.apartmentId = paramMap.get('apartmentId');
        this.isLoading = true;
        this.apartmentsService
          .getApartment(this.apartmentId)
          .subscribe((apartmentData) => {
            this.isLoading = false;
            this.apartment = {
              id: apartmentData._id,
              title: apartmentData.title,
              address: apartmentData.address,
              price: apartmentData.price,
              phoneNumber: apartmentData.phoneNumber,
              bedroomCount: apartmentData.bedroomCount,
              bathroomCount: apartmentData.bathroomCount,
              kitchenCount: apartmentData.kitchenCount,
              garageCount: apartmentData.garageCount,
              imagePath: apartmentData.imagePath,
              creator: apartmentData.creator
            };
            this.form.setValue({
              title: this.apartment.title,
              address: this.apartment.address,
              price: this.apartment.price,
              phoneNumber: this.apartment.phoneNumber,
              bedroomCount: this.apartment.bedroomCount,
              bathroomCount: this.apartment.bathroomCount,
              kitchenCount: this.apartment.kitchenCount,
              garageCount: this.apartment.garageCount,
              image: this.apartment.imagePath
            });
          });
      } else {
        this.mode = 'create';
        this.apartmentId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveApartment() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.apartmentsService.addApartment(
        this.form.value.title,
        this.form.value.address,
        this.form.value.price,
        this.form.value.phoneNumber,
        this.form.value.bedroomCount,
        this.form.value.bathroomCount,
        this.form.value.kitchenCount,
        this.form.value.garageCount,
        this.form.value.image
      );
    } else {
      this.apartmentsService.updateApartment(
        this.apartmentId,
        this.form.value.title,
        this.form.value.address,
        this.form.value.price,
        this.form.value.phoneNumber,
        this.form.value.bedroomCount,
        this.form.value.bathroomCount,
        this.form.value.kitchenCount,
        this.form.value.garageCount,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.authStatusSub.unsubscribe();
  }
}
