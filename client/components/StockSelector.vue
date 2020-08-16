<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-input v-model="queryParams.key" placeholder="code/pinyin/nam1e"></el-input>
			</el-col>
		</el-row>
		<el-row>
    		<el-button type="primary" @click="submit">查看</el-button>
		</el-row>
	</div>
</template>

<script>

import  { mapMutations }  from 'vuex';
const  pageSize = 20 ;

export default {
	name:"stock-selector",
	global:true ,

	props:{
		pageNo: { type:Number ,default:1}
	},
	mounted(){

	},

	data(){
		return {
			queryParams:{
				key:'000001', 
			}
		}
	},
	methods:{
		// ...mapMutations([ 'setStockList' ]),

		async submit(){
			let  lu = "";
			let { key ="" } = this.queryParams ;
			if(  key ){
				lu += `( code:${key} or name:${key} or pinyin:${key} )`
			}

			let stockList =  await  this.$esStock.search({
				page: 1 ,
				size:  pageSize ,
				luceneStr: lu
				
			})

		}
	}

}
</script>