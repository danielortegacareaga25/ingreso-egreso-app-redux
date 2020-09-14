import { Subscription } from 'rxjs';
import { isLoading, stopLoading } from './../shared/ui.actions';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import { IngresoEgreso } from './../models/ingreso-egreso-model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppStateWithIngreso } from './ingreso-egreso.reducer';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoEgresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  subs: Subscription;
  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppStateWithIngreso>
  ) {
    this.subs = new Subscription();
  }

  ngOnInit(): void {
    this.ingresoEgresoForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      monto: ['', [Validators.required]],
    });
    this.subs.add(
      this.store.select('ui').subscribe((ui) => {
        this.cargando = ui.isLoading;
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  guardar() {
    this.store.dispatch(isLoading());
    if (this.ingresoEgresoForm.invalid) return;

    const { descripcion, monto } = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoEgresoForm.reset();
        this.store.dispatch(stopLoading());
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch((err) => {
        this.store.dispatch(stopLoading());
        Swal.fire('Error', err.message, 'warning');
      });
  }
}
