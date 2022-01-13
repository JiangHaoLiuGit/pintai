<template>
  <div class="page">
    <div class="seach">
      <div class="el-inpu inlineBlock">
        
      </div>
      <div class="el-inpu inlineBlock">
        
      </div>
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="live_id"
            placeholder="请输入许可证名称"
            @keyup.enter.native="pick_seach"
            clearable
            ></el-input>
        </div>
        <div class="button_type">
            <span v-show="cat_name" style="height:40px;line-height:40px;">商品分类: {{cat_name}}</span>
            <el-button type="primary" v-show="cat_id" @click="add_excise">提交分类许可证</el-button>
            <el-button type="danger" @click="undercarriage">批量删除</el-button>
            <el-button type="primary" @click="add">增加许可证</el-button>
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
          ref="multipleTable"
          v-loading="loading"
          :data="extendList"
          border
          :height="height"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="序号" type="index" width="100">
          </el-table-column>
          <el-table-column
            prop="licence_name"
            label="分类许可证列名称"
          ></el-table-column>
            <el-table-column
            prop="add_time"
            label="添加时间"
          ></el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              
              <el-button
                size="mini"
                type="danger"
                @click="deletes(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="edit(scope.$index, scope.row)"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 内层弹窗 属性组添加/编辑-->
    <el-dialog
      class="group_inner"
      :title="group_title"
      :visible.sync="attribute_add_group"
      append-to-body
    >
      <el-form :model="group_form">
        <el-form-item label="许可证名称：" :label-width="formLabelWidth">
          <el-input v-model="group_form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="attribute_add_group = false">取 消</el-button>
        <el-button
          type="primary"
          @click="group_add"
          v-show="group_form.add_show"
          >确 定</el-button
        >
        <el-button
          type="primary"
          @click="group_save"
          v-show="!group_form.add_show"
          >保 存</el-button
        >
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
import { licence_list,licence_add ,licence_save,licence_del,cate_licence_info ,cate_licence_save } from "../../utils/axios";
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
      pageSize:"10",
      //申請人姓名
      live_id: "",
      loading: false,
      group_form: {
        name: "",
        add_show: false,
      },
      height:"",
      attribute_add_group:false,
      group_title:"",
      formLabelWidth: "120px",
      O_message_copy: {},
      multipleSelection:[],
      cat_id:"",
      excise_arr:[],
      cat_name:"",
      last_arr:[],
    };
  },
  created() {
    if (this.$route.query.id) {
      this.cat_id = this.$route.query.id;
      this.cat_name = this.$route.query.name;
      console.log(this.cat_id)
      this.get_agent_list();
      this.last_arr = []
      this.excise_list()
    } else {
      this.get_agent_list();
      
    }
    this.height = document.body.clientHeight - 250
    console.log(this.height)
  },
  methods: {

    edit(index,row){
      this.group_title = "修改许可证";
      this.O_message_copy = row
      this.group_form.name = row.licence_name;
      this.group_form.add_show = false;
      this.attribute_add_group = true;
    },
    add(){
      this.group_title = "添加许可证";
      this.group_form.name = "";
      this.group_form.add_show = true;
      this.attribute_add_group = true;
    },
    deletes(index,row){
      let that = this;
      this.$confirm(
        "此操作将删除" + row.licence_name + "销售属性, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          licence_del({
            licence_ids: row.id,
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "删除成功",
                  type: "success",
                });
                // that.get_agent_list();
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
    //批量删除
    undercarriage () {
      let that = this
      if(that.multipleSelection.length < 1) {
        that.$message({
          showClose: true,
          message: '请至少选择一条数据',
          type: 'error'
        });
      } else {
        let name = ''
        let idArr = ''
        that.multipleSelection.forEach(element => {
          if(name == '') {
            name = element.licence_name
            idArr = element.id
          } else {
            name = name + '、' + element.licence_name
            idArr = idArr + ',' + element.id
          }
        })
        this.$confirm('此操作将商品名称为 : ' + name + '的商品删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          licence_del({
            licence_ids: idArr,
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "删除成功",
                  type: "success",
                });
                // that.get_agent_list();
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
        }).catch(() => {
                
        });
      }
    },
    //分类批量增加许可证
    add_excise () {
      let that = this
        let name = ''
        let idArr = ''
        that.multipleSelection.forEach(element => {
          if(name == '') {
            name = element.licence_name
            idArr = element.id
          } else {
            name = name + '、' + element.licence_name
            idArr = idArr + ',' + element.id
          }
        })
        let dataArr = ''
        if(idArr){
          dataArr = idArr
        }
        console.log(this.last_arr)
        this.last_arr.forEach(element => {
          if(dataArr == '') {
            dataArr = element.licence_id
          } else {
            dataArr = dataArr + ',' + element.licence_id
          }
        })
        
        
        this.$confirm('此操作将商品名称为 : ' + name + '的许可证增加到分类:'+ this.cat_name +', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cate_licence_save({
            licence_ids: dataArr,
            cate_id:this.cat_id
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "添加成功",
                  type: "success",
                });
                // this.get_agent_list();
                this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                this.excise_list()
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
        }).catch(() => {
                
        });
    },
    
    //属性组添加
    group_add() {
      let that = this;
      if (that.group_form.name == "") {
        that.$message({
          message: "请输入属性组名称",
          type: "warning",
        });
        return;
      }
      licence_add({
        licence_name: that.group_form.name,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.attribute_add_group = false;
            that.$message({
              message: "添加成功",
              type: "success",
            });
            // that.get_agent_list();
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
          } else {
            that.attribute_add_group = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.attribute_add_group = false;
          console.log(error);
        });
    },

    //属性组编辑
    group_save() {
      let that = this;
      if (that.group_form.name == "") {
        that.$message({
          message: "请输入属性组名称",
          type: "warning",
        });
        return;
      }
      licence_save({
        licence_id: that.O_message_copy.id,
        licence_name: that.group_form.name,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.attribute_add_group = false;
            that.$message({
              message: "编辑成功",
              type: "success",
            });
            // that.get_agent_list();
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
          } else {
            that.attribute_add_group = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.attribute_add_group = false;
          console.log(error);
        });
    },
    pick_seach(index) {
      let that = this;
      if (that.live_id == "") {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
        licence_name: that.live_id,
      };
      
      //搜索
      licence_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
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
    //当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      if(this.cat_id){
        this.last_arr = []
        this.excise_list()
      }
      let that = this;
      that.loading = true;
      licence_list({
        page: page,
        page_size: number,
        licence_name: that.live_id,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
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
    excise_list() {
      setTimeout(() => {
        let that = this;
        cate_licence_info({
          cate_id:this.cat_id
        })
        .then((res) => {
          if (res.data.err_code == 0) {
            this.excise_arr = []
            let arr = []
            this.last_arr = []
            for(let i = 0 ; i < res.data.err_msg.info.length ; i++){
              for(let j = 0 ; j < this.extendList.length ; j++){
                 if(res.data.err_msg.info[i].licence_id == this.extendList[j].id){
                   console.log(this.extendList[j])
                  this.excise_arr.push(this.extendList[j])
                }
              }
            }
            res.data.err_msg.info.forEach((ite,ind) => {
              let leg = false
              this.excise_arr.forEach((item,index) => {
                if(ite.licence_id == item.id){
                  leg = true
                }
              })
              if(!leg){
                this.last_arr.push(ite)
              }
            })
            
            console.log(this.last_arr)
            console.log(this.excise_arr)
            this.excise_arr.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
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
      },500)
    },
    
    //加载第一页
    get_agent_list(index) {
      this.live_id = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      licence_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
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
