<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
        <el-input v-model="pick_value" placeholder="请输入昵称或手机号" @keyup.enter.native="pick_seach"></el-input>
        <el-date-picker
          :clearable = false
          v-model="time_value"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-select v-model="pick_condition" placeholder="请选择状态">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="provinceValue" placeholder="请选择省份">
        <el-option
          v-for="item in provinceList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="cityValue" placeholder="请选择市" v-show="city_ifShow">
        <el-option
          v-for="item in cityList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="areaValue" placeholder="请选择区"  v-show="area_ifShow">
        <el-option
          v-for="item in areaList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
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
          :data="agentList"
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
            prop="id" 
            label="申请单编号" 
            width="100"
          >
          </el-table-column>
          <el-table-column 
            prop="create_time" 
            label="申请时间" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="nickname" 
            label="昵称" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="phone" 
            label="手机号" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="mergename" 
            label="代理区域" 
          >
          </el-table-column>
           <el-table-column 
            prop="opening_value" 
            label="代理价格" 
            width="150"
          >
          </el-table-column>
          <el-table-column 
            prop="profit_value" 
            label="代理收益" 
            width="180"
          >
          </el-table-column>
          
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="enable(scope.$index, scope.row)"
                v-show="scope.row.is_open == 2"
                >启用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-show="scope.row.is_open == 1"
                @click="stop_useing(scope.$index, scope.row)"
                >停用</el-button
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

  </div>
</template>

<script>
import { get_list_agent , changetype_agent , db_province , db_city , db_area } from "../../utils/axios";
export default {
  data() {
    return {
      agentList: [], //店铺列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_agent_list),
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      father_menu : [],
      options: [{
          value: '1',
          label: '启用'
        }, {
          value: '2',
          label: '禁用'
        }],
        pick_condition: '',
        pick_value : '',
        pageSize : 20,
        provinceList :[], //省
        provinceValue :'',
        cityList :[],//市
        cityValue :'',
        city_ifShow : false,
        areaList :[],//区
        areaValue :'',
        area_ifShow : false,
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
        height:"",
    };
  },

  watch:{
    
    provinceValue:{
      handler:function(news,olds){
        if(news){
          this.city_ifShow = true
          this.cityValue = ''
          this.areaValue = ''
          this.area_ifShow = false
          this.db_city(news)
        } else {
          this.city_ifShow = false
          this.cityValue = ''
          this.areaValue = ''
          this.area_ifShow = false
        }
      }
    },

    cityValue:{
      handler:function(news,olds){
        console.log(news)
        if(news){
          this.area_ifShow = true
          this.db_area(news)
        } else {
          this.area_ifShow = false
        }
      }
    },
    
  },

  created() {
    this.get_agent_list(); //获取代理列表
    this.db_province() //获取省份
    this.height = document.body.clientHeight - 240
  },

  methods: {

    //获取代理列表
    get_agent_list (index) {
      this.pick_condition = ''
      this.pick_value = ''
      this.provinceValue = ''
      this.cityValue = ''
      this.areaValue = ''
      this.time_value = ''
      this.city_ifShow = false
      this.area_ifShow = false
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      get_list_agent(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.create_time = that.commonJs.timestampToTime (element.create_time)
            });
            that.agentList = res.data.err_msg.list
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

    // 获取省
    db_province(){
      let that = this
      db_province().then(res=>{
        if(res.data.err_code==0){
          if(res.data.err_msg){
            that.provinceList = res.data.err_msg.province
          }
        }else{
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
    },

    // 获取市
    db_city(province_id){
      let that = this
      this.cityList = []
      db_city({province:province_id}).then(res=>{
        if(res.data.err_code==0){
          if(res.data.err_msg){
            that.cityList = res.data.err_msg.data
          }
        }else{
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
    },

    // 获取区
    db_area(city_id){
      let that = this
      this.areaList = []
      db_area({city : city_id}).then(res=>{
        if(res.data.err_code==0){
          if(res.data.err_msg){
            that.areaList = res.data.err_msg.data
          }
        }else{
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
    },

    //分页
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      get_list_agent(
        {
          page : page,
          page_size: number,
          search : this.pick_condition,
          keyword : this.pick_value,
          cate : this.cate_value,
          province_id : this.provinceValue,
          city_id : this.cityValue,
          area_id : this.areaValue
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.create_time = that.commonJs.timestampToTime (element.create_time)
            });
            that.agentList = res.data.err_msg.list
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
      if(that.pick_condition == '' && that.pick_value == '' && that.provinceValue == '' && that.time_value == '') {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      get_list_agent(
        {
          page : 1,
          page_size: this.pageSize,
          type : this.pick_condition,//启用/禁用
          nickname : this.pick_value,
          start_time : this.time_value[0],
          end_time : this.time_value[1],
          province : this.provinceValue,
          city : this.cityValue,
          area : this.areaValue
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.create_time = that.commonJs.timestampToTime (element.create_time)
            });
            that.agentList = res.data.err_msg.list
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

     //启用
    enable (index , row) {
      let that = this
      this.$confirm('此操作将允许' + row.nickname + '用户代理(' + row.mergename +')区域, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changetype_agent({
          id: row.id,
          status : 2,
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '启用成功',
                type: 'success'
              });
              that.get_agent_list();
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
      }).catch(() => {
               
      });
    },

    //停用
    stop_useing (index , row) {
      let that = this
      this.$confirm('此操作将禁止' + row.nickname + '用户代理(' + row.mergename +')区域, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changetype_agent({
          id: row.id,
          status : 1,
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '停用成功',
                type: 'success'
              });
              that.get_agent_list();
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
      }).catch(() => {
               
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
/deep/ .el-dialog {
  width: 800px !important;
  /deep/ .el-dialog__body {
     display: flex;
     justify-content: space-between;
  }
  /deep/ .el-input {
    overflow-y: auto;  /*溢出隐藏*/
    // text-overflow: ellipsis; /*以省略号...显示*/
    // white-space: nowrap;  /*强制不换行*/
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