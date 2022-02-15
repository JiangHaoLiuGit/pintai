<template>
  <div class="page">
    <el-tabs v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane label="供应商收入" name="first">
        
          <div class="seach_copy">
            <div class="seach_select">
              <el-input
                v-model="name"
                placeholder="请输入店铺名称"
                clearable
                 @keyup.enter.native="pick_seach"
              ></el-input>

              <el-input
                v-model="phone"
                placeholder="请输入账号"
                clearable
                 @keyup.enter.native="pick_seach"
              ></el-input>
            </div>
            <div class="button_type">
              <el-button type="primary" @click="pick_seach">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
                >刷新</el-button
              >
            </div>
          </div>
        <!-- 主播列表开始 -->
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              :data="extendList"
              border
              :height="height"
              style="width: 100%"
            >
              <el-table-column label="序号" type="index" width="60">
              </el-table-column>
              <el-table-column
                prop="add_time"
                label="添加时间"
                
              ></el-table-column>
              <el-table-column
                prop="phone"
                label="店铺账号"
                width="140"
              ></el-table-column>
              <el-table-column
                label="店铺名称"
                width="240"
              >
                <template slot-scope="scope">{{scope.row.store_id == 0 ? "平台自营": scope.row.name}}</template>
              </el-table-column>
              <el-table-column
                prop="store_id"
                label="店铺id"
                
              ></el-table-column>
              
              
              <el-table-column
                prop="already_paid"
                label="已打款"
              ></el-table-column>

              <el-table-column
                prop="already_settled"
                label="已结算"
              ></el-table-column>
              <el-table-column
                prop="un_settled"
                label="未结算"
                
              ></el-table-column>
              <!-- auto_settled -->
              <el-table-column
                label="是否自动结算"
              >
                <template slot-scope="scope">{{scope.row.auto_settled == 0 ? "否":"是"}}</template>
              </el-table-column>
              <el-table-column
                prop="balance"
                label="可提现余额"
                
              ></el-table-column>
              
              
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
      </el-tab-pane>
      <el-tab-pane label="供应商提现" name="second">
          <div class="seach_copy">
            <div class="seach_select">
              <el-input
                v-model="keywords"
                placeholder="请输入店铺名称"
                 @keyup.enter.native="pick_seach1"
                clearable
              ></el-input>
              <el-input
                v-model="anchor_id"
                 @keyup.enter.native="pick_seach1"
                type="number"
                placeholder="请输入账号"
              ></el-input>
                <el-select
                v-model="live_id"
                class="el-inpu"
                placeholder="状态选择"
              >
                
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                
                </el-option>
              </el-select>
              <el-select
                  v-model="pick_condition2"
                  class="el-inpu"
                  placeholder="请选择搜索时间类型"
                >
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              <el-date-picker
                :clearable="false"
                v-model="time_value1"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
              
            
            </div>
            <div class="button_type">
              <el-button type="success" @click="user_derive_excel1">导出</el-button>
              <el-button type="primary" @click="pick_seach1">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="fn2(1)"
                >刷新</el-button
              >
            </div>
          </div>
        <!-- 用户提现列表 -->
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              :data="extendList1"
              border
              :height="height"
              style="width: 100%"
            >
              <el-table-column label="序号" type="index">
              </el-table-column>
              <el-table-column
                prop="order_no"
                label="订单号"
              ></el-table-column>
              <el-table-column
                prop="apply_time"
                label="申请日期"
                width="140"
              ></el-table-column>
              <el-table-column
                prop="payment_time"
                label="完成时间"
                width="140"
              ></el-table-column>
              <el-table-column
                prop="phone"
                label="供应商账号"
              ></el-table-column>
              <el-table-column
                label="供应商名称"
                width="140"
              >
                <template slot-scope="scope">
                  {{scope.row.store_id == 0 ? "平台自营": scope.row.name}}
                </template>
              </el-table-column>
              <el-table-column
                prop="store_id"
                label="供应商id"
              ></el-table-column>
              <el-table-column
                label="提现类型"
              >
                <template slot-scope="scope">
                    <div v-if="scope.row.type == 0">银行卡</div>
                    <div v-else-if="scope.row.type == 1">微信</div>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
              >
                <template slot-scope="scope">
                    <div v-if="scope.row.status == -1">审核未通过</div>
                    <div v-else-if="scope.row.status == 0">待审核</div>
                    <div v-else-if="scope.row.status == 1">审核通过</div>
                    <div v-else-if="scope.row.status == 2">打款成功</div>
                    <div v-else-if="scope.row.status == 3">打款失败</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="apply_amount"
                label="申请金额"
              ></el-table-column>
              <el-table-column
                prop="current_amount"
                label="当前金额"
              ></el-table-column>
              <el-table-column
                prop="surplus_amount"
                label="提现后剩余金额"
              ></el-table-column>
              <el-table-column
                prop="bond_withdrawal_ratio"
                label="提现服务费"
              ></el-table-column>
              <el-table-column
                prop="real_amount"
                label="实际金额"
              ></el-table-column>
              
              
              <!-- <el-table-column
                prop="already_paid"
                label="已打款金额"
              ></el-table-column>
              <el-table-column
                prop="already_settled"
                label="已结算金额"
              ></el-table-column>
              <el-table-column
                prop="un_settled"
                label="未结算金额"
              ></el-table-column> -->
              
              <el-table-column
                label="操作"
                width="200"
              >
                <template slot-scope="scope">
                    <el-button @click="open(scope.row)" size="mini" round v-if="scope.row.status == 0" type="primary">审核</el-button>
                    <el-button style="margin-top:10px" size="mini" round @click="openPoint(scope.row)" type="info">详细</el-button>
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="reason"
                label="原因"
              ></el-table-column> -->
            </el-table>
          </el-col>
        </el-row>
        <!-- 商品详情弹窗 -->
        <el-dialog title="提现详情" :visible.sync="pointBlean">
          <!-- <el-form :model="point">
            <el-form-item label="原因: " :label-width="formLabelWidth">
              {{point.reason}}
            </el-form-item>
            <el-form-item label="说明: " :label-width="formLabelWidth">
              {{point.remark}}
            </el-form-item>
            <el-form-item label="银行卡名称: " :label-width="formLabelWidth">
              {{point.bank_name}}
            </el-form-item>
            <el-form-item label="姓名: " :label-width="formLabelWidth">
              {{point.full_name}}
            </el-form-item>
            <el-form-item label="开户行: " :label-width="formLabelWidth">
              {{point.open_bank}}
            </el-form-item>
            <el-form-item label="银行卡卡号: " :label-width="formLabelWidth">
              {{point.bank_card}}
            </el-form-item>
          </el-form> -->
          <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  申请金额:
                </div>
                <div class="textDiv">
                  {{broadInfo.apply_amount}}元
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  当前金额:
                </div>
                <div class="textDiv">
                  {{broadInfo.current_amount}}元
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  当前剩余金额:
                </div>
                <div class="textDiv">
                  {{broadInfo.surplus_amount}}元
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  状态:
                </div>
                <div class="textDiv" v-if="broadInfo.status == 0">
                  待审核
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 1">
                  审核通过
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == -1">
                  审核已拒绝
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 2">
                  打款成功
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 3">
                  打款失败
                </div>
                <div class="textDiv" v-else>
                  未知
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  申请时间:
                </div>
                <div class="textDiv">
                  {{broadInfo.apply_time}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  提现服务费:
                </div>
                <div class="textDiv">
                  {{broadInfo.bond_withdrawal_ratio}}元
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  实际金额:
                </div>
                <div class="textDiv">
                  {{broadInfo.real_amount}}元
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  提现类型:
                </div>
                <div class="textDiv" v-if="broadInfo.status == 0">
                  手动提现
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 1">
                  自动提现
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == -1">
                  已拒绝
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 2">
                  打款成功
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 3">
                  打款失败
                </div>
                <div class="textDiv" v-else>
                  未知
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  店铺id:
                </div>
                <div class="textDiv">
                  {{broadInfo.store_id}}
                </div>
              </div>
              
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  店铺名称:
                </div>
                <div class="textDiv">
                  {{broadInfo.store_id == 0 ? "平台自营": broadInfo.name}}
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  银行卡名称:
                </div>
                <div class="textDiv">
                  {{broadInfo.bank_name}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  姓名:
                </div>
                <div class="textDiv">
                  {{broadInfo.full_name}}
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  开户行:
                </div>
                <div class="textDiv">
                  {{broadInfo.open_bank}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  订单号:
                </div>
                <div class="textDiv">
                  {{broadInfo.order_no}}
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  银行卡卡号:
                </div>
                <div class="textDiv">
                  {{broadInfo.bank_card}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  拒绝原因:
                </div>
                <div class="textDiv">
                  {{broadInfo.reason}}
                </div>
              </div>
            </div>
        </el-dialog>
        <!-- 供应商提现审核弹窗 -->
          <el-dialog title="供应商提现审核" :visible.sync="opening_change_ifShow">
            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  申请金额:
                </div>
                <div class="textDiv">
                  {{broadInfo.apply_amount}}元
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  当前金额:
                </div>
                <div class="textDiv">
                  {{broadInfo.current_amount}}元
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  当前剩余金额:
                </div>
                <div class="textDiv">
                  {{broadInfo.surplus_amount}}元
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  状态:
                </div>
                <div class="textDiv" v-if="broadInfo.status == 0">
                  待审核
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 1">
                  审核通过
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == -1">
                  审核已拒绝
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 2">
                  打款成功
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 3">
                  打款失败
                </div>
                <div class="textDiv" v-else>
                  未知
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  申请时间:
                </div>
                <div class="textDiv">
                  {{broadInfo.apply_time}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  提现服务费:
                </div>
                <div class="textDiv">
                  {{broadInfo.bond_withdrawal_ratio}}元
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  实际金额:
                </div>
                <div class="textDiv">
                  {{broadInfo.real_amount}}元
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  提现类型:
                </div>
                <div class="textDiv" v-if="broadInfo.status == 0">
                  手动提现
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 1">
                  自动提现
                </div>
                <div class="textDiv" v-else>
                  未知
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  店铺id:
                </div>
                <div class="textDiv">
                  {{broadInfo.store_id}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  店铺名称:
                </div>
                <div class="textDiv">
                  {{broadInfo.store_id == 0 ? "平台自营": broadInfo.name}}
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  银行卡名称:
                </div>
                <div class="textDiv">
                  {{broadInfo.bank_name}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  姓名:
                </div>
                <div class="textDiv">
                  {{broadInfo.full_name}}
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  开户行:
                </div>
                <div class="textDiv">
                  {{broadInfo.open_bank}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  订单号:
                </div>
                <div class="textDiv">
                  {{broadInfo.order_no}}
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  银行卡卡号:
                </div>
                <div class="textDiv">
                  {{broadInfo.bank_card}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  拒绝原因:
                </div>
                <div class="textDiv">
                  <el-input
                    type="textarea"
                    maxlength="200"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入拒绝内容"
                    show-word-limit
                    v-model="textarea2">
                  </el-input>
                </div>
              </div>
            </div>

            <div slot="footer" class="dialog-footer">
              <el-button type="success" @click="submit_yes"
                >同意</el-button
              >
              <el-button @click="submit_err" type="danger" style="margin-left:20px">拒绝</el-button>
            </div>
          </el-dialog>

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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import publicFile from '../../utils/publicFile'
import { finance_store_list, store_withdrawal_list,store_withd } from "../../utils/axios";
import axios from 'axios'

export default {
  data() {
    return {
      opening_change_ifShow:false,
      activeTab: "first",
      broadId: "",
      extendList: [], 
      extendList1:[],
      fn1: this.commonJs.Debounce(this.get_agent_list),
      fn2: this.commonJs.Debounce(this.get_agent_list1),
      broadInfo:{},
      textarea2:"",
      options1: [
        {
          value: "-100",
          label: "全部",
        },
        {
          value: 0,
          label: "待审核",
        },
        {
          value: 1,
          label: "审核通过",
        },
        {
          value: -1,
          label: "已拒绝",
        },
        {
          value: 2,
          label: "打款成功",
        },
        {
          value: 3,
          label: "打款失败",
        },
      ],
      queryInfo: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      queryInfo1: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      options2: [
        {
          value: 1,
          label: "完成时间",
        },
        {
          value: 2,
          label: "申请时间",
        }
      ],
      pick_condition2:"",
      live_id:"-100",
      keywords:"",
      phone: "",
      anchor_id: "",
      name: "",
      time_value1: "",
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
      formLabelWidth:"100px",
      loading: false,
      point:{},//查看详情
      pointBlean:false,
      height:"",
    };
  },
  watch:{
    opening_change_ifShow:{
      handler(val){
        if(!val){
          this.textarea2 = ''
        }
      }
    }
    
  },
  created() {
      this.get_agent_list();
      this.height = document.body.clientHeight - 300
  },
  methods: {
    openPoint(item){
      console.log(item)
      this.point = item
      this.broadInfo = item
      this.pointBlean = true
    },
    submit_yes(){
      this.$confirm('此操作将同意供应商 ' + this.broadInfo.name + ' 的提现审核, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var date = {
          id:this.broadInfo.id,
          status:1
        }
        store_withd(
          date
        ).then((res) => {
          if(res.data.err_code == 0){
              this.$message({
                message: "审核已通过",
                type: "success",
              });
              this.get_shop_list_page1(this.queryInfo1.page,this.queryInfo1.pageSize)
              this.opening_change_ifShow = false
            }else{
              this.$message({
                showClose: true,
                message: res.data.err_msg,
                type: "error",
              });
            }
        }).catch((res) => {
          console.log(res)
        })
      }).catch(() => {
        
      });
      
    },
    submit_err(){
      if(this.textarea2 == ""){
        this.$message({
          message: "请填写拒绝原因",
          type: "warning",
        });
        return;
      }else{
        this.$confirm('此操作将拒绝供应商 ' + this.broadInfo.name + ' 的提现审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var date = {
            id:this.broadInfo.id,
            status:-1,
            reason:this.textarea2
          }
          store_withd(
            date
          ).then((res) => {
            if(res.data.err_code == 0){
                this.$message({
                  message: "审核已拒绝",
                  type: "success",
                });
                this.this.textarea2 = ''
                this.opening_change_ifShow = false
                this.get_shop_list_page1(this.queryInfo1.page,this.queryInfo1.pageSize)
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.err_msg,
                  type: "error",
                });
              }
          }).catch((res) => {
            console.log(res)
          })
        }).catch(() => {
          
        });
        
      }
      
    },
    open(value){
      console.log(value)
      this.opening_change_ifShow = true
      this.broadInfo = value
    },
    tabClick(tab, event) {
      console.log(tab, event);
      if (tab.$options.propsData.label == "供应商提现") {
        this.get_agent_list1();
      }else{
        this.get_agent_list();
      }
    },
    pick_seach(index) {
      let that = this;
      if (
        that.phone == "" &&
        that.name === ""
      ) {
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
        phone: that.phone,
        name: that.name,
      };
      //搜索
      finance_store_list(request_form)
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
      let that = this;
      that.loading = true;

      finance_store_list({
        page: page,
        page_size: number,
        phone: that.phone,
        name: that.name,
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
    get_agent_list(index) {
      this.phone = "";
      this.name = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      finance_store_list(request_form)
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

    //导出
    // async 
    user_derive_excel1(){
      let that = this;
      if(this.pick_condition2 != '' || this.time_value1 != ''){
        if(this.time_value1 == '' || this.pick_condition2 == ''){
          that.$message({
            message: "请完善时间类型",
            type: "warning",
          });
          return;
        }
      }
      var time1 = "";
      var time2 = "";
      if (this.time_value1 != "") {
        time1 = this.commonJs.dataTime(this.time_value1[0]);
        time2 = this.commonJs.dataTime(this.time_value1[1]);
      }
      if(that.live_id === ''){
        that.live_id = -100
      }
      let request_form = {
        page: 1,
        page_size: 20,
        phone: that.anchor_id,
        status: that.live_id,
        time_type: that.pick_condition2,
        name: that.keywords,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      store_withdrawal_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            if(res.data.err_msg.list.length == 0){
              that.$message({
                showClose: true,
                message: "暂无数据",
                type: "error",
              });
            }else{
              window.open(publicFile.address + "/new_admin.php?c=finance&a=store_derive_excel&phone="+ that.anchor_id 
              +"&status="+ that.live_id 
              +"&name="+ that.keywords 
              +"&time_type="+ that.pick_condition2 
              +"&start_time="+ time1 +"&end_time="+ time2)
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
    pick_seach1(index) {
      let that = this;
      if (
        that.anchor_id == "" &&
        that.live_id === "" &&
        that.keywords === "" &&
        that.pick_condition2 === "" &&
        that.time_value1 == ""
      ) {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      if(this.pick_condition2 != '' || this.time_value1 != ''){
        if(this.time_value1 == '' || this.pick_condition2 == ''){
          that.$message({
            message: "请完善时间类型",
            type: "warning",
          });
          return;
        }
      }
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value1 != "") {
        time1 = this.commonJs.dataTime(this.time_value1[0]);
        time2 = this.commonJs.dataTime(this.time_value1[1]);
      }
      if(that.live_id === ''){
        that.live_id = -100
      }
      let request_form = {
        page: 1,
        page_size: 20,
        phone: that.anchor_id,
        status: that.live_id,
        name: that.keywords,
        time_type: that.pick_condition2,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      store_withdrawal_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.apply_time = this.commonJs.timestampToTime(
                item.apply_time
              );
              item.payment_time = this.commonJs.timestampToTime(item.payment_time);
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
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
    //每页显示条数改变
    handleSizeChange1(val) {
      this.get_shop_list_page1(1, val);
    },

    //当前页
    handleCurrentChange1(val) {
      this.get_shop_list_page1(val, this.queryInfo1.pageSize);
    },
    //分页
    get_shop_list_page1(page, number) {
      let that = this;
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value1 != "") {
        time1 = this.commonJs.dataTime(this.time_value1[0]);
        time2 = this.commonJs.dataTime(this.time_value1[1]);
      }

      store_withdrawal_list({
        page: page,
        page_size: number,
        phone: that.anchor_id,
        status: that.live_id,
        time_type: that.pick_condition2,
        live_id: that.status,
        name: that.keywords,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.apply_time = this.commonJs.timestampToTime(
                item.apply_time
              );
              item.payment_time = this.commonJs.timestampToTime(item.payment_time);
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
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
    get_agent_list1(index) {
      this.anchor_id = "";
      this.live_id = "-100";
      this.pick_condition2 = ''
      this.keywords = "";
      this.time_value1 = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
        status: -100,
      };
      store_withdrawal_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.apply_time = this.commonJs.timestampToTime(
                item.apply_time
              );
              item.payment_time = this.commonJs.timestampToTime(item.payment_time);
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
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
  margin-top: 20px;
  /deep/ .el-input {
    width: 200px;
    margin: 0 20px 0 10px;
  }
}
.seach_copy {
  padding-top: 20px;
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
.divRow{
  margin: 15px 0;
  .boxDiv{
    width: 50%;
    float: left;
    font-size: 15px;
    .labelDiv{
      width: 20%;
      float: left;
      text-align: right;
      line-height: 20px;
    }
    .textDiv{
      padding-left:13px;
      box-sizing:border-box;
      width: 80%;
      float:left;
      line-height: 20px;
    }
  }
}
/deep/ .el-form-item {
  width: 450px;
  .el-input {
    width: 223px;
  }
}

/deep/ .el-dialog {
  width: 1100px !important;
}
/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
