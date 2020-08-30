import Vue from 'vue'
import Vuex from 'vuex'
import stock from './stock'

Vue.use(Vuex);

const store = new Vuex.Store({
	namespaced: false ,
	state: {
        version: "1.0"
    },
	modules:{
		stock
	}
  })


export default store ;