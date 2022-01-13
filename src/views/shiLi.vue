<template>
  <div class="page">
    <div class="pageItem">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">问题收录</span>
      </div>
      <div class="textItem">
        <div class="clearfix" style="margin-bottom: 20px">
          <el-input
            class="lt marginRight"
            style="width: 300px"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            @keyup.enter.native="pick_seach"
            v-model="seachVale"
          >
          </el-input>
          <el-select v-model="shen_status" class="marginRight lt" placeholder="请选择审核状态">
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

          <el-button type="danger" class="rt" @click="shan">删除</el-button>
          <el-button
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
          >
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
              <el-table-column prop="create_time" label="提交申请时间"> </el-table-column>
              <el-table-column prop="nickname" label="申请人昵称"> </el-table-column>
              <el-table-column prop="account" label="申请人账号"> </el-table-column>
              <el-table-column prop="uid" label="UID"> </el-table-column>
              <el-table-column prop="name" label="申请人姓名"> </el-table-column>
              <el-table-column prop="id_card" label="身份证号码"> </el-table-column>
              <el-table-column label="申请身份">
                  <template slot-scope="scope">
                    <div>{{scope.row.region}}合伙人</div>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.state == 1">审核中</div>
                  <div v-else-if="scope.row.state == 2">审核成功</div>
                  <div v-else-if="scope.row.state == 3">审核拒绝</div>
                  <div v-else-if="scope.row.state == 4">候补中</div>
                  <div v-else-if="scope.row.state == 5">被取消</div>
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
          width="30%"
          class="remarks_box add"
          :visible.sync="add_tan"
          append-to-body
        >
          <div class="info">增加问答</div>
          <div style="padding: 30px 0">
            <div class="blockBox divs">
              <el-form :model="add_wen" class="form por clearfix">
                <h2>增加</h2>
                <el-form-item
                  label="问题(二级):"
                  :label-width="formLabelWidth1"
                >
                  <el-input
                    type="text"
                    placeholder="请输入问题"
                    v-model="add_wen.content"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div
              slot="footer"
              class="dialog-footer clearfix"
              style="padding: 10px 40px 10px 30px; margin-top: 20px"
            >
              <el-button
                type="success"
                class="rt"
                @click="addWen"
                style="margin-left: 15px"
                >修 改</el-button
              >
              <el-button type="danger" class="rt" @click="add_tan = false"
                >取 消</el-button
              >
            </div>
          </div>
        </el-dialog>
        <!-- 编辑问答 -->
        <el-dialog
          width="30%"
          class="remarks_box"
          :visible.sync="edit_tan"
          append-to-body
        >
          <div class="info">编辑问答</div>
          <div style="padding: 30px 83px 30px 30px">
            <el-form :model="edit_wen" class="form por clearfix">
              <h2>增加</h2>
              <el-form-item label="问题(二级):" :label-width="formLabelWidth1">
                <el-input
                  type="text"
                  placeholder="请输入问题"
                  v-model="edit_wen.content"
                ></el-input>
              </el-form-item>
            </el-form>
            <div
              slot="footer"
              class="dialog-footer clearfix"
              style="padding: 20px 0 20px; margin-top: 20px"
            >
              <el-button
                type="success"
                class="rt"
                @click="editWen"
                style="margin-left: 15px"
                >修 改</el-button
              >
              <el-button type="danger" class="rt" @click="edit_tan = false"
                >取 消</el-button
              >
            </div>
          </div>
        </el-dialog>
        <!-- 反复确认框。烦啊 -->
        <div class="box" v-show="kuang_show">
          <div class="content" @click="kuang_show = false">
            <div class="kuang" @click.stop="kuang_show = true">
              <img src="../../assets/image/gantan.png" alt="" />
              <div class="text">是否确认删除？</div>
              <el-button
                type="danger"
                @click.stop="kuang_show = false"
                style="margin-bottom: 10px; margin-right: 36px"
              >
                取消
              </el-button>
              <el-button type="success" @click.stop="sure_address"> 确认 </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { agent_list } from "../../utils/axios";
export default {
  data() {
    return {
      queryInfo: {
        page: 1,
        pageSize: 10,
        total: 1,
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
      add_tan: false,
      fn1: this.commonJs.Debounce(this.get_agent_list),
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
    this.get_agent_list(); //获取推广列表
    this.height = document.body.clientHeight - 320
  },
  methods: {
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
      this.time_value = "";
      this.shen_status = "";

      this.loading = true;
      let request_form = {
        page: 1,
        page_size: this.pageSize,
      };
      agent_list(request_form)
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
      agent_list({
        page: page,
        page_size: number,
        user_search:this.seachVale,
        state: this.shen_status,
        agent_type: this.type_status,
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
      if (this.seachVale == "" && this.time_value == "" && this.type_status == "" && this.shen_status == "") {
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
      agent_list({
        page: 1,
        page_size: this.pageSize,
        user_search:this.seachVale,
        state: this.shen_status,
        agent_type: this.type_status,
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
</style>