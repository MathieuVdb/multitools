import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators'; 
import { Meteo } from 'src/app/utils/models/Meteo'; 
import { WeatherService } from 'src/app/utils/services/weather.service';
import { Position } from '@capacitor/geolocation'

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {
 
  city? : string;
  meteo: Meteo;
  isLoading: boolean = false;
  position: Position;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit() {
   this.getPosition();
  }

  async getPosition() {
    this.position = await this.weatherService.getLocation(); 
    if(this.position) {
      this.isLoading = true;
      this.weatherService.getCityInformationbyLatAndLong(this.position)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe( m => { this.meteo = m; });
    }
  }

  getWeather() {
    if(this.city) {
      this.isLoading = true;
      this.weatherService.getCityInformation(this.city)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe( m => { this.meteo = m; })
    }
  }

}
