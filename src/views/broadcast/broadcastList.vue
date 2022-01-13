<template>
  <div class="page">
    <div class="seach">
      
      <div class="el-inpu inlineBlock">
        
      </div>
    </div>
    <div class="seach_copy">
      <div class="seach_select">
        <el-input
          v-model="apply_uid"
          @keyup.enter.native="pick_seach"
          type="number"
          placeholder="请输入申请人uid"
          
        ></el-input>
        <el-input
          v-model="apply_phone"
          placeholder="请输入申请人电话"
          @keyup.enter.native="pick_seach"
          type="number"
          maxlength="11"
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
        <el-select
        v-model="pick_condition"
        class="el-inpu"
        placeholder="请选择审核状态"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
          v-model="apply_name"
          placeholder="请输入申请人姓名"
          @keyup.enter.native="pick_seach"
          clearable
          
        ></el-input>
      </div>
      <div class="button_type">
        <el-button type="primary" @click="pick_seach">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
          >刷新</el-button
        >
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          :data="extendList"
          border
          :height="height"
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" width="100">
          </el-table-column>
          <el-table-column prop="add_time" label="申请时间" width="300">
          </el-table-column>
          <!-- <el-table-column prop="invite_uid" label="邀请人用户id" width="120">
          </el-table-column>
          <el-table-column prop="invite_name" label="邀请人姓名" width="120">
          </el-table-column> -->
          
          <el-table-column prop="apply_name" label="申请人姓名" width="100">
          </el-table-column>
          <el-table-column prop="apply_phone" label="申请人电话" width="200">
          </el-table-column>
          <el-table-column prop="apply_uid" label="申请人uid" width="110">
          </el-table-column>
          <el-table-column label="所属区域">
            <template slot-scope="scope">
              <div>
                  {{scope.row.province_name}} {{scope.row.city_name}} {{scope.row.area_name}}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="缴费状态" width="100">
            <template slot-scope="scope1">
              <div v-if="scope1.row.is_pay == 0">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="enable(scope1.$index, scope1.row)"
                        >未缴费</el-button
                    >
              </div>
              <div v-else>
                  已缴费
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="审核状态" width="200">
            <template slot-scope="scope2">
              <div v-if="scope2.row.status == 0">
                    <el-button
                        size="mini"
                        type="warning"
                        @click="enable2(scope2.$index, scope2.row)"
                        >待审核</el-button
                    >
              </div>
              
              <div v-else-if="scope2.row.status == 1" style="color:green;">
                  审核通过
              </div>
              <div v-else-if="scope2.row.status == 2" style="color:red;">
                  审核未通过
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
      <!-- 修改等级弹窗 -->
      <el-dialog title="主播审核" :visible.sync="opening_change_ifShow">
        <div class="divRow clearfix">
          <div class="boxDiv clearfix">
            <div class="labelDiv">
              主播姓名:
            </div>
            <div class="textDiv">
              {{broadInfo.apply_name}}
            </div>
          </div>
          <div class="boxDiv clearfix">
            <div class="labelDiv">
              主播电话:
            </div>
            <div class="textDiv">
              {{broadInfo.apply_phone}}
            </div>
          </div>
        </div>

        <div class="divRow clearfix">
          <div class="boxDiv clearfix">
            <div class="labelDiv">
              所在地:
            </div>
            <div class="textDiv">
              {{broadInfo.province_name}} {{broadInfo.city_name}} {{broadInfo.area_name}}
            </div>
          </div>
          <div class="boxDiv clearfix">
            <div class="labelDiv">
              银行卡号:
            </div>
            <div class="textDiv">
              {{broadInfo.bank_card}}
            </div>
          </div>
        </div>

        <div class="divRow clearfix">
          <div class="boxDiv clearfix">
            <div class="labelDiv">
              身份证号:
            </div>
            <div class="textDiv">
              {{broadInfo.id_card}}
            </div>
          </div>
          <div class="boxDiv clearfix">
            <div class="labelDiv">
              开户行:
            </div>
            <div class="textDiv">
              {{broadInfo.bank_name}}
            </div>
          </div>
        </div>

        <div class="divRow clearfix">
          <div class="boxDiv clearfix">
            <div class="labelDiv">
              开户人姓名:
            </div>
            <div class="textDiv">
              {{broadInfo.bank_open_name}}
            </div>
          </div>
          <div class="boxDiv clearfix">
            <div class="labelDiv">
              拒绝原因:
            </div>
            <div class="textDiv">
              <el-input
                type="textarea"
                maxlength="200"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入拒绝内容"
                show-word-limit
                v-model="textarea2">
              </el-input>
            </div>
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="submit_err">拒绝</el-button>
          <el-button type="primary" @click="submit_yes"
            >同意</el-button
          >
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
import { get_list_broad ,broad_Info ,broad_Audit} from "../../utils/axios";
export default {
  data() {
    return {
      opening_change_ifShow:false,
      extendList: [], //主播审核列表
      fn1: this.commonJs.Debounce(this.get_agent_list),
      options: [
        {
          value: -1,
          label: "待审核",
        },
        {
          value: 1,
          label: "审核通过",
        },
        {
          value: 2,
          label: "审核未通过",
        },
      ],
      textarea2:"",
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      pageSize:0,
      broadId:"",
      broadInfo:"",
      pick_condition: "",
      //申請人姓名
      apply_name: "",
      apply_phone: "",
      apply_uid: "",
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
      height:"",

    };
  },
  created() {
    this.get_agent_list();
    this.height = document.body.clientHeight - 240
  },
  methods: {
      //缴费
      enable (index , row) {
        
      },
      //审核
      enable2 (index , row) {

          this.broadId = row.id
          this.opening_change_ifShow = true
          broad_Info({
            id:this.broadId
          }).then((res) => {
            console.log(res)
            if(res.data.err_code == 0){
              this.broadInfo = res.data.err_msg.info
            }
          }).catch((err) => {
            console.log(err)
          })
      },
      submit_yes(){
        broad_Audit({
          id:this.broadId,
          status:1
        }).then((res) => {
          if(res.data.err_code == 0){
              this.$message({
                message: "审核已通过",
                type: "success",
              });
              this.opening_change_ifShow = false
              this.get_agent_list();
            }else{
              this.$message({
                showClose: true,
                message: res.data.err_msg,
                type: "error",
              });
            }
        }).catch((res) => {
          console.log(res)
        })
      },
      submit_err(){
        if(this.textarea2 == ""){
          this.$message({
            message: "请填写拒绝原因",
            type: "warning",
          });
          return;
        }else{
          broad_Audit({
            id:this.broadId,
            status:2,
            description:this.textarea2
          }).then((res) => {
            if(res.data.err_code == 0){
                this.$message({
                  message: "审核已拒绝",
                  type: "success",
                });
                this.this.textarea2 = ''
                this.get_agent_list();
                this.opening_change_ifShow = false
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.err_msg,
                  type: "error",
                });
              }
          }).catch((res) => {
            console.log(res)
          })
        }
        
      },
      //搜索
    pick_seach() {
      let that = this;
      console.log(that.pick_condition)
      if (
        that.apply_uid == "" &&
        that.apply_phone == "" &&
        that.apply_name == "" &&
        that.pick_condition === "" &&
        that.time_value == ""
      ) {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      var time1 = ''
      var time2 = ''
      if(this.time_value != ''){
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        apply_uid:that.apply_uid,
        apply_phone:that.apply_phone,
        apply_name:that.apply_name,
        status:that.pick_condition,
        start_time:time1,
        end_time:time2
      };
      get_list_broad(request_form)
        .then((res) => {
          console.log(res);
          that.loading = false;
          if (res.data.err_code == 0) {
              res.data.err_msg.list.forEach(element => {
                  element.add_time = this.commonJs.timestampToTime(element.add_time)
              })
            this.extendList = res.data.err_msg.list;

            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            this.queryInfo.page = parseInt(res.data.err_msg.page)
            this.queryInfo.total = parseInt(res.data.err_msg.total_number)
            this.pageSize = res.data.err_msg.page_size
          }
        })
        .catch((error) => {
          that.loading = false;
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
    //分页
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      var time1 = ''
      var time2 = ''
      if(this.time_value != ''){
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      
      get_list_broad(
        {
            page : page,
            page_size: number,
            apply_uid:that.apply_uid,
            apply_phone:that.apply_phone,
            apply_name:that.apply_name,
            pick_condition:that.pick_condition,
            start_time:time1,
            end_time:time2
        }
      )
        .then((res) => {
          console.log(res);
          that.loading = false;
          if (res.data.err_code == 0) {
              res.data.err_msg.list.forEach(element => {
                  element.add_time = this.commonJs.timestampToTime(element.add_time)
              })
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            this.queryInfo.page = parseInt(res.data.err_msg.page)
            this.queryInfo.total = parseInt(res.data.err_msg.total_number)
            this.pageSize = res.data.err_msg.page_size
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
          that.loading = false
          console.log(error);
        });
    },
    //加载第一页
    get_agent_list(index) {
      this.apply_uid = "";
      this.apply_phone = "";
      this.apply_name = "";
      this.pick_condition = "";
      this.time_value = "";
      let that = this
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      get_list_broad(request_form)
        .then((res) => {
          console.log(res);
          that.loading = false;
          if (res.data.err_code == 0) {
              res.data.err_msg.list.forEach(element => {
                  element.add_time = this.commonJs.timestampToTime(element.add_time)
              })
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size)
            this.pageSize = res.data.err_msg.page_size
            this.queryInfo.page = parseInt(res.data.err_msg.page)
            this.queryInfo.total = parseInt(res.data.err_msg.total_number)
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
  },
};
</script>

<style scoped lang="less">
.page {
  padding: 15px 15px 0;
}
.seach {
  display: flex;
  /deep/ .el-input {
    width: 200px;
    margin: 0 20px 0 10px;
  }
}
.seach_copy {
  
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
  width: 50%;
}
/deep/ .el-form-item__label {
  text-align-last: justify;
}
/deep/ .el-dialog__body {
  padding: 30px 50px;
}
.divRow{
  margin: 10px 0;
  .boxDiv{
    width: 50%;
    float: left;
    .labelDiv{
      width: 20%;
      float: left;
    }
    .textDiv{
      width: 80%;
      float:left;
    }
  }
}
</style>
