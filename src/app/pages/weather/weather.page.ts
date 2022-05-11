import { Component, OnInit } from '@angular/core';
import { Geolocation } from 'src/app/utils/models/Geolocation/geolocation';
import { Weather } from 'src/app/utils/models/weather/weather';
import { WeatherService } from 'src/app/utils/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {

  geoloc: Geolocation;
  weather: Weather;
  search = '';

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit() {
  }

  searchCity() {
    this.weatherService.getCityInformation(this.search).subscribe(
      w => { 
        this.weather = w; 
        this.weatherService.getCountryInformation(this.weather.sys.country).subscribe(
          g => { 
            this.geoloc = g[0]; 
          }
        );
      }
    )
  }

}
