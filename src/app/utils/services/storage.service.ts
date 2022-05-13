import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, from } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators'; 
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  ready$ = new BehaviorSubject(false);
  theme$ = new BehaviorSubject('');

  constructor(
    private storage: Storage,
    private messageService : MessagesService
  ) { }

  async init() { 
    await this.storage.create(); 
    this.ready$.next(true);
  }

  /* Synthaxe pour attendre la fin de la creation du storage : à utiliser 
  si on doit utiliser le storage très rapidement. Au démarrage de l'appli,
   en ayant le risque que la promesse de create() ne soit pas terminée
  ==> Plutôt utile sur les ajouts */
  getChiant() {
    this.ready$
      .pipe(
        filter(isReady => isReady),
        switchMap(() => from(this.storage.get('ion_key')))
      );
  } 
 
  clear() {
    this.storage.clear();
    this.messageService.createInfo(`Data supprimé`); 
  }
  
  async delete(key) {
    const keys = await this.storage.keys();
    if(keys.includes(key)) {
      this.storage.remove(key);
    }
  }

}
