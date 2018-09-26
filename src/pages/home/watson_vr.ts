import { NgZone} from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

export default class WatsonVisualRecognition{
    apikey:string;
    camera:Camera;
    imagePicker: ImagePicker;
    base64: Base64;
    transfer: FileTransfer;
    fileTransfer: FileTransferObject;
   
    constructor(apiKey,private ngZone:NgZone){
        this.apikey=apiKey;
        this.camera=new Camera();
        this.imagePicker=new ImagePicker();
        this.base64=new Base64();
        this.transfer = new FileTransfer();
        this.fileTransfer = this.transfer.create();
    }

    takePicture(imageElement, resultElement, spinnerElement): void{

        imageElement.setAttribute('src','http://www.redbooks.ibm.com/images/fp/cognitiveapps/visualrecognition.svg');
        resultElement.innerHTML = '';
    
          const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            targetWidth: 1000,
            targetHeight: 1000,
            saveToPhotoAlbum: true,
            correctOrientation: true 
          }
    
          const self=this;
    
          this.ngZone.run(()=>{
            this.camera.getPicture(options).then((imageData) => {
             console.log(imageData);
              this.base64.encodeFile(imageData).then((base64File: string) => {
    
                imageElement.setAttribute('src',base64File);
                self.doRecognition(imageData.replace("file://",""), resultElement, spinnerElement);
    
              }, (err) => {
                console.log(err);
              });
            }, (err) => {
              console.log(err);
            });
          });
          
        }
    
      chooseFromGallery(imageElement, resultElement, spinnerElement): void{
    
        imageElement.setAttribute('src','http://www.redbooks.ibm.com/images/fp/cognitiveapps/visualrecognition.svg');
        resultElement.innerHTML = '';
    
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.PICTURE,
          targetWidth: 1000,
          targetHeight: 1000,
        }
        const self = this;
        this.imagePicker.getPictures(options).then((results) => {
          console.log(results[0]);
          this.base64.encodeFile(results[0]).then((base64File: string) => {
    
            imageElement.setAttribute('src',base64File);
            self.doRecognition(results[0].replace("file://",""), resultElement, spinnerElement);
          }, (err) => {
            console.log(err);
          });
        }, (err) => {console.log(err);});
      }
    
      fetchResults(result){
        let classes = result.images[0].classifiers[0].classes;
            let array = [];
            for(let i=0;i<classes.length;i++){
                if(classes[i].score >= 0.6) {
                    let div = '<tr><th>' + classes[i].class + '</th>' + '<th>' + ((classes[i].score)*100).toFixed(1) + '%</th></tr>';
                    array.push(div);
                }
            }
            return array;
      }
    
      doRecognition(imageUri, resultElement, spinnerElement){
        spinnerElement.style.visibility = "visible";
        const self = this;
        let options: FileUploadOptions = {
          fileKey: 'images_file',
          fileName: imageUri.substr(imageUri.lastIndexOf('/')+1)
        }

        this.fileTransfer.upload(imageUri, 'https://apikey:'+this.apikey+'@gateway.watsonplatform.net/visual-recognition/api/v3/classify?version=2018-03-19', options)
          .then((data) => {
            spinnerElement.style.visibility = "hidden";
            console.log(data);
            let array = self.fetchResults(JSON.parse(data.response));
            resultElement.innerHTML = array.toString().replace(/,/g,'');
          }, (err) => {
            console.log(err);
          })
      
      }
}

