<template>
  <div class="page">
    <div class="pageItem" v-show="pageType == 1">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">用户管理</span>
      </div>
      
      
      <div class="textItem">
        <div class="clearfix" style="margin-bottom: 20px">
          <el-input
            class="marginRight lt"
            style="width: 300px"
            placeholder="请输入账号/ID/昵称"
            prefix-icon="el-icon-search"
            @keyup.enter.native="pick_seach"
            v-model="seachVale"
          >
          </el-input>
          <el-select v-model="type_status" class="marginRight lt" placeholder="请选择激活类型">
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
          <!-- <el-button
            type="success"
            class="rt"
            style="margin-right: 10px"
            @click="edits"
            >编辑</el-button
          >
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="adds"
            >添加</el-button
          > -->
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
              <el-table-column label="昵称">
                <template slot-scope="scope">
                  <div class="green pointer" @click="open(scope.row,'1')">{{scope.row.nickname}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="account" label="账号" width="100"> </el-table-column>
              <el-table-column prop="uid" label="UID" width="60"> </el-table-column>
              <el-table-column label="资格合伙人激活">
                <template slot-scope="scope">
                  <div class="green pointer" v-if="scope.row.is_member == '1'" @click="open(scope.row,'2')">是</div>
                  <div class="green pointer" v-else @click="open(scope.row,'2')">否</div>
                </template>
              </el-table-column>
              <el-table-column prop="trial_time" label="资格合伙人时间" width="150">
              </el-table-column>
              <el-table-column prop="lc_num" label="联创合伙人"></el-table-column>
              <el-table-column prop="province_num" label="省级合伙人"></el-table-column>
              <el-table-column prop="city_num" label="市级合伙人"></el-table-column>
              <el-table-column label="资格合伙人券">
                <template slot-scope="scope">
                  <div class="green pointer" @click="open(scope.row,'3')">{{scope.row.total_quota}}</div>
                </template>
              </el-table-column>
              <el-table-column label="直推数量">
                <template slot-scope="scope">
                  <div class="green pointer" @click="open(scope.row,'4')">{{scope.row.drive_num}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="recommend_name" label="推荐人"></el-table-column>
              <el-table-column prop="recommend_account" label="推荐人账号"></el-table-column>
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
                    <el-input-number v-model="zi_num" @change="handleChange" :min="0" :max="100" label="描述文字"></el-input-number>
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
                            <div v-if="scope.row.coupon_type == '1'">+{{num}}</div>
                            <div v-else-if="scope.row.coupon_type == '2'">-{{num}}</div>
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

        <!-- 用户直推详情 -->
        <el-dialog
          width="70%"
          class="remarks_box"
          :visible.sync="two_tan"
          append-to-body
        >
          <div class="info"><s class="s"></s>用户直推详情</div>
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
                            <div class="green pointer" @click="open(scope.row,'1')">{{scope.row.nickname}}</div>
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
          <div class="info"><s class="s"></s>用户直推详情</div>
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
            <!-- <el-radio-group v-model="ji_type">
        <el-radio :label="1">开通资格合伙人(直接激活资格或人且无礼包发货)</el-radio>
        <el-radio :label="2">关闭资格合伙人(关闭资格合伙人资格，取消所有合伙人身份)</el-radio>
      </el-radio-group> -->
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
            @click="edits"
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
                  <div v-if="scope.row.is_profit == '1'">是</div>
                  <div v-else-if="scope.row.is_profit == '2'">否</div>
                  <div v-else>未知</div>
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
                  <div v-if="scope.row.is_open == '1'">否</div>
                  <div v-else-if="scope.row.is_open == '2'">是</div>
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
    </div>
  </div>
</template>
<script>
import { selling_user_list,user_identity_list,user_ticket_list,user_direct_drive_list } from "../../utils/axios";
export default {
  data() {
    return {
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
      ji_type:1,
      kuang_show: false,
      formLabelWidth1: "100px",
      add_wen: {
        content: "",
      },
      edit_wen: {
        content: "",
      },
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
          name: "已激活",
        },
        {
          id: "2",
          name: "未激活",
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
      pageType:1,
      time_value: "",
      time_value1: "",
      time_value2: "",
      time_value3: "",
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
    this.get_agent_list(); //获取推广列表
    this.height = document.body.clientHeight - 280
    this.height1 = document.body.clientHeight - 320
  },
  methods: {
    cunWen(){
      if(this.ji_type == 1){
        console.log("开通")
      }
      if(this.ji_type == 2){
        console.log("关闭")
      }
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
        this.zi_num = this.openItem.total_quota
        this.one_tan = true
        this.get_agent_list2()
      }else if(type == 4){
        this.two_tan = true
        this.get_agent_list3()
      }
    },
    zi_cun(){
      console.log(this.zi_num)
    },
    handleChange(val){
      this.zi_num = val
    },
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
    },
    edits() {
      this.edit_tan = true;
    },
    sure_address() {
      let data = "";
      if (this.multipleSelection.length > 1) {
        this.multipleSelection.forEach((item) => {
          if (data) {
            data = data + "," + item.id;
          } else {
            data = item.id;
          }
        });
      } else {
        data = this.multipleSelection[0].id;
      }
    //   del_questions({
    //     ids: data,
    //   })
    //     .then((res) => {
    //       if (res.data.err_code == 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            console.log(data);
            this.kuang_show = false;
    //         this.get_shop_list_page(
    //           this.queryInfo.page,
    //           this.queryInfo.pageSize
    //         );
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: res.data.err_msg,
    //           type: "error",
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
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
      selling_user_list(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.trial_time = this.commonJs.timestampToTime(
                element.trial_time
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
      selling_user_list({
        page: page,
        page_size: number,
        user_search:this.seachVale,
        is_member:this.type_status,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.trial_time = this.commonJs.timestampToTime(
                element.trial_time
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
      selling_user_list({
        page: 1,
        page_size: this.pageSize,
        user_search:this.seachVale,
        is_member:this.type_status,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.trial_time = this.commonJs.timestampToTime(
                element.trial_time
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