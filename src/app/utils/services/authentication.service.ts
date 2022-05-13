import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NativeBiometric } from 'capacitor-native-biometric';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  url = 'https://reqres.in/api';
  key = 'token';
  isLogged$ = new BehaviorSubject(false);
  serveurName = 'monserveur';

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private messageService: MessagesService,
    private router: Router
  ) { }

  
  login(user: User): Observable<any> {
    return this.http.post<{token: string}>(`${this.url}/login`, user)
      .pipe(
        tap(res => {
          this.storage.set(this.key, res?.token);
          this.isLogged$.next(true);
          this.messageService.createSuccess(`Bienvenue à toi !`);
        }),
        catchError((e) => {
          console.error(e);
          this.messageService.createAlert(`Identifiant invalide`);
          throw new Error('Identifiants Invalides');
        })
      );
  }
 
  async verifyToken(): Promise<boolean> {
    const t = await this.storage.get(this.key); 
    this.isLogged$.next(!!t); 
    return !!t;
  }
  
  // Dans le meilleur des cas, il faudrait une méthode permettant de vérider que le token est toujours compatible.
  // Exemple ci-dessous
  checkTokenValidity() : Observable<boolean> {
    const token$ = from(this.getToken());
    return token$.pipe(
      switchMap(token => this.http.get<boolean>('url', {
          params: {token}
        })),
        tap(res => {
          this.isLogged$.next(res);
          if(!res) {  this.logout();  }
        })
    );
  }
  
  async getToken() : Promise<string> {
    return await this.storage.get(this.key);
  }
 
  logout() {
    this.storage.remove(this.key);
    this.isLogged$.next(false);
    this.messageService.createInfo(`Vous avez été déconnecté.e`);
    this.router.navigate(['login']);
  }


  /********************** Biométrie ********************/
  setBiometric(user: User) {
    return from(
      NativeBiometric.setCredentials({
        username: user.email,
        password: user.password,
        server: this.serveurName
    }));
  }

  async checkBiometric() {
    let credential;
    try{
      const {isAvailable} = await NativeBiometric.isAvailable();
      if(isAvailable) { 
        credential = await NativeBiometric.getCredentials({
          server: this.serveurName
        }) 
      }
    } catch(e) {
      throw new Error(`Biométrie indisponible`); 
    }
    
    if(credential) { 
      try{
          await NativeBiometric.verifyIdentity({
            reason: 'Raison pour IOS',
            title: '(Android) Se connecter',
            subtitle: '(Android) why not ?',
            description: '(Android) une petite description',
            negativeButtonText: '(Android) Nope !'
          });
        return credential;
      } catch(e) {
        console.error(e.code); 
        this.messageService.createAlert(`Impossible de se connecter via les empruntes`);  
      }
    } 
  }

  loginBiometric() {
    return from(this.checkBiometric())
      .pipe(
        map(credentials => ({email: credentials.username, password: credentials.password})),
        switchMap(credentials => this.login(credentials))
      );
  }

  deleteBiometric() {
    NativeBiometric.deleteCredentials({server: this.serveurName});
  }

  async isBiometricAvailable() {
    try{
      const {isAvailable} = await NativeBiometric.isAvailable();
      return isAvailable;
    } catch(e) {
      return false;
    }
  }

}
