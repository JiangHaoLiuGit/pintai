<template>
  <div class="page">
    <div class="seach"></div>
    <div class="seach_copy">
      <div class="seach_select">
        <el-input
          v-model="seach_value1"
          placeholder="请输入商品名称"
        ></el-input>
        <el-cascader
          placeholder="请选择商品分类"
          v-model="classification_value1"
          :options="classification_list1"
          :props="{ expandTrigger: 'hover', checkStrictly: true }"
          @change="pick_cate_change1"
        ></el-cascader>
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
        <el-button type="primary" @click="pick_seach">搜索</el-button>
        <el-button type="primary" icon="el-icon-back" @click="back"
          >返回</el-button
        >
        <el-button size="mini" type="primary" @click="examines()"
          >添加商品</el-button
        >
        <el-button type="primary" icon="el-icon-refresh" @click="fn2(1)"
          >刷新</el-button
        >
        <el-button type="primary" @click="edit_ast()">修改限购</el-button>
        <el-button type="primary" @click="edit_time1()">修改特价时间</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="goodsList1"
          border
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" width="100">
          </el-table-column>
          <el-table-column prop="name" label="商品名称" width="100">
          </el-table-column>

          <el-table-column prop="price" label="商品售价"> </el-table-column>
          <el-table-column prop="special_price" label="特价价格">
          </el-table-column>
          <el-table-column prop="special_inventory" label="特价库存">
          </el-table-column>
          <el-table-column prop="astrict" label="限购数量"> </el-table-column>
          <el-table-column prop="start_time" label="特价开始时间">
          </el-table-column>
          <el-table-column prop="end_time" label="特价结束时间">
          </el-table-column>
          <el-table-column prop="product_id" label="商品id"> </el-table-column>
          <el-table-column prop="time" label="特价时间（分钟）">
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="edit(scope.row)"
                >修改</el-button
              >

              <el-button size="mini" type="danger" @click="deletes1(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      :title="types == 1 ? '添加商品' : '修改商品'"
      :visible.sync="goods_ifShow"
    >
      <div style="float: left">
        <div class="divImg" v-if="goodsInfo.image != ''">
          <el-image :src="goodsInfo.image" style="width: 150px" fit="cover">
          </el-image>
          <i class="el-icon-delete icon" @click="closeIcon"></i>
        </div>
        <el-button size="mini" type="primary" @click="examine" v-else
          >选择</el-button
        >
      </div>

      <div style="float: left; padding-left: 200px; padding-bottom: 30px">
        <h3 style="margin-top: 0">限购数量</h3>
        <el-input v-model="astrict" placeholder="请输入限购数量"></el-input>
      </div>
      <h3 class="clearfix" style="clear: both">商品信息设置</h3>
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
              <el-table-column prop="properties" label="商品属性">
              </el-table-column>
              <el-table-column prop="price" label="原价"> </el-table-column>
              <el-table-column label="秒杀价格">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.special_price"
                    placeholder="请输入价格"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="商品库存">
              </el-table-column>
              <el-table-column label="秒杀库存">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.special_inventory"
                    placeholder="请输入秒杀库存"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="property" label="规格值数组">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <h3>特价时间</h3>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="goods_ifShow = false">取 消</el-button>
        <div v-if="types == 1" style="display: inline-block">
          <el-button type="primary" @click="submit_saveChanges_level1"
            >增加</el-button
          >
        </div>

        <div v-else-if="types == 2" style="display: inline-block">
          <el-button type="primary" @click="submit_saveChanges_level1"
            >修改</el-button
          >
        </div>
      </div>
    </el-dialog>

    <!-- 添加商品弹窗 -->
    <el-dialog title="添加商品" :visible.sync="goods_examine_change_ifShow">
      <div class="seach"></div>
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="product_name"
            placeholder="请输入商品ID/商品名称/店铺名称"
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach2">搜索</el-button>

          <el-button size="mini" type="primary" @click="add_pro"
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
              :data="newGoodsLion"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange2"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column label="序号" type="index" width="100">
              </el-table-column>
              <el-table-column prop="name" label="商品名称" width="100">
              </el-table-column>
              <el-table-column label="商品图片" width="180">
                <template slot-scope="scope">
                  <el-image :src="scope.row.image" fit="cover"></el-image>
                </template>
              </el-table-column>

              <el-table-column prop="price" label="商品售价"> </el-table-column>

              <el-table-column prop="quantity" label="商品库存">
              </el-table-column>
              <el-table-column prop="store_name" label="店铺名称">
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
            :current-page="queryInfo4.page"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="queryInfo4.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryInfo4.total"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="修改限购熟数量" :visible.sync="set_astrict_ifShow">
      <el-input v-model="astrict" placeholder="请输入商品名称"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="set_astrict_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="edit_astrict">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改特价时间" :visible.sync="set_time_ifShow">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="set_time_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="edit_time">修改</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24" class="goodsindex-page-box">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
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
</template>

