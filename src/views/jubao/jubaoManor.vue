<template>
  <div class="goodsindex">
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="manorList"
          border
          style="width: 100%"
        >
          <el-table-column 
            label="序号"
            type="index" 
          >
          </el-table-column>
          <el-table-column 
            prop="id" 
            label="种类" 
          >
          </el-table-column>
          <el-table-column 
            prop="name" 
            label="名称" 
          >
          </el-table-column>
          <el-table-column 
            prop="start" 
            label="起存点" 
          >
          </el-table-column>
           <el-table-column 
            prop="profit" 
            label="收益" 
          >
          </el-table-column>
          <el-table-column 
            prop="reduce_time" 
            label="每次浇水可加速(S)" 
          >
          </el-table-column>
          <el-table-column 
            prop="estimate_time" 
            label="不浇水收获时间(S)" 
          >
          </el-table-column>
          <el-table-column label="背景图">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.background_img"
                fit="cover"></el-image>
            </template>
          </el-table-column>
           <el-table-column label="无种植图片">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.empty_img"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="开始种植图片">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.start_img"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="种植中图片">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.exist_img"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="待收货图片">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.stay_img"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="浇水GIF">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.watering_img"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="收获GIF">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.harvest_img"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="操作"  width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 编辑弹窗 -->
    <el-dialog :title="title" :visible.sync="manor_change_ifShow">
      <div class="dialog_left">
         <el-form :model="form_manor_detail">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form_manor_detail.name" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="起存点" :label-width="formLabelWidth">
            <el-input v-model="form_manor_detail.startingPoint" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="收益" :label-width="formLabelWidth">
            <el-input v-model="form_manor_detail.profit" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="最长时间" :label-width="formLabelWidth">
            <el-input v-model="form_manor_detail.longestTime" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="浇水可加速" :label-width="formLabelWidth">
            <el-input v-model="form_manor_detail.accelerateTime" autocomplete="off" ></el-input>
          </el-form-item>
        </el-form>
        <!-- 等级列表 -->
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              ref="multipleTable"
              :data="img_list"
              border
              style="width: 100%"
            >
              <el-table-column 
                label="序号"
                type="index" 
                width="80"
              >
              </el-table-column>
              <el-table-column 
                prop="level" 
                label="类别" 
                width="100"
              >
              </el-table-column>
              <el-table-column label="图片名称" width="150">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="图片">
                <template slot-scope="scope">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.url"
                    fit="cover"></el-image>
                </template>
              </el-table-column>
              <el-table-column label="操作"  width="150">
              <template slot-scope="scope">
                <el-upload
                  class="upload-demo"
                  action=""
                  :http-request="grade_img_upload"
                  :show-file-list = "false"
                  :before-upload="grade_img_beforeUpload"
                  list-type="picture">
                  <el-button size="small" type="primary" @click="grade_img_index(scope.$index, scope.row)">上传图片</el-button>
                </el-upload>
              </template>
            </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 其他列表 -->
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              ref="multipleTable"
              :data="otherImg_List"
              border
              style="width: 100%"
            >
              <el-table-column 
                label="序号"
                type="index" 
                width="80"
              >
              </el-table-column>
              <el-table-column 
                prop="name" 
                label="类别" 
                width="100"
              >
              </el-table-column>
              <el-table-column label="图片">
                <template slot-scope="scope">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.img_url"
                    v-show ="scope.row.num == 1"
                    fit="cover"></el-image>
                  <div v-show ="scope.row.num == 2" :id='"Img"+ scope.$index' style="width: 100px;height: 100px;"></div>
                </template>
              </el-table-column>
              <el-table-column label="操作"  width="150">
              <template slot-scope="scope">
                <el-upload
                  v-show ="scope.row.num == 1"
                  class="upload-demo"
                  action=""
                  :http-request="other_img_upload"
                  :show-file-list = "false"
                  :before-upload="other_img_beforeUpload"
                  list-type="picture">
                  <el-button size="small" type="primary" @click="other_img_index(scope.$index, scope.row)">上传图片</el-button>
                </el-upload>
                <el-upload
                  v-show ="scope.row.num == 2"
                  class="upload-demo"
                  action=""
                  :http-request="other_file_upload"
                  :show-file-list = "false"
                  :before-upload="other_file_beforeUpload"
                  list-type="picture">
                  <el-button size="small" type="primary" @click="uploadFile(scope.$index, scope.row)">上传文件</el-button>
                </el-upload>
              </template>
            </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="manor_change_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_saveChanges_manor">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SVGA from 'svgaplayerweb'
