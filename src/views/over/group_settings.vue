<template>
  <div class="goodsindex">
    
    <div class="seach_copy">
      <div class="seach_select">
        <el-input v-model="pick_value" placeholder="请输入分组名称" @keyup.enter.native="pick_seach"></el-input>
        <el-button type="primary" @click="pick_seach">搜索</el-button>
        <el-input v-model="ratio" style="margin-left:100px" placeholder="请输入比例"></el-input>
        <el-button type="warning" @click="add_activity">批量设置比例</el-button>
        <el-button type="danger" @click="deletes">批量删除</el-button>
      </div>
      <div class="button_type">
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
        <el-button type="primary" @click="set_astrict_ifShow = true">增加分类</el-button>
        
        
      </div>
    </div>

    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="extendList"
          border
          :height="height"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
          >
          </el-table-column>
          <el-table-column 
            label="序号"
            type="index" 
          >
          </el-table-column>
          <el-table-column 
            prop="group_name" 
            label="分组名称" 
          >
          </el-table-column>
          <el-table-column 
            prop="product_num" 
            label="商品数量" 
          >
          </el-table-column>
          <el-table-column 
            label="余额计算比例" 
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.ratio" @input="setRatio(scope.row)" placeholder="请输入计算比例"></el-input>
            </template>
          </el-table-column>
          
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="examine(scope.row)"
                >添加商品</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="deletet(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 增加分组 -->
    <el-dialog title="增加分组" class="box1" :visible.sync="set_astrict_ifShow">
      <el-form ref="form" label-width="80px">
        <el-form-item label="分组名称">
          <el-input v-model="astrict1" placeholder="请输入分组名称"></el-input>
        </el-form-item>
        <el-form-item label="计算比例">
          <el-input v-model="astrict2" type="number" placeholder="请输入计算比例"></el-input>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="set_astrict_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="edit_astrict">保存</el-button>
      </div>
    </el-dialog>
    <!-- 添加商品弹窗 -->
    <el-dialog title="添加商品" :visible.sync="goods_examine_change_ifShow">
      <div class="seach"></div>
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="product_name"
             @keyup.enter.native="pick_seach3"
            placeholder="商品ID/商品名称/店铺名称"
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach3">搜索</el-button>

          <el-button size="mini" type="primary" @click="add_pro"
            >添加商品</el-button
          >
        </div>
      </div>
      <div class="box">
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="newGoodsLion"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange2"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column label="序号" type="index">
              </el-table-column>
              <el-table-column prop="name" label="商品名称">
              </el-table-column>
              <el-table-column label="商品图片" width="180">
                <template slot-scope="scope">
                  <el-image :src="scope.row.image" fit="cover"></el-image>
                </template>
              </el-table-column>

              <el-table-column prop="price" label="商品售价"> </el-table-column>

              <el-table-column prop="quantity" label="商品库存">
              </el-table-column>
              <el-table-column prop="store_name" label="店铺名称">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <!-- 分页 -->
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24" class="goodsindex-page-box">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="queryInfo4.page"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="queryInfo4.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryInfo4.total"
          >
          </el-pagination>
        </el-col>
      </el-row>
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
import { balance_list , changetype_extend , change_level ,del_group,goods_list,group_add_product,add_group ,set_ratio} from "../../utils/axios";
export default {
  data() {
    return {
      extendList: [], //推广列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_agent_list),
      formLabelWidth: "100px",
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      newGoodsLion:[],
      product_name:"",
      queryInfo4: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      set_astrict_ifShow:false,
      astrict1:"",
      astrict2:"",
      dataList:"",
      multipleSelection2:[],
      multipleSelection:[],
      pick_value : '',
      ratio:"",
      pageSize : 20,
      goods_examine_change_ifShow:false,
      opening_change_ifShow : false,
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
      height:"",
    };
  },

  created() {
    this.get_agent_list(); //获取推广列表
    this.height = document.body.clientHeight - 240
  },

  methods: {
    edit_astrict(){
      if(this.astrict1 == '' || this.astrict2 == '') {
        this.$message({
          showClose: true,
          message: '请完善表格数据',
          type: 'error'
        });

      }else if(this.astrict2 <= 0) {
        this.$message({
          showClose: true,
          message: '计算比例必须大于0',
          type: 'error'
        });
        
      }else if(this.astrict2 > 100) {
        this.$message({
          showClose: true,
          message: '计算比例不能大于100',
          type: 'error'
        });
        
      }  else {
        add_group({
            group_name: this.astrict1,
            ratio: this.astrict2,
          }).then((res) => {
            if (res.data.err_code == 0) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.astrict1 = ""
              this.astrict2 = ""
              this.set_astrict_ifShow = false
              // this.get_agent_list();
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            } else {
              this.$message({
                showClose: true,
                message: res.data.err_msg,
                type: "error",
              });
            }
          });
      }
      
    },
    //单个删
    deletet(row) {
      this.$confirm("此操作将删除此条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(row)
          del_group({
            group_ids: row.id,
          }).then((res) => {
            if (res.data.err_code == 0) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              // this.get_agent_list();
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            } else {
              this.$message({
                showClose: true,
                message: res.data.err_msg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {});
    },
    //多个删除
    deletes () {
      let that = this
      if(that.multipleSelection.length == 0) {
        that.$message({
          showClose: true,
          message: '请至少选择一条数据',
          type: 'error'
        });
      } else {
        let name = ''
        let idArr = ''
        console.log(that.multipleSelection)
        that.multipleSelection.forEach(element => {
          if(name == '') {
            name = element.group_name
            idArr = element.id
          } else {
            name = name + '、' + element.group_name
            idArr = idArr + ',' + element.id
          }
        })
        this.$confirm('此操作将删除运费模板的名称为 : ' + name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
          del_group({
            group_ids: idArr,
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: '删除成功',
                  type: 'success'
                });
                // this.get_agent_list();
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
      }
    },
    //获取推广列表
    get_agent_list (index) {
      this.pick_value = ''
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      balance_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.extendList = res.data.err_msg.list
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
            that.pageSize = res.data.err_msg.page_size
            if(index == 1) {
              that.O_message_c = {}
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
      balance_list(
        {
          page : page,
          page_size: number,
          search : this.pick_value,//昵称/手机号模糊搜索
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            
            that.extendList = res.data.err_msg.list
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
    //勾选
    handleCheckedCitiesChange(value) {
      console.log(this.checkedCities)
    },
    //当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    },
    //搜索
    pick_seach () {
      console.log("搜索")
      console.log(this.time_value)
      let that = this
      if(that.pick_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      balance_list(
        {
          page : 1,
          page_size: this.pageSize,
          search : this.pick_value,//昵称/手机号模糊搜索
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            // res.data.err_msg.list.forEach(element => {
            //   element.reg_time = that.commonJs.timestampToTime (element.reg_time)
            // });
            that.extendList = res.data.err_msg.list
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
    //添加商品
    examine(row) {
      this.dataList = row
      this.goods_examine_change_ifShow = true;
      this.goodList();
    },
    goodList() {
      this.loading = true;
      goods_list({
        page: 1,
        page_size: 20,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            this.newGoodsLion = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
          } else {
            this.loading = false;
            this.$message({
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
    //搜索
    pick_seach3 () {
      
      if(this.product_name == '') {
        this.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      this.loading = true
      goods_list(
        {
          page: 1,
          page_size: 20,
          keyword: this.product_name, //模糊搜索id或商品名称
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false
            this.newGoodsLion = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error);
        });
    },
    add_pro() {
      let that = this
      if (this.multipleSelection2.length == 0) {
        this.$message({
          message: "请选择一种商品",
          type: "warning",
        });
        return;
      }
      let idArr = []
      that.multipleSelection2.forEach(element => {
        idArr.push(element.product_id)
      })
      idArr = idArr.join()
      console.log(idArr)
      group_add_product({
        group_id:this.dataList.id,
        product_ids: idArr,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "商品选择成功",
            type: "success",
          });
          this.goods_examine_change_ifShow = false;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
      console.log(val);
    },
    //当前页
    handleCurrentChange2(val) {
      this.get_shop_list_page2(val, this.pageSize);
    },
    //每页显示条数改变
    handleSizeChange2(val) {
      this.get_shop_list_page2(1, val);
    },
    //分页
    get_shop_list_page2(page, number) {
      this.loading = true;
      goods_list({
        page: page,
        page_size: number,
        keyword: this.product_name, //模糊搜索id或商品名称
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            this.newGoodsLion = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
          } else {
            this.loading = false;
            this.$message({
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
    setRatio(row){
      console.log(row.ratio)
      if(row.ratio > 0 && row.ratio <= 100){
        set_ratio({
          group_ids:row.id,
          ratio:row.ratio
        }).then(res=>{
          if(res.data.err_code==0){
            console.log(res)

          }else{
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
      }
      
    },
    //快速设置商品余额分类(可批量)
    add_activity () {
      let that = this
      console.log(that.multipleSelection)
      if(that.multipleSelection.length == 0) {
        that.$message({
          showClose: true,
          message: '请至少选择一条数据',
          type: 'error'
        });
      }else if(that.ratio == '' || that.ratio <= 0) {
        that.$message({
          showClose: true,
          message: '请填写计算比例',
          type: 'error'
        });
        // 
      } else {
        let name = ''
        let ids = []
        that.multipleSelection.forEach(element => {
          if(name == '') {
            name = element.group_name
          } else {
            name = name + '、' + element.group_name
          }
          ids.push(element.id)
        })
        ids = ids.join()
        this.$confirm('此操作将把商品名称为 : ' + name + '的商品加入' + '测试分组' + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 
          set_ratio({
            group_ids:ids,
            ratio:this.ratio
          }).then(res=>{
            if(res.data.err_code==0){
              console.log(res)
              // this.get_agent_list();
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              this.ratio = 0
              this.$message({
                message:"计算比例设置成功",
                type:'success'
              })
            }else{
              that.$message({
                showClose: true,
                message: res.data.err_msg,
                type: 'error'
              });
            }
          })
        })
      }
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
  width: 1008px !important;
  max-height: 700px;
}
/deep/ .box1 .el-dialog {
  width: 500px !important;
}
/deep/.box .el-table__body-wrapper{
  overflow-y: auto;
  max-height:378px;
}

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
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