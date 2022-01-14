import axios from 'axios'
import Qs from 'qs'
import store from '../store/index'
import publicFile from '../utils/publicFile'
import router from '../router/index'

import {
	Message
} from 'element-ui'

axios.defaults.baseURL = publicFile.address
axios.defaults.timeout = publicFile.overTime
// axios.defaults.withCredentials=true;

// 添加请求拦截器
// http request 拦截器
axios.interceptors.request.use(config => {
		if (store.state.user.token) {
			if(config.url == 'new_admin.php?c=public&a=upload' || config.url == 'new_admin.php?c=public&a=uploadfiles' || config.url == 'new_admin.php?c=finance&a=user_derive_excel') {
				config.headers['Content-Type'] = `multipart/form-data`
			}
			// 判断是否存在token，如果存在的话，则每个http header都加上token
			config.headers['Authorization'] = `Bearer ${encodeURIComponent(store.state.user.token)}`
		}
		return config
	},
	err => {
		
		Message({
			message: err.message,
			type: 'error'
		})
		return Promise.reject(err)
	}
)

// http response 拦截器
axios.interceptors.response.use(response => {
		if(response.data.err_code == 1001 && response.data.err_msg.indexOf("重新登录") != -1){
			Message.closeAll()
			Message({
				message: "登录失效，请重新登录",
				type: 'error'
			})
			// 清除token信息并跳转到登录页面
			quit().then((res) => {
				console.log(res);
				if (res.data.err_code == 0) {
					store.dispatch("user/resetToken");
					router.replace("/login");
				} else {
					
				}
			}).catch((error) => {
				console.log(error);
			});
			
		}
		return response
	},
	err => {
		Message({
			message: err.message,
			type: 'error'
		})
		return Promise.reject(err)
	}
)

// 以下都是接口

//全局模块
// 登录
export const Login = params => {
	return axios.post(`new_admin.php?c=login&a=login`, Qs.stringify(params))
}

// 登出
export const quit = params => {
	return axios.post(`new_admin.php?c=login&a=logout`, Qs.stringify(params))
}

// 获取菜单栏——主
export const get_menu_list = params => {
	return axios.post(`new_admin.php?c=admin&a=get_menu_list`, Qs.stringify(params))
}

// 修改当前账号密码
export const save_pwd_ht = params => {
	return axios.post(`new_admin.php?c=admin&a=save_pwd`, Qs.stringify(params))
}

//上传图片
export const upload_img = params => {
	return axios.post(`new_admin.php?c=public&a=upload`, params)
}

//上传文件
export const uploadfiles = params => {
	return axios.post(`new_admin.php?c=public&a=uploadfiles`, params)
}


//会员管理模块
// 获取会员管理——会员列表
export const admin_list = params => {
	return axios.post(`new_admin.php?c=admin&a=admin_list`, Qs.stringify(params))
}

// 获取会员管理——新增会员
export const admin_add = params => {
	return axios.post(`new_admin.php?c=admin&a=admin_add`, Qs.stringify(params))
}

// 获取会员管理——会员编辑
export const admin_edit = params => {
	return axios.post(`new_admin.php?c=admin&a=admin_edit`, Qs.stringify(params))
}

// 获取会员管理——会员编辑页面展示
export const admin_edit_info = params => {
	return axios.post(`new_admin.php?c=admin&a=admin_edit_info`, Qs.stringify(params))
}

// 获取会员管理——会员启用 停用
export const change_status = params => {
	return axios.post(`new_admin.php?c=admin&a=change_status`, Qs.stringify(params))
}

// 获取会员管理——会员删除  (测试接口)
export const del_admin = params => {
	return axios.post(`new_admin.php?c=admin&a=del_admin`, Qs.stringify(params))
}

// 获取会员管理——删除菜单 (测试接口)
export const del_menu = params => {
	return axios.post(`new_admin.php?c=admin&a=del_menu`, Qs.stringify(params))
}


// 获取会员管理——菜单栏列表
export const menu_list = params => {
	return axios.post(`new_admin.php?c=admin&a=menu_list`, Qs.stringify(params))
}

// 获取会员管理——新增菜单
export const menu_add = params => {
	return axios.post(`new_admin.php?c=admin&a=menu_add`, Qs.stringify(params))
}

// 获取会员管理——菜单页面展示
export const menu_page_info = params => {
	return axios.post(`new_admin.php?c=admin&a=menu_page_info`, Qs.stringify(params))
}

// 获取会员管理——编辑菜单
export const menu_edit = params => {
	return axios.post(`new_admin.php?c=admin&a=menu_edit`, Qs.stringify(params))
}


//用户管理模块
//获取用户列表
export const user_list = params => {
	return axios.post(`new_admin.php?c=user&a=user_list`, Qs.stringify(params))
}

//用户编辑——展示信息
export const detail = params => {
	return axios.post(`new_admin.php?c=user&a=detail`, Qs.stringify(params))
}

//用户编辑——修改密码
export const save_pwd = params => {
	return axios.post(`new_admin.php?c=user&a=save_pwd`, Qs.stringify(params))
}

//用户编辑——启用禁用
export const change_status_user = params => {
	return axios.post(`new_admin.php?c=user&a=c=user&a=change_status`, Qs.stringify(params))
}


//店铺管理模块
//获取店铺列表
export const store_list = params => {
	return axios.post(`new_admin.php?c=store&a=store_list`, Qs.stringify(params))
}

//店铺——启用禁用
export const store_change_status = params => {
	return axios.post(`new_admin.php?c=store&a=change_status`, Qs.stringify(params))
}

//店铺——店铺详情
export const store_detail = params => {
	return axios.post(`new_admin.php?c=store&a=detail`, Qs.stringify(params))
}

//店铺——修改店铺信息
export const save_detail = params => {
	return axios.post(`new_admin.php?c=store&a=save_detail`, Qs.stringify(params))
}

//店铺搜素模块
//店铺搜索——获取主营类目
export const get_cate = params => {
	return axios.post(`new_admin.php?c=public&a=get_cate`, Qs.stringify(params))
}

//店铺搜索——获取省
export const get_province = params => {
	return axios.post(`new_admin.php?c=public&a=get_province`, Qs.stringify(params))
}

//店铺搜索——获取市
export const get_city = params => {
	return axios.post(`new_admin.php?c=public&a=get_city`, Qs.stringify(params))
}

//店铺搜索——获取区
export const get_area = params => {
	return axios.post(`new_admin.php?c=public&a=get_area`, Qs.stringify(params))
}

//店铺审核列表
export const apply_list = params => {
	return axios.post(`new_admin.php?c=store&a=apply_list`, Qs.stringify(params))
}

//店铺审核手动付款
export const pay = params => {
	return axios.post(`new_admin.php?c=store&a=pay`, Qs.stringify(params))
}

//店铺审核信息
export const apply_info = params => {
	return axios.post(`new_admin.php?c=store&a=apply_info`, Qs.stringify(params))
}

