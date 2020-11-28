<template>

  <div dir="rtl" id="dashboard"  >

    <transition name="fade">
      <CommentModal v-if="showCommentModal" :post="selectedPost" @close="toggleCommentModal()"></CommentModal>
    </transition>

    <div class="fullscreen-bg">
        <video muted autoplay poster="http://sandbox.thewikies.com/vfe-generator/images/big-buck-bunny_poster.jpg" class="fullscreen-bg__video">
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
          <div class="main-title post text-center">
            <h2> {{ fullPost.title }}</h2>
            <div class="logo">
                <img src="https://firebasestorage.googleapis.com/v0/b/chef-3e027.appspot.com/o/dhGYfm6IzoIhxPJ5oos8%2Flogo%20(1).png?alt=media&token=dedbf5f5-ce0b-4d7e-b892-dbdfc8e664d6" />
            </div>
          </div>

          <div class="post">
            <p v-html="fullPost.content"></p>
          </div>

        </div>
        <div v-else>
          <p class="no-results">עמוד לא קיים</p>
        </div>

        <LeadCapture :_post="fullPost"></LeadCapture>
        <PostGallery v-if="Object.keys(fullPost).length !== 0" :_post="fullPost"></PostGallery>
      </div>
    </section>



  </div>
</template>

<script>
import {commentsCollection, postsCollection} from '@/firebase'
import { mapState } from 'vuex'
import moment from 'moment'
import CommentModal from '@/components/CommentModal'
import LeadCapture from "@/components/LeadCapture";
import PostGallery from "@/components/PostGallery";

export default {
  components: {
    CommentModal,
    LeadCapture,
    PostGallery
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

      this.addSourceVideoByScreenSize()

      document.body.addEventListener('mouseup', this.mouseUpAction, false)

      var videoPlayiterations = 1;
      this.$video.addEventListener('ended', function () {
        if (videoPlayiterations < 2) {
          this.play();
          videoPlayiterations++;
        }
      }, false);
    },
    addSourceVideoByScreenSize(){
        var source = document.createElement('source');
        source.type = "video/mp4";

        if (screen.width < 800) {
          //It is a small screen
          source.src = "https://firebasestorage.googleapis.com/v0/b/chef-3e027.appspot.com/o/dhGYfm6IzoIhxPJ5oos8%2FGrillConcept.mp4?alt=media&token=9bf3d3e4-ecc0-46d0-bcbd-7ae9ccf02f2b"
        } else {
          //It is a big screen or desktop
          source.src = "https://firebasestorage.googleapis.com/v0/b/slava-6ea2a.appspot.com/o/boaz2fix.mp4?alt=media&token=2cb5ff11-33af-47f8-8e25-bf0d311e280e"
        }
        this.$video.appendChild(source);

    },
    mouseUpAction() {
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

.logo {
  width: 80px;
  img {
    width: 100%;
  }
}

.main-title {
  background: rgba(256, 256, 256, 0.8) !important;
  display: flex;
  justify-content: center;
  align-items: center;
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
    width: auto;
    height: 50px;
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

  .post h2 {
    font-size: 1.1rem;
  }

  .logo {
    //border: 1px solid red;
    width: 55px;
  }

  .main-title {
    padding: 0.1rem !important;
  }

  .big-spacer {
    div {
      bottom: 30px;
    }
  }

}

</style>
