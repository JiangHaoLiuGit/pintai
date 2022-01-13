<template>
  <div class="page">
    <div class="pageItem">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">橘宝兑换商品列表</span>
      </div>
      <div class="textItem">
        <div class="clearfix" style="margin-bottom: 20px">
          <el-input
            class="lt marginRight"
            style="width: 300px"
            placeholder="请输入商品id/商品名称"
            prefix-icon="el-icon-search"
            @keyup.enter.native="pick_seach"
            v-model="seachVale"
          >
          </el-input>

          <el-button type="danger" class="rt" @click="shan">删除</el-button>
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="adds"
            >添加</el-button
          >
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="fn1(1)"
            >刷新</el-button
          >
          <el-button
            type="success"
            class="rt"
            style="margin-right: 10px"
            @click="pick_seach"
          >搜索</el-button>
        </div>
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="extendList"
              border
              style="width: 100%"
              :height="height"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column prop="create_time" label="添加时间" width="140"> </el-table-column>
              <el-table-column prop="product_id" label="商品id" width="60"> </el-table-column>
              <el-table-column prop="store_id" label="店铺id" width="60"> </el-table-column>
              <el-table-column prop="store_name" label="店铺名称"> </el-table-column>
              <el-table-column prop="name" label="商品名称"> </el-table-column>
              <el-table-column label="商品主图" width="100">
                <template slot-scope="scope">
                  <el-image
                    :src="scope.row.image"
                    :preview-src-list="[scope.row.image]"
                    style="max-width: 80px;max-height: 80px;"
                    fit="cover"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column label="分类名称">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.fname }}
                    {{ scope.row.sname ? ">>" + scope.row.sname : "" }}
                    {{ scope.row.tname ? ">>" + scope.row.tname : "" }}
                  </div>
                  
                </template>
              </el-table-column>
              <el-table-column prop="price" label="售价"> </el-table-column>
              <el-table-column prop="original_price" label="市场价"> </el-table-column>
              <el-table-column prop="prime_cost_price" label="成本价"> </el-table-column>
              <el-table-column label="结算比例">
                <template slot-scope="scope">
                  {{scope.row.settle_ratio}}%
                </template>
              </el-table-column>
              <el-table-column label="利润比例">
                <template slot-scope="scope">
                  {{scope.row.ratio}}%
                </template>
              </el-table-column>
              <el-table-column prop="member_level_1_price" label="分润金额"> </el-table-column>
              <!-- <el-table-column label="状态">
                  <template slot-scope="scope">
                    <div>{{scope.row.region}}合伙人</div>
                </template>
              </el-table-column> -->
              <el-table-column prop="sales" label="商品销量"> </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.status == 0">仓库中</div>
                  <div v-else-if="scope.row.status == 1">上架</div>
                  <div v-else-if="scope.row.status == 2">删除</div>
                  <div v-else>未知</div>
                </template>
              </el-table-column>
              
              
            </el-table>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <el-row :gutter="20" class="goodsindex-list" style="margin-top: 20px">
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
        <!-- 增加问答 -->
        <el-dialog
          width="70%"
          class="remarks_box add"
          :visible.sync="add_tan"
          append-to-body
        >
          <div class="info">添加商品</div>
          <div style="padding: 30px">
            <div class="seach">
              
            </div>
            <div class="seach_copy clearfix" style="padding-bottom:20px">
              <div class="seach_select lt">
                
                <el-input v-model="seach_value" class="marginRight" style="width:200px" @keyup.enter.native="pick_seach1" placeholder="商品ID/商品名称"></el-input>
                <el-input v-model="store_id" class="marginRight" style="width:200px" @keyup.enter.native="pick_seach1" placeholder="店铺id"></el-input>
                <el-input v-model="store_name" class="marginRight" style="width:200px" @keyup.enter.native="pick_seach1" placeholder="店铺昵称"></el-input>
                <el-cascader
                  placeholder="请选择商品分类"
                  style="line-height:0;"
                  v-model="classification_value2"
                  :options="classification_list"
                  :props="{ expandTrigger: 'hover', checkStrictly: true }"
                  @change="pick_cate_change2"
                ></el-cascader>
              </div>
              <div class="button_type rt clearfix">
                <el-button type="primary" class="lt" @click="pick_seach1">搜索</el-button>
                <el-button
                  size="mini"
                  type="primary"
                   class="lt"
                  @click="add_pro2"
                  >添加商品</el-button
                >
                <el-button type="primary" class="lt" icon="el-icon-refresh" @click="fn2(1)">刷新</el-button>
              </div>
            </div>
            <el-row :gutter="20" class="goodsindex-list">
              <el-col :span="24">
                <el-table
                  v-loading="loading"
                  ref="multipleTable"
                  :data="goodsList"
                  border
                  :height="500"
                  style="width: 100%"
                  @selection-change="handleSelectionChange1"
                  >
                  <el-table-column type="selection" width="55"> </el-table-column>
                  <el-table-column label="序号" type="index" width="100">
                  </el-table-column>
                  <el-table-column 
                    prop="name" 
                    label="商品名称" 
                    width="200"
                  >
                  </el-table-column>
                  <el-table-column label="商品图片" width="180">
                    <template slot-scope="scope">
                      <el-image
                        :src="scope.row.image"
                        style="width: 80px; height: 80px"
                        :preview-src-list="[scope.row.image]"
                        fit="cover"></el-image>
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_id" label="商品id"> </el-table-column>

                  <el-table-column 
                    prop="store_id" 
                    label="店铺id" 
                  >
                  </el-table-column>

                  <el-table-column 
                    prop="store_name" 
                    label="店铺名称" 
                  >
                  </el-table-column>
                  <el-table-column label="分类名称">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.fname }}
                        {{ scope.row.sname ? ">>" + scope.row.sname : "" }}
                        {{ scope.row.tname ? ">>" + scope.row.tname : "" }}
                      </div>
                      
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>

            

            <!-- 分页 -->
            <el-row :gutter="20" class="goodsindex-list">
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
            </el-row>
          </div>
        </el-dialog>
        <!-- 反复确认框。烦啊 -->
        <div class="box" v-show="kuang_show">
          <div class="content" @click="kuang_show = false">
            <div class="kuang" @click.stop="kuang_show = true">
              <img src="../../assets/image/gantan.png" alt="" />
              <div class="text">是否确认删除？</div>
              <el-button
                type="danger"
                @click.stop="kuang_show = false"
                style="margin-bottom: 10px; margin-right: 36px"
              >
                取消
              </el-button>
              <el-button type="success" @click.stop="sure_address"> 确认 </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { convert_product_list,jubao_product_list,add_convert_product,del_convert_product,goods_get_cate } from "../../utils/axios";
