<template>
  <div class="page">
    <div v-if="activeName == 'first'">
      <div class="seach">
        
        <div class="el-inpu inlineBlock">
          
        </div>
      </div>
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="anchor_id"
            type="number"
            @keyup.enter.native="pick_seach"
            placeholder="请输入主播id"
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
          <el-select
            v-model="pick_condition"
            class="el-inpu"
            placeholder="请选择审核状态"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="nickname"
            placeholder="请输入主播昵称"
            clearable
            @keyup.enter.native="pick_seach"
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
            >刷新</el-button
          >
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
            <el-table-column label="序号" type="index" width="50">
              </el-table-column>
            <el-table-column
              prop="phone"
              label="主播手机号"
              width="120"
            ></el-table-column>

            <el-table-column
              prop="staffuid"
              label="主播id"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="nickname"
              label="主播名称"
              width="120"
            ></el-table-column>
            <el-table-column label="主播头像">
              <template slot-scope="scope">
                <el-image :src="scope.row.avatar" style="max-width:80px;max-height:80px" :preview-src-list="[scope.row.avatar]" fit="cover"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="follow_num" label="粉丝数量" width="80">
            </el-table-column>
            <el-table-column
              prop="video_count"
              label="直播次数"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="like_sum"
              label="点赞总数"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="like_real_sum"
              label="真实点赞数"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="view_sum"
              label="观看总数"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="view_real_sum"
              label="真实观看人数"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="admin_count"
              label="管理员总数"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="turnover"
              label="成交数量"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="pay_money"
              label="支付金额"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="live_earnings"
              label="直播收益"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="jd_earnings"
              label="椒点收入"
              width="80"
            ></el-table-column>

            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="enable(scope.$index, scope.row)"
                  v-show="scope.row.isdel == 1"
                  >启用</el-button
                >
                <el-button
                  size="mini"
                  type="warning"
                  style="margin-top:10px"
                  v-show="scope.row.isdel == 0"
                  @click="stop_useing(scope.$index, scope.row)"
                  >停用</el-button
                >
                <el-button
                  size="mini"
                  
                  type="success"
                  @click="handleClick(scope.row.staffuid)"
                  style="margin-top: 10px"
                  >主播管理员</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="broadListClick(scope.row.staffuid)"
                  style="margin-top: 10px"
                  >直播列表</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="rewardListClick(scope.row.staffuid)"
                  style="margin-top: 10px"
                  >打赏列表</el-button
                >
              </template>
            </el-table-column>
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
    <div v-else-if="activeName == 'second'">
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="anchor_id1"
            @keyup.enter.native="pick_seach1"
            type="number"
            placeholder="请输入主播id"
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach1">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="fn2(1)"
            >刷新</el-button
          >
          <el-button type="primary" @click="activeName = 'first'"
            >返回</el-button
          >
        </div>
      </div>
      <!-- 主播管理员列表开始 -->
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="extendList1"
            border
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="250">
            </el-table-column>
            <el-table-column
              prop="anchor_admin_id"
              label="管理员id"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="nickname"
              label="管理员名称"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="addtime"
              label="添加时间"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="phone"
              label="管理员手机号"
              width="200"
            ></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="delete1(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <!-- <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24" class="goodsindex-page-box">
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="queryInfo1.page"
              :page-sizes="[5, 10, 20, 30, 50]"
              :page-size="queryInfo1.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="queryInfo1.total"
            >
            </el-pagination>
          </el-col>
        </el-row> -->
    </div>
  </div>
</template>

