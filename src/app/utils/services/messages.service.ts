import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private toastController: ToastController
    ) { }

    
  async createToast(message = 'Problème ?', 
    color: 'success'|'warning'|'danger' = 'warning',
    position: 'top' | 'bottom' | 'middle' = 'bottom') {

    const config: ToastOptions = {
    message,
    icon: 'warning-outline',
    color,
    position,
    duration: 5000
    };

    const toast = await this.toastController.create(config);
    toast.present();
  }

}
