<template>
  <div class="goodsindex">
    <el-row type="flex" class="row-bg" justify="end" style="margin-bottom:20px;margin-top:20px">
      <el-button type="primary" icon="el-icon-plus" @click="add_menu"></el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
    </el-row>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="menberList"
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
            label="创建时间" 
            width="160"
          >
          </el-table-column>
          <el-table-column 
            prop="update_time" 
            label="更新时间" 
            width="160"
          >
          </el-table-column>
          <el-table-column 
            prop="id" 
            label="ID" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="name" 
            label="名称" 
            width="120"
          >
          </el-table-column>
          <el-table-column label="ICON" width="160">
            <template slot-scope="scope" >
              <span :class="scope.row.icon"></span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="parent_id" 
            label="父级ID" 
            width="80"
          >
          </el-table-column>
          <el-table-column 
            prop="parent_name" 
            label="父级名称" 
          >
          </el-table-column>
          <el-table-column 
            prop="sort" 
            label="权重" 
            width="80"
          >
          </el-table-column>
          
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                >修改</el-button
              >
              <!-- 测试功能 -->
              <el-button
                size="mini"
                type="danger"
                @click="delete_menu(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 增加/修改菜单弹窗 -->
    <el-dialog :title="title" :visible.sync="add_menu_ifShow">
      <el-form :model="form_add">
        <el-form-item label="父级" :label-width="formLabelWidth" v-show ="if_add">
          <el-select v-model="form_add.top_menu" placeholder="请选择">
            <el-option
              v-for="item in father_menu"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级" :label-width="formLabelWidth" v-show ="!if_add">
          <el-input v-model="O_message.parent_name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form_add.menu_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="form_add.menu_icon" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_menu_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_add_menu" v-show="add_saveMenu_ifShow">添加</el-button>
        <el-button type="primary" @click="submit_save_menu" v-show="!add_saveMenu_ifShow">保存</el-button>
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
import { menu_list , menu_add , menu_page_info , menu_edit , del_menu} from "../../utils/axios";
export default {
  data() {
    return {
      menberList: [], //会员列表
      loading : false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      fn1: this.commonJs.Debounce(this.get_menu_list),
      add_menu_ifShow : false,
      add_saveMenu_ifShow : false,
      form_add: {
        top_menu: "",
        menu_name: "",
        menu_icon: ""
      },
      title : '新增菜单',
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      pageSize : 20,
      father_menu : [],
      if_add : true,
      height:"",
    };
  },

  created() {
    this.get_menu_list();//获取菜单列表
    this.height = document.body.clientHeight - 240
  },

  methods: {

    //获取菜单列表
    get_menu_list (index) {
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      menu_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.create_time = that.commonJs.timestampToTime (element.create_time)
              element.update_time = that.commonJs.timestampToTime (element.update_time)
            });
            that.menberList = res.data.err_msg.list
            that.queryInfo.pageSize = res.data.err_msg.page_size
            that.queryInfo.page = res.data.err_msg.page
            that.queryInfo.total = res.data.err_msg.total_number
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
    get_menu_list_page (page , number) {
      let that = this
      that.loading = true
      let request_form = {
        page : page,
        page_size: number
      }
      menu_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.create_time = that.commonJs.timestampToTime (element.create_time)
              element.update_time = that.commonJs.timestampToTime (element.update_time)
            });
            that.menberList = res.data.err_msg.list
            that.queryInfo.pageSize = res.data.err_msg.page_size
            that.queryInfo.page = res.data.err_msg.page
            that.queryInfo.total = res.data.err_msg.total_number
            that.pageSize = res.data.err_msg.page_size
            console.log(that.queryInfo)
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

    //删除菜单
    delete_menu (index , row) {
      let that = this
      this.$confirm('此操作将永久删除('+ row.name + ')菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del_menu(
          {
            id: row.id
          }
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.$message({
                message: '删除成功',
                type: 'success'
              });
              that.get_menu_list()
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
      }).catch(() => {
              
      });
    },

    //每页显示条数改变
    handleSizeChange(val) {
      console.log(this.queryInfo)
      this.get_menu_list_page(1,val)
    },

    //当前页
    handleCurrentChange(val) {
      console.log(val)
      this.get_menu_list_page(val,this.pageSize)
    },

    //新增菜单
    add_menu () {
      let that = this
      that.if_add = true
      this.form_add = {
        top_menu: "",
        menu_name: "",
        menu_icon: ""
      }
      this.add_saveMenu_ifShow = true
      this.title = '新增菜单'
      menu_page_info( //获取菜单信息
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.father_menu = res.data.err_msg.menu_list
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
      this.add_menu_ifShow = true
    },

    //菜单增加——添加
    submit_add_menu () {
      let that = this
      if(that.form_add.menu_name == '' || that.form_add.menu_icon == '' ) {
        that.$message({
          message: '请将信息填写完整',
          type: 'warning'
        });
      } else {
        console.log(that.form_add.top_menu)
        menu_add({
          parent_id	: that.form_add.top_menu,
          sort : 1,
          name : that.form_add.menu_name,
          icon : that.form_add.menu_icon
        })
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.add_menu_ifShow = false
              that.$message({
                message: '添加成功',
                type: 'success'
              });
              that.get_menu_list();
            } else {
              that.add_menu_ifShow = false
              that.$message({
                showClose: true,
                message: res.data.err_msg,
                type: 'error'
              });
            }
          })
          .catch((error) => {
            that.add_menu_ifShow = false
            console.log(error);
          });
      }
    },

    //编辑
    handleEdit(index, row) {
      let that = this
      that.if_add = false
      this.add_menu_ifShow = true
      this.add_saveMenu_ifShow = false
      this.title = '菜单修改 (菜单名称:' + row.name + ')'
      this.form_add ={
        top_menu: row.parent_name,
        menu_name: row.name,
        menu_icon: row.icon
      }
      console.log(index, row);
      that.O_message = row
      console.log(row)
      menu_page_info( //获取菜单信息
        {menu_id : parseInt(row.id)}
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.father_menu = res.data.err_msg.menu_list
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

    //菜单编辑——保存
    submit_save_menu () {
      let that = this
      if(that.form_add.menu_name=='' || that.form_add.menu_icon == '') {
        that.$message({
          message: '请将信息填写完整',
          type: 'warning'
        });
        return;
      }
      menu_edit({
        menu_id : that.O_message.id,
        parent_id	: that.O_message.parent_id,
        sort : 1,
        name : that.form_add.menu_name,
        icon : that.form_add.menu_icon
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.add_menu_ifShow = false
            that.$message({
              message: '修改成功,重新登录之后生效',
              type: 'success'
            });
            that.get_menu_list();
          } else {
            that.add_menu_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.add_menu_ifShow = false
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