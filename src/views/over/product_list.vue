<template>
  <div class="goodsindex">
    <div class="seach">
        
        
    </div>
    <div class="seach_copy">
      <div class="seach_select">
        <el-input v-model="seach_value" placeholder="请输入商品ID/商品名称" @keyup.enter.native="pick_seach"></el-input>
        <el-select v-model="goods_status1" placeholder="请选择搜索分组名称">
            <el-option
            v-for="item in goods_status_list"
            :key="item.id"
            :label="item.group_name"
             @keyup.enter.native="pick_seach"
            :value="item.id">
            </el-option>
        </el-select>
      </div>
      <div class="button_type">
        <el-select v-model="goods_status" placeholder="请选择设置分组名称">
            <el-option
            v-for="item in goods_status_list"
            :key="item.id"
            :label="item.group_name"
            :value="item.id">
            </el-option>
        </el-select>
        <el-button type="warning" @click="add_activity">批量设置分组</el-button>
        <el-button type="primary" @click="pick_seach">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
        
      </div>
    </div>
    <div>
      
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="goodsList"
          border
          stripe
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
            prop="id" 
            label="余额分类ID" 
          >
          </el-table-column>
          <el-table-column 
            prop="name" 
            label="商品名称" 
          >
          </el-table-column>
          <el-table-column label="商品主图" width="180">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.image"
                style="width: 80px; height: 80px"
                :preview-src-list="[scope.row.image]"
                fit="cover"></el-image>
            </template>
          </el-table-column>
        <el-table-column label="商品分类">
          <template slot-scope="scope">
            <div>
            <el-tag type="success" v-show="scope.row.cat_fname != '' && scope.row.cat_fname" style="margin-right:10px;margin-top:10px;">{{scope.row.cat_fname}}</el-tag>
            <el-tag type="warning" v-show="scope.row.cat_name != '' && scope.row.cat_name" style="margin-top:10px;">{{scope.row.cat_name}}</el-tag>
            </div>
          </template>
        </el-table-column>
          <el-table-column label="占比">
            <template slot-scope="scope">
              {{scope.row.ratio}}%
            </template>
          </el-table-column>
          <el-table-column 
            prop="store_name" 
            label="运营商" 
          >
          </el-table-column>
          <el-table-column 
            label="分组名称" 
          >
            <template slot-scope="scope">
              <div>
              <el-tag type="danger" v-show="scope.row.group_name != ''">{{scope.row.group_name}}</el-tag>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <el-select v-model="scope.row.group_id" style="float:left;width:200px" placeholder="请选择设置分组名称">
                <el-option
                v-for="item in goods_status_list"
                :key="item.id"
                :label="item.group_name"
                :value="item.id">
                </el-option>
              </el-select>
              <el-button
                size="medium"
                type="warning"
                style="float:left;"
                @click="edit_set(scope.row)"
                >设置</el-button
              >
              
              <!-- @click="dercarriage(scope.row)" -->
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
import { product_list ,balance_list ,set_group} from "../../utils/axios";
export default {
  data() {
    return {
      goodsList: [], //商品列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_goods_list),
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      height:"",
      seach_value : '',
      pageSize : 20,
      goods_status1:"",
      goods_status_list : [],
      goods_status : '',//商品状态
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
      multipleSelection : [],//选中的数据
      formLabelWidth: '120px',
      checkedCities: ['1'],
      price_change_visible : false,
    };
  },

  created() {
    let that = this
    this.get_goods_list(); //获取商品列表
    this.get_cate() //获取商品三级分类
    this.height = document.body.clientHeight - 240
  },

  methods: {
    //获取商品列表
    get_goods_list (index) {
      let that = this
      that.seach_value = ''
      that.goods_status1 = ""
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      product_list(
        request_form
      )
        .then((res) => {
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.add_time = that.commonJs.timestampToTime (element.add_time)
            });
            that.goodsList = res.data.err_msg.list
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

    // 获取商品分组
    get_cate(){
      balance_list({
        page : 1,
        page_size: 2000,
      }).then(res=>{
        if(res.data.err_code==0){
          console.log(res)
          this.goods_status_list = res.data.err_msg.list

        }else{
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
    },

    //分页
    
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      product_list(
        {
          page : page,
          page_size: number,
          search : this.seach_value,//模糊搜索id或商品名称
          group_id:this.goods_status1
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.add_time = that.commonJs.timestampToTime (element.add_time)
            });
            that.goodsList = res.data.err_msg.list
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
      if(that.seach_value == '' && this.group_id == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      product_list(
        {
          page : 1,
          page_size: this.pageSize,
          search : this.seach_value,//模糊搜索id或商品名称
          group_id:this.goods_status1
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.add_time = that.commonJs.timestampToTime (element.add_time)
            });
            that.goodsList = res.data.err_msg.list
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

    //单个设置
    edit_set(item){
        set_group({
          group_id:item.group_id,
          group_product_ids:item.id
        }).then(res=>{
          if(res.data.err_code==0){
            console.log(res)
            // this.get_goods_list();
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            this.$message({
              message:item.name + "分组设置成功",
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
    },
    //快速设置商品余额分类(可批量)
    add_activity () {
      let that = this
      if(that.multipleSelection.length == 0) {
        that.$message({
          showClose: true,
          message: '请至少选择一条数据',
          type: 'error'
        });
      }else if(that.goods_status == '') {
        that.$message({
          showClose: true,
          message: '请选择分组名称',
          type: 'error'
        });
        // 
      } else {
        let name = ''
        let ids = []
        that.multipleSelection.forEach(element => {
          if(name == '') {
            name = element.name
          } else {
            name = name + '、' + element.name
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
          set_group({
            group_id:this.goods_status,
            group_product_ids:ids
          }).then(res=>{
            if(res.data.err_code==0){
              console.log(res)
              // this.get_goods_list();
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              this.$message({
                message:"分组设置成功",
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
    //勾选
    handleCheckedCitiesChange(value) {
      console.log(this.checkedCities)
    },
    //当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    },
  },
};
</script>

<style scoped lang="less">

/deep/ .el-table td, .el-table th.is-leaf{
    border-top: 1px solid #717b90;
    border-bottom:0;
}

/deep/ .el-table__body{
  border-bottom: 1px solid #EBEEF5;
}

/deep/ .el-date-editor {
  margin-right: 20px;
}

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
  }
}
/deep/ .el-dialog {
  width: 1200px !important;
}

/deep/ .el-dialog__body {
  height: 300px;
  max-height: 400px;
  overflow-y: auto;
}

.seach_copy {
  padding-top:20px;
  margin-bottom: 20px;
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