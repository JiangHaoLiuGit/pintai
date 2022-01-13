<template>
  <div class="page">
    <div class="pageItem first">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">基本设置</span>
      </div>
      <div class="textItem">
        <el-form :model="form" class="form clearfix">
          <el-form-item
            label="机器人名称："
            class="lt active"
            style="width: 33%"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.kf_nickname"
              autocomplete="off"
              placeholder="给机器人取个好听的名字"
            ></el-input>
            <span class="span">显示在对话框顶部的名称</span>
          </el-form-item>

          <el-form-item
            label="机器人头像："
            class="lt active clearfix"
            style="width: 28%"
            :label-width="formLabelWidth2"
          >
            <el-image
              style="margin-right: 20px; width: 72px; height: 72px"
              class="lt"
              :src="form.kf_avatar"
              fit="cover"
            >
              <div
                slot="error"
                class="image-slot"
                style="
                  width: 70px;
                  height: 70px;
                  text-align: center;
                  border: 1px solid #bbb;
                "
              >
                <i
                  class="el-icon-picture-outline"
                  style="font-size: 25px; margin-top: 21px"
                ></i>
              </div>
            </el-image>
            <el-upload
              class="upload-demo lt active"
              action=""
              :http-request="img_upload1"
              :before-upload="img_beforeUpload1"
              :show-file-list="false"
              list-type="picture"
            >
              <el-button type="primary"
                >上传<i class="el-icon-upload el-icon--right"></i
              ></el-button>
              <span class="span1">尺寸要求：720*720，小于1MB</span>
              <!-- <el-button type="primary">上传图片</el-button> -->
            </el-upload>
          </el-form-item>
          <el-form-item
            label="对话欢迎语："
            style="clear: both"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.welcome1" autocomplete="off"></el-input>
            <span class="span"
              >用户选择机器人转人工后，人工接入的欢迎语。（如：您好，橘椒客服为您服务！请问有什么可以帮您？）</span
            >
          </el-form-item>
          <el-form-item label="未匹配答案用语：" :label-width="formLabelWidth">
            <el-input v-model="form.welcome2" autocomplete="off"></el-input>
            <span class="span"
              >机器人无法回答时，自动回复并转人工。（如：很抱歉，小橘没听明白您的问题，小橘继续努力学习的！如果需要人工服务，请点击。）</span
            >
          </el-form-item>
          <el-form-item label="解决问题结束语：" :label-width="formLabelWidth">
            <el-input v-model="form.welcome3" autocomplete="off"></el-input>
            <span class="span">用户选择已解决，对话结束即将自动答复用语。</span>
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer clearfix"
        style="padding: 20px 100px"
      >
        <el-button type="success" class="rt" @click="save_class"
          >保 存</el-button
        >
      </div>
    </div>

    <div class="pageItem" style="margin-top: 20px">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">问题设置</span>
      </div>
      <div class="textItem">
        <div class="clearfix" style="margin-bottom:20px">
          <el-input
            class="lt"
            style="width:300px"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            @keyup.enter.native="pick_seach"
            v-model="seachVale"
          >
          </el-input>
          <el-button type="danger" class="rt" @click="shan">删除</el-button>
          <el-button type="success" class="rt" style="margin-right:10px" @click="edits">编辑</el-button>
          <el-button type="primary" class="rt" style="margin-right:10px" @click="adds">添加</el-button>
          <el-button type="primary" class="rt" style="margin-right:10px" @click="fn1(1)">刷新</el-button>
        </div>
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              ref="multipleTable"
              :data="extendList"
              border
              :span-method="cellMerge"
              row-key="id"
              @selection-change="handleSelectionChange"
              :tree-props="{children: 'son'}"
              style="width: 100%"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="序号" prop="index" width="150">
              </el-table-column>
              <el-table-column
                label="问题类型"
              >
                <template slot-scope="scope">
                    {{scope.row.content}}
                </template>
              </el-table-column>
              <el-table-column label="答案" prop="answer">
              </el-table-column>
              <el-table-column
                prop="subordinate_num"
                width="80"
                label="下级数量"
              >
              </el-table-column>
              <el-table-column prop="sort" label="展示排序" width="80">
              </el-table-column>
              <el-table-column prop="update_time" label="更新时间" width="150">
              </el-table-column>
              <el-table-column prop="nickname" label="备注">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 分页  -->
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
      </div>
    </div>

    <!-- 增加 -->
    <!-- 增加问题类型 -->
    <el-dialog
        width="30%"
        class="remarks_box add"
        :visible.sync="add_tan1"
        append-to-body>
        <div class="info">添加问题类型</div>
        <div style="padding:30px 0">
            <div class="blockBox divs">
                <div v-for="(item,index) in add_wen1" :key="index">
                    <el-form :model="item" class="form clearfix por">
                        <h2>增加{{index+1}}</h2>
                        <el-form-item label="内容：" :label-width="formLabelWidth1">
                            <el-input type="text" placeholder="请输入问题" v-model="item.content"></el-input>
                        </el-form-item>
                        <el-form-item label="展示排序：" :label-width="formLabelWidth1">
                            <el-input type="number" placeholder="请输入排序" style="width:150px;" v-model="item.sort"></el-input>
                        </el-form-item>
                        <i class="el-icon-delete formI poa" v-if="add_wen1.length>1" @click="shan1(index)"></i>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer clearfix divs" style="padding:10px 40px 10px 30px;">
                <el-button type="warning" @click="addLei1">添加</el-button>
            </div>
            <div slot="footer" class="dialog-footer clearfix divs" style="padding:10px 40px 10px 30px;margin-top:20px">
                <el-button type="success" class="rt" @click="addWen1" style="margin-left:15px">添 加</el-button>
                <el-button type="danger" class="rt" @click="add_tan1 = false">取 消</el-button>
            </div>
        </div>
    </el-dialog>
    <!-- 增加问答 -->
    <el-dialog
        width="30%"
        class="remarks_box add"
        :visible.sync="add_tan2"
        append-to-body>
        <div class="info">添加问答</div>
        <div style="padding:30px 0">
            <div class="blockBox divs">
                <span class="superSpan">当前所属问题类型（一级）：{{xuanzhong.content}}</span>
                <div v-for="(item,index) in add_wen2" :key="index">
                    <el-form :model="item" class="form por clearfix">
                        <h2>增加{{index+1}}</h2>
                        <el-form-item label="问题(二级)：" :label-width="formLabelWidth1">
                            <el-input type="text" placeholder="请输入问题" v-model="item.content"></el-input>
                        </el-form-item>
                        <el-form-item label="答案(二级)：" :label-width="formLabelWidth1">
                            <el-input type="textarea" placeholder="请输入答案" v-model="item.answer"></el-input>
                        </el-form-item>
                        <el-form-item label="展示排序：" :label-width="formLabelWidth1">
                            <el-input type="number" placeholder="请输入排序" style="width:150px;" v-model="item.sort"></el-input>
                        </el-form-item>
                        <i class="el-icon-delete formI poa" v-if="add_wen2.length>1" @click="shan2(index)"></i>
                    </el-form>
                </div>
            </div>
            
            <div slot="footer" class="dialog-footer clearfix" style="padding:10px 40px 10px 30px;">
                <el-button type="warning" @click="addLei2">添加</el-button>
            </div>
            <div slot="footer" class="dialog-footer clearfix" style="padding:10px 40px 10px 30px;margin-top:20px">
                <el-button type="success" class="rt" @click="addWen2" style="margin-left:15px">添 加</el-button>
                <el-button type="danger" class="rt" @click="add_tan2 = false">取 消</el-button>
            </div>
        </div>
    </el-dialog>

    <!-- 编辑 -->
    <!-- 编辑问题类型 -->
    <el-dialog
        width="30%"
        class="remarks_box"
        :visible.sync="edit_tan1"

        append-to-body>
        <div class="info">编辑问题类型</div>
        <div style="padding:30px 83px 30px 30px;">
            <el-form :model="edit_wen1" class="form clearfix">
                <h2>问题类型</h2>
                <el-form-item label="更新内容：" :label-width="formLabelWidth1">
                    <el-input type="text" placeholder="请输入更新内容" v-model="edit_wen1.content"></el-input>
                </el-form-item>
                <el-form-item label="展示排序：" :label-width="formLabelWidth1">
                    <el-input type="number" placeholder="请输入排序" style="width:150px;" v-model="edit_wen1.sort"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer clearfix" style="padding:20px 0 20px;margin-top:20px">
                <el-button type="success" class="rt" @click="editWen1" style="margin-left:15px">修 改</el-button>
                <el-button type="danger" class="rt" @click="edit_tan1 = false">取 消</el-button>
            </div>
        </div>
    </el-dialog>
    <!-- 编辑问答 -->
    <el-dialog
        width="30%"
        class="remarks_box"
        :visible.sync="edit_tan2"
        append-to-body>
        <div class="info">编辑问答</div>
        <div style="padding:30px 83px 30px 30px;">
            <el-form :model="edit_wen2" class="form clearfix">
                <h2>问题类型（一级）</h2>
                <el-form-item label="重选类型：" :label-width="formLabelWidth2">
                    <el-select v-model="edit_wen2.pid" placeholder="请选择类型">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.content"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <h2>答案内容（二级）</h2>
                <el-form-item label="更新内容：" :label-width="formLabelWidth2">
                    <el-input type="text" v-model="edit_wen2.content"></el-input>
                </el-form-item>
                <h2>答案内容（三级）</h2>
                <el-form-item label="更新内容：" :label-width="formLabelWidth2">
                    <el-input type="textarea" v-model="edit_wen2.answer"></el-input>
                </el-form-item>
                <el-form-item label="展示排序：" :label-width="formLabelWidth2">
                    <el-input type="number" style="width:150px;" v-model="edit_wen2.sort"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer clearfix" style="padding:20px 0 20px;margin-top:20px">
                <el-button type="success" class="rt" @click="editWen2" style="margin-left:15px">修 改</el-button>
                <el-button type="danger" class="rt" @click="edit_tan2 = false">取 消</el-button>
            </div>
        </div>
    </el-dialog>

    <div class="pageItem" style="margin-top: 20px">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">未知问题收录</span>
      </div>
      <div class="textItem">
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              ref="multipleTable"
              :data="wentiList"
              border
              style="width: 100%"
            >
              <el-table-column label="序号" type="index" width="80">
              </el-table-column>
              <el-table-column prop="add_time" label="记录时间" width="150">
              </el-table-column>
              <el-table-column prop="nickname" label="用户昵称" width="120">
              </el-table-column>
              <el-table-column prop="phone" label="用户帐号" width="120">
              </el-table-column>
              <el-table-column prop="content" label="咨询问题记录">
              </el-table-column>
              <el-table-column prop="comment" label="备注">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <el-row :gutter="20" class="goodsindex-list" style="margin-top: 20px">
          <el-col :span="24" class="goodsindex-page-box">
            <el-pagination
              @size-change="sizeChange"
              @current-change="currentChange"
              :current-page="yeInfo.page"
              :page-sizes="[5, 10, 20, 30, 50]"
              :page-size="yeInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="yeInfo.total"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import {
  upload_img,
  kf_config,
  save_kf_config,
  question_record_list,
  problem_list,
  update_problem_type,//修改问题类型
  update_questions,//修改问答
  add_problem_type,//添加问题类型(可批量)
  add_questions,//添加问答（可批量）
  get_problem_type,//获取全部问题类型
  del_questions,//删除问答及问题类型(支持批量删除)
} from "../../utils/axios";
export default {
  data() {
    return {
      queryInfo: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      fn1: this.commonJs.Debounce(this.get_agent_list),
      extendList: [],
      seachVale: "",
      pageSize: 10,
      loading: false,
      formLabelWidth: "200px",
      formLabelWidth1: "100px",
      formLabelWidth2: "150px",
      form: {
        kf_nickname: "",
        kf_avatar: "",
        welcome1: "",
        welcome2: "",
      },
      wentiList: [], //推广列表
      yeInfo: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      pageS: 10,
      xuanzhong:{pTile:"我是"},
      multipleSelection: [],
      add_tan1:false,
      add_tan2:false,
      edit_tan1:false,
      edit_tan2:false,
      add_wen1:[
        {
            content:"",
            sort:""
        }
      ],
      add_wen2:[
        {
            content:"",
            answer:"",
            sort:""
        }
      ],
      edit_wen1:{
        content:"",
        sort:""
      },
      edit_wen2:{
        content:"",
        answer:"",
        sort:"",
        id:"",
        pid:"",
      },
      options:[],
      other_img_upload_err:false,
    };
  },
  created() {
    this.serviceInfo();

    this.getList(); //未知问题列表
    this.get_agent_list(); //机器人问答列表
    this.wenti();
  },
  methods: {
    shan(){
      if(this.multipleSelection.length == 0){
          this.$message({
            showClose: true,
            message: "请选择要删除的数据",
            type: "error",
          });
          return
      }
      let data = ''
      this.$confirm('删除后不可恢复', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          if(this.multipleSelection.length > 1){
              this.multipleSelection.forEach(item => {
                  if(data){
                      data = data + "," +item.id
                  }else{
                      data = item.id
                  }
              })
              
          }else{
              data = this.multipleSelection[0].id
          }
          console.log(data)
          del_questions({
              ids:data,
          }).then((res) => {
          if (res.data.err_code == 0) {
              this.$message({
                  message: "删除成功",
                  type: "success",
              });
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
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
      }).catch(() => {
          
      });
    },
    addWen1(){
        let obj = false
        this.add_wen1.forEach(item => {
            if(item.content == '' || item.sort == ''){
               obj = true
            }
        })
        if(obj){
            this.$message({
                showClose: true,
                message: "问题和排序必填",
                type: "error",
            });
            return
        }
        console.log(this.add_wen1)
        add_problem_type({
            param:JSON.stringify(this.add_wen1),
        }).then((res) => {
          if (res.data.err_code == 0) {
            this.$message({
                message: "添加成功",
                type: "success",
            });
            this.add_tan1 = false
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
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
    addWen2(){
        let obj = false
        this.add_wen2.forEach(item => {
            if(item.content == '' || item.sort == ''){
                obj = true
            }
        })
        if(obj){
            this.$message({
                showClose: true,
                message: "问题和排序必填",
                type: "error",
            });
            return
        }
        console.log(this.multipleSelection)
        let data = {
            param:JSON.stringify(this.add_wen2),
            pid:this.multipleSelection[0].id
        }
        console.log(data)
        add_questions(
          data
        ).then((res) => {
          if (res.data.err_code == 0) {
            this.$message({
                message: "添加成功",
                type: "success",
            });
            this.add_tan2 = false
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
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
    shan1(index){
        this.add_wen1.splice(index,1)
    },
    shan2(index){
        this.add_wen2.splice(index,1)
    },
    addLei1(){
        this.add_wen1.push({
            content:"",
            sort:""
        })
    },
    addLei2(){
        this.add_wen2.push({
            content:"",
            answer:"",
            sort:""
        })
    },
    adds(){
        if(this.multipleSelection.length == 0){
          this.add_tan1 = true
          this.add_wen1 = [
              {
                  content:"",
                  sort:""
              }
          ]
          return
        }
        this.xuanzhong = this.multipleSelection[0]
        console.log(this.xuanzhong)
        if(this.multipleSelection.length > 1){
            this.$confirm('检测到选中两条数据，默认选择第一次选中数据', '是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                    this.add_tan2 = true
                    this.add_wen2 = [
                        {
                            content:"",
                            answer:"",
                            sort:""
                        }
                    ]
            }).catch(() => {
                
            });
        }else{
                this.add_tan2 = true
                this.add_wen2 = [
                    {
                        content:"",
                        answer:"",
                        sort:""
                    }
                ]
            
        }
    },
    edits(){
        if(this.multipleSelection.length == 0){
             this.$message({
              showClose: true,
              message: "请选择要编辑的数据",
              type: "error",
            });
            return
        }
        let edit = this.multipleSelection[0]
        if(this.multipleSelection.length > 1){
            this.$confirm('检测到选中两条数据，默认修改第一次选中数据', '是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.multipleSelection[0].pid){
                    this.edit_tan2 = true
                    this.edit_wen2 = edit
                }else{
                    this.edit_tan1 = true
                    this.edit_wen1 = edit
                }
            }).catch(() => {
                
            });
        }else{
            if(this.multipleSelection[0].pid){
                this.edit_tan2 = true
                this.edit_wen2 = edit
            }else{
                this.edit_tan1 = true
                this.edit_wen1 = edit
            }
        }
    },
    editWen1(){
        let obj = false
        this.edit_wen1.forEach(item => {
            if(item.content == '' || item.sort == ''){
               obj = true
            }
        })
        if(obj){
            this.$message({
                showClose: true,
                message: "问题和排序必填",
                type: "error",
            });
            return
        }
        update_problem_type({
            content:this.edit_wen1.content,
            sort:this.edit_wen1.sort,
            id:this.edit_wen1.id,
        }).then((res) => {
          if (res.data.err_code == 0) {
            console.log(res.data.err_msg)
            this.$message({
                message: "修改成功",
                type: "success",
            });
            this.edit_tan1 = false
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
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
        console.log(this.edit_wen1)
    },
    editWen2(){
        let obj = false
        this.edit_wen2.forEach(item => {
            if(item.content == '' || item.sort == ''){
                obj = true
            }
        })
        if(obj){
            this.$message({
                showClose: true,
                message: "问题和排序必填",
                type: "error",
            });
            return
        }
        update_questions({
            content:this.edit_wen2.content,
            sort:this.edit_wen2.sort,
            answer:this.edit_wen2.answer,
            id:this.edit_wen2.id,
            pid:this.edit_wen2.pid,
        }).then((res) => {
          if (res.data.err_code == 0) {
            console.log(res.data.err_msg)
            this.$message({
                message: "修改成功",
                type: "success",
            });
            this.edit_tan2 = false
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
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
        console.log(this.edit_wen2)
    },
    //表格合并行
    cellMerge({ row, column, rowIndex,  columnIndex}) {
      let _row = 1;
      
      let _col = 1;
      if(columnIndex == 2 || columnIndex == 3){
          if(row.son){
              if(columnIndex == 2){
                  _col = 2
              }else if(columnIndex == 3){
                  _col = 0
              }
              
          }
      }
      if(columnIndex == 3 || columnIndex == 4){
          if(row.son){
              
          }else{
              if(columnIndex == 3){
                  _col = 2
              }else if(columnIndex == 4){
                  _col = 0
              }
          }
      }
      return {
        rowspan: _row, //行
        colspan: _col, //列
      };
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    //获取推广列表
    get_agent_list(index) {
      this.seachVale = "";
      
      this.loading = true;
      let request_form = {
        page: 1,
        page_size: 10,
      };
      problem_list(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element,ind) => {
              element.update_time = this.commonJs.timestampToTime(
                element.update_time
              );
              element.pid = 0
              element.answer = ""
              element.index = ind + 1
              if(element.son.length > 0){
                  element.son.forEach((item,indexs) => {
                    item.update_time = this.commonJs.timestampToTime(
                        item.update_time
                    );
                    item.pid = element.id
                    item.pTile = element.content
                    item.subordinate_num = 0
                    item.index = indexs + 1
                  })
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
      problem_list({
        page: page,
        page_size: number,
        search: this.seachVale,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element,ind) => {
              element.update_time = this.commonJs.timestampToTime(
                element.update_time
              );
              element.answer = ""
              element.index = ind + 1
              
              if(element.son.length > 0){
                  element.son.forEach((item,indexs) => {
                    item.update_time = this.commonJs.timestampToTime(
                        item.update_time
                    );
                    item.subordinate_num = 0
                    item.index = indexs + 1
                  })
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
      problem_list({
        page: 1,
        page_size: this.pageSize,
        search: this.seachVale,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            res.data.err_msg.list.forEach((element,ind) => {
              element.update_time = this.commonJs.timestampToTime(
                element.update_time
              );
              element.answer = ""
              element.index = ind + 1
              if(element.son.length > 0){
                  element.son.forEach((item,indexs) => {
                    item.update_time = this.commonJs.timestampToTime(
                        item.update_time
                    );
                    item.subordinate_num = 0
                    item.index = indexs + 1
                  })
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
          console.log(error);
          this.loading = false;
        });
    },
    wenti(){
        
        get_problem_type(

        ).then((res) => {
          if (res.data.err_code == 0) {
            this.options = res.data.err_msg.list;
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
    //获取推广列表
    getList(index) {
      
      let request_form = {
        page: 1,
        page_size: 10,
      };
      question_record_list(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.add_time = this.commonJs.timestampToTime(
                element.add_time
              );
            });
            this.wentiList = res.data.err_msg.list;
            this.yeInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.yeInfo.page = parseInt(res.data.err_msg.page);
            this.yeInfo.total = parseInt(res.data.err_msg.total_number);
            this.pageS = res.data.err_msg.page_size;
            if (index == 1) {
              this.$message({
                message: "刷新成功",
                type: "success",
              });
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
          console.log(error);
        });
    },

    //分页
    get_list_page(page, number) {
      console.log("分页测试---------");
      
      question_record_list({
        page: page,
        page_size: number,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element) => {
              element.add_time = this.commonJs.timestampToTime(
                element.add_time
              );
            });
            this.wentiList = res.data.err_msg.list;
            this.yeInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.yeInfo.page = parseInt(res.data.err_msg.page);
            this.yeInfo.total = parseInt(res.data.err_msg.total_number);
            this.pageS = res.data.err_msg.page_size;
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

    //每页显示条数改变
    sizeChange(val) {
      console.log(this.yeInfo);
      this.get_list_page(1, val);
    },

    //当前页
    currentChange(val) {
      console.log(val);
      this.get_list_page(val, this.pageS);
    },
    serviceInfo() {
      this.form = {
        kf_nickname: "",
        kf_avatar: "",
        welcome1: "",
        welcome2: "",
      };
      kf_config({
        type: 2,
      })
        .then((res) => {
          if (res.data.err_code == 0) {

            this.form = {
              kf_nickname: res.data.err_msg.info.kf_nickname,
              kf_avatar: res.data.err_msg.info.kf_avatar,
              welcome1: res.data.err_msg.info.welcome1,
              welcome2: res.data.err_msg.info.welcome2,
              welcome3: res.data.err_msg.info.welcome3,
            };
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
    //保存
    save_class() {
      if (
        this.form.kf_nickname == "" ||
        this.form.welcome1 == "" ||
        this.form.welcome2 == "" ||
        this.form.kf_avatar == "" ||
        this.welcome3 == ""
      ) {
        this.$message({
          message: "请完善表格信息",
          type: "warning",
        });
        return;
      }
      let data = {
        type: 2,
        kf_nickname: this.form.kf_nickname,
        kf_avatar: this.form.kf_avatar,
        welcome1: this.form.welcome1,
        welcome2: this.form.welcome2,
        welcome3: this.form.welcome3,
      };
      console.log(data);
      save_kf_config(data)
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            this.$message({
              message: "编辑成功",
              type: "success",
            });
            this.serviceInfo();
          } else {
            this.dialogFormVisible = false;
            this.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.dialogFormVisible = false;
          console.log(error);
        });
    },

    //上传图片
    img_upload1: function (item) {
      // console.log(item);
      
      if (this.other_img_upload_err == false) {
        let fd = new FormData();
        fd.append("file", item.file);
        // console.log(fd.get("file"));
        upload_img(fd)
          .then((res) => {
            // console.log(res);
            if (res.data.err_code == 0) {

              let img = new Image();
              img.onload = ()=> {
                  console.log(img.width == img.height)
                  if(img.width == img.height){
                    this.form.kf_avatar = res.data.err_msg.url;
                  }else{
                    this.$message({
                      showClose: true,
                      message: "上传的图片必须要正方形",
                      type: "error",
                    });
                  }
              }
              img.src = res.data.err_msg.url;
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
      console.log(file);
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
    
  },
};
</script>
<style scoped lang="less">
.page {
  min-height: calc(100vh - 85px);
  background: #eaeaea;
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
.box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .content {
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
/deep/ .el-table .has-gutter tr,/deep/ .el-table .has-gutter th{
    background: #d7d5d5!important;
}
.remarks_box{
     .el-form-item{
        margin: 0;
    }
    h2{
        margin-bottom: 15px;
        margin-top: 0;
        font-size: 18px;
    }
}
.remarks_box.add {
    .form{
        border: 1px solid #bbb;
        margin-top: 10px;
        border-radius: 10px;
        padding: 15px 30px;
        .el-form-item{
            margin: 10px 0;
        }
        .formI{
            right: 20px;
            bottom: 20px;
            color: red;
            font-size: 18px;
            cursor: pointer;
        }
    }
    .blockBox{
        max-height: 453px;
        overflow-y: auto;
        
    }
    .divs{
        padding: 0 40px 0 30px;
    }
}
.superSpan{
    font-size:18px;
    margin-bottom: 20px;
    display: block;
}
</style>