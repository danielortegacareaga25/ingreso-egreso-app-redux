import { Usuario } from './../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    public firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    // console.log(nombre, email, password);
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const { uid } = user;
        const newUser = new Usuario(uid, nombre, email);
        return this.firestore.doc(`${uid}/usuario`).set({
          nombre: newUser.nombre,
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