//店铺审核拒绝
export const refuse = params => {
	return axios.post(`new_admin.php?c=store&a=refuse`, Qs.stringify(params))
}

//店铺审核同意
export const adopt = params => {
	return axios.post(`new_admin.php?c=store&a=audit_pass`, Qs.stringify(params))
}



//日志管理模块
//日志列表
export const journal_list = params => {
	return axios.post(`new_admin.php?c=journal&a=journal_list`, Qs.stringify(params))
}



//代理管理模块
//代理列表
export const get_list_agent = params => {
	return axios.post(`new_admin.php?c=agent&a=get_list`, Qs.stringify(params))
}

//代理——获取省
export const db_province = params => {
	return axios.post(`new_admin.php?c=public&a=db_province`, Qs.stringify(params))
}

//代理——获取市
export const db_city = params => {
	return axios.post(`new_admin.php?c=public&a=db_city`, Qs.stringify(params))
}

//代理——获取区
export const db_area = params => {
	return axios.post(`new_admin.php?c=public&a=db_area`, Qs.stringify(params))
}

//代理——启用/禁用
export const changetype_agent = params => {
	return axios.post(`new_admin.php?c=agent&a=changetype`, Qs.stringify(params))
}

//地区代理收益列表
export const area_list_agent = params => {
	return axios.post(`new_admin.php?c=agent&a=area_list`, Qs.stringify(params))
}

//代理——修改代理价格
export const change_profit = params => {
	return axios.post(`new_admin.php?c=agent&a=change_profit`, Qs.stringify(params))
}


//推广管理模块
//推广列表
export const get_list_extend = params => {
	return axios.post(`new_admin.php?c=extend&a=get_list`, Qs.stringify(params))
}

//推广列表-启用/禁用
export const changetype_extend = params => {
	return axios.post(`new_admin.php?c=extend&a=changetype`, Qs.stringify(params))
}

//推广列表-修改等级
export const change_level = params => {
	return axios.post(`new_admin.php?c=extend&a=change_level`, Qs.stringify(params))
}


//橘宝管理

//兑换商品列表
export const convert_product_list = params => {
	return axios.post(`new_admin.php?c=convert_product&a=convert_product_list`, Qs.stringify(params))
}

//商品列表
export const jubao_product_list = params => {
	return axios.post(`new_admin.php?c=convert_product&a=product_list`, Qs.stringify(params))
}

//添加商品（可批量）
export const add_convert_product = params => {
	return axios.post(`new_admin.php?c=convert_product&a=add_convert_product`, Qs.stringify(params))
}

//删除商品（可批量）
export const del_convert_product = params => {
	return axios.post(`new_admin.php?c=convert_product&a=del_convert_product`, Qs.stringify(params))
}

//全局明细
export const all_detail_list = params => {
	return axios.post(`new_admin.php?c=jvbao&a=all_detail_list`, Qs.stringify(params))
}

//用户明细
export const get_list_jvbao = params => {
	return axios.post(`new_admin.php?c=jvbao&c=jvbao&a=get_list`, Qs.stringify(params))
}

//用户明细-查看
export const detail_content_jvbao = params => {
	return axios.post(`new_admin.php?c=jvbao&a=detail_content`, Qs.stringify(params))
}

//庄园数据
export const data_list_jvbao = params => {
	return axios.post(`new_admin.php?c=jvbao&a=data_list`, Qs.stringify(params))
}

//庄园数据-启用/禁用
export const change_status_jvbao = params => {
	return axios.post(`new_admin.php?c=jvbao&a=change_status`, Qs.stringify(params))
}

//实名认证列表 
export const authentication_list = params => {
	return axios.post(`new_admin.php?c=authentication&a=authentication_list`, Qs.stringify(params))
}

//禁用实名认证 
export const set_status = params => {
	return axios.post(`new_admin.php?c=authentication&a=set_status`, Qs.stringify(params))
}

//橘宝商城
export const shop_search_jvbao = params => {
	return axios.post(`new_admin.php?c=jvbao&a=shop_search`, Qs.stringify(params))
}

//橘宝商城-商品编辑(获取)
export const shop_edit_content_jvbao = params => {
	return axios.post(`new_admin.php?c=jvbao&a=shop_edit_content`, Qs.stringify(params))
}

//橘宝商城-商品编辑(编辑)
export const product_edit_jvbao = params => {
	return axios.post(`new_admin.php?c=jvbao&a=product_edit`, Qs.stringify(params))
}

//快速设置分润比例
export const set_settle_ratio = params => {
	return axios.post(`new_admin.php?c=goods&a=set_settle_ratio`, Qs.stringify(params))
}


//橘宝商城-商品分类
export const product_cate_jvbao = params => {
	return axios.post(`new_admin.php?c=public&a=product_cate`, Qs.stringify(params))
}

//订单管理
export const jvbao_order_list = params => {
	return axios.post(`new_admin.php?c=jvbao&a=jvbao_order_list`, Qs.stringify(params))
}

//订单管理-获取快递公司
export const get_express_jvbao = params => {
	return axios.post(`new_admin.php?c=public&a=get_express`, Qs.stringify(params))
}

//订单管理-详情
export const jvbao_order_detail_content = params => {
	return axios.post(`new_admin.php?c=jvbao&a=jvbao_order_detail_content`, Qs.stringify(params))
}

//订单管理-详情-物流
export const jvbao_get_express = params => {
	return axios.post(`new_admin.php?c=jvbao&a=get_express`, Qs.stringify(params))
}

//订单列表-获取物流信息
export const get_express = params => {
	return axios.post(`new_admin.php?c=order&a=get_express`, Qs.stringify(params))
}

//订单管理-发货
export const jvbao_save_status = params => {
	return axios.post(`new_admin.php?c=jvbao&a=save_status`, Qs.stringify(params))
}

//兑奖记录
export const price_record_list_jvbao = params => {
	return axios.post(`new_admin.php?c=jvbao&a=price_record_list`, Qs.stringify(params))
}

//橘宝庄园——庄园列表
export const manor_list = params => {
	return axios.post(`new_admin.php?c=jvbao&a=manor_list`, Qs.stringify(params))
}

//橘宝庄园——修改
export const manor_edit_content = params => {
	return axios.post(`new_admin.php?c=jvbao&a=manor_edit_content`, Qs.stringify(params))
}

//橘宝庄园——修改规则配置
export const manor_save_config = params => {
	return axios.post(`new_admin.php?c=jvbao&a=save_config`, Qs.stringify(params))
}

//任务管理——列表
export const task_list = params => {
	return axios.post(`new_admin.php?c=jvbao&a=task_list`, Qs.stringify(params))
}

//任务管理——添加任务
export const add_task_config = params => {
	return axios.post(`new_admin.php?c=jvbao&a=add_task_config`, Qs.stringify(params))
}

//任务管理——添加任务获取视频/视频列表
export const video_list = params => {
	return axios.post(`new_admin.php?c=jvbao&a=video_list`, Qs.stringify(params))
}

