import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { IngresoEgreso } from './../models/ingreso-egreso-model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  constructor(private firestore: AngularFirestore, private auth: AuthService) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    console.log({ ...ingresoEgreso });
    delete ingresoEgreso.uid;
    return this.firestore
      .doc(`/${this.auth.user.uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }

  initIngresoEgresosListener(uid: string) {
    return this.firestore
      .collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map((snap) => {
          return snap.map((doc) => {
            const data = doc.payload.doc.data() as any;
            return {
              uid: doc.payload.doc.id,
              ...data,
            };
          });
        })
      );
  }

  borrarItem(uidItem: string) {
    const uid = this.auth.user.uid;
    return this.firestore
      .doc(`${uid}/ingresos-egresos/items/${uidItem}`)
      .delete();
  }
}
