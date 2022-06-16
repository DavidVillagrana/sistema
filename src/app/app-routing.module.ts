import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/components/usuarios/usuarios.component';
import { LoginComponent } from './usuarios/components/login/login.component';
import { CanActivateGuard } from './can-activate.guard';
import { UsuariodetalleComponent } from './usuarios/components/usuariodetalle/usuariodetalle.component';

const routes: Routes = [
  {path: 'usuarios',component: UsuariosComponent, canActivate: [CanActivateGuard],
children:[
 { path: ':id', component: UsuariodetalleComponent, canActivate: [CanActivateGuard]}
]
  },
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
