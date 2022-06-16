import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {tap} from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { UsuariosI } from '../models/usuarios';
import { TokenI } from '../models/token';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  AUTH_SERVER: string = 'http://localhost:3100/api/';
  authSubject = new BehaviorSubject(false);
  
  private token!: string;

  public urlUsuarioIntentaAcceder ='';
  public changeLoginStatusSubject = new Subject<boolean>();
  public changeLoginStatus$= this.changeLoginStatusSubject.asObservable();

  public changeUserNameSubject = new Subject<String>();
  public changeUserName$ = this.changeUserNameSubject.asObservable();
  public changeUserTypeSubject = new Subject<String>();
  public changeUserType$ = this.changeUserTypeSubject.asObservable();

  
  constructor(private httpClient: HttpClient){ }
  login(user:UsuariosI):Observable<TokenI>{
    return this.httpClient.post<TokenI>(this.AUTH_SERVER+'login',
    user).pipe(tap(
      (res)=>{
        if(res.success){ //success = true <- Usuario y contraseña correctos
          var decoded = jwt_decode<TokenI>(res.token);
          var UserName = decoded.user.name;
          this.changeUserNameSubject.next(UserName);
          this.saveToken(res.token, decoded.exp)
          this.changeLoginStatusSubject.next(true);

          //Emitir el tipo de usuario a variable globar en emmoria
          var userType = decoded.user.tipo;
          this.changeUserTypeSubject.next(userType);

        }
        return this.token;
      }
    ));
  }
  logout():void{
    this.token= '';
    localStorage.removeItem("ACCESS_T0KEN");
    localStorage.removeItem("EXPRIES_IN");
    this.changeLoginStatusSubject.next(false);
  }
  private saveToken(token: string, expiresIn:string):void{
    localStorage.setItem("ACCESS_T0KEN",token);
    localStorage.setItem("EXPIRES_IN",expiresIn);
    this.token= token;
  }
  private getToken():string {
    if(this.token){
      this.token = JSON.parse(localStorage.getItem('ACCESS_T0KEN') || '{}');
    }
  return this.token;    
  }
  isLoggedIn(url: string){
    const isLogged = localStorage.getItem("ACCESS_T0KEN");
    if(isLogged){
      this.urlUsuarioIntentaAcceder = url;
      return true;
    }
    return false;
  }
  getUsers(){
    return this.httpClient.get(
      this.AUTH_SERVER+'users',
      {
        headers: new HttpHeaders({'Authorization':'token-auth'+this.getToken()})
      }
    );
  }
  getUser(id:String){
    return this.httpClient.get(
      this.AUTH_SERVER+'users/'+id,
      {
        headers: new HttpHeaders({'Authorization':'token-auth'+this.getToken()})
      }
    );
  }
  addUser(usuario:UsuariosI){
    console.log(this.getToken())
    return this.httpClient.post(
      this.AUTH_SERVER+'users/',usuario,{
        headers: new HttpHeaders({'Authorization': 'token-auth'+ this.getToken()})
      }
    )
  }
  removeUser(id:string){
    return this.httpClient.delete(
      this.AUTH_SERVER+'users/'+id,
    {headers: new HttpHeaders({'Authorization': 'token-auth'+this.getToken()})}
    );
  }
  updateUser(id:string, usuario:UsuariosI){
    console.log(this.getToken())
    return this.httpClient.put(
      this.AUTH_SERVER+'users/'+id,usuario,
      {
        headers: new HttpHeaders ({'Content-Type':'application/json', 'Authorization': 'token-auth '+ this.getToken()})
      }
    );
    console.log(usuario._id+' '+this.getToken())
  }
}
