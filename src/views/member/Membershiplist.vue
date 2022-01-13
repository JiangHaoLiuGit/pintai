<template>
  <div class="goodsindex" style="padding-top:20px;">
    <el-row type="flex" class="row-bg" justify="end" style="margin-bottom:20px;">
      <el-button type="primary" icon="el-icon-plus" @click="add_member"></el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
    </el-row>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="menberList"
          :header-cell-style="{textAlign: 'center'}"
          :cell-style="{ textAlign: 'center' }"
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
            label="加入时间" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="last_time" 
            label="最后登录" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="account" 
            label="账号" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="realname" 
            label="姓名" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="id" 
            label="ID" 
            width="80"
          >
          </el-table-column>
          
          
          <el-table-column 
            prop="phone" 
            label="手机号" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="email" 
            label="邮箱" 
          >
          </el-table-column>
          
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="powerEdit(scope.$index, scope.row)"
                >权限管理</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="enable(scope.$index, scope.row)"
                v-show="scope.row.status == 2"
                >启用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-show="scope.row.status == 1"
                @click="stop_useing(scope.$index, scope.row)"
                >停用</el-button
              >
              <!-- 测试功能 -->
              <!-- <el-button
                size="mini"
                type="danger"
                @click="delete_member(scope.$index, scope.row)"
                >删除</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 增加会员弹窗 -->
    <el-dialog :title="title" :visible.sync="add_member_ifShow">
      <el-form :model="form_add">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form_add.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form_add.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form_add.phone" autocomplete="off" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input v-model="form_add.realname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input v-model="form_add.pwd" autocomplete="off" show-password maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="是否客服：" prop="is_kf">
          <el-radio v-model="form_add.is_kf" label="1">客服人员</el-radio>
          <el-radio v-model="form_add.is_kf" label="0">非客服</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_member_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_add" v-show="if_add">添加</el-button>
        <el-button type="primary" @click="submit_save" v-show="!if_add">保存</el-button>
      </div>
    </el-dialog>

    <!-- 会员编辑弹窗 -->
    <el-dialog :title="title_copy" :visible.sync="power_edit_ifShow">
      <div v-loading="tree_loading">
        <!-- @check-change = "pickTree" -->
        <el-button type="primary" size='mini' @click="tree_click" style="margin-bottom:10px;">全选</el-button>
         <el-tree
          :data="tree_data"
          show-checkbox
          node-key="id"
          ref="tree"
          @check="dian"
          :default-expanded-keys="default_key"
          :default-checked-keys="default_chexked_key"
          :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="power_edit_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="power_edit_save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { admin_list , admin_add , admin_edit , admin_edit_info , change_status , del_admin} from "../../utils/axios";
