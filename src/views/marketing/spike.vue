<template>
  <div class="page">
    <div v-if="listType == 1">
      <div class="seach">
        <div class="seach_copy">
          <div class="seach_select"></div>
          <div class="button_type">
            <el-button type="primary" @click="pick_add">增加</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
              >刷新</el-button
            >
          </div>
        </div>
      </div>
      <!-- 列表开始 -->
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="extendList"
            border
            height="700"
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="100">
            </el-table-column>
            <el-table-column prop="seckill_name" label="秒杀名称"></el-table-column>
            <el-table-column
              prop="activity_start_time"
              label="活动开始时间"
            ></el-table-column>
            <el-table-column
              prop="activity_end_time"
              label="活动结束时间"
            ></el-table-column>
            <el-table-column
              label="是否删除"
              v-show="listType == 1"
            >
                <template v-if="listType == 1" slot-scope="scope">{{scope.row.is_stop == 1 ? '正常' : "删除"}}</template>
            </el-table-column>
            <el-table-column
              label="秒杀时间"
            >
              <template slot-scope="scope">{{parseInt(scope.row.seckill_start_time/3600) +'时'+parseInt((scope.row.seckill_start_time%3600)/60)+ '分 - '+ parseInt(scope.row.seckill_end_time/3600)+'时' + parseInt((scope.row.seckill_end_time%3600)/60) +"分"}}</template>
            </el-table-column>
            <el-table-column
              
              label="秒杀时长(分钟)"
            >
              <template slot-scope="scope">{{parseInt(scope.row.time)}}</template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
            ></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="deletes(scope.row)"
                  v-show="listType == 1"
                  >删除</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  style="margin-top:10px"
                  @click="see(scope.row)"
                  v-show="listType == 1"
                  >商品列表</el-button
                >
                <el-button
                  size="mini"
                  v-show="scope.row.status == '活动中'&&listType == 1"
                  type="danger"
                  style="margin-top:10px"
                  @click="stops(scope.row)"
                  >停止</el-button
                >
                <el-button
                  size="mini"
                  v-show="listType == 1"
                  style="margin-top:10px"
                  type="warning"
                  @click="modify(scope.row)"
                  >修改</el-button
                >
                
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 修改,删除弹窗 -->
      <el-dialog :visible.sync="opening_change_ifShow">
        <h2 style="margin-top:0;" v-if="type == 1">增加</h2>
        <h2 style="margin-top:0;" v-else-if="type == 2">修改</h2>
        <div>
            <h4>秒杀名称</h4>
        </div>
        <div>
            <el-input v-model="spikeName" style="width:300px" placeholder="请输入秒杀名称"></el-input>
        </div>
        <div>
            <h4>秒杀活动时间</h4>
        </div>
        <div>
            
            <el-date-picker
                :clearable="false"
                v-model="time_value"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            >
            </el-date-picker>
        </div>
        <div>
            <h4>秒杀时间</h4>
        </div>
        <div>
            <el-time-picker
                is-range
                v-model="value3"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
            </el-time-picker>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="opening_change_ifShow = false">取 消</el-button>
            <div v-if="type == 1" style="display:inline-block">
                <el-button type="primary" @click="submit_saveChanges_level"
                >增加</el-button
                >
            </div>
            
            <div v-else-if="type == 2" style="display:inline-block">
                <el-button type="primary" @click="submit_saveChanges_level"
                >修改</el-button
                >
            </div>
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
    <div v-else-if="listType == 2">
        <div class="seach">
            
            </div>
            <div class="seach_copy">
            <div class="seach_select">
                <el-input v-model="seach_value" placeholder="请输入商品名称"></el-input>
            </div>
            <div class="button_type">
                <el-button type="primary" @click="pick_seach">搜索</el-button>
                <el-button type="primary" icon="el-icon-back" @click="back"
                    >返回</el-button
                >
                <el-button
                size="mini"
                type="primary"
                @click="examines()"
                >添加商品</el-button
                >
                <el-button type="primary" icon="el-icon-refresh" @click="fn2(1)">刷新</el-button>
            </div>
            </div>
            <el-row :gutter="20" class="goodsindex-list">
            <el-col :span="24">
                <el-table
                v-loading="loading"
                ref="multipleTable"
                :data="goodsList"
                border
                style="width: 100%"
                >
                <el-table-column label="序号" type="index" width="100">
                    </el-table-column>
                    
                    <el-table-column 
                        prop="name"
                        label="商品名称" 
                        width="100"
                    >
                    </el-table-column>
                    
                    <el-table-column 
                        prop="price" 
                        label="商品售价" 
                    >
                    </el-table-column>
                    
                    <el-table-column 
                        prop="quantity" 
                        label="商品库存" 
                    >
                    </el-table-column>
                    
                    <el-table-column 
                        prop="seckill_price" 
                        label="秒杀价格" 
                    >
                    </el-table-column>
                    
                    <el-table-column 
                        prop="seckill_inventory" 
                        label="秒杀库存" 
                    >
                    </el-table-column>
                    <!-- 发现写到这个下面是可以出来的.上面写到就出不来 -->
                    <el-table-column 
                        prop="astrict" 
                        label="限购数量" 
                    >
                    </el-table-column>
                    <el-table-column label="商品图片" width="180">
                      <template slot-scope="scope">
                        <el-image
                            :src="scope.row.image"
                            fit="cover"></el-image>
                      </template>
                    </el-table-column>
                    <el-table-column 
                        prop="activity_start_time" 
                        label="活动开始时间" 
                    >
                    </el-table-column>
                    <el-table-column 
                        prop="activity_end_time" 
                        label="活动结束时间" 
                    >
                    </el-table-column>
                    <el-table-column 
                        prop="status" 
                        label="活动状态" 
                    >
                    </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="edit(scope.row)"
                        >修改</el-button
                    >
                    <el-button
                        size="mini"
                        type="primary"
                        @click="edit_ast(scope.row)"
                        >修改限购</el-button
                    >
                    <el-button
                        size="mini"
                        type="danger"
                        @click="deletes1(scope.row)"
                        >删除</el-button
                    >
                    
                    </template>
                </el-table-column>
                </el-table>
            </el-col>
            </el-row>
            <el-dialog :title="types == 1 ? '添加商品':'修改商品'" :visible.sync="goods_ifShow">
              
                  <div class="divImg" v-if="goodsInfo.image != ''">
                    <el-image
                      :src="goodsInfo.image"
                      style="width:150px"
                      fit="cover">
                      
                    </el-image>
                    <i class="el-icon-delete icon" @click="closeIcon"></i>
                  </div>
                  <el-button
                      size="mini"
                      type="primary"
                      @click="examine"
                      v-else
                      >选择</el-button
                  >
                    
                <h3>
                    商品信息设置
                </h3>
                <div class="tableDiv">
                  <el-row :gutter="20" class="goodsindex-list">
                    <el-col :span="24">
                        <el-table
                        v-loading="loading"
                        ref="multipleTable"
                        :data="skuList"
                        border
                        style="width: 100%"
                        >
                        <el-table-column 
                            prop="properties" 
                            label="商品属性" 
                        >
                        </el-table-column>
                        <el-table-column 
                            prop="price" 
                            label="原价" 
                        >
                        </el-table-column>
                        <el-table-column 
                            label="秒杀价格" 
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.seckill_price" type="number" placeholder="请输入价格"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column 
                            prop="quantity" 
                            label="商品库存" 
                        >
                        </el-table-column>
                        <el-table-column 
                            label="秒杀库存" 
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.seckill_inventory" type="number" placeholder="请输入秒杀库存"></el-input>
                            </template>
                        </el-table-column>
                      <el-table-column 
                            prop="property" 
                            label="规格值数组" 
                        >
                        </el-table-column>
                        </el-table>
                    </el-col>
                  </el-row>
                </div>
                
                <h3>限购数量</h3>
                <el-input v-model="astrict" type="number" placeholder="请输入限购数量"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="goods_ifShow = false">取 消</el-button>
                    <div v-if="types == 1" style="display:inline-block">
                        <el-button type="primary" @click="submit_saveChanges_level1"
                        >增加</el-button
                        >
                    </div>
                    
                    <div v-else-if="types == 2" style="display:inline-block">
                        <el-button type="primary" @click="submit_saveChanges_level1"
                        >修改</el-button
                        >
                    </div>
                </div>
            </el-dialog>
            
            <!-- 添加商品弹窗 -->
            <el-dialog title="添加商品" :visible.sync="goods_examine_change_ifShow">
            <div class="seach">
            
            </div>
            <div class="seach_copy">
                <div class="seach_select">
                <el-input v-model="product_name" type="number" placeholder="请输入商品ID/商品名称/店铺名称"></el-input>
                </div>
                <div class="button_type">
                <el-button type="primary" @click="pick_seach2">搜索</el-button>
                
                <el-button
                    size="mini"
                    type="primary"
                    @click="add_pro"
                    >添加商品</el-button
                >
                </div>
            </div>
            <div class="box">
                <el-row :gutter="20" class="goodsindex-list">
                <el-col :span="24">
                    <el-table
                    v-loading="loading"
                    ref="multipleTable"
                    :data="newGoodsList"
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChange2"
                    >
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column label="序号" type="index" width="100">
                    </el-table-column>
                    <el-table-column 
                        prop="name" 
                        label="商品名称" 
                        width="100"
                    >
                    </el-table-column>
                    <el-table-column label="商品图片" width="180">
                        <template slot-scope="scope">
                        <el-image
                            :src="scope.row.image"
                            fit="cover"></el-image>
                        </template>
                    </el-table-column>
                    
                    <el-table-column 
                        prop="price" 
                        label="商品售价" 
                    >
                    </el-table-column>

                    <el-table-column 
                        prop="quantity" 
                        label="商品库存" 
                    >
                    </el-table-column>
                    <el-table-column 
                        prop="store_name" 
                        label="店铺名称" 
                    >
                    </el-table-column>
                    </el-table>
                </el-col>
                </el-row>
                
            </div>
                
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
            </el-dialog>
            
            <el-dialog title="修改限购数量" :visible.sync="set_astrict_ifShow">
                <el-input v-model="astrict" placeholder="请输入商品名称"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="set_astrict_ifShow = false">取 消</el-button>
                    <el-button type="primary" @click="edit_astrict"
                    >修改</el-button
                    >
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
        </div>
  </div>