//任务管理——启用/禁用
export const save_task_type = params => {
	return axios.post(`new_admin.php?c=jvbao&a=save_task_type`, Qs.stringify(params))
}

//任务管理——修改配置
export const save_task_config = params => {
	return axios.post(`new_admin.php?c=jvbao&a=save_task_config`, Qs.stringify(params))
}

//视频管理——启用/禁用
export const save_video_state = params => {
	return axios.post(`new_admin.php?c=jvbao&a=save_video_state`, Qs.stringify(params))
}

//视频管理——删除视频
export const del_video = params => {
	return axios.post(`new_admin.php?c=jvbao&a=del_video`, Qs.stringify(params))
}

//视频管理——编辑页面信息
export const video_info = params => {
	return axios.post(`new_admin.php?c=jvbao&a=video_info`, Qs.stringify(params))
}

//视频管理——添加视频
export const add_video = params => {
	return axios.post(`new_admin.php?c=jvbao&a=add_video`, Qs.stringify(params))
}

//视频管理——修改视频
export const save_video = params => {
	return axios.post(`new_admin.php?c=jvbao&a=save_video`, Qs.stringify(params))
}

//转盘设置
export const turntable_content = params => {
	return axios.post(`new_admin.php?c=jvbao&a=_turntable_content`, Qs.stringify(params))
}

//转盘设置——修改
export const turntable_config = params => {
	return axios.post(`new_admin.php?c=jvbao&a=turntable_config_`, Qs.stringify(params))
}

//翻牌设置
export const poker_content = params => {
	return axios.post(`new_admin.php?c=jvbao&a=c=jvbao&a=_poker_content`, Qs.stringify(params))
}

//翻牌设置-修改
export const poker_config = params => {
	return axios.post(`new_admin.php?c=jvbao&a=poker_config_`, Qs.stringify(params))
}


//商品管理
//商品三级分类
export const goods_get_cate = params => {
	return axios.post(`new_admin.php?c=goods&a=get_cate`, Qs.stringify(params))
}

//运营三级分类
export const get_yunying_cate = params => {
	return axios.post(`new_admin.php?c=goods&a=get_yunying_cate `, Qs.stringify(params))
}

//平台商品库
export const platform_list = params => {
	return axios.post(`new_admin.php?c=goods&a=platform_list`, Qs.stringify(params))
}

//平台商品库——上架
export const change_status_goods = params => {
	return axios.post(`new_admin.php?c=goods&a=change_status`, Qs.stringify(params))
}

//商品列表
export const goods_list = params => {
	return axios.post(`new_admin.php?c=goods&a=goods_list`, Qs.stringify(params))
}

//商品列表-下架
export const off_shelf = params => {
	return axios.post(`new_admin.php?c=goods&a=off_shelf`, Qs.stringify(params))
}

//商品列表-添加到橘宝商城
export const add_product = params => {
	return axios.post(`new_admin.php?c=goods&a=add_product`, Qs.stringify(params))
}

//商品列表-商品发布
export const goods_add = params => {
	return axios.post(`new_admin.php?c=product&a=goods_add`, Qs.stringify(params))
}

//商品列表-商品发布中需要的参数与sku模板
export const param_list = params => {
	return axios.post(`new_admin.php?c=product&a=param_list`, Qs.stringify(params))
}

//商品发布-添加销售属性名称
export const property_name = params => {
	return axios.post(`new_admin.php?c=product&a=property_name`, Qs.stringify(params))
}

//商品发布-添加销售属性值
export const property_value = params => {
	return axios.post(`new_admin.php?c=product&a=property_value`, Qs.stringify(params))
}

//商品发布-删除销售属性名称
export const property_name_del = params => {
	return axios.post(`new_admin.php?c=product&a=property_name_del`, Qs.stringify(params))
}

//商品发布-删除销售属性值
export const property_value_del = params => {
	return axios.post(`new_admin.php?c=product&a=property_value_del`, Qs.stringify(params))
}

//商品编辑
export const goods_edit = params => {
	return axios.post(`new_admin.php?c=product&a=goods_edit`, Qs.stringify(params))
}

//商品审核列表
export const goods_check_list = params => {
	return axios.post(`new_admin.php?c=goods&a=check_list`, Qs.stringify(params))
}

//商品审核通过/拒绝
export const goods_check = params => {
	return axios.post(`new_admin.php?c=goods&a=goods_check`, Qs.stringify(params))
}

//商品分类
export const goods_cate = params => {
	return axios.post(`new_admin.php?c=goods&a=goods_cate`, Qs.stringify(params))
}

//商品分类-添加商品分类
export const add_goods_cate = params => {
	return axios.post(`new_admin.php?c=goods&a=add_goods_cate`, Qs.stringify(params))
}

//商品分类-编辑商品分类
export const save_goods_cate = params => {
	return axios.post(`new_admin.php?c=goods&a=save_goods_cate`, Qs.stringify(params))
}

//商品分类-商品分类启用禁用
export const cate_status = params => {
	return axios.post(`new_admin.php?c=goods&a=cate_status`, Qs.stringify(params))
}

//商品分类-商品分类后台启用禁用
export const cate_open = params => {
	return axios.post(`new_admin.php?c=goods&a=cate_open`, Qs.stringify(params))
}

//商品分类-删除销售属性（规格）
export const del_tpl = params => {
	return axios.post(`new_admin.php?c=goods&a=del_tpl`, Qs.stringify(params))
}

//修改收货地址记录
export const address_log = params => {
	return axios.post(`new_admin.php?c=order&a=address_log`, Qs.stringify(params))
}

//商品分类-删除销售属组
export const del_param = params => {
	return axios.post(`new_admin.php?c=goods&a=del_param`, Qs.stringify(params))
}


//商品分类-属性列表(编辑)
export const param_list_goods = params => {
	return axios.post(`new_admin.php?c=goods&a=param_list`, Qs.stringify(params))
}

//商品分类-添加属性组
export const add_param_group = params => {
	return axios.post(`new_admin.php?c=goods&a=add_param_group`, Qs.stringify(params))
}

//商品分类-属性组上移
export const group_up = params => {
	return axios.post(`new_admin.php?c=goods&a=group_up`, Qs.stringify(params))
}

//商品分类-属性组下移
export const group_down = params => {
	return axios.post(`new_admin.php?c=goods&a=group_down`, Qs.stringify(params))
}

//商品分类-属性上移
export const param_up = params => {
	return axios.post(`new_admin.php?c=goods&a=param_up`, Qs.stringify(params))
}

//商品分类-属性下移
export const param_down = params => {
	return axios.post(`new_admin.php?c=goods&a=param_down`, Qs.stringify(params))
}

//商品分类-属性组编辑
export const edit_param_group = params => {
	return axios.post(`new_admin.php?c=goods&a=edit_param_group`, Qs.stringify(params))
}

//商品分类-属性操作——编辑
export const edit_param = params => {
	return axios.post(`new_admin.php?c=goods&a=edit_param`, Qs.stringify(params))
}

