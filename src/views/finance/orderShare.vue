<template>
  <div class="page">
    <div class="seach">
      
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="keywords"
             @keyup.enter.native="pick_seach"
            placeholder="请输入用户昵称"
            clearable
          ></el-input>
          <el-select
            v-model="time_value"
            class="el-inpu"
            placeholder="请选择搜索时间类型"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          <!-- daterange -->
          </el-date-picker>
          <el-input
            v-model="live_id"
            type="number"
            placeholder="请输入订单号"
            clearable
             @keyup.enter.native="pick_seach"
          ></el-input>
          <el-input v-model="anchor_id" placeholder="请输入交易号" @keyup.enter.native="pick_seach"></el-input>
        </div>
        <div class="button_type">
          <el-button type="success" @click="user_derive_excel1">导出</el-button>
          <el-button type="primary" @click="pick_seach">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
            >刷新</el-button
          >
        </div>
      </div>
    </div>
    <!-- 列表开始 -->
    <div class="head clearfix border">
      <div class="item width1 borderRight">商品名称</div>
      <div class="item width1 borderRight">数量/单价/运费</div>
      <div class="item width1 borderRight">运营商</div>
      <div class="item width1 borderRight">用户信息</div>
      <div class="item width1 borderRight">订单日期</div>
      <div class="item width1 borderRight">支付类型</div>
    </div>
    <div class="body">
      <div ref="height" style="overflow-y: auto;" :style='{height:height+"px"}'>
        <div class="kong borderRed" v-if="extendList.length == 0">空空如也</div>
        <div v-else>
          <div class="borderRed" v-for="(item, index) in extendList" :key="index">
            <div
              class="comm borderBottom"
              v-for="(comm, commI) in item.order_product_list"
              :key="commI"
            >
              <div class="item width1 borderRight">
                <h3>{{ comm.product_name }}</h3>
                <el-image
                  style="width: 100px; height: 100px"
                  :src="comm.product_image"
                ></el-image>
              </div>
              <div class="item width1 borderRight">
                <p>{{ comm.pro_num }}件</p>
                <p>成本价:{{ Number(comm.pro_cost_price).toFixed(2) }}元</p>
                <p>销售价:{{ Number(comm.pro_price).toFixed(2) }}元</p>
                <p>运费金额:{{ Number(comm.postage).toFixed(2) }}元</p>
              </div>
              <!-- <div class="item width1 borderRight">
                
                <p>优惠金额:{{ item.discount_price }}</p>
              </div> -->
              <div class="item width1 borderRight">
                <p>{{ item.store_name }}</p>
              </div>
              <div class="item width1 borderRight">
                <p>用户昵称:{{ item.nickname }}</p>
                <p>用户ID:{{ item.uid }}</p>
                <p>电话号码:{{ item.phone }}</p>
              </div>
              
              <div class="item width1 borderRight">
                <p>支付时间:{{ item.paid_time }}</p>
                <p>交易完成时间:{{ item.complate_time }}</p>
              </div>
              <div class="item width1 borderRight">
                <!-- 微信weixin 支付宝alipay 余额balance 橘宝score 混合blend -->
                <p v-if="item.payment_method == 'weixin'">微信</p>
                <p v-else-if="item.payment_method == 'alipay'">支付宝</p>
                <p v-else-if="item.payment_method == 'balance'">余额</p>
                <p v-else-if="item.payment_method == 'score'">橘宝</p>
                <p v-else-if="item.payment_method == 'blend'">混合</p>
                <p v-else-if="item.payment_method == 'test'">测试</p>
                <p v-else>未知</p>
              </div>
              <!-- <div class="item width1">
                <p>{{ comm.pay_money }}</p>
              </div> -->
            </div>
            <div class="bodyBottom">
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    <div class="top borderBottom" style="padding-left:10px">
                      <p style="width:370px;">
                        订单编号 : {{ item.order_no }}
                      </p>
                      <p style="width:250px;">订单id : {{ item.order_id }}</p>
                      <p style="width:387px;">支付流水号 : {{ item.third_id }}</p>
                      <p style="width:200px;">订单实付金额 : {{ Number(item.pay_money).toFixed(2) }}元</p>
                      <div style="color:red">
                        <p style="width:370px;">
                          订单总退款金额 : {{ Number(item.return.refund_money).toFixed(2) }}元
                        </p>
                        <p style="width:250px;">订单总退款余额 : {{ Number(item.return.product_balance).toFixed(2) }}元</p>
                        <p style="width:387px;">订单总退款件数 : {{ item.return.return_num }}</p>
                      </div>
                    </div>
                    <!-- <div class="top borderBottom">
                      
                    </div> -->
                  </template>
                  <div class="table">
                    <div class="head row">
                      <div class="cel width2">用户昵称</div>
                      <div class="cel width2">用户手机号/ID</div>
                      <div class="cel width2">用户身份</div>
                      <div class="cel width2">分润金额</div>
                    </div>
                    <div
                      class="row tableRow"
                      v-for="(extend, extendI) in item.extend_list"
                      :key="extendI"
                    >
                      <div class="cel width2">
                        {{ extend.nickname }}
                      </div>
                      <div class="cel width2">
                        {{ extend.phone }} / {{ extend.uid }}
                      </div>
                      <div class="cel width2" v-if="extend.profit_type != 2">
                        <div v-if="extend.profit_type == 0">直播</div>
                        <div v-else-if="extend.profit_type == 1">分享</div>
                        
                        <div v-else-if="extend.profit_type == 3">代理</div>
                        <div v-else-if="extend.profit_type == 4">橘宝</div>
                        <div v-else-if="extend.profit_type == 5">招商</div>
                        <div v-else-if="extend.profit_type == 6">自购</div>
                        <div v-else-if="extend.profit_type == 7">
                          段位升级奖励
                        </div>
                      </div>
                      <div class="cel width2" v-else>
                        <div v-if="extend.level == 0">普通</div>
                        <div v-else-if="extend.level == 1">专员</div>
                        <div v-else-if="extend.level == 2">经理</div>
                        <div v-else-if="extend.level == 3">总监</div>
                      </div>
                      <div class="cel width2">
                        {{ Number(extend.fx_profit).toFixed(2) }}元
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
      
    </div>
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
import publicFile from '../../utils/publicFile'
import { order_profit_list } from "../../utils/axios";
export default {
  data() {
    return {
      broadId: "",
      extendList: [], //打赏主播列表
      fn1: this.commonJs.Debounce(this.get_agent_list),
      queryInfo: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      time_value: "",
      time:"",
      //申請人姓名
      live_id: "",
      anchor_id: "",
      keywords: "",
      loading: false,
      options: [
        {
          value: 1,
          label: "完成时间",
        },
        {
          value: 2,
          label: "支付时间",
        },
      ],
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
    };
  },
  created() {
    if (this.$route.query.ids) {
      console.log(this.$route.query.ids)
      this.anchor_id = this.$route.query.ids;
      this.pick_seach();
    } else {
      this.get_agent_list();
    }
    
    this.height = document.body.clientHeight - 300
    
  },
  methods: {
    //导出
    user_derive_excel1(){
      let that = this;
      
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time != "") {
        time1 = this.commonJs.dataTime(this.time[0]);
        time2 = this.commonJs.dataTime(this.time[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        start_time: time1,
        end_time: time2,
        time_type: that.time_value,
        third_id: that.anchor_id,
        order_no: that.live_id,
        keywords: that.keywords,
      };
      //搜索
      order_profit_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            if(res.data.err_msg.list.length == 0){
              that.$message({
                showClose: true,
                message: "暂无数据,",
                type: "error",
              });
            }else{
              window.open(publicFile.address + "/new_admin.php?c=finance&a=order_profit_derive_excel&time_type="+ that.time_value 
              +"&third_id="+ that.anchor_id
              +"&keywords="+ that.keywords
              +"&order_no="+ that.live_id
              +"&start_time="+ time1 
              +"&end_time="+ time2)
            }
          } else {
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.loading = false;
          console.log(error);
        });
    },
    pick_seach(index) {
      let that = this;
      if (
        that.anchor_id == "" &&
        that.live_id == "" &&
        that.keywords === "" &&
        that.time_value == "" &&
        that.time == ""
      ) {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time != "") {
        time1 = this.commonJs.dataTime(this.time[0]);
        time2 = this.commonJs.dataTime(this.time[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        start_time: time1,
        end_time: time2,
        time_type: that.time_value,
        third_id: that.anchor_id,
        order_no: that.live_id,
        keywords: that.keywords,
      };
      //搜索
      order_profit_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            
            res.data.err_msg.list.forEach((item) => {
              item.paid_time = this.commonJs.timestampToTime(
                item.paid_time
              );
              item.complate_time = this.commonJs.timestampToTime(item.complate_time);
            });
            this.extendList = res.data.err_msg.list;
            console.log(this.extendList);
            console.log(this.extendList.length);
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
            if (index == 1) {
              that.O_message_c = {};
              that.$message({
                message: "刷新成功",
                type: "success",
              });
            }
          } else {
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.loading = false;
          console.log(error);
        });
    },
    //每页显示条数改变
    handleSizeChange(val) {
      this.get_shop_list_page(1, val);
    },

    //当前页
    handleCurrentChange(val) {
      this.get_shop_list_page(val, this.queryInfo.pageSize);
    },
    //分页
    get_shop_list_page(page, number) {
      let that = this;
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time != "") {
        time1 = this.commonJs.dataTime(this.time[0]);
        time2 = this.commonJs.dataTime(this.time[1]);
      }
      order_profit_list({
        page: page,
        page_size: number,
        time_type: that.time_value,
        third_id: that.anchor_id,
        order_no: that.live_id,
        keywords: that.keywords,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.paid_time = this.commonJs.timestampToTime(
                item.paid_time
              );
              item.complate_time = this.commonJs.timestampToTime(item.complate_time);
            });
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
          } else {
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.loading = false;
          console.log(error);
        });
    },
    //加载第一页
    get_agent_list(index) {
      this.anchor_id = "";
      this.live_id = "";
      this.keywords = "";
      this.time_value = "";
      this.time = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      order_profit_list(request_form)
        .then((res) => {
          that.loading = false;
          //测试数据
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.paid_time = this.commonJs.timestampToTime(
                item.paid_time
              );
              item.complate_time = this.commonJs.timestampToTime(item.complate_time);
            });
            this.extendList = res.data.err_msg.list;

            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
            if (index == 1) {
              that.O_message_c = {};
              that.$message({
                message: "刷新成功",
                type: "success",
              });
            }
          } else {
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.loading = false;
          console.log(error);
        });
    },
  },
};
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}
@width2: 25%;
@width1: 16.66%;
.border {
  border: 1px solid #ebeef5;
}
.borderRight {
  border-right: 1px solid #ebeef5;
}
.borderLeft {
  border-left: 1px solid #ebeef5;
}
.borderTop {
  border-top: 1px solid #ebeef5;
}
.borderBottom {
  border-bottom: 1px solid #ebeef5;
}
.borderRed {
  border: 1px solid #ffc3c3;
  border-bottom: none;
}
.borderRedRight {
  border-right: 1px solid #ffc3c3;
}
.marginRight {
  margin-right: 80px;
}
.head {
  margin-top: 20px;
  width: calc(100% - 17px);
  border-right: none;
  .item {
    box-sizing: border-box;
    padding: 12px 10px;
    font-weight: 500;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.kong {
  padding: 30px 0;
  text-align: center;
  color: #9e9e9e;
}
.body {
  border-bottom: 1px solid #ffb9b9;
  width: 100%;
  display: table;
  .comm {
    min-height: 190px;
    .item {
      display: table-cell;
      padding: 12px 10px;
      text-align: center;
      width: 11.6%;
      // display: flex;
      // justify-content:center;
      // align-items:center;
    }
    p {
      width: 100%;
      display: block;
      margin: 10px 0;
      line-height: 25px;
    }
  }
  .bodyBottom {
    .top {
      width: 100%;
      p {
        font-size: 16px;
      }
    }
    p {
      display: inline-block;
    }
    .table {
      width: 100%;
      text-align: center;
      display: table;
      .head {
        font-weight: bold;
      }
      .tableRow {
        .cel {
          border-top: 1px solid #ebeef5;
        }
      }
      .row {
        display: table-row;
        .cel {
          display: table-cell;
          padding: 15px 0;
          border-right: 1px solid #ebeef5;
        }
        .cel:last-child {
          border-right: none;
        }
      }
    }
  }
}
.width1 {
  width: @width1;
}
.page {
  padding: 15px 15px 0;
}
.seach {
  /deep/ .el-input {
    width: 200px;
    margin: 0 20px 0 10px;
  }
}
.seach_copy {
  padding-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  /deep/ .el-input {
    width: 200px;
    margin: 0 20px 0 10px;
  }
  .button_type {
    display: flex;
  }
  .seach_select {
    display: flex;
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
/deep/ .el-dialog {
  box-shadow: 0 0px 0px #ccc;
  -webkit-box-shadow: 0 0px 0px #ccc;
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
/deep/ .el-collapse-item__header{
  height: 100px!important;
}
</style>
