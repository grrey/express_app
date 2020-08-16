import vue from 'vue'
import vuex from 'vuex'
import esClient from './lib/esClient'
import ElementUI from 'element-ui'; 
import app from './app.vue'
import router from './router'
import './page.styl'

vue.use(ElementUI);
vue.use(esClient);

new vue({
  el: '#app',
  router,
  data: {
    intro: 'welcome1'
  },
  components: {
    app  
  }
})