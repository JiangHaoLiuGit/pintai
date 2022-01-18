<template>
  <div class="page">
    <div class="pageItem" style="margin-top: 20px">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">文章库</span>
      </div>
      <div class="textItem">
        <div class="seach">
            <div class="seach_copy">
                <div class="seach_select">
                    <el-input
                        v-model="seachVale"
                        placeholder="请输入ID/关键字"
                        clearable
                    ></el-input>
                </div>
                <div class="button_type">
                    <el-button
                        class="rt"
                        style="margin-right: 10px"
                        @click="fn1(1)"
                        >刷新</el-button
                    >
                    <el-button type="danger" class="rt" style="margin-right: 10px" @click="shan('1')">删除</el-button>
                    <el-button
                        type="warning"
                        class="rt"
                        style="margin-right: 10px"
                        @click="edits"
                        >修改</el-button
                    >
                    <!-- sy，纵欲报应:阳痿，早泄，神经衰弱，脑力下降，骨密度低，脸上爆痘，长相猥琐没精神， -->
                    <el-button
                        type="primary"
                        class="rt"
                        style="margin-right: 10px"
                        @click="pick_seach"
                        >搜索</el-button
                    >
                    
                    <el-button
                        type="primary"
                        class="rt"
                        style="margin-right: 10px"
                        @click="adds"
                        >发布</el-button
                    >
                </div>
            </div>
        </div>
            
        </div>
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="extendList"
              border
              
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="序号" type="index" width="80" align="center">
              </el-table-column>
              <el-table-column prop="article_id" label="ID" align="center">
              </el-table-column>
              <!-- <el-table-column label="分类名称" align="center" width="300">
                <template slot-scope="scope">
                  <div>{{scope.row.is_always}}</div>
                </template>
              </el-table-column> -->
              <el-table-column label="入口展示" align="center" width="100">
                <template slot-scope="scope">
                    <div v-if="scope.row.type == 1">
                        <el-image
                            style="width:80px;height:80px"
                            :src="scope.row.image_url"
                            :preview-src-list="[scope.row.image_url]"
                            fit="cover">
                        </el-image>
                    </div>
                    <div v-else-if="scope.row.type == 2">
                        <video  style="width:80px;height:80px;" controls="controls" :poster="scope.row.image_url" :src="scope.row.video_url" id="video">
                        您的浏览器不支持H5播放器
                        </video>
                    </div>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="标题" align="center">
              </el-table-column>
              <el-table-column prop="vice_title" label="摘要" align="center">
              </el-table-column>
              <el-table-column prop="create_time" label="创建时间" align="center">
              </el-table-column>
              <el-table-column label="虚拟浏览量/实际浏览量" align="center">
                <template slot-scope="scope">
                  <div>{{scope.row.start_browse}}/{{scope.row.actual_browse}}</div>
                </template>
              </el-table-column>
              <el-table-column label="虚拟转发量/实际转发量" align="center">
                <template slot-scope="scope">
                  <div>{{scope.row.start_forward}}/{{scope.row.actual_forward}}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <el-row :gutter="20" class="goodsindex-list" style="margin-top: 20px">
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

        <!-- 增加/编辑问答 -->
        <el-dialog
          width="70%"
          class="remarks_box add"
          :visible.sync="add_tan"
          append-to-body
        >
          <div class="info" v-if="addType == 1">增加文章</div>
          <div class="info" v-else-if="addType == 2">编辑文章</div>
          <div style="padding: 0 0 30px;height:100%">
            <div class="blockBox divs clearfix">
              <div class="iphone">
                <div class="head">
                  <el-image
                    v-if="add_wen.type == 2"
                    style="width:100%;height:100%"
                    :src="image_url"
                    :preview-src-list="[image_url]"
                    fit="cover">
                  </el-image>
                  <video v-else-if="add_wen.type == 1" controls="controls" :poster="video_img" :src="video_url" id="video">
                    您的浏览器不支持H5播放器
                  </video>
                </div>
                <div class="cen">
                  <span class="titles shen2">
                    {{add_wen.title}}
                  </span>
                  <div class="infos clearfix">
                    <div class="rt">
                      <i class="el-icon-edit-outline lt"></i>
                      <span class="lt">{{add_wen.start_forward}}转发</span>
                    </div>
                    <div class="rt">
                      <i class="el-icon-view lt"></i>
                      <span class="lt">{{add_wen.start_browse}}浏览</span>
                    </div>
                  </div>
                </div>
                
                <div class="bot" v-html="add_wen.info">
                  
                </div>
              </div>
              <div class="forms">
                <el-form :model="add_wen" class="form por clearfix">
                  <el-form-item label="展示样式:" class="clearfix" :label-width="formLabelWidth1">
                      <el-radio label="1" v-model="add_wen.type">视频</el-radio>
                      <el-radio label="2" v-model="add_wen.type">图片</el-radio>
                  </el-form-item>
                  <el-form-item
                    label="上传图片或视频:"
                    :label-width="formLabelWidth1"
                  > 
             
                    <div v-if="add_wen.type == 1">
                      <div class="lt" style="margin-right:20px;">
                        <el-upload
                          class="upload-demo"
                          action=""
                          :http-request="img_upload1"
                          :show-file-list="false"
                          list-type="picture"
                          
                        >
                        
                          <button class="bigButton lt">
                            <el-image
                              style="width: 200px; height: 100px;margin-right:20px"
                              :src="video_img"
                              fit="cover"
                            >
                              <div
                                slot="error"
                                class="image-slot"
                                style="
                                  width: 200px;
                                  height: 100px;
                                  line-height:100px;
                                  text-align: center;
                                "
                              >
                                视频封面
                              </div>
                            </el-image>
                          </button>
                          
                        </el-upload>
                      </div>
                      <div class="lt por">
                        <el-upload
                          class="upload-demo"
                          action=""
                          :http-request="img_upload2"
                          :show-file-list="false"
                          list-type="picture"
                          style="marign-left:20px"
                        >
                        
                          <button class="bigButton por lt">
                            <video controls="controls" :poster="video_url" v-if="video_url != ''" :src="video_url" id="video">
                              您的浏览器不支持H5播放器
                            </video>
                              
                              <div
                                slot="error"
                                class="image-slot poa"
                                v-if="video_url == ''"
                                style="
                                  width: 200px;
                                  height: 100px;
                                  left:0;
                                  border-radius:20px;
                                  top:0;
                                  text-align: center;
                                "
                              >
                                <i
                                  class="el-icon-circle-plus"
                                  style="font-size: 25px; margin-top: 32px"
                                ></i>
                              </div>
                              
                          </button>
                          
                        </el-upload>
                        <i
                            v-if="video_url != ''"
                            class="el-icon-delete-solid poa"
                            @click="video_url = ''"
                            style="font-size: 18px;top:5px;right:5px;color:#fff;z-index:1000;cursor:pointer;"
                          ></i>
                      </div>
                    </div>
                    <div v-else-if="add_wen.type == 2">
                      <el-upload
                        class="upload-demo lt"
                        action=""
                        :http-request="img_upload3"
                        
                        :show-file-list="false"
                        list-type="picture"
                      >
                      <!-- :before-upload="img_beforeUpload3" -->
                        <button class="bigButton lt">
                          <el-image
                            style="width: 200px; height: 100px"
                            :src="image_url"
                            fit="cover"
                          >
                            <div
                              slot="error"
                              class="image-slot"
                              style="
                                width: 200px;
                                height: 100px;
                                text-align: center;
                              "
                            >
                              <i
                                class="el-icon-circle-plus"
                                style="font-size: 25px; margin-top: 32px"
                              ></i>
                            </div>
                          </el-image>
                        </button>
                        
                      </el-upload>
                    </div>
                  </el-form-item>
                  
                  <el-form-item
                    label="标题:"
                    :label-width="formLabelWidth1"
                  >
                    <el-input
                      type="text"
                      placeholder="请输入标题"
                      v-model="add_wen.title"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="摘要:"
                    :label-width="formLabelWidth1"
                  >

                    <el-input
                      type="text"
                      class="lt"
                      placeholder="请输入摘要"
                      v-model="add_wen.vice_title"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="起始浏览数:"
                    class="yiban lt"
                    :label-width="formLabelWidth1"
                  >
                    <el-input
                      type="number"
                      class="lt"
                      placeholder="请输入起始浏览次数"
                      v-model="add_wen.start_browse"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="起始转发数:"
                    class="yiban lt"
                    style="padding-left:30px;box-sizing: border-box;"
                    :label-width="formLabelWidth1"
                  >
                    <el-input
                      type="number"
                      class="lt"
                      placeholder="请输入起始转发数"
                      v-model="add_wen.start_forward"
                    ></el-input>
                  </el-form-item>
                  <h3 style="font-size:14px;font-weight:500;color:#606266">详情编辑:</h3>
                  <quill-editor
                      :values="add_wen.info"
                      @blurs="getHtml"
                      style="height:calc(100% - 340px)"
                      :uploadImageParam="editorUploadImageData"
                    />
                </el-form>
              </div>
            </div>
            <div
              slot="footer"
              class="dialog-footer clearfix"
              style="padding: 10px 40px 10px 30px; margin-top: 20px"
            >
              <el-button
                type="success"
                class="rt"
                @click="addWen('')"
                v-if="addType == 1"
                style="margin-left: 15px"
                >增 加</el-button
              >
              <el-button
                type="success"
                class="rt"
                @click="addWen(orderListInfo.article_id)"
                 v-else-if="addType == 2"
                style="margin-left: 15px"
                >修 改</el-button
              >
              <el-button type="danger" class="rt" @click="add_tan = false"
                >取 消</el-button
              >
            </div>
          </div>
        </el-dialog>
        <!-- 反复确认框。烦啊 -->
        <div class="boxs" v-show="kuang_show">
          <div class="content" @click="kuang_show = false">
            <div class="kuang" @click.stop="kuang_show = true">
              <img src="../../assets/image/gantan.png" alt="" />
              <div class="text">是否确认删除？</div>
              <el-button
                type="danger"
                @click.stop="kuang_show = false"
                style="margin-bottom: 10px; margin-right: 36px"
              >
                取消
              </el-button>
              <el-button type="success" @click.stop="sure_address"> 确认 </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 添加商品弹窗 -->
  </div>
