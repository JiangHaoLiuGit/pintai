<template>
  <div class="goodsindex">
    <div class="seach">
      
    </div>
    <div class="seach_copy">
      <div class="seach_select">
        <el-select v-model="levelType" placeholder="请选择商品类型">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="pick_value" placeholder="请输入搜索关键词" @keyup.enter.native="pick_seach"></el-input>
        <el-select v-model="pick_condition" placeholder="请选择商品状态">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="levelValue" placeholder="请选择运费模式">
        <el-option
          v-for="item in levelList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="product_cate_value" placeholder="请选择商品分类">
        <el-option
          v-for="item in product_cate_list"
          :key="item.cat_id"
          :label="item.cat_name"
          :value="item.cat_id">
        </el-option>
      </el-select>
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
          :data="shop_search_jvbao_list"
          border
          :height="height"
          style="width: 100%"
        >
          <el-table-column 
            label="序号"
            type="index" 
          >
          </el-table-column>
          <el-table-column 
            prop="create_time" 
            label="添加时间" 
          >
          </el-table-column>
          <el-table-column 
            prop="update_time" 
            label="更新时间" 
          >
          </el-table-column>
          <el-table-column 
            prop="name" 
            label="商品名称" 
            width="200"
          >
          </el-table-column>
          <el-table-column 
            prop="category_id" 
            label="商品分类" 
          >
          </el-table-column>
          <el-table-column 
            prop="original_price" 
            label="原价" 
          >
          </el-table-column>
          <el-table-column 
            prop="price" 
            label="橘宝价" 
          >
          </el-table-column>
          <el-table-column 
            prop="discount_price" 
            label="特惠价" 
          >
          </el-table-column>
          <el-table-column 
            prop="discount_start_time" 
            label="特惠开始时间" 
          >
          </el-table-column>
          <el-table-column 
            prop="discount_end_time" 
            label="特惠结束时间" 
          >
          </el-table-column>
          
          
          
          <el-table-column label="操作" width="200" >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="modify(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="primary"
                style="margin-top:10px"
                @click="openPoint(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 商品详情弹窗 -->
    <el-dialog :title="title" :visible.sync="pointBlean">
      <el-form :model="point">
        <el-form-item label="商品ID: " :label-width="formLabelWidth">
          {{point.product_id}}
        </el-form-item>
        <el-form-item label="已售数量: " :label-width="formLabelWidth">
          {{point.sale_num}}
        </el-form-item>
        <el-form-item label="限换总量: " :label-width="formLabelWidth">
          {{point.exchange_num}}
        </el-form-item>
        <el-form-item label="是否特惠: " :label-width="formLabelWidth">
          {{point.is_discount}}
        </el-form-item>
        <el-form-item label="是否推荐: " :label-width="formLabelWidth">
          {{point.is_recommend}}
        </el-form-item>
        <el-form-item label="快递付费: " :label-width="formLabelWidth">
          {{point.express_state}}
        </el-form-item>
        <el-form-item label="上架状态: " :label-width="formLabelWidth">
          {{point.state}}
        </el-form-item>
        <!-- <el-form-item label="XXXX: " :label-width="formLabelWidth">
          {{point.XXXX}}
        </el-form-item> -->
      </el-form>
    </el-dialog>
     <!-- 商品编辑弹窗 -->
    <el-dialog :title="title" :visible.sync="opening_change_ifShow">
      <el-form :model="form">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="point.name"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-select v-model="point.classification" placeholder="请选择商品分类">
            <el-option
              v-for="item in classificationList"
              :key="item.cat_id"
              :label="item.cat_name"
              :value="item.cat_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加入推荐区" :label-width="formLabelWidth">
          <el-select v-model="form.recommend" placeholder="请选择是否加入推荐区">
            <el-option
              v-for="item in recommendList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加入限时特惠" :label-width="formLabelWidth">
          <el-select v-model="form.preferential" placeholder="请选择是否加入限时特惠">
            <el-option
              v-for="item in preferentialList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="特惠时间" :label-width="formLabelWidth" v-show="form.timeShow">
          <el-date-picker
            :clearable = false
            v-model="form.time_value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="快递付费方式" :label-width="formLabelWidth">
          <el-select v-model="form.express" placeholder="请选择快递付费方式">
            <el-option
              v-for="item in expressList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货架状态" :label-width="formLabelWidth">
          <el-select v-model="form.goodsShelves" placeholder="请选择货架状态">
            <el-option
              v-for="item in goodsShelvesList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="productSpecificationsList"
            border
            style="width: 100%"
          >
            <el-table-column 
              label="序号"
              type="index" 
              width="80"
            >
            </el-table-column>
            <el-table-column 
              prop="gg" 
              label="规格" 
              width="120"
            >
            </el-table-column>
            <el-table-column 
              prop="yuan_price" 
              label="价格" 
              width="100"
            >
            </el-table-column>
            <el-table-column 
              prop="yuan_quantity" 
              label="库存" 
              width="120"
            >
            </el-table-column>
            <el-table-column label="橘宝价" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
             <el-table-column label="原价" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.original_price"></el-input>
              </template>
            </el-table-column>
             <el-table-column label="特惠价">
              <template slot-scope="scope">
                <el-input v-model="scope.row.discount_price"></el-input>
              </template>
            </el-table-column>
             <el-table-column label="限购数量" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.exchange_num"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="modify_delete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="opening_change_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_saveChanges">保存</el-button>
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
import { shop_search_jvbao , product_cate_jvbao , product_edit_jvbao , shop_edit_content_jvbao } from "../../utils/axios";
export default {
  data() {
    return {
      shop_search_jvbao_list: [], //橘宝商城列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_shop_list),
      O_message : {},
      formLabelWidth: "100px",
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      options: [{
        value: '1',
        label: '已上架'
      }, {
        value: '2',
        label: '已下架'
      }],
      typeList: [{
        value: '1',
        label: '优惠'
      }, {
        value: '2',
        label: '推荐'
      }],
      levelList: [
      { 
        value: '1',
        label: '包邮'
      }, {
        value: '2',
        label: '到付'
      }, {
        value: '3',
        label: '有运费'
      }],
      point:{
        classification:"",
        name:""
      },//查看详情
      pointBlean:false,
      pick_condition: '',
      pick_value : '',
      pageSize : 20,
      levelValue :'',
      levelType : '',
      form_X: {
        level: "",
      },
      title : '修改等级',
      opening_change_ifShow : false,
      product_cate_list : [],
      product_cate_value : '',
      height:"",
      form : {
        name : '', //商品名称
        classification : '',
        recommend : '',
        preferential : '',
        express : '',
        goodsShelves : '',
        time_value : '',
        timeShow : false
      },
      recommendList : [
        { 
          value: '1',
          label: '是'
        },
        { 
          value: '2',
          label: '否'
        }
      ],
      preferentialList : [
        { 
          value: '1',
          label: '是'
        },
        { 
          value: '2',
          label: '否'
        }
      ],
      expressList : [
        { 
          value: '1',
          label: '包邮'
        },
        { 
          value: '2',
          label: '到付'
        },
        { 
          value: '3',
          label: '有邮费'
        }
      ],
      goodsShelvesList : [
        { 
          value: '1',
          label: '上架'
        },
        { 
          value: '2',
          label: '下架'
        }
      ],
      classificationList : [],
      productSpecificationsList : [],
      save_delete_productId : ''
    };
  },

  watch:{

    'form.preferential':{
      handler:function(news,olds){
        if(news == 1){
          this.form.timeShow = true
        } else {
          this.form.timeShow = false
        }
      },
      immediate:true
    },

  },

  created() {
    this.get_product_cate();//获取商品分类
    this.get_shop_list(); //获取橘宝商城列表
    this.height = document.body.clientHeight - 240
  },

  methods: {
    openPoint(item){
      console.log(item)
      this.point = item
      this.pointBlean = true
    },
    //获取橘宝商城列表
    get_shop_list (index) {
      this.pick_condition = ''
      this.pick_value = ''
      this.levelValue = ''
      this.levelType = ''
      this.product_cate_value = ''
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      shop_search_jvbao(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              if(element.discount_start_time == 0) {
                element.discount_start_time = '---'
              }
              if(element.discount_end_time == 0) {
                element.discount_end_time = '---'
              }
              if(element.create_time == 0) {
                element.create_time = '---'
              }
              if(element.update_time == 0) {
                element.update_time = '---'
              }
              if(element.category_id == 0) {
                element.category_id = '暂无'
              }
              if(that.product_cate_list.length > 0) {
                that.product_cate_list.forEach(element_copy => {
                  if(element.category_id == element_copy.cat_id) {
                    element.category_id = element_copy.cat_name
                  }
                })
              }
            });
            that.shop_search_jvbao_list = res.data.err_msg.list
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

    //获取商品分类
    get_product_cate () {
      let that = this
      product_cate_jvbao(

      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.product_cate_list = res.data.err_msg.list
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

    //分页
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      shop_search_jvbao(
        {
          page : page,
          page_size: number,
          cate : this.product_cate_value,
          product : this.levelType,
          status : this.pick_condition,
          express : this.levelValue,
          keyword : this.pick_value
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              if(element.discount_start_time == 0) {
                element.discount_start_time = '---'
              }
              if(element.discount_end_time == 0) {
                element.discount_end_time = '---'
              }
              if(element.create_time == 0) {
                element.create_time = '---'
              }
              if(element.update_time == 0) {
                element.update_time = '---'
              }
              if(element.category_id == 0) {
                element.category_id = '暂无'
              }
              if(that.product_cate_list.length > 0) {
                that.product_cate_list.forEach(element_copy => {
                  if(element.category_id == element_copy.cat_id) {
                    element.category_id = element_copy.cat_name
                  }
                })
              }
            });
            that.shop_search_jvbao_list = res.data.err_msg.list
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
      if(that.pick_condition == '' && that.pick_value == '' && that.levelValue == '' && that.levelType == '' && that.product_cate_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      shop_search_jvbao(
        {
          page : 1,
          page_size: this.pageSize,
          cate : this.product_cate_value,
          product : this.levelType,
          status : this.pick_condition,
          express : this.levelValue,
          keyword : this.pick_value
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              if(element.discount_start_time == 0) {
                element.discount_start_time = '---'
              }
              if(element.discount_end_time == 0) {
                element.discount_end_time = '---'
              }
              if(element.create_time == 0) {
                element.create_time = '---'
              }
              if(element.update_time == 0) {
                element.update_time = '---'
              }
              if(element.category_id == 0) {
                element.category_id = '暂无'
              }
              if(that.product_cate_list.length > 0) {
                that.product_cate_list.forEach(element_copy => {
                  if(element.category_id == element_copy.cat_id) {
                    element.category_id = element_copy.cat_name
                  }
                })
              }
            });
            that.shop_search_jvbao_list = res.data.err_msg.list
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

    //修改商品规格
    modify (index , row) {
      let that = this
      
      that.form_X.level = ''
      this.title = '修改编辑'
      this.save_delete_productId = ''
      this.point.name = row.name
      that.opening_change_ifShow = true
      that.O_message = row
      shop_edit_content_jvbao(
        {
          id : row.id
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.point.name = res.data.err_msg.list.name
            
            that.point.classification = res.data.err_msg.list.cat_name
            that.classificationList = res.data.err_msg.cate
            that.productSpecificationsList = res.data.err_msg.standards
            res.data.err_msg.cate.forEach(element => {
              if(element.cat_id == res.data.err_msg.list.category_id) {
                that.point.classification = element.cat_id
              }
            })
            
            that.form.recommend = res.data.err_msg.list.is_recommend
            that.form.preferential = res.data.err_msg.list.is_discount
            that.form.express = res.data.err_msg.list.express_state
            that.form.goodsShelves = res.data.err_msg.list.state
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

    submit_saveChanges () {
      let that = this
      // if(that.pick_condition == '' && that.pick_value == '' && that.levelValue == '' && that.levelType == '' && that.product_cate_value == '') {
      //   that.$message({
      //     message: '修改的内容不能为空',
      //     type: 'warning'
      //   });
      //   return
      // }
      console.log(this.productSpecificationsList)
      let leg = false
      if(that.point.name == '') {
        leg = true
        that.$message({
          message: '请填写商品名称',
          type: 'warning'
        });
        return;
      }
      if(!that.point.classification) {
        leg = true
        that.$message({
          message: '请填写商品分类',
          type: 'warning'
        });
        return;
      }
      
      if(that.form.preferential == 1 && that.form.time_value == '') {
        leg = true
        that.$message({
          message: '请选择特惠时间',
          type: 'warning'
        });
        return;
      }
      this.productSpecificationsList.forEach(element => {
        if (parseInt(element.original_price) < 1 ) {
          leg = true
          that.$message({
            message: '商品原价需大于一元',
            type: 'warning'
          });
          return;
        }
        if (parseInt(element.price) < 1 ) {
          leg = true
          that.$message({
            message: '商品橘宝价需大于一',
            type: 'warning'
          });
          return;
        }
        if (parseInt(element.discount_price) < 1 ) {
          leg = true
          that.$message({
            message: '商品活动价需大于一元',
            type: 'warning'
          });
          return;
        }
        if (parseInt(element.exchange_num	) < 0 ) {
          leg = true
          that.$message({
            message: '商品限购数量需大于零',
            type: 'warning'
          });
          return;
        }
      })
      if(leg == true) {
        return
      }
      let result = []
      if (this.productSpecificationsList.length > 0) {
        this.productSpecificationsList.forEach(element => {
          let arr = []
          arr.push(element.id)
          arr.push(element.price	)
          arr.push(element.original_price)
          arr.push(element.discount_price)
          arr.push(element.exchange_num)
          arr.push(1)
          console.log(arr)
          result.push(arr)
        })
      }
      console.log(result)
      product_edit_jvbao(
        {
          id : this.O_message.id,
          name : this.point.name,
          result : JSON.stringify(result),
          del_str :  this.save_delete_productId,
          cate : this.point.classification ? this.point.classification : 0,
          recommend : this.form.recommend,
          discount : this.form.preferential,
          express_state : this.form.express,
          state : this.form.goodsShelves,
          start_time : this.form.time_value[0],
          end_time : this.form.time_value[1]
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
            // that.get_shop_list();
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
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
    },

    //删除商品规格
    modify_delete (index , row) {
      let that = this
      this.$confirm('此操作将删除该规格, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(that.save_delete_productId == '') {
            that.save_delete_productId = row.id
          } else {
            that.save_delete_productId = that.save_delete_productId + ',' + row.id
          }
          console.log(that.save_delete_productId)
          that.productSpecificationsList.splice(index,1)
          console.log(that.productSpecificationsList)
          that.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
                 
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
  width: 1100px !important;
}

/deep/ .el-dialog__body {
  height: 450px;
  overflow-y: auto;
}

/deep/ .el-form-item {
  margin-left: 10px;
}

/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/deep/ .el-form-item {
  width: 450px;
  .el-input {
    width: 223px;
  }
}

.dialog_title {
  display: flex;
  /deep/ .el-input {
    width: 80%;
  }
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