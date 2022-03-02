import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layout' //布局页



Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

// 通用页面, 这里的配置不需要权限
export const constRouter = [
  {
    path: '/login',
    component: () => import('@/views/Login'),
    hidden: true //导航菜单忽略选项
  },
  {
    path: '',
    component: Layout, //
    redirect: '/index',
    hidden: true,
  },
  {
    path: '/index',
    component: Layout, //应用布局页
    name: 'index',
    meta: {
      title: "首页", //导航菜单项标题
      icon: 'el-icon-s-home' //导航菜单图标
    },
    children: [
      {
        path: '',
        component: () => import('@/views/index.vue'),
        name: 'indexs',
        meta: {
          title: "首页",
          icon: 'el-icon-s-home',
          roles: ['admin', 'jerry']
        }
      }
    ]
  }
]

// 动态路由 communication
export const asyncRoutes = [
  {
    path: '/analyze',
    component: Layout,
    redirect: '/goods/index',
    meta: {
      title: "数据统计",
      icon: 'el-icon-s-marketing',
      hidden: false
    },
    children: [
      {
        path: 'analyzeindex',
        component: () => import('@/views/analyze/Index.vue'),
        name: 'analyzeindex',
        meta: {
          title: "主控数据",
          icon: 'el-icon-s-marketing',
          hidden: false,
          roles: ['admin', 'jerry']
        }
      },
      {
        path: 'analyzemonitor',
        component: () => import('@/views/analyze/Monitor.vue'),
        name: 'analyzemonitor',
        meta: {
          title: "监控数据",
          icon: 'el-icon-s-marketing',
          hidden: false,
          roles: ['admin', 'jerry']
        }
      },
    ]
  },

  {
    path: '/college',
    component: Layout,
    redirect: '/college/bannerList',
    meta: {
      title: "商学院",
      icon: 'el-icon-s-home',
      hidden: false,
      id: '86'
    },
    children: [
      {
        path: 'bannerList',
        component: () => import('@/views/college/bannerList.vue'),
        name: 'bannerList',
        meta: {
          title: "轮播图管理",
          icon: 'el-icon-s-home',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '87'
        }
      },{
        path: 'assort',
        component: () => import('@/views/college/assort.vue'),
        name: 'assort',
        meta: {
          title: "分类管理",
          icon: 'el-icon-s-home',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'88'
        }
      },{
        path: 'pen',
        component: () => import('@/views/college/pen.vue'),
        name: 'pen',
        meta: {
          title: "文章库",
          icon: 'el-icon-s-home',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'89'
        }
      }
    ]
  },

  {
    path: '/rich',
    component: Layout,
    redirect: '/rich/identity',
    meta: {
      title: "健康共富",
      icon: 'el-icon-ship',
      hidden: false,
      id: '90'
    },
    children: [
      {
        path: 'identity',
        component: () => import('@/views/rich/identity.vue'),
        name: 'identity',
        meta: {
          title: "身份记录",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '91'
        }
      },
      {
        path: 'gain',
        component: () => import('@/views/rich/gain.vue'),
        name: 'gain',
        meta: {
          title: "收益管理",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '92'
        }
      },
      {
        path: 'userRun',
        component: () => import('@/views/rich/userRun.vue'),
        name: 'userRun',
        meta: {
          title: "用户管理",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '93'
        }
      },
      {
        path: 'convert',
        component: () => import('@/views/rich/convert.vue'),
        name: 'convert',
        meta: {
          title: "兑换管理",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '94'
        }
      },
      {
        path: 'addressList',
        component: () => import('@/views/rich/addressList.vue'),
        name: 'addressList',
        meta: {
          title: "区域数量",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '96'
        }
      },
      {
        path: 'goodsList',
        component: () => import('@/views/rich/goodsList.vue'),
        name: 'goodsList',
        meta: {
          title: "共富订单分润明细",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '97'
        }
      },
      
      //
      {
        path: 'notIce',
        component: () => import('@/views/rich/notIce.vue'),
        name: 'notIce',
        meta: {
          title: "共富通知记录",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '98'
        }
      },
      
    ]
  },

  {
    path: '/dividend',
    component: Layout,
    redirect: '/dividend/index',
    meta: {
      title: "全民分红",
      icon: 'el-icon-ship',
      hidden: false,
      id: '99'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dividend/index.vue'),
        name: 'index',
        meta: {
          title: "分红额度",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '100'
        }
      },
      {
        path: 'record',
        component: () => import('@/views/dividend/record.vue'),
        name: 'record',
        meta: {
          title: "分红记录",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '101'
        }
      }
    ]
  },

  {
    path: '/offline',
    component: Layout,
    redirect: '/offline/audit',
    meta: {
      title: "线下服务中心",
      icon: 'el-icon-ship',
      hidden: false,
      id: '102'
    },
    children: [
      {
        path: 'audit',
        component: () => import('@/views/offline/audit.vue'),
        name: 'audit',
        meta: {
          title: "审核管理",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '103'
        }
      },
      {
        path: 'income',
        component: () => import('@/views/offline/income.vue'),
        name: 'income',
        meta: {
          title: "收益管理",
          icon: 'el-icon-ship',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '104'
        }
      }
    ]
  },

  {
    path: '/consumer',
    component: Layout,
    redirect: '/consumer/Consumerlist',
    meta: {
      title: "用户管理",
      icon: 'el-icon-user',
      hidden: false,
      id: '6'
    },
    children: [
      {
        path: 'Consumerlist',
        component: () => import('@/views/consumer/Consumerlist.vue'),
        name: 'Consumerlist',
        meta: {
          title: "用户列表",
          icon: 'el-icon-user',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '7'
        }
      },{
        path: 'userAttest',
        component: () => import('@/views/consumer/userAttest.vue'),
        name: 'userAttest',
        meta: {
          title: "实名认证列表",
          icon: 'el-icon-user',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'76'
        }
      }
    ]
  },

  
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/Shoplist',
    meta: {
      title: "店铺管理",
      icon: 'el-icon-s-shop',
      hidden: false,
      id:'12'
    },
    children: [
      {
        path: 'Shoplist',
        component: () => import('@/views/shop/Shoplist.vue'),
        name: 'Shoplist',
        meta: {
          title: "店铺列表",
          icon: 'el-icon-s-shop',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'13'
        }
      },
      {
        path: 'Shopaudit',
        component: () => import('@/views/shop/Shopaudit.vue'),
        name: 'Shopaudit',
        meta: {
          title: "店铺审核",
          icon: 'el-icon-s-shop',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'14'
        }
      },
    ]
  },

  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/commodityClassification',
    meta: {
      title: "商品管理",
      icon: 'el-icon-s-goods',
      hidden: false,
      id:'34'
    },
    children: [
      {
        path: 'add',
        component: () => import('@/views/goods/add.vue'),
        name: 'add',
        meta: {
          title: "商品发布",
          icon: 'el-icon-s-goods',
          hidden: true,
          roles: ['admin', 'jerry'],
          id:'47',
          // keepAlive:true
        },
      },
      {
        path: 'update',
        component: () => import('@/views/goods/update.vue'),
        name: 'update',
        meta: {
          title: "商品编辑",
          icon: 'el-icon-s-goods',
          hidden: true,
          roles: ['admin', 'jerry'],
          id:'48',
        },
      },
      {
        path: 'goodsInfo',
        component: () => import('@/views/goods/goodsInfo.vue'),
        name: 'goodsInfo',
        meta: {
          title: "商品详情",
          icon: 'el-icon-s-goods',
          hidden: true,
          roles: ['admin', 'jerry'],
          id:'49'
        },
      },
      {
        path: 'audit',
        component: () => import('@/views/goods/audit.vue'),
        name: 'audit',
        meta: {
          title: "审核列表",
          icon: 'el-icon-s-goods',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'44'
        },
      },
      {
        path: 'onSale',
        component: () => import('@/views/goods/onSale.vue'),
        name: 'onSale',
        meta: {
          title: "商品列表",
          icon: 'el-icon-s-goods',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'43'
        }
      },
      {
        path: 'commodityBank',
        component: () => import('@/views/goods/commodityBank.vue'),
        name: 'commodityBank',
        meta: {
          title: "平台商品库",
          icon: 'el-icon-s-goods',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'45'
        },
      },
      {
        path: 'commodityClassification',
        component: () => import('@/views/goods/commodityClassification.vue'),
        name: 'commodityClassification',
        meta: {
          title: "商品分类",
          icon: 'el-icon-s-goods',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'40'
        }
      },
      {
        path: 'operationClassification',
        component: () => import('@/views/goods/operationClassification.vue'),
        name: 'operationClassification',
        meta: {
          title: "运营分类",
          icon: 'el-icon-s-goods',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'41'
        }
      },
      // {
      //   path: 'freightTemplate',
      //   component: () => import('@/views/goods/freightTemplate.vue'),
      //   name: 'freightTemplate',
      //   meta: {
      //     title: "运费模板",
      //     icon: 'el-icon-s-goods',
      //     hidden: false,
      //     roles: ['admin', 'jerry'],
      //     id:'46'
      //   },
      // },
      {
        path: 'excise',
        component: () => import('@/views/goods/excise.vue'),
        name: 'excise',
        meta: {
          title: "分类许可证",
          icon: 'el-icon-s-goods',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'77'
        },
      }
    ]
  },

  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing/assort',
    meta: {
      title: "营销",
      icon: 'el-icon-s-cooperation',
      hidden: false,
      id:'73'
    },
    children: [
      {
        path: 'assort',
        component: () => import('@/views/marketing/assort.vue'),
        name: 'assort',
        meta: {
          title: "营销分类",
          icon: 'el-icon-s-cooperation',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'74'
        }
      },
      {
        path: 'spike',
        component: () => import('@/views/marketing/spike.vue'),
        name: 'spike',
        meta: {
          title: "限时秒杀",
          icon: 'el-icon-s-cooperation',
          hidden: true,
          roles: ['admin', 'jerry'],
          // id:'75'
        }
      }
    ]
  },
  {
    path: '/order_',
    component: Layout,
    redirect: '/order_/orderList_p',
    meta: {
      title: "订单管理",
      icon: 'el-icon-s-claim',
      hidden: false,
      id:'53'
    },
    children: [
      {
        path: 'orderList_p',
        component: () => import('@/views/order_/orderList_p.vue'),
        name: 'orderList_p',
        meta: {
          title: "订单列表",
          icon: 'el-icon-s-claim',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'54'
        }
      },
      {
        path: 'orderInfo',
        component: () => import('@/views/order_/orderInfo.vue'),
        name: 'orderInfo',
        meta: {
          title: "订单详情",
          icon: 'el-icon-s-claim',
          hidden: true,
          roles: ['admin', 'jerry'],
          id:'82'
        }
      },
      {
        path: 'refund',
        component: () => import('@/views/order_/refund.vue'),
        name: 'refund',
        meta: {
          title: "售后列表",
          icon: 'el-icon-s-claim',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'55'
        }
      },
      {
        path: 'refundInfo',
        component: () => import('@/views/order_/refundInfo.vue'),
        name: 'refundInfo',
        meta: {
          title: "售后详情",
          icon: 'el-icon-s-claim',
          hidden: true,
          roles: ['admin', 'jerry'],
          id:'83'
        }
      }
    ]
  },

  {
    path: '/over',
    component: Layout,
    redirect: '/over/product_list',
    meta: {
      title: "余额支付",
      icon: 'el-icon-s-finance',
      hidden: false,
      id:'78'
    },
    children: [
      {
        path: 'product_list',
        component: () => import('@/views/over/product_list.vue'),
        name: 'product_list',
        meta: {
          title: "余额商品列表",
          icon: 'el-icon-s-finance',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'79'
        }
      },
      {
        path: 'group_settings',
        component: () => import('@/views/over/group_settings.vue'),
        name: 'group_settings',
        meta: {
          title: "分组设置",
          icon: 'el-icon-s-finance',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'80'
        }
      }
    ]
  },

  {
    path: '/jubao',
    component: Layout,
    redirect: '/jubao/globalDetails',
    meta: {
      title: "橘宝管理",
      icon: 'el-icon-s-help',
      hidden: false,
      id:'22'
    },
    children: [
      {
        path: 'juBaoUser',
        component: () => import('@/views/jubao/juBaoUser.vue'),
        name: 'juBaoUser',
        meta: {
          title: "用户橘宝明细",
          icon: 'el-icon-s-help',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'99'
        }
      },
      {
        path: 'juBaoGoods',
        component: () => import('@/views/jubao/juBaoGoods.vue'),
        name: 'juBaoGoods',
        meta: {
          title: "橘宝商品",
          icon: 'el-icon-s-help',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'95'
        }
      },
      // {
      //   path: 'globalDetails',
      //   component: () => import('@/views/jubao/globalDetails.vue'),
      //   name: 'globalDetails',
      //   meta: {
      //     title: "全局明细",
      //     icon: 'el-icon-s-help',
      //     hidden: false,
      //     roles: ['admin', 'jerry'],
      //     id:'24'
      //   }
      // },
      
      // {
      //   path: 'userDetails',
      //   component: () => import('@/views/jubao/userDetails.vue'),
      //   name: 'userDetails',
      //   meta: {
      //     title: "用户明细",
      //     icon: 'el-icon-s-help',
      //     hidden: false,
      //     roles: ['admin', 'jerry'],
      //     id:'23'
      //   }
      // },
      {
        path: 'manorData',
        component: () => import('@/views/jubao/manorData.vue'),
        name: 'manorData',
        meta: {
          title: "庄园数据",
          icon: 'el-icon-s-help',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'25'
        }
      },
      // {
      //   path: 'jubaoMall',
      //   component: () => import('@/views/jubao/jubaoMall.vue'),
      //   name: 'jubaoMall',
      //   meta: {
      //     title: "橘宝商城",
      //     icon: 'el-icon-s-help',
      //     hidden: false,
      //     roles: ['admin', 'jerry'],
      //     id:'26'
      //   }
      // },
      // {
      //   path: 'orderList',
      //   component: () => import('@/views/jubao/orderList.vue'),
      //   name: 'orderList',
      //   meta: {
      //     title: "订单管理",
      //     icon: 'el-icon-s-help',
      //     hidden: false,
      //     roles: ['admin', 'jerry'],
      //     id:'27'
      //   }
      // },
      // {
      //   path: 'exchangeList',
      //   component: () => import('@/views/jubao/exchangeList.vue'),
      //   name: 'exchangeList',
      //   meta: {
      //     title: "兑换记录",
      //     icon: 'el-icon-s-help',
      //     hidden: false,
      //     roles: ['admin', 'jerry'],
      //     id:'28'
      //   }
      // },
      {
        path: 'jubaoManor',
        component: () => import('@/views/jubao/jubaoManor.vue'),
        name: 'jubaoManor',
        meta: {
          title: "橘宝庄园",
          icon: 'el-icon-s-help',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'29'
        }
      },
      {
        path: 'task',
        component: () => import('@/views/jubao/task.vue'),
        name: 'task',
        meta: {
          title: "任务管理",
          icon: 'el-icon-s-help',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'30'
        }
      },
      {
        path: 'videoSettings',
        component: () => import('@/views/jubao/videoSettings.vue'),
        name: 'videoSettings',
        meta: {
          title: "视频管理",
          icon: 'el-icon-s-help',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'33'
        }
      },
      // {
      //   path: 'turntableSettings',
      //   component: () => import('@/views/jubao/turntableSettings.vue'),
      //   name: 'turntableSettings',
      //   meta: {
      //     title: "转盘设置",
      //     icon: 'el-icon-s-help',
      //     hidden: false,
      //     roles: ['admin', 'jerry'],
      //     id:'31'
      //   }
      // },
      // {
      //   path: 'flopSettings',
      //   component: () => import('@/views/jubao/flopSettings.vue'),
      //   name: 'flopSettings',
      //   meta: {
      //     title: "翻牌设置",
      //     icon: 'el-icon-s-help',
      //     hidden: false,
      //     roles: ['admin', 'jerry'],
      //     id:'32'
      //   }
      // },
    ]
  },
  {
    path: '/customer',
    component: Layout,
    meta: {
      title: "客服",
      icon: 'el-icon-s-custom',
      hidden: false,
      id:'67'
    },
    
    children: [
      {
        path: 'workbench',
        component: () => import('@/views/customer/workbench.vue'),
        name: 'workbench',
        meta: {
          title: "客服工作台",
          icon: 'el-icon-s-custom',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'68'
        }
      },
      {
        path: 'service',
        component: () => import('@/views/customer/service.vue'),
        name: 'service',
        meta: {
          title: "客服设置",
          icon: 'el-icon-s-custom',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'84'
        }
      },
      {
        path: 'robot',
        component: () => import('@/views/customer/robot.vue'),
        name: 'robot',
        meta: {
          title: "机器人设置",
          icon: 'el-icon-s-custom',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'85'
        }
      },
      {
        path: 'supplierWorkbench',
        component: () => import('@/views/customer/supplierWorkbench.vue'),
        name: 'workbench',
        meta: {
          title: "供应商聊天记录",
          icon: 'el-icon-s-custom',
          hidden: true,
          roles: ['admin', 'jerry'],
          id:'68'
        }
      },
      // 
    ]
  }
  ,

  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/Accounts',
    meta: {
      title: "财务管理",
      icon: 'el-icon-notebook-1',
      hidden: false,
      id:'63'
    },
    children: [
      {
        path: 'userWithdraw',
        component: () => import('@/views/finance/userWithdraw.vue'),
        name: 'userWithdraw',
        meta: {
          title: "用户提现管理",
          icon: 'el-icon-notebook-1',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'64'
        }
      },
      {
        path: 'supplierWith',
        component: () => import('@/views/finance/supplierWith.vue'),
        name: 'supplierWith',
        meta: {
          title: "供应商提现管理",
          icon: 'el-icon-notebook-1',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'65'
        }
      },
      {
        path: 'overview',
        component: () => import('@/views/finance/overview.vue'),
        name: 'overview',
        meta: {
          title: "财务流水",
          icon: 'el-icon-notebook-1',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'66'
        }
      },
      {
        path: 'anchorShare',
        component: () => import('@/views/finance/anchorShare.vue'),
        name: 'anchorShare',
        meta: {
          title: "开通主播分润明细",
          icon: 'el-icon-notebook-1',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'70'
        }
      },
      {
        path: 'orderShare',
        component: () => import('@/views/finance/orderShare.vue'),
        name: 'orderShare',
        meta: {
          title: "订单分润明细",
          icon: 'el-icon-notebook-1',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'71'
        }
      },
      {
        path: 'orderBalance',
        component: () => import('@/views/finance/orderBalance.vue'),
        name: 'orderBalance',
        meta: {
          title: "订单收支",
          icon: 'el-icon-notebook-1',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'72'
        }
      }
    ]
  }
  ,
  
  {
    path: '/broadcast',
    component: Layout,
    redirect: '/broadcast/broadcastList',
    meta: {
      title: "平台直播管理",
      icon: 'el-icon-video-camera-solid',
      hidden: false,
      id:'57'
    },
    children: [
      {
        path: 'broadcastList',
        component: () => import('@/views/broadcast/broadcastList.vue'),
        name: 'broadcastList',
        meta: {
          title: "主播审核列表",
          icon: 'el-icon-video-camera-solid',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'58'
        }
      },
      {
        path: 'broadInfo',
        component: () => import('@/views/broadcast/broadInfo.vue'),
        name: 'broadInfo',
        meta: {
          title: "主播信息",
          icon: 'el-icon-video-camera-solid',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'59'
        }
      },
      {
        path: 'reward',
        component: () => import('@/views/broadcast/reward.vue'),
        name: 'reward',
        meta: {
          title: "打赏记录",
          icon: 'el-icon-video-camera-solid',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'60'
        }
      },
      {
        path: 'anchor',
        component: () => import('@/views/broadcast/anchor.vue'),
        name: 'anchor',
        meta: {
          title: "直播列表",
          icon: 'el-icon-video-camera-solid',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'61'
        }
      },
      {
        path: 'gold',
        component: () => import('@/views/broadcast/gold.vue'),
        name: 'gold',
        meta: {
          title: "椒点管理",
          icon: 'el-icon-video-camera-solid',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'62'
        }
      }
    ]
  }
  ,

  {
    path: '/agent',
    component: Layout,
    redirect: '/agent/agentList',
    meta: {
      title: "代理管理",
      icon: 'el-icon-s-flag',
      hidden: false,
      id:'17'
    },
    children: [
      {
        path: 'agentList',
        component: () => import('@/views/agent/agentList.vue'),
        name: 'agentList',
        meta: {
          title: "代理列表",
          icon: 'el-icon-s-flag',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'18'
        }
      },
      {
        path: 'areaAgentList',
        component: () => import('@/views/agent/areaAgentList.vue'),
        name: 'areaAgentList',
        meta: {
          title: "地区代理收益",
          icon: 'el-icon-s-flag',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'19'
        }
      },
    ]
  },

  {
    path: '/extensiones',
    component: Layout,
    redirect: '/extensiones/extensionList',
    meta: {
      title: "推广管理",
      icon: 'el-icon-s-opportunity',
      hidden: false,
      id:'20'
    },
    children: [
      {
        path: 'extensionList',
        component: () => import('@/views/extensiones/extensionList.vue'),
        name: 'extensionList',
        meta: {
          title: "推广列表",
          icon: 'el-icon-s-opportunity',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'21'
        }
      }
    ]
  },

  {
    path: '/member',
    component: Layout,
    redirect: '/member/Menusettings',
    meta: {
      title: "会员管理",
      icon: 'el-icon-s-custom',
      hidden: false,
      id: '1'
    },
    children: [
      {
        path: 'Membershiplist',
        component: () => import('@/views/member/Membershiplist.vue'),
        name: 'Membershiplist',
        meta: {
          title: "会员列表",
          icon: 'el-icon-s-custom',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '2'
        }
      },
      {
        path: 'Menusettings',
        component: () => import('@/views/member/Menusettings.vue'),
        name: 'Menusettings',
        meta: {
          title: "菜单列表",
          icon: 'el-icon-s-custom',
          hidden: false,
          roles: ['admin', 'jerry'],
          id: '4'
        }
      },
    ]
  },

  {
    path: '/floor',
    component: Layout,
    redirect: '/floor/CarouselMap',
    meta: {
      title: "楼层管理",
      icon: 'el-icon-s-order',
      hidden: false,
      id:'50'
    },
    children: [
      {
        path: 'CarouselMap',
        component: () => import('@/views/floor/CarouselMap.vue'),
        name: 'CarouselMap',
        meta: {
          title: "轮播图管理",
          icon: 'el-icon-s-order',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'51'
        }
      },
      {
        path: 'BannerGraph',
        component: () => import('@/views/floor/BannerGraph.vue'),
        name: 'BannerGraph',
        meta: {
          title: "首页装修",
          icon: 'el-icon-s-order',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'52'
        }
      }
    ]
  },

  {
    path: '/log',
    component: Layout,
    redirect: '/log/logMessage',
    meta: {
      title: "日志管理",
      icon: 'el-icon-menu',
      hidden: false,
      id:'15'
    },
    children: [
      {
        path: 'logMessage',
        component: () => import('@/views/log/logMessage.vue'),
        name: 'logMessage',
        meta: {
          title: "日志列表",
          icon: 'el-icon-menu',
          hidden: false,
          roles: ['admin', 'jerry'],
          id:'16'
        }
      }
    ]
  },

  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/index',
    meta: {
      title: "系统设置",
      icon: 'el-icon-setting',
      hidden: false,
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/personal/Index.vue'),
        name: 'homeindex',
        meta: {
          title: "个人设置",
          icon: 'el-icon-user-solid',
          hidden: false,
          roles: ['admin', 'jerry']
        }
      },
      {
        path: 'Informationall',
        component: () => import('@/views/personal/Informationall.vue'),
        name: 'homeinformationall',
        meta: {
          title: "个人消息",
          icon: 'el-icon-message-solid',
          hidden: false,
          roles: ['admin', 'jerry']
        }
      },
    ]
  },

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: constRouter
})

export default router

