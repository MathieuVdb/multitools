import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './utils/services/authentication.service';
import { StorageService } from './utils/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  isLogged = false;

  constructor(
    private storageService: StorageService, 
    private renderer: Renderer2,
    private authenticationService: AuthenticationService,
    private router: Router) {}

    
  ngOnInit() {  
    this.iniStorage();
    this.authenticationService.verifyToken();
    this.authenticationService.isLogged$.subscribe(res => this.isLogged = res); 
  }

  async iniStorage() { 
    await this.storageService.init();
  }
  
}
