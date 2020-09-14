import { ActionReducerMap } from '@ngrx/store';
import * as uiReducers from './shared/ui.reducer';
import * as authReducers from './auth/auth.reducer';
import * as ingresoEgresoReducers from './ingreso-egreso/ingreso-egreso.reducer';

export interface AppState {
  ui: uiReducers.State;
  user: authReducers.State;
  item: ingresoEgresoReducers.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: uiReducers.uiReducer,
  user: authReducers.authReducer,
  item: ingresoEgresoReducers.ingresoEgresoReducer,
};
