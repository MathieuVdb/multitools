import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators'; 
import { Meteo } from 'src/app/utils/models/Meteo'; 
import { WeatherService } from 'src/app/utils/services/weather.service';
import { Position } from '@capacitor/geolocation'
import { AuthenticationService } from 'src/app/utils/services/authentication.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { MessagesService } from 'src/app/utils/services/messages.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {
  /* 
  Equivalent du module User connecté :
  - Bloqué par un Nagivation Guard
  - Tracker d'activité ng-idle pour déconnecté si l'utilisateur est innactif
  - Les pages associées devront être dans ce module;
  -> Les routes pour ses pages devront être déclarée en forChild, en tant qu'enfant de ce module,
   */
 
  city? : string;
  meteo: Meteo;
  isLoading: boolean = false;
  position: Position; 
  timeIdle: number = 60;
  timeOutIdle: number = 30;

  constructor(
    private idle: Idle,
    private changeDetector: ChangeDetectorRef,
    private weatherService: WeatherService,
    private authenticationService: AuthenticationService,
    private messageService : MessagesService
  ) { }

  ngOnInit() {
   this.getPosition();
   this.setTracker();
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

  setTracker() {
    this.idle.setIdle(this.timeIdle);
    this.idle.setTimeout(this.timeOutIdle);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.watch();

    this.idle.onIdleStart.subscribe(() => { this.messageService.createInfo(`Sans activité de votre part, vous aller être déconnecté dans 30s`);  });
    this.idle.onTimeout.subscribe(() => { this.authenticationService.logout(); });
    this.idle.onIdleEnd.subscribe(() => {  this.changeDetector.detectChanges(); });
  }

}
