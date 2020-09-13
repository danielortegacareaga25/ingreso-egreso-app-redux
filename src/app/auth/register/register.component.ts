import { isLoading, stopLoading } from './../../shared/ui.actions';
import { Subscription } from 'rxjs';
import { AppState } from './../../app.reducer';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './../../services/auth.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
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
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.uiSubs.add(
      this.store.select('ui').subscribe((valor) => {
        this.cargando = valor.isLoading;
      })
    );
  }

  enviar() {
    if (this.registerForm.invalid) return;

    this.store.dispatch(isLoading());
    // Swal.fire({
    //   title: 'Espere por favor',
    //   timer: 2000,
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    const { nombre, correo, password } = this.registerForm.value;
    this.authService
      .crearUsuario(nombre, correo, password)
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
