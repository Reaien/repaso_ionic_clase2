import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ToastOptions } from '@ionic/angular';
import { ServiceRestService } from 'src/app/services/service-rest.service';

@Component({
  selector: 'app-edit-zoo',
  templateUrl: './edit-zoo.page.html',
  styleUrls: ['./edit-zoo.page.scss'],
})
export class EditZooPage implements OnInit {
  zoologicos: any;

  zoologico: any = {
    id: null,
    nombre: '',
    calificacion: '',
    comuna: '',
    pais: '',
  };

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private api: ServiceRestService,
    private toastController: ToastController
  ) {}

  getIdFromUrl(){
    let url = this.router.url;
    let arr = url.split('/',3);
    let id = parseInt(arr[2])
    return id;
  }

  ngOnInit() {
    this.getZooId(this.getIdFromUrl());
  }

  updateZoo(){
    this.api.updateZoo(this.zoologico.id, this.zoologico).subscribe({
      next: (() =>{
        console.log("Actualizado correctamente: "+this.zoologico);
        this.getZoolist();
        this.presentToast({
          message: 'Datos del zoologico actualizados, redirigiendo al Home',
          duration: 3500,
          position: 'middle',
          icon: 'alert-circle-outline'
        });
        this.router.navigateByUrl('home');
      }),
      error: (error => {
        console.log("Error "+ error)
      })
    })
  }

  //====GET ALL ZOO=====
  getZoolist() {
    this.api.getZooList().subscribe((data) => {
      console.log(data);
      this.zoologicos = data;
    });
  }

  getZooId(id: any) {
    this.api.getZooId(id).subscribe((data) => {
      console.log(data);
      this.zoologico = data;
    });
  }


  
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }
}
