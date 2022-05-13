import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/utils/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userForm: FormGroup;
  isBiometricAvailable: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() { 
    this.authenticationService.isBiometricAvailable().then(b => this.isBiometricAvailable = b);
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('', [Validators.minLength(3), Validators.required]),
    });
  }
 
  reset() {
    this.userForm.reset();
  }
  
  authenticate() { 
    this.authenticationService.login(this.userForm.value).subscribe(() => {
      this.reset();
      this.router.navigate(['weather']);
    });
  }
  
  bioLogin() {
    this.authenticationService.loginBiometric().subscribe(() => {
      this.reset();
      this.router.navigate(['weather']);
    });
  }


}
