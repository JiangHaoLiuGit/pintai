<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
      </div>
      <div class="button_type">
        <el-button type="primary" @click="add_task">添加任务</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="taskList"
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
            prop="save_time" 
            label="修改日期" 
            width="160"
          >
          </el-table-column>
          <el-table-column 
            prop="title" 
            label="业务" 
          >
          </el-table-column>
          <el-table-column 
            prop="name" 
            label="任务名称" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            prop="task_type" 
            label="任务分类" 
            width="110"
          >
          </el-table-column>
          
           <el-table-column 
            prop="profit" 
            label="完成奖励(橘宝)" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="total_number" 
            label="累计完成次数" 
            width="140"
          >
          </el-table-column>
          <el-table-column 
            prop="total_grant" 
            label="累计发放橘宝" 
            width="110"
          >
          </el-table-column>
          <el-table-column 
            prop="num" 
            label="完成次数上限" 
            width="110"
          >
          </el-table-column>
          <el-table-column label="操作" width="180">
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
              <el-button
                size="mini"
                type="success"
                @click="compiler(scope.$index, scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

     <!-- 添加/编辑任务弹窗 -->
    <el-dialog :title="title" :visible.sync="opening_change_ifShow">
      <el-form :model="form_X">
        <el-form-item label="任务类型" :label-width="formLabelWidth" v-show="if_add">
          <el-select v-model="form_X.level" placeholder="请选择任务类型">
            <el-option
              v-for="item in levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" :label-width="formLabelWidth" v-show="!if_add">
          <el-input v-model="form_X.level" disabled></el-input>
        </el-form-item>
        <el-form-item label="任务名称" :label-width="formLabelWidth">
          <el-input v-model="form_X.name" placeholder="请输入任务名称(业务)"></el-input>
        </el-form-item>
        <el-form-item label="任务标题" :label-width="formLabelWidth">
          <el-input v-model="form_X.title" placeholder="请输入任务标题"></el-input>
        </el-form-item>
        <el-form-item label="简介文字" :label-width="formLabelWidth">
          <el-input v-model="form_X.font" placeholder="请输入简介文字"></el-input>
        </el-form-item>
        <el-form-item label="奖励介绍" :label-width="formLabelWidth">
          <el-input v-model="form_X.introduce" placeholder="请输入奖励介绍"></el-input>
        </el-form-item>
        <el-form-item label="次数上限" :label-width="formLabelWidth">
          <el-input v-model="form_X.limit" placeholder="请输入次数上限"></el-input>
        </el-form-item>
        <el-form-item label="奖励橘宝" :label-width="formLabelWidth">
          <el-input v-model="form_X.reward" placeholder="请输入奖励橘宝"></el-input>
        </el-form-item>
        <el-form-item label="安卓任务视频" :label-width="formLabelWidth" v-show="form_X.videoShow">
          <el-input v-model="form_X.androidVideo" placeholder="请输入安卓第三方任务视频"></el-input>
        </el-form-item>
        <el-form-item label="苹果任务视频" :label-width="formLabelWidth" v-show="form_X.videoShow">
          <el-input v-model="form_X.iosVideo" placeholder="请输入苹果第三方任务视频"></el-input>
        </el-form-item>
        <el-form-item label="任务图片" :label-width="formLabelWidth" v-show="form_X.uploadIfShow && !form_X.videoShow">
          <el-upload
            class="upload-demo"
            action=""
            :http-request="img_upload"
            :show-file-list = "false"
            :before-upload="img_beforeUpload"
            list-type="picture">
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片展示" :label-width="formLabelWidth" v-show="form_X.uploadIfShow && !form_X.videoShow">
           <el-image
            style="width: 100px; height: 100px"
            :src="url"></el-image>
        </el-form-item>
        <el-form-item label="任务视频" :label-width="formLabelWidth" v-show="!form_X.uploadIfShow">
          <el-select v-model="form_X.video" placeholder="请选择任务视频">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="opening_change_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="submit_saveChanges_add()" v-show="if_add">添加</el-button>
        <el-button type="primary" @click="submit_saveChanges_save()" v-show="!if_add">保存</el-button>
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
import { task_list , save_task_type , save_task_config , video_list , upload_img , add_task_config } from "../../utils/axios";
export default {
  data() {
    return {
      taskList: [], //任务列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_task_list),
      O_message : {},
      formLabelWidth: "100px",
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      options: [],
      levelList: [
      { 
        value: '1',
        label: '新手任务'
      },{ 
        value: '2',
        label: '每日任务'
      }, {
        value: '3',
        label: '循环任务'
      }, {
        value: '4',
        label: '首推视频'
      },
      {
        value: '5',
        label: '视频任务'
      },
      {
        value: '6',
        label: '第三方游戏视频'
      }],
      pageSize : 20,
      form_X: {
        level : '',//任务类型
        name : '',//任务名称
        title : '',//任务标题
        font : '',//简介文字
        introduce : '',//奖励介绍
        limit : '',//次数上限
        video : '',//任务视频
        reward : '',//奖励橘宝
        androidVideo : '',//安卓第三方任务视频
        iosVideo : '',//苹果第三方任务视频
        uploadIfShow : true,
        videoShow : false
      },
      title : '修改等级',
      opening_change_ifShow : false,
      if_add : true,
      url : '', //上传图片地址
      img_upload_err : false //上传是否是图片格式
    };
  },

  watch:{

    'form_X.level':{
      handler:function(news,olds){
        console.log(news)
        if(news == 4 ){ //首推视频
          this.form_X.uploadIfShow = false
          this.form_X.videoShow = false
        } else if (news == 5 ) { //视频任务
          this.form_X.videoShow = true
          this.form_X.uploadIfShow = true
        } else {
          this.form_X.uploadIfShow = true
          this.form_X.videoShow = false
        }
        
      },
      immediate: true,
      height:"",
    },

  },

  created() {
    this.get_task_list() //获取任务列表
    this.get_video_list() //获取视频列表
    this.height = document.body.clientHeight - 240
  },

  methods: {

    //获取任务列表
    get_task_list (index) {
      let that = this
      that.loading = true
      task_list(
        {
          page : 1,
          page_size: 20
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.taskList = res.data.err_msg.list
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

    //获取任务视频
    get_video_list (index) {
      let that = this
      video_list(
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.options = res.data.err_msg.list
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

    //分页
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      task_list(
        {
          page : page,
          page_size: number
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.taskList = res.data.err_msg.list
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

     //启用
    enable (index , row) {
      let that = this
      this.$confirm('此操作将启用' + row.title + '业务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        save_task_type({
          id: row.id,
          type : 2,
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '启用成功',
                type: 'success'
              });
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
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
      this.$confirm('此操作将禁用' + row.title + '业务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        save_task_type({
          id: row.id,
          type : 1,
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '停用成功',
                type: 'success'
              });
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
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

    //添加任务
    add_task () {
      this.if_add = true
      this.title = '任务添加'
      this.form_X.level = ''
      this.form_X.name = ''
      this.form_X.title = ''
      this.form_X.font = ''
      this.form_X.introduce = ''
      this.form_X.limit = ''
      this.form_X.video = ''
      this.form_X.reward = ''
      this.form_X.androidVideo = ''
      this.form_X.iosVideo = ''
      this.url = ''
      this.form_X.uploadIfShow = true
      this.form_X.videoShow = false
      this.opening_change_ifShow = true
    },

    //上传图片
    img_upload: function(item) {
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
            that.url = res.data.err_msg.url
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

    //图片上传之前
    img_beforeUpload: function(file) {
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

    //编辑
    compiler (index , row) {
      let that = this
      this.title = '任务编辑'
      this.O_message = row
      this.if_add = false
      this.form_X.level = ''
      this.form_X.name = ''
      this.form_X.title = ''
      this.form_X.font = ''
      this.form_X.introduce = ''
      this.form_X.limit = ''
      this.form_X.video = ''
      this.form_X.reward = ''
      this.form_X.androidVideo = ''
      this.form_X.iosVideo = ''
      this.url = ''
      this.form_X.uploadIfShow = true
      this.form_X.videoShow = false
      if(row.task_type == '新手任务') {
        this.form_X.level = '新手任务'
      } else if (row.task_type == '每日任务') {
        this.form_X.level = '每日任务'
      } else if (row.task_type == '循环任务') {
        this.form_X.level = '循环任务'
      } else if (row.task_type == '首推视频') {
        this.form_X.level = '首推视频'
        this.form_X.uploadIfShow = false
        this.form_X.videoShow = false
      } else if (row.task_type == '视频任务') {
        this.form_X.level = '视频任务'
        this.form_X.videoShow = true
        this.form_X.uploadIfShow = true
      } else if (row.task_type == '第三方游戏视频') {
        this.form_X.level = '第三方游戏视频'
      }
      this.form_X.name = row.name
      this.form_X.title = row.title
      this.form_X.font = row.remarks
      this.form_X.introduce = row.reward_remarks
      this.form_X.limit = row.num
      this.form_X.video = row.name
      this.form_X.reward = row.profit
      this.form_X.androidVideo = row.android_adsense
      this.form_X.iosVideo = row.ios_adsense
      this.url = row.image
      this.opening_change_ifShow = true

    },

    //任务添加
    submit_saveChanges_add () {
      let that = this
      let select_url = ''
      if(that.form_X.level == '') {
        that.$message({
          message: '请选择任务类型',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.name == '') {
        that.$message({
          message: '请填写任务名称',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.title == '') {
        that.$message({
          message: '请填写任务标题',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.font == '') {
        that.$message({
          message: '请填写简介文字',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.introduce == '') {
        that.$message({
          message: '请填写奖励介绍',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.limit == '') {
        that.$message({
          message: '请填写次数上限',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.reward == '') {
        that.$message({
          message: '请填写奖励橘宝',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.video == '' && that.form_X.level == 4) {
        that.$message({
          message: '请选择任务视频',
          type: 'warning'
        });
        return;
      }
      if(that.url == '' && that.form_X.level != 4 && that.form_X.level != 5) {
        that.$message({
          message: '请选择上传图片',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.androidVideo == '' && that.form_X.level == 5) {
        that.$message({
          message: '请填写安卓第三方任务视频',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.iosVideo == '' && that.form_X.level == 5) {
        that.$message({
          message: '请填写苹果第三方任务视频',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.video !='') {
        that.options.forEach(elelment => {
          if(elelment.id == that.form_X.video) {
            select_url = elelment.url
          }
        })
      }
      add_task_config(
        {
          select_type : that.form_X.level,//任务类型
          name : that.form_X.name,//任务名称
          title : that.form_X.title,//任务标题
          description : that.form_X.font,//备注简介
          reward_remarks : that.form_X.introduce,//奖励介绍
          bgimg : that.url,//任务图片
          select_url : select_url,//接口返回的 视频链接
          select : that.form_X.video,//接口返回的 视频id
          num : that.form_X.limit,//完成次数上限
          reward : that.form_X.reward,//完成任务的收益
          android : that.form_X.androidVideo,//android第三方任务视频
          ios : that.form_X.iosVideo//ios第三方任务视频
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
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize) //获取任务列表
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

    //任务编辑
    submit_saveChanges_save () {
      let that = this
      let select_url = ''
      // if(that.form_X.level == '') {
      //   that.$message({
      //     message: '请选择任务类型',
      //     type: 'warning'
      //   });
      //   return;
      // }
      if(that.form_X.name == '') {
        that.$message({
          message: '请填写任务名称',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.title == '') {
        that.$message({
          message: '请填写任务标题',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.font == '') {
        that.$message({
          message: '请填写简介文字',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.introduce == '') {
        that.$message({
          message: '请填写奖励介绍',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.limit == '') {
        that.$message({
          message: '请填写次数上限',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.reward == '') {
        that.$message({
          message: '请填写奖励橘宝',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.video == '' && that.form_X.level == 4) {
        that.$message({
          message: '请选择任务视频',
          type: 'warning'
        });
        return;
      }
      if(that.url == '' && that.form_X.level != 4 && that.form_X.level != 5) {
        that.$message({
          message: '请选择上传图片',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.androidVideo == '' && that.form_X.level == 5) {
        that.$message({
          message: '请填写安卓第三方任务视频',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.iosVideo == '' && that.form_X.level == 5) {
        that.$message({
          message: '请填写苹果第三方任务视频',
          type: 'warning'
        });
        return;
      }
      if(that.form_X.video !='') {
        that.options.forEach(elelment => {
          if(elelment.id == that.form_X.video) {
            select_url = elelment.url
          }
        })
      }
      save_task_config(
        {
          id: that.O_message.id,//任务id
          select_type : that.form_X.level,//任务类型
          name : that.form_X.name,//任务名称
          title : that.form_X.title,//任务标题
          description : that.form_X.font,//备注简介
          reward_remarks : that.form_X.introduce,//奖励介绍
          bgimg : that.url,//任务图片
          select_url : select_url,//接口返回的 视频链接
          select : that.form_X.video,//接口返回的 视频id
          num : that.form_X.limit,//完成次数上限
          reward : that.form_X.reward,//完成任务的收益
          android : that.form_X.androidVideo,//android第三方任务视频
          ios : that.form_X.iosVideo//ios第三方任务视频
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.opening_change_ifShow = false
            that.$message({
              message: '编辑成功',
              type: 'success'
            });
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize) //获取任务列表
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
  width: 800px !important;
}

/deep/ .el-dialog__body {
  height: 300px;
  overflow-y: auto;
}

/deep/ .el-form-item {
  margin-left: 10px;
}

/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/deep/ .el-form-item {
  
  .el-input {
    width: 223px;
  }
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