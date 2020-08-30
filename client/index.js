import vue from 'vue' 
import esClient from './lib/esClient'
import ElementUI from 'element-ui'; 
import './page.styl' 
import app from './app.vue'
import store from './store'
import router from './router'


vue.use(ElementUI);
vue.use(esClient);

  

new vue({
  el: '#app',
  store: store ,
  router,
  components: {
    app  
  }
})