//商品分类-属性组列表
export const group_list = params => {
	return axios.post(`new_admin.php?c=goods&a=group_list`, Qs.stringify(params))
}

//商品分类-属性启用禁用
export const param_status = params => {
	return axios.post(`new_admin.php?c=goods&a=param_status`, Qs.stringify(params))
}

//商品分类-属性添加
export const add_param = params => {
	return axios.post(`new_admin.php?c=goods&a=add_param`, Qs.stringify(params))
}

//商品分类-销售属性模板
export const sale_tpl = params => {
	return axios.post(`new_admin.php?c=goods&a=sale_tpl`, Qs.stringify(params))
}

//商品分类-编辑销售属性模板
export const save_tpl = params => {
	return axios.post(`new_admin.php?c=goods&a=save_tpl`, Qs.stringify(params))
}

//商品分类-新增销售属性
export const add_sale = params => {
	return axios.post(`new_admin.php?c=goods&a=add_sale`, Qs.stringify(params))
}

//商品分类许可证列表
export const licence_list = params => {
	return axios.post(`new_admin.php?c=licence&a=licence_list`, Qs.stringify(params))
}

//增加商品分类许可证列表
export const licence_add = params => {
	return axios.post(`new_admin.php?c=licence&a=licence_add`, Qs.stringify(params))
}

//修改商品分类许可证列表
export const licence_save = params => {
	return axios.post(`new_admin.php?c=licence&a=licence_save`, Qs.stringify(params))
}

//删除商品分类许可证列表
export const licence_del = params => {
	return axios.post(`new_admin.php?c=licence&a=licence_del`, Qs.stringify(params))
}

//商品列表已选择 许可证
export const cate_licence_info = params => {
	return axios.post(`new_admin.php?c=licence&a=cate_licence_info`, Qs.stringify(params))
}

//商品列表已选择 许可证
export const cate_licence_save = params => {
	return axios.post(`new_admin.php?c=licence&a=cate_licence_save`, Qs.stringify(params))
}



//运营分类
export const yunying_cate = params => {
	return axios.post(`new_admin.php?c=goods&a=yunying_cate`, Qs.stringify(params))
}

//运营分类-添加运营分类
export const add_yunying_cate = params => {
	return axios.post(`new_admin.php?c=goods&a=add_yunying_cate`, Qs.stringify(params))
}

//运营分类-编辑运营分类
export const save_yunying_cate = params => {
	return axios.post(`new_admin.php?c=goods&a=save_yunying_cate`, Qs.stringify(params))
}

//运营分类-运营分类启用禁用
export const group_status = params => {
	return axios.post(`new_admin.php?c=goods&a=group_status`, Qs.stringify(params))
}

//运营分类-运营分类关联品类
export const create_relation = params => {
	return axios.post(`new_admin.php?c=goods&a=create_relation`, Qs.stringify(params))
}

//商品规格改价
export const save_price = params => {
	return axios.post(`new_admin.php?c=goods&a=save_price`, Qs.stringify(params))
}

//获取商品规格
export const goods_info = params => {
	return axios.post(`new_admin.php?c=goods&a=goods_info`, Qs.stringify(params))
} 

//获取商品详情
export const goods_info_product = params => {
	return axios.post(`new_admin.php?c=product&a=goods_info`, Qs.stringify(params))
}
//获取悦淘分类列表
export const effective_category = params => {
	return axios.post(`new_admin.php?c=product&a=effective_category`, Qs.stringify(params))
}
//悦淘商品添加
export const product_sort = params => {
	return axios.post(`new_admin.php?c=market_product&a=product_sort`, Qs.stringify(params))
}

//营销排序
export const category_sort = params => {
	return axios.post(`new_admin.php?c=market_category&a=category_sort`, Qs.stringify(params))
}

//悦淘商品添加
export const effective = params => {
	return axios.post(`new_admin.php?c=product&a=effective`, Qs.stringify(params))
}

//多图片上传
export const uploadImages = params => {
	return axios.post(`new_admin.php?c=public&a=uploadImages`, params)
}

//运费列表
export const tpl_list = params => {
	return axios.post(`new_admin.php?c=postage_template&a=postage_list`, Qs.stringify(params))
}

//运费列表-详情
export const postage_tpl = params => {
	return axios.post(`new_admin.php?c=postage_template&a=postage_info`, Qs.stringify(params))
}

//新增运费模板
export const add_postage_tpl = params => {
	return axios.post(`new_admin.php?c=postage_template&a=postage_add`, Qs.stringify(params))
}

//编辑运费模板
export const save_postage_tpl = params => {
	return axios.post(`new_admin.php?c=postage_template&a=postage_update`, Qs.stringify(params))
}

//删除运费模板
export const postage_del = params => {
	return axios.post(`new_admin.php?c=postage_template&a=postage_del`, Qs.stringify(params))
}


//楼层管理
//轮播图管理列表
export const banner_list = params => {
	return axios.post(`new_admin.php?c=banner&a=banner_list`, Qs.stringify(params))
}

//轮播图tag  位置
export const banner_pos = params => {
	return axios.post(`new_admin.php?c=banner&a=banner_pos`, Qs.stringify(params))
}

//添加轮播图
export const add_banner = params => {
	return axios.post(`new_admin.php?c=banner&a=add_banner`, Qs.stringify(params))
}

//修改轮播图
export const save_banner = params => {
	return axios.post(`new_admin.php?c=banner&a=save_banner`, Qs.stringify(params))
}

//删除轮播图
export const del_banner = params => {
	return axios.post(`new_admin.php?c=banner&a=del_banner`, Qs.stringify(params))
}

//图文列表
export const icon_list = params => {
	return axios.post(`new_admin.php?c=banner&a=icon`, Qs.stringify(params))
}

//获取营销一级分类列表
export const market_category = params => {
	return axios.post(`new_admin.php?c=public&a=market_category`, Qs.stringify(params))
}


//图文编辑
export const save_icon = params => {
	return axios.post(`new_admin.php?c=banner&a=save_icon`, Qs.stringify(params))
}

//图文删除
export const del_icon = params => {
	return axios.post(`new_admin.php?c=banner&a=del_icon`, Qs.stringify(params))
}

//图文排序
export const sort_icon = params => {
	return axios.post(`new_admin.php?c=banner&a=sort_icon`, Qs.stringify(params))
}



//公告列表
export const notice_list = params => {
	return axios.post(`new_admin.php?c=banner&a=notice_list`, Qs.stringify(params))
}

//添加公告
export const notice_add = params => {
	return axios.post(`new_admin.php?c=banner&a=notice_add`, Qs.stringify(params))
}

//编辑公告
export const notice_save = params => {
	return axios.post(`new_admin.php?c=banner&a=notice_save`, Qs.stringify(params))
}

//删除公告
export const notice_del = params => {
	return axios.post(`new_admin.php?c=banner&a=notice_del`, Qs.stringify(params))
}

