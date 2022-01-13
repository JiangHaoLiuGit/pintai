<template>
  <div class="page">
    <div class="seach">
      <div class="el-inpu inlineBlock">
        <el-select v-model="anchor_id" class="el-inpu" placeholder="请选择支付类型">
              <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
          </el-select>
      </div>
      <div class="el-inpu inlineBlock">
        <el-select v-model="anchor_id1" class="el-inpu" placeholder="请选择订单状态">
              <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
          </el-select>
      </div>
      <div class="el-inpu inlineBlock">
        
          
          <el-select v-model="live_id" class="el-inpu" placeholder="请选择状态">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
          </el-option>
          </el-select>
      </div>
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="keywords"
            type="number"
            placeholder="请输入交易号"
            style="width:300px"
            clearable
             @keyup.enter.native="pick_seach"
          ></el-input>
          <el-date-picker
            v-model="time_value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          <!-- daterange -->
          </el-date-picker>
          <el-input
           @keyup.enter.native="pick_seach"
            v-model="keywords1"
            type="number"
            placeholder="请输入订单号"
            clearable
            style="width:300px"
          ></el-input>
          <el-input
            v-model="keywords2"
            type="number"
            placeholder="请输入店铺id"
            clearable
             @keyup.enter.native="pick_seach"
          ></el-input>
          
          
          
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
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          :data="extendList"
          border
          style="width: 100%"
          :height="height"
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column label="编号" width="260">
            <template slot-scope="scope">
              <ul>
                <li style="text-align: left; font-weight: bold; color: #6a6ae0">
                  订单号：{{ scope.row.order_no }}
                </li>
                <li style="text-align: left; font-weight: bold; color: #6a6ae0">
                  交易号：{{ scope.row.trade_no }}
                </li>
              </ul>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="order_no"
            label="订单号"
          ></el-table-column>
          <el-table-column
            prop="trade_no"
            label="交易单号"
            width="150"
          ></el-table-column> -->
          <el-table-column
            prop="create_time"
            label="创建时间"
            width="140"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="用户账号"
          ></el-table-column>
          <el-table-column
            prop="nickname"
            label="用户昵称"
          ></el-table-column>
          <el-table-column
            prop="user_id"
            label="用户id"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="店铺名称"
          >
            <template slot-scope="scope">{{scope.row.store_id == 0 ? "平台自营": scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="支付类型">
              <template slot-scope="scope">
                  <div v-if="scope.row.pay_type == 1">支付宝</div>
                  <div v-else-if="scope.row.pay_type == 2">微信</div>
                  <div v-else-if="scope.row.pay_type == 3">余额</div>
                  <div v-else-if="scope.row.pay_type == 4">银行卡</div>
              </template>
          </el-table-column>
          <el-table-column label="收支类型">
              <template slot-scope="scope">
                  <div v-if="scope.row.water_status == 1">收入</div>
                  <div v-else-if="scope.row.water_status == 2">支出</div>
              </template>
          </el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="scope">
              <div v-if="scope.row.water_status == 2">
                退款完成
              </div>
              <div v-else>
                <div v-if="scope.row.status == 2">待发货</div>
                <div v-else-if="scope.row.status == 3">待收货</div>
                <div v-else-if="scope.row.status == 4">(待评价)已完成</div>
                <div v-else-if="scope.row.status == 7">待完成</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="store_id"
            label="店铺id"
          ></el-table-column>
          <el-table-column
            label="订单成本价"
          >
            <template slot-scope="scope">
              {{scope.row.cost_price}}元
            </template>
          </el-table-column>
          <el-table-column
            label="金额"
          >
              <template slot-scope="scope">
                  <div v-if="scope.row.water_status == 2"><span>-</span>{{scope.row.money}}元</div>
                  <div v-else-if="scope.row.water_status == 1"><span></span>{{scope.row.money}}元</div>
              </template>
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注"
            
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>

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
import axios from 'axios'
import publicFile from '../../utils/publicFile'
import { order_tran_details } from "../../utils/axios";
export default {
  data() {
    return {
      broadId: "",
      extendList: [], //列表
      fn1: this.commonJs.Debounce(this.get_agent_list),
      queryInfo: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
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
      options: [
        {
          value: 1,
          label: "收入",
        },
        {
          value: 2,
          label: "支出",
        }
      ],
      options1: [
        {
          value: 1,
          label: "支付宝",
        },
        {
          value: 2,
          label: "微信",
        },
        {
          value: 3,
          label: "余额",
        },
        {
          value: 4,
          label: "银行卡",
        }
      ],
      options2: [
        {
          value: 2,
          label: "待发货",
        },
        {
          value: 3,
          label: "待收货",
        },
        {
          value: 4,
          label: "(待评价)已完成",
        },
        {
          value: 7,
          label: "待完成",
        }
      ],
      live_id: "",
      anchor_id: "",
      anchor_id1:"",
      keywords: "",
      keywords1: "",
      keywords2: "",
      time_value: "",
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
      //   },
      // },
      loading: false,
      height:"",
    };
  },
  created() {
    
    if (this.$route.query.ids) {
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
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        pay_type: that.anchor_id,
        status: that.anchor_id1,
        water_status: that.live_id,
        trade_no: that.keywords,
        order_no: that.keywords1,
        store_id: that.keywords2,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      order_tran_details(request_form)
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
            window.open(publicFile.address + "/new_admin.php?c=finance&a=order_tran_details_derive_excel&store_id="+ that.keywords2 
            +"&pay_type="+ that.anchor_id +
            "&status="+ that.anchor_id1 
            +"&water_status="+ that.live_id +
            "&trade_no="+ that.keywords 
            +"&order_no="+ that.keywords1
            +"&start_time="+ time1 +"&end_time="+ time2)
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
        that.anchor_id1 == "" &&
        that.live_id == "" &&
        that.keywords === "" &&
        that.keywords1 === "" &&
        that.keywords2 === "" &&
        that.time_value == ""
      ) {
        that.$message({
          message: "请选择任意一种搜索类型,",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        pay_type: that.anchor_id,
        status: that.anchor_id1,
        water_status: that.live_id,
        trade_no: that.keywords,
        order_no: that.keywords1,
        store_id: that.keywords2,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      order_tran_details(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
            });
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
            // this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            // this.queryInfo.page = parseInt(res.data.err_msg.page);
            // this.queryInfo.total = parseInt(res.data.err_msg.total_number);
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
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }

      order_tran_details({
        page: page,
        page_size: number,
        pay_type: that.anchor_id,
        status: that.anchor_id1,
        water_status: that.live_id,
        trade_no: that.keywords,
        order_no: that.keywords1,
        store_id: that.keywords2,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
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
      this.anchor_id1 = "";
      this.live_id = "";
      this.keywords = "";
      this.keywords1 = "";
      this.keywords2 = "";
      this.time_value = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      order_tran_details(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
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
.page {
  padding: 15px;
  >h1{
      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
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
</style>
