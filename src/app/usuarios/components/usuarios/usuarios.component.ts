import { Component, OnInit } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import { Router } from "@angular/router";
import { UsuariosI } from "../../models/usuarios";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {  FormBuilder, FormGroup,Validators } from "@angular/forms";
import { MusMatch } from "./helpers/must-match.validator";
import { response } from "express";
import Swal from "sweetalert2";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit {
  closeResult= '';
  registerForm: FormGroup|any ;
  public submitted = false;
  public user:UsuariosI |any;
  public usuarios: any[] =[];
  public updateForm: FormGroup | any;

  constructor(private usuariosService:UsuariosService,
  private router:Router,
  public modalUpdate: NgbModal,
  public modal: NgbModal,
  public modalDelete: NgbModal,
  private formBuilder:FormBuilder) { 

  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.min(1)]],
      email: [null, [Validators.required, Validators.email, Validators.min(2)]],
      password: ['', [Validators.required,Validators.minLength(6), Validators.min(2)]],
      passwordconfirm: [null, [Validators.required, Validators.min(1)]],
      tipo: [null, [Validators.required, Validators.min(1)]],
    },
    {
      validator:MusMatch('password','passwordconfirm')
    });
   
  this.updateForm= this.formBuilder.group({
      _id: [''],
      name: [null, [Validators.required, Validators.min(1)]],
      email: [null, [Validators.required, Validators.email, Validators.min(2)]],
      password: ['', [Validators.required,Validators.minLength(6), Validators.min(2)]],
      tipo: [null, [Validators.required, Validators.min(1)]],
  },
  );
  this.getUsuarios();
}
  //Metodo getter para un facil acceso a los campos del formulario
  get fields(){ return this.registerForm.controls;}

  getUsuarios(){
    this.usuariosService.getUsers()
    .subscribe(response=>{
      console.log("llamada a getUsuarios")
      this.usuarios = response as UsuariosService[];
    })
  }
  mostrarUsuario(_id: string){
    this.router.navigate(['usuarios/'+_id])
  }
  open(content: any){
    this.registerForm.reset();
    this.modal.open(content,{ariaLabelledBy: 'modal-basic-title'}).result.then((result)=>{
      this.closeResult = `Closed with: ${result}`;
    }, (reason)=>{
      this.closeResult = `Dismissed ${this.getDissmissReason(reason)}`;
    });
  }
  private getDissmissReason(reason: any):string{
    if(reason === ModalDismissReasons.BACKDROP_CLICK){
      return 'by clicking on a backdrop';
    }else{
      return `with: ${reason}`;
    }
  }
  onSubmit(){
    this.submitted = true;
    if(this.registerForm.invalid){
      return;
    }
    //console.log(this.registerForm.value);
    let usuario= {
      _id:'',
      name: '',
      email: '',
      password:'',
      tipo: 0
    }
    usuario.name = this.registerForm.value.name;
    usuario.email = this.registerForm.value.email;
    usuario.password = this.registerForm.value.password;
    usuario.tipo = this.registerForm.value.tipo;

    this.usuariosService.addUser(usuario)
    .subscribe(response=>{
      this.getUsuarios();
      this.registerForm.reset();
      this.modal.dismissAll();
    })
      }
    abrirModalEliminar(id: String,modalname: any){
      this.usuariosService.getUser(id)
      .subscribe(response=>{
        this.user = response as UsuariosI;
      })
      this.modalDelete.open(modalname,{size:'sm'}).result.then((result)=>{
        this.closeResult = `Closed with ${result}`;
      },(reason)=>{
        this.closeResult = `Dismissed ${this.getDissmissReason(reason)}`;
      });
    }
    deleteUser(id: string){
      console.log(id);
      this.usuariosService.removeUser(id)
      .subscribe(response=>{
        Swal.fire({
          icon: 'error',
          title:'Usuario eliminado correctamente',
          confirmButtonColor: '#A1260C'
        })
        this.getUsuarios();
        this.modalDelete.dismissAll();
      })
    }
    modificarUsuario(usuario: any,modal:any){
      console.log(usuario);
      this.updateForm = this.formBuilder.group({
      _id:[usuario._id],
      name: [usuario.name,Validators.required],
      email: [usuario.email, [Validators.required, Validators.email, Validators.min(2)]],
      password: ['', [Validators.required,Validators.minLength(6), Validators.min(2)]],
      tipo: [Validators.required, Validators.min(1)]
      });
      this.modal.open(modal,{size:'sm'}).result.then((result)=>{
        this.closeResult = `Closed with: ${result}`;

      }, (reason)=>{
        this.closeResult = `Dimissed ${this.getDissmissReason(reason)}`;
      });
    }
    updateSubmit(){
      if(this.updateForm.invalid){
        return;
      }
      let usuario={
        _id:'',
        name: '',
        email:'',
        password:'',
        tipo: 0
      }
      usuario.name = this.updateForm.value.name;
      usuario.email = this.updateForm.value.email;
      usuario.password = this.updateForm.value.password;
      usuario.tipo = this.updateForm.value.tipo;
      console.log(usuario);
      this.usuariosService.updateUser(this.updateForm.value._id, usuario)
      .subscribe(response=>{
        console.log(this.updateForm.value._id);
        console.log(response);
        Swal.fire({
          icon: 'success',
          text: 'Usuario actualizado correctamente',
          confirmButtonColor: '#30A10C',
        })
        this.getUsuarios();
        this.modalUpdate.dismissAll();
      })
      console.log(this.updateForm.value);
    }//fin del metodo updateSub
    cancelUpdate(){
      this.modalUpdate.dismissAll();
    }
}//Fin del metodo modificarUsuario