</template>
<script>
import quillEditor from '@/components/quille'
import { banner_lists ,upload_img,banner_del,banner_add} from "../../utils/axios";
export default {
  data() {
    return {
      editorUploadImageData:{},
      queryInfo: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      formLabelWidth1: "130px",
      formLabelWidth2: "80px",
      addType:0,
      kuang_show: false,
      add_tan: false,
      fn1: this.commonJs.Debounce(this.get_agent_list),
      extendList: [],
      seachVale: "",
      loading: false,
      multipleSelection: [],
      image_url:"",
      video_img:"",
      video_url:"",
      add_wen:{
        type:"1",
        vice_title:"",
        info:"",
        title:"",
        start_forward:"",
        start_browse:"",
      },
      other_img_upload_err1:false,
      other_img_upload_err2:false,
      other_img_upload_err3:false,
      orderListInfo:{}
    };
  },
  components:{quillEditor},
  props: {
    value: Object,
    
  },
  created() {
    this.get_agent_list(); //获取推广列表
  },
  methods: {
    getHtml(val){
      this.add_wen.info = val
    },
    addWen(id) {
      let type = 1
      if(id){
        type = 2
      }
      // image_url video_url video_img add_wen type title 
      if(this.add_wen.type == 1){
        if (this.video_url == "") {
          this.$message({
            showClose: true,
            message: "视频必传",
            type: "error",
          });
          return;
        }
        if (this.video_img == "") {
          this.$message({
            showClose: true,
            message: "视频封面必传",
            type: "error",
          });
          return;
        }
      }else{
        if (this.image_url == "") {
          this.$message({
            showClose: true,
            message: "图片必传",
            type: "error",
          });
          return;
        }
      }
      if (this.add_wen.title == "") {
        this.$message({
          showClose: true,
          message: "标题必填",
          type: "error",
        });
        return;
      }
        
      if (this.add_wen.vice_title == "") {
        this.$message({
          showClose: true,
          message: "副标题必填",
          type: "error",
        });
        return;
      }
      if (this.add_wen.start_browse == "") {
        this.$message({
          showClose: true,
          message: "起始浏览数必填",
          type: "error",
        });
        return;
      }
      if (this.add_wen.start_forward == "") {
        this.$message({
          showClose: true,
          message: "起始转发数必填",
          type: "error",
        });
        return;
      }
      
      let data = {
        title:this.add_wen.title,
        vice_title:this.add_wen.vice_title,
        //
        info:this.add_wen.info,
        type:this.add_wen.type,
        start_browse:this.add_wen.start_browse,
        start_forward:this.add_wen.start_forward,
      }
      if(this.add_wen.type == 1){
        data.image_url = this.video_img
        data.video_url = this.video_url
      }else if(this.add_wen.type == 2){
        data.image_url = this.image_url
      }
      if(type == 2){
        data.article_id = id
      }
      console.log(data)
      banner_add(
        data
      ).then((res) => {
          if (res.data.err_code == 0) {
            this.get_agent_list()
            this.add_tan = false
            if(this.add_wen.type == 1){
              this.$message({
                message: "增加成功",
                type: "success",
              });
            }else if(this.add_wen.type == 2){
              this.$message({
                message: "修改成功",
                type: "success",
              });
            }
            this.image_url = ""
            this.video_img = ""
            this.video_url = ""
            this.add_wen = {
              type:"1",
              vice_title:"",
              info:"",
              start_forward:"",
              start_browse:"",
              title:""
            }
          } else {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
    adds() {
      this.addType = 1
      this.add_tan = true;
      this.image_url = ""
      this.video_img = ""
      this.video_url = ""
      this.add_wen = {
        type:"1",
        vice_title:"",
        info:"",
        start_forward:"",
        start_browse:"",
        title:""
      }
      console.log(this.add_wen)
    },
    edits() {
      if(this.multipleSelection.length == 0){
        this.$message({
          showClose: true,
          message: "请选择要编辑的数据",
          type: "error",
        });
        return
      }
      
      let orderListInfo = JSON.parse(JSON.stringify(this.multipleSelection[0]))
      this.orderListInfo = orderListInfo
      console.log(orderListInfo)
      if(this.multipleSelection.length > 1){
          this.$confirm('检测到选中两条数据，默认选择第一次选中数据', '是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              console.log(orderListInfo.article_id)
              if(orderListInfo.type == 1){
                this.video_img = orderListInfo.image_url
                this.video_url = orderListInfo.video_url
              }else{
                this.image_url = orderListInfo.image_url
              }
              this.add_wen = {
                title:orderListInfo.title,
                type:orderListInfo.type,
                vice_title:orderListInfo.vice_title,
                info:orderListInfo.info,
                start_forward:orderListInfo.start_forward,
                start_browse:orderListInfo.start_browse,
              }
          }).catch(() => {

          });
      }else{
        if(orderListInfo.type == 1){
          this.video_img = orderListInfo.image_url
          this.video_url = orderListInfo.video_url
        }else{
          this.image_url = orderListInfo.image_url
        }
        this.add_wen = {
          title:orderListInfo.title,
          type:orderListInfo.type,
          vice_title:orderListInfo.vice_title,
          info:orderListInfo.info,
          start_forward:orderListInfo.start_forward,
          start_browse:orderListInfo.start_browse,
        }
        console.log(orderListInfo.article_id)
      }
      this.addType = 2
      this.add_tan = true;
    },

    sure_address() {
        let data = "";
        if (this.multipleSelection.length > 1) {
            this.multipleSelection.forEach((item) => {
            if (data) {
                data = data + "," + item.article_id;
            } else {
                data = item.article_id;
            }
            });
        } else {
            data = this.multipleSelection[0].article_id;
        }
        //is_state
        // banner_del
        console.log(data)
        banner_del({
            article_id: data,
        })
        .then((res) => {
            if (res.data.err_code == 0) {
            this.$message({
                message: "删除成功",
                type: "success",
            });
            this.kuang_show = false;
            this.get_shop_list_page(
                this.queryInfo.page,
                this.queryInfo.pageSize
            );
            } else {
            this.$message({
                showClose: true,
                message: res.data.err_msg,
                type: "error",
            });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    
    },
    shan() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择要操作的数据",
          type: "error",
        });
        return;
      }
      this.kuang_show = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取推广列表
    get_agent_list(index) {
      this.seachVale = "";

      this.loading = true;
      let request_form = {
        page: 1,
        page_size: 10,
        // state:1,
      };
      banner_lists(
        request_form
      ).then((res) => {
        if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
                element.create_time = this.commonJs.timestampToTime(
                element.create_time
                );
            });
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
            this.pageSize = res.data.err_msg.page_size;
            if (index == 1) {
                this.$message({
                message: "刷新成功",
                type: "success",
                });
            }
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      })
      .catch((error) => {
        this.loading = false;
        console.log(error);
      });
    },
    //分页
    get_shop_list_page(page, number) {
      this.loading = true;
      banner_lists({
        page: page,
        page_size: number,
        keyword: this.seachVale,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
            this.pageSize = res.data.err_msg.page_size;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
    
    //每页显示条数改变
    handleSizeChange(val) {
      console.log(this.queryInfo);
      this.get_shop_list_page(1, val);
    },
    //当前页
    handleCurrentChange(val) {
      console.log(val);
      this.get_shop_list_page(val, this.pageSize);
    },
    //搜索
    pick_seach() {
      if (this.seachVale == "") {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      this.loading = true;
      banner_lists({
        page: 1,
        page_size: this.pageSize,
        keyword: this.seachVale,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element) => {
              element.create_time = this.commonJs.timestampToTime(
                element.create_time
              );
            });
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
            this.pageSize = res.data.err_msg.page_size;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    //上传图片 推荐图片
    img_upload1: function (item) {
      console.log(item);
      if (this.other_img_upload_err1 == false) {
        let fd = new FormData();
        fd.append("file", item.file);
        console.log(fd.get("file"));
        upload_img(fd)
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              console.log(res.data.err_msg.url)
              
                this.video_img = res.data.err_msg.url
              
              
            } else {
              this.$message({
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
    //上传图片之前
    // img_beforeUpload1(file) {
    //   if (
    //     file.type != "image/jpeg" &&
    //     file.type != "image/jpg" &&
    //     file.type != "image/png" &&
    //     file.type != "image/gif" &&
    //     file.type != "image/JPEG" &&
    //     file.type != "image/JPG" &&
    //     file.type != "image/PNG" &&
    //     file.type != "image/GIF"
    //   ) {
    //     this.$message.error("请上传图片格式!");
    //     this.other_img_upload_err1 = true;
    //   } else if (file.size / 1024 / 1024 > 200) {
    //     this.$message.error("图片大小不能超过 200MB!");
    //     this.other_img_upload_err1 = true;
    //   }
    // },
    //上传图片 推荐图片
    img_upload2: function (item) {
      console.log(item);
      if (this.other_img_upload_err2 == false) {
        let fd = new FormData();
        fd.append("file", item.file);
        console.log(fd.get("file"));
        upload_img(fd)
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              console.log(res.data.err_msg.url)
              
                this.video_url = res.data.err_msg.url
              
              
            } else {
              this.$message({
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
    //上传图片之前
    // img_beforeUpload2(file) {
    //   this.other_img_upload_err2 = false
    //   console.log(file)
    //   let str = file.name
    //   var index = str.lastIndexOf(".");  
    //   console.log(index)
    //   str  = str .substring(index + 1, str.length);
    //   console.log(str)
    //   if(str != 'mp4') {
    //       this.$message.error('请上传视频格式!');
    //       this.other_img_upload_err2 = true
    //   } else if ( file.size / 1024 / 1024 > 200) {
    //     this.$message.error('文件大小不能超过 200MB!');
    //     this.other_img_upload_err2 = true
    //   }
    // },
    //上传图片 推荐图片
    img_upload3: function (item) {
      console.log(item);
      if (this.other_img_upload_err3 == false) {
        let fd = new FormData();
        fd.append("file", item.file);
        console.log(fd.get("file"));
        upload_img(fd)
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              console.log(res.data.err_msg.url)
              
                this.image_url = res.data.err_msg.url
              
              
            } else {
              this.$message({
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
    //上传图片之前
    // img_beforeUpload3(file) {
    //   if (
    //     file.type != "image/jpeg" &&
    //     file.type != "image/jpg" &&
    //     file.type != "image/png" &&
    //     file.type != "image/gif" &&
    //     file.type != "image/JPEG" &&
    //     file.type != "image/JPG" &&
    //     file.type != "image/PNG" &&
    //     file.type != "image/GIF"
    //   ) {
    //     this.$message.error("请上传图片格式!");
    //     this.other_img_upload_err3 = true;
    //   } else if (file.size / 1024 / 1024 > 200) {
    //     this.$message.error("图片大小不能超过 200MB!");
    //     this.other_img_upload_err3 = true;
    //   }
    // },

  },
};
</script>
<style scoped lang="less">
.page {
  position: relative;
  padding: 10px;
  .pageItem {
    border-radius: 10px;
    background: #fff;
    .topHead {
      padding: 10px 30px;
      border-bottom: 1px solid #bbb;
      //
      s {
        background: #ee8f29;
        width: 5px;
        height: 25px;
        margin-right: 10px;
      }
      span {
        font-size: 20px;
        line-height: 28px;
        color: #ee8f29;
      }
    }
    .textItem {
      padding: 15px 30px;
      .content {
        border: 1px solid #bbb;
        .head {
          padding: 5px 50px;
          img {
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
          span {
            line-height: 30px;
            height: 30px;
            color: #f76336;
          }
        }
        .item {
          width: 50%;

          .itemDiv {
            cursor: pointer;
            height: 40px;
            border-top: 1px solid #bbb;
            line-height: 40px;
          }
        }
        .item.lt {
          .itemDiv {
            padding-left: 50px;
          }
        }
        .item.rt {
          width: calc(50% - 1px);
          border-left: 1px solid #bbb;
          .itemDiv {
            padding-left: 15px;
            .kuai {
              margin-top: 8px;
              float: left;
              margin-right: 5px;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 1px solid #000;
              span {
                display: block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: 1px solid #000;
                margin: 4px;
              }
            }
            .span {
              float: left;
            }
            .kuai.active {
              border-color: #ee8f29;
              background: #ee8f29;
              span {
                border-color: #ee8f29;
              }
            }
          }
        }
      }
      .form {
        .span {
          color: #bbb;
          font-size: 13px;
          position: absolute;
          bottom: -37px;
          left: 0;
        }
        .span1 {
          color: #bbb;
          font-size: 13px;
          display: block;
          margin-bottom: 10px;
        }
      }
    }
    /deep/ .textItem .el-input {
      input {
        max-width: 900px;
      }
    }
  }
}
/deep/ .upload-demo.lt.active {
  .el-upload {
    text-align: left;
  }
}

/deep/ .pageItem.first .el-input input {
  height: 40px !important;
  line-height: 40px !important;
}
/deep/ .el-form-item {
  margin-bottom: 45px;
}
/deep/ .el-form-item.active {
  margin-bottom: 0;
}
/deep/ .el-dialog__body {
  padding: 0 0;
}
/deep/.el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog__headerbtn {
  font-size: 20px;
  top: 10px;
  right: 10px;
}
/deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
.info {
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  background: #ee8f29;
}
.boxs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  .content {
    border: none !important;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: relative;
    .kuang {
      position: absolute;
      text-align: center;
      top: 50%;
      left: 50%;
      width: 200px;
      margin-top: -330px;
      margin-left: -100px;
      background: #fff;
      border: 5px solid #ee8f29 !important;
      border-radius: 30px;
      padding: 35px 35px;
      img {
        margin: 0 auto 30px;
        width: 50px;
      }
      .text {
        margin-bottom: 40px;
      }
    }
  }
}
/deep/ .el-table .has-gutter tr,
/deep/ .el-table .has-gutter th {
  background: #d7d5d5 !important;
}
/deep/ .el-date-editor--datetimerange.el-input__inner{
  width: 100%;
}

.remarks_box {
  .el-form-item {
    margin: 0;
  }
  h2 {
    margin-bottom: 15px;
    margin-top: 0;
    font-size: 18px;
  }
}
.remarks_box.add {
  /deep/ .el-image__error{
    background: #000;
    color: #000;
  }
  /deep/ .el-dialog{
    height: 80%;
  }
  /deep/ .el-dialog__body{
    height: 100%;
  }
  /deep/ .blockBox{
    height: 80%;
  }
  .form {
    border-radius: 10px;
    padding: 10px 15px 0;
    .el-form-item {
      margin: 10px 0;
    }
    height: 90%;
    .formI {
      right: 20px;
      bottom: 20px;
      color: red;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .blockBox {
    // max-height: 453px;
    // overflow-y: auto;
    padding: 30px 50px 0;
    .iphone{
      height: 100%;
      width: 350px;
      background: #f1f1f1;
      float: left;
      /deep/ .head{
        height: 190px;
        .img{
          width: 100%;
          height: 100%;
        }
        video{
          width: 100%;
          height: 100%;
          background: #000;
        }
      }
      .cen{
        padding: 15px 5px 10px 5px;
        border-bottom: 1px solid #bdbdbd;
        .titles{
          margin-bottom: 15px;
          line-height: 22px;
          padding-left: 5px;
        }
        .infos{
          .rt{
            margin-right: 10px;
            font-size: 14px;
            i{
              color: #f73636;
              font-size: 16px;
              position: relative;
              top: 2px;
              margin-right: 5px;
            }
          }
        }
      }
      .bot{
        padding: 10px 15px;
        img{
          width: 100%;
        }
      }
    }
    .forms{
      width: calc(100% - 440px);
      background: #f1f1f1;
      float: right;
      height: 100%;
      overflow: auto;
      #video{
        width: 100%;
        height: 100%;
        background: #000;
      }
    }
    .forms,.iphone{
      overflow-y: auto;
    }
    .forms::-webkit-scrollbar,.iphone::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    .forms::-webkit-scrollbar-thumb,.iphone::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #535353;
    }
    .forms::-webkit-scrollbar-track,.iphone::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #ededed;
    }
  }
  .divs {
    
  }
}
/deep/ .shen2,/deep/ .shen1{
  line-height: 16px;
  font-weight: bold;
}
/deep/ .shen2.red{
  color: #f8616a;
}
/deep/ .el-form-item__label{
  text-align: right;
}
/deep/ .bigButton{
  width: 200px;
  height: 100px;
  border: none;
  outline: none;
  border-radius: 10px;
  overflow: hidden;
  background: #e3e3e3;
  padding: 0;
  el-image,.image-slot{
    background: #e3e3e3;
  }
  i{
    color: #f49c3e;
  }
}
/deep/ .yiban{
  width:50%;
}
/deep/ .blockDiv{
  border:2px solid #bbb;
  border-radius: 10px;
  width: 70%;
  margin-left: 15%;
  padding: 10px 10px 20px;
  .el-form-item{
    margin: 0!important;
  }
}
/deep/ .goodsindex-list {
  margin-top: 0;
}
/deep/ .el-dialog {
  box-shadow: 0 0px 0px #ccc;
  -webkit-box-shadow: 0 0px 0px #ccc;
}
/deep/ .el-dialog {
  width: 80%;
  margin-top: 10vh!important;
}
/deep/ .block .el-dialog {
  width: 30%;
}
/deep/ .el-form-item__label {
  text-align-last: justify;
}
/deep/ .el-dialog__body {
  padding: 30px 50px;
}
/deep/ .teshu .el-dialog {
  width: 30%;
}
/deep/ .el-dialog__body {
  padding: 0 0;
  .el-form{
    padding: 50px;
  }
}
/deep/.el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog__headerbtn {
  font-size: 20px;
  top: 10px;
  right: 10px;
}
/deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
.info {
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  background: #ee8f29;
}
.seach_copy{
  display: flex;
  justify-content: space-between;
}
/deep/ .ql-container{
  height: calc(100% - 44px);
  min-height: 200px;
  
}
/deep/ img{
  display: initial;
}
/deep/.iphone img{
  max-width: 100%;
  width: auto;
}
</style>