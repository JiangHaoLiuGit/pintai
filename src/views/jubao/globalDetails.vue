<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
        <el-input v-model="pick_value" placeholder="请输入昵称或手机号" @keyup.enter.native="pick_seach"></el-input>
        <el-select v-model="pick_condition" placeholder="请选择状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="businessValue" placeholder="请选择业务分类">
          <el-option
            v-for="item in businessList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
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
          :data="detailsList"
          border
          :height="height"
          style="width: 100%"
        >
          <el-table-column 
            label="序号"
            type="index" 
            width="80"
          >
          </el-table-column>
          <el-table-column 
            prop="create_time" 
            label="变更时间" 
            width="180"
          >
          </el-table-column>
          <el-table-column 
            prop="phone" 
            label="手机号" 
            width="150"
          >
          </el-table-column>
          <el-table-column 
            prop="nickname" 
            label="昵称" 
            width="200"
          >
          </el-table-column>
          <el-table-column 
            prop="user_id" 
            label="用户ID" 
            width="100"
          >
          </el-table-column>
          <el-table-column label="状态" width="150">
            <template slot-scope="scope">
             {{scope.row.score_type == 1 ? '增加' : '减少' }}
            </template>
          </el-table-column>
          <el-table-column 
            prop="type" 
            label="业务" 
          >
          </el-table-column>
          <el-table-column label="橘宝变更" width="150">
            <template slot-scope="scope">
             {{scope.row.score_type == 1 ? '+' + scope.row.score : '-' + scope.row.score }}
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
    
  </div>
</template>

