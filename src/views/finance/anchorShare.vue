<template>
  <div class="page">
    <div class="seach">
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="keywords"
            placeholder="请输入申请人昵称"
            clearable
             @keyup.enter.native="pick_seach"
          ></el-input>
          <el-date-picker
            :clearable="false"
            v-model="time_value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-input
            v-model="live_id"
             @keyup.enter.native="pick_seach"
            placeholder="请输入邀请人昵称"
            clearable
          ></el-input>
          <el-input
            v-model="anchor_id"
            type="number"
             @keyup.enter.native="pick_seach"
            placeholder="请输入订单号"
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
            >刷新</el-button
          >
        </div>
      </div>
    </div>
    <!-- 主播列表开始 -->
    <el-row :gutter="20" class="goodsindex-list">
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
            prop="order_no"
            label="订单号"
            
          ></el-table-column>
          <el-table-column
            prop="edit_time"
            label="审核时间"
            
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
            prop="invite_nickname"
            label="邀请人昵称"
            
          ></el-table-column>
          <el-table-column
            prop="invite_phone"
            label="邀请人账号"
          ></el-table-column>
          <el-table-column
            prop="invite_uid"
            label="邀请人id"
          ></el-table-column>
          <el-table-column
            prop="apply_uid"
            label="申请人id"
            
          ></el-table-column>
          
          <el-table-column
            prop="update_price"
            label="申请金额"
          ></el-table-column>
          <el-table-column
            prop="fx_profit"
            label="分润"
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
import { anchor_profit_list } from "../../utils/axios";
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
      //申請人姓名
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
    // if (this.$route.query.ids) {
    //   this.anchor_id = this.$route.query.ids;
    //   this.pick_seach();
    // } else {
      this.get_agent_list();
    // }
    this.height = document.body.clientHeight - 240
  },
  methods: {
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
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        order_no: that.anchor_id,
        invite_nickname: that.live_id,
        nickname: that.keywords,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      anchor_profit_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.reward_time = this.commonJs.timestampToTime(
                item.reward_time
              );
              item.add_time = this.commonJs.timestampToTime(item.add_time);
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

      anchor_profit_list({
        page: page,
        page_size: number,
        order_no: that.anchor_id,
        invite_nickname: that.live_id,
        nickname: that.keywords,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.reward_time = this.commonJs.timestampToTime(
                item.reward_time
              );
              item.add_time = this.commonJs.timestampToTime(item.add_time);
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
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      anchor_profit_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.reward_time = this.commonJs.timestampToTime(
                item.reward_time
              );
              item.add_time = this.commonJs.timestampToTime(item.add_time);
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
  padding: 15px 15px 0;
}
.seach {
  /deep/ .el-input {
    width: 200px;
    margin: 0 20px 0 10px;
  }
}
.seach_copy {
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
