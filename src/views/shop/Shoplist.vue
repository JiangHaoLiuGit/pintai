<template>
  <div class="goodsindex">
    
    <div class="seach_copy">
      <div class="seach_select">
         <el-select v-model="pick_condition" placeholder="请选择搜索条件">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="pick_value" @keyup.enter.native="pick_seach" placeholder="请输入搜索内容"></el-input>
        <el-select v-model="cate_value" placeholder="请选择主营类目">
        <el-option
          v-for="item in cate_list"
          :key="item.cat_id"
          :label="item.name"
          :value="item.cat_id">
        </el-option>
      </el-select>
      <el-select v-model="provinceValue" placeholder="请选择省份">
        <el-option
          v-for="item in provinceList"
          :key="item.province_id"
          :label="item.name"
          :value="item.province_id">
        </el-option>
      </el-select>
      <el-select v-model="cityValue" placeholder="请选择市" v-show="city_ifShow">
        <el-option
          v-for="item in cityList"
          :key="item.city_id"
          :label="item.name"
          :value="item.city_id">
        </el-option>
      </el-select>
      <el-select v-model="areaValue" placeholder="请选择区"  v-show="area_ifShow">
        <el-option
          v-for="item in areaList"
          :key="item.area_id"
          :label="item.name"
          :value="item.area_id">
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
          :data="storeList"
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
            prop="tel" 
            label="手机号" 
            width="150"
          >
          </el-table-column>
         <el-table-column 
            prop="phone" 
            label="用户账号"
          >
          </el-table-column>
          <el-table-column 
            prop="user_name" 
            label="用户昵称" 
          >
          </el-table-column>
          <el-table-column 
            prop="uid" 
            label="用户ID" 
          >
          </el-table-column>
          <el-table-column 
            prop="name" 
            label="店铺名称" 
            width="160"
          >
          </el-table-column>
          <el-table-column 
            prop="nickname" 
            label="店主" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="store_id" 
            label="店铺ID" 
            width="80"
          >
          </el-table-column>
          <el-table-column 
            label="主营类目" 
          >
            <template slot-scope="scope">
              {{scope.row.cat_fname ? scope.row.cat_fname : ''}} {{scope.row.cat_name ? '>>' + scope.row.cat_name : ''}}
            </template>
          </el-table-column>
          <el-table-column label="所属区域">
            <template slot-scope="scope">
              {{scope.row.province ? scope.row.province + '、' : ''}} {{scope.row.city ? scope.row.city + '、' : ''}} {{scope.row.area}}
            </template>
          </el-table-column>
          <el-table-column label="操作"  width="480">
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
                v-show="scope.row.status == 0"
                >启用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-show="scope.row.status == 1"
                @click="stop_useing(scope.$index, scope.row)"
                >停用</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="handleEdit(scope.$index, scope.row)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="enter_store(scope.$index, scope.row)"
                >进店</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="store_chat(scope.$index, scope.row)"
                >查看聊天记录</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 店铺信息弹窗/修改店铺信息弹窗 -->
    <el-dialog :title="title" :visible.sync="shop_change_ifShow">
      <div class="dialog_left">
         <el-form :model="form_shop_detail">
          <el-form-item label="店铺ID" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.id" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="店主" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.shopkeeper" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="可提现余额" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.balance" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="营业额" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.turnover" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="创建时间" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.time" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="所属区域" :label-width="formLabelWidth" v-show="!details_ifShow">
            <el-input v-model="form_shop_detail.region" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="所属区域(原)" :label-width="formLabelWidth" v-show="details_ifShow">
            <el-input v-model="form_shop_detail.region" autocomplete="off"  disabled></el-input>
          </el-form-item>
         <el-form-item label="所属区域(市)" :label-width="formLabelWidth" v-show="details_ifShow">
            <el-select v-model="cityValue_copy" placeholder="请选择市">
              <el-option
                v-for="item in cityList_copy"
                :key="item.city_id"
                :label="item.name"
                :value="item.city_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog_right">
        <el-form :model="form_shop_detail">
          <el-form-item label="店铺名称" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.shopName" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.tel" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <!-- <el-form-item label="待提余额" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.remainingSum" autocomplete="off"  disabled></el-input>
          </el-form-item> -->
          <el-form-item label="订单数" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.orderNum" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="主营类目" :label-width="formLabelWidth" v-if="!details_ifShow">
            <el-input v-model="form_shop_detail.category" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="主营类目" :label-width="formLabelWidth" v-if="details_ifShow">
            <el-select v-model="form_shop_detail.category_copy" placeholder="请选择主营类目">
              <el-option
                v-for="item in cate_list"
                :key="item.cat_id"
                :label="item.name"
                :value="item.cat_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保障金" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.ketubbah" autocomplete="off"  disabled></el-input>
          </el-form-item>
           <el-form-item label="所属区域(省)" :label-width="formLabelWidth" v-show="details_ifShow">
            <el-select v-model="provinceValue_copy" placeholder="请选择省份">
              <el-option
                v-for="item in provinceList"
                :key="item.province_id"
                :label="item.name"
                :value="item.province_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域(区)" :label-width="formLabelWidth" v-show="details_ifShow">
            <el-select v-model="areaValue_copy" placeholder="请选择区">
              <el-option
                v-for="item in areaList_copy"
                :key="item.area_id"
                :label="item.name"
                :value="item.area_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
     
      <div slot="footer" class="dialog-footer" v-show="details_ifShow">
        <el-button @click="shop_change_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_saveChanges_shopDetail">保存</el-button>
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
import publicFile from '../../utils/publicFile'
import { store_list , store_detail , save_detail , store_change_status , get_cate , get_province , get_city , get_area } from "../../utils/axios";
export default {
  data() {
    return {
      storeList: [], //店铺列表
      loading : false,
      dialogFormVisible: false,
      formLabelWidth: "100px",
      fn1: this.commonJs.Debounce(this.get_store_list),
      shop_change_ifShow : false,
      form_shop_detail: {
        id : "",//店铺ID
        shopkeeper : '',//店主
        balance : '',//可提现余额
        turnover : '',//营业额
        time : '',//创建时间
        region : '',//所属区域
        shopName : '',//店铺名称
        tel : '',//手机号
        // remainingSum : '',//待提余额
        orderNum : '',//订单数
        category : '',//主营类目
        ketubbah : '',//保障金
        category_copy : ''
      },
      title : '修改密码',
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      father_menu : [],
      options: [{
          value: 'phone',
          label: '手机号'
        }, {
          value: 'store_name',
          label: '店铺名称'
        }, {
          value: 'name',
          label: '店主姓名'
        }, {
          value: 'id',
          label: '店铺ID'
        }, {
          value: 'uid',
          label: '用户id'
        }, {
          value: 'user_name',
          label: '用户昵称'
        }
        , {
          value: 'user_phone',
          label: '用户账号'
        }
        ],
        pick_condition: '',
        pick_value : '',
        pageSize : 20,
        cate_list :[], // 主营类目列表
        cate_value :'',
        provinceList :[], //省
        provinceValue :'',
        cityList :[],//市
        cityValue :'',
        city_ifShow : false,
        areaList :[],//区
        areaValue :'',
        area_ifShow : false,
        details_ifShow : false,
        provinceValue_copy : '',
        areaValue_copy : '',
        areaList_copy : [],
        cityValue_copy : '',
        cityList_copy : [],
        height:"",
    };
  },

  watch:{

    provinceValue:{
      handler:function(news,olds){
        if(news){
          this.city_ifShow = true
          this.cityValue = ''
          this.areaValue = ''
          this.area_ifShow = false
          this.get_city(news)
        } else {
          this.city_ifShow = false
          this.cityValue = ''
          this.areaValue = ''
          this.area_ifShow = false
        }
      }
    },

    cityValue:{
      handler:function(news,olds){
        console.log(news)
        if(news){
          this.area_ifShow = true
          this.get_area(news)
        } else {
          this.area_ifShow = false
        }
      }
    },

    provinceValue_copy:{
      handler:function(news,olds){
        if(news){
          this.cityValue_copy = ''
          this.areaValue_copy = ''
          this.get_city_copy(news)
        } else {
          this.cityValue_copy = ''
          this.areaValue_copy = ''
        }
      }
    },

    cityValue_copy:{
      handler:function(news,olds){
        console.log(news)
        if(news){
          this.get_area_copy(news)
        }
      }
    },

  },

  created() {
    this.get_store_list(); //获取店铺列表
    this.get_cate() //获取主营类目
    this.get_province() //获取省份
    this.height = document.body.clientHeight - 240
    console.log(this.height)
  },

  methods: {

    //获取店铺列表
    get_store_list (index) {
      this.pick_condition = ''
      this.pick_value = ''
      this.cate_value = ''
      this.provinceValue = ''
      this.cityValue = ''
      this.areaValue = ''
      this.city_ifShow = false
      this.area_ifShow = false
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      store_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.storeList = res.data.err_msg.list
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

    // 获取主营类目
    get_cate(){
      let that = this
      get_cate().then(res=>{
        if(res.data.err_code==0){
          that.cate_list = res.data.err_msg || []
        }else{
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
    },

    // 获取省
    get_province(){
      let that = this
      get_province().then(res=>{
        if(res.data.err_code==0){
          if(res.data.err_msg){
            for(let i in res.data.err_msg){
              that.provinceList.push({
                province_id:i,
                name:res.data.err_msg[i]
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

    // 获取市
    get_city(province_id){
      let that = this
      this.cityList = []
      get_city({province_id:province_id}).then(res=>{
        if(res.data.err_code==0){
          if(res.data.err_msg){
            for(let i in res.data.err_msg){
              that.cityList.push({
                city_id:i,
                name:res.data.err_msg[i]
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

    // 获取区
    get_area(city_id){
      let that = this
      this.areaList = []
      get_area({city_id : city_id}).then(res=>{
        if(res.data.err_code==0){
          if(res.data.err_msg){
            for(let i in res.data.err_msg){
              that.areaList.push({
                area_id:i,
                name:res.data.err_msg[i]
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

     // 获取市——编辑
    get_city_copy(province_id){
      let that = this
      this.cityList_copy = []
      get_city({province_id:province_id}).then(res=>{
        if(res.data.err_code==0){
          if(res.data.err_msg){
            for(let i in res.data.err_msg){
              that.cityList_copy.push({
                city_id:i,
                name:res.data.err_msg[i]
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

    // 获取区——编辑
    get_area_copy(city_id){
      let that = this
      this.areaList_copy = []
      get_area({city_id : city_id}).then(res=>{
        if(res.data.err_code==0){
          if(res.data.err_msg){
            for(let i in res.data.err_msg){
              that.areaList_copy.push({
                area_id:i,
                name:res.data.err_msg[i]
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
    //分页
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      store_list(
        {
          page : page,
          page_size: number,
          search : this.pick_condition,
          keyword : this.pick_value,
          cate : this.cate_value,
          province_id : this.provinceValue,
          city_id : this.cityValue,
          area_id : this.areaValue
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.storeList = res.data.err_msg.list
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
      if(that.cate_value == '' && that.pick_condition == '' && that.provinceValue == '' && that.pick_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      } else if (that.pick_condition != '' && that.pick_value == '') {
        that.$message({
          message: '请填写搜索内容',
          type: 'warning'
        });
        return
      } else if (that.pick_condition == '' && that.pick_value != '') {
        that.$message({
          message: '请选择搜索条件',
          type: 'warning'
        });
        return
      }
      that.loading = true
      console.log(this.pick_condition)
      let data = {
        page : 1,
        page_size: this.pageSize,
        search : this.pick_condition,
        keyword : this.pick_value,
        cate : this.cate_value,
        province_id : this.provinceValue,
        city_id : this.cityValue,
        area_id : this.areaValue
      }
      console.log(data)
      store_list(
        data
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.storeList = res.data.err_msg.list
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
      this.$confirm('此操作将启用'+ row.name +'店铺, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store_change_status({
          store_id: row.store_id,
          status : 1,
          reason : '暂无'
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '启用成功',
                type: 'success'
              });
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              // that.get_store_list();
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
      this.$confirm('此操作将停用'+ row.name +'店铺, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store_change_status({
          store_id: row.store_id,
          status : 0,
          reason : '暂无'
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '停用成功',
                type: 'success'
              });
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              // that.get_store_list();
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

    //详情
    handleDetails (index,row) {
      let that = this
      that.title = '店铺详情'
      that.shop_change_ifShow = true
      that.details_ifShow = false
      that.form_shop_detail.id = ''
      that.form_shop_detail.shopkeeper = ''
      that.form_shop_detail.balance = ''
      that.form_shop_detail.turnover = ''
      that.form_shop_detail.time = ''
      that.form_shop_detail.region = ''
      that.form_shop_detail.shopName = ''
      that.form_shop_detail.tel = ''
      that.form_shop_detail.remainingSum = '' 
      // that.form_shop_detail.orderNum = res_s.data.err_msg.orders 
      that.form_shop_detail.category = ''
      that.form_shop_detail.category_copy = ''
      that.form_shop_detail.ketubbah = ''
      that.provinceValue_copy = ''
      that.areaValue_copy = ''
      that.cityValue_copy =''
      that.areaList_copy = []
      that.cityList_copy = []
      store_detail({
        store_id: row.store_id
      })
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.form_shop_detail.id = row.store_id 
            that.form_shop_detail.shopkeeper = row.nickname
            that.form_shop_detail.balance = res_s.data.err_msg.balance
            that.form_shop_detail.turnover = res_s.data.err_msg.sales
            that.form_shop_detail.time = that.commonJs.timestampToTime (res_s.data.err_msg.date_added)
            that.form_shop_detail.region = (row.province ? row.province + '、' : '') + (row.city ? row.city + '、' : '' )+ row.area,//所属区域
            that.form_shop_detail.shopName = row.name 
            that.form_shop_detail.tel = row.tel 
            that.form_shop_detail.remainingSum = row.store_id 
            // that.form_shop_detail.orderNum = res_s.data.err_msg.orders 
            that.form_shop_detail.category = row.cate_name 
            that.form_shop_detail.ketubbah = res_s.data.err_msg.margin_balance 
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
    },

    //修改
    handleEdit(index, row) {
      let that = this
      that.title = '店铺信息修改'
      that.O_message = row
      that.shop_change_ifShow = true
      that.details_ifShow = true
      that.form_shop_detail.id = ''
      that.form_shop_detail.shopkeeper = ''
      that.form_shop_detail.balance = ''
      that.form_shop_detail.turnover = ''
      that.form_shop_detail.time = ''
      that.form_shop_detail.region = ''
      that.form_shop_detail.shopName = ''
      that.form_shop_detail.tel = ''
      that.form_shop_detail.remainingSum = '' 
      // that.form_shop_detail.orderNum = res_s.data.err_msg.orders 
      that.form_shop_detail.category = ''
      that.form_shop_detail.category_copy = ''
      that.form_shop_detail.ketubbah = ''
      that.provinceValue_copy = ''
      that.areaValue_copy = ''
      that.cityValue_copy =''
      that.areaList_copy = []
      that.cityList_copy = []
      store_detail({
        store_id: row.store_id
      })
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.form_shop_detail.id = row.store_id 
            that.form_shop_detail.shopkeeper = row.nickname
            that.form_shop_detail.balance = res_s.data.err_msg.balance
            that.form_shop_detail.turnover = res_s.data.err_msg.sales
            that.form_shop_detail.time = that.commonJs.timestampToTime (res_s.data.err_msg.date_added)
            that.form_shop_detail.region = (row.province ? row.province + '、' : '') + (row.city ? row.city + '、' : '' )+ row.area,//所属区域
            that.form_shop_detail.shopName = row.name 
            that.form_shop_detail.tel = row.tel 
            that.form_shop_detail.remainingSum = row.store_id 
            // that.form_shop_detail.orderNum = res_s.data.err_msg.orders 
            that.cate_list.forEach(element => {
              if(element.cat_id ==  res_s.data.err_msg.sale_category_fid) {
                that.form_shop_detail.category_copy = element.cat_id
                that.form_shop_detail.category = row.cate_name 
              }
            });
            that.form_shop_detail.ketubbah = res_s.data.err_msg.margin_balance 
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
    },

    //店铺信息修改
    submit_saveChanges_shopDetail () {
      let that = this
      if(that.provinceValue_copy != '') {
        if(that.areaValue_copy == '' || that.cityValue_copy == '') {
          that.$message({
            message: '请将所属区域信息填写完整',
            type: 'warning'
          });
          return;
        }
      } 
      save_detail({
        store_id : that.O_message.store_id,
        sale_category_fid	: that.form_shop_detail.category_copy,
        province_id : that.provinceValue_copy ? parseInt(that.provinceValue_copy) : '',
        city_id : that.cityValue_copy ? parseInt(that.cityValue_copy) : '',
        area_id	 : that.areaValue_copy ? parseInt(that.areaValue_copy) : ''
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.shop_change_ifShow = false
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_store_list();
          } else {
            that.shop_change_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.shop_change_ifShow = false
          console.log(error);
        });
    },
    //进店
    enter_store (index, row) {
      // console.log("测试")
      window.open(publicFile.address + "/h5/admin/supplier/index.html#/?url=" + row.uid)
      // window.open("http://localhost:8081/#/?url=" + row.uid)
    },
    //客户聊天
    store_chat (index, item) {
      this.$router.push({path:'/customer/supplierWorkbench',query:{store_id:item.store_id}})
    }
// /customer/supplierWorkbench
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

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
  }
}
/deep/ .el-dialog {
  width: 800px !important;
  /deep/ .el-input {
    overflow-y: auto;  /*溢出隐藏*/
    // text-overflow: ellipsis; /*以省略号...显示*/
    // white-space: nowrap;  /*强制不换行*/
  }
}

/deep/ .el-dialog__body {
  display: flex;
  justify-content: space-between;
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