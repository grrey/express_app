export default {
	namespaced: false ,
	state: {
		stockPageSize: 10,
		stockPageData: {
			total: 0,
			data: []
		},
	},

	mutations: {
		setStockPageData( state , data = { total: 0, data: [] }) {
			// 变更状态
			state.stockPageData = data
		}
	},
  
}