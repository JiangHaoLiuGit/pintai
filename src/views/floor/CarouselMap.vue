<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
        <el-select v-model="banner_pos" placeholder="请选择Banner位置">
          <el-option
            v-for="item in banner_pos_list"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="seach_status" placeholder="请选择状态">
          <el-option
            v-for="item in status_list"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
        <el-input v-model="seach_product_id" autocomplete="off" @keyup.enter.native="pick_seach" placeholder="请输入商品ID"></el-input>
        <el-button type="primary" @click="pick_seach">搜索</el-button>
      </div>
      <div class="button_type">
        <el-button type="success" @click="add_banner_">新增Banner</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="bannerList"
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
            label="开始时间"
            prop="start_time" 
            width="160"
          >
          </el-table-column>
          <el-table-column 
            label="结束时间"
            prop="end_time" 
            width="160"
          >
          </el-table-column>
          <el-table-column 
            label="商品ID"
            prop="product_id" 
            width="100"
          >
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template slot-scope="scope">
              {{scope.row.status == 1 ? '上架中' : '' }}
              {{scope.row.status == 2 ? '待上架' : '' }}
              {{scope.row.status == 3 ? '已下架' : '' }}
            </template>
          </el-table-column>
          <el-table-column 
            label="Banner名称"
            prop="banner_name" 
            width="120"
          >
          </el-table-column>
          <el-table-column 
            label="Banner位置"
            prop="banner_pos_copy" 
          >
          </el-table-column>
          <el-table-column 
            label="权重"
            prop="weight" 
            width="80"
          >
          </el-table-column>
          <el-table-column label="图片" width="200">
            <template slot-scope="scope">
              <el-image
              :src="scope.row.image"
              style="max-height: 90px"
              :preview-src-list="[scope.row.image]"
              fit="cover"></el-image>
            </template>
          </el-table-column>
          
          
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="compile(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="banner_del(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="title"  :visible.sync="dialogFormVisible" class="dialogForm">
      <el-form :model="form" :rules="rules" ref="ruleForm" >
        <el-form-item label="关联ID：" :label-width="formLabelWidth" prop="relation_id" >
          <el-input v-model="form.relation_id" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="Banner位置：" :label-width="formLabelWidth" prop="banner_pos">
          <el-select v-model="form.banner_pos">
            <el-option
              v-for="item in banner_pos_list"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联类型：" :label-width="formLabelWidth" prop="type">
          <el-select v-model="form.type">
            <el-option
              v-for="item in type_list"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Banner名称：" :label-width="formLabelWidth">
          <el-input v-model="form.banner_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权重：" :label-width="formLabelWidth" prop="weight" >
          <el-input v-model="form.weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="TAG：" :label-width="formLabelWidth">
          <el-select v-model="form.tag">
            <el-option
              v-for="item in tag_list"
              :key="item.id"
              :label="item.tag"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="URL地址：" :label-width="formLabelWidth">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="文件：" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action=""
            :http-request="file_upload"
            :before-upload="file_beforeUpload"
            :show-file-list = "false"
            list-type="picture">
            <el-button size="small" type="primary">上传文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="文件路径：" :label-width="formLabelWidth">
          <el-input v-model="form.file" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="开始时间(原)：" :label-width="formLabelWidth" v-show="!form.ifAdd">
          <el-input v-model="form.start_time_old" autocomplete="off" disabled ></el-input>
        </el-form-item>
        <el-form-item label="结束时间(原)：" :label-width="formLabelWidth" v-show="!form.ifAdd">
          <el-input v-model="form.end_time_old" autocomplete="off" disabled ></el-input>
        </el-form-item>
        <el-form-item label="时间：" :label-width="formLabelWidth" prop="time_value" >
          <el-date-picker
            :clearable = false
            v-model="form.time_value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片：" :label-width="formLabelWidth" prop="image" >
          <el-image
            style="width: 100px; height: 100px"
            :src="form.image"
            fit="cover"></el-image>
          <el-upload
            class="upload-demo"
            action=""
            :http-request="img_upload"
            :before-upload="img_beforeUpload"
            :show-file-list = "false"
            list-type="picture">
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  v-show="form.ifAdd" @click="add_('ruleForm')">添 加</el-button>
        <el-button type="primary"  v-show="!form.ifAdd" @click="save_('ruleForm')" >保 存</el-button>
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
import { banner_list ,  banner_pos , add_banner , save_banner , del_banner , upload_img ,  uploadfiles } from "../../utils/axios";
export default {
  data() {
    return {
      loading : false,
      fn1: this.commonJs.Debounce(this.get_banner_list),
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 20,
        total : 1
      },
      title : '新增分类',
      dialogFormVisible : false,//新增/编辑弹窗
      formLabelWidth: '140px',
      form: { 
        ifAdd: false,
        relation_id : '',//商品id
        banner_pos : '',//banner位置
        type : '',//banner位置
        banner_name : '',//banner名称
        weight : '',//权重
        tag : '',//TAG
        url : '',//跳转外部url
        file : '',//文件
        image : '',//图片
        start_time_old : '',//开始时间原
        end_time_old : '',//结束时间原
        time_value : [],
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
      rules: {
        time_value: [
          { required: true, message: '请选择日期' }
        ],
        banner_pos: [
          { required: true, message: '请选择Banner位置'}
        ],
        type: [
          { required: true, message: '请选择关联类型'}
        ],
        image: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        weight: [
          { required: true, message: '请填写权重', trigger: 'blur' }
        ]
      },
      other_file_upload_err : false,
      other_img_upload_err : false,
      pageSize : 20,
      bannerList : [],//banner列表
      seach_product_id : '',//商品id
      banner_pos : '',//banner位置
      seach_status : '',
      
      banner_pos_list : [],//banner位置列表
      type_list:[
        {
          id:1,
          value:"内部链接"
        },
        {
          id:2,
          value:"外部链接"
        },
        {
          id:3,
          value:"分类id"
        },
        {
          id:4,
          value:"橘宝"
        },
        {
          id:5,
          value:"直播"
        },
        {
          id:6,
          value:"橘宝商城"
        },
        {
          id:7,
          value:"商品"
        },
        {
          id:8,
          value:"乡村振兴"
        },{
          id:9,
          value:"悦淘"
        },
      ],
      status_list : [
        {
          id : 1,
          label : '上架中'
        },
        {
          id : 2,
          label : '待上架'
        },
        {
          id : 3,
          label : '已下架'
        }
      ],
      tag_list : []
    };
  },

  created() {
    this.get_banner_pos()//获取选择数据
    this.get_banner_list(); //获取banner列表
    this.height = document.body.clientHeight - 240
  },

  methods: {

    //获取选择数据
    get_banner_pos (index) {
      let that = this
      banner_pos(
        
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.banner_pos_list = res.data.err_msg.pos
            that.tag_list = res.data.err_msg.tag
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

    //获取banner列表
    get_banner_list (index) {
      let that = this
      this.banner_pos = ''
      this.seach_status = ''
      this.seach_product_id = ''
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20
      }
      banner_list(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.start_time = that.commonJs.timestampToTime (element.start_time)
              element.end_time = that.commonJs.timestampToTime (element.end_time)
              that.banner_pos_list.forEach(ele => {
                if(element.banner_pos == ele.id) {
                  element.banner_pos_copy = ele.value
                }
              })
            });
            that.bannerList = res.data.err_msg.list
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
    get_banner_list_page (page , number) {
      let that = this
      that.loading = true
      banner_list(
        {
          page : page,
          page_size: number,
          product_id : that.seach_product_id ,
          banner_pos : that.banner_pos,
          status : that.seach_status,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.start_time = that.commonJs.timestampToTime (element.start_time)
              element.end_time = that.commonJs.timestampToTime (element.end_time)
               that.banner_pos_list.forEach(ele => {
                if(element.banner_pos == ele.id) {
                  element.banner_pos_copy = ele.value
                }
              })
            });
            that.bannerList = res.data.err_msg.list
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
      this.get_banner_list_page(1,val)
    },

    //当前页
    handleCurrentChange(val) {
      console.log(val)
      this.get_banner_list_page(val,2)
    },

    //搜索
    pick_seach () {
      let that = this
      if(that.seach_status == '' && that.banner_pos == '' && that.seach_product_id == '' ) {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      banner_list(
        {
          product_id : that.seach_product_id ,
          banner_pos : that.banner_pos,
          status : that.seach_status,
          page : 1,
          page_size: this.pageSize,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            res.data.err_msg.list.forEach(element => {
              element.start_time = that.commonJs.timestampToTime (element.start_time)
              element.end_time = that.commonJs.timestampToTime (element.end_time)
              that.banner_pos_list.forEach(ele => {
                if(element.banner_pos == ele.id) {
                  element.banner_pos_copy = ele.value
                }
              })
            });
            that.bannerList = res.data.err_msg.list
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
              that.form.file = res.data.err_msg.url
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
      // if(str != 'mp3' && str != 'wav') {
      //     this.$message.error('请上传音频格式!');
      //     this.other_file_upload_err = true
      // } else 
      if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('文件大小不能超过 200MB!');
        this.other_file_upload_err = true
      }
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
              that.form.image = res.data.err_msg.url
              that.rules.image = [
                { required: false, message: '请上传图片', trigger: 'change' }
              ]
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

    //新增Banner
    add_banner_ () {
      let that = this
      that.rules = {
        time_value: [
          { required: true, message: '请选择日期' }
        ],
        banner_pos: [
          { required: true, message: '请选择Banner位置'}
        ],
        type: [
          { required: true, message: '请选择关联类型'}
        ],
        image: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        weight: [
          { required: true, message: '请填写权重', trigger: 'blur' }
        ]
      }
      that.form.relation_id = ''
      that.form.banner_pos = ''
      that.form.type = ''
      that.form.banner_name = ''
      that.form.weight = ''
      that.form.tag = ''
      that.form.url = ''
      that.form.file = ''
      that.form.image = ''
      that.form.time_value = []
      that.form.ifAdd = true
      that.title = '新增Banner'
      that.dialogFormVisible = true
    },

    //编辑
    compile (index , row) {
      let that = this
      that.O_message = row
      that.rules = {
        time_value: [
          { required: false, message: '请选择日期' }
        ],
        banner_pos: [
          { required: true, message: '请选择Banner位置'}
        ],
        type: [
          { required: true, message: '请选择关联类型'}
        ],
        image: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        weight: [
          { required: true, message: '请填写权重', trigger: 'blur' }
        ]
      }
      that.form.relation_id = row.relation_id
      that.form.banner_pos = row.banner_pos_copy
      this.type_list.forEach(item => {
        if(item.id == row.type){
          that.form.type = item.value
        }
      })
      
      that.form.banner_name = row.banner_name
      that.form.weight = row.weight
      that.tag_list.forEach(ele => {
        if(ele.id == row.banner_pos) {
          that.form.tag = ele.tag
        }
      })
      that.form.url = row.url
      that.form.file = row.file
      that.form.image = row.image
      that.form.start_time_old = row.start_time
      that.form.end_time_old = row.end_time
      that.form.ifAdd = false
      that.title = '编辑Banner'
      that.dialogFormVisible = true
    },

    //删除banner
    banner_del (index , row) {
      let that = this
      this.$confirm('此操作将删除名称为:' + row.banner_name + '的Banner, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del_banner({
          id: row.id,
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '删除成功',
                type: 'success'
              });
              that.get_banner_list();
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

    //添加bannner
    add_ (formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var time1 = "";
          var time2 = "";
          if (this.form.time_value != "") {
            time1 = this.commonJs.dataTime(this.form.time_value[0]);
            time2 = this.commonJs.dataTime(this.form.time_value[1]);
          }
          add_banner(
            {
              relation_id : that.form.relation_id,//商品id
              banner_pos : that.form.banner_pos,//banner位置
              type : that.form.type,//关联类型
              banner_name : that.form.banner_name,//banner名称
              weight : that.form.weight,//权重
              tag : that.form.tag,//TAG
              url : that.form.url,//跳转外部url
              image : that.form.image,
              start_time : this.form.time_value[0],
              end_time : this.form.time_value[1]
            }
          )
            .then((res) => {
              console.log(res);
              if (res.data.err_code == 0) {
                that.$message({
                  message: '添加成功',
                  type: 'success'
                });
                that.dialogFormVisible = false
                that.get_banner_list()
              } else {
                that.dialogFormVisible = false
                that.$message({
                  showClose: true,
                  message: res.data.err_msg,
                  type: 'error'
                });
              }
            })
            .catch((error) => {
              that.dialogFormVisible = false
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },

    //修改 banner
    save_ (formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let banner_pos = ''
          let tag = ''
          that.banner_pos_list.forEach(ele => {
            if(ele.id == that.form.banner_pos || ele.value == that.form.banner_pos ) {
              console.log(ele.id)
              banner_pos = ele.id
            }
          })
          that.tag_list.forEach(ele => {
            if(ele.id == that.form.tag || ele.tag == that.form.tag ) {
              tag = ele.id
            }
          })
          console.log(that.form)
          save_banner(
            {
              id : that.O_message.id,
              relation_id : that.form.relation_id,//商品id
              banner_pos : banner_pos,//banner位置
              type : that.form.type,//关联类型
              banner_name : that.form.banner_name,//banner名称
              weight : that.form.weight,//权重
              tag : tag,//TAG
              url : that.form.url,//跳转外部url
              image : that.form.image,
              start_time : that.form.time_value[0] ? that.form.time_value[0] : that.form.start_time_old,
              end_time : that.form.time_value[1] ? that.form.time_value[1] : that.form.end_time_old
            }
          )
            .then((res) => {
              console.log(res);
              if (res.data.err_code == 0) {
                that.$message({
                  message: '编辑成功',
                  type: 'success'
                });
                that.dialogFormVisible = false
                that.get_banner_list()
              } else {
                that.dialogFormVisible = false
                that.$message({
                  showClose: true,
                  message: res.data.err_msg,
                  type: 'error'
                });
              }
            })
            .catch((error) => {
              that.dialogFormVisible = false
              console.log(error);
            });
        } else {
          return false;
        }
      });
    }

  },
};
</script>

<style scoped lang="less">

/deep/ .el-table td, .el-table th.is-leaf{
    border-top: 1px solid #717b90;
    border-bottom:0;
}
// 
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

/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
}

/deep/ .el-form-item {
  width : 48% !important;
  margin-right: 2%;
}

.dialogForm {
  /deep/ .el-dialog {
    width: 1100px !important;
    /deep/ .el-dialog__body {
      display: flex;
      // justify-content: space-between
    }
    /deep/ .el-input {
      overflow-y: auto;  /*溢出隐藏*/
      // text-overflow: ellipsis; /*以省略号...显示*/
      // white-space: nowrap;  /*强制不换行*/
    }
  }
}

.el-date-editor {
  width : 312px;
  margin-left : 0px;
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