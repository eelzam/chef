<template>




  <!--<div class="circular" v-bind:style="{ 'background-image': 'url(' + image + ')' }"></div>-->
  <div dir="rtl" id="dashboard"
       style="background-image: url('https://firebasestorage.googleapis.com/v0/b/chef-3e027.appspot.com/o/SNw7cHWrc00OSIoXDIfe%2F3882900744.jpg?alt=media&token=da3073eb-cd12-4971-a869-1f088d4ebe79');
              background-size: cover;
              " >



    <transition name="fade">
      <CommentModal v-if="showCommentModal" :post="selectedPost" @close="toggleCommentModal()"></CommentModal>
    </transition>



    <section>
      <div class="col2">

        <div v-if="post">
          <div class="post text-center">
            <h2>{{ fullPost.title }}</h2>
          </div>

         <div>
          <video width="100%" autoplay loop muted playsinline v-on:play="videoPlay">
            <source src="https://firebasestorage.googleapis.com/v0/b/chef-3e027.appspot.com/o/dhGYfm6IzoIhxPJ5oos8%2Fboaz2fix.mp4?alt=media&token=f2583160-0b48-4542-a838-c4cb23a85905" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>

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

  </div>
</template>

<script>
import {commentsCollection, postsCollection} from '@/firebase'
import { mapState } from 'vuex'
import moment from 'moment'
import CommentModal from '@/components/CommentModal'



export default {
  components: {
    CommentModal
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
    videoPlay() {
      console.log("video is playing: " + this.$video)
      //this.$video.muted = !this.$video.muted
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


</style>
