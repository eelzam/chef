<template>
  <div dir="rtl" id="dashboard">
    <transition name="fade">
      <CommentModal v-if="showCommentModal" :post="selectedPost" @close="toggleCommentModal()"></CommentModal>
    </transition>
    <transition name="fade">
      <DeleteModal v-if="showDeleteModal" :post="selectedPost" @close="toggleDeleteModal()"></DeleteModal>
    </transition>
    <section>
      <div class="col2">


         <div class="profile">
          <h5>{{ userProfile.name }}</h5>
          <p>{{ userProfile.title }}</p>
          <div class="create-post">





            <p>create a post</p>
            <form @submit.prevent>
              <!--<textarea v-model.trim="post.content"></textarea>-->
              <input v-model.trim="post.title" placeholder="title"/>
              <input v-model.trim="post.name" placeholder="url"/>
              <input v-model.trim="post.urlCategory" placeholder="url category"/>
              <vue-editor v-model.trim="post.content"></vue-editor>
              <Upload v-if="fullEditPost" :post="fullEditPost" dir="ltr"></Upload>
              <button @click="createPost()" :disabled="post.content === ''" class="button">post</button>
            </form>
          </div>
        </div>
        <div v-if="posts.length">
          <div v-for="post in posts" :key="post.id" class="post">

            <h5><router-link :to="'/' + post.urlCategory + '/' + post.name">{{ post.title }}</router-link></h5>

            <span>{{ post.createdOn | formatDate }}</span>
            <p v-html="post.content"></p>
            <ul>
              <li><a @click="toggleCommentModal(post)">comments {{ post.comments }}</a></li>
              <li><a @click="likePost(post.id, post.likes)">likes {{ post.likes }}</a></li>
              <li><a @click="viewPost(post)">view full post</a></li>
              <li><a @click="editPost(post)">edit post</a></li>
              <li><a @click="toggleDeleteModal(post)">delete</a></li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>

    <!-- full post modal -->
    <transition name="fade">
      <div v-if="showPostModal" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal()" class="close">close</a>
          <div class="post">
            <h5>{{ fullPost.userName }}</h5>
            <span>{{ fullPost.createdOn | formatDate }}</span>
            <p v-html="fullPost.content"></p>
            <ul>
              <li><a>comments {{ fullPost.comments }}</a></li>
              <li><a>likes {{ fullPost.likes }}</a></li>
            </ul>
          </div>
          <div v-show="postComments.length" class="comments">
            <div v-for="comment in postComments" :key="comment.id" class="comment">
              <p>{{ comment.userName }}</p>
              <span>{{ comment.createdOn | formatDate }}</span>
              <p>{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { commentsCollection } from '@/firebase'
import { mapState } from 'vuex'
import moment from 'moment'
import CommentModal from '@/components/CommentModal'
import DeleteModal from '@/components/DeleteModal'
import Upload from '@/components/Upload'
import { VueEditor, Quill } from "vue2-editor";
import { htmlEditButton } from "quill-html-edit-button";
//import { htmlEditButton } from "quill-html-edit-button/src/quill.htmlEditButton.js"

Quill.register("modules/htmlEditButton", htmlEditButton);


export default {
  components: {
    CommentModal, VueEditor, DeleteModal, Upload
  },
  data() {
    return {
      editorSettings: {
        modules: {
          imageDrop: true,
          imageResize: {},
          htmlEditButton: {}
        }
      },
      post: {
        content: '',
        title: '',
        name: '',
        urlCategory: ''
      },
      showCommentModal: false,
      showDeleteModal: false,
      selectedPost: {},
      showPostModal: false,
      fullPost: {},
      fullEditPost: null,
      postComments: []
    }
  },
  computed: {
    ...mapState(['userProfile', 'posts'])
  },
  methods: {
    createPost() {
      if (this.fullEditPost) {
        this.fullEditPost.content = this.post.content
        this.fullEditPost.title = this.post.title
        this.fullEditPost.name = this.post.name
        this.fullEditPost.urlCategory = this.post.urlCategory
        this.$store.dispatch('updatePost', this.fullEditPost)
      }
      else
        this.$store.dispatch('createPost', { content: this.post.content, title: this.post.title, name: this.post.name, urlCategory: this.post.urlCategory });

      this.post.content = '';
      this.post.title = '';
      this.post.name = '';
      this.post.urlCategory = '';

      this.fullEditPost = null;
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
    toggleDeleteModal(post) {
      this.showDeleteModal = !this.showDeleteModal

      // if opening modal set selectedPost, else clear
      if (this.showDeleteModal) {
        this.selectedPost = post
      } else {
        this.selectedPost = {}
      }
    },
    likePost(id, likesCount) {
      this.$store.dispatch('likePost', { id, likesCount })
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
    async editPost(post) {
      this.post.content = post.content
      this.post.title = post.title
      this.post.name = post.name
      this.post.urlCategory = post.urlCategory
      this.fullEditPost = post
    },
    closePostModal() {
      this.postComments = []
      this.showPostModal = false
    }
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
