import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from './services/usuarios.service';
import { UsuariodetalleComponent } from './components/usuariodetalle/usuariodetalle.component';

//Importamos ngbootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//Importamos reactiveForms
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    UsuariosComponent,
    LoginComponent,
    UsuariodetalleComponent,
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    UsuariosRoutingModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers:[
    UsuariosService
  ]
})
export class UsuariosModule { }
