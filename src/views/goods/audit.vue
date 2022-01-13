<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
        <el-input v-model="seach_value" @keyup.enter.native="pick_seach" placeholder="商品ID/商品名称/店铺名称"></el-input>
        <el-cascader
          placeholder="请选择商品分类"
          v-model="classification_value"
          style="line-height:0;"
          :options="classification_list"
          :props="{ expandTrigger: 'hover' , checkStrictly: true}"
          @change="pick_cate_change"></el-cascader>
        <el-select v-model="goods_status" placeholder="请选择审核状态">
          <el-option
            v-for="item in goods_status_list"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-date-picker
          :clearable = false
          v-model="time_value"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        
      </div>
      <div class="button_type">
        <el-button type="primary" @click="pick_seach">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="goodsList"
          border
          stripe
          :height="height"
          style="width: 100%"
        >
          <el-table-column 
            label="序号"
            type="index" 
          >
          </el-table-column>
          <el-table-column 
            prop="apply_time" 
            label="申请时间" 
          >
          </el-table-column>
          <el-table-column 
            prop="store_name" 
            label="店铺名称" 
          >
          </el-table-column>
          <el-table-column 
            prop="name" 
            width="150"
            label="商品名称" 
          >
          </el-table-column>
          <el-table-column 
            prop="product_id" 
            label="商品ID" 
          >
          </el-table-column>
          <el-table-column label="商品主图">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.image"
                style="max-width:80px;max-height:80px;"
                :preview-src-list="[scope.row.image]"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="商品分类">
            <template slot-scope="scope">
              {{scope.row.fname}}
              {{scope.row.sname ? '>>' + scope.row.sname : '' }}
              {{scope.row.tname ? '>>' + scope.row.tname : '' }}
            </template>
          </el-table-column>
           <el-table-column 
            prop="quantity" 
            label="库存数量" 
          >
          </el-table-column>
          <el-table-column 
            prop="prime_cost_price" 
            label="结算价(元)" 
          >
          </el-table-column>
          <el-table-column 
            prop="original_price" 
            label="市场价(元)" 
          >
          </el-table-column>
          <el-table-column 
            prop="price" 
            label="销售价(元)" 
          >
          </el-table-column>
          
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.platform_check == 1 ? '待审核' : '已拒绝'}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-show="scope.row.platform_check == 1 "
                @click="examine(scope.$index, scope.row)"
                >审核</el-button
              >
              <el-button
                size="mini"
                type="success"
                style="margin-top:10px"
                @click="viewDetails(scope.$index, scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 审核弹窗 -->
    <el-dialog :title="title" :visible.sync="goods_examine_change_ifShow">
      <div class="dialog_left">
         <el-form :model="form_goods_details">
          <el-form-item label="商品ID" :label-width="formLabelWidth">
            <el-input v-model="form_goods_details.goodsID" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="form_goods_details.goodsName" autocomplete="off" disabled></el-input>
          </el-form-item>
          
          <el-form-item label="商品主图" :label-width="formLabelWidth">
            <el-image
              style="width:180px;heigth:180px;"
              :src="form_goods_details.img"
              fit="cover"></el-image>
          </el-form-item>
          <el-form-item label="拒绝原因" :label-width="formLabelWidth" v-show="!form_goods_details.ifDetails">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入拒绝原因"
              v-model="form_goods_details.rejReasons">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog_right">
        <el-form :model="form_goods_details">
          <el-form-item label="商品分类" :label-width="formLabelWidth">
            <el-input v-model="form_goods_details.goodsClassification" autocomplete="off"  disabled></el-input>
          </el-form-item>

          <el-form-item label="店铺名称" :label-width="formLabelWidth">
            <el-input v-model="form_goods_details.shopName" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="库存数量" :label-width="formLabelWidth">
            <el-input v-model="form_goods_details.stock" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <!-- <el-form-item label="结算价" :label-width="formLabelWidth">
            <el-input v-model="form_goods_details.settlementPrice" autocomplete="off"  disabled></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="市场价" :label-width="formLabelWidth" v-show="form_goods_details.ifDetails">
            <el-input v-model="form_goods_details.marketValue" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="市场价" :label-width="formLabelWidth" v-show="!form_goods_details.ifDetails">
            <el-input v-model="form_goods_details.marketValue" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="销售价" :label-width="formLabelWidth" v-show="!form_goods_details.ifDetails" >
            <el-input v-model="form_goods_details.sellingPrice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="销售价" :label-width="formLabelWidth" v-show="form_goods_details.ifDetails" >
            <el-input v-model="form_goods_details.sellingPrice" autocomplete="off" disabled ></el-input>
          </el-form-item> -->
          <el-form-item label="申请时间" :label-width="formLabelWidth" >
            <el-input v-model="form_goods_details.apply_time" autocomplete="off"  disabled></el-input>
          </el-form-item>
          <el-form-item label="结算比例" :label-width="formLabelWidth">
            <el-input v-model="form_goods_details.settle_ratio" @input="set_settle" type="number" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="分润" :label-width="formLabelWidth" >
            <el-input v-model="form_goods_details.member_level_1_price" type="number" disabled autocomplete="off"></el-input>
          </el-form-item> -->
          <el-form-item label="查看规格" :label-width="formLabelWidth" >
            <el-button type="primary" @click="viewSpecifications">点击查看</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" v-show="!form_goods_details.ifDetails">
        <el-button @click="rejection">拒绝</el-button>
        <el-button type="primary" @click="submit_examine_goods">同意上架</el-button>
      </div>

      <!-- 规格弹窗 -->
      <el-dialog
        width="300px"
        title="商品规格"
        :visible.sync="innerVisible"
        append-to-body>
        
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="priceList"
              border
              style="width: 100%"
              @header-click="handleSel"
            >
              <el-table-column 
                label="序号"
                type="index" 
                width="80"
              >
              </el-table-column>
               <el-table-column 
                prop="gg" 
                label="规格" 
                width="120"
              >
              </el-table-column>
              <el-table-column 
                prop="quantity" 
                label="库存数量" 
                width="120"
              >
              </el-table-column>
              <el-table-column 
                prop="prime_cost_price" 
                label="结算价(元)" 
                width="120"
              >
              </el-table-column>
              <el-table-column label="市场价(元)">
                <template slot-scope="scope">
                  
                  <el-input v-model="scope.row.original_price" type="number" autocomplete="off" v-show="!form_goods_details.ifDetails"></el-input>
                  <el-input v-model="scope.row.original_price" type="number" autocomplete="off" v-show="form_goods_details.ifDetails" disabled></el-input>
                </template>
              </el-table-column>
              <el-table-column label="销售价(元)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.price" autocomplete="off" type="number" v-show="!form_goods_details.ifDetails" @input="shou(scope.$index,scope.row)"></el-input>
                  <el-input v-model="scope.row.price" autocomplete="off" type="number" v-show="form_goods_details.ifDetails" disabled></el-input>
                </template>
              </el-table-column>
              <el-table-column label="平台利润比例(%)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ratios" autocomplete="off" disabled></el-input>
                </template>
              </el-table-column>
              <el-table-column label="分润金额(元)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.member_level_1_price" autocomplete="off" disabled></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取消</el-button>
          <el-button type="primary" @click="submitSpecifications">确认</el-button>
        </div>
      </el-dialog>
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
  </div>
