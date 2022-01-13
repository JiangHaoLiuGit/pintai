<template>
  <div class="goodsindex">
    <div class="divBlock">
      <div class="seach">
        <div>
          <el-select v-model="operationTypeValue" placeholder="请选择运营商类型">
            <el-option
              v-for="item in operationType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            style="width:150px"
            v-model="seach_value1"
            @keyup.enter.native="pick_seach"
            placeholder="请输入店铺id"
          ></el-input>
          <el-input
            style="width:150px"
            v-model="seach_value2"
            @keyup.enter.native="pick_seach"
            placeholder="请输入店铺名称"
          ></el-input>
          <el-cascader
            placeholder="请选择商品分类"
            style="line-height:0;"
            v-model="classification_value"
            :options="classification_list"
            :props="{ expandTrigger: 'hover', checkStrictly: true }"
            @change="pick_cate_change"
          ></el-cascader>

          <el-select v-model="goods_status" placeholder="请选择商品状态">
            <el-option
              v-for="item in goods_status_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <el-button type="primary" @click="pick_seach">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
            >刷新</el-button
          >
        </div>
      </div>
      <div class="seach_copy">
        <div class="seach_select">
          <el-select v-model="goods_status_add" placeholder="请选择商品添加状态">
            <el-option
              v-for="item in goods_status_list_add"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="seach_value"
            @keyup.enter.native="pick_seach"
            placeholder="请输入商品ID/商品名称"
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
        <div class="button_type">
          <el-button type="success" @click="releaseProduct">发布商品</el-button>
          <!-- <el-button type="warning" @click="add_activity">加入营销活动</el-button> -->
          <el-button type="danger" @click="undercarriage">下架</el-button>
        </div>
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="goodsList"
          border
          :height="height"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column label="序号" type="index"> </el-table-column>
          <el-table-column prop="add_time" label="创建时间"> </el-table-column>
          <el-table-column prop="name" label="商品名称"> </el-table-column>
          <el-table-column prop="product_id" label="商品ID"> </el-table-column>
          <el-table-column label="商品主图" width="100">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.image"
                :preview-src-list="[scope.row.image]"
                style="max-width: 80px;max-height: 80px;"
                fit="cover"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="商品分类/运营分类">
            <template slot-scope="scope">
              <!--  || scope.row.fname == '悦淘专区' -->
              <div v-if="scope.row.is_colour == 1 || scope.row.is_corich == 1" style="color:#ee8f29">
                {{ scope.row.fname }}
                {{ scope.row.sname ? ">>" + scope.row.sname : "" }}
                {{ scope.row.tname ? ">>" + scope.row.tname : "" }}
              </div>
              <div v-else>
                {{ scope.row.fname }}
                {{ scope.row.sname ? ">>" + scope.row.sname : "" }}
                {{ scope.row.tname ? ">>" + scope.row.tname : "" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" >
            <template slot-scope="scope">
              {{ parseInt(scope.row.quantity) > 0 ? "在售" : "已售罄" }}
            </template>
          </el-table-column>
          <el-table-column label="运营商">
            <template slot-scope="scope">
              {{
                scope.row.store_id == "0" ? "平台自营" : scope.row.store_name
              }}
            </template>
          </el-table-column>
          <el-table-column prop="sales" label="销售总量" sortable>
          </el-table-column>
          <!-- <el-table-column 
            prop="quantity" 
            label="库存数量" 
          >
          
          </el-table-column> -->
          <el-table-column prop="prime_cost_price" label="结算价(元)" sortable>
          </el-table-column>
          <el-table-column prop="original_price" label="市场价(元)" sortable>
          </el-table-column>
          <el-table-column prop="price" label="销售价(元)" sortable>
          </el-table-column>
          <el-table-column label="利润比例">
            <template slot-scope="scope">
              {{
                Number(scope.row.ratio).toFixed(2)
              }}%
            </template>
          </el-table-column>
          <el-table-column prop="member_level_1_price" label="分润金额">
          </el-table-column>

          
          <el-table-column label="操作" width="300" >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="compile(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                style="margin-top: 10px"
                @click="priceChange(scope.$index, scope.row)"
                >改价</el-button
              >
              <el-button
                size="mini"
                type="warning"
                style="margin-top: 10px"
                v-show="scope.row.is_colour == 2"
                @click="priceChange1(scope.row)"
                >悦淘专享</el-button
              >
              <el-button
                size="mini"
                type="success"
                style="margin-top: 10px"
                v-show="scope.row.is_corich == 2"
                @click="priceChange2(scope.row)"
                >共富专区</el-button
              >
              <!-- <el-button
                size="mini"
                type="success"
                style="margin-top: 10px"
                v-show="scope.row.jvbao == 2"
                @click="addShoppingMall(scope.$index, scope.row)"
                >添加橘宝商城</el-button
              > -->
              <el-button
                size="mini"
                type="danger"
                style="margin-top: 10px"
                @click="dercarriage(scope.row)"
                >下架</el-button
              >
              
              <!-- jvbao 1 已添加橘宝商城  2未添加橘宝商城 -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 添加到营销活动弹窗 -->
    <el-dialog title="营销活动" :visible.sync="add_activities_visible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="item in activityList"
              :label="item.id"
              :key="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_activities_visible = false">取 消</el-button>
        <el-button type="primary" @click="add_activities">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 淘悦专享 -->
    <el-dialog title="添加到聚宝专区" :visible.sync="jubao_change_visible">
      <el-form :model="jubao">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input
            v-model="jubao.name"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <div class="wo"></div>
          <el-select v-model="sort" placeholder="请选择商品分类">
            <el-option
              v-for="item in taoyueList"
              :key="item.cat_id"
              :label="item.cat_name"
              :value="item.cat_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算比例" :label-width="formLabelWidth">
          <div class="wo"></div>
          <el-input
            v-model="jubao.settle_ratio"
            type="number"
            @blur="blurFun"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="priceList"
            border
            @header-click="handleSel"
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="80">
            </el-table-column>
            <el-table-column prop="gg" label="规格" width="120">
            </el-table-column>
            <el-table-column prop="quantity" label="库存数量" width="120">
            </el-table-column>
            <el-table-column
              prop="prime_cost_price"
              label="结算价(元)"
              width="120"
            >
            </el-table-column>
            <el-table-column label="市场价(元)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.original_price"
                  type="number"
                  autocomplete="off"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="销售价(元)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.price"
                  autocomplete="off"
                  type="number"
                  @input="shou(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="平台利润比例(%)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.ratios"
                  autocomplete="off"
                  disabled
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="分润金额(元)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.member_level_1_price"
                  autocomplete="off"
                  disabled
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="jubao_change_visible = false">取 消</el-button>
        <el-button type="primary" @click="priceChange_sure1">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 共富专区 -->
    <el-dialog title="添加到共富专区" :visible.sync="gong_change_visible">
      <el-form :model="gongfu">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input
            v-model="gongfu.name"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <div class="wo"></div>
          <el-select v-model="sort" placeholder="请选择商品分类">
            <el-option
              v-for="item in gongList"
              :key="item.cat_id"
              :label="item.cat_name"
              :value="item.cat_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算比例" :label-width="formLabelWidth">
          <div class="wo"></div>
          <el-input
            v-model="gongfu.settle_ratio"
            type="number"
            @blur="blurFun"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="priceList"
            border
            @header-click="handleSel"
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="80">
            </el-table-column>
            <el-table-column prop="gg" label="规格" width="120">
            </el-table-column>
            <el-table-column prop="quantity" label="库存数量" width="120">
            </el-table-column>
            <el-table-column
              prop="prime_cost_price"
              label="结算价(元)"
              width="120"
            >
            </el-table-column>
            <el-table-column label="市场价(元)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.original_price"
                  type="number"
                  autocomplete="off"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="销售价(元)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.price"
                  autocomplete="off"
                  type="number"
                  @input="shou(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="平台利润比例(%)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.ratios"
                  autocomplete="off"
                  disabled
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="分润金额(元)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.member_level_1_price"
                  autocomplete="off"
                  disabled
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gong_change_visible = false">取 消</el-button>
        <el-button type="primary" @click="priceChange_sure2">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 改价弹窗 -->
    <el-dialog title="商品改价" :visible.sync="price_change_visible">
      <el-form :model="form_specifications">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input
            v-model="form_specifications.name"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="priceList"
            border
            @header-click="handleSel"
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="80">
            </el-table-column>
            <el-table-column prop="gg" label="规格" width="120">
            </el-table-column>
            <el-table-column prop="quantity" label="库存数量" width="120">
            </el-table-column>
            <el-table-column
              prop="prime_cost_price"
              label="结算价(元)"
              width="120"
            >
            </el-table-column>
            <el-table-column label="市场价(元)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.original_price"
                  type="number"
                  autocomplete="off"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="销售价(元)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.price"
                  autocomplete="off"
                  type="number"
                  @input="shou(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="平台利润比例(%)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.ratios"
                  autocomplete="off"
                  disabled
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="分润金额(元)">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.member_level_1_price"
                  autocomplete="off"
                  disabled
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="price_change_visible = false">取 消</el-button>
        <el-button type="primary" @click="priceChange_sure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改等级弹窗 -->
    <el-dialog :title="title1" :visible.sync="opening_change_ifShow">
      <el-form :model="form_X">
        
        <el-form-item :label="Q_message.label" :label-width="formLabelWidth">
          <el-input v-model="form_X.level" placeholder="请填写批量设置"></el-input>
          
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="opening_change_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_saveChanges_level">保存</el-button>
      </div>
    </el-dialog>
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
  </div>
</template>

<script>
import {
  goods_list,
  goods_get_cate,
  get_yunying_cate,
  off_shelf,
  add_product,
  goods_info,
  save_price,
  corich_category,
  effective_category,
  set_settle_ratio,
  corich_add,
  effective,
  get_profit,
} from "../../utils/axios";
export default {
  data() {
    return {
      goodsList: [], //商品列表
      loading: false,
      fn1: this.commonJs.Debounce(this.get_goods_list),
      O_message: {},
      Q_message:{},
      form_X: {
        level: "",
      },
      title1:"",
      opening_change_ifShow:false,
      queryInfo: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      father_menu: [],
      operationType: [
        {
          //运营商类型
          value: "1",
          label: "平台自营",
        },
        {
          value: "2",
          label: "供应商",
        },
      ],
      taoyueList:[],
      gongList:[],
      operationTypeValue: "", //运营商类型
      seach_value: "",
      seach_value1: "",
      seach_value2: "",
      pageSize: 0,
      classification_list: [], //商品分类列表
      classification_value: [],
      operationClassification_list: [], //运营分类列表
      goods_status_list: [
        //商品状态
        {
          id: "1",
          name: "在售",
        },
        {
          id: "2",
          name: "已售罄",
        },
      ],
      jubao:{},
      jubao_change_visible:false,
      gongfu:{},
      gong_change_visible:false,
      goods_status: "", //商品状态
      goods_status_list_add: [
        //商品添加状态
        {
          id: "1",
          name: "已添加至橘宝商城",
        },
        {
          id: "2",
          name: "未添加至橘宝商城",
        },
      ],
      goods_status_add: "", //商品添加状态
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
      second_cate: [],
      sort:"",
      three_cate: [],
      multipleSelection: [], //选中的数据
      operation_second_cate: [],
      operation_three_cate: [],
      add_activities_visible: false,
      formLabelWidth: "120px",
      is_sku: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      activityList: [
        {
          id: "1",
          name: "活动一",
        },
        {
          id: "2",
          name: "活动二",
        },
      ],
      checkAll: false,
      checkedCities: ["1"],
      price_change_visible: false,
      form_specifications: {
        name: "",
      },
      priceList: [], //规格价格列表
      height:"",
    };
  },

  created() {
    let that = this;
    this.get_cate(); //获取商品三级分类
    that.get_operation(); //获取运营三级分类
    this.height = document.body.clientHeight - 300
    if(this.$route.query.product_id != undefined){
      this.seach_value = this.$route.query.product_id
      this.pick_seach()
    }else{
      this.get_goods_list(); //获取商品列表
    }
    console.log(this.height)
  },

  methods: {

    handleSel(val){
      if(val.label == '市场价(元)' || val.label == '销售价(元)'){
        this.form_X.level = ''
        this.title1 = '批量设置:' + val.label
        this.opening_change_ifShow = true
        this.Q_message = val
      }
      
    },
    submit_saveChanges_level(){
      if(this.form_X.level == '') {
        this.$message({
          message: '请填写批量设置内容.',
          type: 'warning'
        });
        return
      }
      if(this.Q_message.label == '市场价(元)'){
        this.priceList.forEach((item,index) => {
          item.original_price = this.form_X.level
        })
      }else if(this.Q_message.label == '销售价(元)'){
        this.priceList.forEach((item,index) => {
          item.price = this.form_X.level
          this.shou(index,item)
        })
      }
      this.opening_change_ifShow = false
      console.log(this.Q_message.label)
      console.log(this.priceList)
    },
    //共富专区
    gongListFun(){
      corich_category({

      })
        .then((res) => {
          if (res.data.err_code == 0) {
            this.gongList = res.data.err_msg.list
          } else {
            that.loading = false;
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
    //悦淘分类
    taoyueListFun(){
      effective_category({

      })
        .then((res) => {
          if (res.data.err_code == 0) {
            this.taoyueList = res.data.err_msg.list
          } else {
            that.loading = false;
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
    //获取商品列表
    get_goods_list(index) {
      let that = this;
      that.operationTypeValue = "";
      that.classification_value = [];
      that.goods_status = "";
      that.seach_value = "";
      that.seach_value1 = "";
      that.seach_value2 = "";
      that.time_value = "";
      that.goods_status_add = "";
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      goods_list(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            that.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.sales = Number(element.sales)
              element.prime_cost_price = Number(element.prime_cost_price)
              element.original_price = Number(element.original_price)
              element.price = Number(element.price)
              element.add_time = that.commonJs.timestampToTime(
                element.add_time
              );
            });
            that.goodsList = res.data.err_msg.list;
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            that.queryInfo.page = parseInt(res.data.err_msg.page);
            that.queryInfo.total = parseInt(res.data.err_msg.total_number);
            that.pageSize = res.data.err_msg.page_size;
            if (index == 1) {
              that.$message({
                message: "刷新成功",
                type: "success",
              });
            }
          } else {
            that.loading = false;
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
    blurFun(){
      let that = this
      console.log(this.jubao.settle_ratio)
      if(parseInt(this.jubao.settle_ratio) == 0){
        that.$message({
          showClose: true,
          message: "结算比例不能为0",
          type: "error",
        });
      }else if(parseInt(this.jubao.settle_ratio) < 0){
        that.$message({
          showClose: true,
          message: "结算比例不能为负数",
          type: "error",
        });
      }
      set_settle_ratio(
        {
          product_id : that.jubao.product_id,
          settle_ratio : that.jubao.settle_ratio,
        }
      )
        .then((res) => {
          if (res.data.err_code == 0) {
            that.get_goods_info(that.jubao.product_id);            
          } else {
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取商品三级分类
    get_cate() {
      let that = this;
      goods_get_cate().then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg.first.length > 0) {
            if (res.data.err_msg.second.length > 0) {
              //存在二级分类

              if (res.data.err_msg.third.length > 0) {
                //存在三级分类

                res.data.err_msg.first.forEach((element_first, first_index) => {
                  that.second_cate = [];
                  that.classification_list.push({
                    value: element_first.cat_id,
                    label: element_first.cat_name,
                    cat_id: element_first.cat_id,
                  });

                  res.data.err_msg.second.forEach((element_second) => {
                    that.three_cate = [];
                    if (element_first.cat_id == element_second.cat_fid) {
                      //一级分类的ID等于二级分类的父级ID
                      that.second_cate.push({
                        value: element_second.cat_id,
                        label: element_second.cat_name,
                        cat_fid: element_second.cat_fid,
                        cat_id: element_second.cat_id,
                      });
                      that.classification_list[first_index].children =
                        that.second_cate;

                      res.data.err_msg.third.forEach((element_third) => {
                        if (element_second.cat_id == element_third.cat_fid) {
                          that.three_cate.push({
                            value: element_third.cat_id,
                            label: element_third.cat_name,
                            cat_fid: element_third.cat_fid,
                            cat_id: element_third.cat_id,
                          });
                          let index =
                            that.classification_list[first_index].children
                              .length - 1;
                          that.classification_list[first_index].children[
                            index
                          ].children = that.three_cate;
                        }
                      });
                    }
                  });
                });
              } else {
                //不存在三级分类
                res.data.err_msg.first.forEach((element_first, first_index) => {
                  that.second_cate = [];
                  that.classification_list.push({
                    value: element_first.cat_id,
                    label: element_first.cat_name,
                    cat_id: element_first.cat_id,
                  });
                  res.data.err_msg.second.forEach((element_second) => {
                    if (element_first.cat_id == element_second.cat_fid) {
                      that.second_cate.push({
                        value: element_second.cat_id,
                        label: element_second.cat_name,
                        cat_fid: element_second.cat_fid,
                        cat_id: element_second.cat_id,
                      });
                      that.classification_list[first_index].children =
                        that.second_cate;
                    }
                  });
                });
              }
            } else {
              res.data.err_msg.first.forEach((element_first) => {
                that.classification_list.push({
                  value: element_first.cat_id,
                  label: element_first.cat_name,
                });
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

    //商品三级分类选择
    pick_cate_change(value) {
      this.classification_value = value;
      console.log(this.classification_value);
    },

    // 获取运营三级分类
    get_operation() {
      let that = this;
      get_yunying_cate().then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg.first.length > 0) {
            if (res.data.err_msg.second.length > 0) {
              //存在二级分类

              if (res.data.err_msg.third.length > 0) {
                //存在三级分类

                res.data.err_msg.first.forEach((element_first, first_index) => {
                  that.operation_second_cate = [];
                  that.operationClassification_list.push({
                    value: element_first.group_id,
                    label: element_first.group_name,
                    group_id: element_first.group_id,
                  });

                  res.data.err_msg.second.forEach((element_second) => {
                    that.operation_three_cate = [];
                    if (element_first.group_id == element_second.group_fid) {
                      //一级分类的ID等于二级分类的父级ID
                      that.operation_second_cate.push({
                        value: element_second.group_id,
                        label: element_second.group_name,
                        group_fid: element_second.group_fid,
                        group_id: element_second.group_id,
                      });
                      that.operationClassification_list[first_index].children =
                        that.operation_second_cate;

                      res.data.err_msg.third.forEach((element_third) => {
                        if (
                          element_second.group_id == element_third.group_fid
                        ) {
                          that.operation_three_cate.push({
                            value: element_third.group_id,
                            label: element_third.group_name,
                            group_fid: element_third.group_fid,
                            group_id: element_third.group_id,
                          });
                          let index =
                            that.operationClassification_list[first_index]
                              .children.length - 1;
                          that.operationClassification_list[
                            first_index
                          ].children[index].children =
                            that.operation_three_cate;
                        }
                      });
                    }
                  });
                });
              } else {
                //不存在三级分类
                res.data.err_msg.first.forEach((element_first, first_index) => {
                  that.operation_second_cate = [];
                  that.operationClassification_list.push({
                    value: element_first.group_id,
                    label: element_first.group_name,
                    group_id: element_first.group_id,
                  });
                  res.data.err_msg.second.forEach((element_second) => {
                    if (element_first.group_id == element_second.group_fid) {
                      that.operation_second_cate.push({
                        value: element_second.group_id,
                        label: element_second.group_name,
                        group_fid: element_second.group_fid,
                        group_id: element_second.group_id,
                      });
                      that.operationClassification_list[first_index].children =
                        that.operation_second_cate;
                    }
                  });
                });
              }
            } else {
              res.data.err_msg.first.forEach((element_first) => {
                that.operationClassification_list.push({
                  value: element_first.group_id,
                  label: element_first.group_name,
                });
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

    //运营三级分类选择
    pick_operation_change(value) {

    },

    //分页
    
    get_shop_list_page(page, number) {
      let that = this;
      that.loading = true;
      goods_list({
        page: page,
        page_size: number,
        keyword: this.seach_value, //模糊搜索id或商品名称
        store_search_id:this.seach_value1,
        store_search_name:this.seach_value2,
        store_id: this.operationTypeValue, //平台传1 供货商传2
        soldout: this.goods_status, //状态 1在售 2售罄
        fid: this.classification_value[0], //一级分类id-商品
        sid: this.classification_value[1], //二级分类id-商品
        tid: this.classification_value[2], //三级分类id-商品
        start_time: this.time_value[0], //开始时间
        end_time: this.time_value[1], //结束时间
        // order_sales : 1, //销量排序 1低->高 2高->低
        // order_prime_cost_price : 1, //结算价排序 1低->高 2高->低
        // order_original_price : 1, //市场价排序 1低->高 2高->低
        // order_price : 1, //销售价排序 1低->高 2高->低
        jvbao: that.goods_status_add, //传1 搜索橘宝商城商品
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.sales = Number(element.sales)
              element.prime_cost_price = Number(element.prime_cost_price)
              element.original_price = Number(element.original_price)
              element.price = Number(element.price)
              element.add_time = that.commonJs.timestampToTime(
                element.add_time
              );
            });
            that.goodsList = res.data.err_msg.list;
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            that.queryInfo.page = parseInt(res.data.err_msg.page);
            that.queryInfo.total = parseInt(res.data.err_msg.total_number);
            that.pageSize = res.data.err_msg.page_size;
          } else {
            that.loading = false;
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
      let that = this;
      if (
        that.operationTypeValue == "" &&
        that.seach_value == "" &&
        that.seach_value1 == "" &&
        that.seach_value2 == "" &&
        that.goods_status == "" &&
        that.time_value == "" &&
        that.classification_value == "" &&
        that.goods_status_add == ""
      ) {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      goods_list({
        page: 1,
        page_size: this.pageSize,
        keyword: this.seach_value, //模糊搜索id或商品名称
        store_search_id:this.seach_value1,
        store_search_name:this.seach_value2,
        store_id: this.operationTypeValue, //平台传1 供货商传2
        soldout: this.goods_status, //状态 1在售 2售罄
        fid: this.classification_value[0], //一级分类id-商品
        sid: this.classification_value[1], //二级分类id-商品
        tid: this.classification_value[2], //三级分类id-商品
        start_time: this.time_value[0], //开始时间
        end_time: this.time_value[1], //结束时间
        // order_sales : 1, //销量排序 1低->高 2高->低
        // order_prime_cost_price : 1, //结算价排序 1低->高 2高->低
        // order_original_price : 1, //市场价排序 1低->高 2高->低
        // order_price : 1, //销售价排序 1低->高 2高->低
        jvbao: that.goods_status_add, //传1 搜索橘宝商城商品
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.sales = Number(element.sales)
              element.prime_cost_price = Number(element.prime_cost_price)
              element.original_price = Number(element.original_price)
              element.price = Number(element.price)
              element.add_time = that.commonJs.timestampToTime(
                element.add_time
              );
            });
            that.goodsList = res.data.err_msg.list;
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            that.queryInfo.page = parseInt(res.data.err_msg.page);
            that.queryInfo.total = parseInt(res.data.err_msg.total_number);
            that.pageSize = res.data.err_msg.page_size;
          } else {
            that.loading = false;
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          that.loading = false;
        });
    },

    //发布商品
    releaseProduct() {
      this.$router.push({ path: "/goods/add" });
    },

    //添加营销活动
    add_activity() {
      let that = this;
      if (that.multipleSelection.length < 1) {
        that.$message({
          showClose: true,
          message: "请至少选择一条数据",
          type: "error",
        });
      } else {
        let name = "";
        that.multipleSelection.forEach((element) => {
          if (name == "") {
            name = element.name;
          } else {
            name = name + "、" + element.name;
          }
        });
        this.$confirm(
          "此操作将把商品名称为 : " + name + "的商品加入营销活动, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          that.add_activities_visible = true;
        });
      }
    },
    shou(index, row) {
      console.log(index);
      if (Number(row.price).toFixed(2) > 0) {
        var price = Number(row.price).toFixed(2);
        get_profit({
          price: price,
          prime_cost_price: row.prime_cost_price,
          settle_ratio: this.O_message.settle_ratio,
        }).then((res) => {
          if (res.data.err_code == 0) {
            this.priceList[index].ratio = Number(
              res.data.err_msg.ratio
            ).toFixed(2);
            this.priceList[index].ratios =
              Number(res.data.err_msg.ratio).toFixed(2) + "%";
            this.priceList[index].member_level_1_price = Number(
              res.data.err_msg.member_level_1_price
            ).toFixed(2);
          } else {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        });
      } else {
        this.priceList[index].ratio = 0;
        this.priceList[index].ratios = 0;
        this.priceList[index].member_level_1_price = 0;
      }
    },
    //勾选
    handleCheckedCitiesChange(value) {
      console.log(this.checkedCities);
    },

    //加入活动
    add_activities() {
      let that = this;
      if (that.checkedCities.length < 1) {
        that.$message({
          message: "请至少勾选一项活动",
          type: "warning",
        });
        return;
      }
      that.$message({
        message: "加入成功",
        type: "success",
      });
      that.add_activities_visible = false;
    },
    //单个下架
    //下架
    dercarriage(row) {
      let that = this;
      let name = "";
      let idArr = "";
      name = row.name;
      idArr = row.product_id;
      this.$confirm(
        "此操作将下架商品名称为 : " + name + "的商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          off_shelf({
            product_id: idArr,
            status: 1, //状态(1 上架->下架 2 下架->上架)
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "下架成功",
                  type: "success",
                });
                
                this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                // that.get_goods_list();
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    //多个下架
    undercarriage() {
      let that = this;
      if (that.multipleSelection.length < 1) {
        that.$message({
          showClose: true,
          message: "请至少选择一条数据",
          type: "error",
        });
      } else {
        let name = "";
        let idArr = "";
        that.multipleSelection.forEach((element) => {
          if (name == "") {
            name = element.name;
            idArr = element.product_id;
          } else {
            name = name + "、" + element.name;
            idArr = idArr + "," + element.product_id;
          }
        });
        this.$confirm(
          "此操作将下架商品名称为 : " + name + "的商品, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            off_shelf({
              product_id: idArr,
              status: 1, //状态(1 上架->下架 2 下架->上架)
            })
              .then((res_s) => {
                console.log(res_s);
                if (res_s.data.err_code == 0) {
                  that.$message({
                    message: "下架成功",
                    type: "success",
                  });
                  this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                  // that.get_goods_list();
                } else {
                  that.$message({
                    showClose: true,
                    message: res_s.data.err_msg,
                    type: "error",
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch(() => {});
      }
    },

    //当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },

    //编辑
    compile(index, row) {
      let that = this;
      this.$router.push({
        path: "/goods/update",
        query: { product_id: row.product_id, is_edit: true },
      });
    },
    //悦淘专享
    priceChange1(row){
      let that = this;
      that.jubao = row;
      that.O_message = row
      that.sort = ''
      that.get_goods_info(row.product_id);
      that.jubao_change_visible = true;
      this.taoyueListFun()
    },
    //共富专区
    priceChange2(row){
      let that = this;
      that.gongfu = row;
      that.O_message = row
      that.sort = ''
      that.get_goods_info(row.product_id);
      that.gong_change_visible = true;
      this.gongListFun()
    },
    //改价
    priceChange(index, row) {
      let that = this;
      that.O_message = row;
      this.$confirm("此操作存在风险, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          that.get_goods_info(row.product_id);
          that.form_specifications.name = row.name;
          that.price_change_visible = true;
        })
        .catch(() => {});
    },

    //获取商品规格价格
    get_goods_info(product_id) {
      let that = this;
      goods_info({
        product_id: product_id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.is_sku = res_s.data.err_msg.is_sku;
            res_s.data.err_msg.list.forEach((element, index) => {
              get_profit({
                price: element.price,
                prime_cost_price: element.prime_cost_price,
                settle_ratio: this.O_message.settle_ratio,
              }).then((res) => {
                if (res.data.err_code == 0) {
                  element.ratio = Number(res.data.err_msg.ratio).toFixed(2);
                  element.ratios =
                    Number(res.data.err_msg.ratio).toFixed(2) + "%";
                  element.member_level_1_price = Number(
                    res.data.err_msg.member_level_1_price
                  ).toFixed(2);
                  let obj = res_s.data.err_msg.list[index].original_price;
                  element.original_price = 1000000;
                  element.original_price = obj;
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.err_msg,
                    type: "error",
                  });
                }
              });
            });
            that.priceList = res_s.data.err_msg.list;

            console.log(that.priceList);
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //添加悦淘
    priceChange_sure1() {
      let that = this;
      let leg = false;
      let leg1 = false;
      let leg2 = false;
      let leg3 = false;
      if (this.jubao.settle_ratio == '') {
        that.$message({
          message: "结算比例必填",
          type: "warning",
        });
        return;
      }
      if (this.jubao.settle_ratio == '0') {
        that.$message({
          message: "结算比例不能为0",
          type: "warning",
        });
        return;
      }
      if (parseInt(this.jubao.settle_ratio) < 0) {
        that.$message({
          message: "结算比例不能为0",
          type: "warning",
        });
        return;
      }
      if (this.sort == '') {
        that.$message({
          message: "商品分类必填",
          type: "warning",
        });
        return;
      }
      that.priceList.forEach((element) => {
        if (element.original_price == "" || element.price == "") {
          leg = true;
          return;
        } else if (parseFloat(element.original_price) != 0) {
          if(
            parseFloat(element.original_price) < 0.1 ||
            parseFloat(element.price) < 0.1
          ){
            leg1 = true;
            return;
          }
        } 
         else if (
          parseFloat(element.prime_cost_price) > parseFloat(element.price)
        ) {
          leg3 = true;
          return;
        }
      });
      if (leg == true) {
        that.$message({
          message: "请将表格信息填写完整",
          type: "warning",
        });
        return;
      }
      if (leg1 == true) {
        that.$message({
          message: "市场价与销售价不能低于0.1元",
          type: "warning",
        });
        return;
      }
      if (leg2 == true) {
        that.$message({
          message: "市场价需要大于销售价",
          type: "warning",
        });
        return;
      }
      if (leg3 == true) {
        that.$message({
          message: " 结算价需要小于销售价",
          type: "warning",
        });
        return;
      }
      let price = "";
      let original_price = "";
      let prime_cost_price = "";
      let member_level_1_price = "";
      let store_id = that.O_message.store_id;
      let settle_ratio = that.O_message.settle_ratio;
      let result = [];
      if (that.is_sku == 2) {
        price = that.priceList[0].price;
        original_price = that.priceList[0].original_price;
        prime_cost_price = that.priceList[0].prime_cost_price;
        member_level_1_price = that.priceList[0].member_level_1_price;
      } else {
        that.priceList.forEach((item) => {
          result.push({
            price: item.price,
            properties:item.properties,
            quantity:item.quantity,
            original_price: item.original_price,
            prime_cost_price: item.prime_cost_price,
            member_level_1_price: item.member_level_1_price,
            settle_ratio: settle_ratio,
          });
        });
      }
      let data = {
        product_id: that.O_message.product_id,
        category_id:that.sort,
        settle_ratio: settle_ratio,
        member_level_1_price: member_level_1_price,
        price: price,
        original_price: original_price,
        prime_cost_price: prime_cost_price,
        sku_data: result.length == 0 ? [] : JSON.stringify(result),
      }
      console.log(data)
      // return
      effective(
        data
      )
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.jubao_change_visible = false;
            that.$message({
              message: "添加成功",
              type: "success",
            });
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_goods_list();
          } else {
            that.jubao_change_visible = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.jubao_change_visible = false;
          console.log(error);
        });
    },
    //养生共富
    priceChange_sure2() {
      let that = this;
      let leg = false;
      let leg1 = false;
      let leg2 = false;
      let leg3 = false;
      if (this.gongfu.settle_ratio == '') {
        that.$message({
          message: "结算比例必填",
          type: "warning",
        });
        return;
      }
      if (this.gongfu.settle_ratio == '0') {
        that.$message({
          message: "结算比例不能为0",
          type: "warning",
        });
        return;
      }
      if (parseInt(this.gongfu.settle_ratio) < 0) {
        that.$message({
          message: "结算比例不能为0",
          type: "warning",
        });
        return;
      }
      if (this.sort == '') {
        that.$message({
          message: "商品分类必填",
          type: "warning",
        });
        return;
      }
      that.priceList.forEach((element) => {
        if (element.original_price == "" || element.price == "") {
          leg = true;
          return;
        } else if (parseFloat(element.original_price) != 0) {
          if(
            parseFloat(element.original_price) < 0.1 ||
            parseFloat(element.price) < 0.1
          ){
            leg1 = true;
            return;
          }
        } 
         else if (
          parseFloat(element.prime_cost_price) > parseFloat(element.price)
        ) {
          leg3 = true;
          return;
        }
      });
      if (leg == true) {
        that.$message({
          message: "请将表格信息填写完整",
          type: "warning",
        });
        return;
      }
      if (leg1 == true) {
        that.$message({
          message: "市场价与销售价不能低于0.1元",
          type: "warning",
        });
        return;
      }
      if (leg2 == true) {
        that.$message({
          message: "市场价需要大于销售价",
          type: "warning",
        });
        return;
      }
      if (leg3 == true) {
        that.$message({
          message: " 结算价需要小于销售价",
          type: "warning",
        });
        return;
      }
      let price = "";
      let original_price = "";
      let prime_cost_price = "";
      let member_level_1_price = "";
      let store_id = that.O_message.store_id;
      let settle_ratio = that.O_message.settle_ratio;
      let result = [];
      if (that.is_sku == 2) {
        price = that.priceList[0].price;
        original_price = that.priceList[0].original_price;
        prime_cost_price = that.priceList[0].prime_cost_price;
        member_level_1_price = that.priceList[0].member_level_1_price;
      } else {
        that.priceList.forEach((item) => {
          result.push({
            price: item.price,
            properties:item.properties,
            quantity:item.quantity,
            original_price: item.original_price,
            prime_cost_price: item.prime_cost_price,
            member_level_1_price: item.member_level_1_price,
            settle_ratio: settle_ratio,
          });
        });
      }
      let data = {
        product_id: that.O_message.product_id,
        category_id:that.sort,
        settle_ratio: settle_ratio,
        member_level_1_price: member_level_1_price,
        price: price,
        original_price: original_price,
        prime_cost_price: prime_cost_price,
        sku_data: result.length == 0 ? [] : JSON.stringify(result),
      }
      console.log(data)
      // return
      corich_add(
        data
      )
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.gong_change_visible = false;
            that.$message({
              message: "添加成功",
              type: "success",
            });
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
          } else {
            that.gong_change_visible = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.gong_change_visible = false;
          console.log(error);
        });
    },
    //确认改价
    priceChange_sure() {
      let that = this;
      let leg = false;
      let leg1 = false;
      let leg2 = false;
      let leg3 = false;
      that.priceList.forEach((element) => {
        if (element.original_price == "" || element.price == "") {
          leg = true;
          return;
        } else if (parseFloat(element.original_price) != 0) {
          if(
            parseFloat(element.original_price) < 0.1 ||
            parseFloat(element.price) < 0.1
          ){
            leg1 = true;
            return;
          }
        } 
         else if (
          parseFloat(element.prime_cost_price) > parseFloat(element.price)
        ) {
          leg3 = true;
          return;
        }
      });
      if (leg == true) {
        that.$message({
          message: "请将表格信息填写完整",
          type: "warning",
        });
        return;
      }
      if (leg1 == true) {
        that.$message({
          message: "市场价与销售价不能低于0.1元",
          type: "warning",
        });
        return;
      }
      if (leg2 == true) {
        that.$message({
          message: "市场价需要大于销售价",
          type: "warning",
        });
        return;
      }
      if (leg3 == true) {
        that.$message({
          message: " 结算价需要小于销售价",
          type: "warning",
        });
        return;
      }
      let price = "";
      let original_price = "";
      let prime_cost_price = "";
      let member_level_1_price = "";
      let store_id = that.O_message.store_id;
      let settle_ratio = that.O_message.settle_ratio;
      let result = [];
      if (that.is_sku == 2) {
        price = that.priceList[0].price;
        original_price = that.priceList[0].original_price;
        prime_cost_price = that.priceList[0].prime_cost_price;
        member_level_1_price = that.priceList[0].member_level_1_price;
      } else {
        that.priceList.forEach((item) => {
          result.push({
            sku_id: item.sku_id,
            price: item.price,
            original_price: item.original_price,
            prime_cost_price: item.prime_cost_price,
            store_id: store_id,
            member_level_1_price: item.member_level_1_price,
            settle_ratio: settle_ratio,
          });
        });
      }
      save_price({
        product_id: that.O_message.product_id,
        store_id: store_id,
        settle_ratio: settle_ratio,
        member_level_1_price: member_level_1_price,
        price: price,
        original_price: original_price,
        prime_cost_price: prime_cost_price,
        result: result.length == 0 ? [] : JSON.stringify(result),
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.price_change_visible = false;
            that.$message({
              message: "改价成功",
              type: "success",
            });
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_goods_list();
          } else {
            that.price_change_visible = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.price_change_visible = false;
          console.log(error);
        });
    },

    //添加到橘宝商城
    addShoppingMall(index, row) {
      let that = this;
      this.$confirm(
        "此操作将把商品名称为 : " +
          row.name +
          "的商品添加到橘宝商城, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          add_product({
            id: row.product_id,
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                // that.get_goods_list();
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-table td,
.el-table th.is-leaf {
  border-top: 1px solid #717b90;
  border-bottom: 0;
}
/deep/ .el-button--warning{
    background-color: #ee8f29;
    border-color: #ee8f29;
}
/deep/ .el-table__body {
  border-bottom: 1px solid #ebeef5;
}

/deep/ .el-date-editor {
  margin-right: 20px;
}

.seach {
  display: flex;
  justify-content: space-between;
  /deep/ .el-input {
    width: 200px;
    margin: 0 20px 0 10px;
  }
}
/deep/ .el-dialog {
  width: 1200px !important;
}

/deep/ .el-dialog__body {
  height: 300px;
  max-height: 400px;
  overflow-y: auto;
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

.goodsindex {
  width: 100%;
  min-height: 100%;
  padding: 0 15px 0;
  box-sizing: border-box;
}

/* 搜索 */
.goodsindex-queryInfo {
  margin-bottom: 10px;
}

.goodsindex-queryInfo-li {
  width: 100%;
  height: auto;
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
.divBlock{
  padding: 20px 0 10px;
    z-index: 100;
    background: #fff;
}
.wo:before{
  left: -132px;
}
</style>