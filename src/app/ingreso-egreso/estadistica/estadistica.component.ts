import { Component, OnInit } from '@angular/core';
import { MultiDataSet, Label } from 'ng2-charts';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from './../../models/ingreso-egreso-model';
import { filter } from 'rxjs/operators';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit {
  ingresos: number = 0;
  egresos: number = 0;
  TotalEgresos: number = 0;
  TotalIngresos: number = 0;

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [[]];

  constructor(private store: Store<AppStateWithIngreso>) {}

  ngOnInit(): void {
    this.store
      .select('item')
      .pipe(filter(({ items }) => items.length > 0))
      .subscribe(({ items }) => {
        this.generarEstadistica(items);
      });
  }

  generarEstadistica(items: IngresoEgreso[]) {
    this.TotalIngresos = items.filter((item) => item.tipo === 'ingreso').length;
    this.TotalEgresos = items.filter((item) => item.tipo === 'egreso').length;
    this.ingresos = items
      .filter((item) => item.tipo === 'ingreso')
      .map((item) => item.monto)
      .reduce((a, b) => a + b);
    this.egresos = items
      .filter((item) => item.tipo === 'egreso')
      .map((item) => item.monto)
      .reduce((a, b) => a + b);
    this.doughnutChartData = [[this.ingresos, this.egresos]];
  }
}
