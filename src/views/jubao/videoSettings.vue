<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
        <el-input v-model="pick_value" placeholder="请输入搜索关键字" @keyup.enter.native="pick_seach"></el-input>
        <el-button type="primary" @click="pick_seach">搜索</el-button>
      </div>
      <div class="button_type">
        <el-button type="primary" @click="pick_add">添加视频</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="videoList"
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
            label="添加时间" 
            width="160"
          >
          </el-table-column>
          <el-table-column 
            prop="title" 
            label="标题" 
          >
          </el-table-column>
          <el-table-column 
            prop="id" 
            label="ID" 
            width="80"
          >
          </el-table-column>
          <el-table-column 
            prop="size" 
            label="容量" 
            width="110"
          >
          </el-table-column>
          <el-table-column 
            prop="duration" 
            label="时长" 
            width="100"
          >
          </el-table-column>
           <el-table-column 
            prop="format" 
            label="格式" 
            width="100"
          >
          </el-table-column>
          
          <el-table-column 
            prop="play_num" 
            label="播放量" 
            width="100"
          >
          </el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="enable(scope.$index, scope.row)"
                v-show="scope.row.state == 2"
                >启用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-show="scope.row.state == 1"
                @click="stop_useing(scope.$index, scope.row)"
                >停用</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="see(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="modify(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="deleteVideo(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

     <!-- 编辑弹窗 -->
    <el-dialog :title="title" :visible.sync="opening_change_ifShow">
      <el-form :model="form_X">
        <el-form-item label="视频文件" :label-width="formLabelWidth" v-show ="!add_show">
          <el-input v-model="form_X.file" disabled></el-input>
        </el-form-item>
        <el-form-item label="上传视频" :label-width="formLabelWidth" v-show ="add_show">
          <el-button
            v-show="upload_show"
            size="mini"
            type="primary"
            >上传中,请稍后...</el-button
          >
          <el-upload
            v-show="!upload_show"
            class="upload-demo"
            action=""
            :http-request="video_upload"
            :show-file-list = "false"
            :before-upload="video_beforeUpload"
            list-type="picture">
            <el-button size="small" type="primary">上传文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form_X.title"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="form_X.introduce">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="opening_change_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_saveChanges_level" v-show ="!add_show">修改</el-button>
        <el-button type="primary" @click="submit_saveChanges_add" v-show ="add_show" >添加</el-button>
      </div>
    </el-dialog>

     <!-- 预览弹窗 -->
    <el-dialog title="查看视频" :visible.sync="preview">
      <video  style="width:300px;height:300px;" controls="controls" poster="../../assets/image/logo.png" :src= viode_from.videoSrc id="video">
          您的浏览器不支持H5播放器
      </video>
    </el-dialog>

  </div>
</template>

<script>
import { video_list , save_video_state , del_video ,  video_info , add_video , save_video , uploadfiles } from "../../utils/axios";
export default {
  data() {
    return {
      viode_from : {
        videoSrc : ''
      },
      videoList: [], //视频列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_video_list),
      O_message : {},
      formLabelWidth: "100px",
      pick_value : '',//搜索关键字
      form_X: {
        file : '',
        title : '',
        introduce : ''
      },
      title : '修改等级',
      opening_change_ifShow : false,
      preview : false,
      add_show : false,
      videoUrl : '',
      video_upload_err : false,
      upload_show : false,
      videoDetail : '',
      height:"",
    };
  },

  created() {
    
    this.get_video_list(); //获取视频列表
    this.height = document.body.clientHeight - 240
  },

  methods: {

    //获取视频列表
    get_video_list (index) {
      this.pick_value = ''
      let that = this
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      video_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.videoList = res.data.err_msg.list
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

    //搜索
    pick_seach () {
      let that = this
      if(that.pick_value == '') {
        that.$message({
          message: '输入搜索内容',
          type: 'warning'
        });
        return
      }
      that.loading = true
      video_list(
        {
          title : that.pick_value
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.videoList = res.data.err_msg.list
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

     //启用
    enable (index , row) {
      let that = this
      this.$confirm('此操作将启用' + row.title + '视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        save_video_state({
          id: row.id,
          state : 2,
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '启用成功',
                type: 'success'
              });
              that.get_video_list();
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
      this.$confirm('此操作将禁用' + row.title + '视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        save_video_state({
          id: row.id,
          state : 1,
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '停用成功',
                type: 'success'
              });
              that.get_video_list();
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

    //删除 
    deleteVideo (index , row) {
      let that = this
      this.$confirm('此操作将删除' + row.title + '视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del_video({
          id: row.id,
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '删除成功',
                type: 'success'
              });
              that.get_video_list();
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

    //查看
    see (index , row) {
      this.preview = true
      this.viode_from.videoSrc = row.url
    },

    //编辑
    modify (index , row) {
      let that = this
      that.form_X.level = ''
      this.title = '视频编辑'
      this.add_show = false
      that.opening_change_ifShow = true
      that.O_message = row
      video_info(
        {
          id : row.id
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.form_X.file = res.data.err_msg.name
            that.form_X.title = res.data.err_msg.title
            that.form_X.introduce = res.data.err_msg.description
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

    //修改
    submit_saveChanges_level () {
      let that = this
      if(that.form_X.title == '') {
        that.$message({
          message: '请填写视频标题',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.introduce == '') {
        that.$message({
          message: '请填写视频简介',
          type: 'warning'
        });
        return;
      }
      save_video(
        {
          id : that.O_message.id,
          title : that.form_X.title,
          description : that.form_X.introduce
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
            that.get_video_list(); //获取视频列表
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
    },

    //添加视频
    pick_add () {
      this.add_show = true
      this.title = '视频添加'
      this.form_X.file = ''
      this.form_X.title = ''
      this.form_X.introduce = ''
      this.opening_change_ifShow = true
    },

    //添加视频
    submit_saveChanges_add () {
      let that = this
      if(that.form_X.title == '') {
        that.$message({
          message: '请填写视频标题',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.introduce == '') {
        that.$message({
          message: '请填写视频简介',
          type: 'warning'
        });
        return;
      }
      if(that.videoUrl == '') {
        that.$message({
          message: '请上传视频',
          type: 'warning'
        });
        return;
      }
      add_video(
          {
            video : that.videoUrl,
            title : that.form_X.title,
            description : that.form_X.introduce,
            time : '23',
            name : that.videoDetail.name,
            size : that.videoDetail.size,
            ext : that.videoDetail.ext
          }
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.opening_change_ifShow = false
              that.$message({
                message: '添加成功',
                type: 'success'
              });
              that.get_video_list(); //获取视频列表
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
    },

    //上传视频
    video_upload: function(item) {
      console.log(item)
      let that = this
      if(this.video_upload_err == false) {
        this.upload_show = true
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        uploadfiles(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              this.upload_show = false
              that.videoUrl = res.data.err_msg.url
              that.videoDetail = res.data.err_msg
            } else {
              this.upload_show = true
              that.$message({
                showClose: true,
                message: res.data.err_msg,
                type: 'error'
              });
            }
          })
          .catch((error) => {
            this.upload_show = true
            console.log(error);
          });
      }
    },

    //视频上传之前
    video_beforeUpload (file) {
      console.log(file)
      let str = file.name
      var index = str.lastIndexOf(".");  
      console.log(index)
      str  = str .substring(index + 1, str.length);
      console.log(str)
      if(str != 'mp4') {
          this.$message.error('请上传视频格式!');
          this.video_upload_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('文件大小不能超过 200MB!');
        this.video_upload_err = true
      }
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
  width: 580px !important;
}

/deep/ .el-dialog__body {
  height: 320px;
  overflow-y: auto;
}

video {
  margin-left: 90px;
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