</template>

<script>
import { goods_check_list , goods_get_cate  , goods_info , save_price , goods_check,get_profit,set_settle_ratio ,goods_info_product} from "../../utils/axios";
export default {
  data() {
    return {
      goodsList: [], //商品列表
      loading : false,
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
        total : 1
      },
      seach_value : '',
      pageSize : 20,
      classification_list :[], //商品分类列表
      classification_value : [],
      goods_status_list : [//商品状态
        {
          id: '1',
          name: '待审核'
        }, {
          id: '2',
          name: '已拒绝'
        }
      ],
      height:"",
      goods_status : '',//商品状态
      time_value : '',
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
      second_cate : [],
      three_cate : [],
      goods_examine_change_ifShow : false,
      form_goods_details: {
        goodsID : '',
        goodsName : '',
        goodsClassification : '',
        img : '',
        shopName : '',
        rejReasons : '',
        stock : '',
        settlementPrice : '',
        marketValue : '',
        sellingPrice : '',
        apply_time : '',
        settle_ratio:"",
        member_level_1_price:"",
        ifDetails : false
      },
      title : '商品审核',
      formLabelWidth: "100px",
      innerVisible : false,
      priceList : [
        {
          ratio:"50"
        }
      ],//规格价格列表
      is_sku:""
    };
  },

  created() {
    this.get_goods_list(); //获取商品审核列表
    this.get_cate() //获取商品三级分类
    this.height = document.body.clientHeight - 240
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
    //获取商品审核列表
    get_goods_list (index) {
      let that = this
      that.classification_value = []
      that.goods_status = ''
      that.seach_value = ''
      that.time_value = ''
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      goods_check_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          //测试数据
          // res.data = {"err_code":0,"err_msg":{"list":[{"fname":"\u6c47\u5403\u7f8e\u98df","sname":"\u7cae\u6cb9\u8c03\u5473","tname":"","product_id":"7748","name":"\u539f\u751f\u6001\u5927\u7c73--\u73cd\u73e0\u7c73--2021\u5e74\u65b0\u7c7310\u65a4\u5305\u90ae","image":"http:\/\/rcjujiao.oss-cn-hangzhou.aliyuncs.com\/image\/1633940601300\/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211011165941.jpg","store_name":"\u7a3b\u4e4b\u6e90\u751f\u6001\u519c\u4e1a","apply_time":"1633941193","quantity":"125688","prime_cost_price":"37.00","original_price":"0.00","price":"0.00","platform_check":"1","group_name":"","sales":"0","settle_ratio":"0","member_level_1_price":"0.00","store_id":"748"},{"fname":"\u667a\u6167\u5065\u5eb7","sname":"\u4fdd\u5065\u81b3\u98df","tname":"","product_id":"7740","name":"\u4e0a\u597d\u7684\u4e9a\u9ebb\u4ec1 \u5bcc\u542b\u03b1-\u4e9a\u9ebb\u9178 \u72ec\u7acb\u5c0f\u888b\u98df\u7528\u65b9\u4fbf 450\u514b\uff0830\u514bX15\u888b\uff09","image":"http:\/\/rcjujiao.oss-cn-hangzhou.aliyuncs.com\/image\/1633881854901\/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211010235940.jpg","store_name":"A sinm \u73b2\u7684\u5e97","apply_time":"1633882191","quantity":"499","prime_cost_price":"54.60","original_price":"0.00","price":"0.00","platform_check":"2","group_name":"","sales":"0","settle_ratio":"0","member_level_1_price":"0.00","store_id":"750"},{"fname":"\u667a\u6167\u5065\u5eb7","sname":"\u4fdd\u5065\u81b3\u98df","tname":"","product_id":"7739","name":"\u4e0a\u597d\u7684\u6742\u7cae\u793c\u76d2-\u4e94\u8c37\u6742\u7cae\u793c\u76d2\u9001\u793c\u56e2\u8d2d\u793c\u5305\uff08\u5c0f\u7c73\u3001\u571f\u9ec4\u8c46\u3001\u82e6\u835e\u7c73\u3001\u835e\u9ea6\u7c73\u3001\u7ea2\u8c46\u3001\u8d64\u5c0f\u8c46\u3001\u71d5\u9ea6\u7c73\u3001\u9ad8\u6881\u7c73\uff09","image":"http:\/\/rcjujiao.oss-cn-hangzhou.aliyuncs.com\/image\/1633880381442\/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211010232153.jpg","store_name":"A sinm \u73b2\u7684\u5e97","apply_time":"1633880732","quantity":"499","prime_cost_price":"106.40","original_price":"0.00","price":"0.00","platform_check":"2","group_name":"","sales":"0","settle_ratio":"0","member_level_1_price":"0.00","store_id":"750"},{"fname":"\u667a\u6167\u5065\u5eb7","sname":"\u4fdd\u5065\u81b3\u98df","tname":"","product_id":"7738","name":"\u8840\u71d5\u9ea6400g Q\u5f39\u6ed1\u7cef \u7231\u4e0d\u91ca\u53e3 \u66f4\u8425\u517b\u66f4\u5065\u5eb7","image":"http:\/\/rcjujiao.oss-cn-hangzhou.aliyuncs.com\/image\/1633871011599\/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211010205340.jpg","store_name":"A sinm \u73b2\u7684\u5e97","apply_time":"1633871776","quantity":"499","prime_cost_price":"49.00","original_price":"0.00","price":"0.00","platform_check":"2","group_name":"","sales":"0","settle_ratio":"0","member_level_1_price":"0.00","store_id":"750"},{"fname":"\u667a\u6167\u5065\u5eb7","sname":"\u4fdd\u5065\u81b3\u98df","tname":"","product_id":"7732","name":"\u7d2b\u82cf\u6cb9\u53e3\u670d\u6db2 \u4e9a\u9ebb\u9178\u7eaf\u5ea660%","image":"http:\/\/rcjujiao.oss-cn-hangzhou.aliyuncs.com\/image\/1633859851341\/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211010174723.jpg","store_name":"A sinm \u73b2\u7684\u5e97","apply_time":"1633860745","quantity":"500","prime_cost_price":"69.30","original_price":"0.00","price":"0.00","platform_check":"2","group_name":"","sales":"0","settle_ratio":"0","member_level_1_price":"0.00","store_id":"750"},{"fname":"\u667a\u6167\u5065\u5eb7","sname":"\u4fdd\u5065\u81b3\u98df","tname":"","product_id":"7730","name":"\u82e6\u835e\u71d5\u9ea6\u918b","image":"http:\/\/rcjujiao.oss-cn-hangzhou.aliyuncs.com\/image\/1633856100393\/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211010165253.jpg","store_name":"A sinm \u73b2\u7684\u5e97","apply_time":"1633882204","quantity":"500","prime_cost_price":"25.20","original_price":"0.00","price":"0.00","platform_check":"2","group_name":"","sales":"0","settle_ratio":"0","member_level_1_price":"0.00","store_id":"750"},{"fname":"\u667a\u6167\u5065\u5eb7","sname":"\u4fdd\u5065\u81b3\u98df","tname":"","product_id":"7729","name":"\u88f8\u71d5\u9ea6400g \u771f\u7a7a\u5305\u88c5\u5b55\u5987\u5b9d\u5b9d\u8425\u517b\u7c73 \u4e94\u8c37\u6742\u7cae \u7c97\u7cae\u7c73","image":"http:\/\/rcjujiao.oss-cn-hangzhou.aliyuncs.com\/image\/1633855699461\/1.jpg","store_name":"A sinm \u73b2\u7684\u5e97","apply_time":"1633855851","quantity":"500","prime_cost_price":"16.00","original_price":"0.00","price":"0.00","platform_check":"2","group_name":"","sales":"0","settle_ratio":"0","member_level_1_price":"0.00","store_id":"750"},{"fname":"\u667a\u6167\u5065\u5eb7","sname":"\u4fdd\u5065\u81b3\u98df","tname":"","product_id":"7728","name":"\u4e0a\u597d\u7684\u5c0f\u7c73500g\u5c0f\u9ec4\u7c73\u4e94\u8c37\u6742\u7cae\u6708\u5b50\u7c73\u5c0f\u7c73\u7ca5","image":"http:\/\/rcjujiao.oss-cn-hangzhou.aliyuncs.com\/image\/1633854350390\/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211010161018.jpg","store_name":"A sinm \u73b2\u7684\u5e97","apply_time":"1633882210","quantity":"999","prime_cost_price":"16.00","original_price":"0.00","price":"0.00","platform_check":"2","group_name":"","sales":"0","settle_ratio":"0","member_level_1_price":"0.00","store_id":"750"},{"fname":"\u6c47\u5403\u7f8e\u98df","sname":"\u7cae\u6cb9\u8c03\u5473","tname":"","product_id":"5954","name":"\u9038\u98de\u521d\u69a8\u6a44\u6984\u6cb9\u98df\u7528\u6cb95L\u8c03\u548c\u6cb9\u5f53\u6708\u65b0\u6cb9\u63a8\u8350","image":"http:\/\/rcjujiao.oss-cn-hangzhou.aliyuncs.com\/image\/1633940566151\/WechatIMG4190.jpeg","store_name":"\u5341\u5168\u98df\u7f8e","apply_time":"1633941200","quantity":"5000","prime_cost_price":"64.00","original_price":"99.00","price":"75.00","platform_check":"1","group_name":"","sales":"477","settle_ratio":"15","member_level_1_price":"11.25","store_id":"625"}],"total_number":"9","page_size":"10","page":"1"}}
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.apply_time	 = that.commonJs.timestampToTime(element.apply_time)
            });
            that.goodsList = res.data.err_msg.list
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
            that.pageSize = res.data.err_msg.page_size
            if(index == 1) {
              that.$message({
                message: '刷新成功',
                type: 'success'
              });
            }
            // if(index == 2) {
            //   that.examine (0,that.O_message)
            // }
          } else {
            that.loading = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.loading = false
          console.log(error);
        });
    },

    // 获取商品三级分类
    get_cate(){
      let that = this
      goods_get_cate().then(res=>{
        if(res.data.err_code==0){
          if( res.data.err_msg.first.length > 0) {

            if(res.data.err_msg.second.length > 0) { //存在二级分类

              if(res.data.err_msg.third.length > 0) { //存在三级分类

                res.data.err_msg.first.forEach((element_first , first_index) => {
                  that.second_cate = []
                  that.classification_list.push({
                    value : element_first.cat_id,
                    label : element_first.cat_name,
                    cat_id : element_first.cat_id
                  })

                  res.data.err_msg.second.forEach(element_second => {
                    that.three_cate = []
                    if(element_first.cat_id == element_second.cat_fid) {//一级分类的ID等于二级分类的父级ID
                      that.second_cate.push({
                        value : element_second.cat_id,
                        label : element_second.cat_name,
                        cat_fid : element_second.cat_fid,
                        cat_id : element_second.cat_id
                      })
                      that.classification_list[first_index].children = that.second_cate

                      res.data.err_msg.third.forEach(element_third => {

                        if(element_second.cat_id == element_third.cat_fid) {
                          that.three_cate.push({
                            value : element_third.cat_id,
                            label : element_third.cat_name,
                            cat_fid : element_third.cat_fid,
                            cat_id : element_third.cat_id
                          })
                          let index = that.classification_list[first_index].children.length-1
                          that.classification_list[first_index].children[index].children = that.three_cate
                        }
                      })
                    }
                  })
                })
                
              } else {//不存在三级分类
                res.data.err_msg.first.forEach((element_first , first_index) => {
                  that.second_cate = []
                  that.classification_list.push({
                    value : element_first.cat_id,
                    label : element_first.cat_name,
                    cat_id : element_first.cat_id
                  })
                  res.data.err_msg.second.forEach(element_second => {
                    if(element_first.cat_id == element_second.cat_fid) {
                      that.second_cate.push({
                        value : element_second.cat_id,
                        label : element_second.cat_name,
                        cat_fid : element_second.cat_fid,
                        cat_id : element_second.cat_id
                      })
                      that.classification_list[first_index].children = that.second_cate
                    }
                  })
                })
              }

            } else {
              res.data.err_msg.first.forEach(element_first => {
                that.classification_list.push({
                  value : element_first.cat_id,
                  label : element_first.cat_name
                })
              })
            }
          }
          console.log(that.classification_list)
        }else{
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
    },

    //商品三级分类选择
    pick_cate_change(value) {
      this.classification_value = value
      console.log(this.classification_value)
    },
    shou(index,row){
      console.log(index)
      if(Number(row.price).toFixed(2)>0){
        var price = Number(row.price).toFixed(2)
        get_profit({
          price:price,
          prime_cost_price:row.prime_cost_price,
          settle_ratio:this.form_goods_details.settle_ratio
        }).then((res) => {
          if (res.data.err_code == 0) {
            this.priceList[index].ratio = Number(res.data.err_msg.ratio).toFixed(2)
            this.priceList[index].ratios = Number(res.data.err_msg.ratio).toFixed(2) + "%"
            this.priceList[index].member_level_1_price = Number(res.data.err_msg.member_level_1_price).toFixed(2)
          } else {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        });
      }else{
        this.priceList[index].ratio = 0
        this.priceList[index].ratios = 0
        this.priceList[index].member_level_1_price = 0
      }
    },
    //分页
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      goods_check_list(
        {
          page : page,
          page_size: number,
          keyword : this.seach_value,//模糊搜索店铺名称/商品名称/商品id
          platform_check : this.goods_status,//平台审核 (1待审核 2审核拒绝)
          fid : this.classification_value[0],//一级分类id
          sid : this.classification_value[1],//二级分类id
          tid : this.classification_value[2],//三级分类id
          start_time : this.time_value[0],//开始时间
          end_time : this.time_value[1]//结束时间
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.apply_time	 = that.commonJs.timestampToTime (element.apply_time	)
            });
            that.goodsList = res.data.err_msg.list
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
            that.pageSize = res.data.err_msg.page_size
          } else {
            that.loading = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.loading = false
          console.log(error);
        });
    },

    //每页显示条数改变
    handleSizeChange(val) {
      console.log(this.queryInfo)
      this.get_shop_list_page(1,val)
    },

    //当前页
    handleCurrentChange(val) {
      console.log(val)
      this.get_shop_list_page(val,this.pageSize)
    },

    //搜索
    pick_seach () {
      let that = this
      if(that.seach_value == '' && that.goods_status == '' && that.time_value == '' && that.classification_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      goods_check_list(
        {
          page : 1,
          page_size: this.pageSize,
          keyword : this.seach_value,//模糊搜索店铺名称/商品名称/商品id
          platform_check : this.goods_status,//平台审核 (1待审核 2审核拒绝)
          fid : this.classification_value[0],//一级分类id
          sid : this.classification_value[1],//二级分类id
          tid : this.classification_value[2],//三级分类id
          start_time : this.time_value[0],//开始时间
          end_time : this.time_value[1]//结束时间
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.apply_time	 = that.commonJs.timestampToTime (element.apply_time	)
            });
            that.goodsList = res.data.err_msg.list
            that.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
            that.pageSize = res.data.err_msg.page_size
          } else {
            that.loading = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          console.log(error);
          that.loading = false
        });
    },

     //审核
    examine (index , row) {
      let that = this
      that.O_message = row
      that.form_goods_details.rejReasons = ''
      that.title = '商品审核'
      that.form_goods_details.ifDetails = false
      that.goods_examine_change_ifShow = true
      that.form_goods_details.goodsID = row.product_id
      that.form_goods_details.goodsName = row.name
      let sname = row.sname ? '>>' + row.sname : '' 
      let tname = row.tname ? '>>' + row.tname : '' 
      that.form_goods_details.goodsClassification = row.fname + sname + tname
      that.form_goods_details.img = row.image
      that.form_goods_details.shopName = row.store_name
      that.form_goods_details.stock = row.quantity
      that.form_goods_details.settlementPrice = row.prime_cost_price
      that.form_goods_details.marketValue = row.original_price
      that.form_goods_details.sellingPrice = row.price
      that.form_goods_details.apply_time = row.apply_time
      // that.form_goods_details.settle_ratio = row.settle_ratio
      if(row.member_level_1_price){
        that.form_goods_details.member_level_1_price = row.member_level_1_price
      }else{
        that.form_goods_details.member_level_1_price = "0"
      }
      goods_info_product(
        {
          product_id : that.O_message.product_id
        }
      )
        .then((res) => {
          if (res.data.err_code == 0) {
            that.form_goods_details.settle_ratio = res.data.err_msg.list.product_info.settle_ratio
          } else {
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.goods_examine_change_ifShow = false
          console.log(error);
        });
    },

    //查看规格
    viewSpecifications () {

      if(this.form_goods_details.settle_ratio == '') {
        this.$message({
          showClose: true,
          message: "结算比列不为空",
          type: "error",
        });
        return
      }
      if(parseInt(this.form_goods_details.settle_ratio) <= 0) {
        this.$message({
          showClose: true,
          message: "结算比例只能大于0",
          type: "error",
        });
        return
      }
      this.get_goods_info()

      // this.innerVisible = true
    },

    //获取商品规格价格
    get_goods_info () {
      let that = this
      goods_info({
        product_id: that.O_message.product_id
      })
        .then((res_s) => {
          console.log(res_s);
          // res_s.data = {"err_code":0,"err_msg":{"list":[{"price":"200.00","quantity":"0","prime_cost_price":"98.00","original_price":"400.00","member_level_1_price":"30.00"},
          // {"price":"201.00","quantity":"0","prime_cost_price":"99.00","original_price":"401.00","member_level_1_price":"31.00"}],"is_sku":2}}
          // console.log(res_s.data);
          // console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.is_sku = res_s.data.err_msg.is_sku
            
            res_s.data.err_msg.list.forEach((element ,index )=> {
              if(element.price <= 0){
                return
              }
              if(element.prime_cost_price <= 0){
                return
              }
              if(this.form_goods_details.settle_ratio <= 0){
                return
              }
              get_profit({
                price:element.price,
                prime_cost_price:element.prime_cost_price,
                settle_ratio:this.form_goods_details.settle_ratio,
              }).then((res) => {
                if (res.data.err_code == 0) {
                  element.ratio = Number(res.data.err_msg.ratio).toFixed(2)
                  element.ratios = Number(res.data.err_msg.ratio).toFixed(2) + "%"
                  element.member_level_1_price = Number(res.data.err_msg.member_level_1_price).toFixed(2)
                  let obj = res_s.data.err_msg.list[index].original_price
                  element.original_price = 1000000
                  element.original_price = obj
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.err_msg,
                    type: "error",
                  });
                }
              });
            });
            //ratio
            console.log(res_s.data.err_msg.list)
            that.priceList = res_s.data.err_msg.list
            that.innerVisible = true
            console.log(that.priceList)
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,

              type: 'error'
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //规格确认 市场价大于售价  结算价小于售价  最小值大于0.01
    submitSpecifications () {
      let that = this
      let leg = false
      let leg1 = false
      let leg2 = false
      let leg3 = false
      that.priceList.forEach(element => {
        if((element.original_price == '' && element.original_price != 0) || element.price == '' ) {
          leg = true
          return;
        } else if (parseInt(element.price) < 0.01 ) {
          leg1 = true
          return;
        } else if (parseInt(element.original_price) < parseInt(element.price) && element.original_price != 0 ) {
          leg2 = true
          return;
        } else if (parseInt(element.prime_cost_price) > parseInt(element.price) ) {
          leg3 = true
          return;
        }
      })
      if(leg == true) {
        that.$message({
          message: '请将表格信息填写完整',
          type: 'warning'
        });
        return
      }
      if(leg1 == true) {
        that.$message({
          message: '市场价与销售价不能低于0.01元',
          type: 'warning'
        });
        return
      }
      if(leg2 == true) {
        that.$message({
          message: '市场价需要大于销售价',
          type: 'warning'
        });
        return
      }
      if(leg3 == true) {
        that.$message({
          message: ' 结算价需要小于销售价',
          type: 'warning'
        });
        return
      }
      let price = ''
      let original_price = ''
      let prime_cost_price = ''
      let member_level_1_price = ''
      let store_id = that.O_message.store_id
      let settle_ratio = that.O_message.settle_ratio
      let result = []
      if(that.is_sku == 2) {
        price =  that.priceList[0].price
        prime_cost_price =  that.priceList[0].prime_cost_price
        original_price =  that.priceList[0].original_price
        member_level_1_price = that.priceList[0].member_level_1_price
      } else {
        that.priceList.forEach(item => {
          result.push({
            sku_id : item.sku_id,
            price : item.price,
            original_price : item.original_price,
            prime_cost_price : item.prime_cost_price,
            store_id : store_id,
            member_level_1_price:item.member_level_1_price,
            settle_ratio : settle_ratio,
          })
        })
      }
      save_price({
        product_id: that.O_message.product_id,
        store_id:store_id,
        settle_ratio:settle_ratio,
        member_level_1_price:member_level_1_price,
        price : price,
        original_price : original_price,
        prime_cost_price:prime_cost_price,
        result : result.length == 0 ? [] : JSON.stringify(result)
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.innerVisible = false
            that.$message({
              message: '改价成功',
              type: 'success'
            });
            
            // that.goods_examine_change_ifShow = false
            that.get_goods_list (2)
          } else {
            that.innerVisible = false
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.innerVisible = false
          console.log(error);
        });
    },

    //查看详情
    viewDetails (index , row) {
      let that = this
      // that.title = '商品详情'
      // that.form_goods_details.ifDetails = true
      // that.goods_examine_change_ifShow = true
      // that.form_goods_details.goodsID = row.product_id
      // that.form_goods_details.goodsName = row.name
      // let sname = row.sname ? '>>' + row.sname : '' 
      // let tname = row.tname ? '>>' + row.tname : '' 
      // that.form_goods_details.goodsClassification = row.fname + sname + tname
      // that.form_goods_details.img = row.image
      // that.form_goods_details.shopName = row.store_name
      // that.form_goods_details.stock = row.quantity
      // that.form_goods_details.settlementPrice = row.prime_cost_price
      // that.form_goods_details.marketValue = row.original_price
      // that.form_goods_details.sellingPrice = row.price
      // that.form_goods_details.apply_time = row.apply_time
      this.$router.push({path:'/goods/goodsInfo',query:{product_id:row.product_id,is_edit : false}});
    },

     //拒绝
    rejection () {
      let that = this 
      if(that.form_goods_details.rejReasons == '') {
        that.$message({
          message: '请填写拒绝原因',
          type: 'warning'
        });
        return
      }
      goods_check(
        {
          product_id : that.O_message.product_id,
          check : 2,
          reason : that.form_goods_details.rejReasons
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.$message({
              message: '已成功拒绝该商品的上架的申请',
              type: 'success'
            });
            that.goods_examine_change_ifShow = false
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_goods_list();//获取商品审核列表
          } else {
            that.goods_examine_change_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.goods_examine_change_ifShow = false
          console.log(error);
        });

    },
    set_settle(){
      let that = this
      if(that.form_goods_details.settle_ratio == '') {
        console.log("空")
        return
      }
      if(parseInt(that.form_goods_details.settle_ratio) <= 0) {
        console.log("大于0")
        return
      }
      
      
      set_settle_ratio(
        {
          product_id : that.O_message.product_id,
          settle_ratio : that.form_goods_details.settle_ratio,
        }
      )
        .then((res) => {
          if (res.data.err_code == 0) {
            
          } else {
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.goods_examine_change_ifShow = false
          console.log(error);
        });
    },
    //商品审核
    submit_examine_goods () {
      let that = this
      
      goods_check(
        {
          product_id : that.O_message.product_id,
          check : 1
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.$message({
              message: '已同意该商品的上架的申请',
              type: 'success'
            });
            that.goods_examine_change_ifShow = false
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_goods_list();//获取商品审核列表
          } else {
            that.goods_examine_change_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.goods_examine_change_ifShow = false
          console.log(error);
        });
    },



  },
};
</script>

<style scoped lang="less">
/deep/ .el-table__body-wrapper{
    overflow-y: auto!important;
    position: relative;
}
/deep/ .el-table td, .el-table th.is-leaf{
    border-top: 1px solid #717b90;
    border-bottom:0
}

/deep/ .el-table__body{
  border-bottom: 1px solid #EBEEF5;
}

/deep/ .el-date-editor {
  margin-right: 20px;
}

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
  }
}
/deep/ .el-dialog {
  width: 1100px !important;
  /deep/ .el-input {
    overflow-y: auto;  /*溢出隐藏*/
    // text-overflow: ellipsis; /*以省略号...显示*/
    // white-space: nowrap;  /*强制不换行*/
  }
}

/deep/ .el-dialog__body {
  height: auto;
  max-height: 520px;
  overflow-y: auto;
  display: flex;
  justify-content: space-between;
}

.seach_copy {
  padding-top:20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  /deep/ .el-input {
    width:200px;
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
/deep/ .el-dialog  {
  box-shadow: 0 0px 0px #ccc;
  -webkit-box-shadow : 0 0px 0px #ccc;
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

</style>