//获取公告和活动区信息
export const floor_middle_list = params => {
	return axios.post(`new_admin.php?c=banner&a=floor_middle_list`, Qs.stringify(params))
}

//活动区添加
export const floor_middle_add = params => {
	return axios.post(`new_admin.php?c=banner&a=floor_middle_add`, Qs.stringify(params))
}

//活动区编辑
export const floor_middle_save = params => {
	return axios.post(`new_admin.php?c=banner&a=floor_middle_save`, Qs.stringify(params))
}

//活动区删除
export const floor_middle_del = params => {
	return axios.post(`new_admin.php?c=banner&a=floor_middle_del`, Qs.stringify(params))
}

//活动区单个详情
export const floor_info = params => {
	return axios.post(`new_admin.php?c=banner&a=floor_info`, Qs.stringify(params))
}

//公告和活动区排序 包含活动区里面排序
export const floor_sort = params => {
	return axios.post(`new_admin.php?c=banner&a=floor_sort`, Qs.stringify(params))
}

//获取猜你喜欢等列表 背景色 文字颜色
export const guess_color_info = params => {
	return axios.post(`new_admin.php?c=banner&a=guess_color_info`, Qs.stringify(params))
}

//修改猜你喜欢等列表 背景色 文字颜色
export const guess_color = params => {
	return axios.post(`new_admin.php?c=banner&a=guess_color`, Qs.stringify(params))
}

//获取猜你喜欢等列表
export const guess_list = params => {
	return axios.post(`new_admin.php?c=banner&a=guess_list`, Qs.stringify(params))
}

//添加猜你喜欢等列表
export const guess_add = params => {
	return axios.post(`new_admin.php?c=banner&a=guess_add`, Qs.stringify(params))
}

//获取猜你喜欢等列表单个详情
export const guess_info = params => {
	return axios.post(`new_admin.php?c=banner&a=guess_info`, Qs.stringify(params))
}

//编辑猜你喜欢等列表
export const guess_save = params => {
	return axios.post(`new_admin.php?c=banner&a=guess_save`, Qs.stringify(params))
}

//删除猜你喜欢等列表
export const guess_del = params => {
	return axios.post(`new_admin.php?c=banner&a=guess_del`, Qs.stringify(params))
}

//猜你喜欢等列表排序
export const guess_sort = params => {
	return axios.post(`new_admin.php?c=banner&a=guess_sort`, Qs.stringify(params))
}

//客服IM登陆
export const kf_im_login = params => {
	return axios.post(`new_app.php?c=chat&a=kf_im_login`, Qs.stringify(params))
}

//用户绑定客服 
export const bind_kf = params => {
	return axios.post(`new_app.php?c=chat&a=bind_kf`, Qs.stringify(params))
}

//获取客服时长/登陆时间
export const get_duration = params => {
	return axios.post(`new_admin.php?c=chat&a=get_duration`, Qs.stringify(params))
}
//订单管理
//订单虚拟发货
export const invented_deliver = params => {
	return axios.post(`new_admin.php?c=order&a=invented_deliver`, Qs.stringify(params))
}
//修改悦淘首页标志字段
export const symbol = params => {
	return axios.post(`new_admin.php?c=market_category&a=symbol`, Qs.stringify(params))
}
//搜索用户列表
export const kf_user_search = params => {
	return axios.post(`new_admin.php?c=chat&a=kf_user_search`, Qs.stringify(params))
}


//订单列表
export const order_list = params => {
	return axios.post(`new_admin.php?c=order&a=order_list`, Qs.stringify(params))
}

//订单列表-订单详情
export const order_info = params => {
	return axios.post(`new_admin.php?c=order&a=order_info`, Qs.stringify(params))
}

//订单列表-添加备注
export const order_bak = params => {
	return axios.post(`new_admin.php?c=order&a=order_bak`, Qs.stringify(params))
}

//订单列表-取消订单
export const cancel_order = params => {
	return axios.post(`new_admin.php?c=order&a=cancel_order`, Qs.stringify(params))
}


//订单列表-发货 获取未发货列表
export const order_product = params => {
	return axios.post(`new_admin.php?c=order&a=order_product`, Qs.stringify(params))
}

//订单发货详情
export const order_deliver_info = params => {
	return axios.post(`new_admin.php?c=order&a=order_deliver_info`, Qs.stringify(params))
}

//订单列表-物流公司
export const express_list = params => {
	return axios.post(`new_admin.php?c=order&a=express_list`, Qs.stringify(params))
}

//订单列表-发货
export const deliver = params => {
	return axios.post(`new_admin.php?c=order&a=deliver`, Qs.stringify(params))
}

//售后列表
export const refund_list = params => {
	return axios.post(`new_admin.php?c=order&a=refund_list`, Qs.stringify(params))
}
// export const return_list = params => {
// 	return axios.post(`new_admin.php?c=return&a=return_list`, Qs.stringify(params))
// }

//退款详情
export const refund_info = params => {
	return axios.post(`new_admin.php?c=order&a=refund_info`, Qs.stringify(params))
}

//拒绝退款
export const refuse_apply = params => {
	return axios.post(`new_admin.php?c=order&a=refuse_apply`, Qs.stringify(params))
}

//填写买家退货运单号
export const return_express = params => {
	return axios.post(`new_admin.php?c=order&a=return_express`, Qs.stringify(params))
}

//同意退货地址信息
export const refuse_agree = params => {
	return axios.post(`new_admin.php?c=order&a=agree`, Qs.stringify(params))
}

//订单发货修改订单物流
export const order_agree = params => {
	return axios.post(`new_admin.php?c=order&a=set_address`, Qs.stringify(params))
}

//同意退款
export const agree_refund = params => {
	return axios.post(`new_admin.php?c=order&a=agree_refund`, Qs.stringify(params))
}

//获取默认地址
export const default_address = params => {
	return axios.post(`new_admin.php?c=order&a=default_address_v1`, Qs.stringify(params))
}

//获取默认地址
export const address_add = params => {
	return axios.post(`new_admin.php?c=order&a=address_add`, Qs.stringify(params))
}


//平台直播管理模块
//主播审核列表
export const get_list_broad = params => {
	return axios.post(`new_admin.php?c=agent_apply&a=anchor_apply_list`, Qs.stringify(params))
}

//审核详情
export const broad_Info = params => {
	return axios.post(`new_admin.php?c=agent_apply&a=anchor_apply_info`, Qs.stringify(params))
}

//审核主播
export const broad_Audit = params => {
	return axios.post(`new_admin.php?c=agent_apply&a=anchor_apply_audit`, Qs.stringify(params))
}

//主播列表
export const anchor_list = params => {
	return axios.post(`new_admin.php?c=anchor&a=anchor_list`, Qs.stringify(params))
}

//主播操作 启用 禁用 删除主播
export const anchor_board = params => {
	return axios.post(`new_admin.php?c=anchor&a=set_isdel`, Qs.stringify(params))
}

