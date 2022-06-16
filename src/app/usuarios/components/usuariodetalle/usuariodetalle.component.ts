import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { response } from 'express';
import { UsuariosI } from '../../models/usuarios';
import { UsuariosService } from '../../services/usuarios.service';
@Component({
  selector: 'app-usuariodetalle',
  templateUrl: './usuariodetalle.component.html',
  styleUrls: ['./usuariodetalle.component.css']
})
export class UsuariodetalleComponent implements OnInit {
  id:any;
  usuarios:any;
  constructor(private router:Router, private activatedRoute:ActivatedRoute,
    private usuariosService:UsuariosService) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('mostrar'+this.id);
    this.getUsuario(this.id);
  }
  getUsuario(id:string){
    this.usuariosService.getUser(id)
    .subscribe(response=>{
      this.usuarios = response as UsuariosI;
      console.log(response);
    })
  }

}
