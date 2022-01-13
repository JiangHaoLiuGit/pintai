<template>
  <div class="page">
    <div class="pageItem" style="margin-top: 20px">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">轮播图管理</span>
      </div>
      <div class="textItem">
        <div class="clearfix" style="margin-bottom: 20px">
            
          <el-button type="danger" class="rt" @click="shan('1')">删除</el-button>
          <el-button
            type="warning"
            class="rt"
            style="margin-right: 10px"
            @click="edits"
            >编辑</el-button
          >
          <!-- sy，纵欲报应:阳痿，早泄，神经衰弱，脑力下降，骨密度低，脸上爆痘，长相猥琐没精神， -->
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="adds"
            >添加</el-button
          >
          
        </div>
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="interfaceTable"
              :data="extendList"
              border
              @row-click="rowClick"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="序号" type="index" width="80" align="center">
              </el-table-column>
              <el-table-column label="开始时间/结束时间" align="center" width="300">
                <template slot-scope="scope">
                  <div v-if="scope.row.is_always == 1">长期</div>
                  <div v-else><div>始:{{scope.row.start_time}}</div>末:{{scope.row.end_time}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="relation_id" label="关联ID" align="center">
              </el-table-column>
                <el-table-column label="排序" width="120">
                    <template slot-scope="scope">
                    <el-input
                        v-model="scope.row.sort"
                        @blur="likai1(scope.row)"
                        placeholder="请输入序号"
                    ></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="banner_name" label="轮播图名称" align="center">
              </el-table-column>
              <el-table-column label="样式" width="180">
                <template slot-scope="scope">
                    <el-image
                        style="width:150px;height:100px"
                        :src="scope.row.image"
                        :preview-src-list="[scope.row.image]"
                        fit="cover">
                    </el-image>
                </template>
              </el-table-column>
              <el-table-column label="显示状态" align="center">
                <template slot-scope="scope">
                    <!-- scope.row.state == 1 ?true:false -->
                    <el-switch
                    v-model="scope.row.value"
                    @change="caoChang(scope.row,scope.$index)"
                    active-color="#13ce66"
                    inactive-color="#e2e2e3">
                    </el-switch>
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
          width="40%"
          class="remarks_box add"
          :visible.sync="add_tan"
          append-to-body
        >
          <div class="info" v-if="addType == 1">增加轮播</div>
          <div class="info" v-else-if="addType == 2">编辑轮播</div>
          <div style="padding: 0 0 30px">
            <div class="blockBox divs">
              <el-form :model="add_wen" class="form por clearfix">
                  <el-form-item
                  label="图片:"
                  class="lt clearfix"
                  style="width:100%"
                  :label-width="formLabelWidth1"
                >
                  <el-upload
                    class="upload-demo lt"
                    action=""
                    :http-request="img_upload1"
                    :before-upload="img_beforeUpload1"
                    :show-file-list="false"
                    list-type="picture"
                    style="margin-bottom: 20px"
                  >
                
                    <button class="bigButton lt">
                      <el-image
                        style="width: 200px; height: 100px"
                        :src="cat_pic"
                        fit="cover"
                      >
                        <div
                          slot="error"
                          class="image-slot"
                          style="
                            width: 198px;
                            height: 98px;
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
                  <div class="lt" style="padding-top:60px;color:#999;padding-left:10px;">
                      请上传制作好的轮播图片
                    </div>
                </el-form-item>
                <el-form-item
                  label="时间:"
                  class="lt"
                  style="width:70%"
                  :label-width="formLabelWidth1"
                >
                  <el-date-picker
                    :clearable = false
                    v-model="add_wen.time_value"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>

                
                <div class="lt" style="width:30%;margin:10px 0;height:40px;padding-top:10px;padding-left:10px;box-sizing:border-box;">
                    <el-checkbox-group v-model="is_always">
                      <el-checkbox label="长期"></el-checkbox>
                    </el-checkbox-group>
                </div>

                <el-form-item
                  label="关联类型:"
                  class="yiban lt"
                  :label-width="formLabelWidth1"
                >
                    <el-input
                    type="text"
                    class="lt"
                    placeholder="轮播图名称"
                    v-model="add_wen.type"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="关联ID:"
                  class="yiban lt clearfix"
                  style="padding-left:20px"
                  :label-width="formLabelWidth1"
                >
                  <el-input
                    type="number"
                    class="lt"
                    style="width:62%"
                    placeholder="请输入关联ID"
                    v-model="add_wen.relation_id"
                  ></el-input>
                  <el-button
                    type="success"
                    style="margin-top:6px"
                    class="rt"
                    @click="examine('1')"
                    >选 择</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
            <div
              slot="footer"
              class="dialog-footer clearfix"
              style="padding: 10px 40px 10px 30px; margin-top: 20px"
            >
              <el-button
                type="success"
                class="rt"
                @click="addWen"
                v-if="addType == 1"
                style="margin-left: 15px"
                >增 加</el-button
              >
              <el-button
                type="success"
                class="rt"
                @click="editWen"
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
      
    </div>
    <!-- 添加商品弹窗 -->
    <el-dialog
      class="remarks_box add"
      :visible.sync="goods_examine_change_ifShow"
    >
      <div class="info">选择关联id</div>
      
      <div
        class="seach_copy clearfix"
        style="padding: 20px 30px 0 10px; margin-bottom: 0"
      >
        <div class="seach_select lt">
            <el-input
            v-model="seachVale"
            style="width:200px"
            placeholder="请输入ID/关键字"
            clearable
        ></el-input>
        </div>
        <div class="button_type rt">
          <el-button type="primary" @click="pick_seach2">搜索</el-button>

          <el-button size="mini" type="primary" @click="add_pro()"
            >选择文章</el-button
          >
        </div>
      </div>
      <div class="box" style="padding: 20px 20px 0">
        <el-row :gutter="20" class="goodsindex-list" style="margin: 0">
          <el-col :span="24" style="padding: 0">
            <el-table
              v-loading="loading"
              :data="newGoodsList"
              ref="interfaceTable"
              border
              height="500"
              style="width: 100%"
              @selection-change="handleSelectionChange2"
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
      </div>
      <!-- 分页 -->
      <el-row
        :gutter="20"
        class="goodsindex-list"
        style="margin: 0; padding: 0 20px 20px"
      >
        <el-col :span="24" class="goodsindex-page-box">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="queryInfo2.page"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="queryInfo2.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryInfo2.total"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
    
  </div>
</template>
<script>
import { article_banner_list , upload_img ,banner_lists,article_banner,article_banner_state,is_state,article_banner_del,article_banner_sort} from "../../utils/axios";
export default {
  data() {
    return {
        classification_value2:"",
      classification_list: [
        {
          value: "1",
          label: "全部",
        },
        {
          value: "2",
          label: "已添加",
        },
        {
          value: "3",
          label: "未添加",
        },
      ],
      multipleSelection2: [],
      product_name:"",
      queryInfo: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      queryInfo1: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      queryInfo2: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
        goods_examine_change_ifShow:false,
      addType:0,
      kuang_show: false,
      formLabelWidth1: "100px",
      formLabelWidth2: "80px",
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
      classification_list1:[],
      goodsIndex:0,
      add_wen:{
        type:"",
        relation_id:"",
        time_value:"",
      },
      tuijian_pic:"",
      cat_pic:"",
      is_always:[],
      bannerInfo:{},
      goods_status_list : [//商品状态
        {
          id: '1',
          name: '展示'
        }, {
          id: '2',
          name: '不展示'
        }
      ],
      edit_wen: {
        content: "",
      },
      
      edit_tan: false,
      add_tan: false,
      extendList: [],
      seachVale: "",
      loading: false,
      multipleSelection: [],
      other_img_upload_err:false,
      other_img_upload_err1:false,
      keywords:"",
      newGoodsList:[],
      
      orderInfo:{

      },
      value:false,
      orderListInfo:{

      },
      rowIndex:"",
      changNum:0,
      num:0,
    };
  },
 
  created() {
    this.get_agent_list(); //获取推广列表
  },
  watch:{
    
  },
  methods: {
    rowClick(row, column, event) {
        
      this.toggleSelection([this.extendList[row.index]]);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.interfaceTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.interfaceTable.clearSelection();
      }
    },
    caoChang(row,index){
        
        article_banner_state({
            banner_id: this.extendList[index].banner_id,
        }).then((res) => {
            if (res.data.err_code == 0) {
                this.loading = false
                this.$message({
                    message: "sb成功",
                    type: "success",
                });
                this.changNum = 0
                this.get_shop_list_page(this.queryInfo.page, this.queryInfo.pageSize);
                } else {
                this.$message({
                    showClose: true,
                    message: res.data.err_msg,
                    type: "error",
                });
            }
        });
    },
    
    // 
    //上传图片 图片
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
              // cat_pic//
              this.cat_pic = res.data.err_msg.url;
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
    img_beforeUpload1(file) {
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
        this.other_img_upload_err1 = true;
      } else if (file.size / 1024 / 1024 > 200) {
        this.$message.error("图片大小不能超过 200MB!");
        this.other_img_upload_err1 = true;
      }
    },
    
    addWen() {
      if (this.add_wen.type == "") {
        this.$message({
          showClose: true,
          message: "轮播图名字必填",
          type: "error",
        });
        return;
      }
      if (this.add_wen.relation_id == "") {
        this.$message({
          showClose: true,
          message: "关联ID必填",
          type: "error",
        });
        return;
      }
      if (this.add_wen.time_value == "" && this.is_always.length == 0) {
        console.log(this.add_wen.time_value)
        this.$message({
          showClose: true,
          message: "活动时间必填",
          type: "error",
        });
        return;
      }
        if (this.cat_pic == "") {
            this.$message({
            showClose: true,
            message: "轮播图片必填",
            type: "error",
            });
            return;
        }
        
      var time1 = "";
      var time2 = "";
      if (this.add_wen.time_value != "") {
        time1 = this.commonJs.dataTime(this.add_wen.time_value[0]);
        time2 = this.commonJs.dataTime(this.add_wen.time_value[1]);
      }
      let data = {
        banner_name:this.add_wen.type,
        relation_id:this.add_wen.relation_id,
      }
      if(this.is_always.length > 0){
        data.is_always = 1
      }else{
        data.is_always = 2
        data.start_time = time1
        data.end_time = time2
      }
      
        data.image = this.cat_pic
      console.log(data)
      article_banner(
        data
      ).then((res) => {
          if (res.data.err_code == 0) {
            this.get_shop_list_page(this.queryInfo.page, this.queryInfo.pageSize)
            this.add_tan = false
            this.$message({
              message: "增加成功",
              type: "success",
            });
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
    editWen() {
      if (this.add_wen.type == "") {
        this.$message({
          showClose: true,
          message: "轮播图名字必填",
          type: "error",
        });
        return;
      }
      if (this.add_wen.relation_id == "") {
        this.$message({
          showClose: true,
          message: "关联ID必填",
          type: "error",
        });
        return;
      }
      if (this.add_wen.time_value == "" && this.is_always.length == 0) {
        console.log(this.add_wen.time_value)
        this.$message({
          showClose: true,
          message: "活动时间必填",
          type: "error",
        });
        return;
      }
        if (this.cat_pic == "") {
            this.$message({
            showClose: true,
            message: "轮播图片必填",
            type: "error",
            });
            return;
        }
        
      var time1 = "";
      var time2 = "";
      if (this.add_wen.time_value != "") {
        time1 = this.commonJs.dataTime(this.add_wen.time_value[0]);
        time2 = this.commonJs.dataTime(this.add_wen.time_value[1]);
      }
      let data = {
          banner_id:this.orderListInfo.banner_id,
        banner_name:this.add_wen.type,
        relation_id:this.add_wen.relation_id,
      }
      if(this.is_always.length > 0){
        data.is_always = 1
      }else{
        data.is_always = 2
        data.start_time = time1
        data.end_time = time2
      }
      
        data.image = this.cat_pic
      console.log(data)
      article_banner(
        data
      ).then((res) => {
          if (res.data.err_code == 0) {
            this.get_shop_list_page(this.queryInfo.page, this.queryInfo.pageSize)
            this.add_tan = false
            this.$message({
              message: "修改成功",
              type: "success",
            });
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
      if(this.addType == 2){
        this.add_wen = {
          banner_pos:"",
          moban:"1",
          type:"",
          relation_id:"",
          time_value:"",
          cat_pic:"",
          recommended_reason:"",
          tuijian_pic:"",
        }
        this.is_always = []
      }
      this.addType = 1
      this.add_tan = true;
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
      console.log(this.multipleSelection[0])
      this.orderListInfo = JSON.parse(JSON.stringify(this.multipleSelection[0]))
      console.log(this.orderListInfo)
      if(this.multipleSelection.length > 1){
          this.$confirm('检测到选中两条数据，默认选择第一次选中数据', '是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.add_wen = {
                banner_pos:this.orderListInfo.banner_pos,
                moban:this.orderListInfo.tag,
                type:this.orderListInfo.banner_name,
                relation_id:this.orderListInfo.relation_id,
                recommended_reason:this.orderListInfo.recommended_reason,
                time_value:"",
              }
              
              if(this.add_wen.moban == 1){
                this.tuijian_pic = this.orderListInfo.image
              }else{
                this.cat_pic = this.orderListInfo.image
              }
              if(this.orderListInfo.is_always == 2){
                this.is_always = []
                this.add_wen.time_value = [new Date(this.orderListInfo.start_time),new Date(this.orderListInfo.end_time)]
              }else{
                this.is_always = ["长期"]
              }
              this.orderInfo = this.orderListInfo
              this.orderInfo.type = this.orderInfo.banner_name
              console.log(this.orderInfo)
              console.log(this.add_wen)
              this.addType = 2
              this.add_tan = true;
          }).catch(() => {

          });
      }else{
        this.add_wen = {
          banner_pos:this.orderListInfo.banner_pos,
          moban:this.orderListInfo.tag,
          type:this.orderListInfo.banner_name,
          relation_id:this.orderListInfo.relation_id,
          time_value:"",
        }
        
        if(this.add_wen.moban == 1){
          this.tuijian_pic = this.orderListInfo.image
        }else{
          this.cat_pic = this.orderListInfo.image
        }
        if(this.orderListInfo.is_always == 2){
          this.is_always = []
          this.add_wen.time_value = [new Date(this.orderListInfo.start_time),new Date(this.orderListInfo.end_time)]
        }else{
          this.is_always = ["长期"]
        }
        this.orderInfo = this.orderListInfo
              this.orderInfo.type = this.orderInfo.banner_name
              console.log(this.orderInfo)
              console.log(this.add_wen)
              this.addType = 2
              this.add_tan = true;
      }
      
    },
    sure_address() {
      let data = "";
      if (this.multipleSelection.length > 1) {
        this.multipleSelection.forEach((item) => {
          if (data) {
            data = data + "," + item.banner_id;
          } else {
            data = item.banner_id;
          }
        });
      } else {
        data = this.multipleSelection[0].banner_id;
      }
      article_banner_del({
          banner_id: data,
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
    shan(index) {
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
      article_banner_list(
        request_form
      ).then((res) => {
        if (res.data.err_code == 0) {
          this.loading = false;
          res.data.err_msg.list.forEach((element,index) => {
              element.index = index
            element.start_time = this.commonJs.timestampToTime(
              element.start_time
            );
            if(element.state == 1){
                element.value = true
            }else{
                element.value = false
            }
            element.end_time = this.commonJs.timestampToTime(
              element.end_time
            );
            let state = element.state
            let last = parseInt(this.commonJs.dataTime(element.end_time))
            if(last != 'NaN'){
              let news = Date.parse(new Date())/1000
              if(news > last){
                if(state == 1){
                  element.state = 3
                }else if(state == 2){
                  element.state = 4
                }
              }
            }
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
      article_banner_list({
        page: page,
        page_size: number,
        state: this.seachVale,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element,index) => {
                element.index = index
              element.start_time = this.commonJs.timestampToTime(
                element.start_time
              );
                if(element.state == 1){
                    element.value = true
                }else{
                    element.value = false
                }
              element.end_time = this.commonJs.timestampToTime(
                element.end_time
              );
              let state = element.state
              let last = parseInt(this.commonJs.dataTime(element.end_time))
              if(last != 'NaN'){
                let news = Date.parse(new Date())/1000
                if(news > last){
                  if(state == 1){
                    element.state = 3
                  }else if(state == 2){
                    element.state = 4
                  }
                }
              }
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
    likai1(row) {
      console.log(row);
      if(row.sort < 0){
          return
      }
      article_banner_sort({
        banner_id: row.banner_id,
        sort: row.sort,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "排序成功",
            type: "success",
          });
          this.get_shop_list_page(this.queryInfo.page, this.queryInfo.pageSize);
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    examine(){
        this.goods_examine_change_ifShow = true;
        this.goodList();
    },
    goodList(tex) {
      this.loading = true;
      banner_lists({
        page: 1,
        page_size: 20,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((item, index) => {
              
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
            });
            this.newGoodsList = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
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
    get_shop_list_page2(page, number) {
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
            res.data.err_msg.list.forEach((item, index) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
            });
            this.newGoodsList = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
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
    handleSizeChange2(val) {
      this.get_shop_list_page2(1, val);
    },

    //当前页
    handleCurrentChange2(val) {
      this.get_shop_list_page2(val, this.pageSize);
    },

    //搜索
    pick_seach2() {
      let that = this;
      if (this.seachVale == "") {
        this.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      this.loading = true;
      banner_lists({
        page: 1,
        page_size: 20,
        keyword: this.seachVale,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((item, index) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
            });
            this.newGoodsList = res.data.err_msg.list;
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo2.page = parseInt(res.data.err_msg.page);
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number);
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
    add_pro() {
        if (this.multipleSelection2.length == 0) {
            this.$message({
            message: "请选择一个文章",
            type: "warning",
            });
            return;
        }
        if (this.multipleSelection2.length > 1) {
            this.$message({
            message: "最多选择一个文章",
            type: "warning",
            });
            return;
        }
        console.log(this.multipleSelection2[0])
        this.goods_examine_change_ifShow = false
        this.add_wen.relation_id = this.multipleSelection2[0].article_id
      
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },

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
  .form {
    margin-top: 10px;
    border-radius: 10px;
    padding: 15px 30px;
    .el-form-item {
      margin: 10px 0;
    }
    .formI {
      right: 20px;
      bottom: 20px;
      color: red;
      font-size: 18px;
      cursor: pointer;
    }
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
</style>