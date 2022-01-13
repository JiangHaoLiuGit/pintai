<template>
  <div class="goodsindex">
    <div class="seach_copy">
      <div class="seach_select">
        <el-select
          v-model="goods_one_classification_value"
          placeholder="请选择商品一级分类"
        >
          <el-option
            v-for="item in goods_one_classification"
            :key="item.cat_id"
            :label="item.label"
            :value="item.cat_id"
          >
          </el-option>
        </el-select>
        <el-button type="primary" @click="pick_seach">搜索</el-button>
      </div>
      <div class="button_type">
        <el-button type="success" @click="add_classification"
          >新增商品分类</el-button
        >
        <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
          >刷新</el-button
        >
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="classificationList"
          border
          :height="height"
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" width="80">
          </el-table-column>
          <el-table-column label="分类ID" prop="cat_id"> </el-table-column>
          <el-table-column label="分类名称" prop="cat_name"> </el-table-column>
          <el-table-column label="排序" prop="cat_sort" width="80">
          </el-table-column>
          <el-table-column label="已设置属性" width="200">
            <template slot-scope="scope">
              {{ scope.row.group_num }} 组 {{ scope.row.attribute_num }} 个
            </template>
          </el-table-column>
          <el-table-column label="操作" width="610">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="enable1(scope.$index, scope.row)"
                v-if="scope.row.is_open == 2"
                >后台启用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-else-if="scope.row.is_open == 1"
                @click="stop_useing1(scope.$index, scope.row)"
                >后台停用</el-button
              >
              
              <el-button
                size="mini"
                type="primary"
                @click="enable(scope.$index, scope.row)"
                v-show="scope.row.cat_status == 0"
                >启用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-show="scope.row.cat_status == 1"
                @click="stop_useing(scope.$index, scope.row)"
                >停用</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="propertySettings(scope.$index, scope.row)"
                >规格设置</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="compile(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="sales_settings(scope.$index, scope.row)"
                >销售属性设置</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="excise_settings(scope.$index, scope.row)"
                >许可证设置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 编辑弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      class="dialogForm"
    >
      <el-form :model="form">
        <!-- <div style="position:relative"> -->
        <el-form-item
         
          label="父级品类"
          :label-width="formLabelWidth"
          v-show="!form.ifAdd"
        >
          
          <el-input
            v-model="form.parentClass"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <!-- </div> -->
        <div style="position:relative">
          <div class="wo"></div>
        <el-form-item
          style="position:relative"
          label="父级品类"
          :label-width="formLabelWidth"
          v-show="form.ifAdd"
        >
          
          <el-cascader
            placeholder="请选择商品分类"
            v-model="form.parentClassCopy"
            :options="classification_list"
            :props="{ expandTrigger: 'hover', checkStrictly: true }"
            @change="pick_cate_change"
          ></el-cascader>
        </el-form-item>
        </div>
        <div style="position:relative">
          <div class="wo"></div>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cate_name" autocomplete="off"></el-input>
        </el-form-item>
        </div>
        <div style="position:relative">
          <div class="wo"></div>
        <el-form-item label="分类排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" autocomplete="off"></el-input>
        </el-form-item>
        </div>
        <el-form-item label="分类图片" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action=""
            :http-request="img_upload1"
            :before-upload="img_beforeUpload1"
            :show-file-list="false"
            list-type="picture"
            style="margin-bottom: 20px"
          >
            <el-button size="small" type="primary">上传分类图片</el-button>
          </el-upload>
          <el-image
            style="width: 100px; height: 100px"
            :src="form.cat_pic"
            fit="cover"
          >
            <div
              slot="error"
              class="image-slot"
              style="
                width: 98px;
                height: 98px;
                text-align: center;
                border: 1px solid #bbb;
              "
            >
              <i
                class="el-icon-picture-outline"
                style="font-size: 25px; margin-top: 32px"
              ></i>
            </div>
          </el-image>
        </el-form-item>
        <div style="position:relative">
          <div class="wo"></div>
        <el-form-item
          label="分类状态"
          :label-width="formLabelWidth"
          v-show="form.ifAdd"
        >
          <el-radio v-model="form.status" label="1">启用</el-radio>
          <el-radio v-model="form.status" label="2">禁用</el-radio>
        </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add_class" v-show="form.ifAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="save_class" v-show="!form.ifAdd"
          >保 存</el-button
        >
      </div>
    </el-dialog>

    <!-- 销售属性设置弹窗 -->
    <el-dialog
      title="销售属性设置"
      :visible.sync="dialogSaleVisible"
      class="saleDialog"
    >
      <h4>分类名称 : {{ sale_h }}</h4>
      <div class="seach_copy">
        <div class="seach_select"></div>
        <div class="button_type">
          <el-button type="success" @click="add_sale_attribute"
            >新增销售属性</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-refresh" @click="fn2">刷新</el-button> -->
        </div>
      </div>
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="salesAttributesList"
            border
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="80">
            </el-table-column>
            <el-table-column label="属性名" width="120" prop="name">
            </el-table-column>
            <!-- <el-table-column 
              label="是否包含图片"
              prop="contain" 
              width="120"
            >
            </el-table-column> -->
            <el-table-column label="属性值">
              <template slot-scope="scope">
                <ul style="display: flex; flex-wrap: wrap">
                  <li v-for="(item, index) in scope.row.value" :key="index">
                    {{ item.value }}
                    {{ index != scope.row.value.length - 1 ? "、" : "" }}
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  v-show="scope.row.is_edit"
                  @click="sale_compile(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  v-show="scope.row.is_edit"
                  @click="sales_del(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- 内层弹窗 -->
      <el-dialog
        class="sale_inner"
        :title="inner_title"
        :visible.sync="sale_innerVisible"
        append-to-body
      >
        <h4>分类名称 : {{ sale_h }}</h4>
        <el-form :model="form_sale">
          <el-form-item label="属性名称:" :label-width="formLabelWidth">
            <el-input v-model="form_sale.name" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="是否包含图片:" :label-width="formLabelWidth">
            <el-radio v-model="form_sale.imgShow" label="1">是</el-radio>
            <el-radio v-model="form_sale.imgShow" label="2">否</el-radio>
          </el-form-item> -->
          <el-form-item
            label="操作:"
            :label-width="formLabelWidth"
            v-show="!form_sale.attributes_addShow"
          >
            <el-button type="primary" @click="add_attributes"
              >添加属性值</el-button
            >
          </el-form-item>
          <el-form-item
            label="属性值:"
            :label-width="formLabelWidth"
            v-show="form_sale.attributes_addShow"
          >
            <el-input
              v-model="form_sale.attributes"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="上传图片:" :label-width="formLabelWidth" v-show="form_sale.attributes_addShow">
            <el-upload
              class="upload-demo"
              action=""
              :http-request="img_upload"
              :before-upload="img_beforeUpload"
              :show-file-list = "false"
              list-type="picture">
              <el-button size="small" type="primary" >上传图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="属性值图片:" :label-width="formLabelWidth" v-show="form_sale.attributes_addShow">
            <el-image
              :src="form_sale.attributesImg"
              fit="cover"></el-image>
          </el-form-item> -->

          <el-form-item
            label="操作:"
            :label-width="formLabelWidth"
            v-show="form_sale.attributes_addShow"
          >
            <el-button type="primary" @click="attributes_add">添 加</el-button>
            <el-button type="primary" @click="attributes_del">清 空</el-button>
          </el-form-item>
          <el-form-item
            label="是否公用:"
            :label-width="formLabelWidth"
          >
            <el-radio v-model="form_sale.is_public" label="1">公用</el-radio>
            <el-radio v-model="form_sale.is_public" label="2">不公用</el-radio>
          </el-form-item>
        </el-form>
        
        
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="salesAttributesValueList"
              border
              style="width: 100%"
            >
              <el-table-column label="序号" type="index" width="80">
              </el-table-column>
              <el-table-column label="属性名">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.name"
                    autocomplete="off"
                  ></el-input>
                </template>
              </el-table-column>
              <!-- <el-table-column label="图片">
                <template slot-scope="scope">
                  <el-image
                    :src="scope.row.image"
                    fit="cover"></el-image>
                </template>
              </el-table-column> -->
              <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                  <div style="display: flex; justify-content: center">
                    <!-- <el-upload
                      class="upload-demo"
                      action=""
                      :http-request="img_upload_table"
                      :before-upload="img_beforeUpload_table"
                      :show-file-list = "false"
                      list-type="picture">
                      <el-button size="small" type="primary" @click="get_img_index(scope.$index, scope.row)" >上传图片</el-button>
                    </el-upload> -->
                    <el-button
                      size="mini"
                      type="danger"
                      @click="sales_value_del(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="sale_innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="sales_add" v-show="sales_add_ifShow"
            >确 定</el-button
          >
          <el-button
            type="primary"
            @click="sales_save"
            v-show="!sales_add_ifShow"
            >保 存</el-button
          >
        </div>
      </el-dialog>
    </el-dialog>

    <!-- 属性设置弹窗 -->
    <el-dialog
      title="属性设置"
      :visible.sync="dialogAttributesVisible"
      class="attributesDialog"
    >
      <h4>分类名称 : {{ attributes_title }}</h4>
      <div class="seach_copy">
        <div class="seach_select"></div>
        <div class="button_type">
          
          <el-button type="success" @click="see_attribute_name"
            >查看属性组</el-button
          >
          <el-button type="success" @click="add_attribute_group"
            >添加属性组</el-button
          >
          <el-button type="success" @click="add_attribute_name"
            >添加属性名</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-refresh" @click="fn3">刷新</el-button> -->
        </div>
      </div>
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :span-method="cellMerge"
            :data="attributes_list"
            border
            style="width: 100%"
          >
            <el-table-column label="属性组/属性名/单位">
              <template slot-scope="scope">
                {{scope.row.group_name}} / {{scope.row.name}} / {{scope.row.unit == ''?'无':scope.row.unit}}
              </template>
            </el-table-column>
            <el-table-column label="表单方式/搜索属性/是否必填">
              <template slot-scope="scope">
                {{scope.row.type_value}} / {{ scope.row.is_search == 1 ? "是" : "否" }}/ {{ scope.row.is_must == 1 ? "是" : "否" }}
              </template>
            </el-table-column>
            <el-table-column label="属性值" prop="value">
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  v-show="scope.row.is_open == 2"
                  @click="enable_attributes(scope.$index, scope.row)"
                  >启用</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  v-show="scope.row.is_open == 1"
                  @click="stop_useing_attributes(scope.$index, scope.row)"
                  >禁用</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="属性操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-top"
                  v-show="scope.$index != 0"
                  @click="param_up_attributes(scope.$index, scope.row)"
                  >上移</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-bottom"
                  v-show="scope.$index != attributes_list.length - 1"
                  @click="param_down_attributes(scope.$index, scope.row)"
                  >下移</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  style="margin-top:10px"
                  @click="param_edit(scope.$index, scope.row)"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="属性组操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-top"
                  v-show="scope.$index != 0"
                  @click="group_up_attributes(scope.$index, scope.row)"
                  >上移</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-bottom"
                  v-show="scope.$index != attributes_list.length - last_index"
                  @click="group_down_attributes(scope.$index, scope.row)"
                  >下移</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  style="margin-top:10px"
                  @click="group_edit(scope.$index, scope.row)"
                  >编辑</el-button
                >
                
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- 内层弹窗 属性编辑-->
      <!-- <el-dialog
        class="sale_inner"
        :title="inner_title"
        :visible.sync="attribute_innerVisible"
        append-to-body>
        <h4>分类名称 : {{attributes_title}}</h4>
        <el-form :model="form_sale">
          <el-form-item label="属性名称:" :label-width="formLabelWidth">
            <el-input v-model="form_sale.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否包含图片:" :label-width="formLabelWidth">
            <el-radio v-model="form_sale.imgShow" label="1">是</el-radio>
            <el-radio v-model="form_sale.imgShow" label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="操作:" :label-width="formLabelWidth" v-show="!form_sale.attributes_addShow">
            <el-button type="primary" @click="add_attributes">添加属性值</el-button>
          </el-form-item>
          <el-form-item label="属性值:" :label-width="formLabelWidth" v-show="form_sale.attributes_addShow">
            <el-input v-model="form_sale.attributes" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="上传图片:" :label-width="formLabelWidth" v-show="form_sale.attributes_addShow">
            <el-upload
              class="upload-demo"
              action=""
              :http-request="img_upload"
              :before-upload="img_beforeUpload"
              :show-file-list = "false"
              list-type="picture">
              <el-button size="small" type="primary" >上传图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="属性值图片:" :label-width="formLabelWidth" v-show="form_sale.attributes_addShow">
            <el-image
              :src="form_sale.attributesImg"
              fit="cover"></el-image>
          </el-form-item>
          <el-form-item label="操作:" :label-width="formLabelWidth" v-show="form_sale.attributes_addShow">
            <el-button type="primary" @click="attributes_add">添 加</el-button>
            <el-button type="primary" @click="attributes_del">清 空</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="salesAttributesValueList"
              border
              style="width: 100%"
            >
              <el-table-column 
                label="序号"
                type="index" 
                width="80"
              >
              </el-table-column>
              <el-table-column label="属性名"  width="140">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" autocomplete="off"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="图片">
                <template slot-scope="scope">
                  <el-image
                    :src="scope.row.image"
                    fit="cover"></el-image>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                  <div style="display:flex;justify-content: center;">
                    <el-upload
                      class="upload-demo"
                      action=""
                      :http-request="img_upload_table"
                      :before-upload="img_beforeUpload_table"
                      :show-file-list = "false"
                      list-type="picture">
                      <el-button size="small" type="primary" @click="get_img_index(scope.$index, scope.row)" >上传图片</el-button>
                    </el-upload>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="sales_value_del(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="sale_innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="sales_add" v-show="sales_add_ifShow">确 定</el-button>
          <el-button type="primary" @click="sales_save" v-show="!sales_add_ifShow">保 存</el-button>
        </div>
      </el-dialog> -->

      <!-- 内层弹窗 属性组添加/编辑-->
      <el-dialog
        class="group_inner"
        :title="group_title"
        :visible.sync="attribute_add_group"
        append-to-body
      >
        <el-form :model="group_form">
          <el-form-item label="属性组名称:" :label-width="formLabelWidth">
            <el-input v-model="group_form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attribute_add_group = false">取 消</el-button>
          <el-button
            type="primary"
            @click="group_add"
            v-show="group_form.add_show"
            >确 定</el-button
          >
          <el-button
            type="primary"
            @click="group_save"
            v-show="!group_form.add_show"
            >保 存</el-button
          >
        </div>
      </el-dialog>

      <!-- 内层弹窗 属性组查看删除-->
      <el-dialog
        class="group_inner2"
        title="查看属性组"
        :visible.sync="property_name_see"
        append-to-body
      >
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="property_name_list"
              border
              style="width: 100%"
            >
              <el-table-column label="序号" type="index" width="80">
              </el-table-column>
              <el-table-column label="属性组名字" prop="name"> </el-table-column>
              <el-table-column label="创建时间" prop="create_time"> </el-table-column>
              <el-table-column label="商品分类id" prop="category_id"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="group_delete(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>        
      </el-dialog>

      <!-- 内层弹窗 添加属性名-->
      <el-dialog
        class="add_inner"
        :title="add_attribute_title"
        :visible.sync="property_name_add_group"
        append-to-body
      >
        <el-form :model="property_name">
          <el-form-item
            label="属性组:"
            :label-width="formLabelWidth"
            v-show="property_name.add_show"
          >
            <el-select
              v-model="property_name.group_value"
              placeholder="请选择属性组"
            >
              <el-option
                v-for="item in property_name_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="属性组:"
            :label-width="formLabelWidth"
            v-show="!property_name.add_show"
          >
            <el-input
              v-model="property_name.group_name"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="属性名:" :label-width="formLabelWidth">
            <el-input
              v-model="property_name.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位:" :label-width="formLabelWidth">
            <el-input
              v-model="property_name.unit"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="表单类型:" :label-width="formLabelWidth">
            <el-select
              v-model="property_name.type"
              placeholder="请选择表单类型"
            >
              <el-option
                v-for="item in pick_way"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否必填:" :label-width="formLabelWidth">
            <el-radio v-model="property_name.is_must" label="1">是</el-radio>
            <el-radio v-model="property_name.is_must" label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="是否搜索:" :label-width="formLabelWidth">
            <el-radio v-model="property_name.is_search" label="1">是</el-radio>
            <el-radio v-model="property_name.is_search" label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="状态:" :label-width="formLabelWidth">
            <el-radio v-model="property_name.is_open" label="1">启用</el-radio>
            <el-radio v-model="property_name.is_open" label="2">禁用</el-radio>
          </el-form-item>
          <el-form-item label="备注:" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="property_name.mark"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="操作:"
            :label-width="formLabelWidth"
            v-show="!property_name.ifAdd"
          >
            <el-button @click="add_attribute_value" type="primary"
              >添加属性值</el-button
            >
          </el-form-item>
          <el-form-item
            label="属性值:"
            :label-width="formLabelWidth"
            v-show="property_name.ifAdd"
          >
            <el-input
              v-model="property_name.value"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item

            label="操作:"
            :label-width="formLabelWidth"
            v-show="property_name.ifAdd"
          >
            <el-button @click="add_attribute_sure" type="primary"
              >确 认</el-button
            >
            <el-button @click="attribute_clear" type="primary">清 空</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="valueList"
              border
              style="width: 100%"
            >
              <el-table-column label="序号" type="index" width="80">
              </el-table-column>
              <el-table-column label="属性值">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.name"
                    autocomplete="off"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                  <div style="display: flex; justify-content: center">
                    <el-button
                      size="mini"
                      type="primary"
                      v-show="scope.$index != 0"
                      @click="value_up(scope.$index, scope.row)"
                      >上移</el-button
                    >
                    <el-button
                      size="mini"
                      type="primary"
                      v-show="scope.$index != valueList.length - 1"
                      @click="value_down(scope.$index, scope.row)"
                      >下移</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="value_del(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="property_name_add_group = false">取 消</el-button>
          <el-button
            type="primary"
            @click="property_name_add"
            v-show="property_name.add_show"
            >确 定</el-button
          >
          <el-button
            type="primary"
            @click="property_name_save"
            v-show="!property_name.add_show"
            >保 存</el-button
          >
        </div>
      </el-dialog>
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
        <!-- :page-sizes="[2,5, 10, 20, 50]" -->
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  goods_cate,
  goods_get_cate,
  cate_status,
  add_goods_cate,
  save_goods_cate,
  upload_img,
  param_list_goods,
  add_param_group,
  group_up,
  group_down,
  param_up,
  param_down,
  param_status,
  edit_param_group,
  group_list,
  add_param,
  edit_param,
  sale_tpl,
  save_tpl,
  cate_open,
  add_sale,
  del_tpl,
  del_param
} from "../../utils/axios";
export default {
  data() {
    return {
      classificationList: [], //商品分类列表
      loading: false,
      fn1: this.commonJs.Debounce(this.get_goodsCate_list),
      fn2: this.commonJs.Debounce(this.get_sales_attributes),
      // fn3: this.commonJs.Debounce(this.get_attributes_list),
      O_message: {},
      O_message_copy: {},
      O_message_copy_two: {},
      queryInfo: {
        page: 1,
        pageSize: 2,
        total: 1,
      },
      queryInfo1: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      classification_list: [], //商品分类列表
      classification_value: [],
      goods_one_classification: [], //商品一级分类
      goods_one_classification_value: "",
      title: "新增分类",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {
        //增加分类/编辑
        ifAdd: false,
        parentClass: "",
        parentClassCopy: [],
        cate_name: "",
        sort: "",
        status: "",
        cat_pic: "",
      },
      dialogSaleVisible: false,
      sale_innerVisible: false,
      salesAttributesList: [
        //销售属性
      ],
      salesAttributesValueList: [
        //销售属性值
        // {
        //   name : '白色',
        //   image : ''
        // }
      ],
      inner_title: "", //销售属性内层弹窗的title
      sale_h: "", //销售属性弹窗展示的分类
      form_sale: {
        name: "", //属性名称
        imgShow: "", //是否包含图片
        attributes: "2", //属性值
        is_public:"",//是否公用
        attributesImg: "", //属性值图片
        attributes_addShow: false,
      },
      other_img_upload_err: false, //图片上传
      img_upload_err: false, //图片上传表格
      sales_add_ifShow: false, //新增 /编辑销售属性
      imgIndex: -1,
      dialogAttributesVisible: false, //属性设置弹窗
      attributes_title: "",
      attributes_list: [], //属性列表
      attribute_innerVisible: false, //属性操作  编辑
      attribute_add_group: false, //添加  编辑 属性组
      group_title: "",
      group_form: {
        name: "",
        add_show: false,
      },
      category_id: "",
      property_name_add_group: false, //添加属性名
      property_name: {
        group_value: "", //属性组名
        name: "", //属性名
        group_name: "",
        unit: "", //单位
        type: "", //表单类型
        is_must: "", //是否必填
        is_search: "", //是否搜索
        is_open: "", //状态
        mark: "", //备注
        value: "", //属性值
        ifAdd: false,
        add_show: false,
      },
      property_name_list: [], //属性组列表
      spanArr: [], //合并表格数据
      pos: "",
      index_copy: [],
      last_index: -1,
      pick_way: [
        {
          value: "1",
          lable: "单选框",
        },
        {
          value: "2",
          lable: "下拉框",
        },
        {
          value: "3",
          lable: "输入框",
        },
        {
          value: "4",
          lable: "日期选择器(区间)",
        },
        {
          value: "5",
          lable: "多选框",
        },
        {
          value: "6",
          lable: "文本域",
        },
        {
          value: "7",
          lable: "日期选择器(单)",
        },
      ],
      valueList: [],
      add_attribute_title: "",
      sales_value_del_index: "",
      row: {},
      sales_row: {},
      row_po: {},
      property_name_see:false,
      height:"",
    };
  },

  created() {
    this.get_goodsCate_list(); //获取商品分类列表
    this.get_cate(); //获取商品三级分类
    this.height = document.body.clientHeight - 240
    console.log(this.height)
  },

  methods: {
    //上传图片
    img_upload1: function (item) {
      console.log(item);
      let that = this;
      if (this.other_img_upload_err == false) {
        let fd = new FormData();
        fd.append("file", item.file);
        console.log(fd.get("file"));
        upload_img(fd)
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.form.cat_pic = res.data.err_msg.url;
            } else {
              that.$message({
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
    //获取属性组
    get_group_list() {
      let that = this;
      group_list({
        category_id: that.row_po.cat_id,
      })
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            res_s.data.err_msg.data.forEach(element => {
              element.create_time = this.commonJs.timestampToTime(element.create_time)
            })
            that.property_name_list = res_s.data.err_msg.data;
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //获取商品分类列表
    get_goodsCate_list(index) {
      let that = this;
      that.loading = true;
      that.goods_one_classification_value = "";
      let request_form = {
        page: 1,
        page_size: 2
      };
      goods_cate(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            that.loading = false;
            let copyArray = [];
            res.data.err_msg.list.forEach((element) => {
              copyArray.push({
                cat_fid: element.cat_fid, //上一级分类id
                cat_id: element.cat_id, //分类id
                cat_name: element.cat_name,
                cat_path: element.cat_path, //包含的全部分类
                cat_sort: element.cat_sort, //排序
                cat_status: element.cat_status, //状态 0禁用 1启用
                is_open: element.is_open,
                attribute_num: element.attribute_num,
                cat_pic: element.cat_pic,
                group_num: element.group_num,
              });
              if (element.child) {
                element.child.forEach((element_first) => {
                  copyArray.push({
                    cat_fid: element_first.cat_fid, //上一级分类id
                    cat_id: element_first.cat_id, //分类id
                    cat_name: element.cat_name + ">>" + element_first.cat_name,
                    cat_path: element_first.cat_path, //包含的全部分类
                    cat_sort: element_first.cat_sort, //排序
                    cat_status: element_first.cat_status, //状态 0禁用 1启用
                    is_open: element_first.is_open,
                    attribute_num: element_first.attribute_num,
                    cat_pic: element_first.cat_pic,

                    group_num: element_first.group_num,
                  });
                  if (element_first.child) {
                    element_first.child.forEach((element_second) => {
                      copyArray.push({
                        cat_fid: element_second.cat_fid, //上一级分类id
                        cat_id: element_second.cat_id, //分类id
                        cat_name:
                          element.cat_name +
                          ">>" +
                          element_first.cat_name +
                          ">>" +
                          element_second.cat_name,
                        cat_path: element_second.cat_path, //包含的全部分类
                        cat_sort: element_second.cat_sort, //排序
                        cat_status: element_second.cat_status, //状态 0禁用 1启用
                        is_open: element_second.is_open,
                        attribute_num: element_second.attribute_num,
                        cat_pic: element_second.cat_pic,

                        group_num: element_second.group_num,
                        cat_pic: element_second.group_num,
                      });
                    });
                  }
                });
              }
            });
            that.classificationList = copyArray;
            that.queryInfo.page = parseInt(res.data.err_msg.page);
            that.queryInfo.total = parseInt(res.data.err_msg.total_number);
            if (index == 1) {
              that.$message({
                message: "刷新成功",
                type: "success",
              });
            }
          } else {
            that.loading = false;
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.loading = false;
          console.log(error);
        });
    },

    // 获取商品三级分类
    get_cate() {
      let that = this;
      that.goods_one_classification = [];
      that.classification_list = [];
      goods_get_cate().then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg.first.length > 0) {
            if (res.data.err_msg.second.length > 0) {
              //存在二级分类

              res.data.err_msg.first.forEach((element_first, first_index) => {
                that.second_cate = [];
                that.classification_list.push({
                  value: element_first.cat_id,
                  label: element_first.cat_name,
                  cat_id: element_first.cat_id,
                });
                that.goods_one_classification.push({
                  //存储一级分类
                  value: element_first.cat_id,
                  label: element_first.cat_name,
                  cat_id: element_first.cat_id,
                });
                res.data.err_msg.second.forEach((element_second) => {
                  if (element_first.cat_id == element_second.cat_fid) {
                    that.second_cate.push({
                      value: element_second.cat_id,
                      label: element_second.cat_name,
                      cat_fid: element_second.cat_fid,
                      cat_id: element_second.cat_id,
                    });
                    that.classification_list[first_index].children =
                      that.second_cate;
                  }
                });
              });
            } else {
              res.data.err_msg.first.forEach((element_first) => {
                that.classification_list.push({
                  value: element_first.cat_id,
                  label: element_first.cat_name,
                });

                that.goods_one_classification.push({
                  //存储一级分类
                  value: element_first.cat_id,
                  label: element_first.cat_name,
                });
              });
            }
          }
        } else {
          that.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },

    //分页
    
    get_shop_list_page(page, number) {
      let that = this;
      that.loading = true;
      goods_cate({
        page: page,
        cat_id: that.goods_one_classification_value,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false;
            let copyArray = [];
            res.data.err_msg.list.forEach((element) => {
              copyArray.push({
                cat_fid: element.cat_fid, //上一级分类id
                cat_id: element.cat_id, //分类id
                cat_name: element.cat_name,
                cat_path: element.cat_path, //包含的全部分类
                cat_sort: element.cat_sort, //排序
                cat_status: element.cat_status, //状态 0禁用 1启用
                is_open: element.is_open,
                attribute_num: element.attribute_num,
                cat_pic: element.cat_pic,

                group_num: element.group_num,
              });
              if (element.child) {
                element.child.forEach((element_first) => {
                  copyArray.push({
                    cat_fid: element_first.cat_fid, //上一级分类id
                    cat_id: element_first.cat_id, //分类id
                    cat_name: element.cat_name + ">>" + element_first.cat_name,
                    cat_path: element_first.cat_path, //包含的全部分类
                    cat_sort: element_first.cat_sort, //排序
                    cat_status: element_first.cat_status, //状态 0禁用 1启用
                    is_open: element_first.is_open,
                    attribute_num: element_first.attribute_num,
                    cat_pic: element_first.cat_pic,

                    group_num: element_first.group_num,
                  });
                  if (element_first.child) {
                    element_first.child.forEach((element_second) => {
                      copyArray.push({
                        cat_fid: element_second.cat_fid, //上一级分类id
                        cat_id: element_second.cat_id, //分类id
                        cat_name:
                          element.cat_name +
                          ">>" +
                          element_first.cat_name +
                          ">>" +
                          element_second.cat_name,
                        cat_path: element_second.cat_path, //包含的全部分类
                        cat_sort: element_second.cat_sort, //排序
                        cat_status: element_second.cat_status, //状态 0禁用 1启用
                        is_open: element_second.is_open,
                        attribute_num: element_second.attribute_num,
                        group_num: element_second.group_num,
                      });
                    });
                  }
                });
              }
            });
            that.classificationList = copyArray;
            that.queryInfo.page = parseInt(res.data.err_msg.page);
            that.queryInfo.total = parseInt(res.data.err_msg.total_number);
          } else {
            that.loading = false;
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.loading = false;
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
      this.get_shop_list_page(val, 2);
    },

    //新增商品分类
    add_classification() {
      this.form.cat_pic = ""
      let that = this;
      that.title = "新增分类";
      that.dialogFormVisible = true;
      that.form.ifAdd = true;
      that.form.parentClass = "";
      that.parentClassCopy = [];
      that.form.cate_name = "";
      that.form.sort = "";
      that.form.status = "";
    },

    //添加
    add_class() {
      let that = this;
      if (that.form.cate_name == "") {
        that.$message({
          message: "请填写分类名称",
          type: "warning",
        });
        return;
      }
      if (
        that.form.sort == "" ||
        parseInt(that.form.sort) < 0 ||
        parseInt(that.form.sort) > 1000
      ) {
        that.$message({
          message: "请填写分类排序(分类排序需要大于0小于1000)",
          type: "warning",
        });
        return;
      }
      if (that.form.status == "") {
        that.$message({
          message: "请选择分类状态",
          type: "warning",
        });
        return;
      }
      let fid = 0;
      if (that.classification_value.length > 0) {
        fid = that.classification_value[that.classification_value.length - 1];
      }
      console.log(fid);
      add_goods_cate({
        cate_name: that.form.cate_name,
        fid: fid,
        sort: that.form.sort,
        status: that.form.status,
        cat_pic: that.form.cat_pic,
      })
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.dialogFormVisible = false;
            that.$message({
              message: "添加成功",
              type: "success",
            });
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_goodsCate_list();
            that.get_cate(); //获取商品三级分类
          } else {
            that.dialogFormVisible = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.dialogFormVisible = false;
          console.log(error);
        });
    },

    //保存
    save_class() {
      let that = this;
      if (that.form.cate_name == "") {
        that.$message({
          message: "请填写分类名称",
          type: "warning",
        });
        return;
      }
      if (
        that.form.sort == "" ||
        parseInt(that.form.sort) < 0 ||
        parseInt(that.form.sort) > 1000
      ) {
        that.$message({
          message: "请填写分类排序(分类排序需要大于0小于1000)",
          type: "warning",
        });
        return;
      }
      // add_goods_cate({
      //   cate_name: that.form.cate_name,
      //   fid: fid,
      //   sort: that.form.sort,
      //   status: that.form.status,
      //   cat_pic: that.form.cat_pic,
      // })
      save_goods_cate({
        cate_name: that.form.cate_name,
        cat_id: that.O_message.cat_id,
        sort: that.form.sort,
        cat_pic: that.form.cat_pic,
      })
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.dialogFormVisible = false;
            that.$message({
              message: "编辑成功",
              type: "success",
            });
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
            // that.get_goodsCate_list();
            that.get_cate(); //获取商品三级分类
          } else {
            that.dialogFormVisible = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.dialogFormVisible = false;
          console.log(error);
        });
    },

    //启用
    enable(index, row) {
      let that = this;
      this.$confirm(
        "此操作将启用" + row.cat_name + "商品分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          cate_status({
            cat_id: row.cat_id,
            status: 1,
          })
            .then((res_s) => {
              console.log(res_s.data.err_code);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "启用成功",
                  type: "success",
                });
                this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                // that.get_goodsCate_list();
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    //后台启用
    enable1(index, row) {
      let that = this;
      this.$confirm(
        "此操作后台将启用" + row.cat_name + "商品分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          cate_open({
            cat_id: row.cat_id,
            is_open: 1,
          })
            .then((res_s) => {
              console.log(res_s.data.err_code);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "后台启用成功",
                  type: "success",
                });
                this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                // that.get_goodsCate_list();
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    //停用
    stop_useing(index, row) {
      let that = this;
      this.$confirm(
        "此操作将停用" + row.cat_name + "商品分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          cate_status({
            cat_id: row.cat_id,
            status: 2,
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "停用成功",
                  type: "success",
                });
                this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                // that.get_goodsCate_list();
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },

    //停用
    stop_useing1(index, row) {
      let that = this;
      this.$confirm(
        "此操作后台将停用" + row.cat_name + "商品分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          cate_open({
            cat_id: row.cat_id,
            is_open: 2,
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "停用成功",
                  type: "success",
                });
                this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                // that.get_goodsCate_list();
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },

    //属性设置
    propertySettings(index, row) {
      let that = this;
      that.row_po = row;
      that.category_id = row.cat_id;
      that.attributes_title = row.cat_name;
      that.get_attributes_list(row);
      that.dialogAttributesVisible = true;
    },

    //拉取属性列表
    get_attributes_list(row) {
      let that = this;
      that.spanArr = [];
      that.index_copy = [];
      that.attributes_list = [];
      param_list_goods({
        category_id: row.cat_id ? row.cat_id : "",
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            if (res_s.data.err_msg.list.length > 0) {
              that.last_index =
              res_s.data.err_msg.list[
                res_s.data.err_msg.list.length - 1
              ].param.length;
              that.index_copy = res_s.data.err_msg.list;
              if (res_s.data.err_msg.list.length > 0) {
                let arr = [];
                res_s.data.err_msg.list.forEach((elelment) => {
                  elelment.param.forEach((item) => {
                    item.group_name = elelment.group_name;
                    item.group_id = elelment.group_id;
                    item.group_sort = elelment.sort;
                    if (item.type == 1) {
                      item.type_value = "单选框";
                    } else if (item.type == 2) {
                      item.type_value = "下拉框";
                    } else if (item.type == 3) {
                      item.type_value = "输入框";
                    } else if (item.type == 4) {
                      item.type_value = "日期选择器(区间)";
                    } else if (item.type == 5) {
                      item.type_value = "多选框";
                    } else if (item.type == 6) {
                      item.type_value = "文本域";
                    } else if (item.type == 7) {
                      item.type_value = "日期选择器(单)";
                    }
                    arr.push(item);
                  });
                });
                console.log(arr);
                let data = arr;
                for (var i = 0; i < data.length; i++) {
                  if (i === 0) {
                    that.spanArr.push(1);
                    that.pos = 0;
                  } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i].group_id === data[i - 1].group_id) {
                      that.spanArr[that.pos] += 1;
                      that.spanArr.push(0);
                    } else {
                      that.spanArr.push(1);
                      that.pos = i;
                    }
                  }
                }
                that.attributes_list = arr;
              }
            }
            
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //表格合并行
    cellMerge({ row, column, rowIndex, columnIndex }) {
      // console.log(columnIndex)
      //当前行row、当前列column、当前行号rowIndex、当前列号columnIndex
      console.log(this.spanArr)
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row, //行
          colspan: _col, //列
        };
      }
    },

    //启用-属性名
    enable_attributes(index, row) {
      let that = this;
      this.$confirm("此操作将启用" + row.name + "属性名, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          param_status({
            id: row.id,
            is_open: 1,
          })
            .then((res_s) => {
              console.log(res_s.data.err_code);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "启用成功",
                  type: "success",
                });
                that.attributes_list = [];
                that.get_attributes_list(that.row_po);
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },

    //停用-属性名
    stop_useing_attributes(index, row) {
      let that = this;
      this.$confirm("此操作将停用" + row.name + "属性名, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          param_status({
            id: row.id,
            is_open: 2,
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "停用成功",
                  type: "success",
                });
                that.attributes_list = [];
                that.get_attributes_list(that.row_po);
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },

    //属性名上移
    param_up_attributes(index, row) {
      let that = this;
      param_up({
        cur_param_id: row.id, //点击上移 对应的id
        up_param_id: that.attributes_list[index - 1].id, //原本在点击记录上面的记录的id
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.attributes_list = [];
            that.get_attributes_list(that.row_po);
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //属性名下移
    param_down_attributes(index, row) {
      let that = this;
      param_down({
        cur_param_id: row.id,
        down_param_id: that.attributes_list[index + 1].id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.attributes_list = [];
            that.get_attributes_list(that.row_po);
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //属性组上移
    group_up_attributes(index, row) {
      let that = this;
      let up_group_id = -1;
      that.index_copy.forEach((element, index) => {
        if (row.group_id == element.group_id) {
          up_group_id = that.index_copy[index - 1].group_id;
        }
      });
      group_up({
        cur_group_id: row.group_id, //点击上移 对应的id
        up_group_id: up_group_id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.attributes_list = [];
            that.get_attributes_list(that.row_po);
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //属性组下移
    group_down_attributes(index, row) {
      let that = this;
      let down_group_id = -1;
      that.index_copy.forEach((element, index) => {
        if (row.group_id == element.group_id) {
          down_group_id = that.index_copy[index + 1].group_id;
        }
      });
      group_down({
        cur_group_id: row.group_id,
        down_group_id: down_group_id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.attributes_list = [];
            that.get_attributes_list(that.row_po);
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //属性组编辑
    group_edit(index, row) {
      this.O_message_copy = row;
      this.group_title = "属性组编辑";
      this.group_form.name = row.group_name;
      this.group_form.add_show = false;
      this.attribute_add_group = true;
    },

    //添加属性组
    add_attribute_group() {
      this.group_title = "添加属性组";
      this.group_form.name = "";
      this.group_form.add_show = true;
      this.attribute_add_group = true;
    },

    //添加属性名
    add_attribute_name() {
      this.valueList = [];
      this.property_name.group_value = "";
      this.property_name.group_name = "";
      this.property_name.name = "";
      this.property_name.unit = "";
      this.property_name.type = "";
      this.property_name.is_must = "";
      this.property_name.is_search = "";
      this.property_name.is_open = "";
      this.property_name.value = "";
      this.property_name.mark = "";
      this.property_name.add_show = true;
      this.property_name.ifAdd = false;
      this.add_attribute_title = "添加属性名";
      this.property_name_add_group = true;
      this.get_group_list(); //获取属性组
    },

    //查看属性组
    see_attribute_name(){
      this.property_name_see = true;
      this.get_group_list(); //获取属性组
    },

    //属性值  编辑
    param_edit(index, row) {
      console.log(row);
      this.O_message_copy_two = row;
      this.property_name.group_value = "";
      this.property_name.group_name = row.group_name;
      this.property_name.name = row.name;
      this.property_name.unit = row.unit;
      this.property_name.type = row.type;
      this.property_name.is_must = row.is_must;
      this.property_name.is_search = row.is_search;
      this.property_name.is_open = row.is_open;
      this.valueList = [];
      if (row.value != "") {
        let arr = row.value.split(",");
        arr.forEach((element) => {
          this.valueList.push({
            name: element,
          });
        });
      }
      this.property_name.mark = row.mark;
      this.property_name.add_show = false;
      this.property_name.ifAdd = false;
      this.add_attribute_title = "编辑属性名";
      this.property_name_add_group = true;
    },

    //添加属性值
    add_attribute_value() {
      this.property_name.value = "";
      this.property_name.ifAdd = true;
    },

    //清空属性值
    attribute_clear() {
      this.property_name.value = "";
      this.property_name.ifAdd = false;
    },

    //确认添加属性值
    add_attribute_sure() {
      let that = this;
      if (that.property_name.value == "") {
        that.$message({
          message: "请输入属性值",
          type: "warning",
        });
        return;
      }
      this.valueList.push({
        name: that.property_name.value,
      });
      this.property_name.ifAdd = false;
    },
    excise_settings(index,row){
      this.$router.push({path:"/goods/excise",query:{id:row.cat_id,name:row.cat_name}})
    },
    //属性值  删除
    value_del(index, row) {
      this.valueList.splice(index, 1);
    },

    //属性值  上移
    value_up(index, row) {
      let arr = this.valueList;
      arr.splice(index - 1, 1, ...arr.splice(index, 1, arr[index - 1]));
    },

    //属性值下移
    value_down(index, row) {
      let arr = this.valueList;
      arr.splice(index, 1, ...arr.splice(index + 1, 1, arr[index]));
    },

    //确认添加属性名
    property_name_add() {
      let that = this;
      if (that.property_name.group_value == "") {
        that.$message({
          message: "请选择属性组",
          type: "warning",
        });
        return;
      }
      if (that.property_name.name == "") {
        that.$message({
          message: "请输入属性名",
          type: "warning",
        });
        return;
      }
      if (that.property_name.type == "") {
        that.$message({
          message: "请选择表单类型",
          type: "warning",
        });
        return;
      }
      if (that.property_name.is_must == "") {
        that.$message({
          message: "请选择是否必填",
          type: "warning",
        });
        return;
      }
      if (that.property_name.is_search == "") {
        that.$message({
          message: "请选择是否搜索",
          type: "warning",
        });
        return;
      }
      if (that.property_name.is_open == "") {
        that.$message({
          message: "请选择状态",
          type: "warning",
        });
        return;
      }
      let params_value = "";
      if (
        that.property_name.type == 1 ||
        that.property_name.type == 2 ||
        that.property_name.type == 5
      ) {
        if (that.valueList.length == 0) {
          that.$message({
            message: "请设置属性值",
            type: "warning",
          });
          return;
        } else if (that.valueList.length == 1) {
          that.$message({
            message: "请至少设置两个属性值",
            type: "warning",
          });
          return;
        } else {
          that.valueList.forEach((element) => {
            if (params_value == "") {
              params_value = element.name;
            } else {
              params_value = params_value + "," + element.name;
            }
          });
        }
      }
      add_param({
        group_id: that.property_name.group_value,
        category_id: that.category_id,
        name: that.property_name.name,
        unit: that.property_name.unit,
        type: that.property_name.type,
        is_search: that.property_name.is_search,
        is_must: that.property_name.is_must,
        is_open: that.property_name.is_open,
        value: params_value,
        mark: that.property_name.mark,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.property_name_add_group = false;
            that.$message({
              message: "添加成功",
              type: "success",
            });
            that.get_attributes_list(that.row_po);
          } else {
            that.property_name_add_group = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.property_name_add_group = false;
          console.log(error);
        });
    },

    //编辑属性名
    property_name_save() {
      let that = this;
      if (that.property_name.name == "") {
        that.$message({
          message: "请输入属性名",
          type: "warning",
        });
        return;
      }
      if (that.property_name.type == "") {
        that.$message({
          message: "请选择表单类型",
          type: "warning",
        });
        return;
      }
      if (that.property_name.is_must == "") {
        that.$message({
          message: "请选择是否必填",
          type: "warning",
        });
        return;
      }
      if (that.property_name.is_search == "") {
        that.$message({
          message: "请选择是否搜索",
          type: "warning",
        });
        return;
      }
      if (that.property_name.is_open == "") {
        that.$message({
          message: "请选择状态",
          type: "warning",
        });
        return;
      }
      let params_value = "";
      if (
        that.property_name.type == 1 ||
        that.property_name.type == 2 ||
        that.property_name.type == 5
      ) {
        if (that.valueList.length == 0) {
          that.$message({
            message: "请设置属性值",
            type: "warning",
          });
          return;
        } else if (that.valueList.length == 1) {
          that.$message({
            message: "请至少设置两个属性值",
            type: "warning",
          });
          return;
        } else {
          that.valueList.forEach((element) => {
            if (params_value == "") {
              params_value = element.name;
            } else {
              params_value = params_value + "," + element.name;
            }
          });
        }
      }
      edit_param({
        id: that.O_message_copy_two.id,
        category_id: that.category_id,
        name: that.property_name.name,
        unit: that.property_name.unit,
        type: that.property_name.type,
        is_search: that.property_name.is_search,
        is_must: that.property_name.is_must,
        is_open: that.property_name.is_open,
        value: params_value,
        mark: that.property_name.mark,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.property_name_add_group = false;
            that.$message({
              message: "编辑成功",
              type: "success",
            });
            that.get_attributes_list(that.row_po);
          } else {
            that.property_name_add_group = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.property_name_add_group = false;
          console.log(error);
        });
    },

    //属性组添加
    group_add() {
      let that = this;
      if (that.group_form.name == "") {
        that.$message({
          message: "请输入属性组名称",
          type: "warning",
        });
        return;
      }
      add_param_group({
        category_id: that.category_id,
        name: that.group_form.name,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.attribute_add_group = false;
            that.$message({
              message: "添加成功",
              type: "success",
            });
            that.get_attributes_list(that.row_po);
          } else {
            that.attribute_add_group = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.attribute_add_group = false;
          console.log(error);
        });
    },

    //属性组编辑
    group_save() {
      let that = this;
      if (that.group_form.name == "") {
        that.$message({
          message: "请输入属性组名称",
          type: "warning",
        });
        return;
      }
      edit_param_group({
        group_id: that.O_message_copy.group_id,
        name: that.group_form.name,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.attribute_add_group = false;
            that.$message({
              message: "编辑成功",
              type: "success",
            });
            that.get_attributes_list(that.row_po);
          } else {
            that.attribute_add_group = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.attribute_add_group = false;
          console.log(error);
        });
    },

    //销售属性设置
    sales_settings(index, row) {
      console.log(row);
      let that = this;
      that.sales_row = row;
      that.sales_value_del_index = "";
      that.sale_h = row.cat_name;
      that.sales_value_del_index = "";
      that.get_sales_attributes(that.sales_row);
      that.dialogSaleVisible = true;
    },

    //获取销售属性列表
    get_sales_attributes(row) {
      let that = this;
      that.salesAttributesList = [];
      console.log(row);
      sale_tpl({
        cate_id: row.cat_id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            if (res_s.data.err_msg.flist.length != 0) {
              res_s.data.err_msg.flist.forEach((element) => {
                that.salesAttributesList.push({
                  pid: element.pid,
                  type: element.type,
                  name: element.name,
                  store_id: element.store_id,
                  is_public: element.is_public,
                  category_id: element.category_id,
                  value: element.value,
                  is_edit: false,
                });
              });
            }
            if (res_s.data.err_msg.list.length != 0) {
              res_s.data.err_msg.list.forEach((item) => {
                that.salesAttributesList.push({
                  pid: item.pid,
                  type: item.type,
                  name: item.name,
                  store_id: item.store_id,
                  is_public: item.is_public,
                  category_id: item.category_id,
                  value: item.value,
                  is_edit: true,
                });
              });
            }
            console.log(that.salesAttributesList);
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //获取销售属性-属性值列表
    get_sales_attributes_value() {},

    //新增销售属性
    add_sale_attribute() {
      let that = this;
      that.inner_title = "新增销售属性";
      that.form_sale.name = "";
      this.form_sale.is_public = "2"
      that.salesAttributesValueList = [];
      that.sales_add_ifShow = true;
      that.sale_innerVisible = true;
    },

    //编辑销售属性
    sale_compile(index, row) {
      console.log(row);
      let that = this;
      that.row = row;
      that.sales_value_del_index = "";
      that.inner_title = "编辑销售属性";
      that.form_sale.name = row.name;
      that.form_sale.is_public = row.is_public;
      that.salesAttributesValueList = [];
      row.value.forEach((item_f) => {
        that.salesAttributesValueList.push({
          name: item_f.value,
          vid: item_f.vid,
          pid: item_f.pid,
        });
      });
      console.log(that.salesAttributesValueList);
      that.sales_add_ifShow = false;
      that.sale_innerVisible = true;
    },

    //添加销售属性
    sales_add() {
      let that = this;
      if (that.form_sale.name == "") {
        that.$message({
          message: "请输入属性名称",
          type: "warning",
        });
        return;
      }
      if (that.salesAttributesValueList.length == 0) {
        that.$message({
          message: "请添加至少一项属性值",
          type: "warning",
        });
        return;
      }
      let result = [];
      that.salesAttributesValueList.forEach((ele) => {
        let arr = [];
        if (ele.vid) {
          arr.push(ele.vid);
        } else {
          arr.push("");
        }
        arr.push(ele.name);
        result.push(arr);
      });
      add_sale({
        name: that.form_sale.name,
        result: JSON.stringify(result),
        is_public:this.form_sale.is_public,
        cate_id: that.sales_row.cat_id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.get_sales_attributes(that.sales_row);
            that.sale_innerVisible = false;
            that.$message({
              message: "添加成功",
              type: "success",
            });
          } else {
            that.sale_innerVisible = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.sale_innerVisible = false;
          console.log(error);
        });
    },

    //编辑销售属性
    sales_save() {
      let that = this;
      if (that.form_sale.name == "") {
        that.$message({
          message: "请输入属性名称",
          type: "warning",
        });
        return;
      }
      if (that.salesAttributesValueList.length == 0) {
        that.$message({
          message: "请添加至少一项属性值",
          type: "warning",
        });
        return;
      }
      let result = [];
      that.salesAttributesValueList.forEach((ele) => {
        let arr = [];
        if (ele.vid) {
          arr.push(ele.vid);
        } else {
          arr.push("");
        }
        arr.push(ele.name);
        result.push(arr);
      });
      save_tpl({
        name: that.form_sale.name,
        result: JSON.stringify(result),
        is_public:this.form_sale.is_public,
        del_id: that.sales_value_del_index,
        pid: that.row.pid,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.get_sales_attributes(that.sales_row);
            that.sale_innerVisible = false;
            that.$message({
              message: "编辑成功",
              type: "success",
            });
          } else {
            that.sale_innerVisible = false;
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.sale_innerVisible = false;
          console.log(error);
        });
    },

    //删除销售属性
    sales_del(index, row) {
      
      let that = this;
      this.$confirm(
        "此操作将删除" + row.cat_name + "销售属性, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          licence_del({
            pid: row.pid,
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "删除成功",
                  type: "success",
                });
                that.get_sales_attributes(that.sales_row);
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    //删除属性组
    group_delete(index,row) {
      console.log(row)
      let that = this;
      this.$confirm(
        "此操作将删除" + row.name + "属性名, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          del_param({
            param_id: row.id,
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: "删除成功",
                  type: "success",
                });
                that.get_group_list();
              } else {
                that.$message({
                  showClose: true,
                  message: res_s.data.err_msg,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    
    
    //添加销售属性值
    add_attributes() {
      this.form_sale.attributes = "";
      this.form_sale.attributesImg = "";
      this.form_sale.attributes_addShow = true;
      this.form_sale.is_public = "2"
    },

    //销售属性值  删除
    sales_value_del(index, row) {
      console.log(row);
      if (this.sales_value_del_index == "") {
        this.sales_value_del_index = row.vid;
      } else {
        this.sales_value_del_index = this.sales_value_del_index + "," + row.vid;
      }
      console.log(this.sales_value_del_index);
      this.salesAttributesValueList.splice(index, 1);
    },

    //添加 -属性值
    attributes_add() {
      let that = this;
      if (that.form_sale.attributes == "") {
        that.$message({
          message: "请输入属性值",
          type: "warning",
        });
        return;
      }
      that.salesAttributesValueList.push({
        name: that.form_sale.attributes,
      });
      that.form_sale.attributes_addShow = false;
    },

    //清空-属性值(添加)
    attributes_del() {
      this.form_sale.attributes = "";
      this.form_sale.attributesImg = "";
      this.form_sale.attributes_addShow = false;
    },

    //上传图片
    img_upload: function (item) {
      console.log(item);
      let that = this;
      if (this.other_img_upload_err == false) {
        let fd = new FormData();
        fd.append("file", item.file);
        console.log(fd.get("file"));
        upload_img(fd)
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.form_sale.attributesImg = res.data.err_msg.url;
            } else {
              that.$message({
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
    img_beforeUpload(file) {
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

    //获取表格上传图片下标
    get_img_index(index, row) {
      this.imgIndex = index;
    },

    //上传图片-表格
    img_upload_table: function (item) {
      console.log(item);
      let that = this;
      if (this.img_upload_err == false) {
        let fd = new FormData();
        fd.append("file", item.file);
        console.log(fd.get("file"));
        upload_img(fd)
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.salesAttributesValueList[that.imgIndex].image =
                res.data.err_msg.url;
            } else {
              that.$message({
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

    //上传图片之前-表格
    img_beforeUpload_table(file) {
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
        this.img_upload_err = true;
      } else if (file.size / 1024 / 1024 > 200) {
        this.$message.error("图片大小不能超过 200MB!");
        this.img_upload_err = true;
      }
    },

    //编辑
    compile(index, row) {
      console.log(row);
      let that = this;
      that.title = "编辑分类";
      that.dialogFormVisible = true;
      that.form.ifAdd = false;
      if (parseInt(row.cat_fid) == 0) {
        that.form.parentClass = "无";
        that.form.cate_name = row.cat_name;
      } else {
        let result = row.cat_name.split(">>");
        that.form.parentClass = result[0];
        if (result.length == 3) {
          that.form.parentClass = result[0] + ">>" + result[1];
        }
        that.form.cate_name = result[result.length - 1];
      }
      that.form.sort = row.cat_sort;
      that.form.cat_pic = row.cat_pic;
      console.log(that.form);
      that.O_message = row;
    },

    //搜索
    pick_seach() {
      let that = this;
      if (that.goods_one_classification_value == "") {
        that.$message({
          message: "请选择商品一级分类",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      goods_cate({
        page: 1,
        cat_id: that.goods_one_classification_value,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false;
            let copyArray = [];
            res.data.err_msg.list.forEach((element) => {
              copyArray.push({
                cat_fid: element.cat_fid, //上一级分类id
                cat_id: element.cat_id, //分类id
                cat_name: element.cat_name,
                cat_path: element.cat_path, //包含的全部分类
                cat_sort: element.cat_sort, //排序
                cat_status: element.cat_status, //状态 0禁用 1启用
                attribute_num: element.attribute_num,
                cat_pic: element.cat_pic,

                group_num: element.group_num,
              });
              if (element.child) {
                element.child.forEach((element_first) => {
                  copyArray.push({
                    cat_fid: element_first.cat_fid, //上一级分类id
                    cat_id: element_first.cat_id, //分类id
                    cat_name: element.cat_name + ">>" + element_first.cat_name,
                    cat_path: element_first.cat_path, //包含的全部分类
                    cat_sort: element_first.cat_sort, //排序
                    cat_status: element_first.cat_status, //状态 0禁用 1启用
                    attribute_num: element_first.attribute_num,
                    cat_pic: element_first.cat_pic,

                    group_num: element_first.group_num,
                  });
                  if (element_first.child) {
                    element_first.child.forEach((element_second) => {
                      copyArray.push({
                        cat_fid: element_second.cat_fid, //上一级分类id
                        cat_id: element_second.cat_id, //分类id
                        cat_name:
                          element.cat_name +
                          ">>" +
                          element_first.cat_name +
                          ">>" +
                          element_second.cat_name,
                        cat_path: element_second.cat_path, //包含的全部分类
                        cat_sort: element_second.cat_sort, //排序
                        cat_status: element_second.cat_status, //状态 0禁用 1启用
                        attribute_num: element_second.attribute_num,
                        cat_pic: element_second.cat_pic,

                        group_num: element_second.group_num,
                      });
                    });
                  }
                });
              }
            });
            console.log(copyArray);
            that.classificationList = copyArray;
            that.queryInfo.page = parseInt(res.data.err_msg.page);
            that.queryInfo.total = parseInt(res.data.err_msg.total_number);
          } else {
            that.loading = false;
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          that.loading = false;
          console.log(error);
        });
    },

    //商品三级分类选择
    pick_cate_change(value) {
      this.classification_value = value;
      console.log(this.classification_value);
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-table td,
.el-table th.is-leaf {
  border-top: 1px solid #717b90;
  border-bottom: 0;
}

/deep/ .el-table__body {
  border-bottom: 1px solid #ebeef5;
}

/deep/ .el-date-editor {
  margin-right: 20px;
}

.seach {
  display: flex;
  /deep/ .el-input {
    width: 200px;
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
      overflow-y: auto; /*溢出隐藏*/
      // text-overflow: ellipsis; /*以省略号...显示*/
      // white-space: nowrap;  /*强制不换行*/
    }
  }
}

.saleDialog {
  /deep/ .el-dialog {
    width: 900px !important;
    /deep/ .el-input {
      overflow-y: auto; /*溢出隐藏*/
      // text-overflow: ellipsis; /*以省略号...显示*/
      // white-space: nowrap;  /*强制不换行*/
    }
  }
  /deep/ .el-dialog__body {
    height: 300px;
    max-height: 400px;
    overflow-y: auto;
  }
}

.sale_inner {
  /deep/ .el-dialog {
    width: 800px !important;
    /deep/ .el-input {
      overflow-y: auto; /*溢出隐藏*/
      // text-overflow: ellipsis; /*以省略号...显示*/
      // white-space: nowrap;  /*强制不换行*/
    }
  }
  /deep/ .el-dialog__body {
    height: 400px;
    overflow-y: auto;
  }
}

.attributesDialog {
  /deep/ .el-dialog {
    width: 1420px !important;
    /deep/ .el-input {
      overflow-y: auto; /*溢出隐藏*/
      // text-overflow: ellipsis; /*以省略号...显示*/
      // white-space: nowrap;  /*强制不换行*/
    }
  }
  /deep/ .el-dialog__body {
    height: 600px;
    overflow-y: auto;
  }
}

.group_inner {
  /deep/ .el-dialog {
    width: 500px !important;
    /deep/ .el-input {
      overflow-y: auto; /*溢出隐藏*/
      // text-overflow: ellipsis; /*以省略号...显示*/
      // white-space: nowrap;  /*强制不换行*/
    }
  }
  /deep/ .el-dialog__body {
    height: 100px;
    overflow-y: auto;
  }
}

.add_inner {
  /deep/ .el-dialog {
    width: 700px !important;
    /deep/ .el-input {
      overflow-y: auto; /*溢出隐藏*/
      // text-overflow: ellipsis; /*以省略号...显示*/
      // white-space: nowrap;  /*强制不换行*/
    }
  }
  /deep/ .el-dialog__body {
    height: 400px;
    overflow-y: auto;
  }
}

.seach_copy {
  padding-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  /deep/ .el-input {
    width: 200px;
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
.wo{
  top: 14px;
  left: -12px;
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
/deep/ .el-dialog {
  box-shadow: 0 0px 0px #ccc;
  -webkit-box-shadow: 0 0px 0px #ccc;
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
.group_inner2{
  .group_inner{
    height: 600px;
  }
  .el-dialog{
    width: 800px!important;
  }
}
</style>