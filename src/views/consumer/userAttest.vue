<template>
  <div class="goodsindex">
    <div class="seach">
      
      
    </div>
    <div class="seach_copy">
      <div class="seach_select">
        <el-input v-model="pick_value" @keyup.enter.native="pick_seach" placeholder="请输入用户昵称/手机号"></el-input>
        
        <el-select v-model="pick_condition" placeholder="请选择认证状态类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="statusValue" @keyup.enter.native="pick_seach" placeholder="请输入真实姓名"></el-input>
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
          :data="priceRecordList"
          border
          :height="height"
          style="width: 100%"
        >
          <el-table-column 
            label="序号"
            type="index" 
          >
          </el-table-column>
          <el-table-column 
            prop="create_time" 
            label="认证时间" 
          >
          </el-table-column>
          <el-table-column 
            prop="reg_time" 
            label="注册时间" 
          >
          </el-table-column>
          <el-table-column 
            prop="user_id" 
            label="用户id" 
          >
          </el-table-column>
          <el-table-column 
            prop="id_card" 
            label="用户身份证号" 
          >
          </el-table-column>
          <el-table-column 
            prop="name" 
            label="真实姓名" 
          >
          </el-table-column>
          <el-table-column 
            prop="nickname" 
            label="用户昵称" 
          >
          </el-table-column>
          <el-table-column label="图片" width="150">
            <template slot-scope="scope">
             <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.image"
              :preview-src-list="srcList"
              fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column 
            prop="phone" 
            label="用户手机号" 
          >
          </el-table-column>
          
           <el-table-column 
            prop="msg" 
            label="认证结果" 
          >
          </el-table-column>
          <el-table-column 
            label="认证状态" 
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">认证通过</span>
              <span v-else-if="scope.row.status == 2">实名认证通过</span>
              <span v-else-if="scope.row.status == 3">实名认证通过</span>
              <span v-else>认证未通过</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="reason" 
            label="禁用原因" 
          >
          </el-table-column>
          
          
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="danger" v-show="scope.row.status == 1" @click="stop_useing(scope.$index, scope.row)">禁用</el-button>
              </template>
            </el-table-column>
          <!--  -->
        </el-table>
      </el-col>
    </el-row>
     <!-- 禁用弹窗 -->
    <el-dialog :title="title" :visible.sync="opening_change_ifShow">
        <el-input
            placeholder="请输入禁用理由"
            v-model="liyou">
          </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="opening_change_ifShow = false">取 消</el-button>
        <el-button type="danger" @click="submit_saveChanges_level">禁用</el-button>
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
import { authentication_list , set_status } from "../../utils/axios";
export default {
  data() {
    return {
      priceRecordList: [], //兑奖列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_price_record_list),
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      options: [{
        value: '0',
        label: '全部'
      },{
        value: '1',
        label: '通过'
      }, {
        value: '2',
        label: '禁用'
      }],
      pick_condition: '',
      pick_value : '',
      pageSize : 20,
      statusValue :'',
      time_value : '',
      srcList:[
        
      ],

      liyou:"",
      title:"",
      opening_change_ifShow:false,
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
      sum : 0,
      price : 0,
    };
  },

  created() {
    this.get_price_record_list(); //获取兑奖列表
    this.height = document.body.clientHeight - 240
    console.log(this.height)
  },

  methods: {

    //获取兑奖列表
    get_price_record_list (index) {
      this.pick_condition = ''
      this.pick_value = ''
      this.statusValue = ''
      this.time_value = ''
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      authentication_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            // 
            that.loading = false
            this.srcList = []
            res.data.err_msg.list.forEach((item) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
              item.reg_time = this.commonJs.timestampToTime(
                item.reg_time
              );
              this.srcList.push(item.image)
            });
            that.priceRecordList = res.data.err_msg.list
            that.sum = res.data.err_msg.sum
            that.price = res.data.err_msg.price
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

    //分页
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      // pick_condition 请选择认证状态类型
      // statusValue 请输入真实姓名
      // pick_value 用户昵称/手机号
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      authentication_list(
        {
          page : page,
          page_size: number,
          real_name : this.statusValue,
          search : this.pick_value,
          start_time : time1,
          end_time : time2,
          status : this.pick_condition,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            this.srcList = []
            res.data.err_msg.list.forEach((item) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
              item.reg_time = this.commonJs.timestampToTime(
                item.reg_time
              );
              this.srcList.push(item.image)
            });
            that.sum = res.data.err_msg.sum
            that.price = res.data.err_msg.price
            that.priceRecordList = res.data.err_msg.list
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
      if(that.pick_condition == '' && that.pick_value == '' && that.statusValue == '' && that.time_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      authentication_list(
        {
          page : 1,
          page_size: this.pageSize,
          real_name : this.statusValue,
          search : this.pick_value,
          start_time : time1,
          end_time : time2,
          status : this.pick_condition,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            this.srcList = []
            res.data.err_msg.list.forEach((item) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
              item.reg_time = this.commonJs.timestampToTime(
                item.reg_time
              );
              this.srcList.push(item.image)
            });
            that.sum = res.data.err_msg.sum
            that.price = res.data.err_msg.price
            that.priceRecordList = res.data.err_msg.list
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

    submit_saveChanges_level(){
      if(this.liyou == ''){
        this.$message({
          showClose: true,
          message: "理由不能为空",
          type: 'error'
        });
      }else{
        set_status({
          id: this.user.id,
          reason : this.liyou,
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              this.opening_change_ifShow = false
              this.$message({
                message: '禁用成功',
                type: 'success'
              });
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            } else {
              this.$message({
                showClose: true,
                message: res_s.data.err_msg,
                type: 'error'
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    //禁用
    stop_useing (index , row) {
      this.user = row
      this.title = '禁用理由'
      this.opening_change_ifShow = true
    },

  },
};
</script>

<style scoped lang="less">

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

/deep/ .el-dialog {
  width: 508px !important;
}

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
  }
}

.seach_num {
  display: flex;
  margin-left: 10px;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 700;
  div {
    margin-right: 20px;
  }
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