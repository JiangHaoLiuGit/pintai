<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
         <el-select v-model="pick_condition" placeholder="请选择搜索类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="pick_value" @keyup.enter.native="pick_seach" placeholder="请输入搜索内容"></el-input>
        <el-select v-model="payment_status_value" placeholder="请选择缴费状态">
        <el-option
          v-for="item in payment_status_list"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="shop_status_value" placeholder="请选择店铺状态">
        <el-option
          v-for="item in shop_status_list"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
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
          :data="store_apply_list"
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
            prop="add_time" 
            label="申请时间" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="tel" 
            label="手机号" 
            width="120"
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
            prop="nickname" 
            label="店主" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="store_name" 
            label="店铺名称" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            label="主营类目" 
          >
            <template slot-scope="scope">
              {{scope.row.cat_fname ? scope.row.cat_fname + '>>' : ''}} {{scope.row.cat_name ? '' + scope.row.cat_name : ''}}
            </template>
          </el-table-column>
          <el-table-column label="所属区域">
            <template slot-scope="scope">
              {{scope.row.province ? scope.row.province + '、' : ''}} {{scope.row.city ? scope.row.city + '、' : ''}} {{scope.row.area}}
            </template>
          </el-table-column>
          
          <el-table-column label="缴费状态"  width="110">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                v-if="scope.row.need_pay == 0"
                >无需缴费</el-button
              >
              <el-button
                size="mini"
                type="info"
                v-else-if ="scope.row.is_pay == 1 && scope.row.need_pay == 1"
                >已缴费</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="go_payment(scope.$index, scope.row)"
                v-else-if="scope.row.is_pay == 0 && scope.row.need_pay == 1"
                >未缴费</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="审核状态"  width="110">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                v-if="scope.row.status == 1"
                @click="to_examine(scope.$index, scope.row)"
                >已审核</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="to_examine(scope.$index, scope.row)"
                v-if="scope.row.status == 0"
                >未审核</el-button
              >
              <el-button
                size="mini"
                type="info"
                @click="to_examine(scope.$index, scope.row)"
                v-if="scope.row.status == 2"
                >已拒绝</el-button
              >
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作"  width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                v-if="scope.row.is_pay_online == 1 && scope.row.need_pay == 1"
                >已退</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="refund(scope.$index, scope.row)"
                v-if="scope.row.need_pay == 1 && scope.row.is_pay_online == 1"
                >退款</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </el-col>
    </el-row>

    <!-- 店铺审核弹窗 -->
    <el-dialog :title="title" :visible.sync="shop_examine_change_ifShow" class="dialog1">
      <!-- 左面 -->
      <div>
        <el-form class="form1 clearfix" :model="form_shop_detail">
          <el-form-item class="item1" label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.name" autocomplete="off" disabled></el-input>
          </el-form-item>
          <!-- <el-form-item class="item1" label="手机号" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.tel" autocomplete="off" disabled></el-input>
          </el-form-item> -->
          <el-form-item class="item1" label="所属于区域" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.area" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <!-- <el-form-item class="item1" label="开户行" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.bank" autocomplete="off"  disabled></el-input>
          </el-form-item> -->
          
          

          <!-- <el-form-item class="item1" label="联系地址" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.address" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item class="item1" label="身份证号码" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.idcard" autocomplete="off"  disabled></el-input>
          </el-form-item> -->
          <el-form-item class="item1" label="主营类目" :label-width="formLabelWidth">
            <el-input v-model="form_shop_detail.lm" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item class="item1" label="店铺名称" :label-width="formLabelWidth" >
            <el-input v-model="form_shop_detail.account" autocomplete="off"  disabled></el-input>
          </el-form-item>

          
          <el-form-item class="item1" label="店铺申请表id" :label-width="formLabelWidth">
            <el-input v-model="infoList.id" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item class="item1" label="联系地址" :label-width="formLabelWidth">
            <el-input v-model="infoList.address" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item class="item1" label="手机号" :label-width="formLabelWidth">
            <el-input v-model="infoList.phone" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item class="item1" label="身份证号" :label-width="formLabelWidth">
            <el-input v-model="infoList.id_card" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item class="item1" label="开户行" :label-width="formLabelWidth">
            <el-input v-model="infoList.open_bank" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item class="item1 item2" label="拒绝原因" :label-width="formLabelWidth" v-if="O_message.status == 2">
            <el-input v-model="infoList.bak" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item class="item1" label="银行卡号" :label-width="formLabelWidth">
            <el-input v-model="infoList.bank" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item class="item1" label="申请金额" :label-width="formLabelWidth">
            <el-input v-model="infoList.apply_price" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item class="item1" label="实际支付金额" :label-width="formLabelWidth">
            <el-input v-model="infoList.pay_price" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item class="item1" label="营业执照代码" :label-width="formLabelWidth">
            <el-input v-model="infoList.license_code" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <!-- <el-form-item class="item1" label="身份证图片" :label-width="formLabelWidth">
            <el-image
            :src="infoList.id_card_pic"
            style="width:200px;height:200px"
            :preview-src-list="[infoList.id_card_pic]"
            fit="cover"></el-image>
          </el-form-item> -->
          
          <el-form-item class="item1" label="拒绝原因" :label-width="formLabelWidth" v-if="examine_status == 0">
            <el-input
              type="textarea"
              :rows="2"
              style="min-height:100px"
              placeholder="请输入拒绝原因"
              v-model="form_shop_detail.rejReasons">
            </el-input>
          </el-form-item>
          <el-form-item class="item1" label="" style="width:12px;height:50px;margin-right:0" v-if="examine_status == 0" :label-width="formLabelWidth"></el-form-item>
          <el-form-item class="item1" label="营业执照" :label-width="formLabelWidth">
            <el-image
            :src="infoList.license_pic"
            style="width:200px;height:200px"
            :preview-src-list="[infoList.license_pic]"
            fit="cover"></el-image>
          </el-form-item>
          
          
        </el-form>
      </div>
         
        <div>
          <!-- 列表开始 -->
          <el-row :gutter="20" class="goodsindex-list" v-if="infoList.special_licence.length > 0" style="display:block">
            <el-col :span="24">
              <el-table
                ref="multipleTables"
                :data="infoList.special_licence"
                border
                style="width: 100%"
              >
                <el-table-column label="序号" type="index" width="100">
                </el-table-column>
                <el-table-column
                  prop="licence_name"
                  label="分类许可证列名称"
                ></el-table-column>
                <el-table-column
                  label="分类许可证列名称"
                >
                  <template slot-scope="scope">
                    <el-image
                    :src="scope.row.licence_image"
                    style="width:100px;height:100px"
                    :preview-src-list="[scope.row.licence_image]"
                    fit="cover"></el-image>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        
        
      <div slot="footer" class="dialog-footer" v-if="examine_status == 0">
        <el-button @click="rejection">拒绝</el-button>
        <el-button type="primary" @click="submit_examine_shop">同意</el-button>
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
import { apply_list , pay , apply_info , refuse , adopt} from "../../utils/axios";
export default {
  data() {
    return {
      store_apply_list: [], //店铺列表
      loading : false,
      dialogFormVisible: false,
      formLabelWidth: "100px",
      fn1: this.commonJs.Debounce(this.get_apply_list),
      shop_examine_change_ifShow : false,
      form_shop_detail: {
        name : '',
        tel : '',
        area : '',
        bank : '',
        address : '',
        idcard : '',
        lm : '',
        account : '',
        rejReasons : ''
      },
      title : '',
      O_message : {},
      infoList:{
        special_licence:[]
      },
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
        payment_status_list: [{
          value: '1',
          label: '已缴费'
        }, {
          value: '2',
          label: '未缴费'
        }, {
          value: '3',
          label: '无需缴费'
        }],
        payment_status_value : '',
        shop_status_list: [{
          value: '1',
          label: '已审核'
        }, {
          value: '2',
          label: '未审核'
        }, {
          value: '3',
          label: '已拒绝'
        }],
        shop_status_value : '',
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
        examine_status:"",
        height:"",
    };
  },

  created() {
    this.get_apply_list();//获取店铺审核列表
    this.height = document.body.clientHeight -240
    console.log(this.height)
  },

  methods: {

    //获取店铺审核列表
    get_apply_list (index) {
      this.pick_condition = ''
      this.pick_value = ''
      this.payment_status_value = ''
      this.shop_status_value = ''
      this.time_value = ''
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      apply_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.add_time = that.commonJs.timestampToTime (element.add_time)
            });
            that.store_apply_list = res.data.err_msg.list
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

    //分页
    get_consumer_list_page (page , number) {
      let that = this
      that.loading = true
      apply_list(
        {
          page : page,
          page_size: number,
          search : this.pick_condition,
          keyword : this.pick_value,
          pay_status : this.payment_status_value,
          status : this.shop_status_value ,
          start_time : this.time_value[0],
          end_time : this.time_value[1]
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.add_time = that.commonJs.timestampToTime (element.add_time)
            });
            that.store_apply_list = res.data.err_msg.list
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
      console.log(this.time_value)
      if(this.payment_status_value == '' && this.shop_status_value == '' && this.time_value == '' && this.pick_condition == ''){
        that.$message({
          message: '请选择任意一种搜索条件',
          type: 'warning'
        });
        return
      } else if (this.pick_condition != '') {
        if(this.pick_value == '') {
          that.$message({
            message: '请填写搜索内容',
            type: 'warning'
          });
          return
        }
      }
      apply_list(
        {
          page : 1,
          page_size: this.pageSize,
          search : this.pick_condition,
          keyword : this.pick_value,
          pay_status : this.payment_status_value,
          status : this.shop_status_value ,
          start_time : this.time_value[0],
          end_time : this.time_value[1]
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach(element => {
              element.add_time = that.commonJs.timestampToTime (element.add_time)
            });
            that.store_apply_list = res.data.err_msg.list
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
            that.pageSize = res.data.err_msg.page_size
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

    //点击未缴费
    go_payment (index ,row) {
      let that = this
      this.$confirm('将' + row.store_name + '店铺手动设置为已缴费状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pay(
          {
            store_id : row.id
          }
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.$message({
                message: '设置成功',
                type: 'success'
              });
              that.loading = true
              let timer = setTimeout(() => {
                clearTimeout(timer)
                that.get_consumer_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                // that.get_apply_list();//获取店铺审核列表
              },1000)
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
        return 
      });
    },

    //点击未审核
    to_examine(index ,row) {
      this.examine_status = row.status
      if(this.examine_status == 1){
        this.title = "审核信息"
      }else if(this.examine_status == 0){
        this.title = "店铺审核"
      }
      let that = this
      that.O_message = row
      that.shop_examine_change_ifShow = true
      that.form_shop_detail.name = ''
      that.form_shop_detail.tel = ''
      that.form_shop_detail.area = ''
      that.form_shop_detail.bank = ''
      that.form_shop_detail.address = ''
      that.form_shop_detail.idcard = ''
      that.form_shop_detail.lm = ''
      that.form_shop_detail.account = ''
      that.form_shop_detail.rejReasons = '' 
      apply_info(
        {
          store_id	: row.id	
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.infoList = res.data.err_msg
            that.form_shop_detail.name = row.nickname
            that.form_shop_detail.tel = row.tel
            that.form_shop_detail.area = (row.province ? row.province + '、' : '') + (row.city ? row.city + '、' : '' )+ row.area,//所属区域
            that.form_shop_detail.bank = res.data.err_msg.open_bank 
            that.form_shop_detail.address = res.data.err_msg.address 
            that.form_shop_detail.idcard = res.data.err_msg.id_card
            // that.form_shop_detail.lm = row.cat_fname ? row.cat_fname : '' + row.cat_name && row.cat_name!=null ? '>>' + row.cat_name : ''
            that.form_shop_detail.lm = res.data.err_msg.fcat_name ? res.data.err_msg.fcat_name + ">>" : ''
            that.form_shop_detail.account = row.store_name
            that.form_shop_detail.rejReasons = '' 
            if(res.data.err_msg.scat_name){
              that.form_shop_detail.lm = that.form_shop_detail.lm + res.data.err_msg.scat_name
            }
          } else {
            that.shop_examine_change_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.shop_examine_change_ifShow = false
          console.log(error);
        });
    },

    //退款
    refund(index ,row) {

    },

    //店铺审核
    submit_examine_shop () {
      let that = this
      adopt(
        {
          id : that.O_message.id,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.$message({
              message: '已同意该店铺的申请',
              type: 'success'
            });
            that.shop_examine_change_ifShow = false
            that.get_consumer_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_apply_list();//获取店铺审核列表
          } else {
            that.shop_examine_change_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.shop_examine_change_ifShow = false
          console.log(error);
        });
    },

    //拒绝
    rejection () {
      let that = this 
      if(that.form_shop_detail.rejReasons == '') {
        that.$message({
          message: '请填写拒绝理由',
          type: 'warning'
        });
        return
      }
      refuse(
        {
          store_id : that.O_message.id,
          bak : that.form_shop_detail.rejReasons
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.$message({
              message: '已成功拒绝该店铺的申请',
              type: 'success'
            });
            that.shop_examine_change_ifShow = false
            that.get_consumer_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_apply_list();//获取店铺审核列表
          } else {
            that.shop_examine_change_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.shop_examine_change_ifShow = false
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
  width: 1100px !important;
  /deep/ .el-input {
    overflow-y: auto;  /*溢出隐藏*/
    // text-overflow: ellipsis; /*以省略号...显示*/
    // white-space: nowrap;  /*强制不换行*/
  }
}

/deep/ .el-dialog__body {
  height: 500px;
  overflow-y: auto;
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
/deep/ .dialog1 .el-dialog__body{
  display:block
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

/deep/ .el-textarea__inner{
  min-height: 100px!important;
}
/deep/ .el-table .warning-row {
  background: oldlace;
}
/deep/ .item2 {
  .el-input.is-disabled .el-input__inner{
    color: red;
  }
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
.form1 .item1{
  width: 302;
  float: left;
  margin-right:20px;
}
</style>