<template>
  <div class="page">
    <div class="pageItem">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">用户明细</span>
      </div>
      <div class="textItem">
        <div class="clearfix" style="margin-bottom: 20px">
          <el-input
            class="lt marginRight"
            style="width: 300px"
            placeholder="请输入用户id/用户昵称/用户账号"
            prefix-icon="el-icon-search"
            @keyup.enter.native="pick_seach"
            v-model="seachVale"
          >
          </el-input>
          <!-- <el-select v-model="shen_status" class="marginRight lt" placeholder="请选择审核状态">
            <el-option
              v-for="item in shen_status_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select> -->
          <!-- <el-date-picker
            :clearable="false"
            class="marginRight lt"
            v-model="time_value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker> -->

          
          <el-button
            type="success"
            class="rt"
            style="margin-right: 10px"
            @click="fn(1)"
            >刷新</el-button
          >
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="pick_seach"
          >搜索</el-button>
          <el-button type="warning" class="rt" @click="shan">互赠</el-button>
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
              <el-table-column label="序号" type="index" width="80">
              </el-table-column>
              <el-table-column prop="nickname" label="用户昵称"> </el-table-column>
              <el-table-column prop="phone" label="账号"> </el-table-column>
              <el-table-column prop="uid" label="UID"> </el-table-column>
              <el-table-column prop="is_buy_money" label="橘宝会员"> </el-table-column>
              <el-table-column label="可使用橘宝">
                <template slot-scope="scope">
                  <div class="green pointer" @click="open(scope.row,'1')">{{scope.row.point_balance}}</div>
                </template>
              </el-table-column>
              <el-table-column label="待使用橘宝">
                <template slot-scope="scope">
                  <div class="green pointer" @click="open(scope.row,'2')">{{scope.row.stay_use_score}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="await_extract" label="待提取橘宝"> </el-table-column>
              <el-table-column label="购物得橘宝">
                <template slot-scope="scope">
                  <div class="green pointer" @click="open(scope.row,'3')">{{scope.row.stay_use_released}}</div>
                </template>
              </el-table-column>
              <el-table-column label="当前冻结橘宝">
                <template slot-scope="scope">
                  <div class="green pointer" @click="open(scope.row,'5')">{{scope.row.point_unbalance}}</div>
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
        <!-- 第一个 可使用橘宝明细 -->
        <el-dialog
          width="60%"
          class="remarks_box add"
          :visible.sync="tan1"
          append-to-body
        >
          <div class="info">可使用橘宝明细</div>
          <div style="padding: 30px">
            <div class="textItem clearfix marginBottom">
              <div class="lt yellow marginRight">
                当前用户:{{openItem.nickname}}
              </div>
              <div class="lt yellow marginRight">
                用户ID:{{openItem.uid}}
              </div>
              <div class="lt yellow marginRight">
                账号:{{openItem.phone}}
              </div>
              <div class="lt yellow marginRight">
                橘宝会员:{{openItem.is_buy_money}}
              </div>
              <div class="lt yellow marginRight">
                可使用橘宝数:{{openItem.point_balance}}
              </div>
            </div>
            <div class="clearfix" style="margin-bottom: 20px">
              <!-- <el-input
                class="lt marginRight"
                style="width: 300px"
                placeholder="请输入用户id/用户昵称/用户账号"
                prefix-icon="el-icon-search"
                @keyup.enter.native="pick_seach1"
                v-model="seachVale1"
              >
              </el-input> -->
              <el-select v-model="shen_status1" class="marginRight lt" placeholder="请选择类型">
                <el-option
                  v-for="item in shen_status_list1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-select v-model="shen_status11" class="marginRight lt" placeholder="请选择业务">
                <el-option
                  v-for="item in shen_status_list11"
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
                @click="fn1(1)"
                >刷新</el-button
              >
              <el-button
                type="primary"
                class="rt"
                style="margin-right: 10px"
                @click="pick_seach1"
              >搜索</el-button>
            </div>
            <el-row :gutter="20" class="goodsindex-list">
              <el-col :span="24">
              
                <el-table
                  ref="multipleTable"
                  :data="extendList1"
                  border
                   height="400"
                  style="width: 100%"
                >
                  <el-table-column label="序号" type="index" width="80">
                  </el-table-column>
                  <el-table-column prop="create_time" label="时间"> </el-table-column>
                  <el-table-column prop="score_type_str" label="类型"> </el-table-column>
                  <el-table-column prop="type_str" label="业务"> </el-table-column>
                  <el-table-column prop="score" label="变更的积分"> </el-table-column>
                  <el-table-column prop="before" label="变更前的积分"> </el-table-column>
                  <el-table-column prop="after" label="变更后的积分"> </el-table-column>
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
        </el-dialog>

        <!-- 第二个 待使用橘宝明细 -->
        <el-dialog
          width="60%"
          class="remarks_box add"
          :visible.sync="tan2"
          append-to-body
        >
          <div class="info">待使用橘宝明细</div>
          <div style="padding: 29px">
            <div class="textItem clearfix marginBottom">
              <div class="lt yellow marginRight">
                当前用户:{{openItem.nickname}}
              </div>
              <div class="lt yellow marginRight">
                用户ID:{{openItem.uid}}
              </div>
              <div class="lt yellow marginRight">
                账号:{{openItem.phone}}
              </div>
              <div class="lt yellow marginRight">
                橘宝会员:{{openItem.is_buy_money}}
              </div>
              <div class="lt yellow marginRight">
                待使用橘宝数:{{openItem.stay_use_score}}
              </div>
            </div>
            <div class="clearfix" style="margin-bottom: 20px">
              <!-- <el-select v-model="shen_status2" class="marginRight lt" placeholder="请选择类型">
                <el-option
                  v-for="item in shen_status_list2"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select> -->
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
                type="success"
                class="rt"
                style="margin-right: 10px"
                @click="fn2(1)"
                >刷新</el-button
              >
              <el-button
                type="primary"
                class="rt"
                style="margin-right: 10px"
                @click="pick_seach2"
              >搜索</el-button>
            </div>
            <el-row :gutter="20" class="goodsindex-list">
              <el-col :span="24">
                <el-table
                  ref="multipleTable"
                  :data="extendList2"
                  border
                  height="400"
                  style="width: 100%"
                >
                  <el-table-column label="序号" type="index" width="80">
                  </el-table-column>
                  <el-table-column prop="create_time" label="时间"> </el-table-column>
                  <el-table-column prop="memo" label="备注"> </el-table-column>
                  <el-table-column prop="score" label="数量"> </el-table-column>
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
                  :page-sizes="[5, 10, 20, 50]"
                  :page-size="queryInfo2.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="queryInfo2.total"
                >
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </el-dialog>

        <!-- 第三个 购物得橘宝明细 -->
        <el-dialog
          width="60%"
          class="remarks_box add"
          :visible.sync="tan3"
          append-to-body
        >
          <div class="info">购物得橘宝明细</div>
          <div style="padding: 30px">
            <div class="textItem clearfix marginBottom">
              <div class="lt yellow marginRight">
                当前用户:{{openItem.nickname}}
              </div>
              <div class="lt yellow marginRight">
                用户ID:{{openItem.uid}}
              </div>
              <div class="lt yellow marginRight">
                账号:{{openItem.phone}}
              </div>
              <div class="lt yellow marginRight">
                橘宝会员:{{openItem.is_buy_money}}
              </div>
              <div class="lt yellow marginRight">
                购物得橘宝数:{{openItem.stay_use_released}}
              </div>
            </div>
            <div class="clearfix" style="margin-bottom: 20px">
              <el-select v-model="shen_status3" class="marginRight lt" placeholder="请选择类型">
                <el-option
                  v-for="item in shen_status_list3"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
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
                type="success"
                class="rt"
                style="margin-right: 10px"
                @click="fn3(1)"
                >刷新</el-button
              >
              <el-button
                type="primary"
                class="rt"
                style="margin-right: 10px"
                @click="pick_seach3"
              >搜索</el-button>
            </div>
            <el-row :gutter="20" class="goodsindex-list">
              <el-col :span="24">
                <el-table
                  ref="multipleTable"
                  :data="extendList3"
                  border
                  height="400"
                  style="width: 100%"
                >
                  <el-table-column label="序号" type="index" width="80">
                  </el-table-column>
                  <el-table-column prop="create_time" label="时间"> </el-table-column>
                  <el-table-column prop="state_str" label="类型"> </el-table-column>
                  <el-table-column prop="order_no" label="订单编号"> </el-table-column>
                  <el-table-column prop="score" label="数量"> </el-table-column>
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
                  :page-sizes="[5, 10, 20, 50]"
                  :page-size="queryInfo3.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="queryInfo3.total"
                >
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </el-dialog>

        <!-- 第四个 互赠明细 -->
        <el-dialog
          width="60%"
          class="remarks_box add"
          :visible.sync="tan4"
          append-to-body
        >
          <div class="info">互赠明细</div>
          <div style="padding: 29px">
            <div class="textItem clearfix marginBottom">
              <div class="lt yellow marginRight">
                当前用户:{{openItem.nickname}}
              </div>
              <div class="lt yellow marginRight">
                用户ID:{{openItem.uid}}
              </div>
              <div class="lt yellow marginRight">
                账号:{{openItem.phone}}
              </div>
              <div class="lt yellow marginRight">
                橘宝会员:{{openItem.is_buy_money}}
              </div>
            </div>
            <div class="clearfix" style="margin-bottom: 20px">
              <el-select v-model="shen_status4" class="marginRight lt" placeholder="请选择类型">
                <el-option
                  v-for="item in shen_status_list4"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-date-picker
                :clearable="false"
                class="marginRight lt"
                v-model="time_value4"
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
                @click="fn4(1)"
                >刷新</el-button
              >
              <el-button
                type="primary"
                class="rt"
                style="margin-right: 10px"
                @click="pick_seach4"
              >搜索</el-button>
            </div>
            <el-row :gutter="20" class="goodsindex-list">
              <el-col :span="24">
                <el-table
                  ref="multipleTable"
                  :data="extendList4"
                  border
                  height="400"
                  style="width: 100%"
                >
                  <el-table-column label="序号" type="index" width="80">
                  </el-table-column>
                  <el-table-column prop="create_time" label="时间"> </el-table-column>
                  <el-table-column label="类型">
                    <template slot-scope="scope">
                      <div v-if="scope.row.type == 1">增加</div>
                      <div v-else-if="scope.row.type == 2">减少</div>
                      <div v-else>未知</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="give_user_id" label="接收人/转赠人"> </el-table-column>
                  <el-table-column prop="account" label="账号"> </el-table-column>
                  <el-table-column prop="score" label="数量"> </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <!-- 分页 -->
            <el-row :gutter="20" class="goodsindex-list" style="margin-top: 20px">
              <el-col :span="24" class="goodsindex-page-box">
                <el-pagination
                  @size-change="handleSizeChange4"
                  @current-change="handleCurrentChange4"
                  :current-page="queryInfo4.page"
                  :page-sizes="[5, 10, 20, 50]"
                  :page-size="queryInfo4.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="queryInfo4.total"
                >
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </el-dialog>
        <!-- 第五个 冻结橘宝明细 -->
        <el-dialog
          width="60%"
          class="remarks_box add"
          :visible.sync="tan5"
          append-to-body
        >
          <div class="info">购物得橘宝明细</div>
          <div style="padding: 29px">
            <div class="textItem clearfix marginBottom">
              <div class="lt yellow marginRight">
                当前用户:{{openItem.nickname}}
              </div>
              <div class="lt yellow marginRight">
                用户ID:{{openItem.uid}}
              </div>
              <div class="lt yellow marginRight">
                账号:{{openItem.phone}}
              </div>
              <div class="lt yellow marginRight">
                橘宝会员:{{openItem.is_buy_money}}
              </div>
              <div class="lt yellow marginRight">
                当前冻结橘宝数:{{openItem.point_balance}}
              </div>
            </div>
            <div class="clearfix" style="margin-bottom: 20px">
              <el-select v-model="shen_status5" class="marginRight lt" placeholder="请选择类型">
                <el-option
                  v-for="item in shen_status_list5"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-date-picker
                :clearable="false"
                class="marginRight lt"
                v-model="time_value5"
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
                @click="fn5(1)"
                >刷新</el-button
              >
              <el-button
                type="primary"
                class="rt"
                style="margin-right: 10px"
                @click="pick_seach5"
              >搜索</el-button>
            </div>
            <el-row :gutter="20" class="goodsindex-list">
              <el-col :span="24">
                <el-table
                  ref="multipleTable"
                  :data="extendList5"
                  border
                  height="400"
                  style="width: 100%"
                >
                  <el-table-column label="序号" type="index" width="80">
                  </el-table-column>
                  <el-table-column prop="start_time" label="开始时间"> </el-table-column>
                  <el-table-column prop="end_time" label="结束时间"> </el-table-column>
                  <el-table-column label="类型">
                    <template slot-scope="scope">
                      <div v-if="scope.row.state == 1">进行中</div>
                      <div v-else-if="scope.row.state == 2">已完成</div>
                      <div v-else>未知</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="参与种类"> </el-table-column>
                  <el-table-column prop="deposit" label="投入橘宝"> </el-table-column>
                  <el-table-column prop="profit" label="获利"> </el-table-column>
                  <el-table-column prop="watering_num" label="累计浇水次数"> </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <!-- 分页 -->
            <el-row :gutter="20" class="goodsindex-list" style="margin-top: 20px">
              <el-col :span="24" class="goodsindex-page-box">
                <el-pagination
                  @size-change="handleSizeChange5"
                  @current-change="handleCurrentChange5"
                  :current-page="queryInfo5.page"
                  :page-sizes="[5, 10, 20, 50]"
                  :page-size="queryInfo5.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="queryInfo5.total"
                >
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </el-dialog>

      </div>
    </div>
  </div>
</template>
<script>
import { 
  get_user_list,
  detail_user_content,
  jvbao_shopping,
  jvbao_giff_gaff,
  jvbao_freeze,
  jvbao_used,
} from "../../utils/axios";
export default {
  data() {
    return {
      queryInfo: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      time_value1:"",
      shen_status1:"",
      shen_status_list1: [
        {
          id: "1",
          name: "增加",
        },
        {
          id: "2",
          name: "减少",
        }
      ],
      queryInfo1: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      extendList1:[],
      fn1: this.commonJs.Debounce(this.get_user_list1),
      shen_status11:"",
      shen_status_list11: [
        {
          id: "1",
          name: "代理消费",
        },
        {
          id: "2",
          name: "晋级消费",
        },
        {
          id: "3",
          name: "庄园收获",
        },
        {
          id: "4",
          name: "转出",
        },
        {
          id: "5",
          name: "转入",
        },
        {
          id: "6",
          name: "绑定微信",
        },
        {
          id: "7",
          name: "实名认证",
        },
        {
          id: "8",
          name: "浏览爆款商品",
        },
        {
          id: "9",
          name: "分享商品到朋友圈",
        },
        {
          id: "10",
          name: "分享橘椒给好友",
        },
        {
          id: "11",
          name: "推广会员",
        },
        {
          id: "12",
          name: "邀请会员",
        },
        {
          id: "13",
          name: "首推视频",
        },
        {
          id: "14",
          name: "转盘抽奖",
        },
        {
          id: "15",
          name: "翻牌游戏",
        },
        {
          id: "16",
          name: "橘宝商城换购商品",
        },
        {
          id: "17",
          name: "购买商品赠送橘宝",
        },
        {
          id: "18",
          name: "注册获得橘宝",
        },
        {
          id: "19",
          name: "团队成员获得橘宝",
        },
        {
          id: "20",
          name: "三方小游戏视频",
        },
        {
          id: "21",
          name: "三方广告视频",
        },
        {
          id: "22",
          name: "待提取橘宝转至余额",
        },
        {
          id: "23",
          name: "直推消费奖励橘宝",
        },
        {
          id: "24",
          name: "支付消费",
        },
        {
          id: "25",
          name: "开通合伙人消费橘宝",
        },
        {
          id: "26",
          name: "共富审核拒绝退还橘宝",
        },
        {
          id: "27",
          name: "订单购物手续费",
        }
      ],
      time_value2:"",
      shen_status2:"",
      shen_status_list2: [
        {
          id: "1",
          name: "收入",
        },
        {
          id: "2",
          name: "消费",
        }
      ],
      queryInfo2: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      extendList2:[],
      fn2: this.commonJs.Debounce(this.get_user_list2),

      time_value3:"",
      shen_status3:"",
      shen_status_list3: [
        {
          id: "1",
          name: "购物得橘宝",
        },
        {
          id: "2",
          name: "退款未生效",
        },
        {
          id: "3",
          name: "交易已完成",
        }
      ],
      queryInfo3: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      extendList3:[],
      fn3: this.commonJs.Debounce(this.get_user_list3),
      time_value4:"",
      shen_status4:"",
      shen_status_list4: [
        {
          id: "1",
          name: "增加",
        },
        {
          id: "2",
          name: "减少",
        }
      ],
      queryInfo4: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      extendList4:[],
      fn4: this.commonJs.Debounce(this.get_user_list4),
      time_value5:"",
      shen_status5:"",
      shen_status_list5: [
        {
          id: "1",
          name: "进行中",
        },
        {
          id: "2",
          name: "已完成",
        }
      ],
      queryInfo5: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      extendList5:[],
      fn5: this.commonJs.Debounce(this.get_user_list5),

      openItem:{

      },
      pageSize:20,
      kuang_show: false,
      formLabelWidth1: "100px",
      add_wen: {
        content: "",
      },
      edit_wen: {
        content: "",
      },
      edit_tan: false,
      tan1: false,
      tan2: false,
      tan3: false,
      tan4: false,
      tan5: false,
      fn: this.commonJs.Debounce(this.get_user_list),
      
      extendList: [],
      seachVale: "",
      loading: false,
      multipleSelection: [],
      shen_status:"",
      shen_status_list: [
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
          name: "候补中",
        },
        {
          id: "5",
          name: "取消或被降级",
        },
      ],
      heigh:"",
      time_value: "",
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
    this.get_user_list(); //获取推广列表
    this.height = document.body.clientHeight - 320
  },
  methods: {
    open(item,type){
      this.openItem = item
      if(type == 1){
        this.tan1 = true
        this.get_user_list1();
      }else if(type == 2){
        this.get_user_list2();
        this.tan2 = true
      }else if(type == 3){
        this.get_user_list3();
        this.tan3 = true
      }else if(type == 4){
        this.tan4 = true
        this.get_user_list4();
      }else if(type == 5){
        this.tan5 = true
        this.get_user_list5();
      }
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
      this.tan1 = true;
    },
    edits() {
      this.edit_tan = true;
    },
    
    shan() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择要查看互赠的数据",
          type: "error",
        });
        return;
      }else if (this.multipleSelection.length > 1) {
        let edit = this.multipleSelection[0]
        this.$confirm('检测到选中两条数据,默认查看互赠选中的第一条数据','是否继续?','提示',{
          confirmButtonText:"确定",
          cancelButtonText:"取消",
          type:"warning"
        }).then(() => {
          console.log("多条")
          console.log(edit)
          this.open(edit,4)
        })
      }else{
        let edit = this.multipleSelection[0]
        console.log("一条")
        console.log(edit)
        this.open(edit,4)
      }
