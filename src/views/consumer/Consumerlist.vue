<template>
  <div class="goodsindex">
    <div class="seach_message">
      <div class="seach_select">
        <el-select v-model="pick_condition" placeholder="请选择搜索条件">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="pick_value" placeholder="请输入搜索内容" @keyup.enter.native="pick_seach"></el-input>
      </div>
      <div class="seach_button">
        <el-button type="primary" @click="pick_seach">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
      </div>
    </div>
    <div
    >

    </div>

    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="consumerList"
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
            prop="reg_time" 
            label="注册时间" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="phone" 
            label="手机号" 
            width="110"
          >
          </el-table-column>
          <el-table-column 
            prop="nickname" 
            label="昵称" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="uid" 
            label="ID" 
            width="70"
          >
          </el-table-column>
          <el-table-column 
            prop="is_weixin" 
            label="微信绑定" 
            width="80"
          >
          </el-table-column>
          <el-table-column label="主播" width="80">
            <template slot-scope="scope">
              {{scope.row.status== 1 ? '是' : '否'}}
            </template>
          </el-table-column>
          <el-table-column 
            prop="is_authentication" 
            label="实名认证" 
            width="80"
          >
          </el-table-column>
          <el-table-column 
            prop="coin_total" 
            label="椒点" 
            width="100"
          >
          </el-table-column>
          <el-table-column 
            prop="cash" 
            label="余额" 
            width="100"
          >
          </el-table-column>
          <el-table-column 
            prop="stores" 
            label="店铺" 
            width="80"
          >
          </el-table-column>
          
          <el-table-column 
            prop="agent_num" 
            label="代理" 
            width="80"
          >
          </el-table-column>
          <el-table-column 
            prop="level_name" 
            label="推广" 
          >
          </el-table-column>
          
          
           
          <el-table-column label="操作"  width="260">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleDetails(scope.$index, scope.row)"
                >详情</el-button
              >
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
              <el-button
                size="mini"
                type="warning"
                @click="handleEdit(scope.$index, scope.row)"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 修改密码弹窗 -->
    <el-dialog :title="title" :visible.sync="usePassword_change_ifShow">
      <el-form :model="form_add">
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form_add.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="usePassword_change_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_saveChanges_user">保存</el-button>
      </div>
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
import { user_list , save_pwd , detail , change_status_user} from "../../utils/axios";
export default {
  data() {
    return {
      consumerList: [], //会员列表
      loading : false,
      dialogFormVisible: false,
      formLabelWidth: "100px",
      fn1: this.commonJs.Debounce(this.get_consumer_list),
      usePassword_change_ifShow : false,
      add_saveMenu_ifShow : false,
      form_add: {
        password: "",
      },
      height:"",
      title : '修改密码',
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      father_menu : [],
      options: [
        {
          value: 'phone',
          label: '手机号'
        }, {
          value: 'nickname',
          label: '用户昵称'
        }, {
          value: 'id',
          label: '用户ID'
        }, {
          value: 'anchor',
          label: '主播'
        }, {
          value: 'stores',
          label: '店铺'
        }
      ],
      pick_condition: '',
      pick_value : '',
      pageSize : 0
    };
  },

  created() {
    this.get_consumer_list();
    this.height = document.body.clientHeight - 240
    console.log(this.height)
  },

  methods: {
    //获取用户列表
    get_consumer_list (index) {
      this.pick_condition = ''
      this.pick_value = ''
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      
      user_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.reg_time = that.commonJs.timestampToTime (element.reg_time)
            });
            that.consumerList = res.data.err_msg.list
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
            // that.queryInfo.total = 10
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
    get_consumer_list_page (page , number) {
      let that = this
      that.loading = true
      user_list(
        {
          page : page,
          page_size: number,
          search : this.pick_condition,
          keyword : this.pick_value
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.reg_time = that.commonJs.timestampToTime (element.reg_time)
            });
            that.consumerList = res.data.err_msg.list
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
            // that.queryInfo.total = 10
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
      this.get_consumer_list_page(1,val)
    },

    //当前页
    handleCurrentChange(val) {
      console.log(val)
      this.get_consumer_list_page(val,this.pageSize)
    },

    //搜索
    pick_seach () {
      let that = this
      console.log(this.pick_condition)
      if(this.pick_condition == ''){
        that.$message({
          message: '请选择搜索条件',
          type: 'warning'
        });
        return
      } else if (this.pick_value == '') {
        that.$message({
          message: '请填写搜索内容',
          type: 'warning'
        });
        return
      }
      that.loading = true
      user_list(
        {
          page : 1,
          page_size: this.pageSize,
          search : this.pick_condition,
          keyword : this.pick_value
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.reg_time = that.commonJs.timestampToTime (element.reg_time)
            });
            that.consumerList = res.data.err_msg.list
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

    //修改密码
    handleEdit(index, row) {
      let that = this
      this.form_add.password = ''
      this.O_message = row
      this.usePassword_change_ifShow = true
      this.title = '修改密码 (账号:' + row.nickname + ')'
      console.log(index, row);
    },

    //详情
    handleDetails (index,row) {
      let that = this
      detail({
        uid : row.uid,
      })
        .then((res) => {
          if (res.data.err_code == 0) {
            let arrList = ''
            let copy_list = ''
            let leg = false
            let leg_copy = false
            if(res.data.err_msg.store.length > 0) {
              leg = true
              res.data.err_msg.store.forEach(item => {
                arrList = arrList + item.name + '、'
              })
            }
            arrList = arrList.substring(0,arrList.length-1)
            if(res.data.err_msg.agent.length > 0) {
              leg_copy = true
              res.data.err_msg.agent.forEach(item => {
                copy_list = copy_list + item.province + " 、"
              })
            }
            copy_list = copy_list.substring(0,copy_list.length-1)
            if(leg == true && leg_copy == true ) {
              arrList = '店铺名称:' + arrList + '--------------------   代理区域:' + copy_list
            } else if (leg == true) {
              arrList = '店铺名称:' + arrList
            } else if (leg_copy == true ) {
              arrList = '代理区域:' + copy_list
            } else {
              arrList = '暂无详情数据'
            }
            
            this.$alert(arrList, '详情 (账号:' + row.nickname + ')', {
              confirmButtonText: '确定',
              callback: action => {
                
              }
            });
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

    //启用
    enable (index , row) {
      let that = this
      this.$confirm('此操作可使'+ row.nickname +'用户拥有登录权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        change_status_user({
          uid: row.uid,
          status : 1
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '启用成功',
                type: 'success'
              });
              this.get_consumer_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              // that.get_consumer_list();
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
      this.$confirm('此操作可使'+ row.nickname +'用户失去登录权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        change_status_user({
          uid: row.uid,
          status : 2
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '停用成功',
                type: 'success'
              });
              this.get_consumer_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              // that.get_consumer_list();
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

    //修改密码确认
    submit_saveChanges_user () {
      let that = this
      var flag = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
      ) //特殊字符
      if(that.form_add.password == '') {
        that.$message({
          message: '请将信息填写完整',
          type: 'warning'
        });
        return;
      } else if (flag.test(that.form_add.password)) {
        that.$message({
          message: '密码不能包含特殊字符',
          type: 'warning'
        });
        return;
      } else if (that.form_add.password.length < 9 || that.form_add.password.length > 40) {
        that.$message({
          message: '密码长度大于9小于40位',
          type: 'warning'
        });
        return;
      } 
      save_pwd({
        pwd : that.form_add.password,
        uid	: that.O_message.uid,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.usePassword_change_ifShow = false
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            // that.get_consumer_list();
            this.get_consumer_list_page(this.queryInfo.page,this.queryInfo.pageSize)
          } else {
            that.usePassword_change_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.usePassword_change_ifShow = false
          console.log(error);
        });
    }

  },
};
</script>

<style scoped lang='less'>

/deep/ .el-table td, .el-table th.is-leaf{
    border-top: 1px solid #717b90;
    border-bottom:0
}

/deep/ .el-table__body{
  border-bottom: 1px solid #EBEEF5;
}

/deep/ .el-dialog {
  width: 508px !important;
}

.goodsindex {
  width: 100%;
  min-height: 100%;
  padding: 0 15px 0;
  box-sizing: border-box;
}

.seach_message {
  display: flex;
  margin-bottom: 20px;
  padding-top: 20px;
  // margin-top: 20px;
  justify-content: space-between;
  .seach_select {
    display: flex;
    /deep/ .el-input {
      width:300px;
      margin: 0 10px;
    }
  }
  .seach_button {
    display: flex;
  }
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