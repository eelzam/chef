<template>
  <header>
    <section>
      <div class="col1">
        <router-link to="/">
          <h3>Corona-Time - כל הדברים השווים עד אלייך</h3>
        </router-link>
        <ul class="inline">
          <li>
            <router-link to="/">Main Site</router-link>
          </li>
          <li>
            <router-link to="/admin">Admin Dashboard</router-link>
          </li>
          <li>
            <router-link to="/admin/settings">Settings</router-link>
          </li>
          <li><a @click="logout()">logout</a></li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