//主播管理员列表
export const anchor_admin_list = params => {
	return axios.post(`new_admin.php?c=anchor&a=anchor_admin_list`, Qs.stringify(params))
}

//删除主播管理员
export const anchor_admin_board = params => {
	return axios.post(`new_admin.php?c=anchor&a=anchor_admin_del`, Qs.stringify(params))
}

//主播打赏记录列表
export const reward_list = params => {
	return axios.post(`new_admin.php?c=video_live&a=reward_list`, Qs.stringify(params))
}

//直播列表

//请求列表
export const anchor_live_list = params => {
	return axios.post(`new_admin.php?c=video_live&a=video_live_list`, Qs.stringify(params))
}

//请求全部录制列表
export const video_live_list = params => {
	return axios.post(`new_admin.php?c=video_live&a=live_playback_all`, Qs.stringify(params))
}

//请求列表商品录制
export const playback_video_list = params => {
	return axios.post(`new_admin.php?c=video_live&a=live_playback_part`, Qs.stringify(params))
}

//设置基础观看人数
export const initial_live_list = params => {
	return axios.post(`new_admin.php?c=video_live&a=set_initial_view`, Qs.stringify(params))
}

//结束直播
export const end_live = params => {
	return axios.post(`new_admin.php?c=video_live&a=end_live`, Qs.stringify(params))
}

//设置基础点赞数
export const like_live_list = params => {
	return axios.post(`new_admin.php?c=video_live&a=set_initial_like`, Qs.stringify(params))
}

//中奖记录
export const win_live_list = params => {
	return axios.post(`new_admin.php?c=video_live&a=win_log`, Qs.stringify(params))
}

//删除直播间
export const delete_video_live = params => {
	return axios.post(`new_admin.php?c=video_live&a=video_live_del`, Qs.stringify(params))
}

//直播打赏配置详情
export const gift_config = params => {
	return axios.post(`new_admin.php?c=gift&a=get_config`, Qs.stringify(params))
}

//提交直播打赏配置
export const post_config = params => {
	return axios.post(`new_admin.php?c=gift&a=gift_save`, Qs.stringify(params))
}


//财务管理
//用户收入概况
export const user_income = params => {
	return axios.post(`new_admin.php?c=finance&a=user_income`, Qs.stringify(params))
}

//用户收入明细
export const profit_list = params => {
	return axios.post(`new_admin.php?c=finance&a=profit_list`, Qs.stringify(params))
}

//用户提现记录
export const user_withdrawal_list = params => {
	return axios.post(`new_admin.php?c=finance&a=user_withdrawal_list`, Qs.stringify(params))
}



//供应商列表
export const finance_store_list = params => {
	return axios.post(`new_admin.php?c=finance&a=store_list`, Qs.stringify(params))
}

//供应商提现审核列表
export const store_withdrawal_list = params => {
	return axios.post(`new_admin.php?c=finance&a=store_withdrawal_list`, Qs.stringify(params))
}

//财务交易记录
export const flowing_water_list = params => {
	return axios.post(`new_admin.php?c=finance&a=flowing_water`, Qs.stringify(params))
}

//开通主播分润
export const anchor_profit_list = params => {
	return axios.post(`new_admin.php?c=finance&a=anchor_profit_list`, Qs.stringify(params))
}

//开通主播分润
export const order_profit_list = params => {
	return axios.post(`new_admin.php?c=finance&a=order_profit_list`, Qs.stringify(params))
}

//订单收支详细
export const order_tran_details = params => {
	return axios.post(`new_admin.php?c=finance&a=order_tran_details`, Qs.stringify(params))
}

//客服工作台
//客服请求用户消息列表
export const ask_get_list = params => {
	return axios.post(`new_admin.php?c=chat&a=get_lst`, Qs.stringify(params))
}
//客服设置
export const kf_config = params => {
	return axios.post(`new_admin.php?c=chat&a=kf_config`, Qs.stringify(params))
}
//编辑客服设置
export const save_kf_config = params => {
	return axios.post(`new_admin.php?c=chat&a=save_kf_config`, Qs.stringify(params))
}



//客服请求用户聊天数据
export const get_chat_record = params => {
	return axios.post(`new_admin.php?c=chat&a=get_chat_record`, Qs.stringify(params))
}

//客服会话结束
export const redis_sql = params => {
	return axios.post(`new_admin.php?c=chat&a=redis_sql`, Qs.stringify(params))
}

//客服发消息
export const add_chat_record = params => {
	return axios.post(`new_admin.php?c=chat&a=add_chat_record`, Qs.stringify(params))
}

//客服设置在线不在线
export const set_online = params => {
	return axios.post(`new_admin.php?c=chat&a=set_online`, Qs.stringify(params))
}
//客服常用语操作

export const add_useful = params => {
	return axios.post(`new_admin.php?c=chat&a=add_useful`, Qs.stringify(params))
}
export const update_useful = params => {
	return axios.post(`new_admin.php?c=chat&a=update_useful`, Qs.stringify(params))
}
export const del_useful = params => {
	return axios.post(`new_admin.php?c=chat&a=del_useful`, Qs.stringify(params))
}
//修改问题类型
export const update_problem_type = params => {
	return axios.post(`new_admin.php?c=kf_robot&a=update_problem_type`, Qs.stringify(params))
}
//修改问答
export const update_questions = params => {
	return axios.post(`new_admin.php?c=kf_robot&a=update_questions`, Qs.stringify(params))
}
//添加问题类型(可批量)
export const add_problem_type = params => {
	return axios.post(`new_admin.php?c=kf_robot&a=add_problem_type`, Qs.stringify(params))
}
//添加问答（可批量）
export const add_questions = params => {
	return axios.post(`new_admin.php?c=kf_robot&a=add_questions`, Qs.stringify(params))
}
//获取全部问题类型
export const get_problem_type = params => {
	return axios.post(`new_admin.php?c=kf_robot&a=get_problem_type`, Qs.stringify(params))
}
//删除问答及问题类型(支持批量删除)
export const del_questions = params => {
	return axios.post(`new_admin.php?c=kf_robot&a=del_questions`, Qs.stringify(params))
}

//问题列表
export const problem_list = params => {
	return axios.post(`new_admin.php?c=kf_robot&a=problem_list`, Qs.stringify(params))
}

//未知问题列表
export const question_record_list = params => {
	return axios.post(`new_admin.php?c=kf_robot&a=question_record_list`, Qs.stringify(params))
}


//客服常用语
//旧版
// export const set_useful = params => {
// 	return axios.post(`new_admin.php?c=chat&a=useful`, Qs.stringify(params))
// }
//改版
export const set_useful = params => {
	return axios.post(`new_admin.php?c=chat&a=useful_list`, Qs.stringify(params))
}

//获取用户信息
export const user_info = params => {
	return axios.post(`new_admin.php?c=chat&a=user_info`, Qs.stringify(params))
}

