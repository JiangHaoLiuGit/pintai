<template>
  <div class="goodsindex">
    <div class="seach_num">
      <div>
        当前参与用户数 : {{userNum}}
      </div>
      <div>
        当前冻结橘宝数 : {{frozenNum}}
      </div>
      <div>
        用户累计获利 : {{profit}}
      </div>
    </div>
    <div class="seach">
      
    </div>
    <div class="seach_copy">
      <div class="seach_select">
        <el-input v-model="pick_value" placeholder="请输入昵称或手机号" @keyup.enter.native="pick_seach"></el-input>
        <el-select v-model="pick_condition" placeholder="请选择种类">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="statusValue" placeholder="请选择状态">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        
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
          :data="jubaoList"
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
            prop="start_time" 
            label="开始时间"
            width="140"
          >
          </el-table-column>
           <el-table-column 
            prop="start_time" 
            label="结束时间" 
            width="140"
          >
          </el-table-column>
           <el-table-column 
            prop="end_time"
            label="预计结束时间" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="nickname" 
            label="昵称" 
          >
          </el-table-column>
          <el-table-column 
            prop="uid" 
            label="用户ID" 
          >
          </el-table-column>
          <el-table-column 
            prop="phone" 
            label="手机号" 
          >
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.state == 1 ? '进行中' : '已完成'}}
            </template>
          </el-table-column>
          <el-table-column 
            prop="name" 
            label="参与种类" 
          >
          </el-table-column>
           <el-table-column 
            prop="deposit" 
            label="投入橘宝" 
          >
          </el-table-column>
          <el-table-column 
            prop="profit" 
            label="获利" 
          >
          </el-table-column>
          <el-table-column 
            prop="watering_num" 
            label="累计浇水次数" 
          >
          </el-table-column>
           
           
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="enable(scope.$index, scope.row)"
                v-show="scope.row.is_open == 2"
                >启用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-show="scope.row.is_open == 1"
                @click="stop_useing(scope.$index, scope.row)"
                >停用</el-button
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
</template>

<script>
import { data_list_jvbao , change_status_jvbao  } from "../../utils/axios";
export default {
  data() {
    return {
      jubaoList: [], //橘宝数据列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_jubao_list),
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      options: [{
        value: '1',
        label: '第一种'
      }, {
        value: '2',
        label: '第二种'
      }, {
        value: '3',
        label: '第三种'
      }],
      statusList: [
      { 
        value: '1',
        label: '进行中'
      },{
        value: '2',
        label: '已结束'
      }],
      pick_condition: '',
      pick_value : '',
      pageSize : 20,
      statusValue :'',
      time_value : '',
      height:"",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      userNum : 0,
      frozenNum : 0,
      profit : 0
    };
  },

  created() {
    this.get_jubao_list(); //获取橘宝庄园数据列表
    this.height = document.body.clientHeight - 240
  },

  methods: {

    //获取橘宝庄园数据列表
    get_jubao_list (index) {
      this.pick_condition = ''
      this.pick_value = ''
      this.statusValue = ''
      this.time_value = ''
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      data_list_jvbao(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.start_time = that.commonJs.timestampToTime (element.start_time)
              element.end_time = that.commonJs.timestampToTime (element.end_time)
            });
            that.jubaoList = res.data.err_msg.list
            that.userNum = res.data.err_msg.cur_num
            that.frozenNum = res.data.err_msg.cur_unbalance
            that.profit = res.data.err_msg.total_profit
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

    //分页
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      data_list_jvbao(
        {
          page : page,
          page_size: number,
          status : this.statusValue,
          nickname : this.pick_value,
          start_time : this.time_value[0],
          end_time : this.time_value[1],
          type : this.pick_condition,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.start_time = that.commonJs.timestampToTime (element.start_time)
              element.end_time = that.commonJs.timestampToTime (element.end_time)
            });
            that.userNum = res.data.err_msg.cur_num
            that.frozenNum = res.data.err_msg.cur_unbalance
            that.profit = res.data.err_msg.total_profit
            that.jubaoList = res.data.err_msg.list
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
      if(that.pick_condition == '' && that.pick_value == '' && that.statusValue == '' && that.time_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      data_list_jvbao(
        {
          page : 1,
          page_size: this.pageSize,
          status : this.statusValue,
          nickname : this.pick_value,
          start_time : this.time_value[0],
          end_time : this.time_value[1],
          type : this.pick_condition,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.start_time = that.commonJs.timestampToTime (element.start_time)
              element.end_time = that.commonJs.timestampToTime (element.end_time)
            });
            that.userNum = res.data.err_msg.cur_num
            that.frozenNum = res.data.err_msg.cur_unbalance
            that.profit = res.data.err_msg.total_profit
            that.jubaoList = res.data.err_msg.list
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

     //启用
    enable (index , row) {
      let that = this
      this.$confirm('此操作将启用' + row.nickname + '用户的推广权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        change_status_jvbao({
          id: row.id,
          status : 2,
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '启用成功',
                type: 'success'
              });
              // that.get_jubao_list();
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
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
      }).catch(() => {
                 
      });
    },

    //停用
    stop_useing (index , row) {
      let that = this
      this.$confirm('此操作将禁用' + row.nickname + '用户的推广权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        change_status_jvbao({
          id: row.id,
          status : 1,
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '停用成功',
                type: 'success'
              });
              // that.get_jubao_list();
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
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
      }).catch(() => {
                 
      });
    },

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
  width: 508px !important;
}

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
  }
}

.seach_num {
  display: flex;
  margin-left: 10px;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 700;
  div {
    margin-right: 20px;
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