export default {
  data() {
    return {
      queryInfo: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      queryInfo1: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      height:"",
      classification_value2:"",
      classification_list :[], //商品分类列表
      store_id:"",
      store_name:"",
      pageSize:20,
      kuang_show: false,
      formLabelWidth1: "100px",
      add_wen: {
        content: "",
      },
      edit_wen: {
        content: "",
      },
      add_tan: false,
      fn1: this.commonJs.Debounce(this.get_convert_product_list),
      fn2: this.commonJs.Debounce(this.get_goods_list),
      seach_value:"",
      extendList: [],
      goodsList:[],
      seachVale: "",
      loading: false,
      multipleSelection: [],
      heigh:"",
      time_value: "",
      multipleSelection1:[],
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
    this.get_convert_product_list(); //获取推广列表
    this.get_cate()
    this.height = document.body.clientHeight - 320
  },
  methods: {
    addWen() {
      if (this.add_wen.content == "") {
        this.$message({
          showClose: true,
          message: "所有内容必填",
          type: "error",
        });
        return;
      }
      console.log(this.add_wen);
    },
    editWen() {
      if (this.edit_wen.content == "") {
        this.$message({
          showClose: true,
          message: "所有内容必填",
          type: "error",
        });
        return;
      }
      console.log(this.edit_wen);
    },
    adds() {
      this.add_tan = true;
      this.get_goods_list()
    },
    //获取商品列表
    get_goods_list (index) {
      let that = this
      that.classification_value = []
      this.store_name = ""
      that.seach_value = ''
      that.classification_value2 = ''
      that.store_id = ''
      that.store_name = ''
      
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20,
        market_id:this.market_id
      }
      
      jubao_product_list(
        request_form
      )
        .then((res) => {
          if (res.data.err_code == 0) {
            that.loading = false
            if(res.data.err_msg.fid){
              this.fid = res.data.err_msg.fid
            }else{
              this.fid = ""
            }
            that.goodsList = res.data.err_msg.list
            that.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo1.page = parseInt(res.data.err_msg.page)
            that.queryInfo1.total = parseInt(res.data.err_msg.total_number)
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
    
    get_shop_list_page1 (page , number) {
      let that = this
      that.loading = true
      // classification_value2:"",
      // classification_list :[], //商品分类列表
      // store_id:"",
      // store_name:"",
      jubao_product_list(
        {
          page : page,
          page_size: number,
          search : this.seach_value,//名称或id搜索
          store_name : this.store_name,
          store_id : this.store_id,
           fcate_id:this.classification_value2[0],
          cate_id:this.classification_value2[1]
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.goodsList = res.data.err_msg.list
            that.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo1.page = parseInt(res.data.err_msg.page)
            that.queryInfo1.total = parseInt(res.data.err_msg.total_number)
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
    //商品三级分类选择
    pick_cate_change2(value) {
      
      this.classification_value2 = value;
    },
    //每页显示条数改变
    handleSizeChange1(val) {
      console.log(val)
      this.get_shop_list_page1(1,val)
    },
    //当前页
    handleCurrentChange1(val) {
      this.get_shop_list_page1(val,this.pageSize)
    },


    //搜索
    pick_seach1 () {
      let that = this
      if(that.seach_value == '' && this.classification_value2.length == 0 && this.store_name == '' && this.store_id == "") {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      console.log(this.classification_value2)
      // return
      that.loading = true
      jubao_product_list(
        {
          page : 1,
          page_size: 20,
          search : this.seach_value,//名称或id搜索
          store_name : this.store_name,
          store_id : this.store_id,
          fcate_id:this.classification_value2[0],
          cate_id:this.classification_value2[1]
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.goodsList = res.data.err_msg.list
            that.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo1.page = parseInt(res.data.err_msg.page)
            that.queryInfo1.total = parseInt(res.data.err_msg.total_number)
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
    add_pro2() {
      if (this.multipleSelection1.length == 0) {
        this.$message({
          message: "请选择一种商品",
          type: "warning",
        });
        return;
      }
      let str = ''
      this.multipleSelection1.forEach((element) => {
          if(str == ''){
              str += element.product_id
          }else{
              str += "," + element.product_id
          }
      })
      console.log(str)
      add_convert_product({
        product_ids: str,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "商品添加成功",
            type: "success",
          });
          this.add_tan = false;
          this.get_shop_list_page(
            this.queryInfo.page,
            this.queryInfo.pageSize
          );
          
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    
    sure_address() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择一种商品",
          type: "warning",
        });
        return;
      }
      let str = ''
      this.multipleSelection.forEach((element) => {
          if(str == ''){
              str += element.product_id
          }else{
              str += "," + element.product_id
          }
      })
      del_convert_product({
        product_ids: str,
      })
        .then((res) => {
          if (res.data.err_code == 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.kuang_show = false;
            this.get_shop_list_page(
              this.queryInfo.page,
              this.queryInfo.pageSize
            );
          } else {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    shan() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择要删除的数据",
          type: "error",
        });
        return;
      }
      this.kuang_show = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
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
        }else{
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
    },
    //获取推广列表
    get_convert_product_list(index) {
      this.seachVale = "";

      this.loading = true;
      let request_form = {
        page: 1,
        page_size: this.pageSize,
      };
      convert_product_list(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
            this.pageSize = res.data.err_msg.page_size;
            if (index == 1) {
              this.$message({
                message: "刷新成功",
                type: "success",
              });
            }
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
    //分页
    get_shop_list_page(page, number) {
      var time1 = "";
      var time2 = "";
      console.log(this.time_value);
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      this.loading = true;
      convert_product_list({
        page: page,
        page_size: number,
        search: this.seachVale,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
            this.pageSize = res.data.err_msg.page_size;
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
    //每页显示条数改变
    handleSizeChange(val) {
      console.log(this.queryInfo);
      this.get_shop_list_page(1, val);
    },

    //当前页
    handleCurrentChange(val) {
      console.log(val);
      this.get_shop_list_page(val, this.pageSize);
    },
    //搜索
    pick_seach() {
      if (this.seachVale == "") {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      var time1 = "";
      var time2 = "";
      console.log(this.time_value);
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      this.loading = true;
      convert_product_list({
        page: 1,
        page_size: this.pageSize,
        search: this.seachVale,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
            this.pageSize = res.data.err_msg.page_size;
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
          console.log(error);
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped lang="less">
.page {
  position: relative;
  .pageItem {
    border-radius: 10px;
    background: #fff;
    .topHead {
      padding: 10px 30px;
      border-bottom: 1px solid #bbb;
      //
      s {
        background: #ee8f29;
        width: 5px;
        height: 25px;
        margin-right: 10px;
      }
      span {
        font-size: 20px;
        line-height: 28px;
      }
    }
    .textItem {
      padding: 15px 30px;
      .content {
        border: 1px solid #bbb;
        .head {
          padding: 5px 50px;
          img {
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
          span {
            line-height: 30px;
            height: 30px;
            color: #f76336;
          }
        }
        .item {
          width: 50%;

          .itemDiv {
            cursor: pointer;
            height: 40px;
            border-top: 1px solid #bbb;
            line-height: 40px;
          }
        }
        .item.lt {
          .itemDiv {
            padding-left: 50px;
          }
        }
        .item.rt {
          width: calc(50% - 1px);
          border-left: 1px solid #bbb;
          .itemDiv {
            padding-left: 15px;
            .kuai {
              margin-top: 8px;
              float: left;
              margin-right: 5px;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 1px solid #000;
              span {
                display: block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: 1px solid #000;
                margin: 4px;
              }
            }
            .span {
              float: left;
            }
            .kuai.active {
              border-color: #ee8f29;
              background: #ee8f29;
              span {
                border-color: #ee8f29;
              }
            }
          }
        }
      }
      .form {
        .span {
          color: #bbb;
          font-size: 13px;
          position: absolute;
          bottom: -37px;
          left: 0;
        }
        .span1 {
          color: #bbb;
          font-size: 13px;
          display: block;
          margin-bottom: 10px;
        }
      }
    }
    /deep/ .textItem .el-input {
      input {
        max-width: 900px;
      }
    }
  }
}
/deep/ .upload-demo.lt.active {
  .el-upload {
    text-align: left;
  }
}

/deep/ .pageItem.first .el-input input {
  height: 40px !important;
  line-height: 40px !important;
}
/deep/ .el-form-item {
  margin-bottom: 45px;
}
/deep/ .el-form-item.active {
  margin-bottom: 0;
}
/deep/ .el-dialog__body {
  padding: 0 0;
}
/deep/.el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog__headerbtn {
  font-size: 20px;
  top: 10px;
  right: 10px;
}
/deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
.info {
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  background: #ee8f29;
}
.box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  .content {
    border: none !important;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: relative;
    .kuang {
      position: absolute;
      text-align: center;
      top: 50%;
      left: 50%;
      width: 200px;
      margin-top: -330px;
      margin-left: -100px;
      background: #fff;
      border: 5px solid #ee8f29 !important;
      border-radius: 30px;
      padding: 35px 35px;
      img {
        margin: 0 auto 30px;
        width: 50px;
      }
      .text {
        margin-bottom: 40px;
      }
    }
  }
}
/deep/ .el-table .has-gutter tr,
/deep/ .el-table .has-gutter th {
  background: #d7d5d5 !important;
}
.remarks_box {
  .el-form-item {
    margin: 0;
  }
  h2 {
    margin-bottom: 15px;
    margin-top: 0;
    font-size: 18px;
  }
}
.remarks_box.add {
  
  .divs {
    padding: 0 15px 0 15px;
  }
}
</style>