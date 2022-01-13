<template>
  <div class="goodsindex">
    <el-form :model="form">
      <el-form-item label="活动标题" :label-width="formLabelWidth">
        <el-input v-model="form.title" placeholder="请输入昵称或手机号"></el-input>
      </el-form-item>
      <el-form-item label="活动说明" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入活动说明"
          v-model="form.explain">
        </el-input>
      </el-form-item>
      <el-form-item label="背景图" :label-width="formLabelWidth">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.flopback_url"
          fit="cover"></el-image>
        <el-upload
          class="upload-demo"
          action=""
          :http-request="img_upload"
          :before-upload="img_beforeUpload"
          :show-file-list = "false"
          list-type="picture">
          <el-button size="small" type="primary" @click="upload_img(1)">上传图片</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="扑克背景图" :label-width="formLabelWidth">
        <el-image
          style="width: 120px; height: 160px"
          :src="form.pokerback_url"
          fit="cover"></el-image>
        <el-upload
          class="upload-demo"
          action=""
          :http-request="img_upload"
          :before-upload="img_beforeUpload"
          :show-file-list = "false"
          list-type="picture">
          <el-button size="small" type="primary"  @click="upload_img(2)">上传图片</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="宣传图片" :label-width="formLabelWidth">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.propaganda_url"
          fit="cover"></el-image>
        <el-upload
          class="upload-demo"
          action=""
          :http-request="img_upload"
          :before-upload="img_beforeUpload"
          :show-file-list = "false"
          list-type="picture">
          <el-button size="small" type="primary"  @click="upload_img(3)">上传图片</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="背景音乐" :label-width="formLabelWidth">
        <audio ref="audio" :src="form.background_audio" controls="controls"></audio>
        <el-upload
          class="upload-demo"
          action=""
          :http-request="file_upload"
          :before-upload="file_beforeUpload"
          :show-file-list = "false"
          list-type="picture">
          <el-button size="small" type="primary"  @click="upload_audio(1)">上传背景音乐</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="翻三张音乐" :label-width="formLabelWidth">
        <audio ref="audio" :src="form.three_audio" controls="controls"></audio>
        <el-upload
          class="upload-demo"
          action=""
          :http-request="file_upload"
          :before-upload="file_beforeUpload"
          :show-file-list = "false"
          list-type="picture">
          <el-button size="small" type="primary" @click="upload_audio(2)">上传翻三张音乐</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="翻五张音乐" :label-width="formLabelWidth">
        <audio ref="audio" :src="form.five_audio" controls="controls"></audio>
        <el-upload
          class="upload-demo"
          action=""
          :http-request="file_upload"
          :before-upload="file_beforeUpload"
          :show-file-list = "false"
          list-type="picture">
          <el-button size="small" type="primary" @click="upload_audio(3)">翻五张音乐</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div style="margin:10px;">
      <el-button size="small" type="danger" @click="modifys">修改</el-button>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="flopList"
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
            label="组合"
            prop="position_name" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            label="奖励选择"
            prop="cate" 
            width="120"
          >
          </el-table-column>
          <el-table-column label="奖励配置" width="120">
            <template slot-scope="scope">
              {{scope.row.reward == 3 ? '无' : scope.row.reward_config + '元' }}
            </template>
          </el-table-column>
          <el-table-column label="获奖图片">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.awards_url"
                :preview-src-list="[scope.row.awards_url]"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="图片上传" width="150">
            <template slot-scope="scope">
              <el-upload
                class="upload-demo"
                action=""
                :http-request="table_img_upload"
                :before-upload="table_img_beforeUpload"
                :show-file-list = "false"
                list-type="picture">
                <el-button size="small" type="primary" @click="table_upload_img(scope.$index, scope.row)">上传图片</el-button>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column label="广播滑动文字设置" width="160">
            <template slot-scope="scope">
              <el-input v-model="scope.row.slide" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="音乐设置" width="320">
            <template slot-scope="scope">
              <audio ref="audio" :src="scope.row.pos_audio" controls="controls"></audio>
            </template>
          </el-table-column>
          <el-table-column label="操作"  width="150">
              <template slot-scope="scope">
                <el-upload
                  class="upload-demo"
                  action=""
                  :http-request="table_audio_upload"
                  :before-upload="table_file_beforeUpload"
                  :show-file-list = "false"
                  list-type="picture">
                  <el-button size="small" type="primary" @click="table_upload_audio(scope.$index, scope.row)">上传音频</el-button>
                </el-upload>
              </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { poker_content , poker_config , upload_img ,  uploadfiles } from "../../utils/axios";
