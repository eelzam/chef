<template>


  <div class="masonry-wrapper">
  <div class="masonry">
  <div  v-for="(image, i) in postGallery" :key="i" class="masonry-item">
    <img :src="image.url" alt="Dummy Image" class="masonry-content">
  </div>
<!--  <div class="masonry-item">
    <img src="https://picsum.photos/450/450?image=200" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/280?image=300" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/540?image=400" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/380?image=500" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/300?image=600" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/400?image=700" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/300?image=800" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/280?image=900" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/480?image=925" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/550?image=950" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/600?image=1000" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/325?image=25" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/450?image=50" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/280?image=75" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/540?image=100" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/380?image=125" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/300?image=161" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/400?image=175" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/300?image=200" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/280?image=225" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/480?image=250" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/550?image=275" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/600?image=300" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/325?image=13" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/450?image=26" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/280?image=39" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/540?image=52" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/380?image=65" alt="Dummy Image" class="masonry-content">
  </div>
  <div class="masonry-item">
    <img src="https://picsum.photos/450/300?image=78" alt="Dummy Image" class="masonry-content">
  </div>-->
</div>

</div>


<!--  <div class="main-gallery masonry">

    <img class="image" v-for="(image, i) in images" :src="image" :key="i" @click="index = i">
    <vue-gallery-slideshow :images="images" :index="index" @close="index = null"></vue-gallery-slideshow>

  </div>-->
</template>


<script>

import firebase from 'firebase';
import { postsCollection } from '@/firebase'
import VueGallerySlideshow from 'vue-gallery-slideshow';

export default {
  components: {
    //VueGallerySlideshow,
  },
  props: ['_post'],
  data() {
    return {
      postGallery: [],
    }
  },
  mounted() {
    this.loadGallery()
  },
  methods: {

    async loadGallery() {
      console.log("load g elad: " + this._post.id  )
      var postGallery = await postsCollection.doc(this._post.id).collection("gallery").get()

      postGallery.forEach(doc => {
        var docId = doc.id
        var url = doc.data().url
        this.postGallery.push({ id: docId, url: url })
      })

    },

  }

}
</script>

<style lang="scss" scoped>
/*

.main-gallery {
  box-sizing: border-box;
}

.main-gallery *,
.main-gallery *:before,
.main-gallery *:after {
  box-sizing: inherit;
}

!* The Masonry Container *!
.masonry {
  transition: all .5s ease-in-out;
  column-gap: 30px;
  column-fill: initial;
}


.image {

  margin-bottom: 30px;
  display: inline-block; !* Fix the misalignment of items *!
  vertical-align: top; !* Keep the item on the very top *!

  //background-size: cover;
  cursor: pointer;
  //margin: 5px;
  border-radius: 3px;
  border: 1px solid lightgray;
  //object-fit: contain;
}

*/



.masonry-wrapper {
  margin-top: 20px;
  padding: 1.5em;
  max-width: 100%;
  margin-right: auto;
  margin-left: auto;
}
.masonry {
  columns: 1;
  column-gap: 10px;
}
.masonry-item {
  display: inline-block;
  vertical-align: top;
  margin-bottom: 10px;
  max-width: 455px;
}

@media only screen and (max-width: 759px)  {
  .masonry-wrapper {
    padding: 0em;
  }
  .masonry-item {
    display: block;
  }
}
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .masonry {
    columns: 2;
  }
}
@media only screen and (min-width: 1024px) {
  .masonry {
    columns: 3;
  }
}
.masonry-item, .masonry-content {
  border-radius: 4px;
  overflow: hidden;
}
.masonry-item {
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, .3));
  transition: filter .25s ease-in-out;
}
.masonry-item:hover {
  filter: drop-shadow(0px 5px 5px rgba(0, 0, 0, .3));
}

</style>
