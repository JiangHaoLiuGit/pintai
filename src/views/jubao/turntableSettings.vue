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
      <el-form-item label="转盘底图" :label-width="formLabelWidth">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.bottom_url"
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
      <el-form-item label="指针图" :label-width="formLabelWidth">
        <el-image
          style="width: 120px; height: 160px"
          :src="form.pointer_url"
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
      <el-form-item label="转盘音乐" :label-width="formLabelWidth">
        <audio ref="audio" :src="form.turntable_audio" controls="controls"></audio>
        <el-upload
          class="upload-demo"
          action=""
          :http-request="file_upload"
          :before-upload="file_beforeUpload"
          :show-file-list = "false"
          list-type="picture">
          <el-button size="small" type="primary" @click="upload_audio(2)">上传转盘音乐</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="谢谢参与音乐" :label-width="formLabelWidth">
        <audio ref="audio" :src="form.thanks_audio" controls="controls"></audio>
        <el-upload
          class="upload-demo"
          action=""
          :http-request="file_upload"
          :before-upload="file_beforeUpload"
          :show-file-list = "false"
          list-type="picture">
          <el-button size="small" type="primary" @click="upload_audio(3)">上传谢谢参与音乐</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="现金奖励音乐" :label-width="formLabelWidth">
        <audio ref="audio" :src="form.cash_audio" controls="controls"></audio>
        <el-upload
          class="upload-demo"
          action=""
          :http-request="file_upload"
          :before-upload="file_beforeUpload"
          :show-file-list = "false"
          list-type="picture">
          <el-button size="small" type="primary" @click="upload_audio(4)">上传现金奖励音乐</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="特殊奖励音乐" :label-width="formLabelWidth">
        <audio ref="audio" :src="form.special_audio" controls="controls"></audio>
        <el-upload
          class="upload-demo"
          action=""
          :http-request="file_upload"
          :before-upload="file_beforeUpload"
          :show-file-list = "false"
          list-type="picture">
          <el-button size="small" type="primary" @click="upload_audio(5)">上传特殊奖励音乐</el-button>
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
          :data="turntableList"
          border
          style="width: 100%"
        >
          <el-table-column 
            label="序号"
            type="index" 
            width="80"
          >
          </el-table-column>
          <el-table-column label="转盘名称">
            <template slot-scope="scope">
              <el-input v-model="scope.row.position_name" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column 
            prop="cate" 
            label="奖励内容" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="reward_config" 
            label="奖励配置" 
            width="110"
          >
          </el-table-column>
          <el-table-column label="转盘图片">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.turntable_url"
                :preview-src-list="[scope.row.turntable_url]"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="广播滑动文字设置">
            <template slot-scope="scope">
              <el-input v-model="scope.row.slide" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作"  width="150">
              <template slot-scope="scope">
                <el-upload
                  class="upload-demo"
                  action=""
                  :http-request="table_img_upload"
                  :before-upload="table_file_beforeUpload"
                  :show-file-list = "false"
                  list-type="picture">
                  <el-button size="small" type="primary" @click="table_upload_img(scope.$index, scope.row)">上传图片</el-button>
                </el-upload>
              </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { turntable_content , turntable_config , upload_img ,  uploadfiles } from "../../utils/axios";
export default {
  data() {
    return {
      turntableList: [], //转盘列表
      loading : false,
      O_message : {},
      formLabelWidth: "100px",
      form: {
        title: "",//标题
        explain: "",//说明
        bottom_url: "",//转盘底图
        pointer_url: "",//指针图
        propaganda_url: "",//宣传图片
        background_audio: "",//背景音频
        turntable_audio: "",//转盘音频
        thanks_audio: "",//谢谢参与音频
        cash_audio: "",//现金奖励音频
        special_audio: "",//特殊奖励音频
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
    this.get_turntable_list(); //获取转盘列表
  },

  methods: {

    //获取转盘列表
    get_turntable_list (index) {
      let that = this
      that.loading = true
      turntable_content(
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.turntableList = res.data.err_msg.list
            that.form.title = res.data.err_msg.data.title //标题
            that.form.explain = res.data.err_msg.data.explain //说明
            that.form.bottom_url = res.data.err_msg.data.bottom_url //转盘底图
            that.form.pointer_url = res.data.err_msg.data.pointer_url //指针图
            that.form.propaganda_url = res.data.err_msg.data.propaganda_url //宣传图片
            that.form.background_audio = res.data.err_msg.data.background_audio //背景音频
            that.form.turntable_audio = res.data.err_msg.data.turntable_audio //转盘音频
            that.form.thanks_audio = res.data.err_msg.data.thanks_audio //谢谢参与音频
            that.form.cash_audio = res.data.err_msg.data.cash_audio //现金奖励音频
            that.form.special_audio = res.data.err_msg.data.special_audio //特殊奖励音频
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
      this.turntableList.forEach(element => {
        if(element.position_name == '' || element.slide == '') {
          leg = true
        }
      });
      if(that.form.bottom_url == '') {
        that.$message({
          message: '请上传转盘底图',
          type: 'warning'
        });
        return;
      } else if(that.form.pointer_url == '') {
        that.$message({
          message: '请上传指针图',
          type: 'warning'
        });
        return;
      } else if(that.form.propaganda_url == '') {
        that.$message({
          message: '请上传宣传图片',
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
      } else if(that.form.cash_audio == '') {
        that.$message({
          message: '请上传现金奖励音频',
          type: 'warning'
        });
        return;
      } else if(that.form.turntable_audio == '') {
        that.$message({
          message: '请上传转盘音频',
          type: 'warning'
        });
        return;
      } else if(that.form.thanks_audio == '') {
        that.$message({
          message: '请上传谢谢参与音频',
          type: 'warning'
        });
        return;
      } else if(that.form.special_audio == '') {
        that.$message({
          message: '请上传特殊奖励音频',
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
      this.turntableList.forEach(element => {
        let arrCopy = []
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
          element.turntable_url
        )
        arrCopy.push(
          'http://placehold.it/100x100'
        )
        arrCopy.push(
          element.slide
        )
        arr.push(
          arrCopy
        )
      });
      console.log(arr)
      turntable_config(
        {
          bottom_img :  that.form.bottom_url,//转盘底图
          pointer_img : that.form.pointer_url,//指针图
          propaganda_img : that.form.propaganda_url,//宣传图片
          title : that.form.title,//标题
          explain : that.form.explain,//说明
          background : that.form.background_audio,//背景音频
          turntable : that.form.turntable_audio,//转盘音频
          thanks : that.form.thanks_audio,//谢谢参与音频
          cash : that.form.cash_audio,//现金奖励音频
          special : that.form.special_audio,//特殊奖励音频
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
            that.get_turntable_list(); //获取转盘列表
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
                that.form.bottom_url = res.data.err_msg.url //背景图
              } else if (that.img_which_index == 2) {
                that.form.pointer_url = res.data.err_msg.url //指针图
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
                that.form.turntable_audio = res.data.err_msg.url //转盘音乐
              } else if (that.file_which_index == 3) {
                that.form.thanks_audio = res.data.err_msg.url //谢谢参与音乐
              } else {
                that.form.special_audio = res.data.err_msg.url //特殊奖励音乐
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
    table_file_beforeUpload (file) {
      console.log(file)
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

    //上传图片表格
    table_img_upload: function(item) {
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
              that.turntableList[that.tableImg_which_index].turntable_url = res.data.err_msg.url
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

    //表格上传下标 
    table_upload_img (index , row) {
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