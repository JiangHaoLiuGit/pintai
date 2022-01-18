<template>
  <div class="page">
    <div class="pageItem">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">共富订单分润明细</span>
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
          <el-input
            class="lt marginRight"
            style="width: 300px"
            placeholder="请输入订单id/订单号/三方交易单号"
            prefix-icon="el-icon-search"
            @keyup.enter.native="pick_seach"
            v-model="seachVale1"
          >
          </el-input>
          <el-select v-model="shen_status" class="marginRight lt" placeholder="请选择时间状态">
            <el-option
              v-for="item in shen_status_list"
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

          <!-- <el-button type="danger" class="rt" @click="shan">删除</el-button>
          <el-button
            type="success"
            class="rt"
            style="margin-right: 10px"
            @click="edits"
            >编辑</el-button
          > -->
          
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="fn1(1)"
            >刷新</el-button
          >
          <el-button
            type="success"
            class="rt"
            style="margin-right: 10px"
            @click="pick_seach"
          >搜索</el-button>
        </div>
        <el-row :gutter="20" class="goodsindex goodsindex-list2">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable1"
              :data="extendList"
              border
              style="width: 100%"
              :span-method="cellMerge"
              @cell-mouse-leave="cellLeave"
               @cell-mouse-enter="mouseHover"
              :height="height"
              @selection-change="handleSelectionChange"
            >
              <el-table-column label="序号" prop="index" width="50">
              </el-table-column>

              <el-table-column label="商品名称">
                <template slot-scope="scope">
                  <div v-if="spanArr[scope.$index]>0" class="clearfix" style="text-align: left">
                    <div class="lt" style="width:80%;margin:10px 0;">
                      <span style="margin-right:40px;font-size: 14px;">订单编号:{{ scope.row.order_no }}</span>
                      <span style="margin-right:40px;font-size: 14px;">订单id:{{ scope.row.order_id }}</span>
                      <span style="margin-right:40px;font-size: 14px;">三方交易号:{{ scope.row.third_id!=''?scope.row.third_id:"暂无" }}</span>
                      <span style="margin-right:40px;" v-if="scope.row.store_id == 0" >运营商:平台自营</span>
                      <span style="margin-right:40px;" v-else>
                        <!-- color: #6a6ae0; @click="gos(scope.row.store_uid,scope.row.store_name)" -->
                        <span v-if="scope.row.store_name" >运营商:{{scope.row.store_name}}</span>
                        <span v-else>未知</span>
                      </span>
                      <span style="margin-right:40px;" v-if="scope.row.payment_method == 'weixin'">支付方式: 微信</span>
                      <span style="margin-right:40px;" v-else-if="scope.row.payment_method == 'alipay'">支付方式: 支付宝</span>
                      <span style="margin-right:40px;" v-else-if="scope.row.payment_method == 'balance'">支付方式: 余额</span>
                      <span style="margin-right:40px;" v-else-if="scope.row.payment_method == 'score'">支付方式: 橘宝</span>
                      <span style="margin-right:40px;" v-else-if="scope.row.payment_method == 'blend'">支付方式: 混合</span>
                      <span style="margin-right:40px;" v-else>支付方式: 未知</span>
                      <span style="margin-right:40px;color:red;">订单实付金额:{{ scope.row.pay_money }}元</span>
                    </div>
                    <div class="rt" style="width:20%;text-align: right;padding-top:10px;padding-right: 13px;">
                      <!-- <el-tag type="success" style="margin-right:10px" v-if="scope.row.live_id != 0">直播间订单</el-tag> -->
                    </div>
                  </div>
                  <div v-else style="text-align:left;">
                    <div style="min-height:80px;display:flex;align-items: center;">
                      {{ scope.row.name1 }}
                    </div>
                    <div>规格:{{ scope.row.sku_data1 != "" ? scope.row.sku_data1 : "无" }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="图片" width="150" align="center">
                <template slot-scope="scope">
                  <el-image
                    :src="scope.row.image1"
                    fit="cover"
                    style="width: 80px; height: 80px"
                    :preview-src-list="[scope.row.image1]"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column label="数量/单价/合计" align="center">
                <template slot-scope="scope">
                  <div style="text-align: center">
                    <span style="color: red; "
                      >数量:{{ scope.row.pro_num1 }}件</span
                    >
                  </div>
                  <!-- <div style="text-align: center;">
                    余额支付:{{ scope.row.product_balance1 }}元
                  </div> -->
                  <div style="text-align: center;margin-top:10px;">
                    单价:{{ scope.row.pro_price1 }}元
                  </div>
                  <div style="text-align: center">
                    结算价:{{ scope.row.pro_cost_price1 }}元
                  </div>
                  
                </template>
              </el-table-column>
              <el-table-column label="退款明细" width="150" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.refund_complete1">
                    <div style="color: red;text-align: center;">
                    订单总退款件数: {{scope.row.refund_complete1}}件
                    </div>
                    <div style="color: red;text-align: center;">
                    订单总退款金额: {{scope.row.refund_complete1}}元
                    </div>
                  </div>
                  <div style="text-align: center;" v-else>- -</div>
                  
                </template>
              </el-table-column>
              <!-- @click="lookRefund(scope.row)" -->

              <el-table-column label="买家信息" width="250" align="center">
                <template slot-scope="scope">
                  <ul>
                    <li style="text-align: left;">
                      <span>昵称:</span><span>{{ scope.row.nickname }}</span>
                    </li>
                    <li style="text-align: left;">
                      <span>ID:</span><span>{{ scope.row.uid }}</span>
                    </li>
                    <li style="text-align: left;">
                      <span>账号:</span><span>{{ scope.row.account }}</span>
                    </li>
                    <li style="text-align: left;margin-top:10px;" class="clearfix">
                       <span>收货人:</span> <span>{{ scope.row.address_user }}</span>
                    </li>
                    <li style="text-align: left;">
                      <span>电话:</span><span>{{ scope.row.address_tel }}</span>
                    </li>
                  </ul>
                </template>
              </el-table-column>
              <el-table-column label="订单日期" width="250" align="center">
                <template slot-scope="scope">
                  <ul>
                    <li>
                      <span>支付时间:</span><span>{{ scope.row.paid_time }}</span>
                    </li>
                    <li>
                      <span>完成时间:</span><span>{{ scope.row.complate_time }}</span>
                    </li>
                  </ul>
                </template>
              </el-table-column>
              <el-table-column label="订单分润金额" align="center">
                <template slot-scope="scope">
                  <ul>
                    <li>
                      <span style="font-weight: bold; color: #6a6ae0;cursor: pointer;" @click="adds(scope.row)">{{ scope.row.share_profit }}元</span>
                    </li>
                  </ul>
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
        <!-- 增加问答 -->
        <el-dialog
          width="70%"
          class="remarks_box add"
          :visible.sync="add_tan"
          append-to-body
        >
          <div class="info">订单分润明细</div>
          
          <div style="padding: 30px 0">
            <div class="blockBox divs">
              <div class="textItem clearfix marginBottom">
                <div class="lt yellow marginRight">
                  当前订单:{{openItem.order_no}}
                </div>
                <div class="lt marginRight">
                  订单总分润金额:￥{{openItem.share_profit}}元
                </div>
                <div class="lt marginRight">
                  订单实付金额:￥{{openItem.pay_money}}元
                </div>
                <div class="lt marginRight">
                  订单总退款金额:￥{{openItem.return_total_cash}}元
                </div>
              </div>
            </div>
            <div class="blockBox divs">
              <div class="textItem clearfix marginBottom">
                <div class="lt yellow marginRight">
                  买家昵称:{{openItem.nickname}}
                </div>
                <div class="lt marginRight">
                  ID:{{openItem.uid}}
                </div>
                <div class="lt marginRight">
                  账号:{{openItem.account}}
                </div>
                <div class="lt marginRight" v-if="openItem.address">
                  收货区域:{{openItem.address.province}}{{openItem.address.city}}{{openItem.address.area}}{{openItem.address.address}}
                </div>
              </div>
            </div>
            <div class="clearfix" style="margin-bottom: 20px;padding:0 30px">
              <el-input
                class="lt marginRight"
                style="width: 250px"
                placeholder="请输入用户id/用户昵称/用户账号"
                prefix-icon="el-icon-search"
                @keyup.enter.native="pick_seach1"
                v-model="seachVales"
              >
              </el-input>
              <el-select v-model="shen_status1" class="marginRight lt" placeholder="请选择审核状态">
                <el-option
                  v-for="item in shen_status_list1"
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
                type="primary"
                class="rt"
                style="margin-right: 10px"
                @click="daochu"
                >导出</el-button
              >
              <el-button
                type="primary"
                class="rt"
                style="margin-right: 10px"
                @click="fn2(1)"
                >刷新</el-button
              >
              <el-button
                type="success"
                class="rt"
                style="margin-right: 10px"
                @click="pick_seach1"
              >搜索</el-button>
            </div>
            <div style="padding:0 30px">
              <el-row :gutter="20" class="goodsindex-list">
                <el-col :span="24">
                  <el-table
                    v-loading="loading1"
                    ref="multipleTable"
                    :data="extendList1"
                    border
                    style="width: 100%"
                    height="400"
                  >
                    <el-table-column label="序号" type="index" width="80">
                    </el-table-column>
                    <el-table-column prop="nickname" label="用户昵称"> </el-table-column>
                    <el-table-column label="用户手机号/ID">
                      <template slot-scope="scope">
                        <div>{{scope.row.phone}}/{{scope.row.id}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="profit_type_str" label="收益类型"> </el-table-column>
                    <el-table-column prop="team_type_str" label="收益项目(身份)"> </el-table-column>
                    <el-table-column label="分润金额">
                      <template slot-scope="scope">
                        <div>{{scope.row.fx_profit}}元</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="settle_str" label="收益状态"> </el-table-column>
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
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import publicFile from '../../utils/publicFile'
import $ from 'jquery'
import { selling_order_list,share_profit_list } from "../../utils/axios";
export default {
  data() {
    return {
      spanArr:[],
      spanBrr:[],
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
      loading1:false,
      pageSize1:20,
      pageSize:20,
      kuang_show: false,
      formLabelWidth1: "100px",
      add_wen: {
        content: "",
      },
      edit_wen: {
        content: "",
      },
      openItem:{},
      edit_tan: false,
      add_tan: false,
      fn1: this.commonJs.Debounce(this.get_selling_order_list),
      fn2: this.commonJs.Debounce(this.get_share_profit_list),
      extendList: [],
      extendList1: [],
      seachVale: "",
      seachVales: "",
      seachVale1: "",
      loading: false,
      multipleSelection: [],
      shen_status:"",
      indexArr:[],
      shen_status_list: [
        {
          id: "1",
          name: "支付时间",
        },
        {
          id: "2",
          name: "完成时间",
        }
      ],
      shen_status1:"",
      shen_status_list1: [
        {
          id: "1",
          name: "团队消费收益",
        },
        {
          id: "2",
          name: "团队区域收益",
        },
        {
          id: "3",
          name: "市级收益",
        },
        {
          id: "4",
          name: "省级收益",
        },
        {
          id: "5",
          name: "联创收益",
        }
      ],
      heigh:"",
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
    };
  },
  created() {
    this.get_selling_order_list(); //获取推广列表
    this.height = document.body.clientHeight - 320
  },
  methods: {
    //划入
    mouseHover(row){
      console.log(row)
      this.indexArr = []
      for(let i = 0 ; i < this.extendList.length ; i++ ){
        if(this.extendList[i].index == row.index){
          this.indexArr.push(i)
        }
      }
      this.indexArr.forEach((item,index) => {
        $('.goodsindex-list2 tbody tr:nth-of-type('+ (this.indexArr[index]+1) +')').addClass("active")
      })
    },
    //划出
    cellLeave(row,colum){
      this.indexArr.forEach((item,index) => {
        $('.goodsindex-list2 tbody tr:nth-of-type('+ (this.indexArr[index]+1) +')').removeClass("active")
      })
    },
    //表格合并行
    cellMerge({ row, column, rowIndex, columnIndex }) {
      //当前行row、当前列column、当前行号rowIndex、当前列号columnIndex
      let _row = 1;
      if(columnIndex == 0){
        _row = this.spanArr[rowIndex]
      }
      
      let _col = _row > 0 ? 1 : 0;
      if(this.spanArr[rowIndex] > 0){
        if (columnIndex == 0){
          _col = 1
        }else if (columnIndex == 1){
          _col = 9
        }else{
          if(columnIndex == 4){
            
            _row = 10
          }else{
            _row = 1
            if(this.spanArr[rowIndex] > 0){
              // transparent
              $('.goodsindex-list2 tbody tr:nth-of-type('+ rowIndex +')').css({"border-bottom":"5px solid #c1c1c1"})
            }
            
          }
          _col = 0
        }
      }
      if(this.spanBrr[rowIndex]>0){
        if(columnIndex == 5 || columnIndex == 6 || columnIndex == 7 || columnIndex == 4){
          _row = this.spanBrr[rowIndex]
        }
      }else{
        if(columnIndex == 5 || columnIndex == 6 || columnIndex == 7 || columnIndex == 4){
          _row = 0
        }
      }
      
      return {
        rowspan: _row, //行
        colspan: _col, //列
      };
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
    //获取推广列表
    get_share_profit_list(index) {
      this.seachVales = "";
      this.time_value1 = "";
      this.shen_status1 = "";

      this.loading1 = true;
      let request_form = {
        page: 1,
        page_size: this.pageSize,
        order_id:this.openItem.order_id
      };
      share_profit_list(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            this.loading1 = false;
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
          console.log(error);
        });
    },
    //分页
    get_shop_list_page1(page, number) {
      var time1 = "";
      var time2 = "";
      console.log(this.time_value);
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      this.loading = true;
      share_profit_list({
        page: page,
        page_size: number,
        user_search:this.seachVales,
        profit_type: this.shen_status1,
        start_time: time1,
        end_time: time2,
        order_id:this.openItem.order_id
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
        });
    },
    //每页显示条数改变
    handleSizeChange1(val1) {
      this.get_shop_list_page1(1, val);
    },
    daochu(){
      var time1 = "";
      var time2 = "";
      if (this.time_value1 != "") {
        time1 = this.commonJs.dataTime(this.time_value1[0]);
        time2 = this.commonJs.dataTime(this.time_value1[1]);
      }
      share_profit_list({
        page: 1,
        page_size: this.pageSize1,
        user_search:this.seachVales,
        profit_type: this.shen_status1,
        start_time: time1,
        end_time: time2,
        order_id:this.openItem.order_id
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            if(res.data.err_msg.list.length > 0){
              window.open(publicFile.address + "/new_admin.php?c=selling_order&a=share_profit_excel&order_id="+ this.openItem.order_id 
              +"&user_search="+ this.seachVales 
              +"&profit_type="+ this.shen_status1 
              +"&start_time="+ time1 +"&end_time="+ time2)
            }else{
              this.$message({
                showClose: true,
                message: "暂无数据",
                type: "error",
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
    //当前页
    handleCurrentChange1(val) {
      this.get_shop_list_page1(val, this.pageSize);
    },
    //搜索
    pick_seach1() {
      if (this.seachVales == "" && this.time_value1 == "" && this.shen_status1 == "") {
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
      share_profit_list({
        page: 1,
        page_size: this.pageSize1,
        user_search:this.seachVales,
        profit_type: this.shen_status1,
        start_time: time1,
        end_time: time2,
        order_id:this.openItem.order_id
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading1 = false;
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
    adds(item) {
      this.openItem = item
      this.add_tan = true;
      this.get_share_profit_list(); //获取推广列表
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
    get_selling_order_list(index) {
      this.seachVale = "";
      this.seachVale1 = "";
      this.time_value = "";
      this.shen_status = "";
      this.extendList = [];
      this.spanArr = [];
      this.spanBrr = [];
      this.loading = true;
      let request_form = {
        page: 1,
        page_size: this.pageSize,
      };
      selling_order_list(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element, index) => {
              element.product_list.push(element.product_list[0])
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
              element.paid_time = this.commonJs.timestampToTime(
                element.paid_time
              );
              if (element.product_list.length > 2) {
                this.spanBrr.push(0);
                for (let i = 1; i < element.product_list.length; i++) {
                  if(i == 1){
                    this.spanBrr.push(element.product_list.length-1);
                  }else{
                    this.spanBrr.push(0);
                  }
                }
              }else{
                this.spanBrr.push(1);
                this.spanBrr.push(1);
              }
              this.spanArr.push(element.product_list.length);
              for (let i = 1; i < element.product_list.length; i++) {
                this.spanArr.push(0);
              }

              element.product_list.forEach((ele, ind) => {
                element.index = index + 1;
                var obj = JSON.parse(JSON.stringify(element));
                //给element.product_list 每个属性键值 + "1" 这样可以避免给element.product_list属性和给element属性重名导致给element的值被覆盖现象
                for (let i in ele) {
                  let ii = i + "1"
                  obj[ii] = element.product_list[ind][i];
                }
                
                this.extendList.push(obj);
              });
            });
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
      selling_order_list({
        page: page,
        page_size: number,
        user_search:this.seachVale,
        order_search:this.seachVale1,
        time_type: this.shen_status,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            this.extendList = [];
            this.spanArr = [];
            this.spanBrr = [];
            setTimeout(() => {
              this.$refs.multipleTable1.scrollTop = 0;
            }, 100);
            //93 2010 17
            //79 2010 31
            //87 2010 23
            //67 2010 43

            res.data.err_msg.list.forEach((element, index) => {
              element.product_list.push(element.product_list[0])
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
              element.paid_time = this.commonJs.timestampToTime(
                element.paid_time
              );
              if (element.product_list.length > 2) {
                this.spanBrr.push(0);
                for (let i = 1; i < element.product_list.length; i++) {
                  if(i == 1){
                    this.spanBrr.push(element.product_list.length-1);
                  }else{
                    this.spanBrr.push(0);
                  }
                }
              }else{
                this.spanBrr.push(1);
                this.spanBrr.push(1);
              }
              this.spanArr.push(element.product_list.length);
              for (let i = 1; i < element.product_list.length; i++) {
                this.spanArr.push(0);
              }

              element.product_list.forEach((ele, ind) => {
                element.index = index + 1;
                var obj = JSON.parse(JSON.stringify(element));
                //给element.product_list 每个属性键值 + "1" 这样可以避免给element.product_list属性和给element属性重名导致给element的值被覆盖现象
                for (let i in ele) {
                  let ii = i + "1"
                  obj[ii] = element.product_list[ind][i];
                }
                
                this.extendList.push(obj);
              });
            });
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
      if (this.seachVale == "" && this.time_value == "" && this.seachVale1 == "") {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      if(this.shen_status != '' || this.time_value != ''){
        if(this.shen_status == '' || this.time_value == ''){
          if(this.time_value[0] === '' && this.time_value[1] === ''){
          }else{
            this.$message({
              message: "请完善时间类型",
              type: "warning",
            });
            return;
          }
        }
      }
      this.extendList = [];
      this.spanArr = [];
      this.spanBrr = [];
      var time1 = "";
      var time2 = "";
      console.log(this.time_value);
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      this.loading = true;
      selling_order_list({
        page: 1,
        page_size: this.pageSize,
        user_search:this.seachVale,
        order_search:this.seachVale1,
        time_type: this.shen_status,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element, index) => {
              element.product_list.push(element.product_list[0])
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
              element.paid_time = this.commonJs.timestampToTime(
                element.paid_time
              );
              if (element.product_list.length > 2) {
                this.spanBrr.push(0);
                for (let i = 1; i < element.product_list.length; i++) {
                  if(i == 1){
                    this.spanBrr.push(element.product_list.length-1);
                  }else{
                    this.spanBrr.push(0);
                  }
                }
              }else{
                this.spanBrr.push(1);
                this.spanBrr.push(1);
              }
              this.spanArr.push(element.product_list.length);
              for (let i = 1; i < element.product_list.length; i++) {
                this.spanArr.push(0);
              }

              element.product_list.forEach((ele, ind) => {
                element.index = index + 1;
                var obj = JSON.parse(JSON.stringify(element));
                //给element.product_list 每个属性键值 + "1" 这样可以避免给element.product_list属性和给element属性重名导致给element的值被覆盖现象
                for (let i in ele) {
                  let ii = i + "1"
                  obj[ii] = element.product_list[ind][i];
                }
                
                this.extendList.push(obj);
              });
            });
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
  .marginRight{
    margin-right: 40px;
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
/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td{
  background-color:#fff!important;
}
/deep/ .el-table--enable-row-hover .el-table__body:hover tr.active>td{
  background-color:#dce1e8!important;
  // #dce1e8
}
</style>