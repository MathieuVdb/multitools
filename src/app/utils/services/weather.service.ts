import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMapTo, switchMap, tap } from 'rxjs/operators'; 
import { ToastController, ToastOptions } from '@ionic/angular';
import { MessagesService } from './messages.service'; 
import { environment } from 'src/environments/environment';
import { Meteo } from '../models/Meteo';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  urlApiWeather = environment.WEATHER_URL;
  urlKeyWeather = environment.WEATHER_KEY;
  urlApiCountry = environment.COUNTRY_URL;
  tempMeteo: any;

  constructor(
    private http: HttpClient,
    private messageService: MessagesService
  ) { }

  getCityInformation(city: string): Observable<Meteo> {
    
    // Méthode 1
    /*
    let queryParams = new HttpParams();
    queryParams = queryParams.append("q",city);
    queryParams = queryParams.append("appid", this.urlKeyWeather);
    queryParams = queryParams.append("units", this.units);

    return this.http.get<Weather>(`${this.urlApiWeather}`, {params:queryParams}).pipe(
      catchError(err => {
        this.messageService.createToast(`Oups, quelque chose s'est mal passé`, 'danger', 'bottom');
        console.log(err);
        return of(undefined);
      })
    );*/

    // Méthode 2
    return this.http.get<any>(`${this.urlApiWeather}`, {
      params: {
        q: city,
        appid: this.urlKeyWeather,
        units: 'metric'
      }
    }).pipe(
      tap(apiWeather => this.tempMeteo = apiWeather),
      switchMap(apiWeather => this.http.get(`${this.urlApiCountry}/${apiWeather.sys.country}/`)),
      map(apiCountry => this.weatherMapper(apiCountry[0])),
      catchError(err => {
        this.messageService.createAlert(`Oups, quelque chose s'est mal passé`);
        console.log(err);
        return of(undefined);
      })
    );
  }

  weatherMapper(apiCountry) : Meteo {
    return {
      city: this.tempMeteo?.name,
      date: new Date(this.tempMeteo?.dt * 1000) || new Date(),
      temp: this.tempMeteo?.main.temp,
      country: apiCountry?.translations?.fra?.common,
      flag: apiCountry?.flag
    }
  }

  getCountryInformation(code): Observable<Geolocation[]> { 
    return this.http.get<Geolocation[]>(this.urlApiCountry + code).pipe(
      catchError(err => {
        this.messageService.createAlert(`Oups, quelque chose s'est mal passé`);
        console.log(err);
        return of(undefined);
      })
    );
  }

}
