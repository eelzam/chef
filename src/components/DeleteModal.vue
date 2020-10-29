<template>
  <div dir="ltr" class="c-modal">
    <div class="c-container">
      <a @click="$emit('close')">close</a>
      <p>Delete Post</p>
      <form @submit.prevent>
        <p>Are you sure?</p>
        <button @click="deletePost()" class="button">Delete</button>
      </form>
    </div>
  </div>
</template>

<script>
import { postsCollection, deletedCollection } from '@/firebase'

export default {
  props: ['post'],
  methods: {

    async deletePost() {

      await deletedCollection.add(this.post)
      await postsCollection.doc(this.post.id).delete()
      // close modal
      this.$emit('close')
    }
  }
}
</script>
