<template>
  <div>

	<el-pagination
		:hide-on-single-page= " true "
		:page-size = " 50 "
		layout="prev, pager, next"
		:total=" stockPageData.total ">
	</el-pagination>

    <el-table :data="stockPageData.data" style="width: 100%">
     
	  <el-table-column type="index" :index="indexMethod"></el-table-column>
	
      <el-table-column label="code" prop="_source.code"></el-table-column>
      <el-table-column label="name" prop="_source.name"></el-table-column>
      <el-table-column label="描述" prop="desc"></el-table-column>

	   <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>

	<el-pagination
		:hide-on-single-page= " true "
		:page-size = " 50 "
		layout="prev, pager, next"
		:total=" stockPageData.total ">
	</el-pagination>
 

  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
const pageSize = 20;
 
export default {
  name: "stock-table",
  global: true,

  props: {
	pageNo: { type: Number, default: 1 },
	fields: { type:Array , default:()=>{ return ['name'] }}
  },

  computed: {
	//   ...mapState([ 'stockPageData'])
	  	stockPageData(){
			return this.$store.state.stock.stockPageData
		},

  },
  mounted() {},

  data() {
    return {
      
    };
  },
  methods: {
    ...mapMutations(["setStockList"]),

	indexMethod(index){
		return index ;
	},
    async submit() {
      let lu = "";
      let { key = "" } = this.queryParams;
      if (key) {
        lu += ` code:${key} or name:${key} or pinyin:${key} `;
      }

      let stockList = await this.$esStock.search({
        page: 1,
        size: pageSize,
        luceneStr: lu
      });
      console.log(1111, stockList);
    }
  }
};
</script>