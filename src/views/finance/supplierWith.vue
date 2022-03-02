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
               <el-button type="warning" @click="handleSetUp(0)">设置</el-button>
              <el-button type="primary" @click="pick_seach">搜索</el-button>
              <el-button type="success" icon="el-icon-refresh" @click="fn1(1)"
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
                width="140"
                label="添加时间"
              ></el-table-column>
              <el-table-column
                label="店铺名称"
                width="240"
              >
                <template slot-scope="scope">
                  <div class="green pointer" @click="handleClick(scope.row)">{{scope.row.store_id == 0 ? "平台自营": scope.row.name}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="phone"
                label="店铺账号"
                width="140"
              ></el-table-column>
              
              <el-table-column
                prop="store_id"
                label="店铺id"
                
              ></el-table-column>
              <el-table-column
                label="入账时长"
              >
                <template slot-scope="scope">
                  <div class="green pointer" @click="handleSetUp(scope.row.store_id,scope.row)">{{scope.row.entry_time}}天</div>
                </template>
              </el-table-column>
              <el-table-column
                label="店铺费率"
              >
                <template slot-scope="scope">
                  <div class="green pointer" @click="handleSetUp(scope.row.store_id,scope.row)">{{scope.row.service_charge}}%</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="already_paid"
                label="已打款"
              ></el-table-column>

              <el-table-column
                prop="not_complete"
                label="未完成"
              ></el-table-column>
              <el-table-column
                prop="not_entry_price"
                label="未入账"
              ></el-table-column>
              <el-table-column
                prop="entry_price"
                label="已入账"
              ></el-table-column>
              
              <!-- auto_settled -->
              <el-table-column
                label="是否自动结算"
              >
                <template slot-scope="scope">{{scope.row.auto_settled == 0 ? "否":"是"}}</template>
              </el-table-column>
              <el-table-column
                prop="audit"
                label="审核中"
                
              ></el-table-column>
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

        <!-- 编辑问答 -->
        <el-dialog
          width="80%"
          class="remarks_box"
          :visible.sync="activeName"
          append-to-body
        >
          <div class="info">供应商收益明细</div>
          <div style="padding: 10px">
            <div class="seach">
              
              <div class="el-inpu inlineBlock">
                <div class="textItem clearfix marginBottom">
                    <div class="lt yellow marginRight">
                    当前供应商:{{openItem.nickname}}
                    </div>
                    <div class="lt yellow marginRight">
                    店铺ID:{{openItem.store_id}}
                    </div>
                    <div class="lt yellow marginRight">
                    店铺账号:{{openItem.phone}}
                    </div>
                    <div class="lt  marginRight" style="color:red">
                    店铺营业额合计:{{storeTotal.total_price}}
                    </div>
                </div>
                
                <div class="textItem clearfix marginBottom">
                    <div class="lt marginRight">
                    可提现余额:{{openItem.balance}}
                    </div>
                    <div class="lt marginRight">
                    已打款:{{openItem.already_paid}}
                    </div>
                    <div class="lt marginRight">
                    提现审核中:{{openItem.audit}}
                    </div>
                    <div class="lt marginRight">
                    已入账:{{openItem.entry_price}}
                    </div>
                    <div class="lt marginRight">
                    未完成:{{openItem.not_complete}}
                    </div>
                    <div class="lt marginRight">
                    未入账:{{openItem.not_entry_price}}
                    </div>
                </div>
              </div>
            </div>
            <div class="seach_copy" style="padding-top:0">
              <div class="seach_select">
                <div class="seach_select">
                  
                  <el-input
                  v-model="nickname1"
                  style="width:300px"
                  placeholder="请输入订单号/身份(如:苏州市)"
                  clearable
                ></el-input>
                    <el-select
                        v-model="pick_condition3"
                        class="el-inpu"
                        placeholder="请选择收益类型"
                    >
                        <el-option
                        v-for="item in options3"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                  <el-date-picker
                    :clearable="false"
                    v-model="time_value2"
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
                  :data="extendList2"
                  border
                  height="500"
                  style="width: 100%"
                  v-loading="loading2"
                >
                  <el-table-column label="序号" type="index" width="50">
                  </el-table-column>
                  <el-table-column
                    width="140"
                    prop="add_time"
                    label="下单时间"
                  ></el-table-column>
                  <el-table-column
                  width="140"
                    prop="complate_time"
                    label="订单完成时间"
                  ></el-table-column>
                  <el-table-column label="订单编号" width="220">
                    <template slot-scope="scope">
                        <div class="green pointer" @click="dingdan(scope.row.order_no)">{{scope.row.order_no}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="nickname"
                    label="买家昵称"
                  ></el-table-column>
                  <el-table-column
                    prop="uid"
                    label="买家ID"
                  ></el-table-column>
                  <el-table-column
                    prop="account"
                    label="买家账号"
                  ></el-table-column>
                  <el-table-column
                    prop="cost_price"
                    label="成本价"
                  ></el-table-column>
                  <el-table-column
                    prop="total"
                    label="订单金额"
                  ></el-table-column>
                  <el-table-column
                    label="结算状态"
                  >
                    <template slot-scope="scope">
                      <div v-if="scope.row.is_entry == 0">
                        未入账
                      </div>
                      <div v-else-if="scope.row.is_entry == 1">
                        已入账
                      </div>
                      <div v-else-if="scope.row.is_entry == 2">
                        未完成
                      </div>
                      <div v-else>
                        未知
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
                  @size-change="handleSizeChange2"
                  @current-change="handleCurrentChange2"
                  :current-page="queryInfo2.page"
                  :page-sizes="[5, 10, 20, 30, 50]"
                  :page-size="queryInfo2.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="queryInfo2.total"
                >
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </el-dialog>

        <!-- 编辑问答 -->
        <el-dialog
          width="30%"
          class="remarks_box"
          :visible.sync="setUp"
          append-to-body
        >
          <div class="info" v-if="storeId!=0">店铺独立设置</div>
          <div class="info" v-else>全局设置</div>
          <div style="padding: 10px">
            <h4 style="border-bottom:1px solid #bbb;padding-bottom:10px;margin-bottom:10px">入账设置</h4>
            <p class="bbb">当前入账时间规则:订单完成时间+<span class="yellow" style="font-size:20px">{{time1}}</span>个工作日</p>
              <el-radio-group v-model="radio1">
                <el-radio-button label="7" class="radios">7天</el-radio-button>
                <el-radio-button label="14" class="radios">14天</el-radio-button>
                <el-radio-button label="21" class="radios">21天</el-radio-button>
                <el-radio-button label="30" class="radios">30天</el-radio-button>
                <el-radio-button label="60" class="radios">60天</el-radio-button>
                <el-radio-button label="0" class="radios active">无(慎用)</el-radio-button>
                <el-radio-button label="qita" class="radios">其他</el-radio-button>
                <el-input v-model="input1" class="input1" :disabled="inputBlean" type="number" style="display: inline-block;width:150px;height:40px;line-height:40px;position: relative;top:6px" placeholder="请输入天数"></el-input>
              </el-radio-group>

            <h4 style="border-bottom:1px solid #bbb;padding-bottom:10px;margin-bottom:10px">手续费设置</h4>
            <p class="bbb">提现手续费:提现金额*<span class="yellow" style="font-size:20px">{{time2}}%</span></p>
              <el-radio-group v-model="radio2">
                <el-radio-button label="0.3" class="radios">0.3%</el-radio-button>
                <el-radio-button label="0.5" class="radios">0.5%</el-radio-button>
                <el-radio-button label="1" class="radios">1%</el-radio-button>
                <el-radio-button label="2" class="radios">2%</el-radio-button>
                <el-radio-button label="3" class="radios">3%</el-radio-button>
                <el-radio-button label="0" class="radios active">0%(慎用)</el-radio-button>
                <el-radio-button label="qita" class="radios">其他</el-radio-button>
                <el-input v-model="input2" class="input1" :disabled="inputBlean1" type="number" style="display: inline-block;width:150px;height:40px;line-height:40px;position: relative;top:6px" placeholder="请输入百分比"></el-input>
              </el-radio-group>
            <div class="clearfix" style="margin-top:40px;">
              <el-button class="rt" type="primary" @click="sure" :disabled="(time1 == '' && input1 == '') || (time2 == '' && input2 == '')">确定</el-button>
              <el-button class="rt" type="danger" @click="setUp = false">取消</el-button>
            </div>
            
          </div>
        </el-dialog>

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
                prop="full_name"
                label="收款人姓名"
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
                
                label="提现服务费"
              >
                <template slot-scope="scope">
                    {{scope.row.bond_withdrawal_ratio}}%
                </template>
              </el-table-column>
              <!-- prop="bond_withdrawal_ratio" -->
              <el-table-column
                prop="real_amount"
                label="到账金额"
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
          
        <el-dialog class="remarks_box" width="70%" :visible.sync="pointBlean" append-to-body>
          <div class="info">提现详情</div>
          <div style="padding: 10px">
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
                  {{broadInfo.bond_withdrawal_ratio}}%
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
          </div>
        </el-dialog>
        <!-- 供应商提现审核弹窗 -->
        <el-dialog class="remarks_box" width="60%" :visible.sync="opening_change_ifShow" append-to-body>
          <div class="info">供应商提现审核</div>
          <div style="padding: 30px">
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
                  {{broadInfo.bond_withdrawal_ratio}}%
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

            <div slot="footer" class="dialog-footer clearfix" style="margin:20px 0;">
              
              <el-button class="rt" @click="submit_err" type="danger" style="margin-left:20px">拒绝</el-button>
              <el-button type="success" class="rt" @click="submit_yes"
                >同意</el-button
              >
            </div>
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
import { finance_store_list, store_withdrawal_list,store_withd,store_earnings_detail,set_store } from "../../utils/axios";


export default {
  data() {
    return {
      opening_change_ifShow:false,
      activeTab: "first",
      broadId: "",
      extendList: [], 
      extendList1:[],
      extendList2:[],
      fn1: this.commonJs.Debounce(this.get_agent_list),
      fn2: this.commonJs.Debounce(this.get_agent_list1),
      fn3: this.commonJs.Debounce(this.get_agent_list2),
      broadInfo:{},
      textarea2:"",
      setUp:false,
      radio1:"7",
      radio2:"0.3",
      time1:"7",
      time2:"0.3",
      inputBlean:true,
      inputBlean1:true,
      input1:"",
      input2:"",
      time2:"",
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
      
      loading2:false,
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
      pick_condition3:"",
      nickname1:"",
      options3: [
        {
          value: 1,
          label: "未完成",
        },
        {
          value: 2,
          label: "未入账",
        },
        {
          value: 3,
          label: "已入账",
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
      time_value2:"",
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
      storeList:{
        balance:"",
        already_paid:""
      },
      storeTotal:{
        total_price:""
      },
      pointBlean:false,
      height:"",
      openItem:{},
      activeName:false,
      storeId:"",
    };
  },
  watch:{
    opening_change_ifShow:{
      handler(val){
        if(!val){
          this.textarea2 = ''
        }
      }
    },
    radio1:{
      handler(val){
        if(val == "qita"){
          this.time1 = ""
          this.inputBlean = false
        }else{
          this.time1 = val
          this.inputBlean = true
        }
      }
    },
    input1:{
      handler(val){
          this.time1 = val
      }
    },
    radio2:{
      handler(val){
        if(val == "qita"){
          this.time2 = ""
          this.inputBlean1 = false
        }else{
          this.time2 = val
          this.inputBlean1 = true
        }
      }
    },
    input2:{
      handler(val){
          this.time2 = val
      }
    },
    
    
  },
  created() {
      this.get_agent_list();
      this.height = document.body.clientHeight - 300
  },
  methods: {
    handleSetUp(item,obj){
      this.setUp = true
      this.storeId = item
      // radio1:"7",
      // radio2:"0.3",
      // time1:"7",
      // time2:"0.3",
      obj.service_charge = Number(obj.service_charge)
      if(obj.entry_time == 7 || obj.entry_time == 14 || obj.entry_time == 21 || obj.entry_time == 30 || obj.entry_time == 60 || obj.entry_time == 0){
        this.radio1 = obj.entry_time
        this.time1 = obj.entry_time
      }else{
        this.radio1 = 'qita'
        this.input1 = obj.entry_time
        this.inputBlean1 = false
      }
      console.log(obj.service_charge)
      if(obj.service_charge == 0.3 || obj.service_charge == 0.6 || obj.service_charge == 1 || obj.service_charge == 2 || obj.service_charge == 3 || obj.service_charge == 0){
        this.radio2 = obj.service_charge
        this.time2 = obj.service_charge
      }else{
        this.radio2 = 'qita'
        this.input2 = obj.service_charge
        this.inputBlean2 = false
      }
    },
    sure(){
        let date = {
          store_id:this.storeId,
          service_charge:this.time2,
          entry_time:this.time1,
        }
        set_store(
          date
        ).then((res) => {
          if(res.data.err_code == 0){
              this.$message({
                message: "设置成功",
                type: "success",
              });
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              this.setUp = false
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
    },
    //tab切换 点击查看主播管理员列表
    handleClick(item) {
      this.openItem = item
      this.openItem.store_id = item.store_id
      this.activeName = true;
      //点击查看
      this.get_agent_list2();
    },
    dingdan(order){
        // window.open(publicFile.address + "/h5/admin/dist/index.html#/order_/orderList_p?order_id=" + id)
        this.$router.push({path:"/order_/orderList_p",query:{order_id:order}})
    },
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
      console.log(tab.$options.propsData.label);
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
            this.storeList = res.data.err_msg
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
            this.storeList = res.data.err_msg
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
            this.storeList = res.data.err_msg
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


    pick_seach2(index) {
      let that = this;
      if (
        that.nickname1 == "" &&
        that.pick_condition3 === "" &&
        that.time_value2 === ""
      ) {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      // nickname1 pick_condition3 time_value2
      that.loading2 = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value2 != "") {
        time1 = this.commonJs.dataTime(this.time_value2[0]);
        time2 = this.commonJs.dataTime(this.time_value2[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        store_id:that.openItem.store_id,
        order_no:that.nickname1,
        type: that.pick_condition3,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      store_earnings_detail(request_form)
        .then((res) => {
          that.loading2 = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.add_time = this.commonJs.timestampToTime(
                item.add_time
              );
              item.complate_time = this.commonJs.timestampToTime(
                item.complate_time
              );
            });
            this.storeTotal = res.data.err_msg
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
            if (index == 1) {
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
          that.loading2 = false;
          console.log(error);
        });
    },
    //每页显示条数改变
    handleSizeChange2(val) {
      this.get_shop_list_page2(1, val);
    },

    //当前页
    handleCurrentChange2(val) {
      this.get_shop_list_page2(val, this.queryInfo1.pageSize);
    },
    //分页
    get_shop_list_page2(page, number) {
      let that = this;
      that.loading2 = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value2 != "") {
        time1 = this.commonJs.dataTime(this.time_value2[0]);
        time2 = this.commonJs.dataTime(this.time_value2[1]);
      }

      store_earnings_detail({
        page: page,
        page_size: number,
        store_id:that.openItem.store_id,
        order_no:that.nickname1,
        type: that.pick_condition3,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          that.loading2 = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.add_time = this.commonJs.timestampToTime(
                item.add_time
              );
              item.complate_time = this.commonJs.timestampToTime(
                item.complate_time
              );
            });
            this.storeTotal = res.data.err_msg
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
          that.loading2 = false;
          console.log(error);
        });
    },
    //加载第一页
    get_agent_list2(index) {
      this.anchor_id = "";
      this.live_id = "-100";
      this.pick_condition2 = ''
      this.keywords = "";
      this.time_value1 = "";
      let that = this;
      that.loading2 = true;
      let request_form = {
        page: 1,
        page_size: 20,
        store_id:that.openItem.store_id,
      };
      store_earnings_detail(request_form)
        .then((res) => {
          that.loading2 = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.add_time = this.commonJs.timestampToTime(
                item.add_time
              );
              item.complate_time = this.commonJs.timestampToTime(
                item.complate_time
              );
            });
            this.storeTotal = res.data.err_msg
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
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
          that.loading2 = false;
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
/deep/ .input1 .el-input__inner{
  height: 40px !important;
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
/deep/ .el-radio-button__inner:hover{
  color: #ee8f29;
}
/deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner{
  background-color:#ee8f29;
  border-color:#ee8f29;
  box-shadow: -1px 0 0 0 #ee8f29;
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
/deep/ .radios .el-radio-button__inner{
  border-left: 1px solid #dcdfe6;
  border-radius: 5px;
  margin: 10px 15px 5px;
}
/deep/ .radios.active .el-radio-button__inner{
  color: red;
}
/deep/ .el-dialog {
  // width: 1100px !important;
}
/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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
