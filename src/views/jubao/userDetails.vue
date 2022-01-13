<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
        <el-input v-model="pick_value" placeholder="请输入昵称或手机号" @keyup.enter.native="pick_seach"></el-input>
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
            prop="phone" 
            label="手机号" 
            width="150"
          >
          </el-table-column>
          
          <el-table-column 
            prop="nickname" 
            label="昵称" 
          >
          </el-table-column>
          <el-table-column 
            prop="uid" 
            label="用户ID" 
            width="100"
          >
          </el-table-column>
          <el-table-column 
            prop="point_balance" 
            label="账户积分余额" 
            width="180"
          >
          </el-table-column>
          <el-table-column 
            prop="point_gift" 
            label="获得积分累计" 
            width="160"
          >
          </el-table-column>
          <el-table-column 
            prop="spend_point_gift" 
            label="使用积分" 
            width="160"
          >
          </el-table-column>
          <el-table-column 
            prop="point_unbalance" 
            label="当前冻结" 
            width="160"
          >
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
             <el-button
                size="mini"
                type="success"
                @click="see(scope.$index, scope.row)"
                >查看橘宝变更详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 查看 -->
    <el-dialog :title="title" :visible.sync="dialogTableVisible">
      <div class="seach">
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
      </div>
      <div class="seach_copy">
        <div class="seach_select">
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
          <el-button type="primary" @click="delete_detail">刷新</el-button>
          <el-button type="primary" @click="pick_seach_copy">搜索</el-button>
        </div>
      </div>
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading_copy"
            ref="multipleTable"
            :data="gridData"
            border
            style="width: 100%"
          >
            <el-table-column 
              label="序号"
              type="index" 
              width="80"
            >
            </el-table-column>
            <el-table-column label="橘宝变更" width="120">
              <template slot-scope="scope">
              {{scope.row.score_type == 1 ? '+' + scope.row.score : '-' + scope.row.score }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template slot-scope="scope">
              {{scope.row.score_type == 1 ? '增加' : '减少' }}
              </template>
            </el-table-column>
            <el-table-column 
              prop="type" 
              label="业务" 
              width="180"
            >
            </el-table-column>
            <el-table-column 
              prop="memo" 
              label="变动原因" 
            >
            </el-table-column>
            <el-table-column 
              prop="create_time" 
              label="变动时间" 
              width="150"
            >
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
       <!-- 分页 -->
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24" class="goodsindex-page-box">
          <el-pagination
            @size-change="handleSizeChange_copy"
            @current-change="handleCurrentChange_copy"
            :current-page="queryInfo_copy.page"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="queryInfo_copy.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryInfo_copy.total"
          >
          </el-pagination>
        </el-col>
      </el-row>
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
import { get_list_jvbao , detail_content_jvbao } from "../../utils/axios";
export default {
  data() {
    return {
      detailsList: [], //明细列表
      loading : false,
      loading_copy : false,
      fn1: this.commonJs.Debounce(this.get_user_list),
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      queryInfo_copy: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      pageSize : 20,
      pageSize_copy : 0,
      pick_value : '',
      dialogTableVisible : false,
      gridData : [],
      title : '用户详情',
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
      businessValue :'',
      time_value : '',
      height:"",
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
    this.get_user_list(); //获取用户明细
    this.height = document.body.clientHeight - 240
  },

  methods: {

    //获取用户明细
    get_user_list (index) {
      this.pick_value = ''
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      get_list_jvbao(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
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
      get_list_jvbao(
        {
          page : page,
          page_size: number,
          nickname : this.pick_value,//昵称/手机号模糊搜索
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
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
      if(that.pick_value == '') {
        that.$message({
          message: '请选择填写搜索内容',
          type: 'warning'
        });
        return
      }
      that.loading = true
      get_list_jvbao(
        {
          page : 1,
          page_size: this.pageSize,
          nickname : this.pick_value
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
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

    //查看
    see (index , row) {
      let that = this
      this.pick_condition = ''
      this.businessValue = ''
      this.time_value = ''
      this.O_message = row
      this.title = '橘宝详情 (账号:' + row.nickname + ')'
      this.dialogTableVisible = true
      that.loading_copy = false
      detail_content_jvbao(
        {
          uid : row.uid ,
          page_size : 10,
          page : 1
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading_copy = false
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
            that.gridData = res.data.err_msg.list
            that.queryInfo_copy.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo_copy.page = parseInt(res.data.err_msg.page)
            that.queryInfo_copy.total = parseInt(res.data.err_msg.total_number)
            that.pageSize_copy = res.data.err_msg.page_size
          } else {
            that.loading_copy = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.loading_copy = false
          console.log(error);
        });
    },

    //分页-弹窗
    get_shop_list_page_copy (page , number) {
      let that = this
      that.loading_copy = true
      detail_content_jvbao(
        {
          page : page,
          page_size: number,
          uid : this.O_message.uid,
          status : this.pick_condition,
          start_time : this.time_value[0],
          end_time : this.time_value[1],
          business : this.businessValue
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading_copy = false
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
            that.gridData = res.data.err_msg.list
            that.queryInfo_copy.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo_copy.page = parseInt(res.data.err_msg.page)
            that.queryInfo_copy.total = parseInt(res.data.err_msg.total_number)
            that.pageSize_copy = res.data.err_msg.page_size
          } else {
            that.loading_copy = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.loading_copy = false
          console.log(error);
        });
    },

    //每页显示条数改变-弹窗
    handleSizeChange_copy(val) {
      this.get_shop_list_page_copy(1,val)
    },

    //当前页-弹窗
    handleCurrentChange_copy(val) {
      console.log(val)
      this.get_shop_list_page_copy(val,this.pageSize_copy)
    },

    //搜索-弹窗
    pick_seach_copy () {
      let that = this
      if(that.pick_condition == '' && that.businessValue == '' && that.time_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading_copy = true
      detail_content_jvbao(
        {
          uid : this.O_message.uid,
          page : 1,
          page_size: this.pageSize_copy,
          status : this.pick_condition,
          start_time : this.time_value[0],
          end_time : this.time_value[1],
          business : this.businessValue
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading_copy = false
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
            that.gridData = res.data.err_msg.list
            that.queryInfo_copy.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo_copy.page = parseInt(res.data.err_msg.page)
            that.queryInfo_copy.total = parseInt(res.data.err_msg.total_number)
            that.pageSize_copy = res.data.err_msg.page_size
          } else {
            that.loading_copy = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          console.log(error);
          that.loading_copy = false
        });
    },

    //刷新
    delete_detail () {
      let that = this
      this.pick_condition = ''
      this.businessValue = ''
      this.time_value = ''
      that.loading_copy = true
      detail_content_jvbao(
        {
          uid : this.O_message.uid,
          page_size : 10,
          page : 1
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading_copy = false
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
            that.gridData = res.data.err_msg.list
            that.queryInfo_copy.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo_copy.page = parseInt(res.data.err_msg.page)
            that.queryInfo_copy.total = parseInt(res.data.err_msg.total_number)
            that.pageSize_copy = res.data.err_msg.page_size
            this.$message({
              message: '刷新成功',
              type: 'success'
            });
          } else {
            that.loading_copy = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          console.log(error);
          that.loading_copy = false
        });
    }

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
  width: 1300px !important;
}

/deep/ .el-dialog__body {
  height: 450px;
  overflow-y: auto;
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