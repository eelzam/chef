<template>


  <!--<div class="circular" v-bind:style="{ 'background-image': 'url(' + image + ')' }"></div>-->
<!--
  <div dir="rtl" id="dashboard"
       style="background-image: url('https://firebasestorage.googleapis.com/v0/b/chef-3e027.appspot.com/o/SNw7cHWrc00OSIoXDIfe%2F3882900744.jpg?alt=media&token=da3073eb-cd12-4971-a869-1f088d4ebe79');
              background-size: cover;
              " >
-->

  <div dir="rtl" id="dashboard"  >

    <transition name="fade">
      <CommentModal v-if="showCommentModal" :post="selectedPost" @close="toggleCommentModal()"></CommentModal>
    </transition>

    <div class="fullscreen-bg">
        <video loop muted autoplay poster="http://sandbox.thewikies.com/vfe-generator/images/big-buck-bunny_poster.jpg" class="fullscreen-bg__video">
            <source src="@/assets/boaz2fix.mp4" type="video/mp4">
        </video>
    </div>


    <section>
      <div class="col2">

        <div class="big-spacer">
          <div class="animated-arrow">
              <img src="@/assets/down-arrow.png">
            </div>
        </div>

        <div v-if="post">
          <div class="opacity-reduce post text-center">
            <h2> {{ fullPost.title }}</h2>
          </div>



<!--
         <div>
&lt;!&ndash;          <video style="min-width: 700px" width="100%" autoplay loop muted playsinline v-on:play="videoPlay">&ndash;&gt;


           <video id="mainVideo" autoplay loop muted playsinline v-on:play="videoPlay">
            <source src="https://firebasestorage.googleapis.com/v0/b/chef-3e027.appspot.com/o/dhGYfm6IzoIhxPJ5oos8%2Fboaz2fix.mp4?alt=media&token=f2583160-0b48-4542-a838-c4cb23a85905" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
-->

          <div class="post">
            <p v-html="fullPost.content"></p>
<!--            <ul>
              <li><a @click="toggleCommentModal(fullPost)">comments {{ fullPost.comments }}</a></li>
              <li><a @click="likePost(fullPost.id, fullPost.likes)">likes {{ fullPost.likes }}</a></li>
              <li><a @click="viewPost(fullPost)">view full post</a></li>
            </ul>-->
          </div>
          <!--<div v-show="postComments.length" class="comments">
            <div v-for="comment in postComments" :key="comment.id" class="comment">
              <p>{{ comment.userName }}</p>
              <span>{{ comment.createdOn | formatDate }}</span>
              <p>{{ comment.content }}</p>
            </div>
          </div>-->

        </div>
        <div v-else>
          <p class="no-results">עמוד לא קיים</p>
        </div>
      </div>
    </section>

    <LeadCapture :_post="fullPost"></LeadCapture>

  </div>
</template>

<script>
import {commentsCollection, postsCollection} from '@/firebase'
import { mapState } from 'vuex'
import moment from 'moment'
import CommentModal from '@/components/CommentModal'
import LeadCapture from "@/components/LeadCapture";

export default {
  components: {
    CommentModal,
    LeadCapture
  },
  data() {
    return {
      $video: null,
      editorSettings: {
        modules: {
          imageDrop: true,
          imageResize: {}
        }
      },
      post: {
        content: ''
      },
      showCommentModal: false,
      selectedPost: {},
      showPostModal: false,
      fullPost: {},
      postComments: []
    }
  },
  computed: {
      ...mapState(['userProfile', 'posts']),
    },

  async mounted() {
    const fullPost = await postsCollection.where('name', '==', this.$route.params.name).get()

    console.log(this.$route.params.name)

    if (!fullPost.empty) {
      this.fullPost = fullPost.docs[0].data()
      this.fullPost.id = fullPost.docs[0].id

      const docs = await commentsCollection.where('postId', '==', this.fullPost.id).get()

      docs.forEach(doc => {
        let comment = doc.data()
        comment.id = doc.id
        this.postComments.push(comment)
      })
    }

    this.init()

  },
  methods: {
    createPost() {
      this.$store.dispatch('createPost', {content: this.post.content});
      this.post.content = '';
    },
    toggleCommentModal(post) {
      this.showCommentModal = !this.showCommentModal

      // if opening modal set selectedPost, else clear
      if (this.showCommentModal) {
        this.selectedPost = post
      } else {
        this.selectedPost = {}
      }
    },
    likePost(id, likesCount) {
      this.$store.dispatch('likePost', {id, likesCount})
      console.log(this.$route.params.name)
    },
    async viewPost(post) {
      const docs = await commentsCollection.where('postId', '==', post.id).get()

      docs.forEach(doc => {
        let comment = doc.data()
        comment.id = doc.id
        this.postComments.push(comment)
      })

      this.fullPost = post
      this.showPostModal = true
    },
    closePostModal() {
      this.postComments = []
      this.showPostModal = false
    },
    init() {
      this.$video = this.$el.getElementsByTagName('video')[0]
      document.body.addEventListener('mouseup', this.mouseMoveAction, false)
    },
    mouseMoveAction() {
      this.$video.muted = false;
    },
  },
  filters: {
    formatDate(val) {
      if (!val) { return '-' }

      let date = val.toDate()
      return moment(date).fromNow()
    },
    trimLength(val) {
      if (val.length < 200) { return val }
      return `${val.substring(0, 200)}...`
    }
  }
}
</script>


<style lang="scss" scoped>

.opacity-reduce {
  background: rgba(256, 256, 256, 0.8) !important;
}

.fullscreen-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;

}

.fullscreen-bg__video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: auto;
  height: auto;
  min-width: 100%;
  min-height: 100%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: -1;
}

.animated-arrow
{
    animation: arrow-down;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
}

@keyframes arrow-down
{
    0% {
        transform: translateY(0px);
    }

    70%
    {
        opacity: 1;
    }

    100%{
        transform: translateY(10px);
        opacity: 0;
    }
}


.big-spacer {
  height:75vh;


  div {
    position: absolute;
    bottom: 170px;
    left: 48%;
    //transform: translate(-1500%, -100%);
    //display: inline-block !important;
    width: auto;
    height: 50px;
    //border: 1px solid red;
  }
}

  @font-face {
    font-family: Anka_CLM;
    src: url("../assets/Anka_CLM.ttf"); /* TTF file for CSS3 browsers */
    unicode-range: U+0590-05FF;
  }

.post h2 {
  font-family: Anka_CLM;
}

@media (max-width: 767px) {
  //.fullscreen-bg {
  //  background: url('http://dev2.slicejack.com/fullscreen-video-demo/img/videoframe.jpg') center center / cover no-repeat;
  //}
  //
  //.fullscreen-bg__video {
  //  display: none;
  //}

  .post h2 {
    font-size: 1.4rem;
  }

  .post {
    //padding: 1.0rem !important;
  }

  .big-spacer {
    div {
      bottom: 30px;
    }
  }

}

</style>
