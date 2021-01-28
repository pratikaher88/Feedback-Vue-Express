<template>

<section id="app" class="section">

    <!-- <b-alert
      :show="dismissCountDown"
      dismissible
      fade
      variant="success"
      @dismiss-count-down="countDownChanged"
    >
      Response successfully submitted !
    </b-alert> -->

    <h1 class="title is-1">
        Feedback Tool
    </h1>

    <div class="columns">
        <div class="column">
            <form @submit.prevent="submitFeedbackForm()" >
              <div class="field" >
                  <label class="label"> 
                    <strong> Comments: </strong> 
                    <span> 
                      ({{ commentCharacterCount }}/{{ max_len }}) 
                      <span v-if="lengthExceeded" class="max_len_tag">
                        - Maximum length reached !
                      </span>
                    </span>
                  </label>

                  <div class="control">
                      <textarea id="textAreaBox" rows="5" cols="80" v-model="feedbackTextArea" :maxlength="max_len" placeholder="We would love to hear your feedback. but please do not share any sensitive personal information."/>
                      <br/>
                      <Speech2Text @speechend="speechEnd" />
                      <!-- <Speech2Text @sentTexts="sentTexts" @speechend="speechEnd" /> -->
                            <!-- {{sentences}} -->
                  </div>

                  <div class="action-buttons-tab pull-right">
                    
                    <b-button id="uploadimagebutton" @click="$bvModal.show('bv-modal-show-uploadimagebutton');"> Upload Image </b-button>
                    
                    <b-modal id="bv-modal-show-uploadimagebutton" size="xl" hide-footer>
                      <template #modal-title>
                        Upload Image
                      </template>
                      <div class="d-block text-center">
                        <input type="file" id="selectedImageId" @change="onImageSelected" accept="image/*" >
                        <strong style="margin-left: 0px;margin-right:20px">OR</strong>
                        <b-button id="screenshotbutton" @click="clickSC(); $bvModal.show('bv-modal-show-screenshot');"> Take screenshot </b-button>
                        
                        <br/>
                        <br/>
                        <div class="preview-tab" v-if="isHidden">
                          <img id="file-upload-image" :src="imageURL" alt="" />
                        </div>
                      </div>
                      <b-button class="mt-3" block variant='outline-danger' @click="removeImage">Remove Preview Image</b-button>
                      <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-show-uploadimagebutton')">Close</b-button>

                    </b-modal>

                    <b-modal id="bv-modal-show-screenshot" size="xl" hide-footer>
                      <template #modal-title>
                        Screenshot
                      </template>
                      <div class="d-block text-center">
                        <cropper
                            :src="screenshot"
                            @change="change"
                            :stencil-props="{
                              aspectRatio: 16/9,
                            }"
                          />
                      </div>
                      <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-show-screenshot')">Close</b-button>
                      <b-button class="mt-3" variant='outline-danger' block @click="cropImage();$bvModal.hide('bv-modal-show-screenshot')">Crop and Save</b-button>

                    </b-modal>

                    <b-button class="reviewbutton" @click="$bvModal.show('bv-modal-review-data')">Review Data</b-button>

                    <b-modal id="bv-modal-review-data" hide-footer>
                      <template #modal-title>
                        Review Data
                      </template>
                      <div class="d-block text-center">
                        <b-list-group v-for="(value, index) in responseData" :key="index">
    
                          <b-list-group-item align="left" > <strong> {{ Object.keys(value)[0] }} </strong> : {{ value[Object.keys(value)[0]] }} <button class="btn btn-danger" v-on:click="deleteItem(index)" style="float: right;">x</button></b-list-group-item>

                        </b-list-group>

                          <b-list-group-item align="left" v-if="this.feedbackTextArea" style="padding:20px"> <strong> Comment </strong> : {{ this.feedbackTextArea }} <button class="btn btn-danger" v-on:click="deleteComment()" style="float: right; ">x</button></b-list-group-item>

                          <b-list-group-item align="left" v-if="this.imageURL"> <strong> Image URL</strong> : <img id="file-upload-image" :src="imageURL" alt="" /> <button class="btn btn-danger" v-on:click="removeImage()" style="float: right;">x</button></b-list-group-item>


                      </div>
                      <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-review-data')">Close</b-button>
                    </b-modal>

                    <button class="submitbutton" @submit.prevent="submitFeedbackForm" >SUBMIT</button>
                </div>
              </div>
            </form>
        </div>
    </div>

    <!-- {{ responseData }} -->

    <!-- <input type="text" @sentTexts="sentTexts($event)"> -->

    <br/>
    <br/>

</section>

</template>

<script>


import AWS from "aws-sdk";
import Speech2Text from "./STT"
import html2canvas from 'html2canvas';
import { Cropper } from 'vue-advanced-cropper';
import { v4 as uuidv4 } from 'uuid';
import 'vue-advanced-cropper/dist/style.css';
import axios from 'axios';


AWS.config.update({
      region: "ap-south-1",
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "ap-south-1:946075dc-1656-44d1-92cd-4c8aa6a2ec08"
      }),});

