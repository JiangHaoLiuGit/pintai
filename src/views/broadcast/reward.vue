<template>
  <div class="page">
    <!-- <div>
      <el-upload
        action=""
        list-type="picture-card"
        :file-list='fileList'
        :http-request="img_upload"
        :on-preview="handlePreview"
        accept="image/jpeg, image/jpg, image/png"
        multiple
        :before-upload="img_beforeUpload"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div> -->
    <!-- <button @click="fangdou">掉接口</button> -->
    <div class="seach">
      
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="keywords"
            @keyup.enter.native="pick_seach"
            placeholder="请输入关键字"
            clearable
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
          <el-input
          v-model="anchor_id"
          @keyup.enter.native="pick_seach"
          type="number"
          placeholder="请输入主播id"
        ></el-input>
        <el-input
          v-model="live_id"
          placeholder="请输入直播房间id"
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
    </div>
    <!-- 主播列表开始 -->
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
          <el-table-column
            prop="reward_time"
            label="打赏时间"
            width="140"
          ></el-table-column>
          <el-table-column
            prop="add_time"
            label="添加时间"
            width="140"
          ></el-table-column>
          <el-table-column
            prop="nickname"
            label="用户昵称"
            width="130"
          ></el-table-column>
          <el-table-column
            prop="uid"
            label="用户id"
          ></el-table-column>

          <el-table-column
            prop="anchor_id"
            label="主播id"
          ></el-table-column>
          <el-table-column
            prop="live_id"
            label="房间id"
          ></el-table-column>
          <el-table-column
            prop="gift_name"
            label="礼物名称"
          ></el-table-column>
          <el-table-column
            prop="gift_coin"
            label="礼物价值椒点"
          ></el-table-column>
          <el-table-column
            prop="reward_num"
            label="打赏次数"
          ></el-table-column>
          <el-table-column
            prop="used_coin"
            label="总打赏椒点数"
          ></el-table-column>
          
          
          <el-table-column prop="title" label="直播房间标题" width="200"></el-table-column>
          <el-table-column
            prop="anchor_nickname"
            label="主播昵称"
            width="130"
          ></el-table-column>
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
import { reward_list ,upload_img} from "../../utils/axios";
import videojs from 'video.js';
import 'videojs-contrib-hls'
export default {
  data() {
    return {
      broadId: "",
      extendList: [], //打赏主播列表
      fn1: this.commonJs.Debounce(this.get_agent_list),
      queryInfo: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      //申請人姓名
      live_id: "",
      height:"",
      anchor_id: "",
      keywords: "",
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
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      other_img_upload_err:false,
      imgList:[],
      img:[],
      fileList:[],
      id:"",
      btn:false,
      times:5,
      nowTime:0,
      inter:"",//循环js
    };
  },
  created() {
    if (this.$route.query.ids) {
      this.anchor_id = this.$route.query.ids;
      this.pick_seach();
    } else {
      this.get_agent_list();
    }
    this.height = document.body.clientHeight - 240
  },
  mounted(){
    
  },
  methods: {
    
    fangdou(){
      if(this.id){
        console.log("猴急啥等五秒")
      }else{
        this.id = 10
        console.log("掉接口")
        this.inter = setInterval(() => {
          this.nowTime ++
          console.log("登登登" + this.nowTime)
          if(this.nowTime == this.times){
            this.nowTime = 0
            this.id = false
            console.log("重置")
            clearInterval(this.inter)
          }
        },1000)
      }
      

    },
    handleRemove(file, fileList) {
      this.fileList.forEach((comm,index) => {
        //编码URL用汉字转URL编码
        var str = encodeURIComponent(file.name)
        if(str == encodeURIComponent(comm.name)){
          this.fileList.splice(index,1)
          this.img.splice(index,1)
          // return
        }
      })
      console.log(this.img)
    },
    //上传图片
    img_upload: function (item) {
      let that = this;
      if (this.other_img_upload_err == false) {
        let fd = new FormData();
        fd.append("file", item.file);
        console.log(item.file)
        console.log(item.file.name)
        upload_img(
          fd
        ).then((res) => {
          if (res.data.err_code == 0) {
            that.dialogImageUrl = res.data.err_msg.url;
            let obj = {
              url:res.data.err_msg.url,
              name:item.file.name
            }
            
            that.fileList.push(obj)
            that.img.push(res.data.err_msg.url)
            // console.log("fileList")
            // setTimeout(() => {
            //   console.log(that.fileList)
            // },1000)
            // console.log("img")
            console.log(that.img)
            // this.dialogVisible = true;
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
    handlePreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //上传图片之前
    img_beforeUpload(file) {
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
    pick_seach(index) {
      let that = this;
      if (
        that.anchor_id == "" &&
        that.live_id == "" &&
        that.keywords === "" &&
        that.time_value == ""
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
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        anchor_id: that.anchor_id,
        live_id: that.live_id,
        keywords: that.keywords,
        start_time: time1,
        end_time: time2,
      };
      //搜索
      reward_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.reward_time = this.commonJs.timestampToTime(
                item.reward_time
              );
              item.add_time = this.commonJs.timestampToTime(item.add_time);
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
      this.get_shop_list_page(val, this.queryInfo.pageSize);
    },
    //分页
    get_shop_list_page(page, number) {
      let that = this;
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }

      reward_list({
        page: page,
        page_size: number,
        anchor_id: that.anchor_id,
        live_id: that.live_id,
        keywords: that.keywords,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.reward_time = this.commonJs.timestampToTime(
                item.reward_time
              );
              item.add_time = this.commonJs.timestampToTime(item.add_time);
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
    get_agent_list(index) {
      this.anchor_id = "";
      this.live_id = "";
      this.keywords = "";
      this.time_value = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      reward_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.reward_time = this.commonJs.timestampToTime(
                item.reward_time
              );
              item.add_time = this.commonJs.timestampToTime(item.add_time);
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
  },
};
</script>

<style scoped lang="less">
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
}
/* 分页 */
.goodsindex-page-box {
  width: 100%;
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
  width: 30%;
}
/deep/ .el-form-item__label {
  text-align-last: justify;
}
/deep/ .el-dialog__body {
  padding: 30px 50px;
}
</style>