<script>
import {
  anchor_list,
  anchor_board,
  anchor_admin_list,
  anchor_admin_board,
} from "../../utils/axios";
export default {
  data() {
    return {
      broadId: "",
      activeName: "first",
      extendList: [], //主播列表
      extendList1: [], //主播管理员列表
      fn1: this.commonJs.Debounce(this.get_agent_list),
      fn2: this.commonJs.Debounce(this.get_agent_list1),
      options: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "启用",
        },
        {
          value: 2,
          label: "禁用",
        },
      ],
      queryInfo: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      pageSize:"",
      queryInfo1: {
        page: 1,
        pageSize: 20,
        total: 1,
      },

      pick_condition: "",
      //申請人姓名
      nickname: "",
      anchor_id: "",
      anchor_id1: "",
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
    };
  },
  created() {
    this.get_agent_list();
    this.height = document.body.clientHeight - 250
  },
  methods: {
    //tab切换 点击查看主播管理员列表
    handleClick(id) {
      console.log(id);
      this.broadId = id;
      this.activeName = "second";
      //点击查看
      this.get_agent_list1();
    },
    //点击直播列表
    broadListClick(id) {
      this.$router.push({path:'/broadcast/anchor',query:{ids:id}})
    },
    //点击打赏列表
    rewardListClick(id) {
      this.$router.push({path:'/broadcast/reward',query:{ids:id}})
    },
    //搜索
    pick_seach(index) {
      let that = this;
      if (
        that.anchor_id == "" &&
        that.nickname == "" &&
        that.pick_condition === "" &&
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
        anchor_id: that.anchor_id,
        nickname: that.nickname,
        status: that.pick_condition,
        start_time: time1,
        end_time: time2,
      };
      
      //搜索
      anchor_list(request_form)
      .then((res) => {
        that.loading = false;
        if (res.data.err_code == 0) {
          this.extendList = res.data.err_msg.list;
          this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
          this.queryInfo.page = parseInt(res.data.err_msg.page);
          this.queryInfo.total = parseInt(res.data.err_msg.total_number);
          this.pageSize = res.data.err_msg.page_size
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
    pick_seach1() {
      let that = this;
      if (that.anchor_id1 == "") {
        that.$message({
          message: "请选择主播id",
          type: "warning",
        });
        return;
      }
      that.loading = true;

      let request_form = {
        page: 1,
        page_size: 20,
        anchor_id: that.anchor_id1,
      };
      anchor_admin_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            this.extendList1 = res.data.err_msg.list;

            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
            this.pageSize = res.data.err_msg.page_size
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
    //每页显示条数改变
    handleSizeChange1(val) {
      this.get_shop_list_page1(1, val);
    },

    //当前页
    handleCurrentChange1(val) {
      this.get_shop_list_page1(val, this.queryInfo.pageSize);
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

      anchor_list({
        page: page,
        page_size: number,
        anchor_id: that.anchor_id,
        nickname: that.nickname,
        pick_condition: that.pick_condition,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
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
      this.nickname = "";
      this.pick_condition = "";
      this.time_value = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      anchor_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
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

    //分页
    get_shop_list_page1(page, number) {
      let that = this;
      that.loading = true;
      anchor_admin_list({
        page: page,
        page_size: number,
        anchor_id: that.anchor_id1,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            this.extendList1 = res.data.err_msg.list;

            // this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            // this.queryInfo1.page = parseInt(res.data.err_msg.page);
            // this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
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
    get_agent_list1(index) {
      let request_form = {
        anchor_id: this.broadId,
        page: 1,
        page_size: 20,
      };
      anchor_admin_list(request_form)
        .then((res) => {
          let that = this;
          console.log(res);
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.addtime = this.commonJs.timestampToTime(element.addtime);
            });
            this.extendList1 = res.data.err_msg.list;

            // this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            // this.queryInfo1.page = parseInt(res.data.err_msg.page);
            // this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
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
          this.loading = false;
          console.log(error);
        });
    },
    //启用操作
    enable(index, row) {
      let that = this;
      this.$confirm(
        "此操作将启用" + row.nickname + "的主播账号, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          anchor_board({
            anchor_id: row.staffuid,
            is_del: 0,
          })
            .then((res_s) => {
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "启用成功",
                  type: "success",
                });

                this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    //停用操作
    stop_useing(index, row) {
      let that = this;
      this.$confirm(
        "此操作将禁用" + row.nickname + "的主播账号, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          anchor_board({
            anchor_id: row.staffuid,
            is_del: 1,
          })
            .then((res_s) => {
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "禁用成功",
                  type: "success",
                });
                this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    //删除操作
    delete() {},
    //删除操作
    delete1(index, row) {
      //主播id
      // this.broadId
      let that = this;
      this.$confirm(
        "此操作将删除" + row.nickname + "主播管理员账号,是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        anchor_admin_board({
          anchor_id: this.broadId,
          anchor_admin_id: row.anchor_admin_id,
        }).then((res_s) => {
          if (res_s.data.err_code == 0) {
            that.$message({
              message: "删除成功",
              type: "success",
            });
            that.get_agent_list1();
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        });
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
  display: flex;
  /deep/ .el-input {
    width: 200px;
    margin: 0 20px 0 10px;
  }
}
.seach_copy {
  margin-bottom: 20px;
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
  padding-top:30px;
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
