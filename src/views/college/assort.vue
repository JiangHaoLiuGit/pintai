<template>
  <div class="page">
    <div class="topHead clearfix">
      <s class="lt"></s>
      <span class="lt">商品分组</span>
    </div>
    <div class="seach">
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="keywords"
            placeholder="请输入分组ID/分组名称"
            clearable
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach1">搜索</el-button>
          <el-button type="primary" @click="pick_add">增加</el-button>
          <el-button type="primary" @click="pick_delete">删除</el-button>
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
          :height="height"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="序号" type="index"> </el-table-column>
          <el-table-column prop="name" label="分类名称"></el-table-column>
          <el-table-column label="分类ID" prop="category_id"></el-table-column>
          <el-table-column label="所属分类" prop="p_name"></el-table-column>
          <el-table-column label="排序" width="120">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.sort"
                @blur="likai1(scope.row)"
                placeholder="请输入序号"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="文章数量"
            prop="article_num"
          ></el-table-column>
          <el-table-column label="创建时间" prop="create_time">
          </el-table-column>
          <el-table-column label="图标" width="120">
            <template slot-scope="scope">
              <el-image
                style="width: 80px; height: 80px"
                :src="scope.row.icon"
                :preview-src-list="[scope.row.icon]"
                fit="cover"
              >
              </el-image>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="deletes(scope.row)"
                >删除</el-button
              >
              <el-button size="mini" type="warning" @click="modify(scope.row)"
                >修改</el-button
              >
              <el-button size="mini" type="primary" @click="primary(scope.row)"
                >管理</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
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
    <!-- 修改,删除弹窗 -->
    <el-dialog
      width="30%"
      :visible.sync="opening_change_ifShow"
      class="remarks_box add"
    >
      <div class="info" v-if="type == 1">增加分组</div>
      <div class="info" v-else>修改分组</div>
      <!-- <h2 style="margin-top:0;" v-if="type == 1">增加营销分类</h2>
                    <h2 style="margin-top:0;" v-else-if="type == 2">修改营销分类</h2> -->
      <el-form :model="form">
        <!-- <div style="position:relative"> -->
        <el-form-item label="分组名称" :label-width="formLabelWidth">
          <el-input
            v-model="form.live_id"
            placeholder="请输入新增分组名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="类型:" :label-width="formLabelWidth">
          <el-select
            v-model="form.level"
            class="el-inpu"
            placeholder="请选择分组类型"
          >
            <el-option
              v-for="item in levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="配图:"
          class="clearfix"
          :label-width="formLabelWidth"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="form.img_url"
            fit="cover"
            class="lt"
          >
            <div
              slot="error"
              class="image-slot"
              style="
                width: 98px;
                height: 98px;
                text-align: center;
                border: 1px solid #bbb;
              "
            >
              <i
                class="el-icon-picture-outline"
                style="font-size: 25px; margin-top: 32px"
              ></i>
            </div>
          </el-image>
          <el-upload
            class="upload-demo lt"
            action=""
            :http-request="img_upload1"
            :before-upload="img_beforeUpload1"
            :show-file-list="false"
            list-type="picture"
            style="margin-bottom: 20px"
          >
            <el-button size="small" type="primary" style="margin-top: 70px"
              >上传</el-button
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <div></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="opening_change_ifShow = false">取 消</el-button>
        <div v-if="type == 1" style="display: inline-block">
          <el-button type="success" @click="submit_saveChanges_level"
            >增加</el-button
          >
        </div>

        <div v-else-if="type == 2" style="display: inline-block">
          <el-button type="warning" @click="submit_saveChanges_level"
            >修改</el-button
          >
        </div>
      </div>
    </el-dialog>
    <!-- 添加商品弹窗 -->
    <el-dialog
      class="remarks_box add"
      :visible.sync="goods_examine_change_ifShow"
    >
      <div class="info">分类管理</div>
      <div class="seach" style="margin-top: 20px; padding-left: 20px">
        <span class="seachSpan">
          当前所属分类:{{ seeInfo.name }}
          <span v-if="seeInfo.p_name">>{{ seeInfo.p_name }}</span>
        </span>
        <!-- <span class="seachSpan">
            
            使用位置:<span v-for="(item1,index1) in seeInfo.position.category_position" :key="index1">商品分类 >> {{item1}}</span>
              <span>
                <span v-for="(item,index) in seeInfo.position.index_position" :key="index">首页推荐 >> {{item}}</span>
              </span>
          </span>
          <span class="seachSpan">
            商品数量:{{seeInfo.product_num}}
          </span> -->
      </div>
      <div
        class="seach_copy"
        style="padding: 20px 30px 0 10px; margin-bottom: 0"
      >
        <div class="seach_select">
          <el-select
            v-model="classification_value2"
            class="el-inpu"
            placeholder="请选择分组类型"
          >
            <el-option
              v-for="item in classification_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach2">搜索</el-button>

          <el-button size="mini" type="primary" @click="add_pro()"
            >添加文章</el-button
          >
        </div>
      </div>
      <div class="box" style="padding: 20px 20px 0">
        <el-row :gutter="20" class="goodsindex-list" style="margin: 0">
          <el-col :span="24" style="padding: 0">
            <el-table
              v-loading="loading"
              :data="newGoodsList"
              ref="interfaceTable"
              border
              height="500"
              style="width: 100%"
              @selection-change="handleSelectionChange2"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column label="序号" type="index" width="100">
              </el-table-column>
              <el-table-column prop="article_id" label="文章ID">
              </el-table-column>
              <el-table-column label="分类名称">
                <template slot-scope="scope">
                  {{ scope.row.p_name }}
                  {{ scope.row.name ? ">>" + scope.row.name : "" }}
                </template>
              </el-table-column>
              <el-table-column label="入口展示" width="180">
                <template slot-scope="scope">
                  <el-image
                    :src="scope.row.image_url"
                    style="width: 80px; height: 80px"
                    :preview-src-list="[scope.row.image_url]"
                    fit="cover"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="标题"> </el-table-column>
              <el-table-column prop="create_time" label="创建时间">
              </el-table-column>
              <!-- <el-table-column prop="quantity" label="发布时间">
              </el-table-column> -->
              <el-table-column label="排序" width="120">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.sort"
                    @blur="likai(scope.row)"
                    placeholder="请输入序号"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <!-- 分页 -->
      <el-row
        :gutter="20"
        class="goodsindex-list"
        style="margin: 0; padding: 0 20px 20px"
      >
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
  </div>
