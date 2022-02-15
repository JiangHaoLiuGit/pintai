<template>
  <div class="page">
    <el-tabs v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane label="用户收入" name="first">
        <div v-show="activeName == 'first'">
          <div class="seach_copy">
            <el-input
              v-model="anchor_id1"
              placeholder="请输入关键字"
               @keyup.enter.native="pick_seach1"
            ></el-input>
            <div class="button_type">
              
              <el-button type="primary" @click="pick_seach1">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
                >刷新</el-button
              >
            </div>
          </div>
          <!-- 收入列表 -->
          <el-row :gutter="20" class="goodsindex-list">
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="extendList"
                border
                :height="height"
                style="width: 100%"
              >
                <el-table-column label="序号" type="index" width="50">
                </el-table-column>
                <el-table-column
                  prop="nickname"
                  label="用户昵称"
                ></el-table-column>
                <el-table-column
                  prop="uid"
                  label="用户id"
                ></el-table-column>
                <el-table-column
                  prop="phone"
                  label="用户手机号"
                ></el-table-column>
                <el-table-column
                  prop="cash"
                  label="可提现余额"
                ></el-table-column>
                <el-table-column
                  prop="cash_count"
                  label="累计收益"
                ></el-table-column>
                <el-table-column
                  prop="cash_freeze"
                  label="累计提现金额"
                ></el-table-column>
                <el-table-column
                  prop="withdrawal_amount"
                  label="审核中的金额"
                ></el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="success"
                      @click="handleClick(scope.row.uid)"
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
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
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
        <div v-show="activeName == 'second'">
          <div class="seach">
            <el-select
              v-model="pick_condition"
              class="el-inpu"
              placeholder="请选择分润类型"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <div class="el-inpu inlineBlock">
              <el-input
                v-model="nickname"
                placeholder="请输入关键字"
                clearable
              ></el-input>
            </div>
          </div>
          <div class="seach_copy">
            <div class="seach_select">
              <div class="seach_select">
                <el-input
                  v-model="anchor_id"
                  type="number"
                   @keyup.enter.native="pick_seach"
                  placeholder="请输入用户id"
                ></el-input>

                <el-date-picker
                  :clearable="false"
                  v-model="time_value"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="button_type">
              
              <el-button type="primary" @click="pick_seach">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="fn2(1)"
                >刷新</el-button
              >
              <el-button type="primary" @click="activeName = 'first'"
                >返回</el-button
              >
            </div>
          </div>
          <!-- 收入详情列表 -->
          <el-row :gutter="20" class="goodsindex-list">
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="extendList1"
                border
                style="width: 100%"
              >
                <el-table-column label="序号" type="index" width="50">
                </el-table-column>
                <el-table-column
                  prop="id"
                  label="账单id"
                  width="200"
                ></el-table-column>
                <el-table-column
                  prop="order_no"
                  label="单号"
                  width="200"
                ></el-table-column>
                <el-table-column
                  prop="fx_profit"
                  label="收益金额"
                  width="200"
                ></el-table-column>
                <el-table-column
                  prop="profit_type"
                  label="收益类型分润类型"
                ></el-table-column>
                <el-table-column
                  prop="complate_time"
                  label="完成时间"
                  width="200"
                ></el-table-column>
                <el-table-column
                  prop="nickname"
                  label="用户昵称"
                  width="200"
                ></el-table-column>
                <el-table-column
                  prop="uid"
                  label="用户id"
                  width="200"
                ></el-table-column>
                <el-table-column label="用户手机号" width="200">
                  <template slot-scope="scope">
                    <div>{{ scope.row.phone }}</div>
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
      </el-tab-pane>
      <el-tab-pane label="用户提现" name="second">
          
          <div class="seach_copy">
            <div class="seach_select">
              <div class="seach_select">
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
                  :picker-options="pickerOptions1"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
                <el-select
                  v-model="pick_condition1"
                  class="el-inpu"
                  placeholder="请选择提现状态"
                >
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-input
                    v-model="nickname1"
                    placeholder="昵称/手机号/外部交易单号"
                    clearable
                    @keyup.enter.native="pick_seach2"
                  ></el-input>
              </div>
            </div>
            <div class="button_type">
              <el-button type="success" @click="user_derive_excel1">导出</el-button>
              <el-button type="primary" @click="pick_seach2">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="fn3(1)"
                >刷新</el-button
              >
            </div>
          </div>
          <!-- 收入详情列表 -->
          <el-row :gutter="20" class="goodsindex-list">
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="extendList2"
                border
                :height="height"
                style="width: 100%"
              >
                <el-table-column label="序号" type="index" width="50">
                </el-table-column>
                <el-table-column
                  prop="trade_no"
                  label="交易单号"
                ></el-table-column>
                <el-table-column
                  prop="out_trade_no"
                  label="外部交易单号"
                  width="150"
                ></el-table-column>
                <el-table-column
                  prop="add_time"
                  label="申请时间"
                ></el-table-column>
                <el-table-column
                  prop="complate_time"
                  label="完成时间"
                ></el-table-column>
                <el-table-column
                  prop="nickname"
                  label="用户昵称"
                ></el-table-column>
                <el-table-column
                prop="bank_card_user"
                label="开卡人姓名"
              ></el-table-column>
                <el-table-column
                  prop="phone"
                  label="用户手机号"
                ></el-table-column>
                <el-table-column
                  prop="uid"
                  label="用户id"
                ></el-table-column>
                <!-- <el-table-column
                  prop="store_id"
                  label="店铺id"
                ></el-table-column> -->
                <el-table-column label="账户类型">
                    <template slot-scope="scope">
                        <div v-if="scope.row.account_type == 0">银行卡</div>
                        <div v-else-if="scope.row.account_type == 1">微信</div>
                        <div v-else-if="scope.row.account_type == 2">支付宝</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="收益类型分润类型" width="200">
                  <template slot-scope="scope">
                    <div>{{ scope.profit_type }}</div>
                  </template>
                </el-table-column> -->
                <el-table-column
                  prop="amount"
                  label="提现金额"
                ></el-table-column>
                
                <el-table-column
                  label="平台服务费"
                >
                  <template slot-scope="scope">
                    {{scope.row.sales_ratio}}%
                  </template>
                </el-table-column>
                <el-table-column
                  prop="amount_received"
                  label="实际到账金额"
                ></el-table-column>
                <!-- <el-table-column
                  prop="reason"
                  label="原因"
                ></el-table-column> -->
                <el-table-column label="提现状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 1">审核中</div>
                        <div v-else-if="scope.row.status == 2">银行处理中</div>
                        <div v-else-if="scope.row.status == 3">提现成功</div>
                        <div v-else-if="scope.row.status == 4">提现失败</div>
                        <div v-else-if="scope.row.status == 5">提现拒绝</div>
                    </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="170"
                >
                  <template slot-scope="scope">
                      <el-button @click="open(scope.row)" size="mini" v-if="scope.row.status == 1"  round type="primary">审核</el-button>
                      <el-button size="mini" round @click="openPoint(scope.row)" type="info">详细</el-button>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="用户手机号" width="200">
                  <template slot-scope="scope">
                    <div>{{ scope.profit_type }}</div>
                  </template>
                </el-table-column> -->
              </el-table>
            </el-col>
          </el-row>
          <!-- 商品详情弹窗 -->
          <el-dialog title="提现详情" :visible.sync="pointBlean">
            <!-- <el-form :model="point">
              <el-form-item label="原因: " :label-width="formLabelWidth">
                {{point.reason}}
              </el-form-item>
              <el-form-item label="银行卡名称: " :label-width="formLabelWidth">
                {{point.bank_name}}
              </el-form-item>
              <el-form-item label="开户姓名: " :label-width="formLabelWidth">
                {{point.bank_card_user}}
              </el-form-item>
              <el-form-item label="开户行: " :label-width="formLabelWidth">
                {{point.opening_bank}}
              </el-form-item>
              <el-form-item label="银行卡卡号: " :label-width="formLabelWidth">
                {{point.bank_card}}
              </el-form-item>
            </el-form> -->
            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  昵称:
                </div>
                <div class="textDiv">
                  {{broadInfo.nickname}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  用户账号:
                </div>
                <div class="textDiv">
                  {{broadInfo.phone}}
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  可提现余额:
                </div>
                <div class="textDiv">
                  {{broadInfo.cash}}元
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  申请金额:
                </div>
                <div class="textDiv" v-if="broadInfo.amount">
                  {{broadInfo.amount}}元
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  实际到账金额:
                </div>
                <div class="textDiv">
                  {{broadInfo.amount_received}}元
                </div>
              </div>
              
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  交易单号:
                </div>
                <div class="textDiv">
                  {{broadInfo.trade_no}}
                </div>
              </div>
            </div>
            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  申请时间:
                </div>
                <div class="textDiv">
                  {{broadInfo.add_time}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  完成时间:
                </div>
                <div class="textDiv">
                  {{broadInfo.complate_time}}
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  平台服务费:
                </div>
                <div class="textDiv" v-if="broadInfo.sales_ratio">
                  {{broadInfo.sales_ratio}}%
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  银行卡卡号:
                </div>
                <div class="textDiv">
                  {{broadInfo.bank_card}}
                </div>
              </div>
              
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  开户姓名:
                </div>
                <div class="textDiv">
                  {{broadInfo.bank_card_user}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  开户行:
                </div>
                <div class="textDiv">
                  {{broadInfo.opening_bank}}
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
                  状态:
                </div>
                <div class="textDiv" v-if="broadInfo.status == 1">
                  审核中
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 2">
                  银行处理中
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 3">
                  提现成功
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 4">
                  提现失败
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 5">
                  提现拒绝
                </div>
                <div class="textDiv" v-else>
                  未知
                </div>
              </div>
            </div>
            
            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  外部交易单号:
                </div>
                <div class="textDiv">
                  {{broadInfo.out_trade_no}}
                </div>
              </div>
              <div class="boxDiv clearfix" v-if="broadInfo.reason">
                <div class="labelDiv">
                  拒绝原因:
                </div>
                <div class="textDiv">
                  {{broadInfo.reason}}
                </div>
              </div>
            </div>
          </el-dialog>
          <!-- 用户提现审核弹窗 -->
          <el-dialog title="用户提现审核" :visible.sync="opening_change_ifShow">
            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  昵称:
                </div>
                <div class="textDiv">
                  {{broadInfo.nickname}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  用户账号:
                </div>
                <div class="textDiv">
                  {{broadInfo.phone}}
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  可提现余额:
                </div>
                <div class="textDiv" v-if="broadInfo.cash">
                  {{broadInfo.cash}}元
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  申请金额:
                </div>
                <div class="textDiv" v-if="broadInfo.amount">
                  {{broadInfo.amount}}元
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  外部交易单号:
                </div>
                <div class="textDiv">
                  {{broadInfo.out_trade_no}}
                </div>
              </div>
              
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  交易单号:
                </div>
                <div class="textDiv">
                  {{broadInfo.trade_no}}
                </div>
              </div>
            </div>
            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  申请时间:
                </div>
                <div class="textDiv">
                  {{broadInfo.add_time}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  完成时间:
                </div>
                <div class="textDiv">
                  {{broadInfo.complate_time}}
                </div>
              </div>
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  平台服务费:
                </div>
                <div class="textDiv" v-if="broadInfo.sales_ratio">
                  {{broadInfo.sales_ratio}}元
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  银行卡卡号:
                </div>
                <div class="textDiv">
                  {{broadInfo.bank_card}}
                </div>
              </div>
              
            </div>

            <div class="divRow clearfix">
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  开户姓名:
                </div>
                <div class="textDiv">
                  {{broadInfo.bank_card_user}}
                </div>
              </div>
              <div class="boxDiv clearfix">
                <div class="labelDiv">
                  开户行:
                </div>
                <div class="textDiv">
                  {{broadInfo.opening_bank}}
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
                  状态:
                </div>
                <div class="textDiv" v-if="broadInfo.status == 1">
                  审核中
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 2">
                  银行处理中
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 3">
                  提现成功
                </div>
                <div class="textDiv" v-else-if="broadInfo.status == 4">
                  提现失败
                </div>
                <div class="textDiv" v-else>
                  未知
                </div>
              </div>
            </div>
            <div class="divRow clearfix">
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
                @size-change="handleSizeChange3"
                @current-change="handleCurrentChange3"
                :current-page="queryInfo2.page"
                :page-sizes="[5, 10, 20, 30, 50]"
                :page-size="queryInfo2.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="queryInfo2.total"
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
import axios from 'axios'
import { user_income, profit_list,user_withdrawal_list , user_withdrawal_examine ,user_derive_excel} from "../../utils/axios";
export default {
  data() {
    return {
      opening_change_ifShow:false,
      broadId: "",
      activeName: "first",
      activeTab: "first",
      extendList: [], //主播列表
      extendList1: [], //主播管理员列表
      extendList2: [], //提现列表
      fn1: this.commonJs.Debounce(this.get_agent_list1),
      fn2: this.commonJs.Debounce(this.get_agent_list),
      fn3: this.commonJs.Debounce(this.get_agent_list2),
      textarea2:"",
      broadInfo:{},
      options: [
        {
          value: 0,
          label: "直播",
        },
        {
          value: 1,
          label: "分享",
        },
        {
          value: 2,
          label: "团队(专员)",
        },
        {
          value: 3,
          label: "代理",
        },
        {
          value: 4,
          label: "橘宝",
        },
        {
          value: 5,
          label: "招商",
        },
        {
          value: 6,
          label: "自购",
        },
        {
          value: 7,
          label: "段位升级奖励",
        },
      ],
      formLabelWidth:"100px",
      options1: [
        {
          value: 1,
          label: "审核中",
        },
        {
          value: 2,
          label: "银行处理中",
        },
        {
          value: 3,
          label: "提现成功",
        },
        {
          value: 4,
          label: "提现失败",
        }
      ],
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
      queryInfo2: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      height:"",
      pick_condition: "",
      pick_condition1: "",
      pick_condition2:"",
      //申請人姓名
      nickname: "",
      nickname1: "",
      anchor_id: "",
      anchor_id1: "",
      time_value: "",
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
      pickerOptions1: {
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
      point:{},//查看详情
      pointBlean:false,
      loading: false,
    };
  },
  created() {
    this.get_agent_list1();
    this.height = document.body.clientHeight - 300
  },
  methods: {
    openPoint(item){
      console.log(item)
      this.broadInfo = item
      this.pointBlean = true
    },
    open(value){
      this.opening_change_ifShow = true
      this.broadInfo = value
    },
    tabClick(tab, event) {
      if(tab.$options.propsData.label == "用户提现"){
          this.get_agent_list2()
      }
    },
    //tab切换 点击查看主播管理员列表
    handleClick(id) {
      this.broadId = id;
      this.anchor_id = id;
      this.activeName = "second";
      //点击查看
      this.pick_seach();
    },
    //点击直播列表
    broadListClick(id) {
      this.$router.push({ path: "/broadcast/anchor", query: { ids: id } });
    },
    //点击打赏列表
    rewardListClick(id) {
      this.$router.push({ path: "/broadcast/reward", query: { ids: id } });
    },
    
    //搜索
    pick_seach(index) {
      let that = this;
      console.log(this.time_value);
      if (
        that.anchor_id == "" &&
        that.nickname == "" &&
        that.pick_condition === "" &&
        that.time_value == ""
      ) {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        uid: that.anchor_id,
        keywords: that.nickname,
        profit_type: that.pick_condition,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      profit_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
                    
              if(element.profit_type != ''){
                if(element.profit_type == '0'){
                  element.profit_type = "直播"
                }else if(element.profit_type == '1'){
                  element.profit_type = "分享"
                }else if(element.profit_type == '2'){
                  element.profit_type = "团队(专员)"
                }else if(element.profit_type == '3'){
                  element.profit_type = "代理"
                }else if(element.profit_type == '4'){
                  element.profit_type = "橘宝"
                }else if(element.profit_type == '5'){
                  element.profit_type = "招商"
                }else if(element.profit_type == '6'){
                  element.profit_type = "自购"
                }else if(element.profit_type == '7'){
                  element.profit_type = "段位升级奖励"
                }
              }
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);

            //
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
      let request_form = {
        page: 1,
        page_size: 20,
        keywords: that.nickname1,
        status: that.pick_condition1,
        time_type: that.pick_condition2,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      user_withdrawal_list(request_form)
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
            window.open(publicFile.address + "/new_admin.php?c=finance&a=user_derive_excel&keywords="
            + that.nickname1 
            +"&status="+ that.pick_condition1 
            +"&time_type="+ that.pick_condition2 
            +"&start_time="+ time1 
            +"&end_time="+ time2)
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
    //搜索
    pick_seach2(index) {
      let that = this;
      if (
        that.nickname1 == "" &&
        that.pick_condition1 === "" &&
        that.pick_condition2 === "" &&
        that.time_value1 == ""
      ) {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      console.log(this.time_value1)
      console.log(this.pick_condition2)
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
      let request_form = {
        page: 1,
        page_size: 20,
        keywords: that.nickname1,
        status: that.pick_condition1,
        time_type: that.pick_condition2,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      user_withdrawal_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.add_time = this.commonJs.timestampToTime(
                element.add_time
              );
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
            });
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);

            //
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
    
    pick_seach1() {
      let that = this;
      if (that.anchor_id1 == "") {
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
        keywords: that.anchor_id1,
      };
      user_income(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            this.extendList = res.data.err_msg.list;

            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
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
    //每页显示条数改变
    handleSizeChange1(val) {
      this.get_shop_list_page1(1, val);
    },

    //当前页
    handleCurrentChange1(val) {
      this.get_shop_list_page1(val, this.queryInfo.pageSize);
    },
    //每页显示条数改变
    handleSizeChange3(val) {
      this.get_shop_list_page2(1, val);
    },

    //当前页
    handleCurrentChange3(val) {
      this.get_shop_list_page2(val, this.queryInfo.pageSize);
    },
    //分页
    get_shop_list_page(page, number) {
      let that = this;
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }

      profit_list({
        page: page,
        page_size: number,
        uid: that.anchor_id,
        keywords: that.nickname,
        profit_type: that.pick_condition,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
              if(element.profit_type != ''){
                if(element.profit_type == '0'){
                  element.profit_type = "直播"
                }else if(element.profit_type == '1'){
                  element.profit_type = "分享"
                }else if(element.profit_type == '2'){
                  element.profit_type = "团队(专员)"
                }else if(element.profit_type == '3'){
                  element.profit_type = "代理"
                }else if(element.profit_type == '4'){
                  element.profit_type = "橘宝"
                }else if(element.profit_type == '5'){
                  element.profit_type = "招商"
                }else if(element.profit_type == '6'){
                  element.profit_type = "自购"
                }else if(element.profit_type == '7'){
                  element.profit_type = "段位升级奖励"
                }
              }
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
    get_agent_list(index) {
      this.anchor_id = "";
      this.nickname = "";
      this.pick_condition = "";
      this.time_value = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      profit_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
              if(element.profit_type != ''){
                if(element.profit_type == '0'){
                  element.profit_type = "直播"
                }else if(element.profit_type == '1'){
                  element.profit_type = "分享"
                }else if(element.profit_type == '2'){
                  element.profit_type = "团队(专员)"
                }else if(element.profit_type == '3'){
                  element.profit_type = "代理"
                }else if(element.profit_type == '4'){
                  element.profit_type = "橘宝"
                }else if(element.profit_type == '5'){
                  element.profit_type = "招商"
                }else if(element.profit_type == '6'){
                  element.profit_type = "自购"
                }else if(element.profit_type == '7'){
                  element.profit_type = "段位升级奖励"
                }
              }
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

    //分页
    get_shop_list_page1(page, number) {
      let that = this;
      that.loading = true;
      user_income({
        page: page,
        page_size: number,
        keywords: that.anchor_id1,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
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
    get_agent_list1(index) {
        this.broadId = ""
      let request_form = {
        page: 1,
        page_size: 20,
      };
      user_income(request_form)
        .then((res) => {
          let that = this;
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.addtime = this.commonJs.timestampToTime(element.addtime);
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
          this.loading = false;
          console.log(error);
        });
    },

    //分页
    get_shop_list_page2(page, number) {
      let that = this;
      that.loading = true;
      
      var time1 = "";
      var time2 = "";
      if (this.time_value1 != "") {
        time1 = this.commonJs.dataTime(this.time_value1[0]);
        time2 = this.commonJs.dataTime(this.time_value1[1]);
      }

      let request_form = {
        page: page,
        page_size: number,
        keywords: that.nickname1,
        time_type: that.pick_condition2,
        status: that.pick_condition1,
        start_time: time1,
        end_time: time2,
      };
      
      //搜索
      user_withdrawal_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.add_time = this.commonJs.timestampToTime(
                element.add_time
              );
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
            });
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);

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
    get_agent_list2(index) {
      this.nickname1 = "";
      this.pick_condition1 = "";
      this.pick_condition2 = ''
      this.time_value1 = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      //搜索
      user_withdrawal_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.add_time = this.commonJs.timestampToTime(
                element.add_time
              );
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
            });
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);

            //
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
    submit_yes(){
      // 
      this.$confirm('此操作将同意用户 ' + this.broadInfo.nickname + ' 的提现审核, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        user_withdrawal_examine({
          pigcms_id:this.broadInfo.pigcms_id,
          status:3
        }).then((res) => {
          if(res.data.err_code == 0){
              this.$message({
                message: "审核已通过",
                type: "success",
              });
              this.opening_change_ifShow = false
              this.get_shop_list_page2(this.queryInfo2.page,this.queryInfo2.pageSize)
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
        // ' + row.title + '
        this.$confirm('此操作将拒绝用户 ' + this.broadInfo.nickname + ' 的提现审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          user_withdrawal_examine({
            pigcms_id:this.broadInfo.pigcms_id,
            status:5,
            reason:this.textarea2
          }).then((res) => {
            if(res.data.err_code == 0){
                this.$message({
                  message: "审核已拒绝",
                  type: "success",
                });
                this.textarea2 = ''
                this.get_shop_list_page2(this.queryInfo2.page,this.queryInfo2.pageSize)
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
        
      }
      
    },
  },
};
</script>

<style scoped lang="less">
.page {
  padding: 15px 15px 0;
}
.seach {
  display: flex;
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
      font-weight: bold;
      font-size: 15px;
    }
    .textDiv{
      line-height: 20px;
      padding-left:13px;
      box-sizing:border-box;
      width: 80%;
      float:left;
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
