import { AppState } from './../app.reducer';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { setItems } from '../ingreso-egreso/ingreso-egreso.action';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  subs: Subscription;
  ingresosSubs: Subscription;
  constructor(
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subs = this.store
      .select('user')
      .pipe(filter((auth) => auth.user !== null))
      .subscribe((user) => {
        this.ingresosSubs = this.ingresoEgresoService
          .initIngresoEgresosListener(user.user.uid)
          .subscribe((ingresosEgresos) => {
            this.store.dispatch(setItems({ items: ingresosEgresos }));
          });
      });
  }

  ngOnDestroy() {
    this.ingresosSubs.unsubscribe();
    this.subs.unsubscribe();
  }
}
