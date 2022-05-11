import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators'; 
import { Meteo } from 'src/app/utils/models/Meteo'; 
import { WeatherService } from 'src/app/utils/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {
 
  city? : string;
  meteo: Meteo;
  isLoading: boolean = false;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit() {
  }

  getWeather() {
    this.isLoading = true;
    this.weatherService.getCityInformation(this.city)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe( m => { this.meteo = m; })
  }

}
