import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ToastOptions } from '@ionic/angular';
import { ServiceRestService } from 'src/app/services/service-rest.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  data: any;

  zoologicos: any;

  zoologico: any ={
    id: null,
    nombre: "",
    calificacion: "",
    comuna: "",
    pais: ""
  }

  constructor(private activateRoute: ActivatedRoute, private router: Router, private api: ServiceRestService, private toastController: ToastController) { 
    this.activateRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.data = this.router.getCurrentNavigation()?.extras.state?.['user'];
        console.log(this.data);
      }else{
        this.router.navigate(["/inicio"]);
      }
    });
    
  }


  limpiar(){
    this.zoologico.nombre="";
    this.zoologico.calificacion="";
    this.zoologico.ciudad="";
    this.zoologico.pais="";
  }

  ionViewWillEnter() {
    this.getZoolist();
    this.limpiar();
  }

  //====GET ALL ZOO=====
  getZoolist(){
    this.api.getZooList().subscribe((data) =>{
      console.log(data);
      this.zoologicos = data;
    });
  }


  //=====AGREGAR ZOO======
  addZoo(){
    if (this.zoologico.nombre == "" || this.zoologico.calificacion == "" || this.zoologico.comuna == "" || this.zoologico.pais == "") {
      this.presentToast({
        message: ' Error al registrar zoologico, debe llenar los campos ',
        duration: 3000,
        position: 'middle',
        icon: 'alert-circle-outline'
      });
      return;
    }else{
      this.api.addZoo(this.zoologico).subscribe({
        next: (() => {
          console.log("Zoo creado: "+ this.zoologico)
          this.presentToast({
            message: ' Zoologico creado ',
            duration: 3000,
            position: 'middle',
            icon: 'alert-circle-outline'
          });
          this.getZoolist();
          this.limpiar();
        })
      })
    }
  }

  getZooId(id: any){
    this.api.getZooId(id).subscribe((data) => {
      console.log(data);
      this.zoologico = data
    })
  }

  
  deleteZoo(id: any){
    this.api.deleteZoo(id).subscribe({
      next: (() => {
        this.presentToast({
          message: 'Zoologico eliminado',
          duration: 3500,
          position: 'middle',
          icon: 'alert-circle-outline'
        });
        console.log("Zoo eliminado");
        this.getZoolist();
      }),
      error: (error => {
        console.log("Error"+ error)
      })
    })
  }


  cerrarSesion(){
    localStorage.removeItem('ingresado');
    this.router.navigate(["/inicio"]);
  }



  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

}
