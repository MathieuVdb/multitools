import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private toastController: ToastController
    ) { }

    
  async createMessage(message = 'Problème ?', 
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
  
  async createAlert(message : string) {
    const config: ToastOptions = {
      message,
      icon: 'alert-circle-outline',
      color: 'danger',
      duration: 3000
    };

    const toast = await this.toastController.create(config);
    toast.present();
  }
  
  async createSuccess(message : string) {
    const config: ToastOptions = {
      message,
      icon: 'checkmark-circle-outline',
      color: 'success',
      duration: 3000
    };

    const toast = await this.toastController.create(config);
    toast.present();
  }
  
  async createInfo(message : string) {
    const config: ToastOptions = {
      message,
      icon: 'information-circle-outline',
      color: 'dark',
      duration: 3000
    };

    const toast = await this.toastController.create(config);
    toast.present();
  }

}