</template>

<script>
import {
  article_category_list,
  cate_add,
  article_category_del,
  upload_img,
  article_category_sort,
  relation_sort,
  article_category_relation_list,
  article_category_relation,
  p_category,
} from "../../utils/axios";
export default {
  data() {
    return {
      opening_change_ifShow: false,
      broadId: "",
      extendList: [], //列表
      goodsList: [], //列表
      fn1: this.commonJs.Debounce(this.get_agent_list),
      fn2: this.commonJs.Debounce(this.get_goods_list),
      queryInfo: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      pageSize: 20,
      queryInfo1: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      queryInfo2: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      wenNum: 0,
      wenList: [],
      classification_value2: "",
      classification_list: [
        {
          value: "1",
          label: "全部",
        },
        {
          value: "2",
          label: "已添加",
        },
        {
          value: "3",
          label: "未添加",
        },
      ],
      seeInfo: {
        name: "",
        p_name: "",
      },
      level: "",
      levelList: [
        {
          value: "1",
          label: "普通",
        },
      ],
      goods_examine_change_ifShow: false,
      height: "",
      multipleSelection: [],
      other_img_upload_err: false,
      form: {
        live_id: "",
        level: "",
        img_url: "",
      },
      formLabelWidth: "80px",
      formLabelWidth1: "120px",
      //申請人姓名
      keywords: "",
      type: 1,
      loading: false,
      opening_change_ifShow: false,
      broad: {
        id: "1",
        market_id: "12",
      },
      market_id: "",
      newGoodsList: [],
      multipleSelection2: [],
      //未添加按钮
      weiBlean: false,
      goodsArrList: [],
    };
  },
  watch: {
    goods_examine_change_ifShow: {
      handler: function (news, olds) {
        if (!news) {
          this.classification_value2 = "";
        } else {
        }
      },
      deep: true, //true 深度监听
      immediate: true,
    },
  },
  //
  //
  created() {
    this.get_agent_list();
    this.relation_list();
    this.height = document.body.clientHeight - 300;
  },
  methods: {
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    likai1(row) {
      console.log(row);
      if (row.sort < 0) {
        return;
      }
      article_category_sort({
        category_id: row.category_id,
        sort: row.sort,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "排序成功",
            type: "success",
          });
          this.get_shop_list_page(this.queryInfo.page, this.queryInfo.pageSize);
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    modify(item) {
      this.opening_change_ifShow = true;
      console.log(item);
      this.form.level = "";
      //   cate_info({
      //     id: item.id,
      //   }).then((res) => {
      //     if (res.data.err_code == 0) {
      this.type = 2;
      this.broadId = item.category_id;
      this.form.live_id = item.name;
      this.form.img_url = item.icon;
      this.levelList.forEach((ttt) => {
        if (ttt.label == item.p_name) {
          this.form.level = ttt.value;
        }
      });
      console.log(this.form);
      //     } else {
      //       this.$message({
      //         showClose: true,
      //         message: res.data.err_msg,
      //         type: "error",
      //       });
      //     }
      //   });
    },
    pick_add(index) {
      this.opening_change_ifShow = true;
      this.type = 1;
    },

    //单个删
    deletes(row) {
      this.$confirm("此操作将删除此条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(row.category_id);
          article_category_del({
            category_id: row.category_id,
          }).then((res) => {
            if (res.data.err_code == 0) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.relation_list();
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
          });
        })
        .catch(() => {});
    },
    //批量
    pick_delete() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择数据",
          type: "error",
        });
        return;
      }
      this.$confirm("此操作将删除选中的多条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let str = "";
          this.multipleSelection.forEach((element) => {
            if (str == "") {
              str += element.category_id;
            } else {
              str += "," + element.category_id;
            }
          });
          console.log(str);
          article_category_del({
            category_id: str,
          }).then((res) => {
            if (res.data.err_code == 0) {
              this.$message({
                message: "批量删除成功",
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
          });
        })
        .catch(() => {});
    },
    submit_saveChanges_level() {
      if (this.form.live_id == "" || this.form.img_url == "") {
        this.$message({
          message: "请完整填写选项",
          type: "warning",
        });
        return;
      }
      if (this.type == 1) {
        //增加
        cate_add({
          name: this.form.live_id,
          pid: this.form.level,
          icon: this.form.img_url,
        }).then((res) => {
          if (res.data.err_code == 0) {
            this.$message({
              message: "增加成功",
              type: "success",
            });
            console.log(this.queryInfo);
            this.relation_list();
            this.get_shop_list_page(
              this.queryInfo.page,
              this.queryInfo.pageSize
            );
            this.opening_change_ifShow = false;
          } else {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        });
      } else {
        //修改
        console.log(this.form);
        cate_add({
          category_id: this.broadId,
          name: this.form.live_id,
          pid: this.form.level,
          icon: this.form.img_url,
        }).then((res) => {
          if (res.data.err_code == 0) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.relation_list();
            this.get_shop_list_page(
              this.queryInfo.page,
              this.queryInfo.pageSize
            );
            this.opening_change_ifShow = false;
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
    relation_list() {
      p_category()
        .then((res) => {
          if (res.data.err_code == 0) {
            this.levelList = [
              {
                value: "",
                label: "空",
              },
            ];
            res.data.err_msg.forEach((item, index) => {
              let obj = {
                value: item.category_id,
                label: item.name,
              };
              this.levelList.push(obj);
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
          this.loading = false;
          console.log(error);
        });
    },
    //加载第一页
    get_agent_list(index) {
      this.keywords = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      article_category_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item, index) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
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
    //每页显示条数改变
    handleSizeChange(val) {
      this.get_shop_list_page(1, val);
    },
    //当前页
    handleCurrentChange(val) {
      this.get_shop_list_page(val, this.pageSize);
    },
    //分页

    get_shop_list_page(page, number) {
      let that = this;
      that.loading = true;

      article_category_list({
        page: page,
        page_size: number,
        keywords: that.keywords,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item, index) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
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
            //
          }
        })
        .catch((error) => {
          that.loading = false;
          console.log(error);
        });
    },
    //搜索
    pick_seach1() {
      let that = this;
      if (that.keywords == "") {
        that.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      article_category_list({
        page: 1,
        page_size: 20,
        keywords: that.keywords,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item, index) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
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
    //上传图片
    img_upload1: function (item) {
      console.log(item);
      let that = this;
      if (this.other_img_upload_err == false) {
        let fd = new FormData();
        fd.append("file", item.file);
        console.log(fd.get("file"));
        upload_img(fd)
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.form.img_url = res.data.err_msg.url;
            } else {
              that.$message({
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
    },

    //上传图片之前
    img_beforeUpload1(file) {
      console.log(file);
      if (
        file.type != "image/jpeg" &&
        file.type != "image/jpg" &&
        file.type != "image/png" &&
        file.type != "image/gif" &&
        file.type != "image/JPEG" &&
        file.type != "image/JPG" &&
        file.type != "image/PNG" &&
        file.type != "image/GIF"
      ) {
        this.$message.error("请上传图片格式!");
        this.other_img_upload_err = true;
      } else if (file.size / 1024 / 1024 > 200) {
        this.$message.error("图片大小不能超过 200MB!");
        this.other_img_upload_err = true;
      }
    },
    primary(item) {
      this.wenNum = item.article_num;
      this.seeInfo = item;
      this.goods_examine_change_ifShow = true;
      this.goodList();
      
      console.log(this.wenNum)
    },
    likai(row) {
      if (row.sort < 0) {
        return;
      }
      relation_sort({
        relation_id: row.relation_id,
        sort: row.sort,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "排序成功",
            type: "success",
          });

          this.get_shop_list_page2(
            this.queryInfo2.page,
            this.queryInfo2.pageSize
          );
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    //文章加载
    goodList(tex) {
      this.goodsArrList = [];
      this.loading = true;
      
      //全部
      article_category_relation_list({
        page: 1,
        page_size: 20,
        type: 1,
        category_id: this.seeInfo.category_id,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((item, index) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
            });
            this.newGoodsList = res.data.err_msg.list;
            setTimeout(() => {
              this.newGoodsList.forEach((item, index) => {
                if (item.is_exist == 1) {
                  console.log(this.newGoodsList[index]);
                  this.$refs.interfaceTable.toggleRowSelection(
                    this.newGoodsList[index]
                  );
                }
              });
            }, 200);
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
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
      //已经添加
      article_category_relation_list({
        page: 1,
        page_size: this.wenNum,
        type: 2,
        category_id: this.seeInfo.category_id,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.wenList = [];
            res.data.err_msg.list.forEach((item, index) => {
              this.wenList.push(item.article_id);
            });
            console.log(this.wenList);
            // this.wenList = res.data.err_msg.list;
          } else {
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
      this.multipleSelection2.forEach((item, index) => {
        this.goodsArrList.push(item);
      });
      console.log(this.goodsArrList);
      this.loading = true;
      article_category_relation_list({
        page: page,
        page_size: number,
        type: this.classification_value2,
        category_id: this.seeInfo.category_id,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((item, index) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
            });

            this.newGoodsList = res.data.err_msg.list;
            setTimeout(() => {
              this.newGoodsList.forEach((item, index) => {
                if (item.is_exist == 1) {
                  console.log(this.newGoodsList[index]);
                  this.$refs.interfaceTable.toggleRowSelection(
                    this.newGoodsList[index]
                  );
                }
              });
            }, 200);
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
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
    handleSizeChange2(val) {
      this.get_shop_list_page2(1, val);
    },

    //当前页
    handleCurrentChange2(val) {
      this.get_shop_list_page2(val, this.pageSize);
    },

    //搜索文章
    pick_seach2() {
      let that = this;
      if (this.classification_value2 == "") {
        this.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      this.loading = true;
      article_category_relation_list({
        page: 1,
        page_size: 20,
        type: this.classification_value2,
        category_id: this.seeInfo.category_id,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((item, index) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
            });
            if (this.classification_value2 == 3) {
              this.weiBlean = true;
            } else {
              this.weiBlean = false;
            }
            setTimeout(() => {
              this.newGoodsList.forEach((item, index) => {
                if (item.is_exist == 1) {
                  console.log(this.newGoodsList[index]);
                  this.$refs.interfaceTable.toggleRowSelection(
                    this.newGoodsList[index]
                  );
                }
              });
            }, 200);
            this.newGoodsList = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
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
    //添加文章
    add_pro() {
      this.multipleSelection2.forEach((item, index) => {
        this.goodsArrList.push(item);
      });
      console.log(this.goodsArrList);
      var result = [];
      var obj = {};
      for (var i = 0; i < this.goodsArrList.length; i++) {
        if (!obj[this.goodsArrList[i].article_id]) {
          result.push(this.goodsArrList[i]);
          obj[this.goodsArrList[i].article_id] = true;
        }
      }
      var str = "";
      result.forEach((element) => {
        if (str == "") {
          str += element.article_id;
        } else {
          str += "," + element.article_id;
        }
      });

      if (this.weiBlean) {
        this.wenList.forEach((item) => {
          if (str == "") {
            str += item;
          } else {
            str += "," + item;
          }
        });
      }
      str = str.split(",")
      str = [...new Set(str)]
      let newStr = ''
      for(let i = 0 ; i < str.length ; i ++ ){
        if (newStr == "") {
            newStr += str[i];
          } else {
            newStr += "," + str[i];
          }
      }
      article_category_relation({
        article_id: newStr,
        category_id: this.seeInfo.category_id,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "批量添加成功",
            type: "success",
          });
          this.goods_examine_change_ifShow = false;
          this.classification_value2 = "";
          this.get_shop_list_page(this.queryInfo.page, this.queryInfo.pageSize);
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
  padding-top: 15px;
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
  width: 80%;
}
/deep/ .block .el-dialog {
  width: 30%;
}
/deep/ .el-form-item__label {
  text-align-last: justify;
}
/deep/ .el-dialog__body {
  padding: 30px 50px;
}
/deep/ .teshu .el-dialog {
  width: 30%;
}
/deep/ .el-dialog__body {
  padding: 0 0;
  .el-form {
    padding: 50px;
  }
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
.seachSpan {
  color: #f49c3e;
  font-size: 20px;
  margin-right: 60px;
}
</style>