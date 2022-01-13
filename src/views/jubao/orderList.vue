<template>
  <div class="goodsindex">

    <div class="seach_copy">
      <div class="seach_select">
        <el-select v-model="expressValue" placeholder="请选择快递公司">
        <el-option
          v-for="item in expressList"
          :key="item.pigcms_id"
          :label="item.name"
          :value="item.pigcms_id">
        </el-option>
      </el-select>
      <el-select v-model="orderValue" placeholder="请选择订单状态">
        <el-option
          v-for="item in orderListType"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="typeValue" placeholder="请选择搜索类型">
        <el-option
          v-for="item in typeList"
          :key="item.type"
          :label="item.label"
          :value="item.type">
        </el-option>
      </el-select>
      <el-input v-model="pick_value" placeholder="请输入搜索内容" @keyup.enter.native="pick_seach"></el-input>
        <el-date-picker
          :clearable = false
          v-model="time_value"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="button_type">
        <el-button type="primary" @click="pick_seach">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
      </div>
    </div>

    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="orderList"
          border
          :height="height"
          style="width: 100%"
        >
          <el-table-column 
            label="序号"
            type="index" 
            width="80"
          >
          </el-table-column>
          <el-table-column 
            prop="order_no" 
            label="订单号" 
            width="240"
          >
          </el-table-column>
          <el-table-column 
            prop="add_time" 
            label="下单时间" 
            width="160"
          >
          </el-table-column>
          <el-table-column 
            prop="nickname" 
            label="买家名称" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="phone" 
            label="买家手机号" 
            width="120"
          >
          </el-table-column>
          
           <el-table-column 
            prop="address" 
            label="收货地址" 
            width="300"
          >
          </el-table-column>
          <el-table-column 
            prop="address_user" 
            label="收货人姓名" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="address_tel" 
            label="收货人手机号" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="aaa" 
            label="订单状态" 
            width="100"
          >
          </el-table-column>
           <el-table-column 
            prop="order_pay_point" 
            label="实付橘宝" 
            width="100"
          >
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="details(scope.$index, scope.row)"
                >详情</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-show="scope.row.status == '未发货'"
                @click="deliverGoods(scope.$index, scope.row)"
                >发货</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 商品发货弹窗 -->
    <el-dialog :title="title" :visible.sync="delivery_ifShow">
      <el-form :model="form_delivery">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form_delivery.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品数量" :label-width="formLabelWidth">
          <el-input v-model="form_delivery.num" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <el-input v-model="form_delivery.person" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="form_delivery.tel" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货地址" :label-width="formLabelWidth">
          <el-input v-model="form_delivery.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="快递公司" :label-width="formLabelWidth">
          <el-select v-model="form_delivery.expressName" placeholder="请选择快递公司">
            <el-option
              v-for="item in expressList"
              :key="item.pigcms_id"
              :label="item.name"
              :value="item.pigcms_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" :label-width="formLabelWidth">
          <el-input v-model="form_delivery.dh"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delivery_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_saveChanges_delivery">发货</el-button>
      </div>
    </el-dialog>

    <!-- 订单弹窗 -->
    <el-dialog title="订单详情" :visible.sync="order_ifShow">
      <el-form :model="order_detail_form">
        <el-form-item label="买家名称" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.nickname" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="买家手机号" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.phone" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="收货人姓名" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.address_user" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="收货人手机号" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.address_tel" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="收货人地址" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单状态" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.status" disabled></el-input>
        </el-form-item>
        <el-form-item label="买家留言" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.comment" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="用户实付橘宝" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.comment" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="售后内容" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.sh_contant" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="订单号" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.order_no" disabled></el-input>
        </el-form-item>
        <el-form-item label="物流单号" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.express.express_no" disabled></el-input>
        </el-form-item>
         <!-- <el-form-item label="发货方式" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.fhfs" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="物流公司" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.express.express_company" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否售后" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.sfsh" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="下单时间" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.add_time" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="自动结束时间" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.zdjssj" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="发货时间" :label-width="formLabelWidth">
          <el-input v-model="order_detail_form.order.sent_time" disabled></el-input>
        </el-form-item>
        <div v-for="(item,index) in order_detail_form.data" class="div clearfix" :key="index" style="margin:20px 0;">
          <h3>商品{{index+1}}.</h3>
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="item.product_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品规格" :label-width="formLabelWidth">
            <el-input v-model="item.sku_data" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品橘宝数" :label-width="formLabelWidth">
            <el-input v-model="item.sku_data" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品数量" :label-width="formLabelWidth">
            <el-input v-model="item.pro_num" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品图片" :label-width="formLabelWidth">
            <!-- order_detail_form.pro_img -->
            <el-image 
              style="width: 200px; height: 200px"
              :src="item.product_image" 
              fit="cover"
              :preview-src-list="[item.product_image]">
            </el-image>
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary" @click="see_" v-show="wlList.length == 0" style="margin-bottom:20px">查看物流</el-button>
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="wlList"
            border
            style="width: 100%"
          >
            <el-table-column 
              label="序号"
              type="index" 
              width="80"
            >
            </el-table-column>
            <el-table-column 
              prop="AcceptTime"
              label="时间" 
              width="160"
            >
            </el-table-column>
            <el-table-column 
              prop="AcceptStation" 
              label="位置" 
            >
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 分页 -->
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24" class="goodsindex-page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
          :page-sizes="[5, 10, 20, 30, 50]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryInfo.total"
        >
        </el-pagination>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { jvbao_order_list , get_express_jvbao , jvbao_order_detail_content ,  jvbao_save_status  , jvbao_get_express } from "../../utils/axios";
