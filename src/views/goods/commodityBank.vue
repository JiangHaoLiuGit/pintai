<template>
  <div class="goodsindex">
    <div class="seach" style="margin-top:20px">
      <el-input v-model="seach_value" @keyup.enter.native="pick_seach" placeholder="商品ID/商品名称"></el-input>
      <el-input v-model="seach_value1" @keyup.enter.native="pick_seach" placeholder="请输入店铺ID"></el-input>
      <el-input v-model="seach_value2" @keyup.enter.native="pick_seach" placeholder="请输入店铺名称"></el-input>
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
    <div class="seach_copy">
      <div class="seach_select">
        
        
        <el-select v-model="operationTypeValue" placeholder="请选择运营商类型">
        <el-option
          v-for="item in operationType"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-cascader
        placeholder="请选择商品分类"
        style="line-height:0;"
        v-model="classification_value"
        :options="classification_list"
        :props="{ expandTrigger: 'hover' , checkStrictly: true}"
        @change="pick_cate_change"></el-cascader>

      <el-select v-model="goods_status" placeholder="请选择商品状态">
        <el-option
          v-for="item in goods_status_list"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      </div>
      <div class="button_type">
        <el-button type="success" @click="user_derive_excel1">导出</el-button>
        <el-button type="primary" @click="pick_seach">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="goodsList"
          :height="height"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column 
            label="序号"
            type="index" 
          >
          </el-table-column>
          <el-table-column 
            prop="last_edit_time" 
            label="更新时间" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="name" 
            label="商品名称" 
          >
          </el-table-column>
          <el-table-column 
            prop="product_id" 
            label="商品ID" 
          >
          </el-table-column>
          
          <el-table-column label="商品主图" width="180">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.image"
                :preview-src-list="[scope.row.image]"
                style="width: 80px; height: 80px"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="商品分类">
          <template slot-scope="scope">
            {{scope.row.fname}}
            {{scope.row.sname ? '>>' + scope.row.sname : '' }}
            {{scope.row.tname ? '>>' + scope.row.tname : '' }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.status == 1 ? '已上架' : '已下架'}}
            </template>
          </el-table-column>
          <el-table-column label="运营商">
            <template slot-scope="scope">
              {{scope.row.store_id == 0 ? '平台自营' : scope.row.store_name }}
            </template>
          </el-table-column>
           <el-table-column 
            prop="quantity" 
            label="库存数量" 
          >
          </el-table-column>
          <el-table-column 
            prop="prime_cost_price" 
            label="结算价(元)" 
          >
          </el-table-column>
          <el-table-column 
            prop="original_price" 
            label="市场价(元)" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="price" 
            label="销售价(元)" 
          >
          </el-table-column>
          
          
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-show="scope.row.store_id == 0"
                @click="compile(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                style="margin-top:10px"
                v-show="scope.row.status == 0 && scope.row.store_id == 0"
                @click="grounding(scope.$index, scope.row)"
                >上架</el-button
              >
              <el-button
                size="mini"
                type="success"
                style="margin-top:10px"
                @click="viewDetails(scope.$index, scope.row)"
                >查看详情</el-button
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
import publicFile from '../../utils/publicFile'
import { platform_list , goods_get_cate , change_status_goods } from "../../utils/axios";
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
      father_menu : [],
      operationType: [{//运营商类型
        value: '1',
        label: '平台自营'
      }, {
        value: '2',
        label: '供应商'
      }],
      operationTypeValue: '',//运营商类型
      seach_value : '',
      seach_value1:"",
      seach_value2:"",
      pageSize : 20,
      classification_list :[], //商品分类列表
      classification_value : [],
      goods_status_list : [//商品状态
        {
          id: '1',
          name: '已上架'
        }, {
          id: '2',
          name: '已下架'
        }
      ],
      goods_status : '',//商品状态
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
      second_cate : [],
      three_cate : [],
      height:"",
    };
  },

  created() {
    this.get_goods_list(); //获取商品列表
    this.get_cate() //获取商品三级分类
    this.height = document.body.clientHeight - 300
    console.log(this.height)
  },

  methods: {
    //查看详情
    viewDetails (index , row) {
      this.$router.push({path:'/goods/goodsInfo',query:{product_id:row.product_id,is_edit : false}});
    },
    //获取商品列表
    get_goods_list (index) {
      let that = this
      that.operationTypeValue = ''
      that.classification_value = []
      that.goods_status = ''
      that.seach_value = ''
      this.seach_value1 = ''
      this.seach_value2 = ''
      that.time_value = ''
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      platform_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.last_edit_time = that.commonJs.timestampToTime (element.last_edit_time)
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

    // 获取商品三级分类
    get_cate(){
      let that = this
      goods_get_cate().then(res=>{
        if(res.data.err_code==0){
          if( res.data.err_msg.first.length > 0) {

            if(res.data.err_msg.second.length > 0) { //存在二级分类

              if(res.data.err_msg.third.length > 0) { //存在三级分类

                res.data.err_msg.first.forEach((element_first , first_index) => {
                  that.second_cate = []
                  that.classification_list.push({
                    value : element_first.cat_id,
                    label : element_first.cat_name,
                    cat_id : element_first.cat_id
                  })

                  res.data.err_msg.second.forEach(element_second => {
                    that.three_cate = []
                    if(element_first.cat_id == element_second.cat_fid) {//一级分类的ID等于二级分类的父级ID
                      that.second_cate.push({
                        value : element_second.cat_id,
                        label : element_second.cat_name,
                        cat_fid : element_second.cat_fid,
                        cat_id : element_second.cat_id
                      })
                      that.classification_list[first_index].children = that.second_cate

                      res.data.err_msg.third.forEach(element_third => {

                        if(element_second.cat_id == element_third.cat_fid) {
                          that.three_cate.push({
                            value : element_third.cat_id,
                            label : element_third.cat_name,
                            cat_fid : element_third.cat_fid,
                            cat_id : element_third.cat_id
                          })
                          let index = that.classification_list[first_index].children.length-1
                          that.classification_list[first_index].children[index].children = that.three_cate
                        }
                      })
                    }
                  })
                })
                
              } else {//不存在三级分类
                res.data.err_msg.first.forEach((element_first , first_index) => {
                  that.second_cate = []
                  that.classification_list.push({
                    value : element_first.cat_id,
                    label : element_first.cat_name,
                    cat_id : element_first.cat_id
                  })
                  res.data.err_msg.second.forEach(element_second => {
                    if(element_first.cat_id == element_second.cat_fid) {
                      that.second_cate.push({
                        value : element_second.cat_id,
                        label : element_second.cat_name,
                        cat_fid : element_second.cat_fid,
                        cat_id : element_second.cat_id
                      })
                      that.classification_list[first_index].children = that.second_cate
                    }
                  })
                })
              }

            } else {
              res.data.err_msg.first.forEach(element_first => {
                that.classification_list.push({
                  value : element_first.cat_id,
                  label : element_first.cat_name
                })
              })
            }
          }
          console.log(that.classification_list)
        }else{
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
    },

    //商品三级分类选择
    pick_cate_change(value) {
      this.classification_value = value
      console.log(this.classification_value)
    },

    //分页
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      platform_list(
        {
          page : page,
          page_size: number,
          keyword : this.seach_value,//模糊搜索id或商品名称
          stroe_search_id:this.seach_value1,
          store_search_name:this.seach_value2,
          store_id : this.operationTypeValue,//平台传1 供货商传2
          status : this.goods_status,//状态 1上架 2下架
          fid : this.classification_value[0],//一级分类id
          sid : this.classification_value[1],//二级分类id
          tid : this.classification_value[2],//三级分类id
          start_time : this.time_value[0],//开始时间
          end_time : this.time_value[1]//结束时间
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.last_edit_time = that.commonJs.timestampToTime (element.last_edit_time)
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
    //导出
    user_derive_excel1 () {
      let that = this
      
      platform_list(
        {
          page : 1,
          page_size: this.pageSize,
          keyword : this.seach_value,//模糊搜索id或商品名称
          stroe_search_id:this.seach_value1,
          store_search_name:this.seach_value2,
          
          store_id : this.operationTypeValue,//平台传1 供货商传2
          status : this.goods_status,//状态 1上架 2下架
          fid : this.classification_value[0],//一级分类id
          sid : this.classification_value[1],//二级分类id
          tid : this.classification_value[2],//三级分类id
          start_time : this.time_value[0],//开始时间
          end_time : this.time_value[1]//结束时间
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            if(res.data.err_msg.list.length == 0){
              that.$message({
                showClose: true,
                message: "暂无数据",
                type: "error",
              });
            }else{
              if(this.classification_value.length == 0){
                this.classification_value = ["","",""]
              }
              if(this.time_value.length == 0){
                this.time_value = ["",""]
              }
              let dat = "/new_admin.php?c=goods&a=goods_derive_excel&keyword="+ that.seach_value 
              +"&stroe_search_id="+ that.seach_value1
              +"&store_search_name="+ that.seach_value2
              +"&store_id="+ that.operationTypeValue
              +"&status="+ that.goods_status
              +"&start_time="+ this.time_value[0] 
              +"&end_time="+ this.time_value[1]
              if(that.classification_value[0]){
                dat += "&fid="+ that.classification_value[0]
              }
              if(that.classification_value[1]){
                dat += "&sid="+ that.classification_value[1]
              }
              if(that.classification_value[2]){
                dat += "&tid="+ that.classification_value[2]
              }
              // +"&fid="+ that.classification_value[0]
              // +"&sid="+ that.classification_value[1]
              // +"&tid="+ that.classification_value[2]
              window.open(publicFile.address + dat)
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
          console.log(error);
          that.loading = false
        });
    },
    //搜索
    pick_seach () {
      let that = this
      if(that.operationTypeValue == '' && that.seach_value == '' && that.seach_value1 == '' && that.seach_value2 == '' && that.goods_status == '' && that.time_value == '' && that.classification_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      platform_list(
        {
          page : 1,
          page_size: this.pageSize,
          keyword : this.seach_value,//模糊搜索id或商品名称
          stroe_search_id:this.seach_value1,
          store_search_name:this.seach_value2,
          store_id : this.operationTypeValue,//平台传1 供货商传2
          status : this.goods_status,//状态 1上架 2下架
          fid : this.classification_value[0],//一级分类id
          sid : this.classification_value[1],//二级分类id
          tid : this.classification_value[2],//三级分类id
          start_time : this.time_value[0],//开始时间
          end_time : this.time_value[1]//结束时间
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.last_edit_time = that.commonJs.timestampToTime (element.last_edit_time)
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

     //编辑
    compile (index , row) {
      let that = this
      this.$router.push({path:'/goods/update',query: {product_id: row.product_id,is_edit : true}});
    },

    //上架
    grounding (index , row) {
      let that = this
      this.$confirm('此操作将上架商品名称为 : ' + row.name + '的商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        change_status_goods({
          product_id: row.product_id,
          status : 2, //状态(1 上架->下架 2 下架->上架)
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '上架成功',
                type: 'success'
              });
              that.get_goods_list();
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

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
  }
}
/deep/ .el-dialog {
  width: 800px !important;
  /deep/ .el-dialog__body {
     display: flex;
     justify-content: space-between;
  }
  /deep/ .el-input {
    overflow-y: auto;  /*溢出隐藏*/
    // text-overflow: ellipsis; /*以省略号...显示*/
    // white-space: nowrap;  /*强制不换行*/
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