import { manor_list , manor_edit_content ,  manor_save_config , upload_img , uploadfiles } from "../../utils/axios";
export default {
  data() {
    return {
      manorList: [], //庄园列表
      loading : false,
      dialogFormVisible: false,
      formLabelWidth: "100px",
      manor_change_ifShow : false,//编辑弹窗显示与否
      form_manor_detail: {
        name: '',
        startingPoint : '',//起存点
        profit : '',//收益
        longestTime : '',//最长时间
        accelerateTime : ''//浇水可加速
      },
      title : '修改',
      O_message : {},
      otherImg_List : [
        {
          name : '背景图',
          img_url : '',
          num : 1
        },
        {
          name : '无种植图',
          img_url : '',
          num : 1
        },
        {
          name : '待收获',
          img_url : '',
          num : 1
        },
        {
          name : '浇水GIF',
          img_url : '',
          num : 1
        },
        {
          name : '收获GIF',
          img_url : '',
          num : 1
        },
        {
          name : '浇水SVGA',
          img_url : '',
          num : 2
        },
        {
          name : '收获SVGA',
          img_url : '',
          num : 2
        }
      ],
      img_list : [],
      nowIndex : -1,//等级上传图片下标
      nowIndex2 : -1,
      img_upload_err : false ,//等级——上传的是否是图片格式
      other_img_upload_err : false ,//其他——上传的是否是图片格式
    };
  },

  created() {
    this.get_store_list(); //获取庄园列表
  },

  methods: {
    //获取庄园列表
    get_store_list () {
      let that = this
      that.loading = true
      manor_list(
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.manorList = res.data.err_msg.list
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

    //编辑
    handleEdit (index,row) {
      let that = this
      that.O_message = row
      that.manor_change_ifShow = true
      that.form_manor_detail.name = ''
      that.form_manor_detail.startingPoint = ''
      that.form_manor_detail.profit = ''
      that.form_manor_detail.longestTime = ''
      that.form_manor_detail.accelerateTime = ''
      that.otherImg_List.forEach(element => {
        element.img_url = ''
      });
      that.img_list = []
      manor_edit_content({
        id: row.id
      })
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.img_list = res_s.data.err_msg.imgs

            that.form_manor_detail.name = res_s.data.err_msg.name
            that.form_manor_detail.startingPoint = res_s.data.err_msg.start
            that.form_manor_detail.profit = res_s.data.err_msg.profit
            that.form_manor_detail.longestTime = res_s.data.err_msg.estimate_time
            that.form_manor_detail.accelerateTime = res_s.data.err_msg.reduce_time

            that.otherImg_List[0].img_url = res_s.data.err_msg.background_img
            that.otherImg_List[1].img_url = res_s.data.err_msg.empty_img
            that.otherImg_List[2].img_url = res_s.data.err_msg.stay_img
            that.otherImg_List[3].img_url = res_s.data.err_msg.watering_img
            that.otherImg_List[4].img_url = res_s.data.err_msg.harvest_img

            that.otherImg_List[5].img_url = res_s.data.err_msg.watering_svga
            that.otherImg_List[6].img_url = res_s.data.err_msg.harvest_svga
            that.getSvga()
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
    },

    submit_saveChanges_manor () {
      let that = this
      console.log(this.img_list)
      console.log(this.otherImg_List)
      let leg = false
      this.img_list.forEach(element => {
        if(element.name == '') {
          leg = true
        }
      })
      if(that.form_manor_detail.name == '') {
        that.$message({
          message: '请输入名称',
          type: 'warning'
        });
        return;
      } else if(that.form_manor_detail.startingPoint == '') {
        that.$message({
          message: '请输入起存点',
          type: 'warning'
        });
        return;
      } else if(that.form_manor_detail.profit == '') {
        that.$message({
          message: '请输入收益',
          type: 'warning'
        });
        return;
      } else if(that.form_manor_detail.longestTime == '') {
        that.$message({
          message: '请输入最长时间',
          type: 'warning'
        });
        return;
      } else if(that.form_manor_detail.accelerateTime == '') {
        that.$message({
          message: '请输入浇水可加速',
          type: 'warning'
        });
        return;
      } else if(leg == true) {
        that.$message({
          message: '请输入图片名称',
          type: 'warning'
        });
        return;
      }
      manor_save_config(
        {
          id : that.O_message.id,
          name : that.form_manor_detail.name,//名称
          start : that.form_manor_detail.startingPoint,//起存点
          profit : that.form_manor_detail.profit,//收益
          reduce_time : that.form_manor_detail.accelerateTime,//浇水可加速(秒)
          estimate_time : that.form_manor_detail.longestTime,//最长时间(秒)
          bgimg : that.otherImg_List[0].img_url,//背景图
          no_plant_img : that.otherImg_List[1].img_url,//无种植图
          wait_harvest_img : that.otherImg_List[2].img_url,//开始种植图片
          watering_img : that.otherImg_List[3].img_url,//浇水图片
          harvest_img : that.otherImg_List[4].img_url,//收获图片
          watering_svga : that.otherImg_List[5].img_url,//浇水svga
          harvest_svga : that.otherImg_List[6].img_url,//收获svga
          level_1text : that.img_list[0].name,//图片名称1
          level_2text : that.img_list[1].name,//图片名称2
          level_3text : that.img_list[2].name,//图片名称3
          level_4text	 : that.img_list[3].name,//图片名称4
          level_5text : that.img_list[4].name,//图片名称5
          level_6text : that.img_list[5].name,//图片名称6
          level_7text : that.img_list[6].name,//图片名称7
          level_8text : that.img_list[7].name,//图片名称8
          level_1pic : that.img_list[0].url,//图片1
          level_2pic : that.img_list[1].url,//图片2
          level_3pic : that.img_list[2].url,//图片3
          level_4pic : that.img_list[3].url,//图片4
          level_5pic : that.img_list[4].url,//图片5
          level_6pic : that.img_list[5].url,//图片6
          level_7pic : that.img_list[6].url,//图片7
          level_8pic : that.img_list[7].url//图片8
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            that.manor_change_ifShow = false
            that.get_store_list(); //获取庄园列表
          } else {
            that.manor_change_ifShow = false
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.manor_change_ifShow = false
          console.log(error);
        });

    },

    //等级图片上传之前
    grade_img_beforeUpload (file) {
      console.log(file)
      if(file.type != 'image/jpeg' && file.type != 'image/jpg' && 
          file.type != 'image/png' && file.type != 'image/gif' &&
          file.type != 'image/JPEG' && file.type != 'image/JPG' &&
          file.type != 'image/PNG' && file.type != 'image/GIF'
          ) {
          this.$message.error('请上传图片格式!');
          this.img_upload_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('图片大小不能超过 200MB!');
        this.img_upload_err = true
      }
    },

    //等级图片上传
    grade_img_upload: function(item) {
      console.log(item)
      let that = this
      if(this.img_upload_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        upload_img(
          fd
        )
          .then((res) => {
            if (res.data.err_code == 0) {
              console.log(that.nowIndex)
              that.img_list[that.nowIndex].url = res.data.err_msg.url
            } else {
              that.$message({
                showClose: true,
                message: res.data.err_msg,
                type: 'error'
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    //等级上传图片下标
    grade_img_index: function(index,row) {
      console.log(row , index)
      this.nowIndex = index
      this.img_upload_err = false
    },

    //其他列表图片上传之前
    other_img_beforeUpload (file) {
      console.log(file)
      if(file.type != 'image/jpeg' && file.type != 'image/jpg' && 
          file.type != 'image/png' && file.type != 'image/gif' &&
          file.type != 'image/JPEG' && file.type != 'image/JPG' &&
          file.type != 'image/PNG' && file.type != 'image/GIF'
          ) {
          this.$message.error('请上传图片格式!');
          this.other_img_upload_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('图片大小不能超过 200MB!');
        this.other_img_upload_err = true
      }
    },

    //其他列表——上传图片
    other_img_upload: function(item) {
      console.log(item)
      if(this.other_img_upload_err == false) {
        let that = this
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.otherImg_List[that.nowIndex2].img_url = res.data.err_msg.url
            } else {
              that.$message({
                showClose: true,
                message: res.data.err_msg,
                type: 'error'
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    //其他上传图片下标
    other_img_index: function(index,row) {
      console.log(row , index)
      this.nowIndex2 = index
      this.other_img_upload_err = false
    },

    //上传文件
    other_file_upload: function(item) {
      console.log(item)
      let that = this
      if (this.other_img_upload_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        uploadfiles(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.otherImg_List[that.nowIndex2].img_url = res.data.err_msg.url
            } else {
              that.$message({
                showClose: true,
                message: res.data.err_msg,
                type: 'error'
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    //svga上传之前
    other_file_beforeUpload (file) {
      console.log(file)
      let str = file.name
      var index = str.lastIndexOf(".");  
      console.log(index)
      str  = str .substring(index + 1, str.length);
      console.log(str)
      if(str != 'svga' && str != 'SVGA') {
          this.$message.error('请上传SVGA格式!');
          this.other_img_upload_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('文件大小不能超过 200MB!');
        this.other_img_upload_err = true
      }
    },


    uploadFile: function(index,row) {
      console.log(row , index)
      this.nowIndex2 = index
      this.other_img_upload_err = false
    },

    //获取Svga图标
    getSvga(data){
      let that = this
      //一定要使用$nextTick，等到页面加载完成再处理数据，否则会找不到页面元素，报Undefind的错误
      this.$nextTick(()=>{
        var player = new SVGA.Player('#Img5'); // 多个svga文件同时加载
        var parser = new SVGA.Parser('#Img5'); // 多个svga文件同时加载
        var player1 = new SVGA.Player('#Img6'); // 多个svga文件同时加载
        var parser1 = new SVGA.Parser('#Img6'); // 多个svga文件同时加载
        console.log(that.otherImg_List[5].img_url)
        console.log(that.otherImg_List[6].img_url)
        parser.load(that.otherImg_List[5].img_url,function(item){
            player.setVideoItem(item);
            player.startAnimation();
        })
        parser1.load(that.otherImg_List[6].img_url,function(item){
            player1.setVideoItem(item);
            player1.startAnimation();
        })
      })
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

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
  }
}
/deep/ .el-dialog {
  width: 800px !important;
  /deep/ .el-input {
    overflow-y: auto;  /*溢出隐藏*/
    // text-overflow: ellipsis; /*以省略号...显示*/
    // white-space: nowrap;  /*强制不换行*/
  }
}

/deep/ .el-dialog__body {
  height: 400px;
  overflow-y: auto;
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