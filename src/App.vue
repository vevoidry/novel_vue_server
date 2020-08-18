<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    refreshComponent: function () {
      if (this.$store.state.tokenData == null) {
        this.$router.push('/login')
      } else {
        this.$router.push('/home')
      }
    }
  },
  mounted () {
    this.refreshComponent()
  }
}
</script>
