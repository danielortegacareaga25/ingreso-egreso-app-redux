import { isLoading, stopLoading } from './../../shared/ui.actions';
import { AppState } from './../../app.reducer';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  cargando: boolean;
  uiSubs: Subscription;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.uiSubs = new Subscription();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(6)]],
    });
    this.uiSubs.add(
      this.store.select('ui').subscribe((valor) => {
        this.cargando = valor.isLoading;
      })
    );
  }

  enviar() {
    this.store.dispatch(isLoading());
    // Swal.fire({
    //   title: 'Espere por favor',
    //   timer: 2000,
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const { email, password } = this.loginForm.value;

    this.authService
      .loginUsuario(email, password)
      .then((credenciales) => {
        this.store.dispatch(stopLoading());
        // Swal.close();
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.store.dispatch(stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      });
  }

  ngOnDestroy() {
    this.uiSubs.unsubscribe();
  }
}