</template>
<script>
import { market_seckill_list,stop_seckill,del_seckill,add_or_update_seckill,seckill_info,
market_seckill_product,goods_list,set_astrict,del_product1,edit_product,add_product1,choice_product,goods_info_product,product_info } from "../../utils/axios";
export default {
  data() {
    return {
        spikeName:"",
        extendList:[],
        //get_agent_list 
        fn1: this.commonJs.Debounce(this.get_agent_list),
        queryInfo: {
            page: 1,
            pageSize: 20,
            total: 1,
        },
        broad:{
          market_id:""
        },
        time_value: "",
        // [new Date(2016, 9, 10, 8, 40,10), new Date(2016, 9, 10, 9, 40,13)]
        value3: null,
        type:1,
        listType:1,
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
        loading:false,
        seach_value:"",
        goods_ifShow:false,
        goods_examine_change_ifShow:false,
        fn2: this.commonJs.Debounce(this.get_goods_list),
        opening_change_ifShow:false,
        multipleSelection2:"",
        goodsList:[],
        product_name:"",
        newGoodsList:[],
        queryInfo2:{
            page: 1,
            pageSize: 20,
            total: 1,
        },
        queryInfo1:{
            page: 1,
            pageSize: 20,
            total: 1,
        },
        set_astrict_ifShow:false,
        astrict:"",
        skuList:[],
        types:1,
        goodsInfo:{
          image:""
        },
        commodity:{}
    };
  },
  created() {
    this.broad.market_id = this.$route.query.id
    this.get_agent_list(0,this.$route.query.id);
  },
  watch:{
      opening_change_ifShow:{
          handler(newVal){
              console.log(newVal)
              if(!newVal){
                  this.time_value = ""
                  this.spikeName = ""
                  this.value3 = null
              }
          }
      },
      goods_ifShow:{
          handler(newVal){
              console.log(newVal)
              if(!newVal){
                  
                  this.goodsInfo.image = ""
                  this.skuList = ""
                  this.astrict = ''
              }
          }
      },
      set_astrict_ifShow:{
          handler(newVal){
              console.log(newVal)
              if(!newVal){
                  this.astrict = ''
              }
          }
      },
      
  },
  
  methods:{
    
    submit_saveChanges_level(){
        if(this.spikeName == '' || this.time_value == "" || this.value3 == null) {
            this.$message({
                message: '请完整填写选项',
                type: 'warning'
            });
            return
        }
        
        var time1 = "";
        var time2 = "";
        console.log(this.time_value)
        if (this.time_value != "") {
            time1 = this.commonJs.newDataTime(this.time_value[0]);
            time2 = this.commonJs.newDataTime(this.time_value[1]);
        }
        console.log(time1)
        console.log(time2)
        console.log(this.type)
        if(this.type == 1){
            // 增加
            add_or_update_seckill({
                market_id:this.broad.market_id,
                seckill_name:this.spikeName,
                activity_start_time:time1,
                activity_end_time:time2,
                seckill_start_time:this.timeFloot(this.value3[0]),
                seckill_end_time:this.timeFloot(this.value3[1])
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '增加成功',
                        type: 'success'
                    });
                    this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                    // this.get_agent_list();
                    this.opening_change_ifShow = false
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }else{
            // 修改

            add_or_update_seckill({
                seckill_id:this.broad.id,
                market_id:this.broad.market_id,
                seckill_name:this.spikeName,
                activity_start_time:time1,
                activity_end_time:time2,
                seckill_start_time:this.timeFloot(this.value3[0]),
                seckill_end_time:this.timeFloot(this.value3[1])
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    // this.get_agent_list();
                    this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                    this.opening_change_ifShow = false
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
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
      market_seckill_list({
        page: page,
        page_size: number,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.activity_end_time = this.commonJs.timestampToTime(
                item.activity_end_time
              );
              item.activity_end_time = item.activity_end_time.split(" ")[0]
              item.activity_start_time = this.commonJs.timestampToTime(item.activity_start_time);
              item.activity_start_time = item.activity_start_time.split(" ")[0]
            });
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
    get_agent_list(index,id) {
      let that = this;
      that.loading = true;

      let request_form = {
        page: 1,
        page_size: 20,
      };
      if(id){
        request_form.market_id = id
      }else if(this.broad.market_id){
        request_form.market_id = this.broad.market_id
      }
      
      market_seckill_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.activity_end_time = this.commonJs.timestampToTime(
                item.activity_end_time
              );
              item.activity_end_time = item.activity_end_time.split(" ")[0]
              item.activity_start_time = this.commonJs.timestampToTime(item.activity_start_time);
              item.activity_start_time = item.activity_start_time.split(" ")[0]
            });
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
    pick_add(item) {
        this.opening_change_ifShow = true
        this.type = 1
    },
    //查看
    see(item) {
        
        this.broad = item
        this.listType = 2
        this.get_goods_list()
    },
    timeFloot(tim){
        var shi = tim.getHours()
        var fen = tim.getMinutes()
        var miao = tim.getSeconds()
        return shi * 3600 + fen * 60 + miao 
    },
    
    toHHmmss(data) {
        data = parseInt(data)
        
        var time;
        var hours = parseInt((data/ (60 * 60)));
        var minutes = parseInt(((data-parseInt(hours*3600))/ 60));
        var seconds = parseInt(data-parseInt(hours*3600)-parseInt(minutes*60));
        time = (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
        return time;
    },
    //修改
    modify(item) {
        this.opening_change_ifShow = true
        this.type = 2
        this.broad = item
        seckill_info({
            seckill_id:this.broad.id
        }).then((res) => {
            if (res.data.err_code == 0) {
            //this.XX = res.data.err_msg.list
                
                res.data.err_msg.info.seckill_start_time = this.toHHmmss(res.data.err_msg.info.seckill_start_time)
                res.data.err_msg.info.seckill_end_time = this.toHHmmss(res.data.err_msg.info.seckill_end_time)
                console.log(res.data.err_msg.info)
                this.value3 = [new Date(2016, 9, 10, this.shi(res.data.err_msg.info.seckill_start_time),this.fen(res.data.err_msg.info.seckill_start_time),this.miao(res.data.err_msg.info.seckill_start_time)), new Date(2016, 9, 10, this.shi(res.data.err_msg.info.seckill_end_time),this.fen(res.data.err_msg.info.seckill_end_time),this.miao(res.data.err_msg.info.seckill_end_time))]
                //秒杀
                // res.data.err_msg.info.seckill_start_time = this.commonJs.timestampToTime(res.data.err_msg.info.seckill_start_time)
                // res.data.err_msg.info.seckill_end_time = this.commonJs.timestampToTime(res.data.err_msg.info.seckill_end_time)
                this.time_value = [this.commonJs.timestampToTime(res.data.err_msg.info.activity_start_time),this.commonJs.timestampToTime(res.data.err_msg.info.activity_end_time),]
                this.spikeName = res.data.err_msg.info.seckill_name
            } else {
            this.$message({
                showClose: true,
                message: res.data.err_msg,
                type: "error",
            });
            }
        });
    },
    shi(tim){
        return tim.split(":")[0]
    },
    fen(tim){
        return tim.split(":")[1]
    },
    miao(tim){
        if(tim.split(":").length > 2){
            return tim.split(":")[2]
        }else{
            return 0
        }
    },
    //停止
    stops(row){
        this.$confirm('此操作将停止此次限时秒杀, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            console.log(row.id)
            stop_seckill({
                seckill_id:row.id
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '停止成功',
                        type: 'success'
                    });
                    // this.get_agent_list();
                    this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }).catch(() => {
                    
        });
    },
    //单个删
    deletes(row){
        this.$confirm('此操作将删除此条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            console.log(row.id)
            del_seckill({
                seckill_id:row.id
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    // this.get_agent_list();
                    this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }).catch(() => {
                    
        });
    },

    //搜索
    pick_seach () {
      let that = this
      if(that.seach_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      market_seckill_product(
        {
          page : 1,
          page_size: 20,
          market_id : this.broad.market_id,
          seckill_id : this.broad.id,
          name:this.seach_value
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.activity_start_time = this.commonJs.timestampToTime(
                item.activity_start_time
              );
              item.activity_end_time = item.activity_end_time.split(" ")[0]
              item.activity_start_time = this.commonJs.timestampToTime(item.activity_start_time);
              item.activity_start_time = item.activity_start_time.split(" ")[0]
            });
            that.loading = false
            that.goodsList = res.data.err_msg.list
            that.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo1.page = parseInt(res.data.err_msg.page)
            that.queryInfo1.total = parseInt(res.data.err_msg.total_number)
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
    
    //搜索
    pick_seach2 () {
      
      if(this.product_name == '') {
        this.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      this.loading = true
      goods_list(
        {
          page : 1,
          page_size: 20,
          keyword : this.product_name,//模糊搜索id或商品名称
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false
            this.newGoodsList = res.data.err_msg.list
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size)
            this.queryInfo2.page = parseInt(res.data.err_msg.page)
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number)
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error);
        });
    },
    back(){
      this.listType = 1
      this.goodsList = []
    },
    //添加秒杀商品
    examines(){
        this.goods_ifShow = true
        this.types = 1
    },
     //添加商品
    examine () {
      this.goods_examine_change_ifShow = true
      this.goodList()
    },
    get_goods_list (index) {
      let that = this
      that.classification_value = []
      this.store_name = ""
      that.seach_value = ''
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20,
        market_id : this.broad.market_id,
        seckill_id : this.broad.id,
        //seckill_id
      }
      console.log(request_form)
      market_seckill_product(
        request_form
      )
        .then((res) => {
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.activity_start_time = this.commonJs.timestampToTime(
                item.activity_start_time
              );
              item.activity_end_time = item.activity_end_time.split(" ")[0]
              item.activity_start_time = this.commonJs.timestampToTime(item.activity_start_time);
              item.activity_start_time = item.activity_start_time.split(" ")[0]
            });
            that.loading = false
            that.goodsList = res.data.err_msg.list
            that.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo1.page = parseInt(res.data.err_msg.page)
            that.queryInfo1.total = parseInt(res.data.err_msg.total_number)
            if(index == 1) {
              that.$message({
                message: '刷新成功',
                type: 'success'
              });
            }
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
    //获取二级页面列表
    // get_goods_list (index) {
    //   let that = this
    //   that.classification_value = []
    //   this.store_name = ""
    //   that.seach_value = ''
    //   that.loading = true
    //   let request_form = {
    //     page : 1,
    //     page_size: 20,
    //     market_id : this.broad.market_id,
    //     seckill_id : this.broad.seckill_id,
    //   }
    //   console.log(request_form)
    //   market_seckill_product(
    //     request_form
    //   )
    //     .then((res) => {
    //       if (res.data.err_code == 0) {
    //         res.data.err_msg.list.forEach((item) => {
    //           item.activity_start_time = this.commonJs.timestampToTime(
    //             item.activity_start_time
    //           );
    //           item.activity_end_time = this.commonJs.timestampToTime(item.activity_end_time);
    //         });
    //         that.loading = false
    //         that.goodsList = res.data.err_msg.list
    //         that.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size)
    //         that.queryInfo1.page = parseInt(res.data.err_msg.page)
    //         that.queryInfo1.total = parseInt(res.data.err_msg.total_number)
    //         if(index == 1) {
    //           that.$message({
    //             message: '刷新成功',
    //             type: 'success'
    //           });
    //         }
    //       } else {
    //         that.loading = false
    //         that.$message({
    //           showClose: true,
    //           message: res.data.err_msg,
    //           type: 'error'
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       that.loading = false
    //       console.log(error);
    //     });
    // },
    //每页显示条数改变
    handleSizeChange1(val) {
      this.get_shop_list_page1(1,val)
    },

    //当前页
    handleCurrentChange1(val) {
      this.get_shop_list_page1(val,this.pageSize)
    },
    //分页
    
    get_shop_list_page1 (page , number) {
      let that = this
      that.loading = true
      market_seckill_product(
        {
            page : page,
            page_size: number,
            market_id : this.broad.market_id,
            seckill_id : this.broad.id,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.activity_start_time = this.commonJs.timestampToTime(
                item.activity_start_time
              );
              item.activity_end_time = item.activity_end_time.split(" ")[0]
              item.activity_start_time = this.commonJs.timestampToTime(item.activity_start_time);
              item.activity_start_time = item.activity_start_time.split(" ")[0]
            });
            that.loading = false
            that.goodsList = res.data.err_msg.list
            that.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo1.page = parseInt(res.data.err_msg.page)
            that.queryInfo1.total = parseInt(res.data.err_msg.total_number)
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
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
      console.log(val)
    },
    //当前页
    handleCurrentChange2(val) {
      this.get_shop_list_page2(val,this.pageSize)
    },
    //每页显示条数改变
    handleSizeChange2(val) {
      this.get_shop_list_page2(1,val)
    },
    //分页
    get_shop_list_page2 (page , number) {
      this.loading = true
      goods_list(
        {
          page : page,
          page_size: number,
          keyword : this.product_name,//模糊搜索id或商品名称
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false
            this.newGoodsList = res.data.err_msg.list
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size)
            this.queryInfo2.page = parseInt(res.data.err_msg.page)
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number)
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error);
        });
    },
    edit_ast(item){
        this.set_astrict_ifShow = true
        this.astrict = item.astrict
        this.commodity = item
    },
    edit_astrict(){
      
        if(this.astrict == '') {
            this.$message({
            message: '请选择任意一种搜索类型',
            type: 'warning'
            });
            return
        }
        this.loading = true
        console.log(this.broad)
        set_astrict({
            seckill_id:this.broad.seckill_id,
            astrict:this.astrict
        }).then((res) => {
            if (res.data.err_code == 0) {
                this.$message({
                    message: '修改限购数量成功',
                    type: 'success'
                });
                // this.get_goods_list()
                this.get_shop_list_page1(this.queryInfo1.page,this.queryInfo1.pageSize)
                this.set_astrict_ifShow = false
            } else {
                this.$message({
                    showClose: true,
                    message: res.data.err_msg,
                    type: "error",
                });
            }
        });

    },
    submit_saveChanges_level1(){
        if(this.astrict == '' || this.goodsInfo.image == "") {
            this.$message({
                message: '请完整填写选项',
                type: 'warning'
            });
            return
        }
        console.log(this.goodsInfo)
        if(this.types == 1){
            // 增加
            let arr = JSON.stringify(this.skuList)
            let data  = {
                market_id:this.broad.market_id,
                seckill_id:this.broad.id,
                product_id:this.multipleSelection2[0].product_id,
                astrict:this.astrict,
                sku_data:arr,

            }
            console.log(data)
            add_product1(data).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '秒杀商品添加成功',
                        type: 'success'
                    });
                    // this.get_goods_list()
                    this.get_shop_list_page1(this.queryInfo1.page,this.queryInfo1.pageSize)
                    this.goods_ifShow = false
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }else{
          let arr = JSON.stringify(this.skuList)
          let data  = {
                market_id:this.broad.market_id,
                seckill_id:this.broad.id,
                product_id:this.goodsInfo.product_id,
                astrict:this.astrict,
                sku_data:arr,

            }
            // 修改
            edit_product(data)
            .then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '秒杀商品修改成功',
                        type: 'success'
                    });
                    // this.get_goods_list()
                    this.get_shop_list_page1(this.queryInfo1.page,this.queryInfo1.pageSize)
                    this.goods_ifShow = false
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }
    },
    goodList(){
      this.loading = true
      goods_list({
        page : 1,
        page_size: 20
      })
      .then((res) => {
        console.log(res);
        if (res.data.err_code == 0) {
          this.loading = false
          this.newGoodsList = res.data.err_msg.list
          this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size)
          this.queryInfo2.page = parseInt(res.data.err_msg.page)
          this.queryInfo2.total = parseInt(res.data.err_msg.total_number)
        } else {
          this.loading = false
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
      .catch((error) => {
        this.loading = false
        console.log(error);
      });
    },
    add_pro(){
      if(this.multipleSelection2.length == 0) {
        this.$message({
          message: '请选择一种商品',
          type: 'warning'
        });
        return
      }
      if(this.multipleSelection2.length > 1) {
        this.$message({
          message: '一次目前只能选择一种商品',
          type: 'warning'
        });
        return
      }
      
      choice_product({
          product_id:this.multipleSelection2[0].product_id,
      }).then((res) => {
          if (res.data.err_code == 0) {
              this.$message({
                  message: '商品选择成功',
                  type: 'success'
              });
              this.goods_examine_change_ifShow = false
              this.goodsInfo = res.data.err_msg.info
              this.skuList = res.data.err_msg.info.sku
              
          } else {
              this.$message({
                  showClose: true,
                  message: res.data.err_msg,
                  type: "error",
              });
          }
      });
    },
    closeIcon(){
        this.$confirm('此操作将清空此条商品数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.goodsInfo = {
              image:""
            }
            this.skuList = []
        }).catch(() => {
                    
        });
    },
    deletes1(row){
      console.log(row)
      this.$confirm('此操作将清空此条秒杀商品数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            del_product1({
              seckill_id:this.broad.id,
              product_id:row.product_id,
           }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '删除秒杀商品成功',
                        type: 'success'
                    });
                    // this.get_goods_list()
                    this.get_shop_list_page1(this.queryInfo1.page,this.queryInfo1.pageSize)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }).catch(() => {
                    
           
        });
    },
    edit(item){
      
      
      goods_info_product({
        product_id:item.product_id,
      }).then((res) => {
        console.log(res)
          if (res.data.err_code == 0) {
              this.goodsInfo = res.data.err_msg.list.product_info
          } else {
              this.$message({
                  showClose: true,
                  message: res.data.err_msg,
                  type: "error",
              });
          }
      });
      product_info({
        seckill_id:item.seckill_id,
        product_id:item.product_id,
      }).then((res) => {
          if (res.data.err_code == 0) {
              this.goods_ifShow = true
              this.skuList = res.data.err_msg.info.sku
              this.types = 2
              this.astrict = res.data.err_msg.info.astrict
          } else {
              this.$message({
                  showClose: true,
                  message: res.data.err_msg,
                  type: "error",
              });
          }
      });
    }
  }
};
</script>

<style scoped lang="less">

.tableDiv{
  height: 300px;
  overflow-y: auto;
}
.divImg{
  width: 150px;
  position: relative;
  .icon{
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    color: #bbb;
    font-size: 20px;
    cursor: pointer;
  }
  .icon:hover{
    color: #409eff;
  }
}
.box{
  max-height: 500px;
  overflow-y: auto;
}
.page {
  padding: 15px 15px 0;
}
.seach {
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
  width: 60%;
}
/deep/ .el-form-item__label {
  text-align-last: justify;
}
/deep/ .el-dialog__body {
  padding: 30px 50px;
}
</style>