<script>
import {
  goods_list,
  product_set_astrict,
  del_product2,
  update_product,
  add_product2,
  choice_product,
  goods_info_product,
  product_info1,
  market_special_product,
  goods_get_cate,
  set_time,
} from "../../utils/axios";
export default {
  data() {
    return {
      seach_value1: "",
      goods_ifShow: false,
      goods_examine_change_ifShow: false,
      fn2: this.commonJs.Debounce(this.get_goods_list),
      opening_change_ifShow: false,
      multipleSelection2: "",
      goodsList1: [],
      product_name: "",
      newGoodsLion: [],
      queryInfo4: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      queryInfo3: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      set_astrict_ifShow: false,
      astrict: "",
      skuList: [],
      types: 1,
      goodsInfo: {
        image: "",
      },
      commodity: {},
      broad: {
        id: "1",
        market_id: "12",
      },
      classification_value1: [],
      classification_list1: [], //商品分类列表
      time_value: "",
      time_value1: "",
      market_id: "11",
      set_time_ifShow: false,
      time_value2: "",
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
  watch: {
    opening_change_ifShow: {
      handler(newVal) {
        console.log(newVal);
        if (!newVal) {
        }
      },
    },
  },
  created() {
    this.get_goods_list();
    this.get_cate1(); //获取商品三级分类
  },
  methods: {
    // 获取商品三级分类
    get_cate1() {
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
                  that.classification_list1.push({
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
                      that.classification_list1[first_index].children =
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
                            that.classification_list1[first_index].children
                              .length - 1;
                          that.classification_list1[first_index].children[
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
    pick_cate_change1(value) {
      this.classification_value1 = value;
      console.log(this.classification_value1);
    },
    //搜索
    pick_seach() {
      let that = this;
      if (
        that.seach_value1 == "" &&
        that.time_value.length == 0 &&
        that.classification_value1.length == 0
      ) {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      var time1 = "";
      var time2 = "";
      console.log(this.time_value);
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      market_special_product({
        page: 1,
        page_size: 20,
        category_fid: this.classification_value1[0],
        category_id: this.classification_value1[1],
        category_tid: this.classification_value1[2],
        keys: this.seach_value1,
        start_time: time1,
        end_time: time2,
        market_id: this.market_id,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.activity_start_time = this.commonJs.timestampToTime(
                item.activity_start_time
              );
              item.activity_end_time = this.commonJs.timestampToTime(
                item.activity_end_time
              );
            });
            that.loading = false;
            that.goodsList1 = res.data.err_msg.list;
            that.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            that.queryInfo3.page = parseInt(res.data.err_msg.page);
            that.queryInfo3.total = parseInt(res.data.err_msg.total_number);
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

    //搜索
    pick_seach2() {
      if (this.product_name == "") {
        this.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      this.loading = true;
      goods_list({
        page: 1,
        page_size: 20,
        keyword: this.product_name, //模糊搜索id或商品名称
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            this.newGoodsLion = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
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
    back() {
      this.listType = 1;
      this.goodsList1 = [];
    },
    //添加秒杀商品
    examines() {
      this.goods_ifShow = true;
      this.types = 1;
    },
    //添加商品
    examine() {
      this.goods_examine_change_ifShow = true;
      this.goodList();
    },
    get_goods_list(index) {
      let that = this;
      that.classification_value1 = [];
      this.store_name = "";
      that.seach_value1 = "";
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
        market_id: this.market_id,
      };

      console.log(request_form);
      market_special_product(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.start_time = this.commonJs.timestampToTime(item.start_time);
              item.end_time = this.commonJs.timestampToTime(item.end_time);
            });
            that.loading = false;
            that.goodsList1 = res.data.err_msg.list;
            that.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            that.queryInfo3.page = parseInt(res.data.err_msg.page);
            that.queryInfo3.total = parseInt(res.data.err_msg.total_number);
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

    //每页显示条数改变
    handleSizeChange1(val) {
      this.get_shop_list_page1(1, val);
    },

    //当前页
    handleCurrentChange1(val) {
      this.get_shop_list_page1(val, that.queryInfo3.pageSize);
    },
    //分页
    get_shop_list_page1(page, number) {
      let that = this;
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      market_special_product({
        page: page,
        page_size: number,
        category_fid: this.classification_value1[0],
        category_id: this.classification_value1[1],
        category_tid: this.classification_value1[2],
        keys: this.seach_value1,
        start_time: time1,
        end_time: time2,
        market_id: this.market_id,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.activity_start_time = this.commonJs.timestampToTime(
                item.activity_start_time
              );
              item.activity_end_time = this.commonJs.timestampToTime(
                item.activity_end_time
              );
            });
            that.loading = false;
            that.goodsList1 = res.data.err_msg.list;
            that.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            that.queryInfo3.page = parseInt(res.data.err_msg.page);
            that.queryInfo3.total = parseInt(res.data.err_msg.total_number);
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
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
      console.log(val);
    },
    //当前页
    handleCurrentChange2(val) {
      this.get_shop_list_page2(val, this.queryInfo4.pageSize);
    },
    //每页显示条数改变
    handleSizeChange2(val) {
      this.get_shop_list_page2(1, val);
    },
    //分页
    get_shop_list_page2(page, number) {
      this.loading = true;
      goods_list({
        page: page,
        page_size: number,
        keyword: this.product_name, //模糊搜索id或商品名称
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            this.newGoodsLion = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
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
    edit_ast(item) {
      this.set_astrict_ifShow = true;
      // this.astrict = item.astrict
      // this.commodity = item
    },
    edit_time1(item) {
      this.set_time_ifShow = true;
      // this.astrict = item.astrict
    },
    edit_astrict() {
      if (this.astrict == "") {
        this.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      this.loading = true;
      product_set_astrict({
        market_id: this.market_id,
        astrict: this.astrict,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "修改限购数量成功",
            type: "success",
          });
          this.get_goods_list();
          this.set_astrict_ifShow = false;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    edit_time() {
      if (this.time_value1.length == 0) {
        this.$message({
          message: "请选择任意一种搜索类型",
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
      set_time({
        market_id: this.market_id,
        start_time: time1,
        end_time: time2,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "修改特价时间成功",
            type: "success",
          });

          this.set_time_ifShow = false;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    submit_saveChanges_level1() {
      if (
        this.astrict == "" ||
        this.goodsInfo.image == "" ||
        this.time_value2.length == 0
      ) {
        this.$message({
          message: "请完整填写选项",
          type: "warning",
        });
        return;
      }
      console.log(this.goodsInfo);
      if (this.types == 1) {
        // 增加
        let arr = JSON.stringify(this.skuList);
        var time1 = "";
        var time2 = "";
        if (this.time_value2 != "") {
          time1 = this.commonJs.newDataTime(this.time_value2[0]);
          time2 = this.commonJs.newDataTime(this.time_value2[1]);
        }
        let data = {
          market_id: this.market_id,
          product_id: this.multipleSelection2[0].product_id,
          astrict: this.astrict,
          sku_data: arr,
          start_time: time1,
          end_time: time2,
        };
        add_product2(data).then((res) => {
          if (res.data.err_code == 0) {
            this.$message({
              message: "秒杀商品添加成功",
              type: "success",
            });
            this.get_goods_list();
            this.goods_ifShow = false;
          } else {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        });
      } else {
        let arr = JSON.stringify(this.skuList);
        //   that.time_value.length == 0
        var time1 = "";
        var time2 = "";
        if (this.time_value2 != "") {
          time1 = this.commonJs.newDataTime(this.time_value2[0]);
          time2 = this.commonJs.newDataTime(this.time_value2[1]);
        }
        let data = {
          market_id: this.market_id,
          product_id: this.goodsInfo.product_id,
          start_time: time1,
          end_time: time2,
          astrict: this.astrict,
          sku_data: arr,
        };
        // 修改
        update_product(data).then((res) => {
          if (res.data.err_code == 0) {
            this.$message({
              message: "秒杀商品修改成功",
              type: "success",
            });
            this.get_goods_list();
            this.goods_ifShow = false;
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
    goodList() {
      this.loading = true;
      goods_list({
        page: 1,
        page_size: 20,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            this.newGoodsLion = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
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
    add_pro() {
      if (this.multipleSelection2.length == 0) {
        this.$message({
          message: "请选择一种商品",
          type: "warning",
        });
        return;
      }
      if (this.multipleSelection2.length > 1) {
        this.$message({
          message: "一次目前只能选择一种商品",
          type: "warning",
        });
        return;
      }

      choice_product({
        product_id: this.multipleSelection2[0].product_id,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "商品选择成功",
            type: "success",
          });
          this.goods_examine_change_ifShow = false;
          this.goodsInfo = res.data.err_msg.info;
          this.skuList = res.data.err_msg.info.sku;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    closeIcon() {
      this.$confirm("此操作将清空此条商品数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.goodsInfo = {
            image: "",
          };
          this.skuList = [];
        })
        .catch(() => {});
    },
    deletes1(row) {
      console.log(row);
      this.$confirm("此操作将清空此条秒杀商品数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del_product2({
            market_id: this.market_id,
            product_id: row.product_id,
          }).then((res) => {
            if (res.data.err_code == 0) {
              this.$message({
                message: "删除秒杀商品成功",
                type: "success",
              });
              this.get_goods_list();
            } else {
              this.$message({
                showClose: true,
                message: res.data.err_msg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {});
    },
    edit(item) {
      goods_info_product({
        product_id: item.product_id,
      }).then((res) => {
        console.log(res);
        if (res.data.err_code == 0) {
          this.goodsInfo = res.data.err_msg.list.product_info;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
      product_info1({
        market_id: this.market_id,
        product_id: item.product_id,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.goods_ifShow = true;
          this.skuList = res.data.err_msg.info.sku;
          let time1 = this.commonJs.timestampToTime(
            parseInt(res.data.err_msg.info.start_time)
          );

          let time2 = this.commonJs.timestampToTime(
            parseInt(res.data.err_msg.info.end_time)
          );
          time1 = time1.split(" ")[0];
          time2 = time2.split(" ")[0];
          //1628493804

          this.time_value2 = [time1, time2];
          //   this.time_value2 = [this.commonJs.newTimestampToTime(res.data.err_msg.info.start_time),this.commonJs.newTimestampToTime(res.data.err_msg.info.end_time)]
          //   console.log(this.time_value2)
          //   this.commonJs.dataTime(this.time_value2[0])
          this.types = 2;
          this.astrict = res.data.err_msg.info.astrict;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.divImg {
  width: 150px;
  position: relative;
  .icon {
    position: absolute;
    top: 0;
    right: -25px;
    z-index: 10;
    color: #bbb;
    font-size: 20px;
    cursor: pointer;
  }
  .icon:hover {
    color: #409eff;
  }
}
.box {
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