<template>
  <div class="page">
      <!-- <el-tag size="medium"></el-tag> -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        tab-position="top"
      >
        <el-tab-pane label="全部" name=""></el-tab-pane>
        <el-tab-pane label="订单" name="1"></el-tab-pane>
        <el-tab-pane label="开通主播" name="2"></el-tab-pane>
        <el-tab-pane label="店铺保证金" name="3"></el-tab-pane>
        <el-tab-pane label="椒点充值" name="4"></el-tab-pane>
      </el-tabs>
      <!-- {
          value: 1,
          label: "订单",
        },
        {
          value: 2,
          label: "开通主播",
        },
        {
          value: 3,
          label: "店铺保证金",
        },
        {
          value: 4,
          label: "椒点充值",
        }, -->
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="keywords"
            placeholder="请输入关键字"
             @keyup.enter.native="pick_seach"
            clearable
          ></el-input>
          <el-date-picker
            v-model="time_value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <!-- <el-select v-model="live_id" class="el-inpu" placeholder="请选择交易类型">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
        </el-select> -->
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
        <div class="button_type">
          <el-button type="success" @click="user_derive_excel1">导出</el-button>
          <el-button type="primary" @click="pick_seach">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
            >刷新</el-button
          >
        </div>
      </div>
    <!-- 列表开始 -->
    <el-row :gutter="20" class="goodsindex-list">
      <!-- 序号，单号，时间，账号，昵称/店铺名，UID，类型，状态，金额/数字.....顺序排序 -->
      <el-col :span="24">
        <el-table
          v-loading="loading"
          :data="extendList"
          border
          :height="height"
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" width="100">
          </el-table-column>
          <el-table-column
            prop="trade_no"
            label="第三方单号"
            
          ></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            
          ></el-table-column>
          <el-table-column
            prop="nickname"
            label="用户昵称"
            width="140"
          ></el-table-column>
          <el-table-column
            prop="user_id"
            label="用户id"
            width="140"
          ></el-table-column>
          <el-table-column label="交易类型">
              <template slot-scope="scope">
                  <div v-if="scope.row.type == 1">订单</div>
                  <div v-else-if="scope.row.type == 2">开通主播</div>
                  <div v-else-if="scope.row.type == 3">店铺保证金</div>
                  <div v-else-if="scope.row.type == 4">椒点充值</div>
              </template>
          </el-table-column>
          <el-table-column label="支付类型">
              <template slot-scope="scope">
                  <div v-if="scope.row.pay_type == 1">支付宝</div>
                  <div v-else-if="scope.row.pay_type == 2">微信</div>
                  <div v-else-if="scope.row.pay_type == 3">余额</div>
                  <div v-else-if="scope.row.pay_type == 4">银行卡</div>
              </template>
          </el-table-column>
          <el-table-column label="状态">
              <template slot-scope="scope">
                  <div v-if="scope.row.status == 1">收入</div>
                  <div v-else-if="scope.row.status == 2">支出</div>
              </template>
          </el-table-column>
          <el-table-column
            prop="money"
            label="金额"
            
          ></el-table-column>
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
import { flowing_water_list } from "../../utils/axios";
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
      activeName: "",
      options: [
        {
          value: 1,
          label: "订单",
        },
        {
          value: 2,
          label: "开通主播",
        },
        {
          value: 3,
          label: "店铺保证金",
        },
        {
          value: 4,
          label: "椒点充值",
        },
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
      live_id: "",
      anchor_id: "",
      keywords: "",
      time_value: "",
      height:"",
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
      loading: false,
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
    //tab切换
    handleClick(tab, event) {
      let that = this;
      let status = "";
      // if (tab.name == "first") {
      //   status = 0; //全部
      // } else if (tab.name == "second") {
      //   status = 1; //待付款
      // } else if (tab.name == "third") {
      //   status = 2; //待发货
      // } else if (tab.name == "fourth") {
      //   status = 3; //待收货
      // } else if (tab.name == "eight") {
      //   status = 7; //待完成
      // } else if (tab.name == "six") {
      //   status = 4; //交易完成
      // } else if (tab.name == "seven") {
      //   status = 5; //已取消
      // }
      // //  else if (tab.name == 'five') {
      // //   status = 6//已收货
      // // }
      that.live_id = tab.name
      that.loading = true;
      var time1 = "";
      var time2 = "";
      console.log(this.time_value)
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      console.log(time1)
      console.log(time2)
      let request_form = {
        page: 1,
        page_size: 20,
        pay_type: that.anchor_id,
        type: that.live_id,
        keywords: that.keywords,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      flowing_water_list(request_form)
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
    //导出
    async user_derive_excel1(){
      let that = this;
      
      var time1 = "";
      var time2 = "";
      console.log(this.time_value)
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        pay_type: that.anchor_id,
        type: that.live_id,
        keywords: that.keywords,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      flowing_water_list(request_form)
      .then((res) => {
        that.loading = false;
        if (res.data.err_code == 0) {
          if(res.data.err_msg.list.length == 0){
            that.$message({
              showClose: true,
              message: "暂无数据",
              type: "error",
            });
          }else{
            window.open(publicFile.address + "/new_admin.php?c=finance&a=flowing_water_derive_excel&pay_type="+ that.anchor_id 
            +"&type="+ that.live_id +"&keywords="+ that.keywords 
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
        that.live_id == "" &&
        that.keywords === "" &&
        that.time_value == ""
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
      console.log(this.time_value)
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      console.log(time1)
      console.log(time2)
      let request_form = {
        page: 1,
        page_size: 20,
        pay_type: that.anchor_id,
        type: that.live_id,
        keywords: that.keywords,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      flowing_water_list(request_form)
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

      flowing_water_list({
        page: page,
        page_size: number,
        pay_type: that.anchor_id,
        type: that.live_id,
        keywords: that.keywords,
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
      this.keywords = "";
      this.time_value = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
        type:this.live_id
      };
      flowing_water_list(request_form)
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
