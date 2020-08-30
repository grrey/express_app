<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-input v-model="queryParams.key"   placeholder="code/pinyin/nam1e"></el-input>
			</el-col>
		</el-row>
		<el-row>
    		<el-button type="primary" @click="submit">查看</el-button>
		</el-row>
	</div>
</template>

<script>

import  { mapMutations  , mapState , mapGetters }  from 'vuex'; 

export default {
	name:"stock-selector",
	global:true ,

  
	computed:{ 
		stockPageSize(){
			return this.$store.state.stock.stockPageSize
		},

		// ...mapState(  
		// 	[ 'stockPageSize' ]
		// ) ,
	},
 

	data(){

		return { 
			queryParams:{
				key:'上海', 
			}
		}
	},
	methods:{
		...mapMutations([ 'setStockPageData' ]),

		async submit(){
			let  lu = "";
			let { key ="" } = this.queryParams ;
			if(  key ){
				lu += `( code:${key} or name:${key} or pinyin:${key} )`
			}

			let stockList =  await  this.$esStock.search({
				page: 1 ,
				size:   this.stockPageSize ,
				luceneStr: lu
				
			});
			console.log(1111 ,  stockList )
			this.setStockPageData( stockList )

		}
	}

}
</script>