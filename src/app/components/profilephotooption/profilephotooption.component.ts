import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profilephotooption',
  templateUrl: './profilephotooption.component.html',
  styleUrls: ['./profilephotooption.component.scss'],
})
export class ProfilephotooptionComponent implements OnInit {

  constructor(private modalController:ModalController) { 
    
  }

  ngOnInit() {}

  closeModal(){
    this.modalController.dismiss(null,'backdrop');
  }
  startCapture(type){
    this.modalController.dismiss(type,'select');
  }

}