export default {
  data() {
    return {
      menberList: [], //会员列表
      loading : false,
      formLabelWidth: "120px",
      fn1: this.commonJs.Debounce(this.get_admin_list),
      add_member_ifShow : false,
      power_edit_ifShow : false,
      form_add: {
        account: "",
        email: "",
        phone: "",
        realname: "",
        pwd: "",
        is_kf:"0"
      },
      title : '添加会员',
      title_copy : '权限配置',
      if_add : true,
      O_message : {},
      tree_data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      permissionIds : [],//选中的节点
      default_key : [], //节点树默认展开
      default_chexked_key : [], //默认权限
      copy_pwd:'',
      tree_loading : false,
      height:"",
      tree_blean:true
    };
  },

  created() {
    this.get_admin_list(); //获取会员列表
    this.height = document.body.clientHeight - 160
  },

  methods: {
    //权限全选
    tree_click(){
      if(this.tree_blean){
        let arr = []
        this.tree_data.forEach(item => {
          arr.push(item.id)
        })
        this.$refs.tree.setCheckedKeys(arr);
        this.tree_blean = false
      }else{
        this.$refs.tree.setCheckedKeys([]);
        this.tree_blean = true
      }
      
    },
    //获取会员列表
    get_admin_list (index) {
      let that = this
      that.loading = true
      admin_list()
        .then((res) => {
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.last_time = that.commonJs.timestampToTime (element.last_time)
              element.create_time = that.commonJs.timestampToTime (element.create_time)
            });
            that.menberList = res.data.err_msg.list
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

    //新增会员
    add_member () {
      this.form_add.account = '' 
      this.form_add.email = '' 
      this.form_add.phone = '' 
      this.form_add.realname = '' 
      this.form_add.pwd = ''
      this.title = '添加会员'
      this.if_add = true
      this.add_member_ifShow = true
    },

    //会员增加
    submit_add () {
      let that = this
      var flag = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
      ) //特殊字符
      //11位手机号码正则
      var reg_tel = new RegExp(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ )
      //邮箱正则
      var test_email = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
      if(that.form_add.account == '' || that.form_add.email == '' || 
         that.form_add.phone == '' || that.form_add.realname == '' || 
         that.form_add.pwd == ''
      ) {
        that.$message({
          message: '请将信息填写完整',
          type: 'warning'
        });
      } else if (flag.test(that.form_add.account)) {
        that.$message({
          message: '昵称不能包含特殊字符',
          type: 'warning'
        });
      } else if (!test_email.test(that.form_add.email)) {
        that.$message({
          message: '请填写正确的邮箱',
          type: 'warning'
        });
      } else if (!reg_tel.test(that.form_add.phone)) {
        that.$message({
          message: '请填写正确的手机号',
          type: 'warning'
        });
      }  else if (flag.test(that.form_add.realname)) {
        that.$message({
          message: '真实姓名不能包含特殊字符',
          type: 'warning'
        });
      } else if (flag.test(that.form_add.pwd)) {
        that.$message({
          message: '密码不能包含特殊字符',
          type: 'warning'
        });
      } else if (that.form_add.pwd.length < 9 || that.form_add.pwd.length > 40) {
        that.$message({
          message: '密码长度大于9小于40位',
          type: 'warning'
        });
      } else {
        admin_add(that.form_add)
          .then((res) => {
            if (res.data.err_code == 0) {
              that.add_member_ifShow = false
              that.$message({
                message: '添加成功',
                type: 'success'
              });
              that.get_admin_list();
            } else {
              that.add_member_ifShow = false
              that.$message({
                showClose: true,
                message: res.data.err_msg,
                type: 'error'
              });
            }
          })
          .catch((error) => {
            that.add_member_ifShow = false
            console.log(error);
          });
      }
    },

    //编辑
    handleEdit(index, row) {
      this.title = '会员编辑 (账号:' + row.account + ')'
      this.if_add = false
      this.form_add.account = row.account
      this.form_add.email = row.email
      this.form_add.phone = row.phone
      this.form_add.realname = row.realname
      this.form_add.pwd = row.pwd
      this.form_add.is_kf = row.is_kf
      this.copy_pwd = row.pwd
      this.add_member_ifShow = true
      console.log(index, row);
      this.O_message = row
    },

    //会员修改
    submit_save () {
      let that = this
      var flag = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
      ) //特殊字符
      var reg_tel = new RegExp(
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      )  //11位手机号码正则
      var test_email = new RegExp(
        /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      ) //邮箱正则
      if(that.form_add.account == '' || that.form_add.email == '' || 
         that.form_add.phone == '' || that.form_add.realname == '' || 
         that.form_add.pwd == ''
      ) {
        that.$message({
          message: '请将信息填写完整',
          type: 'warning'
        });
      }  else if (flag.test(that.form_add.account)) {
        that.$message({
          message: '昵称不能包含特殊字符',
          type: 'warning'
        });
      } else if (!test_email.test(that.form_add.email)) {
        that.$message({
          message: '请填写正确的邮箱',
          type: 'warning'
        });
      } else if (!reg_tel.test(that.form_add.phone)) {
        that.$message({
          message: '请填写正确的手机号',
          type: 'warning'
        });
      }  else if (flag.test(that.form_add.realname)) {
        that.$message({
          message: '真实姓名不能包含特殊字符',
          type: 'warning'
        });
      } else if (flag.test(that.form_add.pwd)) {
        that.$message({
          message: '密码不能包含特殊字符',
          type: 'warning'
        });
      } else if (that.form_add.pwd.length < 9 || that.form_add.pwd.length > 40) {
        that.$message({
          message: '密码长度大于9小于40位',
          type: 'warning'
        });
      } else {
        console.log(that.O_message)
        admin_edit_info({
          admin_id : parseInt(that.O_message.id)
        })
          .then((res) => {
            if (res.data.err_code == 0) {
              let menu_id = ''
              res.data.err_msg.list.menu_list.forEach(item => {
                if(item.is_select == 1) {
                  console.log(menu_id)
                  if(menu_id) {
                     menu_id = menu_id + ',' + item.id 
                  } else {
                    menu_id = menu_id + item.id
                  }
                  item.value.forEach(s_item => {
                    if(s_item.is_select == 1) {
                      menu_id = menu_id + ',' + s_item.id
                    }
                  })
                }
              })
              console.log(menu_id)
              let pwd_bool = ''
              console.log(that.copy_pwd != that.form_add.pwd)
              if(that.copy_pwd != that.form_add.pwd) {
                pwd_bool = that.form_add.pwd
              }
              let request_form = {
                account : that.form_add.account,
                email : that.form_add.email,
                phone : that.form_add.phone,
                realname : that.form_add.realname,
                pwd : pwd_bool,
                admin_id	: parseInt(that.O_message.id),
                menu_id : menu_id,
                is_kf : that.form_add.is_kf,
              }

              admin_edit(request_form)
                .then((res_s) => {
                  console.log(res_s);
                  if (res_s.data.err_code == 0) {
                    that.add_member_ifShow = false
                    that.$message({
                      message: '编辑成功',
                      type: 'success'
                    });
                    that.get_admin_list();
                  } else {
                    that.add_member_ifShow = false
                    that.$message({
                      showClose: true,
                      message: res_s.data.err_msg,
                      type: 'error'
                    });
                  }
                })
                .catch((error) => {
                  that.add_member_ifShow = false
                  console.log(error);
                });
            } else {
              that.add_member_ifShow = false
              that.$message({
                showClose: true,
                message: res.data.err_msg,
                type: 'error'
              });
            }
          })
          .catch((error) => {
            that.add_member_ifShow = false
            console.log(error);
          });
      }
    },

    //权限编辑
    powerEdit (index , row) {
      this.O_message = row
      let that = this
      this.title_copy = '权限配置 (账号:' + row.account + ')'
      this.power_edit_ifShow = true
      that.tree_loading = true
      that.default_key = []
      that.default_chexked_key = []
      admin_edit_info({
        admin_id : parseInt(row.id)
      })
        .then((res) => {
          if (res.data.err_code == 0) {
            let menu_id = ''
            let arr = res.data.err_msg.list.menu_list
            arr.forEach(item => {
              //获取权限列表id
              if(item.is_select == 1) {
                that.default_key.push(item.id)
                if(menu_id) {
                    menu_id = menu_id + ',' + item.id 
                } else {
                  menu_id = menu_id + item.id
                }
                item.value.forEach(s_item => {
                  if(s_item.is_select == 1) {
                    that.default_chexked_key.push(s_item.id)
                    menu_id = menu_id + ',' + s_item.id
                  }
                })
              }
              //整理菜单栏
              item.label = item.name
              item.children = item.value
              item.children.forEach(u_item => {
                u_item.label = u_item.name
              })
            })
            console.log(arr)
            that.tree_data = arr
            that.permissionIds = menu_id
            that.tree_loading = false
          } else {
            // that.add_member_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          // that.add_member_ifShow = false
          console.log(error);
        });
    },
    dian(one,two,three){
      console.log(one)
      console.log(two)
      console.log(three)
      
      let that = this
      let res = this.$refs.tree.getCheckedNodes()
      // console.log(res)
      let arr = []
      // that.tree_loading = true
      // //获取改变之后的权限id组合
      res.forEach((item) => {
        arr.push(item.id)
      })
      arr.push(two.halfCheckedKeys[two.halfCheckedKeys.length-1])
      let menuArr = arr; // 去除重复的节点
      this.permissionIds = menuArr.join(',')
    },
    //选择菜单
    pickTree (data, checked, indeterminate) {
      // console.log(checked)
      // console.log(indeterminate)
      let that = this
      let res = this.$refs.tree.getCheckedNodes()
      // console.log(res)
      let arr = []
      // that.tree_loading = true
      // //获取改变之后的权限id组合
      res.forEach((item) => {
        arr.push(item.id)
      })
      // //然后和之前的权限树做对比
      // that.tree_data.forEach(item => { //获取父级id
      //   item.children.forEach(s_item => {
      //     // arr.forEach(t_item => {
      //       if(data.id == s_item.id) {
      //         console.log(s_item.name)
      //       }
      //     // })
      //   })
      // })
      //this.unique(arr)
      let menuArr = arr; // 去除重复的节点
      this.permissionIds = menuArr.join(',')
      // that.tree_loading = false
      // console.log(this.permissionIds)
    },

    // 数组去重
    unique (arr) {
      let newArr = []
      let len = arr.length
      for (let i = 0; i < len; i++) {
        if (newArr.indexOf(arr[i]) == -1) {
          newArr.push(arr[i])
        }
      }
      return newArr
    },

    //会员编辑确认保存
    power_edit_save () {
      let that = this
      let request_form = {
        account : that.O_message.account,
        email : that.O_message.email,
        phone : that.O_message.phone,
        realname : that.O_message.realname,
        pwd : '',
        admin_id	: parseInt(that.O_message.id),
        menu_id : that.permissionIds
      }
      admin_edit(request_form)
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.power_edit_ifShow = false
            that.$message({
              message: '编辑成功',
              type: 'success'
            });
            that.get_admin_list();
          } else {
            that.power_edit_ifShow = false
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.power_edit_ifShow = false
          console.log(error);
        });
    },

    //启用
    enable (index , row) {
      let that = this
      that.$confirm('此操作可使'+ row.account + '用户拥有登录权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        change_status({
          id: row.id,
          status : 1
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '启用成功',
                type: 'success'
              });
              that.get_admin_list();
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
          return;    
      });
    },

    //停用
    stop_useing (index , row) {
      let that = this
      that.$confirm('此操作可使'+ row.account + '用户失去登录权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        change_status({
          id: row.id,
          status : 2
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '停用成功',
                type: 'success'
              });
              that.get_admin_list();
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

    //删除会员
    delete_member (index , row) {
      let that = this
      del_admin({
        id: row.id
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.$message({
              message: '删除成功',
              type: 'success'
            });
            that.get_admin_list();
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

/deep/ .el-dialog {
  width: 508px !important;
}

/deep/ .el-dialog__body {
  height: 320px !important;
  overflow-y: auto;
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
  padding: 10px 15px 30px;
}
</style>