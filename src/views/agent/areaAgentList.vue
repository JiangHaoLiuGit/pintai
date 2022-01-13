<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
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
          :data="agentList_area"
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
            label="地区编号" 
            width="100"
          >
          </el-table-column>
          <el-table-column 
            prop="mergename" 
            label="代理区域" 
          >
          </el-table-column>
          <el-table-column 
            prop="profit_value" 
            label="代理权益" 
            width="180"
          >
          </el-table-column>
          <el-table-column 
            prop="opening_value" 
            label="代理价格" 
            width="200"
          >
          </el-table-column>
          <el-table-column label="操作" width ="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="modify(scope.$index, scope.row)"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 修改代理价格弹窗 -->
    <el-dialog :title="title" :visible.sync="opening_change_ifShow">
      <el-form :model="form_X">
        <el-form-item label="代理价格" :label-width="formLabelWidth">
          <el-input v-model="form_X.money" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="opening_change_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_saveChanges_agent">保存</el-button>
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
import { area_list_agent , change_profit , db_province , db_city , db_area } from "../../utils/axios";
export default {
  data() {
    return {
      agentList_area: [], //店铺列表
      loading : false,
      formLabelWidth: "100px",
      fn1: this.commonJs.Debounce(this.get_agent_list),
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      pageSize : 20,
      provinceList :[], //省
      provinceValue :'',
      cityList :[],//市
      cityValue :'',
      city_ifShow : false,
      areaList :[],//区
      areaValue :'',
      area_ifShow : false,
      form_X: {
        money: "",
      },
      title : '修改代理价格',
      opening_change_ifShow : false,
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
    this.get_agent_list(); //获取地区代理收益列表
    this.db_province() //获取省份
    this.height = document.body.clientHeight - 240
  },

  methods: {

    //获取地区代理收益列表
    get_agent_list (index) {
      this.provinceValue = ''
      this.cityValue = ''
      this.areaValue = ''
      this.city_ifShow = false
      this.area_ifShow = false
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      area_list_agent(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.agentList_area = res.data.err_msg.data
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
      area_list_agent(
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
            that.agentList_area = res.data.err_msg.data
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
      if(that.provinceValue == '') {
        that.$message({
          message: '请选择搜索区域',
          type: 'warning'
        });
        return
      }
      that.loading = true
      area_list_agent(
        {
          page : 1,
          page_size: this.pageSize,
          province : this.provinceValue,
          city : this.cityValue,
          area : this.areaValue
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.agentList_area = res.data.err_msg.data
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

    //修改代理价格
    modify (index , row) {
      this.form_X.money = ''
      this.O_message = row
      this.title = '修改代理价格 (区域:' + row.mergename + ' )'
      this.opening_change_ifShow = true
    },

    //确认修改代理价格
    submit_saveChanges_agent () {
      let that = this
       if(that.form_X.money == '') {
        that.$message({
          message: '请将信息填写完整',
          type: 'warning'
        });
        return;
      } else if (parseInt(that.form_X.money) < 1) {
        that.$message({
          message: '代理价格需大于1元',
          type: 'warning'
        });
        return;
      }
       change_profit(
        {
          id :  that.O_message.id,
          value: that.form_X.money
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.opening_change_ifShow = false
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            that.get_agent_list();
          } else {
            that.opening_change_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.opening_change_ifShow = false
          console.log(error);
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
// /deep/ .el-dialog {
//   width: 800px !important;
//   /deep/ .el-dialog__body {
//      display: flex;
//      justify-content: space-between;
//   }
//   /deep/ .el-input {
//     overflow-y: auto;  /*溢出隐藏*/
//     // text-overflow: ellipsis; /*以省略号...显示*/
//     // white-space: nowrap;  /*强制不换行*/
//   }
// }

.seach_copy {
  margin-bottom: 20px;
  margin-top: 20px;
  display: flex;
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