<template>
  <header>
    <section>
      <div class="col1">

        <img src="@/assets/4124486265_d15d78c0-251c-4bf2-b547-d69238d79002.png">


        <div class="title">
          <h3>!כל הדברים השווים עד אלייך</h3>
        </div>

      </div>
    </section>
  </header>
</template>

<script>
export default {
  methods: {
/*    logout() {
      this.$store.dispatch('logout')
    }*/
  }
}
</script>


<style lang="scss" scoped>



.col1 {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
}

@media (max-width: 767px) {

  .col1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
    align-items: center;

}


}


</style>