92
98
95
      console.log(this.multipleSelection)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取推广列表
    get_user_list(index) {
      this.seachVale = "";
      this.time_value = "";
      this.shen_status = "";

      this.loading = true;
      let request_form = {
        page: 1,
        page_size: this.pageSize,
      };
      get_user_list(request_form)
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
      get_user_list({
        page: page,
        page_size: number,
        user_search:this.seachVale,
        state: this.shen_status,
        start_time: time1,
        end_time: time2,
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
      if (this.seachVale == "" && this.time_value == "" && this.shen_status == "") {
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
      get_user_list({
        page: 1,
        page_size: this.pageSize,
        user_search:this.seachVale,
        state: this.shen_status,
        start_time: time1,
        end_time: time2,
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

    //获取推广列表
    get_user_list1(index) {
      this.time_value1 = "";
      this.shen_status1 = "";
      this.shen_status11 = "";
      let request_form = {
        page: 1,
        page_size: this.queryInfo1.pageSize,
        uid:this.openItem.uid
      };
      detail_user_content(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
            if (index == 1) {
              this.$message({
                message: "刷新成功",
                type: "success",
              });
            }
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
    //分页
    get_shop_list_page1(page, number) {
      var time1 = "";
      var time2 = "";
      if (this.time_value1 != "") {
        time1 = this.commonJs.dataTime(this.time_value1[0]);
        time2 = this.commonJs.dataTime(this.time_value1[1]);
      }
      this.loading = true;
      detail_user_content({
        page: page,
        page_size: number,
        uid:this.openItem.uid,
        status: this.shen_status1,
        business: this.shen_status11,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
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
      this.get_shop_list_page1(val, this.queryInfo1.pageSize);
    },
    //搜索
    pick_seach1() {
      if (this.time_value1 == "" && this.shen_status1 == "" && this.shen_status11 == "") {
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
      detail_user_content({
        page: 1,
        page_size: this.queryInfo1.pageSize,
        uid:this.openItem.uid,
        status: this.shen_status1,
        business: this.shen_status11,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
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
    //第二个
    get_user_list2(index) {
      this.time_value2 = "";
      this.shen_status2 = "";
      let request_form = {
        page: 1,
        page_size: this.queryInfo2.pageSize,
        uid:this.openItem.uid
      };
      jvbao_used(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
            if (index == 1) {
              this.$message({
                message: "刷新成功",
                type: "success",
              });
            }
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
    //分页
    get_shop_list_page2(page, number) {
      var time1 = "";
      var time2 = "";
      if (this.time_value2 != "") {
        time1 = this.commonJs.dataTime(this.time_value2[0]);
        time2 = this.commonJs.dataTime(this.time_value2[1]);
      }
      this.loading = true;
      jvbao_used({
        page: page,
        page_size: number,
        uid:this.openItem.uid,
        // state: this.shen_status2,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
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
      this.get_shop_list_page2(val, this.queryInfo2.pageSize);
    },
    //搜索
    pick_seach2() {
      //  && this.shen_status2 == ""
      if (this.time_value2 == "") {
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
      jvbao_used({
        page: 1,
        page_size: this.queryInfo2.pageSize,
        uid:this.openItem.uid,
        // state: this.shen_status2,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList2 = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
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


    //第三个
    get_user_list3(index) {
      this.time_value3 = "";
      this.shen_status3 = "";
      let request_form = {
        page: 1,
        page_size: this.queryInfo3.pageSize,
        uid:this.openItem.uid
      };
      jvbao_shopping(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList3 = res.data.err_msg.list;
            this.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo3.page = parseInt(res.data.err_msg.page);
            this.queryInfo3.total = parseInt(res.data.err_msg.total_number);
            if (index == 1) {
              this.$message({
                message: "刷新成功",
                type: "success",
              });
            }
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
    //分页
    get_shop_list_page3(page, number) {
      var time1 = "";
      var time2 = "";
      if (this.time_value3 != "") {
        time1 = this.commonJs.dataTime(this.time_value3[0]);
        time2 = this.commonJs.dataTime(this.time_value3[1]);
      }
      this.loading = true;
      jvbao_shopping({
        page: page,
        page_size: number,
        uid:this.openItem.uid,
        state: this.shen_status3,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList3 = res.data.err_msg.list;
            this.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo3.page = parseInt(res.data.err_msg.page);
            this.queryInfo3.total = parseInt(res.data.err_msg.total_number);
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
      this.get_shop_list_page3(val, this.queryInfo3.pageSize);
    },
    //搜索
    pick_seach3() {
      if (this.time_value3 == "" && this.shen_status3 == "") {
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
      jvbao_shopping({
        page: 1,
        page_size: this.queryInfo3.pageSize,
        uid:this.openItem.uid,
        state: this.shen_status3,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList3 = res.data.err_msg.list;
            this.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo3.page = parseInt(res.data.err_msg.page);
            this.queryInfo3.total = parseInt(res.data.err_msg.total_number);
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
    //第四个 
    get_user_list4(index) {
      this.time_value4 = "";
      this.shen_status4 = "";
      let request_form = {
        page: 1,
        page_size: this.queryInfo4.pageSize,
        uid:this.openItem.uid
      };
      jvbao_giff_gaff(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList4 = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
            if (index == 1) {
              this.$message({
                message: "刷新成功",
                type: "success",
              });
            }
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
    //分页
    get_shop_list_page4(page, number) {
      var time1 = "";
      var time2 = "";
      if (this.time_value4 != "") {
        time1 = this.commonJs.dataTime(this.time_value4[0]);
        time2 = this.commonJs.dataTime(this.time_value4[1]);
      }
      this.loading = true;
      jvbao_giff_gaff({
        page: page,
        page_size: number,
        uid:this.openItem.uid,
        type: this.shen_status4,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList4 = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
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
    handleSizeChange4(val) {
      this.get_shop_list_page4(1, val);
    },

    //当前页
    handleCurrentChange4(val) {
      this.get_shop_list_page4(val, this.queryInfo4.pageSize);
    },
    //搜索
    pick_seach4() {
      if (this.time_value4 == "" && this.shen_status4 == "") {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      var time1 = "";
      var time2 = "";
      if (this.time_value4 != "") {
        time1 = this.commonJs.dataTime(this.time_value4[0]);
        time2 = this.commonJs.dataTime(this.time_value4[1]);
      }
      jvbao_giff_gaff({
        page: 1,
        page_size: this.queryInfo4.pageSize,
        uid:this.openItem.uid,
        type: this.shen_status4,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList4 = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
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
    //第五个
    get_user_list5(index) {
      this.time_value5 = "";
      this.shen_status5 = "";
      let request_form = {
        page: 1,
        page_size: this.queryInfo5.pageSize,
        uid:this.openItem.uid
      };
      jvbao_freeze(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.start_time = this.commonJs.timestampToTime(
                element.start_time
              );
              element.end_time = this.commonJs.timestampToTime(
                element.end_time
              );
            });
            this.extendList5 = res.data.err_msg.list;
            this.queryInfo5.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo5.page = parseInt(res.data.err_msg.page);
            this.queryInfo5.total = parseInt(res.data.err_msg.total_number);
            if (index == 1) {
              this.$message({
                message: "刷新成功",
                type: "success",
              });
            }
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
    //分页
    get_shop_list_page5(page, number) {
      var time1 = "";
      var time2 = "";
      if (this.time_value5 != "") {
        time1 = this.commonJs.dataTime(this.time_value5[0]);
        time2 = this.commonJs.dataTime(this.time_value5[1]);
      }
      this.loading = true;
      jvbao_freeze({
        page: page,
        page_size: number,
        uid:this.openItem.uid,
        state: this.shen_status5,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.start_time = this.commonJs.timestampToTime(
                element.start_time
              );
              element.end_time = this.commonJs.timestampToTime(
                element.end_time
              );
            });
            this.extendList5 = res.data.err_msg.list;
            this.queryInfo5.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo5.page = parseInt(res.data.err_msg.page);
            this.queryInfo5.total = parseInt(res.data.err_msg.total_number);
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
    handleSizeChange5(val) {
      this.get_shop_list_page5(1, val);
    },

    //当前页
    handleCurrentChange5(val) {
      this.get_shop_list_page5(val, this.queryInfo5.pageSize);
    },
    //搜索
    pick_seach5() {
      if (this.time_value5 == "" && this.shen_status5 == "") {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      var time1 = "";
      var time2 = "";
      if (this.time_value5 != "") {
        time1 = this.commonJs.dataTime(this.time_value5[0]);
        time2 = this.commonJs.dataTime(this.time_value5[1]);
      }
      jvbao_freeze({
        page: 1,
        page_size: this.queryInfo5.pageSize,
        uid:this.openItem.uid,
        state: this.shen_status5,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.start_time = this.commonJs.timestampToTime(
                element.start_time
              );
              element.end_time = this.commonJs.timestampToTime(
                element.end_time
              );
            });
            this.extendList5 = res.data.err_msg.list;
            this.queryInfo5.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo5.page = parseInt(res.data.err_msg.page);
            this.queryInfo5.total = parseInt(res.data.err_msg.total_number);
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
/deep/ .yellow.marginRight{
  margin-right: 40px;
}
</style>