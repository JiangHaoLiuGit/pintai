<template>
  <div class="page">
    <div class="pageItem">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">线下服务中心审核</span>
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
          <el-select v-model="type_status" class="marginRight lt" placeholder="请选择审核状态">
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
          <el-button
            type="danger"
            class="rt"
            style="margin-right: 10px"
            @click="sure_address()"
            >禁用</el-button
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
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column prop="create_time" label="提交申请时间"> </el-table-column>
              <el-table-column prop="nickname" label="申请人昵称"> </el-table-column>
              <el-table-column prop="uid" label="UID"> </el-table-column>
              <el-table-column prop="real_name" label="申请人姓名"> </el-table-column>
              <el-table-column prop="gf_region" label="用户身份"> </el-table-column>
              <el-table-column label="申请区域" width="300">
                <template slot-scope="scope">
                  {{scope.row.province_str}}
                  <span v-if="scope.row.city_str">-{{scope.row.city_str}}</span>
                  <span v-if="scope.row.area_str">-{{scope.row.area_str}}</span>
                  <span v-if="scope.row.country_str">-{{scope.row.country_str}}</span>
                  
                </template>
              </el-table-column>
              <el-table-column label="收益状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.is_profit_str === '正常'" @click="popups(scope.row)" class="pointer" style="color:#0c70f4">
                    {{scope.row.is_profit_str}}
                  </div>
                  <div v-else-if="scope.row.is_profit_str === '停止'" @click="popups(scope.row)" class="pointer" style="color:#f24c4c">
                    {{scope.row.is_profit_str}}
                  </div>
                  <div v-else>
                    {{scope.row.is_profit_str}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="审核状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === '3'" style="color:#f24c4c">
                    {{scope.row.status_str}}
                  </div>
                  <div v-else>
                    {{scope.row.status_str}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    v-if="scope.row.status === '1'"
                    @click="go_status(scope.$index, scope.row)"
                    >审核</el-button
                  >
                  <!-- v-if="scope.row.store_id == '0'" -->
                  <el-button
                    size="mini"
                    v-else
                    @click="go_info(scope.$index, scope.row)"
                    >详情</el-button
                  >
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
      </div>
    </div>
    <!-- 橘宝可用额度 -->
    <el-dialog
      width="70%"
      class="remarks_box"
      :visible.sync="one_tan"
      append-to-body
    >
      <div class="info" v-if="openItem.status == 1"><s class="s"></s>服务中心申请审核</div>
      <div class="info" v-else><s class="s"></s>服务中心申请审核详情</div>
      <div style="padding: 30px 20px">
        <div class="clearfix flex">
        <div class="contents">
          <div class="top">
            <i class="el-icon-s-custom"></i>
            用户信息(默认使用实名认证信息)
          </div>
          <el-form :model="openItem" :label-position="cen">
            <el-form-item label="姓名"  :label-width="formLabelWidth">
              <el-input v-model="openItem.real_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="身份证号" :label-width="formLabelWidth">
              <el-input v-model="openItem.id_card" disabled></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input v-model="openItem.phone" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="contents">
          <div class="top">
            <i class="el-icon-s-management"></i>
            银行卡信息
          </div>
          
          <el-form :model="openItem" :label-position="cen">
            <el-form-item label="账户姓名"  :label-width="formLabelWidth">
              <el-input v-model="openItem.bank_card_user"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号" :label-width="formLabelWidth">
              <el-input v-model="openItem.bank_card"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" :label-width="formLabelWidth">
              <el-input v-model="openItem.opening_bank"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="contents">
          <div class="top">
            <i class="el-icon-user"></i>
            辅助信息(默认使用实名认证信息)
          </div>
          <el-form :model="openItem" :label-position="cen">
            
            <el-form-item label="联系省" :label-width="formLabelWidth">
              <el-select v-model="openItem.contact_province" placeholder="请选择省">
                <el-option
                  v-for="item in provinceList1"
                  :key="item.province_id"
                  :label="item.name"
                  :value="item.province_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系市" :label-width="formLabelWidth">
              <el-select v-model="openItem.contact_city" placeholder="请选择市">
                <el-option
                  v-for="item in cityList1"
                  :key="item.city_id"
                  :label="item.name"
                  :value="item.city_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系区" :label-width="formLabelWidth">
              <el-select v-model="openItem.contact_area" placeholder="请选择区">
                <el-option
                  v-for="item in areaList1"
                  :key="item.area_id"
                  :label="item.name"
                  :value="item.area_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系地址"  :label-width="formLabelWidth">
              <el-input v-model="openItem.contact_address"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" :label-width="formLabelWidth">
              <el-input v-model="openItem.contact_phone"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="contents">
          <div class="top">
            <i class="el-icon-s-order"></i>
            设备配备订单号(务必使用当前账号下单)
          </div>
          <el-form :model="openItem" :label-position="cen">
            <el-form-item label="订单号:" :label-width="formLabelWidth" v-for="item in openItem.order_no" :key="item">
              <span @click="go_order(item)" class="pointer" style="color:rgb(12, 112, 244);">{{item}}</span>
            </el-form-item>
          </el-form>
        </div>

        <div class="contents">
          <div class="top">
            <i class="el-icon-picture"></i>
            <b>上传照片:</b>
            服务点实拍(40平米起)
          </div>
          <el-carousel height="150px" :autoplay="false" style="margin-top:10px">
            <el-carousel-item v-for="item in openItem.imgs" :key="item">
              <el-image 
                v-if="item.type == 1"
                style="width: 100%; height: 150px"
                :src="item.url" 
                :preview-src-list="openItem.certificate">
              </el-image>
              <video id="video" v-if="item.type == 2" :src="item.url" controls preload="auto" controlslist="nodownload noremoteplayback disablePictureInPicture noplaybackrate" :disablePictureInPicture='true' :style="'background: #000 url('+item.url+') 50% 50% / contain no-repeat'"></video>
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="contents">
          <div class="top">
            <i class="el-icon-s-home"></i>
            所选区域(一个区域限制一个名额)
          </div>
          
          <el-form :model="openItem" :label-position="cen">
            <el-form-item label="所选省"  :label-width="formLabelWidth">
              <el-select v-model="openItem.province" placeholder="请选择省">
                <el-option
                  v-for="item in provinceList"
                  :key="item.province_id"
                  :label="item.name"
                  :value="item.province_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所选市"  :label-width="formLabelWidth">
              <el-select v-model="openItem.city" placeholder="请选择市">
                <el-option
                  v-for="item in cityList"
                  :key="item.city_id"
                  :label="item.name"
                  :value="item.city_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所选区"  :label-width="formLabelWidth">
              <el-select v-model="openItem.area" placeholder="请选择区">
                <el-option
                  v-for="item in areaList"
                  :key="item.area_id"
                  :label="item.name"
                  :value="item.area_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所选镇"  :label-width="formLabelWidth">
              <el-select v-model="openItem.country" placeholder="请选择镇">
                <el-option
                  v-for="item in townList"
                  :key="item.town_id"
                  :label="item.name"
                  :value="item.town_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        </div>
        <div class="clearfix por" style="padding:0 20px;height:100px">
          <!-- <div v-if="openItem.status == 1"> -->
            <div style="width:10%" class="lt" v-show="openItem.status != 2">
              <div style="margin-bottom:5px"><el-radio v-model="openItem.refuse_type" label="1" :disabled="openItem.status == 3">场所不符合要求</el-radio></div>
              <div><el-radio v-model="openItem.refuse_type" label="2" :disabled="openItem.status == 3">未配备完整订单</el-radio></div>
            </div>
            <div style="width:70%;margin-left:20px;margin-right:20px" class="lt" v-show="openItem.status != 2">
              <el-input type="textarea" v-model="openItem.reason" :disabled="openItem.status == 3"></el-input>
            </div>
            <div style="width:10%" class="clearfix lt" v-show="openItem.status == 1">
              <el-button
                size="mini"
                type="danger"
                class="lt"
                @click="operate('1')"
                >拒绝</el-button
              >
              <!-- v-if="scope.row.store_id == '0'" -->
              <el-button
                size="mini"
                type="primary"
                class="lt"
                @click="operate('2')"
                >同意</el-button
              >
            </div>
            <img class="poa" style="right:0;bottom:0;width:200px" v-show="openItem.status == 2" src="../../assets/image/pic023.png" alt="" />
            <img class="poa" style="right:0;bottom:0;width:200px" v-show="openItem.status == 3" src="../../assets/image/pic024.png" alt="" />
          <!-- </div> -->
          <!-- <div class="clearfix" style="width:100%" v-else>
            
          </div> -->
        </div>
      </div>
    </el-dialog>

    <!-- 合伙人状态手动管理 -->
    <el-dialog
      width="40%"
      class="remarks_box"
      :visible.sync="three_tan"
      append-to-body
    >
      <div class="info"><s class="s"></s>服务中心收益设置</div>
      <div style="padding: 20px 30px 20px">
        <div class="clearfix marginBottom">
          <div class="lt marginRight">
            当前用户:{{openItem.nickname}}
          </div>
          <div class="lt marginRight">
            用户ID:{{openItem.uid}}
          </div>
          <div class="lt marginRight">
            账号:{{openItem.account}}
          </div>
        </div>
        <div>
          线下服务中心
        </div>
        <div style="margin:10px 0">
          <div v-for="(item,index) in popList" :key="index">
            <span>{{item.province_str}}<span v-if="item.city_str">-{{item.city_str}}</span><span v-if="item.area_str">-{{item.area_str}}</span><span v-if="item.country_str">-{{item.country_str}}</span>: </span>
            <el-radio class="radio1" style="margin-left:10px" v-model="item.is_profit" label="1">正常</el-radio>
            <el-radio class="radio2" v-model="item.is_profit" label="2">停止</el-radio>
          </div>
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

    <!-- 反复确认框。烦啊 -->
    <div class="box" v-show="kuang_show">
      <div class="content" @click="kuang_show = false">
        <div class="kuang" @click.stop="kuang_show = true">
          <img src="../../assets/image/gantan.png" alt="" />
          <div class="text" v-if="operType == 1">是否拒绝操申请？</div>
          <div class="text" v-else-if="operType == 2">是否同意操申请？</div>
          <el-button
            type="danger"
            @click.stop="kuang_show = false"
            style="margin-bottom: 10px; margin-right: 36px"
          >
            取消
          </el-button>
          <el-button type="success" @click.stop="sure_address1"> 确认 </el-button>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import { audit_list,
service_earnings_list,
earnings_set,
service_centre_details,
get_province,
get_city,
audit_save,
get_area,
get_town,
 } from "../../utils/axios";
export default {
  data() {
    return {
      kuang_show:false,
      operType:1,
      provinceList: [], //省
      cityList: [], //市
      areaList: [], //区
      townList: [], //镇
      provinceList1: [], //省
      cityList1: [], //市
      areaList1: [], //区
      cen:"center",
      form:{},
      queryInfo: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      formLabelWidth: "70px",
      
      pageSize:20,
      one_tan: false,
      two_tan: false,
      three_tan:false,
      fn1: this.commonJs.Debounce(this.get_agent_list),
      extendList: [],
      seachVale: "",
      openItem:{
        status:1,
        order_no:[],
        province:"",
        city:"",
        area:"",
        country:"",
      },
      loading: false,
      type_status:"",
      type_status_list: [
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
        }
      ],
      city_ifShow1:false,
      code:{
        province_code:"",
        city_code:"",
      },
      multipleSelection:[],
      time_value: "",
      popList:[],
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
    "openItem.province": {
      handler: function (news, olds) {
        if (news) {
          if(this.openItem.city){}else{
            this.openItem.city = "";
            this.openItem.area = "";
            this.openItem.country = "";
          }
          this.get_city(news);
        } else {}
      },
    },
    "openItem.city": {
      handler: function (news, olds) {
        if (news) {
          if(this.openItem.area){}else{
            this.openItem.area = "";
            this.openItem.country = "";
          }
          this.get_area(news);
        } else {}
      },
    },
    "openItem.area": {
      handler: function (news, olds) {
        if (news) {
          if(this.openItem.country){}else{
            this.openItem.country = "";
          }
          this.get_town(news);
        } else {}
      },
    },

    "openItem.contact_province": {
      handler: function (news, olds) {
        if (news) {
          if(this.openItem.contact_city){}else{
            this.openItem.contact_city = "";
            this.openItem.contact_area = "";
          }
          this.get_city1(news);
        } else {}
      },
    },
    "openItem.contact_city": {
      handler: function (news, olds) {
        if (news) {
          if(this.openItem.contact_area){}else{
            this.openItem.contact_area = "";
          }
          this.get_area1(news);
        } else {}
      },
    },
  },
  created() {
    this.get_agent_list(); //获取推广列表
    this.get_province(); //获取省份
    this.get_province1(); //获取省份
    this.height = document.body.clientHeight - 280
    this.height1 = document.body.clientHeight - 320
  },
  methods: {
    operate(type){
      this.operType = type
      if(this.openItem.bank_card_user == ''&&
      this.openItem.bank_card == ''&&
      this.openItem.opening_bank == ''&&
      this.openItem.contact_province == ''&&
      this.openItem.contact_city == ''&&
      this.openItem.contact_area == ''&&
      this.openItem.contact_address == ''&&
      this.openItem.contact_phone == ''&&
      this.openItem.province == ''&&
      this.openItem.city == ''&&
      this.openItem.area == ''&&
      this.openItem.country == ''){
        
        this.$message({
          showClose: true,
          message: "请完善用户申请基础信息",
          type: "error",
        });
        return
      }
      if(type == 1){
        console.log(this.openItem.refuse_type)
        if(this.openItem.refuse_type === '' || this.openItem.refuse_type == '0' || this.openItem.refuse_type == 0){
          this.$message({
            showClose: true,
            message: "拒绝类型必选",
            type: "error",
          });
          return
        }
        if(this.openItem.reason === ''){
          this.$message({
            showClose: true,
            message: "拒绝原因必填",
            type: "error",
          });
          return
        }
      }
      this.kuang_show = true
    },
    sure_address1(){
      console.log(this.operType)
      console.log("调接口")
      if(this.operType == 1){
        this.openItem.status = 3
      }else if(this.operType == 2){
        this.openItem.status = 2
        //同意的时候清空拒绝申请条件
        this.openItem.refuse_type = ""
        this.openItem.reason = ''
      }

      audit_save({
        id:this.openItem.id,
        bank_card_user:this.openItem.bank_card_user,
        bank_card:this.openItem.bank_card,
        opening_bank:this.openItem.opening_bank,
        bank_card:this.openItem.bank_card,
        bank_card:this.openItem.bank_card,
        bank_card_user:this.openItem.bank_card_user,
        opening_bank:this.openItem.opening_bank,
        province:this.openItem.province,
        city:this.openItem.city,
        area:this.openItem.area,
        country:this.openItem.country,
        contact_phone:this.openItem.contact_phone,
        contact_province:this.openItem.contact_province,
        contact_city:this.openItem.contact_city,
        contact_area:this.openItem.contact_area,
        contact_address:this.openItem.contact_address,
        refuse_type:this.openItem.refuse_type,
        reason:this.openItem.reason,
        status:this.openItem.status,
      }).then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_code == 0) {
            this.$message({
              message: "审核成功",
              type: "success",
            });
             this.get_shop_list_page(
              this.queryInfo.page,
              this.queryInfo.pageSize
            );
            this.kuang_show = false
            this.one_tan = false
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
    go_order(item){
      this.$router.push({path:"/order_/orderList_p",query:{order_id:item}})
    },
    // 获取省
    get_province() {
      let that = this;
      get_province().then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg) {
            for (let i in res.data.err_msg) {
              that.provinceList.push({
                province_id: i,
                name: res.data.err_msg[i],
              });
              
            }
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
    get_city(province_id) {
      let that = this;
      this.cityList = [];
      get_city({ province_id: province_id }).then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg) {
            for (let i in res.data.err_msg) {
              that.cityList.push({
                city_id: i,
                name: res.data.err_msg[i],
              });
            }
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

    // 获取区
    get_area(city_id) {
      let that = this;
      this.areaList = [];
      console.log(city_id )
      get_area({ city_id: city_id }).then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg) {
            for (let i in res.data.err_msg) {
              that.areaList.push({
                area_id: i,
                name: res.data.err_msg[i],
              });
            }
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
    
    // 获取镇
    get_town(town_id) {
      let that = this;
      this.townList = [];
      get_town({ pid: town_id }).then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg.list.length>0) {
            for (let i = 0 ; i < res.data.err_msg.list.length ; i ++) {
              that.townList.push({
                town_id: res.data.err_msg.list[i].area_id,
                name: res.data.err_msg.list[i].area_name,
              });
            }
            console.log(that.townList)
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

    // 获取省
    get_province1() {
      let that = this;
      get_province().then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg) {
            for (let i in res.data.err_msg) {
              that.provinceList1.push({
                province_id: i,
                name: res.data.err_msg[i],
              });
              
            }
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
      this.cityList = [];
      get_city({ province_id: province_id }).then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg) {
            for (let i in res.data.err_msg) {
              that.cityList1.push({
                city_id: i,
                name: res.data.err_msg[i],
              });
            }
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

    // 获取区
    get_area1(city_id) {
      let that = this;
      this.areaList = [];
      get_area({ city_id: city_id }).then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg) {
            for (let i in res.data.err_msg) {
              that.areaList1.push({
                area_id: i,
                name: res.data.err_msg[i],
              });
            }
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

    //审核按钮
    go_status(index,item){
      this.one_tan = true
      service_centre_details({
        id: item.id,
      })
      .then((res) => {
        if (res.data.err_code == 0) {
          this.openItem = res.data.err_msg.info
          this.openItem.id = item.id
          if(this.openItem.status == 1){
            this.openItem.refuse_type = 0
            this.openItem.reason = ""
          }
          let video_url = []
          let img_url = []
          if(this.openItem.video_url.length > 0){
            this.openItem.video_url.forEach((item,index) => {
              video_url.push({
                url:item,
                type:2
              })
            })
          }
          if(this.openItem.certificate.length > 0){
            this.openItem.certificate.forEach((item,index) => {
              img_url.push({
                url:item,
                type:1
              })
            })
          }
          // 
          this.openItem.imgs = video_url.concat(img_url)
          console.log(this.openItem.imgs)
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
    //详情
    go_info(index,item){
      this.one_tan = true
      service_centre_details({
        id: item.id,
      })
      .then((res) => {
        if (res.data.err_code == 0) {
          this.openItem = res.data.err_msg.info

          if(this.openItem.status == 1){
            this.openItem.refuse_type = 0
            this.openItem.reason = ""
          }
          console.log(this.openItem)
          // this.openItem.area = "130102"
          // this.openItem.country = "130102002"
          // this.openItem.certificate = [
          //   "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F09%2F3a%2Fbc%2F093abce7b31f4c8ffdbf345375ff4abb.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648184540&t=8625badb157b8d384a232c699532a95e",
          //   "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F21092421494A216-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648184540&t=d69c7210a6e10e0e0138dd5b652d3385",
          //   "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F0512210S939%2F2105120S939-9-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648184540&t=aae04a8d0332fa71d649e7631b285a03",
          //   "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1115%2F101021113337%2F211010113337-2-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648184540&t=6bf56cac96d6ee05b76c6a964fe08bf7",
          //   ]
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
    open(item,type){
      this.openItem = item
      if(type == 1){
        
      }else if(type == 2){
        this.three_tan = true
      }else if(type == 3){
        this.one_tan = true
      }else if(type == 4){
        this.two_tan = true
      }
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
      audit_list(request_form)
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
      audit_list({
        page: page,
        page_size: number,
        user_search:this.seachVale,
        status:this.type_status,
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      audit_list({
        page: 1,
        page_size: this.pageSize,
        user_search:this.seachVale,
        status:this.type_status,
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
    cunWen(){
      let data = []
      this.popList.forEach((ite) => {
        var dat = {
          id:ite.id,
          is_profit:ite.is_profit
        }
        data.push(dat)
      })
      data = JSON.stringify(data)
      earnings_set({
        json_str: data,
      })
      .then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
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
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    },
    popups(item){
      this.openItem = item

      this.three_tan = true
      service_earnings_list({
        uid: item.uid,
      })
      .then((res) => {
        if (res.data.err_code == 0) {
          this.popList = res.data.err_msg.list
          console.log(this.popList)
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
    //禁用
    // earnings_set 设置禁用
    //service_earnings_list 查询禁用参数
    sure_address() {
      let arr = []
      
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((item) => {
          console.log(item.uid)
          arr.push(item.uid)
        });

        arr = [...new Set(arr)]
        console.log(arr)
        if(arr.length>1){
          //去重完了有多个
          let array = []
          arr.forEach((item,index) => {
            console.log(item)
            service_earnings_list({
              uid: item,
            })
            .then((res) => {
              if (res.data.err_code == 0) {
                array = array.concat(res.data.err_msg.list)
                let json = []
                array.forEach((ite) => {
                  var dat = {
                    id:ite.id,
                    is_profit:2
                  }
                  json.push(dat)
                })
                if(index == (arr.length-1)){
                  json = JSON.stringify(json)
                  earnings_set({
                    json_str: json,
                  })
                  .then((res) => {
                    if (res.data.err_code == 0) {
                      this.$message({
                        message: "禁用成功",
                        type: "success",
                      });
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
          })
        }else{
          //去重完了有单个
          console.log(arr[0])
          service_earnings_list({
            uid: arr[0],
          })
          .then((res) => {
            if (res.data.err_code == 0) {
              // array = array.concat(res.data.err_msg.list)
              let json = []
              res.data.err_msg.list.forEach((ite) => {
                var dat = {
                  id:ite.id,
                  is_profit:2
                }
                json.push(dat)
              })
              json = JSON.stringify(json)
              earnings_set({
                json_str: json,
              })
              /*

*/
              .then((res) => {
                if (res.data.err_code == 0) {
                  this.$message({
                    message: "禁用成功",
                    type: "success",
                  });
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

        }
        
      } else {
        this.$message({
          showClose: true,
          message: "请选择要禁用的数据",
          type: "error",
        });
      }
    }

  },
};
</script>
<style scoped lang="less">
.flex.clearfix{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.flexs{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.contents{
  box-sizing: border-box;
  padding: 15px 10px;
  width: 350px;
  min-height: 253px;
  float: left;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  margin-bottom: 20px;
  margin-right: 20px;
}
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
#video {
  width: 100%;
  height: 150px;
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
  z-index: 9000;

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