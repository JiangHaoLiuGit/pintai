<template>
  <div class="page">
    <div class="pageItem">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">线下服务点收益统计</span>
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
          <el-input
            class="marginRight lt"
            style="width: 300px"
            placeholder="请输入区域"
            prefix-icon="el-icon-search"
            @keyup.enter.native="pick_seach"
            v-model="type_status"
          >
          </el-input>
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
              <el-table-column prop="create_time" label="申请时间"> </el-table-column>
              <el-table-column prop="nickname" label="用户昵称"> </el-table-column>
              <el-table-column prop="account" label="用户账号"> </el-table-column>
              <el-table-column prop="uid" label="UID"> </el-table-column>
              <el-table-column prop="real_name" label="分红人姓名"> </el-table-column>
              <el-table-column label="服务中心区域">
                <template slot-scope="scope">
                  {{scope.row.province_str}}
                  <span v-if="scope.row.city_str">-{{scope.row.city_str}}</span>
                  <span v-if="scope.row.area_str">-{{scope.row.area_str}}</span>
                  <span v-if="scope.row.country_str">-{{scope.row.country_str}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="profit_type" label="分红类型"> </el-table-column>

              <el-table-column label="累积金额">
                <template slot-scope="scope">
                  <div class="green pointer" @click="open(scope.row,'3')">{{scope.row.add_up}}</div>
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
        <!-- 橘宝可用额度 -->
        <el-dialog
          width="70%"
          class="remarks_box"
          :visible.sync="one_tan"
          append-to-body
        >
          <div class="info"><s class="s"></s>服务中心收益明细</div>
            <div style="padding: 30px 20px">
              <div class="blockBox divs">
                <div class="textItem clearfix marginBottom" style="margin-bottom:10px">
                  <div class="lt yellow marginRight">
                    当前用户:{{openItem.nickname}}
                  </div>
                  <div class="lt yellow marginRight">
                    用户ID:{{openItem.uid}}
                  </div>
                  <div class="lt yellow marginRight">
                    账号:{{openItem.account}}
                  </div>
                  <div class="lt yellow marginRight" style="color:#444">
                    线下服务中心:
                    {{openItem.province_str}}
                  <span v-if="openItem.city_str">-{{openItem.city_str}}</span>
                  <span v-if="openItem.area_str">-{{openItem.area_str}}</span>
                  <span v-if="openItem.country_str">-{{openItem.country_str}}</span>
                  </div>
                </div>
                <div class="textItem clearfix marginBottom" style="margin-bottom:10px">
                  <div class="lt marginRightBig">
                    未完成:{{itemInfo.not_accomplish}}
                  </div>
                  <div class="lt marginRightBig">
                    未入账:{{itemInfo.not_recorded}}
                  </div>
                  <div class="lt marginRightBig">
                    已入账:{{itemInfo.recorded}}
                  </div>
                  <div class="lt marginRightBig" style="color:#ee8f29;">
                      <!--  -->
                    合计:{{openItem.add_up}}
                  </div>
                </div>

                <div class="textItem">
                  <div class="clearfix" style="margin-bottom: 20px">
                    <el-input
                        class="marginRight lt"
                        style="width: 250px"
                        placeholder="请输入订单编号/用户昵称/用户账号"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="pick_seach2"
                        v-model="seachVale4"
                    >
                    </el-input>
                    <el-select v-model="seachVale2" class="marginRight lt" placeholder="请选择收益状态">
                      <el-option
                        v-for="item in seachVale2_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                    <el-select v-model="type_status2" class="marginRight lt" placeholder="请选择时间类型">
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
                        <el-table-column prop="add_time" label="下单时间" width="150"> </el-table-column>
                        <el-table-column prop="complate_time" label="订单完成时间" width="150"> </el-table-column>
                        <el-table-column label="订单编号">
                            <template slot-scope="scope" width="200">
                                <div class="green pointer" @click="dingdan(scope.row.order_no)">{{scope.row.order_no}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="total" label="订单金额"> </el-table-column>
                        <el-table-column prop="fx_profit" label="服务费金额"> </el-table-column>
                        <el-table-column label="订单状态">
                          <template slot-scope="scope">
                            <div v-if="scope.row.status == '1'">未支付</div>
                            <div v-else-if="scope.row.status == '2'">待发货</div>
                            <div v-else-if="scope.row.status == '3'">待收货</div>
                            <div v-else-if="scope.row.status == '4'">已完成</div>
                            <div v-else-if="scope.row.status == '5'">已取消</div>
                            <div v-else-if="scope.row.status == '7'">已收货</div>
                            <div v-else>未知</div>
                          </template>
                        </el-table-column>
                        <el-table-column label="状态">
                          <template slot-scope="scope">
                            <div style="color:#20e876" v-if="scope.row.service_type == '1'">已结算</div>
                            <div style="color:#ff980f" v-else-if="scope.row.service_type == '2'">未结算</div>
                            <div style="color:#ff980f" v-else-if="scope.row.service_type == '3'">未完成</div>
                            <div style="color:#ee0606" v-else-if="scope.row.service_type == '4'">已退款</div>
                            <div v-else>未知</div>
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="类型">
                          <template slot-scope="scope">
                            <div v-if="scope.row.coupon_type == '1'">增加</div>
                            <div v-else-if="scope.row.coupon_type == '2'">减少</div>
                            <div v-else>未知</div>
                          </template>
                        </el-table-column> -->
                        <el-table-column prop="nickname" label="买家昵称"></el-table-column>
                        <el-table-column prop="account" label="买家账号"></el-table-column>
                        <el-table-column prop="uid" label="买家ID"></el-table-column>
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
        
      </div>
    </div>

    
  </div>
</template>
<script>
import { earnings_statistics,
user_identity_list,
earnings_details,
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
        itemInfo:{},
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
          name: "已入账",
        },
        {
          id: "2",
          name: "未入账",
        },
        {
          id: "3",
          name: "未完成",
        },
        {
          id: "4",
          name: "已退款",
        }
      ],
      seachVale3: "",
      seachVale4:"",
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
          name: "下单时间",
        },
        {
          id: "2",
          name: "完成时间",
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
    dingdan(order){
        // window.open(publicFile.address + "/h5/admin/dist/index.html#/order_/orderList_p?order_id=" + id)
        this.$router.push({path:"/order_/orderList_p",query:{order_id:order}})
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
      earnings_statistics(request_form)
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
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      this.loading = true;
      earnings_statistics({
        page: page,
        page_size: number,
        user_search:this.seachVale,
        region:this.type_status,
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
      earnings_statistics({
        page: 1,
        page_size: this.pageSize,
        user_search:this.seachVale,
        region:this.type_status,
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
        id:this.openItem.id
      };
      earnings_details(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            this.loading2 = false;
            res.data.err_msg.list.forEach((element) => {
              element.add_time = this.commonJs.timestampToTime(
                element.add_time
              );
              element.complate_time = this.commonJs.timestampToTime(
                element.complate_time
              );
            });
            this.itemInfo = res.data.err_msg
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
      earnings_details({
        page: page,
        page_size: number,
        search:this.seachVale4,
        service_type:this.seachVale2,
        time_type:this.type_status2,
        start_time: time1,
        end_time: time2,
        id:this.openItem.id
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading2 = false;
            this.itemInfo = res.data.err_msg
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
      if (this.seachVale4 == "" && this.seachVale2 == "" && this.time_value2 == "" && this.type_status2 == "") {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      if(this.type_status2 != '' || this.time_value2 != ''){
        if(this.type_status2 == '' || this.time_value2 == ''){
          if(this.time_value2[0] === '' && this.time_value2[1] === ''){
          }else{
            this.$message({
              message: "请完善时间类型",
              type: "warning",
            });
            return;
          }
        }
      }
      var time1 = "";
      var time2 = "";
      if (this.time_value2 != "") {
        time1 = this.commonJs.dataTime(this.time_value2[0]);
        time2 = this.commonJs.dataTime(this.time_value2[1]);
      }
      this.loading1 = true;
      earnings_details({
        page: 1,
        page_size: this.pageSize2,
        search:this.seachVale4,
        service_type:this.seachVale2,
        time_type:this.type_status2,
        start_time: time1,
        end_time: time2,
        id:this.openItem.id
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading2 = false;
            this.itemInfo = res.data.err_msg
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
/deep/ .radio1 .el-radio__input.is-checked .el-radio__inner{
    border-color: #0cb327;
    background: #0cb327;
}
/deep/ .radio1 .el-radio__input.is-checked+.el-radio__label{
    color: #0cb327;
}

/deep/ .radio2 .el-radio__input.is-checked .el-radio__inner{
    border-color: #f40909;
    background: #f40909;
}
/deep/ .radio2 .el-radio__input.is-checked+.el-radio__label{
    color: #f40909;
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