export default {
  data() {
    return {
      flopList: [], //翻牌列表
      loading : false,
      O_message : {},
      formLabelWidth: "100px",
      form: {
        title: "",//标题
        explain: "",//说明
        flopback_url: "",//翻牌背景图
        pokerback_url: "",//扑克牌背图
        propaganda_url: "",//宣传图片
        background_audio: "",//背景音频
        three_audio: "",//翻三张音频
        five_audio: "",//翻五张音频
      },
      other_img_upload_err : false,
      table_img_upload_err : false,
      other_file_upload_err : false,
      img_which_index : '',
      file_which_index : '',
      tableImg_which_index : '',
    };
  },

  created() {
    this.get_flop_list(); //获取翻牌列表
  },

  methods: {

    //获取翻牌列表
    get_flop_list (index) {
      let that = this
      that.loading = true
      poker_content(
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.flopList = res.data.err_msg.list
            that.form.title = res.data.err_msg.data.title //标题
            that.form.explain = res.data.err_msg.data.explain //说明
            that.form.flopback_url = res.data.err_msg.data.flopback_url //翻牌背景图
            that.form.pokerback_url = res.data.err_msg.data.pokerback_url //扑克牌背图
            that.form.propaganda_url = res.data.err_msg.data.propaganda_url //宣传图片
            that.form.background_audio = res.data.err_msg.data.background_audio //背景音频
            that.form.three_audio = res.data.err_msg.data.three_audio //翻三张音频
            that.form.five_audio = res.data.err_msg.data.five_audio //翻五张音频
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

    //修改
    modifys () {
      console.log('2222')
      let that = this
      let leg = false
      let arr =[]
      this.flopList.forEach(element => {
        if(element.slide == '') {
          leg = true
        }
      });
      if(that.form.flopback_url == '') {
        that.$message({
          message: '请上传转盘底图',
          type: 'warning'
        });
        return;
      } else if(that.form.pokerback_url == '') {
        that.$message({
          message: '请上传翻牌背景图',
          type: 'warning'
        });
        return;
      } else if(that.form.propaganda_url == '') {
        that.$message({
          message: '请上传扑克牌背图',
          type: 'warning'
        });
        return;
      } else if(that.form.title == '') {
        that.$message({
          message: '请输入标题',
          type: 'warning'
        });
        return;
      } else if(that.form.explain == '') {
        that.$message({
          message: '请输入说明',
          type: 'warning'
        });
        return;
      } else if(that.form.background_audio == '') {
        that.$message({
          message: '请上传背景音频',
          type: 'warning'
        });
        return;
      } else if(that.form.three_audio == '') {
        that.$message({
          message: '请上传翻三张音频',
          type: 'warning'
        });
        return;
      } else if(that.form.five_audio == '') {
        that.$message({
          message: '请上传翻五张音频',
          type: 'warning'
        });
        return;
      } else if (leg == true) {
        that.$message({
          message: '请将表格内容填写完整',
          type: 'warning'
        });
        return;
      }
      this.flopList.forEach(element => {
        let arrCopy = []
        //组合—-传过来的reward—-reward_config—-获奖图片—-广播滑动文字设置—-音乐设置
        arrCopy.push(
          element.position_name
        )
        arrCopy.push(
          element.reward
        )
        arrCopy.push(
          element.reward_config
        )
        arrCopy.push(
          element.awards_url
        )
        arrCopy.push(
          element.slide
        )
        arrCopy.push(
          element.pos_audio
        )
        arr.push(
          arrCopy
        )
      });
      console.log(arr)
      poker_config(
        {
          flopback_img :  that.form.flopback_url,//翻牌背景图
          pokerback_img : that.form.pokerback_url,//扑克牌背图
          propaganda_img : that.form.propaganda_url,//宣传图片
          title : that.form.title,//标题
          explain : that.form.explain,//说明
          background : that.form.background_audio,//背景音频
          three : that.form.three_audio,//翻三张音频
          five : that.form.five_audio,//翻五张音频
          result : JSON.stringify(arr)
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            that.get_flop_list(); //获取翻牌列表
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
    },

    //上传图片
    img_upload: function(item) {
      console.log(item)
      let that = this
      if (this.other_img_upload_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              if(that.img_which_index == 1) {
                that.form.flopback_url = res.data.err_msg.url //背景图
              } else if (that.img_which_index == 2) {
                that.form.pokerback_url = res.data.err_msg.url //扑克背景图
              } else {
                that.form.propaganda_url = res.data.err_msg.url //宣传图
              }
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

    //上传文件
    file_upload: function(item) {
      console.log(item)
      let that = this
      if (this.other_file_upload_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        uploadfiles(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              if(that.file_which_index == 1) {
                that.form.background_audio = res.data.err_msg.url //背景音乐
              } else if (that.file_which_index == 2) {
                that.form.three_audio = res.data.err_msg.url //翻三张音乐
              } else if (that.file_which_index == 3) {
                that.form.five_audio = res.data.err_msg.url //翻五张音乐
              }
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

    //上传文件之前
    file_beforeUpload (file) {
      console.log(file)
      let str = file.name
      var index = str.lastIndexOf(".");  
      console.log(index)
      str  = str .substring(index + 1, str.length);
      console.log(str)
      if(str != 'mp3' && str != 'wav') {
          this.$message.error('请上传音频格式!');
          this.other_file_upload_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('文件大小不能超过 200MB!');
        this.other_file_upload_err = true
      }
    },

    //上传图片之前
    img_beforeUpload (file) {
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

    //表格上传图片之前
    table_img_beforeUpload (file) {
      console.log(file)
      this.table_img_upload_err = false
      if(file.type != 'image/jpeg' && file.type != 'image/jpg' && 
          file.type != 'image/png' && file.type != 'image/gif' &&
          file.type != 'image/JPEG' && file.type != 'image/JPG' &&
          file.type != 'image/PNG' && file.type != 'image/GIF'
          ) {
          this.$message.error('请上传图片格式!');
          this.table_img_upload_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('图片大小不能超过 200MB!');
        this.table_img_upload_err = true
      }
    },

    //表格上传文件之前
    table_file_beforeUpload (file) {
      console.log(file)
      this.table_img_upload_err = false
      let str = file.name
      var index = str.lastIndexOf(".");  
      console.log(index)
      str  = str .substring(index + 1, str.length);
      console.log(str)
      if(str != 'mp3' && str != 'wav') {
          this.$message.error('请上传音频格式!');
          this.table_img_upload_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('文件大小不能超过 200MB!');
        this.table_img_upload_err = true
      }
    },

    //上传图片表格
    table_img_upload: function(item) {
      console.log(item)
      let that = this
      if (this.table_img_upload_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.flopList[that.tableImg_which_index].awards_url = res.data.err_msg.url
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

    //上传文件表格
    table_audio_upload: function(item) {
      console.log(item)
      let that = this
      if (this.table_img_upload_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        uploadfiles(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.flopList[that.tableImg_which_index].pos_audio = res.data.err_msg.url
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

    //图片上传下标
    upload_img (index) {//1 转盘底图 2 指针图 3 宣传图片
      console.log(index)
      this.img_which_index = index
    },

    //文件上传下标
    upload_audio (index) { //1 背景音乐 2 转盘音乐 3 谢谢参与音乐 4 现金奖励音乐 5 特殊奖励音乐
      console.log(index)
      this.file_which_index = index
    },

    //表格上传下标 - 图片
    table_upload_img (index , row) {
      console.log(index)
      this.tableImg_which_index = index
    },

    //表格上传下标 - 文件
    table_upload_audio (index , row) {
      console.log(index)
      this.tableImg_which_index = index
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
  width: 508px !important;
}

/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
/deep/ .el-form-item {
  width: 40%;
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