import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/usuarios/services/usuarios.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  usuarioLogueado = false;
  userName='';
  userType = 1;
  constructor(public usuarioService: UsuariosService) { }

  ngOnInit(): void {
    this.usuarioLogueado = this.usuarioService.isLoggedIn('');
    this.usuarioService.changeLoginStatus$.subscribe((loggedStatus:boolean)=>{
      this.usuarioLogueado = loggedStatus;
    })
    this.usuarioService.changeUserName$.subscribe((userName:any)=>{
      this.userName = userName;
    })
    this.usuarioService.changeUserType$.subscribe((userType:any)=>{
      this.userType = parseInt(userType);
    })
  }
logout(){
  this.usuarioService.logout();
}
}
