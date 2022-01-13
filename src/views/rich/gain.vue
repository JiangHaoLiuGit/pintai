<template>
  <div class="page">
    <div class="topHead clearfix" v-if="activeTab == 'first'">
      <s class="lt"></s>
      <span class="lt">用户收益</span>
    </div>
    <div class="topHead clearfix" v-else-if="activeTab == 'second'">
      <s class="lt"></s>
      <span class="lt">用户提现</span>
    </div>
    <el-tabs v-model="activeTab" @tab-click="tabClick" style="margin-top:20px;">
      <el-tab-pane label="用户收益" name="first">
        <div class="seach_copy">
          <el-input
            v-model="anchor_id1"
            placeholder="请输入账号/ID/昵称"
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
              <el-table-column label="用户昵称">
                <template slot-scope="scope">
                  <div class="green pointer" @click="handleClick(scope.row)">{{scope.row.nickname}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="account" label="账号"></el-table-column>
              <el-table-column prop="uid" label="用户id"></el-table-column>
              <el-table-column prop="selling_cash" label="可提现余额"></el-table-column>
              <el-table-column prop="selling_cash_count" label="累计收益"></el-table-column>
              <el-table-column prop="selling_cash_freeze" label="累计提现"></el-table-column>
              <el-table-column prop="audit_num" label="审核中金额"></el-table-column>
              <el-table-column prop="not_entry_num" label="未入账"></el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="用户提现" name="second">
        <div class="seach_copy">
          <div class="seach_select">
            <div class="seach_select">
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
              
            </div>
          </div>
          <div class="button_type">
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
                prop="account"
                label="账号"
              ></el-table-column>
              <el-table-column prop="uid" label="用户id"></el-table-column>
              <!-- <el-table-column
                  prop="store_id"
                  label="店铺id"
                ></el-table-column> -->
              <el-table-column label="提现类型">
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
            <el-table-column label="平台服务费">
                <template slot-scope="scope">
                  {{ scope.row.sales_ratio }}%
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.status == 1">审核中</div>
                  <div v-else-if="scope.row.status == 2">银行处理中</div>
                  <div v-else-if="scope.row.status == 3">提现成功</div>
                  <div v-else-if="scope.row.status == 4">提现失败</div>
                  <div v-else-if="scope.row.status == 5">提现拒绝</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                  <el-button
                    @click="open(scope.row)"
                    size="mini"
                    v-if="scope.row.status == 1"
                    round
                    type="primary"
                    >审核</el-button
                  >
                  <el-button
                    size="mini"
                    round
                    @click="openPoint(scope.row)"
                    type="info"
                    >详细</el-button
                  >
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
        <el-dialog 
            width="70%"
            class="remarks_box add"
            append-to-body
            :visible.sync="pointBlean">
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
            <div class="info">提现详情</div>
            <div style="padding:40px 20px">
                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">昵称:</div>
                    <div class="textDiv">
                        {{ broadInfo.nickname }}
                    </div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">用户账号:</div>
                    <div class="textDiv">
                        {{ broadInfo.account }}
                    </div>
                    </div>
                </div>

                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">可提现余额:</div>
                    <div class="textDiv">{{ broadInfo.cash }}元</div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">申请金额:</div>
                    <div class="textDiv" v-if="broadInfo.amount">
                        {{ broadInfo.amount }}元
                    </div>
                    </div>
                </div>

                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">实际到账金额:</div>
                    <div class="textDiv">{{ broadInfo.amount_received }}元</div>
                    </div>

                    <div class="boxDiv clearfix">
                    <div class="labelDiv">交易单号:</div>
                    <div class="textDiv">
                        {{ broadInfo.trade_no }}
                    </div>
                    </div>
                </div>
                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">申请时间:</div>
                    <div class="textDiv">
                        {{ broadInfo.add_time }}
                    </div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">完成时间:</div>
                    <div class="textDiv">
                        {{ broadInfo.complate_time }}
                    </div>
                    </div>
                </div>

                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">平台服务费:</div>
                    <div class="textDiv" v-if="broadInfo.sales_ratio">
                        {{ broadInfo.sales_ratio }}%
                    </div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">银行卡卡号:</div>
                    <div class="textDiv">
                        {{ broadInfo.bank_card }}
                    </div>
                    </div>
                </div>

                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">开户姓名:</div>
                    <div class="textDiv">
                        {{ broadInfo.bank_card_user }}
                    </div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">开户行:</div>
                    <div class="textDiv">
                        {{ broadInfo.opening_bank }}
                    </div>
                    </div>
                </div>

                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">银行卡名称:</div>
                    <div class="textDiv">
                        {{ broadInfo.bank_name }}
                    </div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">状态:</div>
                    <div class="textDiv" v-if="broadInfo.status == 1">审核中</div>
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
                    <div class="textDiv" v-else>未知</div>
                    </div>
                </div>
                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                      <div class="labelDiv">外部交易单号:</div>
                      <div class="textDiv">
                          {{ broadInfo.out_trade_no }}
                      </div>
                    </div>
                    <div class="boxDiv clearfix" v-if="broadInfo.reason">
                      <div class="labelDiv">拒绝原因:</div>
                      <div class="textDiv">
                          {{ broadInfo.reason }}
                      </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 用户提现审核弹窗 -->
        <el-dialog 
            width="70%"
            class="remarks_box add"
            append-to-body
            :visible.sync="opening_change_ifShow"
            >
            <div class="info">
                用户提现审核
            </div>
                <div style="padding:40px 20px 60px">
                    <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">昵称:</div>
                    <div class="textDiv">
                        {{ broadInfo.nickname }}
                    </div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">用户账号:</div>
                    <div class="textDiv">
                        {{ broadInfo.account }}
                    </div>
                    </div>
                </div>

                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">可提现余额:</div>
                    <div class="textDiv" v-if="broadInfo.cash">
                        {{ broadInfo.cash }}元
                    </div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">申请金额:</div>
                    <div class="textDiv" v-if="broadInfo.amount">
                        {{ broadInfo.amount }}元
                    </div>
                    </div>
                </div>

                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">外部交易单号:</div>
                    <div class="textDiv">
                        {{ broadInfo.out_trade_no }}
                    </div>
                    </div>

                    <div class="boxDiv clearfix">
                    <div class="labelDiv">交易单号:</div>
                    <div class="textDiv">
                        {{ broadInfo.trade_no }}
                    </div>
                    </div>
                </div>
                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">申请时间:</div>
                    <div class="textDiv">
                        {{ broadInfo.add_time }}
                    </div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">完成时间:</div>
                    <div class="textDiv">
                        {{ broadInfo.complate_time }}
                    </div>
                    </div>
                </div>

                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">平台服务费:</div>
                    <div class="textDiv" v-if="broadInfo.sales_ratio">
                        {{ broadInfo.sales_ratio }}元
                    </div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">银行卡卡号:</div>
                    <div class="textDiv">
                        {{ broadInfo.bank_card }}
                    </div>
                    </div>
                </div>

                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">开户姓名:</div>
                    <div class="textDiv">
                        {{ broadInfo.bank_card_user }}
                    </div>
                    </div>
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">开户行:</div>
                    <div class="textDiv">
                        {{ broadInfo.opening_bank }}
                    </div>
                    </div>
                </div>

                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">银行卡名称:</div>
                    <div class="textDiv">
                        {{ broadInfo.bank_name }}
                    </div>
                    </div>

                    <div class="boxDiv clearfix">
                    <div class="labelDiv">状态:</div>
                    <div class="textDiv" v-if="broadInfo.status == 1">审核中</div>
                    <div class="textDiv" v-else-if="broadInfo.status == 2">
                        银行处理中
                    </div>
                    <div class="textDiv" v-else-if="broadInfo.status == 3">
                        提现成功
                    </div>
                    <div class="textDiv" v-else-if="broadInfo.status == 4">
                        提现失败
                    </div>
                    <div class="textDiv" v-else>未知</div>
                    </div>
                </div>
                <div class="divRow clearfix">
                    <div class="boxDiv clearfix">
                    <div class="labelDiv">拒绝原因:</div>
                    <div class="textDiv">
                        <el-input
                        type="textarea"
                        maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        placeholder="请输入拒绝内容"
                        show-word-limit
                        v-model="textarea2"
                        >
                        </el-input>
                    </div>
                    </div>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button type="success" class="rt" @click="submit_yes">同意</el-button>
                    <el-button
                     class="rt"
                    @click="submit_err"
                    type="danger"
                    style="margin-left: 20px"
                    >拒绝</el-button
                    >
                </div>
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
    <!-- 编辑问答 -->
    <el-dialog
      width="80%"
      class="remarks_box"
      :visible.sync="activeName"
      append-to-body
    >
      <div class="info">用户收益明细</div>
      <div style="padding: 10px">
        <div class="seach">
          
          <div class="el-inpu inlineBlock">
            <div class="textItem clearfix marginBottom">
                <div class="lt yellow marginRight">
                当前用户:{{openItem.nickname}}
                </div>
                <div class="lt yellow marginRight">
                用户ID:{{openItem.uid}}
                </div>
                <div class="lt yellow marginRight">
                账号:{{openItem.account}}
                </div>
                <div class="lt  marginRight">
                可提现余额:{{openItem.selling_cash}}
                </div>
                <div class="lt  marginRight">
                累计收益:{{openItem.selling_cash_count}}
                </div>
                <div class="lt  marginRight">
                累计提现:{{openItem.selling_cash_freeze}}
                </div>
                <div class="lt  marginRight">
                审核中金额:{{openItem.audit_num}}
                </div>
                <div class="lt  marginRight">
                未入账:{{openItem.not_entry_num}}
                </div>
            </div>
          </div>
        </div>
        <div class="seach_copy" style="padding-top:0">
          <div class="seach_select">
            <div class="seach_select">
              <!-- <el-input
                v-model="anchor_id"
                type="number"
                @keyup.enter.native="pick_seach"
                placeholder="请输入用户id"
              ></el-input> -->
              <el-input
              v-model="nickname"
              style="width:300px"
              placeholder="请输入订单号/身份(如:苏州市)"
              clearable
            ></el-input>
                <el-select
                    v-model="pick_condition"
                    class="el-inpu"
                    placeholder="请选择收益类型"
                >
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
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
          </div>
        </div>
        <!-- 收入详情列表 -->
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              :data="extendList1"
              border
              height="500"
              style="width: 100%"
            >
              <el-table-column label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column
                prop="complate_time"
                label="订单完成时间"
              ></el-table-column>
              <el-table-column
                prop="order_no"
                label="单号"
              ></el-table-column>
              <el-table-column label="收益类型" align="center">
                <template slot-scope="scope">
                  <div>{{scope.row.profit_type_str}}</div>
                </template>
              </el-table-column>
              <el-table-column label="收益类项目(身份)" align="center">
                <template slot-scope="scope">
                  <div>{{scope.row.team_type_str}}</div>
                  <!-- <div v-if="scope.row.team_type == 1">直推收益</div>
                  <div v-else-if="scope.row.team_type == 2">直推复购收益</div>
                  <div v-else-if="scope.row.team_type == 3">复购团队收益</div>
                  <div v-else>未知</div> -->
                </template>
              </el-table-column>
              <el-table-column
                prop="fx_profit"
                label="金额"
              ></el-table-column>
              <el-table-column
                prop="settle_str"
                label="入账"
              ></el-table-column>
              <el-table-column
                prop="nickname"
                label="关联用户"
              ></el-table-column>
              <el-table-column
                prop="account"
                label="关联账号"
              ></el-table-column>
              <el-table-column
                prop="uid"
                label="关联UID"
              ></el-table-column>
              <el-table-column label="用户手机号">
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
    </el-dialog>
  </div>
</template>

<script>
import publicFile from "../../utils/publicFile";
import {
  earnings_list,
  earnings_detail_list,
  withdraw_deposit_list,
  withdraw_deposit_audit,
  user_derive_excel,
} from "../../utils/axios";
export default {
  data() {
    return {
      opening_change_ifShow: false,
      broadId: "",
      activeName: false,
      activeTab: "first",
      extendList: [], //主播列表
      extendList1: [], //主播管理员列表
      extendList2: [], //提现列表
      fn1: this.commonJs.Debounce(this.get_agent_list1),
      fn2: this.commonJs.Debounce(this.pick_seach),
      fn3: this.commonJs.Debounce(this.get_agent_list2),
      textarea2: "",
      broadInfo: {},
      openItem:{},
      options: [
        {
          value: 1,
          label: "团队消费收益",
        },
        {
          value: 2,
          label: "团队区域收益",
        },
        {
          value: 3,
          label: "市级收益",
        },
        {
          value: 4,
          label: "省级收益",
        },
        {
          value: 5,
          label: "联创收益",
        },
        
      ],
      formLabelWidth: "100px",
      options1: [
        {
          value: 1,
          label: "申请中",
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
        },
        {
          value: 5,
          label: "提现拒绝",
        },
      ],
      options2: [
        {
          value: 2,
          label: "完成时间",
        },
        {
          value: 1,
          label: "申请时间",
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
      queryInfo2: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      height: "",
      pick_condition: "",
      pick_condition1: "",
      pick_condition2: "",
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
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      point: {}, //查看详情
      pointBlean: false,
      loading: false,
    };
  },
  created() {
    this.get_agent_list1();
    this.height = document.body.clientHeight - 380;
  },
  methods: {
    openPoint(item) {
      console.log(item);
      this.broadInfo = item;
      this.pointBlean = true;
    },
    open(value) {
      this.opening_change_ifShow = true;
      this.broadInfo = value;
    },
    tabClick(tab, event) {
      if (tab.$options.propsData.label == "用户提现") {
        this.get_agent_list2();
      }
    },
    //tab切换 点击查看主播管理员列表
    handleClick(item) {
        this.openItem = item
      this.broadId = item.uid;
      this.anchor_id = item.uid;
      this.activeName = true;
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
        search: that.nickname,
        profit_type: that.pick_condition,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      earnings_detail_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
            })
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
    // async user_derive_excel1(){
    //   let that = this;
    //   if (
    //     that.nickname1 == "" &&
    //     that.pick_condition1 === "" &&
    //     that.pick_condition2 === "" &&
    //     that.time_value1 == ""
    //   ) {
    //     that.$message({
    //       message: "请选择任意一种搜索类型",
    //       type: "warning",
    //     });
    //     return;
    //   }
    //   var time1 = "";
    //   var time2 = "";
    //   if (this.time_value != "") {
    //     time1 = this.commonJs.dataTime(this.time_value[0]);
    //     time2 = this.commonJs.dataTime(this.time_value[1]);
    //   }
    //   await axios({
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization' : "Bearer " +this.$store.state.user.token
    //     },
    //     method:'get',
    //     url:publicFile.address + "/new_admin.php?c=finance&a=user_derive_excel&keywords="+ that.nickname1 +"&status="+ that.pick_condition1 +"&time_type="+ that.pick_condition2 +"&start_time="+ time1 +"&end_time="+ time2,
    //   }).then(res=>{
    //     console.log(res)
    //     if(res.data.err_code){
    //       that.$message({
    //         showClose: true,
    //         message: res.data.err_msg,
    //         type: "error",
    //       });
    //     }else{
    //       console.log(res.data.err_code)
    //       if(res.data.err_code != 1000){
    //         window.open(publicFile.address + "/new_admin.php?c=finance&a=user_derive_excel&keywords="+ that.nickname1 +"&status="+ that.pick_condition1 +"&time_type="+ that.pick_condition2 +"&start_time="+ time1 +"&end_time="+ time2)
    //       }

    //     }

    //   })

    // },
    //导出
    user_derive_excel1() {
      let that = this;

      if (this.pick_condition2 != "" || this.time_value1 != "") {
        if (this.time_value1 == "" || this.pick_condition2 == "") {
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
      withdraw_deposit_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            if (res.data.err_msg.list.length == 0) {
              that.$message({
                showClose: true,
                message: "暂无数据",
                type: "error",
              });
            } else {
              window.open(
                publicFile.address +
                  "/new_admin.php?c=finance&a=user_derive_excel&keywords=" +
                  that.nickname1 +
                  "&status=" +
                  that.pick_condition1 +
                  "&time_type=" +
                  that.pick_condition2 +
                  "&start_time=" +
                  time1 +
                  "&end_time=" +
                  time2
              );
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
      console.log(this.time_value1);
      console.log(this.pick_condition2);
      if (this.pick_condition2 != "" || this.time_value1 != "") {
        if (this.time_value1 == "" || this.pick_condition2 == "") {
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
        status: that.pick_condition1,
        time_type: that.pick_condition2,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      withdraw_deposit_list(request_form)
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
        user_search: that.anchor_id1,
      };
      earnings_list(request_form)
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

      earnings_detail_list({
        page: page,
        page_size: number,
        uid: that.anchor_id,
        search: that.nickname,
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
              if (element.profit_type != "") {
                if (element.profit_type == "0") {
                  element.profit_type = "直播";
                } else if (element.profit_type == "1") {
                  element.profit_type = "分享";
                } else if (element.profit_type == "2") {
                  element.profit_type = "团队(专员)";
                } else if (element.profit_type == "3") {
                  element.profit_type = "代理";
                } else if (element.profit_type == "4") {
                  element.profit_type = "橘宝";
                } else if (element.profit_type == "5") {
                  element.profit_type = "招商";
                } else if (element.profit_type == "6") {
                  element.profit_type = "自购";
                } else if (element.profit_type == "7") {
                  element.profit_type = "段位升级奖励";
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
      earnings_detail_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
              if (element.profit_type != "") {
                if (element.profit_type == "0") {
                  element.profit_type = "直播";
                } else if (element.profit_type == "1") {
                  element.profit_type = "分享";
                } else if (element.profit_type == "2") {
                  element.profit_type = "团队(专员)";
                } else if (element.profit_type == "3") {
                  element.profit_type = "代理";
                } else if (element.profit_type == "4") {
                  element.profit_type = "橘宝";
                } else if (element.profit_type == "5") {
                  element.profit_type = "招商";
                } else if (element.profit_type == "6") {
                  element.profit_type = "自购";
                } else if (element.profit_type == "7") {
                  element.profit_type = "段位升级奖励";
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
      earnings_list({
        page: page,
        page_size: number,
        user_search: that.anchor_id1,
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
      this.broadId = "";
      let request_form = {
        page: 1,
        page_size: 20,
      };
      earnings_list(request_form)
        .then((res) => {
          let that = this;
          that.loading = false;
          if (res.data.err_code == 0) {
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
        time_type: that.pick_condition2,
        status: that.pick_condition1,
        start_time: time1,
        end_time: time2,
      };

      //搜索
      withdraw_deposit_list(request_form)
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
      this.pick_condition2 = "";
      this.time_value1 = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      //搜索
      withdraw_deposit_list(request_form)
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
    submit_yes() {
      //
      this.$confirm(
        "此操作将同意用户 " +
          this.broadInfo.nickname +
          " 的提现审核, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          withdraw_deposit_audit({
            withdrawal_id: this.broadInfo.id,
            status: 3,
          })
            .then((res) => {
              if (res.data.err_code == 0) {
                this.$message({
                  message: "审核已通过",
                  type: "success",
                });
                this.opening_change_ifShow = false;
                this.get_shop_list_page2(
                  this.queryInfo2.page,
                  this.queryInfo2.pageSize
                );
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((res) => {
              console.log(res);
            });
        })
        .catch(() => {});
    },
    submit_err() {
      if (this.textarea2 == "") {
        this.$message({
          message: "请填写拒绝原因",
          type: "warning",
        });
        return;
      } else {
        // ' + row.title + '
        this.$confirm(
          "此操作将拒绝用户 " +
            this.broadInfo.nickname +
            " 的提现审核, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            withdraw_deposit_audit({
              withdrawal_id: this.broadInfo.id,
              status: 5,
              reason: this.textarea2,
            })
              .then((res) => {
                if (res.data.err_code == 0) {
                  this.$message({
                    message: "审核已拒绝",
                    type: "success",
                  });
                  this.textarea2 = "";
                  this.get_shop_list_page2(
                    this.queryInfo2.page,
                    this.queryInfo2.pageSize
                  );
                  this.opening_change_ifShow = false;
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.err_msg,
                    type: "error",
                  });
                }
              })
              .catch((res) => {
                console.log(res);
              });
          })
          .catch(() => {});
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
  padding-top: 15px;
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
.divRow {
  margin: 15px 0;
  .boxDiv {
    width: 50%;
    float: left;
    font-size: 15px;
    .labelDiv {
      width: 20%;
      float: left;
      text-align: right;
      font-weight: bold;
      font-size: 15px;
    }
    .textDiv {
      line-height: 20px;
      padding-left: 13px;
      box-sizing: border-box;
      width: 80%;
      float: left;
    }
  }
}
/deep/ .el-form-item {
  width: 450px;
  .el-input {
    width: 223px;
  }
}

/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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
.topHead {
      padding: 10px 30px;
      border-bottom: 1px solid #e4e7ed;
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
</style>
