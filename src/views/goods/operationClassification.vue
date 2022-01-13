<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
        <el-select v-model="operationClassification_value" placeholder="请选择运营一级分类">
          <el-option
            v-for="item in operation_one_classification"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="pick_seach">搜索</el-button>
      </div>
      <div class="button_type">
        <el-button type="success" @click="add_classification">新增运营分类</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)">刷新</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="classificationList"
          :height="height"
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
            label="分类名称"
            prop="group_name" 
          >
          </el-table-column>
          <el-table-column label="ICON" width="180">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.icon"
                fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="关联品类" width="300">
            <template slot-scope="scope">
              <ul>
                <li v-for = "(item,index) in scope.row.full_cate" :key = index>{{item.cate_name}}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column 
            label="排序"
            prop="sort" 
            width="80"
          >
          </el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="enable(scope.$index, scope.row)"
                v-show="scope.row.status == 2"
                >启用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-show="scope.row.status == 1"
                @click="stop_useing(scope.$index, scope.row)"
                >停用</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="propertySettings(scope.$index, scope.row)"
                >关联品类</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="compile(scope.$index, scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 编辑弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" class="dialogForm">
      <el-form :model="form">
        <el-form-item label="父级品类" :label-width="formLabelWidth" v-show="!form.ifAdd">
          <el-input v-model="form.parentClass" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="父级品类" :label-width="formLabelWidth" v-show="form.ifAdd">
          <el-cascader
            placeholder="请选择运营分类"
            v-model="form.parentClassCopy"
            :options="operationClassification_list"
            :props="{ expandTrigger: 'hover' , checkStrictly: true}"
            @change="pick_operation_change"></el-cascader>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cate_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类状态" :label-width="formLabelWidth" v-show="form.ifAdd">
          <el-radio v-model="form.status" label="1">启用</el-radio>
          <el-radio v-model="form.status" label="2">禁用</el-radio>
        </el-form-item>
        <el-form-item label="分类ICON" :label-width="formLabelWidth">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.img_url"
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
        <el-button type="primary" @click="add_class" v-show="form.ifAdd" >添 加</el-button>
        <el-button type="primary" @click="save_class" v-show="!form.ifAdd" >保 存</el-button>
      </div>
    </el-dialog>

    <!-- 关联品类弹窗 -->
    <el-dialog title="关联品类" :visible.sync="category_visible" class="category">
      <el-form :model="category_form">
        <el-form-item label="品类名称" :label-width="formLabelWidth">
          <el-input v-model="category_form.categoryClass" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="关联商品品类" :label-width="formLabelWidth">
          <el-cascader
            placeholder="请选择商品分类"
            v-model="category_form.classification_value_copy"
            :options="classification_list"
            :props="{ expandTrigger: 'hover' , checkStrictly: true}"
            @change="pick_cate_change"></el-cascader>
            <el-button type="primary" @click="relation_sure" >确 认</el-button>
            <el-button type="danger" @click="relation_del" >清 除</el-button>
        </el-form-item>
        <el-form-item label="关联分类展示" :label-width="formLabelWidth">
          <el-transfer 
            v-model="category_form.value" 
            :data="showList"
            :titles="['关联分类', '解绑分类']"
            @change="handleChange"
          ></el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="category_visible = false">取 消</el-button>
        <el-button type="primary" @click="add_relation">确认关联</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24" class="goodsindex-page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
          :page-sizes="[2]"
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
import { yunying_cate , get_yunying_cate , group_status , add_yunying_cate , save_yunying_cate , upload_img , create_relation , goods_get_cate } from "../../utils/axios";
export default {
  data() {
    return {
      classificationList: [], //运营分类列表
      loading : false,
      fn1: this.commonJs.Debounce(this.get_goodsCate_list),
      O_message : {},
      queryInfo: {
        page: 1,
        pageSize: 2,
        total : 1
      },
      title : '新增分类',
      dialogFormVisible : false,
      formLabelWidth: '120px',
      form: {
        ifAdd: false,
        parentClass: '',
        parentClassCopy : [],
        cate_name: '',
        sort: '',
        status: '',
        img_url : ''
      },
      operation_second_cate : [],
      operationClassification_list : [],//运营分类二级列表
      operation_one_classification : [],//运营一级分类列表
      operationClassification_value : '',
      classification_value : [],
      other_img_upload_err : false,
      category_visible : false,
      category_form : {
        categoryClass : '',
        classification_value_copy : [],
        value : []
      },
      classification_list : [],
      second_cate : [],
      three_cate : [],
      showList: [],
      showList_copy : [],
      height:""
    };
  },

  created() {
    this.get_goodsCate_list(); //获取运营分类列表
    this.get_operation() //获取运营三级分类
    this.get_cate() //获取商品三级分类
    this.height = document.body.clientHeight - 270
    console.log(this.height)
  },

  methods: {

    //获取运营分类列表
    get_goodsCate_list (index) {
      let that = this
      that.loading = true
      that.operationClassification_value = ''
      let request_form = {
        page : 1,
      }
      yunying_cate(
        request_form
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            let copyArray = []
            res.data.err_msg.list.forEach(element => {
              copyArray.push({
                group_fid : element.group_fid,//上一级分类id
                group_id : element.group_id,//分类id
                group_name : element.group_name,
                icon : element.icon, //图标路径url
                sort : element.sort,//排序
                status : element.status,//状态 0禁用 1启用
                full_cate : element.full_cate
              })
              if(element.child) {
                element.child.forEach(element_first => {
                    copyArray.push({
                      group_fid : element_first.group_fid,//上一级分类id
                      group_id : element_first.group_id,//分类id
                      group_name : element.group_name + '>>' + element_first.group_name,
                      icon : element_first.icon, //图标路径url
                      sort : element_first.sort,//排序
                      status : element_first.status,//状态 0禁用 1启用
                      full_cate : element_first.full_cate
                    })
                    if(element_first.child) {
                      element_first.child.forEach(element_second => {
                        copyArray.push({
                          group_fid : element_second.group_fid,//上一级分类id
                          group_id : element_second.group_id,//分类id
                          group_name : element.group_name + '>>' + element_first.group_name + '>>' + element_second.group_name,
                          icon : element_second.icon, //图标路径url
                          sort : element_second.sort,//排序
                          status : element_second.status,//状态 0禁用 1启用
                          full_cate : element_second.full_cate
                        })
                      })
                    }
                  })
                }
            })
            console.log(copyArray)
            that.classificationList = copyArray
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
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

    // 获取运营三级分类
    get_operation(){
      let that = this
      that.operationClassification_list = []
      that.operation_one_classification = []
      get_yunying_cate().then(res=>{
        if(res.data.err_code==0){
          if( res.data.err_msg.first.length > 0) {

            if(res.data.err_msg.second.length > 0) { //存在二级分类

                res.data.err_msg.first.forEach((element_first , first_index) => {
                  that.operation_second_cate = []
                  that.operationClassification_list.push({
                    value : element_first.group_id,
                    label : element_first.group_name,
                    group_id : element_first.group_id
                  })
                  that.operation_one_classification.push({
                    value : element_first.group_id,
                    label : element_first.group_name,
                    group_id : element_first.group_id
                  })
                  res.data.err_msg.second.forEach(element_second => {
                    if(element_first.group_id == element_second.group_fid) {
                      that.operation_second_cate.push({
                        value : element_second.group_id,
                        label : element_second.group_name,
                        group_fid : element_second.group_fid,
                        group_id : element_second.group_id
                      })
                      that.operationClassification_list[first_index].children = that.operation_second_cate
                    }
                  })
                })
            } else {
              res.data.err_msg.first.forEach(element_first => {
                that.operationClassification_list.push({
                  value : element_first.group_id,
                  label : element_first.group_name
                })
                that.operation_one_classification.push({
                  value : element_first.group_id,
                  label : element_first.group_name
                })
              })
            }
          }
          // console.log(that.operationClassification_list)
        }else{
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
    },

     //运营三级分类选择
    pick_operation_change(value) {
      this.classification_value = value
      console.log(this.classification_value)
    },

    // 获取商品三级分类
    get_cate(){
      let that = this
      goods_get_cate().then(res=>{
        if(res.data.err_code==0){
          if( res.data.err_msg.first.length > 0) {

            if(res.data.err_msg.second.length > 0) { //存在二级分类

              if(res.data.err_msg.third.length > 0) { //存在三级分类

                res.data.err_msg.first.forEach((element_first , first_index) => {
                  that.second_cate = []
                  that.classification_list.push({
                    value : element_first.cat_id,
                    label : element_first.cat_name,
                    cat_id : element_first.cat_id
                  })

                  res.data.err_msg.second.forEach(element_second => {
                    that.three_cate = []
                    if(element_first.cat_id == element_second.cat_fid) {//一级分类的ID等于二级分类的父级ID
                      that.second_cate.push({
                        value : element_second.cat_id,
                        label : element_second.cat_name,
                        cat_fid : element_second.cat_fid,
                        cat_id : element_second.cat_id
                      })
                      that.classification_list[first_index].children = that.second_cate

                      res.data.err_msg.third.forEach(element_third => {

                        if(element_second.cat_id == element_third.cat_fid) {
                          that.three_cate.push({
                            value : element_third.cat_id,
                            label : element_third.cat_name,
                            cat_fid : element_third.cat_fid,
                            cat_id : element_third.cat_id
                          })
                          let index = that.classification_list[first_index].children.length-1
                          that.classification_list[first_index].children[index].children = that.three_cate
                        }
                      })
                    }
                  })
                })
                
              } else {//不存在三级分类
                res.data.err_msg.first.forEach((element_first , first_index) => {
                  that.second_cate = []
                  that.classification_list.push({
                    value : element_first.cat_id,
                    label : element_first.cat_name,
                    cat_id : element_first.cat_id
                  })
                  res.data.err_msg.second.forEach(element_second => {
                    if(element_first.cat_id == element_second.cat_fid) {
                      that.second_cate.push({
                        value : element_second.cat_id,
                        label : element_second.cat_name,
                        cat_fid : element_second.cat_fid,
                        cat_id : element_second.cat_id
                      })
                      that.classification_list[first_index].children = that.second_cate
                    }
                  })
                })
              }

            } else {
              res.data.err_msg.first.forEach(element_first => {
                that.classification_list.push({
                  value : element_first.cat_id,
                  label : element_first.cat_name
                })
              })
            }
          }
          console.log(that.classification_list)
        }else{
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: 'error'
          });
        }
      })
    },

    //商品三级分类选择
    pick_cate_change(value) {
      this.category_form.classification_value_copy = value
      console.log(this.category_form.classification_value_copy)
    },

    //分页
    get_shop_list_page (page , number) {
      let that = this
      that.loading = true
      yunying_cate(
        {
          page : page,
          cat_id : that.goods_one_classification_value
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            let copyArray = []
            res.data.err_msg.list.forEach(element => {
              copyArray.push({
                group_fid : element.group_fid,//上一级分类id
                group_id : element.group_id,//分类id
                group_name : element.group_name,
                icon : element.icon, //图标路径url
                sort : element.sort,//排序
                status : element.status,//状态 0禁用 1启用
                full_cate : element.full_cate
              })
              if(element.child) {
                element.child.forEach(element_first => {
                    copyArray.push({
                      group_fid : element_first.group_fid,//上一级分类id
                      group_id : element_first.group_id,//分类id
                      group_name : element.group_name + '>>' + element_first.group_name,
                      icon : element_first.icon, //图标路径url
                      sort : element_first.sort,//排序
                      status : element_first.status,//状态 0禁用 1启用
                      full_cate : element_first.full_cate
                    })
                    if(element_first.child) {
                      element_first.child.forEach(element_second => {
                        copyArray.push({
                          group_fid : element_second.group_fid,//上一级分类id
                          group_id : element_second.group_id,//分类id
                          group_name : element.group_name + '>>' + element_first.group_name + '>>' + element_second.group_name,
                          icon : element_second.icon, //图标路径url
                          sort : element_second.sort,//排序
                          status : element_second.status,//状态 0禁用 1启用
                          full_cate : element_second.full_cate
                        })
                      })
                    }
                  })
                }
            })
            console.log(copyArray)
            that.classificationList = copyArray
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
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
      this.get_shop_list_page(val,2)
    },

    //新增运营分类
    add_classification () {
      let that = this
      that.title = '新增分类'
      that.dialogFormVisible = true
      that.form.ifAdd  = true
      that.form.parentClass = ''
      that.parentClassCopy = []
      that.form.cate_name = ''
      that.form.sort = ''
      that.form.status = ''
      that.form.img_url = ''
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
              that.form.img_url = res.data.err_msg.url 
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

    //添加
    add_class () {
      let that = this
      if(that.form.cate_name == '') {
        that.$message({
          message: '请填写分类名称',
          type: 'warning'
        });
        return
      }
      if(that.form.sort == '' || parseInt(that.form.sort) < 0 || parseInt(that.form.sort) > 1000 ) {
        that.$message({
          message: '请填写分类排序(分类排序需要大于0小于1000)',
          type: 'warning'
        });
        return
      }
      if(that.form.status == '') {
        that.$message({
          message: '请选择分类状态',
          type: 'warning'
        });
        return
      }
      if(that.form.img_url == '') {
        that.$message({
          message: '请上传分类ICON',
          type: 'warning'
        });
        return
      }
      let fid = 0
      if(that.classification_value.length > 0) {
        fid = that.classification_value[that.classification_value.length-1]
      }
      console.log(fid)
      add_yunying_cate({
        group_name: that.form.cate_name,
        group_fid : fid,
        sort : that.form.sort,
        status : that.form.status,
        icon : that.form.img_url
      })
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.dialogFormVisible = false
            that.$message({
              message: '添加成功',
              type: 'success'
            });
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_goodsCate_list();
            that.get_operation() //获取运营一级
          } else {
            that.dialogFormVisible = false
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.dialogFormVisible = false
          console.log(error);
        });
    },

    //保存
    save_class () {
      let that = this
      if(that.form.cate_name == '') {
        that.$message({
          message: '请填写分类名称',
          type: 'warning'
        });
        return
      }
      if(that.form.sort == '' || parseInt(that.form.sort) < 0 || parseInt(that.form.sort) > 1000 ) {
        that.$message({
          message: '请填写分类排序(分类排序需要大于0小于1000)',
          type: 'warning'
        });
        return
      }
      if(that.form.img_url == '') {
        that.$message({
          message: '请上传分类ICON',
          type: 'warning'
        });
        return
      }
      save_yunying_cate({
        group_name: that.form.cate_name,
        group_id : that.O_message.group_id,
        sort : that.form.sort,
        icon : that.form.img_url
      })
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.dialogFormVisible = false
            that.$message({
              message: '编辑成功',
              type: 'success'
            });
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_goodsCate_list();
            that.get_operation() //获取运营一级
          } else {
            that.dialogFormVisible = false
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.dialogFormVisible = false
          console.log(error);
        });
    },

     //启用
    enable (index , row) {
      let that = this
      this.$confirm('此操作将启用' + row.group_name + '运营分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        group_status({
          group_id: row.group_id,
          status : 1,
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '启用成功',
                type: 'success'
              });
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              // that.get_goodsCate_list();
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
      this.$confirm('此操作将停用' + row.group_name + '运营分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        group_status({
          group_id: row.group_id,
          status : 2,
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '停用成功',
                type: 'success'
              });
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              // that.get_goodsCate_list();
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

     //关联品类
    propertySettings (index , row) {
      console.log(row)
      let that = this
      that.O_message = row
      that.showList = []
      that.category_form.categoryClass = row.group_name
      that.category_form.classification_value_copy = []
      that.category_form.value = []
      that.category_visible = true
      if(row.full_cate.length != 0) {
        row.full_cate.forEach(item => {
          console.log(item)
          let id = item.cat_id
          if(item.cat_sid) {
            id = item.cat_sid
          }
          if(item.cat_tid) {
            id = item.cat_tid
          }
          that.showList.push ({
            key : id,
            label : item.cate_name,
            disabled : false
          })
        });
      }
      console.log(that.showList)
      that.showList_copy = that.showList
    },

    //清除
    relation_del () {
      this.category_form.classification_value_copy = []
    },

    //确认
    relation_sure () {
      let that = this
      let show_contant = ''
      let value_length = this.category_form.classification_value_copy.length
      if(this.category_form.classification_value_copy.length > 0) {
        console.log(that.classification_list)
        that.classification_list.forEach(element => {
          if(element.cat_id == that.category_form.classification_value_copy[0]) {
            show_contant = element.label
          }
          if(element.children && value_length == 2 ) {
            element.children.forEach(item => {
              if(item.cat_id == that.category_form.classification_value_copy[1]) {
                show_contant = show_contant + '>>' + item.label
              }
              if(item.children && value_length == 3) {
                item.children.forEach(ele_s => {
                  if(ele_s.cat_id == that.category_form.classification_value_copy[2]) {
                    show_contant = show_contant + '>>' + ele_s.label
                  }
                })
              }
            })
          }
        })
        let id = that.category_form.classification_value_copy[0]
        if(that.category_form.classification_value_copy[1]) {
          id = that.category_form.classification_value_copy[1]
        }
        if(that.category_form.classification_value_copy[2]) {
          id = that.category_form.classification_value_copy[2]
        }
        console.log(111)
        that.showList.push ({
          key : id,
          label : show_contant,
          disabled : false
        })
        let arr = []
        arr = that.showList
        that.showList_copy = arr
        console.log(that.showList)
        console.log(that.showList_copy)
      }
    },

    //左右移动
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
      let that = this
      let arr = []
      that.showList_copy.forEach(element => {
        if(value.length > 0) {
          let leg = false
          value.forEach(item => {
            if(item == element.key) {
              leg = true
            }
          })
          if(leg == false) {
            arr.push(element)
          }
        }
      })
      console.log(arr)
      that.showList_copy = arr
    },

    //确认关联
    add_relation () {
      console.log(this.showList)
      let that = this
      let arr = []
      this.showList_copy.forEach(ele => {
        arr.push(ele.key)
      })
      console.log(arr)
      create_relation({
          group_id: that.O_message.group_id,
          cate_id_arr : arr,
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '关联成功',
                type: 'success'
              });
              that.category_visible = false
              this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
              // that.get_goodsCate_list();
            } else {
              that.category_visible = false
              that.$message({
                showClose: true,
                message: res_s.data.err_msg,
                type: 'error'
              });
            }
          })
          .catch((error) => {
            that.category_visible = false
            console.log(error);
          });
    },

     //编辑
    compile (index , row) {
      console.log(row)
      let that = this
      that.O_message = row
      that.title = '编辑分类'
      that.dialogFormVisible = true
      that.form.ifAdd  = false
      if(parseInt(row.cat_fid) == 0) {
        that.form.parentClass = '无'
        that.form.cate_name = row.group_name
      } else {
        let result = row.group_name.split('>>')   
        that.form.parentClass = result[0]
        if(result.length == 3) {
          that.form.parentClass = result[0] + '>>' + result[1]
        }
        that.form.cate_name = result[result.length-1]
      }
      that.form.sort = row.sort
      that.form.img_url = row.icon
    },

    //搜索
    pick_seach () {
      let that = this
      if(that.operationClassification_value == '') {
        that.$message({
          message: '请选择运营一级分类',
          type: 'warning'
        });
        return
      }
      that.loading = true
      yunying_cate(
        {
          page : 1,
          group_id : that.operationClassification_value
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            let copyArray = []
             res.data.err_msg.list.forEach(element => {
              copyArray.push({
                group_fid : element.group_fid,//上一级分类id
                group_id : element.group_id,//分类id
                group_name : element.group_name,
                icon : element.icon, //图标路径url
                sort : element.sort,//排序
                status : element.status,//状态 0禁用 1启用
                full_cate : element.full_cate
              })
              if(element.child) {
                element.child.forEach(element_first => {
                    copyArray.push({
                      group_fid : element_first.group_fid,//上一级分类id
                      group_id : element_first.group_id,//分类id
                      group_name : element.group_name + '>>' + element_first.group_name,
                      icon : element_first.icon, //图标路径url
                      sort : element_first.sort,//排序
                      status : element_first.status,//状态 0禁用 1启用
                      full_cate : element_first.full_cate
                    })
                    if(element_first.child) {
                      element_first.child.forEach(element_second => {
                        copyArray.push({
                          group_fid : element_second.group_fid,//上一级分类id
                          group_id : element_second.group_id,//分类id
                          group_name : element.group_name + '>>' + element_first.group_name + '>>' + element_second.group_name,
                          icon : element_second.icon, //图标路径url
                          sort : element_second.sort,//排序
                          status : element_second.status,//状态 0禁用 1启用
                          full_cate : element_second.full_cate
                        })
                      })
                    }
                  })
                }
            })
            console.log(copyArray)
            that.classificationList = copyArray
            that.queryInfo.page = parseInt(res.data.err_msg.page)
            that.queryInfo.total = parseInt(res.data.err_msg.total_number)
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

.seach {
  display: flex;
  /deep/ .el-input {
    width:200px;
    margin: 0 20px 0 10px;
  }
}

.dialogForm {
  /deep/ .el-dialog {
    width: 500px !important;
    /deep/ .el-dialog__body {
      display: flex;
      justify-content: space-between;
    }
    /deep/ .el-input {
      overflow-y: auto;  /*溢出隐藏*/
      // text-overflow: ellipsis; /*以省略号...显示*/
      // white-space: nowrap;  /*强制不换行*/
    }
  }
}

.category {
  /deep/ .el-dialog {
    width: 1300px !important;
    /deep/ .el-dialog__body {
      display: flex;
      justify-content: space-between;
    }
    /deep/ .el-input {
      overflow-y: auto;  /*溢出隐藏*/
      // text-overflow: ellipsis; /*以省略号...显示*/
      // white-space: nowrap;  /*强制不换行*/
    }
  }
  /deep/ .el-transfer-panel {
    width : 280px;
  }
}


.seach_copy {
  margin-top:20px;
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
  padding: 15px;
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