export default {
  data() {
    return {
      orderList: [], //订单列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_order_list),
      O_message : {},
      formLabelWidth: "100px",
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      height:"",
      expressList: [],//快递列表
      expressValue: '',
      orderListType: [
      {
        value: '1',
        label: '未支付'
      },{ 
        value: '2',
        label: '未发货'
      }, {
        value: '3',
        label: '已发货'
      }, {
        value: '4',
        label: '已完成'
      }, {
        value: '5',
        label: '已取消'
      }
      ],
      orderValue : '',
      typeList : [
        {
          type: '0',
          label: '订单号'
        },{ 
          type: '1',
          label: '收货人姓名'
        }, {
          type: '2',
          label: '收货人手机号'
        }, {
          type: '3',
          label: '买家名称'
        }, {
          type: '4',
          label: '买家手机号'
        }, {
          type: '5',
          label: '发货单号'
        }
      ],
      typeValue: '',
      pick_value : '',
      time_value : '',
      pageSize : 20,
      form_delivery : {
        name : '',
        num : '',
        person : '',
        tel : '',
        address : '',
        expressName : '',
        dh: ''
      },
      title : '商品发货',
      levelList : [],
      delivery_ifShow : false,
      pickerOptions: {
        shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }
          ]
      },
      order_ifShow : false,
      order_detail_form : {
        order:{},
        data:{},
        express:{}
      },
      wlList : [],
      express_code  : ''
    };
  },

  created() {
    this.get_order_list(); //获取订单列表
    this.height = document.body.clientHeight - 240
    this.get_expree();//获取物流公司
  },

  methods: {

    //获取订单列表
    get_order_list (index) {
      this.expressValue = ''
      this.orderValue = ''
      this.typeValue = ''
      this.time_value = ''
      this.pick_value = ''
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      jvbao_order_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.aaa = element.status
              if(element.add_time == 0) {
                element.add_time = '---'
              }
            });
            that.orderList = res.data.err_msg.list
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
            that.pageSize = res.data.err_msg.page_size
            if(index == 1) {
              that.$message({
                message: '刷新成功',
                type: 'success'
              });
            }
          } else {
            that.loading = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.loading = false
          console.log(error);
        });
    },

    //获取物流公司
    get_expree (index) {
      let that = this
      get_express_jvbao(
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.expressList = res.data.err_msg.list
          } else {
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //分页
    get_shop_list_page (page , number) {
      let that = this
      let express = ''
      that.loading = true
      let order_no = ''
      let consignee_name = ''
      let consignee_phone = ''
      let invoice = ''
      let nickname = ''
      let phone = ''
      if(this.typeValue == 0) {
        order_no = this.pick_value
      } else if (this.typeValue == 1) {
        consignee_name = this.pick_value
      } else if (this.typeValue == 2) {
        consignee_phone = this.pick_value
      } else if (this.typeValue == 3) {
        nickname = this.pick_value
      } else if (this.typeValue == 4) {
        phone = this.pick_value
      } else if (this.typeValue == 5) {
        invoice = this.pick_value
      }
      that.expressList.forEach(ele => {
        if(that.expressValue == ele.pigcms_id) {
          express = ele.name
        }
      })
      jvbao_order_list(
        {
          page : page,
          page_size: number,
          order_no : order_no,//订单号
          consignee_name : consignee_name, //收货人姓名、
          consignee_phone : consignee_phone, //收货人手机号
          invoice : invoice, //发货单号
          status : this.orderValue, //订单状态
          express : express, //物流状态
          nickname : nickname,//用户名
          phone : phone, //手机号
          start_time : this.time_value[0],
          end_time : this.time_value[1]
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.aaa = element.status
              if(element.add_time == 0) {
                element.add_time = '---'
              }
            });
            that.orderList = res.data.err_msg.list
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
            that.pageSize = res.data.err_msg.page_size
          } else {
            that.loading = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.loading = false
          console.log(error);
        });
    },

    //每页显示条数改变
    handleSizeChange(val) {
      console.log(this.queryInfo)
      this.get_shop_list_page(1,val)
    },

    //当前页
    handleCurrentChange(val) {
      console.log(val)
      this.get_shop_list_page(val,this.pageSize)
    },

    //搜索
    pick_seach () {
      let that = this
      let express = ''
      if(that.expressValue == '' && that.orderValue == '' && that.typeValue == '' && that.time_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      if (that.typeValue != '') {
        if(that.pick_value == '') {
          that.$message({
            message: '请填写搜索内容',
            type: 'warning'
          });
          return
        }
      }
      let order_no = ''
      let consignee_name = ''
      let consignee_phone = ''
      let invoice = ''
      let nickname = ''
      let phone = ''
      if(this.typeValue == 0) {
        order_no = this.pick_value
      } else if (this.typeValue == 1) {
        consignee_name = this.pick_value
      } else if (this.typeValue == 2) {
        consignee_phone = this.pick_value
      } else if (this.typeValue == 3) {
        nickname = this.pick_value
      } else if (this.typeValue == 4) {
        phone = this.pick_value
      } else if (this.typeValue == 5) {
        invoice = this.pick_value
      }
      that.loading = true
      that.expressList.forEach(ele => {
        if(that.expressValue == ele.pigcms_id) {
          express = ele.name
        }
      })
      jvbao_order_list(
        {
          page : 1,
          page_size: this.pageSize,
          order_no : order_no,//订单号
          consignee_name : consignee_name, //收货人姓名、
          consignee_phone : consignee_phone, //收货人手机号
          invoice : invoice, //发货单号
          status : this.orderValue, //订单状态
          express : express, //物流状态
          nickname : nickname,//用户名
          phone : phone, //手机号
          start_time : this.time_value[0],
          end_time : this.time_value[1]
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.aaa = element.status
              if(element.add_time == 0) {
                element.add_time = '---'
              }
            });
            console.log(res.data.err_msg.list)
            that.orderList = res.data.err_msg.list
            console.log(that.orderList)
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
            that.pageSize = res.data.err_msg.page_size
          } else {
            that.loading = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          console.log(error);
          that.loading = false
        });
    },

     //详情
    details (index , row) {
      let that = this
      that.O_message = row
      that.order_ifShow = true
      that.express_code = ''
      // that.order_detail_form.buyName = ''
      // that.order_detail_form.pro_name = ''
      // that.order_detail_form.buy_tel = ''
      // that.order_detail_form.por_gg = ''
      // that.order_detail_form.re_name = ''
      // that.order_detail_form.por_dj = ''
      // that.order_detail_form.re_tel = ''
      // that.order_detail_form.pro_num = ''
      // that.order_detail_form.pro_address = ''
      // that.order_detail_form.order_status = ''
      // that.order_detail_form.mjly = ''
      // that.order_detail_form.pro_img = ''
      // that.order_detail_form.buy_sf = ''
      // // that.order_detail_form.sh_contant = res_s.data.err_msg.data.product_name//售后内容
      // that.order_detail_form.ddh = ''//订单号
      // that.order_detail_form.wldh = ''
      // that.order_detail_form.fhfs = ''
      // that.order_detail_form.wlgs = ''
      // // that.order_detail_form.sfsh = res_s.data.err_msg.data.product_name // 是否售后
      // that.order_detail_form.xhsj = ''
      // that.order_detail_form.zdjssj = ''
      // that.order_detail_form.fhsj = ''
      that.wlList = []
      jvbao_order_detail_content({
        id: row.order_id
        // id: 123456
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            res_s.data.err_msg.order.add_time = this.commonJs.timestampToTime(
              res_s.data.err_msg.order.add_time
            );
            res_s.data.err_msg.order.sent_time = this.commonJs.timestampToTime(
              res_s.data.err_msg.order.sent_time
            );
            if(res_s.data.err_msg.order.status == "1"){
              res_s.data.err_msg.order.status = "未支付"
            }else if(res_s.data.err_msg.order.status == "2"){
              res_s.data.err_msg.order.status = "待发货"
            }else if(res_s.data.err_msg.order.status == "3"){
              res_s.data.err_msg.order.status = "待收货"
            }else if(res_s.data.err_msg.order.status == "4"){
              res_s.data.err_msg.order.status = "已完成（交易完成）"
            }else if(res_s.data.err_msg.order.status == "5"){
              res_s.data.err_msg.order.status = "已取消"
            }else if(res_s.data.err_msg.order.status == "7"){
              res_s.data.err_msg.order.status = "是已收货(确认收货)"
            }
            that.order_detail_form = res_s.data.err_msg
            // that.order_detail_form.buyName = res_s.data.err_msg.order.nickname
            // that.order_detail_form.pro_name = res_s.data.err_msg.data.product_name
            // that.order_detail_form.buy_tel = res_s.data.err_msg.order.phone
            // that.order_detail_form.por_gg = res_s.data.err_msg.data.sku_data[0].value
            // that.order_detail_form.re_name = res_s.data.err_msg.order.address_user
            // that.order_detail_form.por_dj = res_s.data.err_msg.data.point_exchange_num
            // that.order_detail_form.re_tel = res_s.data.err_msg.order.address_tel
            // that.order_detail_form.pro_num = res_s.data.err_msg.data.pro_num
            // that.order_detail_form.pro_address = res_s.data.err_msg.order.address
            // that.order_detail_form.order_status = res_s.data.err_msg.order.status
            // that.order_detail_form.mjly = res_s.data.err_msg.order.comment
            // that.order_detail_form.pro_img = res_s.data.err_msg.data.product_image
            // that.order_detail_form.buy_sf = res_s.data.err_msg.order.order_pay_point 
            // // that.order_detail_form.sh_contant = res_s.data.err_msg.data.product_name//售后内容
            // that.order_detail_form.ddh = res_s.data.err_msg.order.order_no//订单号
            that.order_detail_form.wldh = res_s.data.err_msg.express.express_no
            that.express_code  = res_s.data.err_msg.express.express_code
            // // that.order_detail_form.fhfs = res_s.data.err_msg.order.shipping_method
            // that.order_detail_form.wlgs = res_s.data.err_msg.order.express_company
            // that.order_detail_form.sfsh = res_s.data.err_msg.order.refund_status // 是否售后
            // that.order_detail_form.xhsj = res_s.data.err_msg.order.add_time
            // // that.order_detail_form.zdjssj = res_s.data.err_msg.order.delivery_time
            // that.order_detail_form.fhsj = res_s.data.err_msg.order.sent_time
            // // that.wlList = res_s.data.err_msg.express.Traces
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //查看物流
    see_ () {
      let that = this
      jvbao_get_express({
        express_code: that.express_code,
        express_no : that.order_detail_form.wldh
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.wlList = res_s.data.err_msg.Traces
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //发货
    deliverGoods (index , row) {
      let that = this
      that.O_message = row
      that.delivery_ifShow = true
      jvbao_order_detail_content({
        id: row.order_id
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            res_s.data.err_msg.data = res_s.data.err_msg.data[0]
            that.form_delivery.name = res_s.data.err_msg.data.product_name
            that.form_delivery.num = res_s.data.err_msg.data.pro_num
            that.form_delivery.person = res_s.data.err_msg.order.address_user
            that.form_delivery.tel = res_s.data.err_msg.order.address_tel
            that.form_delivery.address = res_s.data.err_msg.order.address
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    submit_saveChanges_delivery () {
      let that = this
      let express_company = ''
      let express_code = ''
      if(that.form_delivery.expressName == '') {
        that.$message({
          message: '请选择快递公司',
          type: 'warning'
        });
        return;
      }
      if(that.form_delivery.dh == '') {
        that.$message({
          message: '请填写物流单号',
          type: 'warning'
        });
        return;
      }
      that.expressList.forEach(ele => {
        if(that.form_delivery.expressName == ele.pigcms_id) {
          express_company = ele.name
          express_code =  ele.code
        }
      })
      jvbao_save_status(
        {
          id :  parseInt(that.O_message.order_id),
          express_code : express_code,
          express_no : that.form_delivery.dh ,
          express_company : express_company
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.delivery_ifShow = false
            that.$message({
              message: '发货成功',
              type: 'success'
            });
            that.get_order_list();
          } else {
            that.delivery_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.delivery_ifShow = false
          console.log(error);
        });
    }

  },
};
</script>

<style scoped lang="less">

/deep/ .el-table td, .el-table th.is-leaf{
    border-top: 1px solid #717b90;
    border-bottom:0
}

/deep/ .el-table__body{
  border-bottom: 1px solid #EBEEF5;
}

/deep/ .el-date-editor {
  margin-right: 20px;
}

/deep/ .el-dialog {
  width: 1500px !important;
  /deep/ .el-input {
    overflow-y: auto;  /*溢出隐藏*/
    // text-overflow: ellipsis; /*以省略号...显示*/
    // white-space: nowrap;  /*强制不换行*/
  }
}

/deep/ .el-dialog__body {
  height: 570px;
  overflow-y: auto;
}

/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/deep/ .el-form-item {
  .el-input {
    width: 223px;
  }
}

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
  }
}

.seach_copy {
  padding-top:20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
  }
  .button_type {
    display: flex;
  }
  .seach_select {
    display: flex;
  }
}

.goodsindex {
  width: 100%;
  min-height: 100%;
  padding: 0 15px 0;
  box-sizing: border-box;
}

/* 搜索 */
.goodsindex-queryInfo {
  margin-bottom: 10px;
}

.goodsindex-queryInfo-li {
  width: 100%;
  height: auto;
}
.div{
  width: 100%;
  .el-form-item{
    width: 30%;
    float: left;
  }
}

/* 列表 */
.goodsindex-list {
  width: 100%;
  height: auto;
}

/* 分页 */
.goodsindex-page-box {
  width: 100%;
  height: auto;
  padding-top:15px;
  padding-bottom: 15px;
  margin-top: 10px;
  background: #ccc;
  display: flex;
  justify-content: flex-end;
}

/deep/ .el-table .warning-row {
  background: oldlace;
}

/deep/ .el-table .success-row {
  background: #f0f9eb;
}
/deep/ .el-table td {
  text-align: center !important;
}
/deep/ .el-table th {
  text-align: center !important;
}
/deep/ .el-button {
  margin: 0 10px;
}
/deep/ .goodsindex-list {
  margin-top: 0;
}  
/deep/ .el-dialog  {
  box-shadow: 0 0px 0px #ccc;
  -webkit-box-shadow : 0 0px 0px #ccc;
}
/deep/ .el-dialog {
  width: 30%;
}
/deep/ .el-form-item__label {
  text-align-last: justify;
}
/deep/ .el-dialog__body {
  padding: 30px 50px;
}

</style>