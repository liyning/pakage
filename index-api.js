import api from '$common/api.js'

export function categoriesWithSub(params, res) {
	api.request({
			method: 'get',
			url: '/yjwzyun/categoriesWithSub',
			params
		})
		.then(res)
};
