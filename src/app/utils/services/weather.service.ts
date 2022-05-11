import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Weather } from '../models/weather/weather';
import { ToastController, ToastOptions } from '@ionic/angular';
import { MessagesService } from './messages.service';
import { Geolocation } from '../models/Geolocation/geolocation';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  urlApiWeather = 'https://api.openweathermap.org/data/2.5/weather';
  urlKeyWeather = 'dd480e1ff2c7d140dec816f96db0ca4c';
  units = 'metric';
  
  urlApiCountry = 'https://restcountries.com/v3.1/alpha/';

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private messageService: MessagesService
  ) { }

  getCityInformation(city): Observable<Weather> {
    
    let queryParams = new HttpParams();
    queryParams = queryParams.append("q",city);
    queryParams = queryParams.append("appid", this.urlKeyWeather);
    queryParams = queryParams.append("units", this.units);

    return this.http.get<Weather>(this.urlApiWeather, {params:queryParams}).pipe(
      catchError(err => {
        this.messageService.createToast(`Oups, quelque chose s'est mal passé`, 'danger', 'bottom');
        console.log(err);
        return of(undefined);
      })
    );
  }

  getCountryInformation(code): Observable<Geolocation[]> { 
    return this.http.get<Geolocation[]>(this.urlApiCountry + code).pipe(
      catchError(err => {
        this.messageService.createToast(`Oups, quelque chose s'est mal passé`, 'danger', 'bottom');
        console.log(err);
        return of(undefined);
      })
    );
  }

}
