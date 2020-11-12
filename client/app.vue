<template lang="jade">
  div
    nav-bar
    router-view
</template>
<style lang="stylus">
.section {
  width: 1160px;
  margin: 20px auto;
}
</style>
<script>
import { NavBar } from "./components";
export default {
  data() {
    return {};
  },
  components: {
    NavBar
  },
  methods: {},
  mounted() {}
};
</script>

