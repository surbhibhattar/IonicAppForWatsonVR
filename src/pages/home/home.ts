import { Component,NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import WatsonVisualRecognition from './watson_vr';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  watsonVisualRecognition:WatsonVisualRecognition;
  apikey = 'fGVfMT4OwLaRremH5nhnjOKuLVO_WcM5r6rcPFQf9tBU';
  url = 'https://gateway.watsonplatform.net/visual-recognition/api';
  modelId = 'Electricalcables_1306878467';
  constructor(public navCtrl: NavController, private ngZone:NgZone) {
    this.watsonVisualRecognition=new WatsonVisualRecognition(this.apikey,this.url,this.modelId,ngZone);
    
  }

  ngOnInit(){
    document.getElementById('spinner').style.visibility = "hidden";
  }

  takePicture(){
    this.watsonVisualRecognition.takePicture(document.getElementById('image'),document.getElementById('result'), document.getElementById('spinner'))
  }

  chooseFromGallery(){
    this.watsonVisualRecognition.chooseFromGallery(document.getElementById('image'),document.getElementById('result'), document.getElementById('spinner'))
  }
}
