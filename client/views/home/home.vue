<template>
<div class='section'>
	<stock-selector></stock-selector>
  

</div> 

</template>
<style lang="stylus">
  .section-hello
    width: 1160px
    margin: 20px auto 0
    .hello
      padding: 0 0 0 20px
</style>

<script>
import { mapState } from 'vuex'
import StockSelector from '../../components/StockSelector.vue'


  console.log(22222 ,  {...{x:121}} )
 
  export default {
    data () {
      return {
        welcomeText: '欢迎访问'
      }
	},
	computed:{
		...mapState(['stockList']),
	},
	components:{
		StockSelector
	}
  }
</script>