<script>
import { all_detail_list } from "../../utils/axios";
export default {
  data() {
    return {
      detailsList: [], //明细列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_global_list),
      O_message : {},
      formLabelWidth: "100px",
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      options: [{
        value: '1',
        label: '增加'
      }, {
        value: '2',
        label: '减少'
      }],
      businessList: [
        {
          value: '1',
          label: '代理消费'
        },{ 
          value: '2',
          label: '晋级消费'
        }, {
          value: '3',
          label: '庄园消费'
        }, {
          value: '4',
          label: '转出'
        },
        {
          value: '5',
          label: '转入'
        },{ 
          value: '6',
          label: '绑定微信'
        }, {
          value: '7',
          label: '实名认证'
        },
        {
          value: '8',
          label: '浏览爆款商品'
        },{ 
          value: '9',
          label: '分享商品到朋友圈'
        }, {
          value: '10',
          label: '分享橘椒给好友'
        }, {
          value: '11',
          label: '推广会员'
        },
        {
          value: '12',
          label: '邀请会员'
        }, {
          value: '13',
          label: '首推视频'
        },
        {
          value: '14',
          label: '转盘抽奖'
        },{ 
          value: '15',
          label: '翻牌游戏'
        }, {
          value: '16',
          label: '橘宝商城换购商品'
        }, {
          value: '17',
          label: '购买商品赠送橘宝'
        },
        {
          value: '18',
          label: '注册获得橘宝'
        },{
          value: '19',
          label: '团队成员获得橘宝'
        }, {
          value: '20',
          label: '三方小游戏视频'
        },
        {
          value: '21',
          label: '三方广告视频'
        }
      ],
      pick_condition: '',
      pick_value : '',
      pageSize : 20,
      businessValue :'',
      time_value : '',
      form_X: {
        level: "",
      },
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
    this.get_global_list(); //获取全局明细
    this.height = document.body.clientHeight - 240
  },

  methods: {

    //获取全局明细
    get_global_list (index) {
      this.pick_condition = ''
      this.pick_value = ''
      this.businessValue = ''
      this.time_value = ''
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      all_detail_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.create_time = that.commonJs.timestampToTime (element.create_time)
              if(element.type == 1) {
                element.type = '代理消费'
              } else if (element.type == 2) {
                element.type = '晋级消费'
              } else if (element.type == 3) {
                element.type = '庄园消费'
              } else if (element.type == 4) {
                element.type = '转出'
              } else if (element.type == 5) {
                element.type = '转入'
              } else if (element.type == 6) {
                element.type = '绑定微信'
              } else if (element.type == 7) {
                element.type = '实名认证'
              } else if (element.type == 8) {
                element.type = '浏览爆款商品'
              } else if (element.type == 9) {
                element.type = '分享商品到朋友圈'
              } else if (element.type == 10) {
                element.type = '分享橘椒给好友'
              } else if (element.type == 11) {
                element.type = '推广会员'
              } else if (element.type == 12) {
                element.type = '邀请会员'
              } else if (element.type == 13) {
                element.type = '首推视频'
              } else if (element.type == 14) {
                element.type = '转盘抽奖'
              } else if (element.type == 15) {
                element.type = '翻牌游戏'
              } else if (element.type == 16) {
                element.type = '橘宝商城换购商品'
              } else if (element.type == 17) {
                element.type = '购买商品赠送橘宝'
              } else if (element.type == 18) {
                element.type = '注册获得橘宝'
              } else if (element.type == 19) {
                element.type = '团队成员获得橘宝'
              } else if (element.type == 20) {
                element.type = '三方小游戏视频'
              } else if (element.type == 21) {
                element.type = '三方广告视频'
              } else {
                element.type = '---'
              }
            });
            that.detailsList = res.data.err_msg.list
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
      all_detail_list(
        {
          page : page,
          page_size: number,
          status : this.pick_condition,
          nickname : this.pick_value,//昵称/手机号模糊搜索
          start_time : this.time_value[0],
          end_time : this.time_value[1],
          business : this.businessValue,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.create_time = that.commonJs.timestampToTime (element.create_time)
              if(element.type == 1) {
                element.type = '代理消费'
              } else if (element.type == 2) {
                element.type = '晋级消费'
              } else if (element.type == 3) {
                element.type = '庄园消费'
              } else if (element.type == 4) {
                element.type = '转出'
              } else if (element.type == 5) {
                element.type = '转入'
              } else if (element.type == 6) {
                element.type = '绑定微信'
              } else if (element.type == 7) {
                element.type = '实名认证'
              } else if (element.type == 8) {
                element.type = '浏览爆款商品'
              } else if (element.type == 9) {
                element.type = '分享商品到朋友圈'
              } else if (element.type == 10) {
                element.type = '分享橘椒给好友'
              } else if (element.type == 11) {
                element.type = '推广会员'
              } else if (element.type == 12) {
                element.type = '邀请会员'
              } else if (element.type == 13) {
                element.type = '首推视频'
              } else if (element.type == 14) {
                element.type = '转盘抽奖'
              } else if (element.type == 15) {
                element.type = '翻牌游戏'
              } else if (element.type == 16) {
                element.type = '橘宝商城换购商品'
              } else if (element.type == 17) {
                element.type = '购买商品赠送橘宝'
              } else if (element.type == 18) {
                element.type = '注册获得橘宝'
              } else if (element.type == 19) {
                element.type = '团队成员获得橘宝'
              } else if (element.type == 20) {
                element.type = '三方小游戏视频'
              } else if (element.type == 21) {
                element.type = '三方广告视频'
              } else {
                element.type = '---'
              }
            });
            that.detailsList = res.data.err_msg.list
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
      if(that.pick_condition == '' && that.pick_value == '' && that.businessValue == '' && that.time_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      all_detail_list(
        {
          page : 1,
          page_size: this.pageSize,
          status : this.pick_condition,
          nickname : this.pick_value,//昵称/手机号模糊搜索
          start_time : this.time_value[0],
          end_time : this.time_value[1],
          business : this.businessValue,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.create_time = that.commonJs.timestampToTime (element.create_time)
              if(element.type == 1) {
                element.type = '代理消费'
              } else if (element.type == 2) {
                element.type = '晋级消费'
              } else if (element.type == 3) {
                element.type = '庄园消费'
              } else if (element.type == 4) {
                element.type = '转出'
              } else if (element.type == 5) {
                element.type = '转入'
              } else if (element.type == 6) {
                element.type = '绑定微信'
              } else if (element.type == 7) {
                element.type = '实名认证'
              } else if (element.type == 8) {
                element.type = '浏览爆款商品'
              } else if (element.type == 9) {
                element.type = '分享商品到朋友圈'
              } else if (element.type == 10) {
                element.type = '分享橘椒给好友'
              } else if (element.type == 11) {
                element.type = '推广会员'
              } else if (element.type == 12) {
                element.type = '邀请会员'
              } else if (element.type == 13) {
                element.type = '首推视频'
              } else if (element.type == 14) {
                element.type = '转盘抽奖'
              } else if (element.type == 15) {
                element.type = '翻牌游戏'
              } else if (element.type == 16) {
                element.type = '橘宝商城换购商品'
              } else if (element.type == 17) {
                element.type = '购买商品赠送橘宝'
              } else if (element.type == 18) {
                element.type = '注册获得橘宝'
              } else if (element.type == 19) {
                element.type = '团队成员获得橘宝'
              } else if (element.type == 20) {
                element.type = '三方小游戏视频'
              } else if (element.type == 21) {
                element.type = '三方广告视频'
              } else {
                element.type = '---'
              }
            });
            that.detailsList = res.data.err_msg.list
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

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
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