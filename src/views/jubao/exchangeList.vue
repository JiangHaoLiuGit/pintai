<template>
  <div class="goodsindex">
    <div class="seach_num">
      <div>
        用户累计消耗橘宝数 : {{sum}}
      </div>
      <div>
        累计发放金额 : {{price}}
      </div>
    </div>
    <div class="seach_copy">
      <div class="seach_select">
        <el-select v-model="pick_condition" placeholder="请选择业务类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="statusValue" placeholder="请选择中奖状态">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
        <el-input v-model="pick_value" placeholder="请输入昵称或手机号" @keyup.enter.native="pick_seach"></el-input>
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
          :data="priceRecordList"
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
            prop="create_time" 
            width="160"
            label="时间" 
          >
          </el-table-column>
          <el-table-column 
            prop="nickname" 
            label="昵称" 
            width="150"
          >
          </el-table-column>
          <el-table-column 
            prop="phone" 
            label="手机号" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="id" 
            label="记录ID" 
            width="100"
          >
          </el-table-column>
          <el-table-column 
            prop="user_id" 
            label="用户ID" 
            width="100"
          >
          </el-table-column>
          
          <el-table-column 
            prop="game_type" 
            label="业务" 
            width="150"
          >
          </el-table-column>
           <el-table-column 
            prop="score" 
            label="消耗橘宝" 
          >
          </el-table-column>
          <el-table-column 
            prop="is_prize" 
            label="是否中奖" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="prize_money" 
            label="余额变更(元)" 
            width="150"
          >
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
import { price_record_list_jvbao , change_status_jvbao , change_level } from "../../utils/axios";
export default {
  data() {
    return {
      priceRecordList: [], //兑奖列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_price_record_list),
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      options: [{
        value: '1',
        label: '转盘'
      }, {
        value: '2',
        label: '翻盘'
      }],
      statusList: [
      { 
        value: '1',
        label: '中奖'
      },{
        value: '2',
        label: '未中奖'
      }],
      pick_condition: '',
      pick_value : '',
      pageSize : 20,
      statusValue :'',
      time_value : '',
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
      sum : 0,
      price : 0,
      height:"",
    };
  },

  created() {
    this.get_price_record_list(); //获取兑奖列表
    this.height = document.body.clientHeight - 270
  },

  methods: {

    //获取兑奖列表
    get_price_record_list (index) {
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
      price_record_list_jvbao(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.priceRecordList = res.data.err_msg.list
            that.sum = res.data.err_msg.sum
            that.price = res.data.err_msg.price
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
      price_record_list_jvbao(
        {
          page : page,
          page_size: number,
          price : this.statusValue,
          nickname : this.pick_value,
          start_time : this.time_value[0],
          end_time : this.time_value[1],
          game : this.pick_condition,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.sum = res.data.err_msg.sum
            that.price = res.data.err_msg.price
            that.priceRecordList = res.data.err_msg.list
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
      price_record_list_jvbao(
        {
          page : 1,
          page_size: this.pageSize,
          price : this.statusValue,
          nickname : this.pick_value,
          start_time : this.time_value[0],
          end_time : this.time_value[1],
          game : this.pick_condition,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.sum = res.data.err_msg.sum
            that.price = res.data.err_msg.price
            that.priceRecordList = res.data.err_msg.list
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
              that.get_price_record_list();
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
              that.get_price_record_list();
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

    //查看
    see (index , row) {
      let that = this
      that.loading = true
      this.pick_condition = ''
      this.pick_value = ''
      this.statusValue = ''
      this.time_value = ''
      price_record_list_jvbao({
        page : 1,
        page_size: this.pageSize,
        uid : row.uid,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.loading = false
            that.sum = res.data.err_msg.sum
            that.price = res.data.err_msg.price
            that.priceRecordList = res_s.data.err_msg.list
            console.log(that.priceRecordList)
            that.queryInfo.pageSize = parseInt(res_s.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res_s.data.err_msg.page)
            that.queryInfo.total = parseInt(res_s.data.err_msg.total_number)
            that.pageSize = res_s.data.err_msg.page_size
          } else {
            that.loading = false
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.loading = false
          console.log(error);
        });
    },

    //修改等级
    modify (index , row) {
      let that = this
      that.form_X.level = ''
      this.title = '修改等级 (账号:' + row.nickname + ')'
      that.opening_change_ifShow = true
      that.O_message = row
    },

    submit_saveChanges_level () {
      let that = this
      if(that.form_X.level == '') {
        that.$message({
          message: '请选择等级',
          type: 'warning'
        });
        return;
      }
      change_level(
        {
          level : that.form_X.level,//等级选择(1专员 2经理 3总监)
          uid : that.O_message.uid,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.opening_change_ifShow = false
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            that.get_price_record_list(); //获取推广列表
          } else {
            that.opening_change_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.opening_change_ifShow = false
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