//获取订单信息
export const order_search = params => {
	return axios.post(`new_admin.php?c=chat&a=order_search`, Qs.stringify(params))
}
//营销分类启用/禁用
export const market_status = params => {
	return axios.post(`new_admin.php?c=market_category&a=market_status`, Qs.stringify(params))
}


//获取查询历史对话
export const chat_search = params => {
	return axios.post(`new_admin.php?c=chat&a=chat_search`, Qs.stringify(params))
}

//获取查询历史对话分页
export const history_record_search = params => {
	return axios.post(`new_admin.php?c=chat&a=history_record`, Qs.stringify(params))
}

//用户提现审核
export const user_withdrawal_examine = params => {
	return axios.post(`new_admin.php?c=finance&a=user_withdrawal_examine`, Qs.stringify(params))
}

//供应商提现审核
export const store_withd = params => {
	return axios.post(`new_admin.php?c=finance&a=store_withdrawal_examine`, Qs.stringify(params))
}

//营销
//营销分类列表
export const categroup_list = params => {
	return axios.post(`new_admin.php?c=market_category&a=categroup_list`, Qs.stringify(params))
}

//营销分类列表
export const category_info = params => {
	return axios.post(`new_admin.php?c=market_category&a=category_info`, Qs.stringify(params))
}


//获取营销分类标签类型名称
export const get_tag_name = params => {
	return axios.post(`new_admin.php?c=market_category&a=get_tag_name`, Qs.stringify(params))
}



//添加营销分类
export const add_category = params => {
	return axios.post(`new_admin.php?c=market_category&a=add_category`, Qs.stringify(params))
}

//修改营销分类
export const edit_category = params => {
	return axios.post(`new_admin.php?c=market_category&a=edit_category`, Qs.stringify(params))
}

//删除营销分类
export const del_category = params => {
	return axios.post(`new_admin.php?c=market_category&a=del_category`, Qs.stringify(params))
}

//商品列表
export const market_product_list = params => {
	return axios.post(`new_admin.php?c=market_product&a=lst`, Qs.stringify(params))
}

//删除商品（可批量删除）
export const del_product = params => {
	return axios.post(`new_admin.php?c=market_product&a=del_product`, Qs.stringify(params))
}

//添加商品(可批量添加)
export const add_market_product = params => {
	return axios.post(`new_admin.php?c=market_product&a=add_market_product`, Qs.stringify(params))
}

//秒杀
//添加商品(可批量添加)
export const market_seckill_list = params => {
	return axios.post(`new_admin.php?c=market_seckill&a=lst`, Qs.stringify(params))
}

//添加商品(可批量添加)
export const stop_seckill = params => {
	return axios.post(`new_admin.php?c=market_seckill&a=stop_seckill`, Qs.stringify(params))
}

//删除
export const del_seckill = params => {
	return axios.post(`new_admin.php?c=market_seckill&a=del_seckill`, Qs.stringify(params))
}

//添加商品
export const add_or_update_seckill = params => {
	return axios.post(`new_admin.php?c=market_seckill&a=add_or_update_seckill`, Qs.stringify(params))
}

//详情
export const seckill_info = params => {
	return axios.post(`new_admin.php?c=market_seckill&a=seckill_info`, Qs.stringify(params))
}

//商品列表
export const market_seckill_product = params => {
	return axios.post(`new_admin.php?c=market_seckill_product&a=lst`, Qs.stringify(params))
}

//修改限购
export const set_astrict = params => {
	return axios.post(`new_admin.php?c=market_seckill_product&a=set_astrict`, Qs.stringify(params))
}

//删除
export const del_product1 = params => {
	return axios.post(`new_admin.php?c=market_seckill_product&a=del_product`, Qs.stringify(params))
}

//修改商品
export const edit_product = params => {
	return axios.post(`new_admin.php?c=market_seckill_product&a=edit_product`, Qs.stringify(params))
}

//添加商品
export const add_product1 = params => {
	return axios.post(`new_admin.php?c=market_seckill_product&a=add_product`, Qs.stringify(params))
}

//选择商品
export const choice_product = params => {
	return axios.post(`new_admin.php?c=market_seckill_product&a=choice_product`, Qs.stringify(params))
}

//商品详情
export const product_info = params => {
	return axios.post(`new_admin.php?c=market_seckill_product&a=product_info`, Qs.stringify(params))
}

//商品列表
export const market_special_product = params => {
	return axios.post(`new_admin.php?c=market_special_product&a=lst`, Qs.stringify(params))
}


//修改限购
export const product_set_astrict = params => {
	return axios.post(`new_admin.php?c=market_special_product&a=set_astrict`, Qs.stringify(params))
}

//删除
export const del_product2 = params => {
	return axios.post(`new_admin.php?c=market_special_product&a=del_product`, Qs.stringify(params))
}

//商品详情
export const product_info1 = params => {
	return axios.post(`new_admin.php?c=market_special_product&a=product_info`, Qs.stringify(params))
}

//设置特价时间
export const set_time = params => {
	return axios.post(`new_admin.php?c=market_special_product&a=set_time`, Qs.stringify(params))
}

//修改商品
export const update_product = params => {
	return axios.post(`new_admin.php?c=market_special_product&a=update_product`, Qs.stringify(params))
}

//添加商品
export const add_product2 = params => {
	return axios.post(`new_admin.php?c=market_special_product&a=add_product`, Qs.stringify(params))
}


//获取平台利润比例(商品)
export const get_profit = params => {
	return axios.post(`new_admin.php?c=goods&a=get_profit`, Qs.stringify(params))
}


//修改订单物流 快递号。快递公司
export const logistics = params => {
	return axios.post(`new_admin.php?c=order&a=logistics_save`, Qs.stringify(params))
}

//退款处理详情接口
export const return_order_info = params => {
	return axios.post(`new_admin.php?c=order&a=dispose_info`, Qs.stringify(params))
}





//余额支付
//余额分组
export const balance_list = params => {
	return axios.post(`new_admin.php?c=balance_group&a=balance_list`, Qs.stringify(params))
}

//快速设置商品余额分类(可批量)
export const set_group = params => {
	return axios.post(`new_admin.php?c=balance_group&a=set_group`, Qs.stringify(params))
}


//余额商品列表
export const product_list = params => {
	return axios.post(`new_admin.php?c=balance_group&a=product_list`, Qs.stringify(params))
}

//余额商品列表
export const del_group = params => {
	return axios.post(`new_admin.php?c=balance_group&a=del_group`, Qs.stringify(params))
}

//添加余额分类商品
export const group_add_product = params => {
	return axios.post(`new_admin.php?c=balance_group&a=add_product`, Qs.stringify(params))
}

//添加余额分类商品
export const add_group = params => {
	return axios.post(`new_admin.php?c=balance_group&a=add_group`, Qs.stringify(params))
}

//添加余额分类商品
export const set_ratio = params => {
	return axios.post(`new_admin.php?c=balance_group&a=set_ratio`, Qs.stringify(params))
}



