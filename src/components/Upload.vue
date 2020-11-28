<template>
  <div>
    <div>
      <p>Upload an image to Firebase:</p>
      <input type="file" @change="previewImage" accept="image/*" >
    </div>
    <div>
      <p>Progress: {{uploadValue.toFixed()+"%"}}
      <progress id="progress" :value="uploadValue" max="100" ></progress>  </p>
    </div>

     <div class="list-of-files">
       <p>List of files in storage</p>
        <div v-for="file in postFiles" :key="file.url" >
          <p>{{file.url}}</p>
          <img class="preview" :src="file.url">
          <button @click="addToGallery(file.url)" >add to gallery</button>
          <br/>
        </div>
      </div>

    <div class="list-of-files">
       <p>List of files in Gallery</p>
        <div v-for="file in postGallery" :key="file.id" >
          <p>{{file.url}}</p>
          <img class="preview" :src="file.url">
          <button @click="removeFromGallery(file.id)" >remove from gallery</button>
          <br/>
        </div>
      </div>


     <div v-if="imageData!=null">
        <img class="preview" :src="picture">
        <br>
      <button @click="onUpload">Upload</button>
    </div>

  </div>


</template>

<script>
import firebase from 'firebase';
import { postsCollection } from '@/firebase'
import * as fb from "@/firebase";

export default {
  name: 'Upload',
  props: ['post'],
  data() {
    return {
      imageData: null,
      picture: null,
      uploadValue: 0,
      postFiles: [],
      postGallery: []
    }
  },
  mounted() {
    this.loadFiles()
    this.loadGallery()
  },

  watch: {
    post: function (newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this.loadFiles()
      this.loadGallery()
    }
  },

  methods: {
    previewImage(event) {
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = event.target.files[0];
    },
    loadFiles() {
      this.postFiles = []
      const storageRef = firebase.storage().ref(this.post.id);
      storageRef.listAll().then(result => {
        result.items.forEach(imageRef => {
          imageRef.getDownloadURL().then(url => this.postFiles.push({url: url}))
        });
      })
    },
    async loadGallery() {
      this.postGallery = []
      var postGallery = await postsCollection.doc(this.post.id).collection("gallery").get()
      postGallery.forEach(doc => {
        var docId = doc.id
        var url = doc.data().url
        this.postGallery.push({ id: docId, url: url })
      })

      console.log("elad: " + this.postGallery)
    },
    async addToGallery(url) {
        await postsCollection.doc(this.post.id).collection("gallery").add({url: url })
        this.loadGallery();
    },
    async removeFromGallery(id) {
        await postsCollection.doc(this.post.id).collection("gallery").doc(id).delete()
        this.loadGallery();
    },
    onUpload() {
      this.picture = null;
      var newMetadata = {
        cacheControl: 'public,max-age=400000',
      }

      const storageRef = firebase.storage().ref(`${this.post.id}/${this.imageData.name}`).put(this.imageData, newMetadata);
      storageRef.on(`state_changed`,
          snapshot => {
            this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          }, error => {
            console.log(error.message)
          },
          () => {
            this.uploadValue = 100;
            storageRef.snapshot.ref.getDownloadURL().then((url) => {
              this.picture = url;
            });
            storageRef.updateMetadata(newMetadata)
          }
      );
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img.preview {
    width: 200px;
}

.list-of-files {
  border: 1px solid silver
}

.list-of-files div {
  border: 1px solid cornflowerblue;
}

</style>
