<template>
  <div class="page">
    <div class="pageItem" v-show="pageType == 1">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">用户分红</span>
      </div>
      
      
      <div class="textItem">
        <div class="clearfix" style="margin-bottom: 20px">
          <el-input
            class="marginRight lt"
            style="width: 300px"
            placeholder="请输入账号/ID/昵称/分红单号/分红人姓名"
            prefix-icon="el-icon-search"
            @keyup.enter.native="pick_seach"
            v-model="seachVale"
          >
          </el-input>
          <el-select v-model="type_status" class="marginRight lt" placeholder="请选择分红类型">
            <el-option
              v-for="item in type_status_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-date-picker
            :clearable="false"
            class="marginRight lt"
            v-model="time_value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="pick_seach"
            >搜索</el-button
          >
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="fn1(1)"
            >刷新</el-button
          >
        </div>
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="extendList"
              border
              :height="height"
              style="width: 100%"
            >
              <el-table-column label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column prop="complate_time" label="分红时间"> </el-table-column>
              <el-table-column prop="order_no" label="分红单号"> </el-table-column>
              <el-table-column prop="time_frame" label="分红时段"> </el-table-column>
              <el-table-column prop="nickname" label="用户昵称"> </el-table-column>
              <el-table-column prop="account" label="用户账号"> </el-table-column>
              <el-table-column prop="uid" label="UID"> </el-table-column>
              <el-table-column prop="real_name" label="分红人姓名"> </el-table-column>
              <el-table-column prop="share_type_str" label="分红类型"> </el-table-column>
              <el-table-column label="分红占比">
                <template slot-scope="scope">
                  {{scope.row.share_ratio}}%
                </template>
              </el-table-column>
              <el-table-column prop="fx_profit" label="分红金额"> </el-table-column>
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
        <!-- 用户资格合伙人券详情 -->
        <!--  -->
        <el-dialog
          width="60%"
          class="remarks_box"
          :visible.sync="one_tan"
          append-to-body
        >
          <!--  -->
          <div class="info"><s class="s"></s>用户资格合伙人券详情</div>
            <div style="padding: 30px 20px">
              <div class="blockBox divs">
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
                  <div class="lt yellow marginRight">
                    数量:{{openItem.total_quota}}
                  </div>
                  <div class="lt yellow marginRight">
                    <el-input-number v-model="zi_num" @change="handleChange" :min="zi_nums" :max="100" label="描述文字"></el-input-number>
                  </div>
                  <el-button
                      type="primary"
                      class="rt"
                      @click="zi_cun"
                      >保存</el-button
                    >
                </div>

                <div class="textItem">
                  <div class="clearfix" style="margin-bottom: 20px">
                    <el-select v-model="seachVale2" class="marginRight lt" placeholder="请选择业务类型">
                      <el-option
                        v-for="item in seachVale2_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                    <el-select v-model="type_status2" class="marginRight lt" placeholder="请选择数量类型">
                      <el-option
                        v-for="item in type_status_list2"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                    <el-date-picker
                      :clearable="false"
                      class="marginRight lt"
                      v-model="time_value2"
                      type="datetimerange"
                      :picker-options="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                    <el-button
                      type="primary"
                      class="rt"
                      style="margin-right: 10px"
                      @click="pick_seach2"
                      >搜索</el-button
                    >
                    <el-button
                      type="primary"
                      class="rt"
                      style="margin-right: 10px"
                      @click="fn3(1)"
                      >刷新</el-button
                    >
                  </div>
                  <el-row :gutter="20" class="goodsindex-list">
                    <el-col :span="24">
                      <el-table
                        v-loading="loading2"
                        ref="multipleTable1"
                        :data="extendList2"
                        border
                        :height="500"
                        style="width: 100%"
                      >
                        <el-table-column label="序号" type="index" width="50">
                        </el-table-column>
                        <el-table-column prop="create_time" label="生效时间" width="150"> </el-table-column>
                        <el-table-column label="类型">
                          <template slot-scope="scope">
                            <div v-if="scope.row.coupon_type == '1'">增加</div>
                            <div v-else-if="scope.row.coupon_type == '2'">减少</div>
                            <div v-else>未知</div>
                          </template>
                        </el-table-column>
                        <el-table-column label="业务">
                          <template slot-scope="scope">
                            <div v-if="scope.row.type == '1'">联创系统赠送</div>
                            <div v-else-if="scope.row.type == '2'">兑换</div>
                            <div v-else-if="scope.row.type == '3'">转出</div>
                            <div v-else-if="scope.row.type == '4'">转入</div>
                            <div v-else-if="scope.row.type == '5'">手动系统赠送</div>
                            <div v-else-if="scope.row.type == '6'">系统扣除</div>
                            <div v-else>未知</div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="" label="数量">
                          <template slot-scope="scope">
                            <div v-if="scope.row.coupon_type == '1'">+{{scope.row.num}}</div>
                            <div v-else-if="scope.row.coupon_type == '2'">-{{scope.row.num}}</div>
                            <div v-else>未知</div>
                          </template>
                        </el-table-column>
                        <el-table-column label="接收人/转赠人">
                        <template slot-scope="scope">
                            <div v-if="scope.row.type == '4'">{{scope.row.user_name}}(转赠人)</div>
                            <div v-else-if="scope.row.type == '3'">{{scope.row.user_name}}</div>
                            <div v-else>{{scope.row.user_name}}</div>
                        </template>
                        </el-table-column>
                        <el-table-column prop="account" label="账号"></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <!-- 分页 -->
                  <el-row :gutter="20" class="goodsindex-list" style="margin-top: 20px">
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
            </div>
          </div>
        </el-dialog>

        <!-- 资格合伙人手动管理 -->
        <el-dialog
          width="70%"
          class="remarks_box"
          :visible.sync="two_tan"
          append-to-body
        >
          <div class="info"><s class="s"></s>资格合伙人手动管理</div>
            <div style="padding: 30px 20px">
              <div class="blockBox divs">
                <!-- <div class="textItem clearfix marginBottom">
                  <div class="lt yellow marginRight">
                    当前用户:{{openItem.nickname}}
                  </div>
                  <div class="lt yellow marginRight">
                    用户ID:{{openItem.uid}}
                  </div>
                  <div class="lt yellow marginRight">
                    账号:{{openItem.account}}
                  </div>
                </div> -->
                <div class="textItem">
                  <div class="clearfix" style="margin-bottom: 20px">
                    <el-input v-model="seachVale3" class="marginRight lt" style="width:200px" @keyup.enter.native="pick_seach3" placeholder="请输入账号/ID/昵称"></el-input>
                    <el-date-picker
                      :clearable="false"
                      class="marginRight lt"
                      v-model="time_value3"
                      type="datetimerange"
                      :picker-options="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                    <el-button
                      type="primary"
                      class="rt"
                      style="margin-right: 10px"
                      @click="pick_seach3"
                      >搜索</el-button
                    >
                    <el-button
                      type="primary"
                      class="rt"
                      style="margin-right: 10px"
                      @click="fn4(1)"
                      >刷新</el-button
                    >
                  </div>
                  <el-row :gutter="20" class="goodsindex-list">
                    <el-col :span="24">
                      <el-table
                        v-loading="loading3"
                        ref="multipleTable1"
                        :data="extendList3"
                        border
                        :height="500"
                        style="width: 100%"
                      >
                        <el-table-column label="序号" type="index" width="50">
                        </el-table-column>
                        <el-table-column prop="reg_time" label="注册时间" width="150"> </el-table-column>
                        <el-table-column prop="member_time" label="生效时间" width="150"> </el-table-column>
                        <el-table-column label="昵称">
                          <template slot-scope="scope">
                            {{scope.row.nickname}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="account" label="账号"> </el-table-column>
                        <el-table-column prop="uid" label="UID"> </el-table-column>
                        <el-table-column prop="drive_num" label="直推数量"> </el-table-column>
                        <el-table-column prop="lc_num" label="联合创始人"> </el-table-column>
                        <el-table-column prop="city_num" label="市级合伙人"> </el-table-column>
                        <el-table-column prop="province_num" label="省级合伙人"> </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <!-- 分页 -->
                  <el-row :gutter="20" class="goodsindex-list" style="margin-top: 20px">
                    <el-col :span="24" class="goodsindex-page-box">
                      <el-pagination
                        @size-change="handleSizeChange3"
                        @current-change="handleCurrentChange3"
                        :current-page="queryInfo3.page"
                        :page-sizes="[5, 10, 20, 30, 50]"
                        :page-size="queryInfo3.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="queryInfo3.total"
                      >
                      </el-pagination>
                    </el-col>
                  </el-row>
              </div>
            </div>
          </div>
        </el-dialog>

        <!-- 合伙人状态手动管理 -->
        <el-dialog
          width="30%"
          class="remarks_box"
          :visible.sync="three_tan"
          append-to-body
        >
          <div class="info"><s class="s"></s>合伙人状态手动管理</div>
          <div style="padding: 30px 20px">
            <div class="clearfix">
              <div class="lt yellow marginRight">
                当前用户:{{openItem.nickname}}
              </div>
              <div class="lt yellow marginRight">
                用户ID:{{openItem.uid}}
              </div>
              <div class="lt yellow marginRight">
                账号:{{openItem.account}}
              </div>
            </div>
            <div style="margin:10px 0">
              <div>
                资格合伙人状态:
                <span class="newGreen" v-if="openItem.is_member == 1">已激活</span>
                <span class="red" v-else-if="openItem.is_member == 2">未激活</span>
              </div>
            </div>
            
            <div class="gre">
              <el-radio v-model="ji_type" style="margin:10px 0;" :label="1">开通资格合伙人(直接激活资格或人且无礼包发货)</el-radio>
            </div>
            <div class="reds">
              <el-radio v-model="ji_type" :label="2">关闭资格合伙人(关闭资格合伙人资格，取消所有合伙人身份)</el-radio>
            </div>
          </div>
          <div
              slot="footer"
              class="dialog-footer clearfix"
              style="padding: 0 40px 0 30px; "
            >
              <el-button
                type="success"
                class="rt"
                @click="cunWen"
                :disabled='openItem.is_member == ji_type'
                style="margin-left: 15px"
                >保 存</el-button
              >
              <el-button type="danger" class="rt" @click="three_tan = false"
                >取 消</el-button
              >
            </div>
        </el-dialog>
        
      </div>
    </div>

    <div class="pageItem" v-show="pageType == 2">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">用户详情</span>
      </div>
      <!--  -->
      <div class="textItem clearfix">
        <div class="lt yellow marginRight">
          当前用户:{{openItem.nickname}}
        </div>
        <div class="lt yellow marginRight">
          账号:{{openItem.account}}
        </div>
        <div class="lt yellow marginRight">
          用户ID:{{openItem.uid}}
        </div>
      </div>
      <div class="textItem">
        <div class="clearfix" style="margin-bottom: 20px">
          <el-select v-model="seachVale1" class="marginRight lt" placeholder="请选择身份类型">
            <el-option
              v-for="item in seachVale1_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-select v-model="type_status1" class="marginRight lt" placeholder="请选择申请身份">
            <el-option
              v-for="item in type_status_list1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-date-picker
            :clearable="false"
            class="marginRight lt"
            v-model="time_value1"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-button
            type="success"
            class="rt"
            style="margin-right: 10px"
            @click="adds"
            >身份管理</el-button
          >
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="pick_seach1"
            >搜索</el-button
          >
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="fn2(1)"
            >刷新</el-button
          >
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="pageType = 1"
            >返回</el-button
          >
        </div>
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading1"
              ref="multipleTable1"
              :data="extendList1"
              border
              :height="height1"
              style="width: 100%"
            >
              <el-table-column label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column prop="trial_time" label="生效时间" width="150"> </el-table-column>
              <el-table-column label="类型">
                <template slot-scope="scope">
                  <div v-if="scope.row.agent_type == '1'">市代理</div>
                  <div v-else-if="scope.row.agent_type == '2'">省代理</div>
                  <div v-else-if="scope.row.agent_type == '3'">联创</div>
                </template>
              </el-table-column>
              <el-table-column prop="region" label="身份"></el-table-column>
              <el-table-column label="是否收益">
                <template slot-scope="scope">
                  <div v-if="scope.row.state == '2' && scope.row.agent_type == '3'">
                    <div v-if="scope.row.is_profit == '1'" class="green pointer" @click="opens(scope.row,'2','1')">是</div>
                    <div v-else-if="scope.row.is_profit == '2'" class="green pointer" @click="opens(scope.row,'2','2')">否</div>
                  </div>
                  <div v-else>
                    <div v-if="scope.row.is_profit == '1'">是</div>
                    <div v-else-if="scope.row.is_profit == '2'">否</div>
                    <div v-else>未知</div>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column prop="earnings" label="累计收益"></el-table-column>
              <el-table-column label="开通流程">
                <template slot-scope="scope">
                  <div v-if="scope.row.type == '1'">正常流程</div>
                  <div v-else-if="scope.row.type == '2'">手动开通</div>
                  <div v-else-if="scope.row.type == '3'">赠送开通</div>
                  <div v-else>未知</div>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.state == '1'">审核中</div>
                  <div v-else-if="scope.row.state == '2'">审核成功</div>
                  <div v-else-if="scope.row.state == '3'">审核拒绝</div>
                  <div v-else-if="scope.row.state == '4'">候补中</div>
                  <div v-else-if="scope.row.state == '5'">取消(降级)</div>
                  <div v-else>未知</div>
                </template>
              </el-table-column>
              <el-table-column label="是否停用">
                <template slot-scope="scope">
                  <div v-if="scope.row.state == '2'">
                    <div v-if="scope.row.is_open == '1'" class="green pointer" @click="opens(scope.row,'1','1')">开启</div>
                    <div v-else-if="scope.row.is_open == '2'" class="green pointer" @click="opens(scope.row,'1','2')">停用</div>
                  </div>
                  <div v-else>
                    <div v-if="scope.row.is_open == '1'">开启</div>
                    <div v-else-if="scope.row.is_open == '2'">停用</div>
                    <div v-else>未知</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <el-row :gutter="20" class="goodsindex-list" style="margin-top: 20px">
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
      <!-- 反复确认框。烦啊 -->
      <div class="box" v-show="kuang_show">
        <div class="content" @click="kuang_show = false">
          <div class="kuang" @click.stop="kuang_show = true">
            <img src="../../assets/image/gantan.png" alt="" />
            <div class="text">{{dateTitle}}？</div>
            <el-button
              type="danger"
              @click.stop="kuang_show = false"
              style="margin-bottom: 10px; margin-right: 36px"
            >
              取消
            </el-button>
            <el-button type="success" @click="sure_add"> 确认 </el-button>
          </div>
        </div>
      </div>

      <!-- 增加问答 -->
      <el-dialog
        width="30%"
        class="remarks_box add"
        :visible.sync="add_tan"
        append-to-body
      >
        <div class="info">手动添加</div>
        <div style="padding: 0 0 20px">
          <div class="blockBox divs clearfix" style="padding:10px 20px;border-bottom:1px solid #cdcdcd">
            <div class="lt marginRight" style="margin-right:30px">
              用户昵称: {{openItem.nickname}}
            </div>
            <div class="lt marginRight">
              账号:{{openItem.account}}
            </div>
          </div>
          <div style="padding:30px;">
            <div class="clearfix" style="margin-bottom:20px">
              <div class="lt" style="width:66px">
                已开通:
              </div>
              <div class="lt clearfix" style="width:calc(100% - 66px)">
                <div v-if="kaitong.length > 0">
                  <span class="lt marginRight" style="margin-bottom:5px" v-for="(item,index) in kaitong" :key="index">{{item}}</span>
                </div>
                <div v-else>
                  暂无
                </div>
              </div>
            </div>
            <div>
              <div>手动新增身份</div>
              <div>
                <el-radio v-model="shou_type" :disabled="lianchuang" style="margin:10px 0;" :label="1">联创合伙人*1</el-radio>
              </div>
              <div>
                <el-radio v-model="shou_type" :label="2">
                  <span>区域合伙人</span>
                  <el-select
                    style="width:40%;margin-left: 10px;"
                    placeholder="请选择省份"
                    v-model="code.province_code"
                    :disabled="shou_type != 2"
                  >
                    <el-option
                      v-for="item in provinceList1"
                      :key="item.province_id"
                      :label="item.name"
                      :value="item.province_id"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    placeholder="请选择市"
                    v-show="city_ifShow1"
                    v-model="code.city_code"
                    style="margin-left: 10px;width:40%"
                    clearable
                    :disabled="shou_type != 2"
                  >
                    <el-option
                      v-for="item in cityList1"
                      :key="item.city_id"
                      :label="item.name"
                      :value="item.city_id"
                    >
                    </el-option>
                  </el-select>
                </el-radio>
              </div>
            </div>
          </div>
          <div
            slot="footer"
            class="dialog-footer clearfix"
            style="padding: 10px 40px 10px 30px; margin-top: 20px"
          >
            <el-button
              type="success"
              class="rt"
              @click="addWen"
              style="margin-left: 15px"
              >保 存</el-button
            >
            <el-button type="danger" class="rt" @click="add_tan = false"
              >取 消</el-button
            >
          </div>
        </div>
      </el-dialog>

    </div>
    
  </div>
</template>
<script>
import { user_share,
user_identity_list,
user_ticket_list,
activate_partner,
sys_give,
identity_manage,
sys_add_agent,
get_province1,
get_city1,
user_direct_drive_list } from "../../utils/axios";
export default {
  data() {
    return {
      shou_type:0,
      add_tan:false,
      
      pageItem:1,
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
      queryInfo2: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      queryInfo3: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      zi_num:0,
      zi_nums:0,
      ji_type:1,
      
      kuang_show: false,
      formLabelWidth1: "100px",
      add_wen: {
        content: "",
      },
      edit_wen: {
        content: "",
      },
      dates:"",
      dateTitle:"",
      pageSize:20,
      pageSize1:20,
      pageSize2:20,
      pageSize3:20,
      one_tan: false,
      two_tan: false,
      fn1: this.commonJs.Debounce(this.get_agent_list),
      fn2: this.commonJs.Debounce(this.get_agent_list1),
      fn3: this.commonJs.Debounce(this.get_agent_list2),
      extendList: [],
      extendList1: [],
      extendList2: [],
      extendList3: [],
      seachVale: "",
      seachVale1: "",
      seachVale1_list: [
        {
          id: "1",
          name: "区域",
        },
        {
          id: "2",
          name: "联创",
        }
      ],
      seachVale2: "",
      seachVale2_list: [
        {
          id: "1",
          name: "联创系统赠送",
        },
        {
          id: "2",
          name: "兑换",
        },
        {
          id: "3",
          name: "转赠",
        },
        {
          id: "4",
          name: "接收",
        },
        {
          id: "5",
          name: "手动发放",
        },
        {
          id: "6",
          name: "手动扣减",
        }
      ],
      seachVale3: "",
      openItem:{

      },
      
      loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      three_tan:false,
      multipleSelection: [],
      type_status:"",
      type_status_list: [
        {
          id: "1",
          name: "自主分红",
        },
        {
          id: "2",
          name: "推荐分红",
        }
      ],
      
      type_status1:"",
      type_status_list1: [
        {
          id: "1",
          name: "审核中",
        },
        {
          id: "2",
          name: "审核成功",
        },
        {
          id: "3",
          name: "审核拒绝",
        },
        {
          id: "4",
          name: "候补",
        },
        {
          id: "5",
          name: "被取消(降级)",
        }
        
      ],
      type_status2:"",
      type_status_list2: [
        {
          id: "1",
          name: "增加",
        },
        {
          id: "2",
          name: "减少",
        }
      ],
      city_ifShow1:false,
      code:{
        province_code:"",
        city_code:"",
      },
      provinceList1: [], //省
      cityList1: [], //市
      pageType:1,
      time_value: "",
      time_value1: "",
      time_value2: "",
      time_value3: "",
      kaitong:[],
      lianchuang:false,
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
  watch:{
    "code.province_code": {
      handler: function (news, olds) {
        console.log("来了")
        console.log(news)
        if (news) {
          this.city_ifShow1 = true;
          this.get_city1(news);
          this.code.city_code = "";
        } else {
          this.city_ifShow1 = false;
          this.code.city_code = "";
          console.log(this.code)
        }
      },
    },
  },
  created() {
    this.get_agent_list(); //获取推广列表
    // this.get_province1(); //获取省份
    this.height = document.body.clientHeight - 280
    this.height1 = document.body.clientHeight - 320
  },
  methods: {
    
    addWen() {
      if (this.shou_type == 0) {
        this.$message({
          showClose: true,
          message: "请选择手动添加类型",
          type: "error",
        });
        return;
      }
      let data = {
        uid:this.openItem.uid,
        
      }
      if(this.shou_type == 1){
        data.type = 3
      }
      if(this.shou_type == 2){
        data.type = 2
        if(this.code.province_code){

        }else{
          this.$message({
            showClose: true,
            message: "请选择省份",
            type: "error",
          });
          return;
        }
        data.province_code = this.code.province_code
        data.city_code = this.code.city_code
      }
      
      sys_add_agent(
        data
      ).then((res) => {
        if (res.data.err_code == 0) {
            this.$message({
              message: "新增成功",
              type: "success",
            });
          this.add_tan = false
          this.city_ifShow1 = false,
          this.code = {
            province_code:"",
            city_code:"",
          }
          this.shou_type = 0
          this.get_shop_list_page1(
            this.queryInfo1.page,
            this.queryInfo1.pageSize
          );
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          })
        };
      })
      .catch((error) => {
        console.log(error);
      });
    },
    adds() {
      this.add_tan = true;
    },
    cunWen(){
      activate_partner({
        uid: this.openItem.uid,
        is_member:this.ji_type,
      })
        .then((res) => {
          if (res.data.err_code == 0) {
            if(this.ji_type == 1){
              this.$message({
                message: "开通成功",
                type: "success",
              });
            }
            if(this.ji_type == 2){
              this.$message({
                message: "关闭资格合伙人成功",
                type: "success",
              });
            }
            this.three_tan = false
            this.get_shop_list_page(
              this.queryInfo.page,
              this.queryInfo.pageSize
            );
          } else {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            })
          };
        })
        .catch((error) => {
          console.log(error);
        });
      // 
      
    },
    open(item,type){
      // type 1 昵称
      // type 1 
      this.openItem = item
      this.ji_type = Number(this.openItem.is_member)
      if(type == 1){
        this.pageType = 2
        this.two_tan = false
        this.get_agent_list1()
      }else if(type == 2){
        this.three_tan = true
      }else if(type == 3){
        this.zi_num = 0
        this.zi_nums = Number("-" + this.openItem.total_quota)
        console.log(this.zi_nums)
        this.one_tan = true
        
        this.get_agent_list2()
      }else if(type == 4){
        this.two_tan = true
        this.get_agent_list3()
      }
    },
    opens(item,type,types){
      console.log(item)
      let data = {
        id:item.id
      }

      if(type == 1){
        data.status = 1
        if(types == 1){
          this.dateTitle = '是否确认关闭'
        }else{
          this.dateTitle = '是否确认开启'
        }
      }else{
        data.status = 2
        if(types == 1){
          this.dateTitle = '是否关闭收益'
        }else{
          this.dateTitle = '是否开启收益'
        }
      }
      if(types == 1){
        data.is_open = 2
      }else{
        data.is_open = 1
      }
      console.log(data)
      this.dates = data
      this.kuang_show = true
    },
    sure_add() {
      let data = this.dates
      console.log(data)
      identity_manage(
        data
      )
        .then((res) => {
          console.log(res)
          if (res.data.err_code == 0) {
            
            this.$message({
              message: "操作成功",
              type: "success",
            });
            console.log(data);
            this.kuang_show = false;
            this.get_shop_list_page1(
              this.queryInfo1.page,
              this.queryInfo1.pageSize
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
    zi_cun(){
      console.log(this.zi_num)
      let type = 0;
      if(this.zi_num == 0){
        this.$message({
          showClose: true,
          message: "不能加0张券",
          type: "error",
        });
      }else if(this.zi_num > 0){
        type = 1
      }else if(this.zi_num < 0){
        type = 2
        this.zi_num = Math.abs(this.zi_num)
      }
      let data = {
        uid: this.openItem.uid,
        num:this.zi_num,
        type:type
      }
      sys_give(
        data
      )
        .then((res) => {
          if (res.data.err_code == 0) {
              this.$message({
                message: "加券成功",
                type: "success",
              });
              this.one_tan = false
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
    handleChange(val){
      this.zi_num = val
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
    //获取推广列表
    get_agent_list(index) {
      this.seachVale = "";
      this.type_status = '';
      this.time_value = ''
      this.loading = true;
      let request_form = {
        page: 1,
        page_size: this.pageSize,
      };
      user_share(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
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
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      this.loading = true;
      user_share({
        page: page,
        page_size: number,
        search:this.seachVale,
        share_type:this.type_status,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
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
      
      if (this.seachVale == "" && this.time_value == "" && this.type_status == "") {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      this.loading = true;
      user_share({
        page: 1,
        page_size: this.pageSize,
        search:this.seachVale,
        share_type:this.type_status,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
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
    // 获取省
    get_province1() {
      let that = this;
      get_province1().then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg.list.length > 0) {
            res.data.err_msg.list.forEach(item => {
              that.provinceList1.push({
                province_id: item.code,
                name: item.name,
              });
            })
            console.log(that.provinceList1)
          }
        } else {
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    // 获取市
    get_city1(province_id) {

      let that = this;
      this.cityList1 = [];
      get_city1({ code: province_id }).then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg.list.length > 0) {
            res.data.err_msg.list.forEach(item => {
              that.cityList1.push({
                city_id: item.code,
                name: item.name,
              });
            })
          }
        } else {
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    //身份详情列表

    get_agent_list1(index) {
      this.seachVale1 = "";
      this.type_status1 = ''
      this.time_value1 = '';
      this.loading1 = true;
      let request_form = {
        page: 1,
        page_size: this.pageSize1,
        uid:this.openItem.uid
      };
      user_identity_list(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            this.kaitong = []
            this.lianchuang = false
            this.loading1 = false;
            res.data.err_msg.list.forEach((element) => {
              element.trial_time = this.commonJs.timestampToTime(
                element.trial_time
              );
              if(element.state == '2'){
                if(element.agent_type == 3){
                  this.lianchuang = true
                }
                this.kaitong.push(element.region+"合伙人")
              }
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
            this.pageSize1 = res.data.err_msg.page_size;
            if (index == 1) {
              this.$message({
                message: "刷新成功",
                type: "success",
              });
            }
          } else {
            this.loading1 = false;
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
    get_shop_list_page1(page, number) {
      var time1 = "";
      var time2 = "";
      if (this.time_value1 != "") {
        time1 = this.commonJs.dataTime(this.time_value1[0]);
        time2 = this.commonJs.dataTime(this.time_value1[1]);
      }
      this.loading1 = true;
      user_identity_list({
        page: page,
        page_size: number,
        agent_type:this.seachVale1,
        state:this.type_status1,
        start_time: time1,
        end_time: time2,
        uid:this.openItem.uid
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.kaitong = []
            this.lianchuang = false
            this.loading1 = false;
            res.data.err_msg.list.forEach((element) => {
              element.trial_time = this.commonJs.timestampToTime(
                element.trial_time
              );
              if(element.state == '2'){
                if(element.agent_type == 3){
                  this.lianchuang = true
                }
                this.kaitong.push(element.region+"合伙人")
              }
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
            this.pageSize1 = res.data.err_msg.page_size;
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
    //每页显示条数改变
    handleSizeChange1(val) {
      this.get_shop_list_page1(1, val);
    },

    //当前页
    handleCurrentChange1(val) {
      this.get_shop_list_page1(val, this.pageSize1);
    },
    //搜索
    pick_seach1() {
      if (this.seachVale1 == "" && this.time_value1 == "" && this.type_status1 == "") {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      var time1 = "";
      var time2 = "";
      if (this.time_value1 != "") {
        time1 = this.commonJs.dataTime(this.time_value1[0]);
        time2 = this.commonJs.dataTime(this.time_value1[1]);
      }
      this.loading1 = true;
      user_identity_list({
        page: 1,
        page_size: this.pageSize1,
        agent_type:this.seachVale1,
        state:this.type_status1,
        start_time: time1,
        end_time: time2,
        uid:this.openItem.uid
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading1 = false;
            res.data.err_msg.list.forEach((element) => {
              element.trial_time = this.commonJs.timestampToTime(
                element.trial_time
              );
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
            this.pageSize1 = res.data.err_msg.page_size;
          } else {
            this.loading1 = false;
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

    //用户资格
    get_agent_list2(index) {
      this.seachVale2 = "";
      this.type_status2 = ''
      this.time_value2 = '';
      this.loading2 = true;
      let request_form = {
        page: 1,
        page_size: this.pageSize2,
        uid:this.openItem.uid
      };
      user_ticket_list(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            this.loading2 = false;
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
            this.pageSize2 = res.data.err_msg.page_size;
            if (index == 1) {
              this.$message({
                message: "刷新成功",
                type: "success",
              });
            }
          } else {
            this.loading2 = false;
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
    get_shop_list_page2(page, number) {
      var time1 = "";
      var time2 = "";
      if (this.time_value2 != "") {
        time1 = this.commonJs.dataTime(this.time_value2[0]);
        time2 = this.commonJs.dataTime(this.time_value2[1]);
      }
      this.loading2 = true;
      user_ticket_list({
        page: page,
        page_size: number,
        type:this.seachVale2,
        coupon_type:this.type_status2,
        start_time: time1,
        end_time: time2,
        uid:this.openItem.uid
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading2 = false;
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
            this.pageSize2 = res.data.err_msg.page_size;
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
    //每页显示条数改变
    handleSizeChange2(val) {
      this.get_shop_list_page2(1, val);
    },

    //当前页
    handleCurrentChange2(val) {
      this.get_shop_list_page2(val, this.pageSize2);
    },
    //搜索
    pick_seach2() {
      if (this.seachVale2 == "" && this.time_value2 == "" && this.type_status2 == "") {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      var time1 = "";
      var time2 = "";
      if (this.time_value2 != "") {
        time1 = this.commonJs.dataTime(this.time_value2[0]);
        time2 = this.commonJs.dataTime(this.time_value2[1]);
      }
      this.loading1 = true;
      user_ticket_list({
        page: 1,
        page_size: this.pageSize2,
        type:this.seachVale2,
        coupon_type:this.type_status2,
        start_time: time1,
        end_time: time2,
        uid:this.openItem.uid
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading2 = false;
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
            this.pageSize2 = res.data.err_msg.page_size;
          } else {
            this.loading2 = false;
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

    //用户直推
    //用户资格
    get_agent_list3(index) {
      this.seachVale3 = "";
      this.type_status3 = ''
      this.time_value3 = '';
      this.loading3 = true;
      let request_form = {
        page: 1,
        page_size: this.pageSize3,
        uid:this.openItem.uid
      };
      user_direct_drive_list(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            this.loading3 = false;
            res.data.err_msg.list.forEach((element) => {
              element.reg_time = this.commonJs.timestampToTime(
                element.reg_time
              );
              element.member_time = this.commonJs.timestampToTime(
                element.member_time
              );
            });
            this.extendList3 = res.data.err_msg.list;
            this.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo3.page = parseInt(res.data.err_msg.page);
            this.queryInfo3.total = parseInt(res.data.err_msg.total_number);
            this.pageSize3 = res.data.err_msg.page_size;
            if (index == 1) {
              this.$message({
                message: "刷新成功",
                type: "success",
              });
            }
          } else {
            this.loading3 = false;
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
    get_shop_list_page3(page, number) {
      var time1 = "";
      var time2 = "";
      if (this.time_value3 != "") {
        time1 = this.commonJs.dataTime(this.time_value3[0]);
        time2 = this.commonJs.dataTime(this.time_value3[1]);
      }
      this.loading3 = true;
      user_direct_drive_list({
        page: page,
        page_size: number,
        type:this.seachVale3,
        coupon_type:this.type_status3,
        start_time: time1,
        end_time: time2,
        uid:this.openItem.uid
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading3 = false;
            res.data.err_msg.list.forEach((element) => {
              element.reg_time = this.commonJs.timestampToTime(
                element.reg_time
              );
              element.member_time = this.commonJs.timestampToTime(
                element.member_time
              );
            });
            this.extendList3 = res.data.err_msg.list;
            this.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo3.page = parseInt(res.data.err_msg.page);
            this.queryInfo3.total = parseInt(res.data.err_msg.total_number);
            this.pageSize3 = res.data.err_msg.page_size;
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
    //每页显示条数改变
    handleSizeChange3(val) {
      this.get_shop_list_page3(1, val);
    },

    //当前页
    handleCurrentChange3(val) {
      this.get_shop_list_page3(val, this.pageSize3);
    },
    //搜索
    pick_seach3() {
      if (this.seachVale3 == "" && this.time_value3 == "" && this.type_status3 == "") {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      var time1 = "";
      var time2 = "";
      if (this.time_value3 != "") {
        time1 = this.commonJs.dataTime(this.time_value3[0]);
        time2 = this.commonJs.dataTime(this.time_value3[1]);
      }
      this.loading1 = true;
      user_direct_drive_list({
        page: 1,
        page_size: this.pageSize3,
        type:this.seachVale3,
        coupon_type:this.type_status3,
        start_time: time1,
        end_time: time2,
        uid:this.openItem.uid
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading3 = false;
            res.data.err_msg.list.forEach((element) => {
              element.reg_time = this.commonJs.timestampToTime(
                element.reg_time
              );
              element.member_time = this.commonJs.timestampToTime(
                element.member_time
              );
            });
            this.extendList3 = res.data.err_msg.list;
            this.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo3.page = parseInt(res.data.err_msg.page);
            this.queryInfo3.total = parseInt(res.data.err_msg.total_number);
            this.pageSize3 = res.data.err_msg.page_size;
          } else {
            this.loading3 = false;
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
      s {
        background: #ee8f29;
        width: 5px;
        height: 25px;
        margin-right: 10px;
      }
      span {
        font-size: 20px;
        line-height: 28px;
        color: #ee8f29;
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
/deep/.gre .el-radio__input.is-checked+.el-radio__label{
  color:#0cb327;
}
/deep/.reds .el-radio__input.is-checked+.el-radio__label{
  color:#f40909;
}
/deep/.el-input-number__decrease,/deep/ .el-input-number__increase{
  top:2px;
  width: 30px;
  height: 28px;
}
/deep/ .el-input-number{
  line-height: 30px;
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
.yellow{
  font-weight: bold;
  line-height: 30px;
}
</style>