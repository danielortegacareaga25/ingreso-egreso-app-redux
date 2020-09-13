import { AppState } from './../app.reducer';
import { Usuario } from './../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { setUser, unSetUser } from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  subsFirestore: Subscription;
  constructor(
    private auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) {
    this.subsFirestore = new Subscription();
  }

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      if (fuser) {
        this.subsFirestore = this.firestore
          .doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = Usuario.fromFirebase(firestoreUser);
            this.store.dispatch(setUser({ user }));
          });
      } else {
        this.subsFirestore.unsubscribe();
        this.store.dispatch(unSetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const { uid } = user;
        const newUser = new Usuario(uid, nombre, email);
        return this.firestore.doc(`${uid}/usuario`).set({
          ...newUser,
        });
      });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser !== null));
  }
}