export default {
  name: 'FeedbackForm',

  components: {
    Speech2Text,
    Cropper
  },

  data() {
    return {
      feedbackTextArea: '',
      text: '',
      sentences: null,
      responseData: [],
      max_len: '500',
      screenshot: null,
      canvasCropped: null,
      imageURL: '',
      dismissCountDown: 0,
      }
  },

  mounted() {
    
    this.responseData.push({SiteName: window.location.href})
    this.responseData.push({Resolution: String(window.screen.width) + 'x' + String(window.screen.height) })
    this.responseData.push({ userAgent: navigator.userAgent})
    this.responseData.push({ 'ACCEPT LANGUAGE': navigator.language})
    if (document.referrer){
      this.responseData.push({ 'REFERRER': document.referrer})
    }

    var i;var pluginsData = "";
    for (i = 0; i < navigator.plugins.length; i++) {
      pluginsData += navigator.plugins[i].name + " - "+ navigator.plugins[i].filename + ". " ;
    }

    this.responseData.push({Plugins: pluginsData})

  },

  computed: {

    commentCharacterCount() {
      return this.feedbackTextArea.length;

    },
    lengthExceeded(){
      return this.feedbackTextArea.length==this.max_len;
    },
    isHidden(){
      return this.imageURL != ''
    }
    

  },

  methods: {

    // sentTexts(text){
    //   console.log(text)
    // },

    removeImage(){
      this.imageURL = ''
    },

    cropImage(){
      // console.log("Cropped Image:",this.canvasCropped)
      this.imageURL = this.canvasCropped.toDataURL('image/jpeg', 1)
      // document.getElementById("file-upload-image").setAttribute('src', this.canvasCropped.toDataURL('image/jpeg', 1));
    },

    change({ canvas }) {
      this.canvasCropped = canvas
      // var imgString = canvas.toDataURL("image/png");
      // document.getElementById('croppedImage').setAttribute('src', imgString);
		},

    clickSC(){
      html2canvas(document.body).then(canvas => {

        this.screenshot = canvas.toDataURL('image/jpeg', 1);
        });
  
    },

    deleteItem(index){
      this.responseData.splice(index,1)
    },

    deleteComment(){
      this.feedbackTextArea = ''
    },

    speechEnd({sentences, text}) {
      console.log('text', text)
      console.log('sentences', sentences)
      this.sentences = sentences
      this.feedbackTextArea = text
    },

    async submitFeedbackForm() {

      this.countDownChanged = 3
      
      console.log("Form submitted")
      
      if (this.imageURL){

        let s3 = new AWS.S3();

        var filePath = uuidv4();
      
        var params = {
            "Body": Buffer.from(this.imageURL.replace(/^data:image\/\w+;base64,/, ""),'base64'),
            "Bucket": "feedbacktoolbucket",
            "Key": filePath,
            "ContentEncoding": 'base64',
            "ACL": "public-read", /* This makes the image public, but only works if your S3 bucket allows public access */
            "ContentType": 'image/jpg' /* This is important to handle jpg vs png etc */
        };

        try {
          const s3Response = await s3.upload(params).promise();
          console.log(s3Response);
          this.responseData.push({ImageLocation: s3Response.Location})
        } catch (error) {
          console.log(error);
        }

      }

      if (this.feedbackTextArea){
        this.responseData.push({Comment: this.feedbackTextArea})
      }

      axios.post('http://localhost:3000/api/feedbackresponse', 
          this.responseData
          )
          .then((response) => {
            console.log(response);
          }, (error) => {
            console.log(error);
          });

      console.log(this.responseData)

      this.feedbackTextArea = ''
      // document.getElementById("selectedImageId").value = null;

    },
    
    async onImageSelected(event) {
        // this.imageURL = URL.createObjectURL(e.target.files[0])
        // const file = e.target.files[0];

        // console.log(event.target.files[0])

        const readUploadedFileAsText = (inputFile) => {
          const temporaryFileReader = new FileReader();
          return new Promise((resolve) => {
            temporaryFileReader.addEventListener("load", function() {
              resolve(temporaryFileReader.result);
            }); 
          temporaryFileReader.readAsDataURL( inputFile );
              });
        };

        const file = event.target.files[0];

        try {
          const fileContents = await readUploadedFileAsText(file)  
          this.imageURL = fileContents
          // console.log("FC",this.imageURL);
        } catch (e) {
          console.warn(e.message)
        }

        // console.log("wdhbfljsfgdn", this.imageURL)

    },

    


  }



}

</script>

<style>

.submitbutton, .reviewbutton {
  background-color: purple;
  border: none;
  color: white;
  padding: 15px 32px;
  margin: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  border-radius: 3px;
  font-size: 12px;
}

.max_len_tag{
  color: red;
}

.preview-tab{
  display: flex;
  justify-content: center;
}


#file-upload-image { 
  border: 5px solid #555;
  margin:20px;
  width: 200px;
  height: 200px;

}

</style>