//商学院
//文章列表
export const banner_lists = params => {
	return axios.post(`new_admin.php?c=article&a=article_list`, Qs.stringify(params))
}
//删除文章
export const banner_del = params => {
	return axios.post(`new_admin.php?c=article&a=article_del`, Qs.stringify(params))
}
//添加文章
export const banner_add = params => {
	return axios.post(`new_admin.php?c=article&a=article`, Qs.stringify(params))
}


//文章分类列表
export const article_category_list = params => {
	return axios.post(`new_admin.php?c=article&a=article_category_list`, Qs.stringify(params))
}
//添加文章
export const cate_add = params => {
	return axios.post(`new_admin.php?c=article&a=article_category`, Qs.stringify(params))
}
//删除文章
export const article_category_del = params => {
	return axios.post(`new_admin.php?c=article&a=article_category_del`, Qs.stringify(params))
}

//真文章一级分类！！！1
export const p_category = params => {
	return axios.post(`new_admin.php?c=article&a=p_category`, Qs.stringify(params))
}

//文章一级分类
export const article_category_relation_list = params => {
	return axios.post(`new_admin.php?c=article&a=article_category_relation_list`, Qs.stringify(params))
}

//文章一级分类
export const article_category_sort = params => {
	return axios.post(`new_admin.php?c=article&a=article_category_sort`, Qs.stringify(params))
}

//文章一级分类
export const relation_sort = params => {
	return axios.post(`new_admin.php?c=article&a=relation_sort`, Qs.stringify(params))
}
//文章一级分类
export const article_category_relation = params => {
	return axios.post(`new_admin.php?c=article&a=article_category_relation`, Qs.stringify(params))
}

//文章一级分类
export const article_banner_list = params => {
	return axios.post(`new_admin.php?c=article&a=article_banner_list`, Qs.stringify(params))
}

//文章一级分类
export const article_banner_sort = params => {
	return axios.post(`new_admin.php?c=article&a=article_banner_sort`, Qs.stringify(params))
}
//文章一级分类
export const article_banner_state = params => {
	return axios.post(`new_admin.php?c=article&a=article_banner_state`, Qs.stringify(params))
}

//文章一级分类
export const article_banner = params => {
	return axios.post(`new_admin.php?c=article&a=article_banner`, Qs.stringify(params))
}
//文章一级分类
export const article_banner_del = params => {
	return axios.post(`new_admin.php?c=article&a=article_banner_del`, Qs.stringify(params))
}


//共富

//身份列表
export const agent_list = params => {
	return axios.post(`new_admin.php?c=selling_agent&a=agent_list`, Qs.stringify(params))
}

//身份详情
export const agent_info = params => {
	return axios.post(`new_admin.php?c=selling_agent&a=agent_info`, Qs.stringify(params))
}

//用户列表
export const selling_user_list = params => {
	return axios.post(`new_admin.php?c=selling_user&a=user_list`, Qs.stringify(params))
}

//用户身份详情列表
export const user_identity_list = params => {
	return axios.post(`new_admin.php?c=selling_user&a=user_identity_list`, Qs.stringify(params))
}

//用户券列表
export const user_ticket_list = params => {
	return axios.post(`new_admin.php?c=selling_user&a=user_ticket_list`, Qs.stringify(params))
}

//用户直推列表
export const user_direct_drive_list = params => {
	return axios.post(`new_admin.php?c=selling_user&a=user_direct_drive_list`, Qs.stringify(params))
}

//用户直推列表
export const conversion_list = params => {
	return axios.post(`new_admin.php?c=selling_conversion&a=conversion_list`, Qs.stringify(params))
}

//用户直推列表
export const conversion_shipments = params => {
	return axios.post(`new_admin.php?c=selling_conversion&a=conversion_shipments`, Qs.stringify(params))
}

//用户收益列表
export const earnings_list = params => {
	return axios.post(`new_admin.php?c=selling_earnings&a=earnings_list`, Qs.stringify(params))
}


//用户收益明细 
export const earnings_detail_list = params => {
	return axios.post(`new_admin.php?c=selling_earnings&a=earnings_detail_list`, Qs.stringify(params))
}

//用户收益明细 
export const withdraw_deposit_list = params => {
	return axios.post(`new_admin.php?c=selling_earnings&a=withdraw_deposit_list`, Qs.stringify(params))
}

//用户收益明细 
export const withdraw_deposit_audit = params => {
	return axios.post(`new_admin.php?c=selling_earnings&a=withdraw_deposit_audit`, Qs.stringify(params))
}

//共富分类 
export const corich_category = params => {
	return axios.post(`new_admin.php?c=product&a=corich_category`, Qs.stringify(params))
}

//添加共富商品 
export const corich_add = params => {
	return axios.post(`new_admin.php?c=product&a=corich`, Qs.stringify(params))
}

//修改身份 
export const agent_update = params => {
	return axios.post(`new_admin.php?c=selling_agent&a=agent_update`, Qs.stringify(params))
}

//修改物流/备注 
export const update_logistics = params => {
	return axios.post(`new_admin.php?c=selling_conversion&a=update_logistics`, Qs.stringify(params))
}


//兑换操作记录表/备注 
export const log_list = params => {
	return axios.post(`new_admin.php?c=selling_conversion&a=log_list`, Qs.stringify(params))
}


//订单修改记录
export const order_bak_list = params => {
	return axios.post(`new_admin.php?c=order&a=order_bak_list`, Qs.stringify(params))
}

//地址列表
export const selling_area = params => {
	return axios.post(`new_admin.php?c=selling_config&a=selling_area`, Qs.stringify(params))
}

//地址修改限制数量
export const area_edit = params => {
	return axios.post(`new_admin.php?c=selling_config&a=area_edit`, Qs.stringify(params))
}


//获取合伙人省份
export const get_province1 = params => {
	return axios.post(`new_admin.php?c=selling_agent&a=get_province`, Qs.stringify(params))
}

//获取合伙人市
export const get_city1 = params => {
	return axios.post(`new_admin.php?c=selling_agent&a=get_city`, Qs.stringify(params))
}

//手动激活资格合伙人
export const activate_partner = params => {
	return axios.post(`new_admin.php?c=selling_user&a=activate_partner`, Qs.stringify(params))
}

//手动加券
export const sys_give = params => {
	return axios.post(`new_admin.php?c=selling_user&a=sys_give`, Qs.stringify(params))
}

//身份管理(收益和开通)
export const identity_manage = params => {
	return axios.post(`new_admin.php?c=selling_user&a=identity_manage`, Qs.stringify(params))
}

//手动新增身份
export const sys_add_agent = params => {
	return axios.post(`new_admin.php?c=selling_agent&a=sys_add_agent`, Qs.stringify(params))
}

//共富订单列表 
export const selling_order_list = params => {
	return axios.post(`new_admin.php?c=selling_order&a=selling_order_list`, Qs.stringify(params))
}

//共富订单分润明细 
export const share_profit_list = params => {
	return axios.post(`new_admin.php?c=selling_order&a=share_profit_list`, Qs.stringify(params))
}










