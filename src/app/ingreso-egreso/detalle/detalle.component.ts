import { IngresoEgresoService } from './../../services/ingreso-egreso.service';
import { IngresoEgreso } from './../../models/ingreso-egreso-model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;
  constructor(
    private store: Store<AppStateWithIngreso>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.ingresosSubs = this.store
      .select('item')
      .pipe(filter((items) => items.items.length > 0))
      .subscribe(({ items }) => {
        this.ingresosEgresos = items;
      });
  }

  ngOnDestroy() {
    this.ingresosSubs.unsubscribe();
  }
  borrar(uid: string) {
    this.ingresoEgresoService
      .borrarItem(uid)
      .then(() => {
        Swal.fire('Borrado', 'Item borrado', 'success');
      })
      .catch((err) => {
        Swal.fire('Error', err.message, 'warning');
      });
  }
}
