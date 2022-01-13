<template>
  <div class="page">
      <div v-show="listType == 1">
          <div class="seach">
            <div class="seach_copy">
                <div class="seach_select"></div>
                <div class="button_type">
                <el-button type="primary" @click="pick_add">增加</el-button>
                <el-button type="primary" @click="pick_delete" v-show="multipleSelection.length > 0">删除</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
                    >刷新</el-button
                >
                </div>
            </div>
            </div>
            <!-- 列表开始 -->
            <el-row :gutter="20" class="goodsindex-list">
            <el-col :span="24">
                <el-table
                v-loading="loading"
                :data="extendList"
                border
                
                :height="height"
                style="width: 100%"
                
                @selection-change="handleSelectionChange"
                >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column label="序号" type="index" width="100">
                </el-table-column>
                <el-table-column label="分类ID" prop="id" width="100">
                </el-table-column>
                <el-table-column prop="name" label="分类名称"></el-table-column>
                <!-- <el-table-column label="营销类型">
                    <template slot-scope="scope">
                    <div v-if="scope.row.market_type == 0">普通</div>
                    <div v-else-if="scope.row.market_type == 1">秒杀</div>
                    <div v-else-if="scope.row.market_type == 2">直播</div>
                    <div v-else-if="scope.row.market_type == 3">团购</div>
                    <div v-else-if="scope.row.market_type == 4">内部链接跳转</div>
                    <div v-else-if="scope.row.market_type == 5">外部链接跳转</div>
                    <div v-else-if="scope.row.market_type == 6">猜你喜欢</div>
                    <div v-else-if="scope.row.market_type == 7">热销爆款</div>
                    <div v-else-if="scope.row.market_type == 8">特价</div>
                    <div v-else-if="scope.row.market_type == 9">悦淘</div>
                    <div v-else-if="scope.row.market_type == 10">共富</div>
                    <div v-else>未知</div>
                    </template>
                </el-table-column> -->
                <el-table-column
                    prop="type_name"
                    label="分类标签名称"
                ></el-table-column>
                <el-table-column label="排序" width="120">
                  <template slot-scope="scope">
                    <el-input
                    v-model="scope.row.sort"
                    @blur="likai1(scope.row)"
                    placeholder="请输入序号"
                    ></el-input>                  
                  </template>
                </el-table-column>
                 <el-table-column label="状态" width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">
                      启用
                    </span>
                    <span v-else-if="scope.row.status == 2">
                      禁用
                    </span>
                    <!-- color: #ee8f29 -->
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="400">
                    <template slot-scope="scope">
                      <el-button size="mini" v-show="scope.row.status == 1" type="danger" @click="jinyong(scope.row,'1')"
                        >禁用</el-button
                      >
                      <el-button size="mini" v-show="scope.row.status == 2" type="primary" @click="jinyong(scope.row,'2')"
                        >启用</el-button
                      >
                    <!-- <el-button
                            size="mini"
                            type="primary"
                            @click="enable(scope.$index, scope.row)"
                            v-show="scope.row.is_open == 2"
                            >启用</el-button
                        > -->
                        <el-button
                            size="mini"
                            type="danger"
                            @click="deletes(scope.row)"
                            v-show="scope.row.status == 2"
                            >删除</el-button
                        >
                    <el-button size="mini" v-show="scope.row.market_type != 1 && scope.row.market_type != 8" type="success" @click="see(scope.row)"
                        >商品列表</el-button
                    >
                    <el-button size="mini" v-show="scope.row.market_type == 1" type="success" @click="toM(scope.row)"
                        >设置</el-button
                    >
                    <el-button size="mini" v-show="scope.row.market_type == 8" type="success" @click="toT(scope.row)"
                        >设置</el-button
                    >
                    <el-button size="mini" type="warning" @click="modify(scope.row)"
                        >修改</el-button
                    >
                    <el-button size="mini" v-show="scope.row.market_type == 9 && scope.row.is_sign == 1" type="primary" @click="biaoshi(scope.row,'1')"
                        >已标识</el-button
                    >
                    <el-button size="mini" v-show="scope.row.market_type == 9 && scope.row.is_sign == 2" type="info" @click="biaoshi(scope.row,'2')"
                        >未标识</el-button
                    >
                    
                    </template>
                </el-table-column>
                </el-table>
            </el-col>
            </el-row>
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
            <!-- 修改,删除弹窗 -->
            <el-dialog :visible.sync="opening_change_ifShow" :title="type == 1?'增加营销分类':'修改营销分类'" class="teshu">
                <!-- <h2 style="margin-top:0;" v-if="type == 1">增加营销分类</h2>
                <h2 style="margin-top:0;" v-else-if="type == 2">修改营销分类</h2> -->
                <el-form :model="form">
                  <!-- <div style="position:relative"> -->
                  <el-form-item
                    label="活动名"
                    :label-width="formLabelWidth"
                  >
                  <div class="wo"></div>
                    <el-input
                      v-model="form.live_id"
                      placeholder="请输入营销活动名"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="类型"
                    :label-width="formLabelWidth"
                  >
                    <div class="wo"></div>
                    <el-select
                      v-if="type == 1"
                      v-model="form.level"
                      class="el-inpu"
                      placeholder="请选择营销类型"
                      >
                        <el-option
                            v-for="item in levelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-select
                      v-else-if="type == 2"
                      v-model="form.level"
                      class="el-inpu"
                      disabled
                      placeholder="请选择营销类型"
                      >
                        <el-option
                            v-for="item in levelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                  </el-form-item>
                  
                  <el-form-item label="图标" :label-width="formLabelWidth">
                    <el-upload
                      class="upload-demo"
                      action=""
                      :http-request="img_upload1"
                      :before-upload="img_beforeUpload1"
                      :show-file-list="false"
                      list-type="picture"
                      style="margin-bottom: 20px"
                    >
                      <el-button size="small" type="primary">上传营销图标</el-button>
                    </el-upload>
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="form.img_url"
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
                </el-form>
                <div>
                </div>
                <div slot="footer" class="dialog-footer">
                <el-button @click="opening_change_ifShow = false">取 消</el-button>
                <div v-if="type == 1" style="display:inline-block">
                    <el-button type="primary" @click="submit_saveChanges_level"
                    >增加</el-button
                    >
                </div>
                
                <div v-else-if="type == 2" style="display:inline-block">
                    <el-button type="primary" @click="submit_saveChanges_level"
                    >修改</el-button
                    >
                </div>
                
            </div>
            </el-dialog>
            
      </div>
      <div v-show="listType == 2">
            <!-- <div class="seach">
                <div class="seach_copy">
                    <div class="seach_select"></div>
                    <div class="button_type">
                    
                    <el-button type="primary" icon="el-icon-back" @click="listType = 1"
                        >返回</el-button
                    >
                    </div>
                </div>
            </div> -->
        <div class="seach">
          
        </div>
        <div class="seach_copy">
          <div class="seach_select">
            <el-input v-model="seach_value" @keyup.enter.native="pick_seach" placeholder="商品ID/商品名称/店铺名称"></el-input>
            <el-input v-model="store_name" @keyup.enter.native="pick_seach" placeholder="请输入运营商名称"></el-input>
            <el-cascader
            placeholder="请选择商品分类"
            style="line-height: 0;"
            v-model="classification_value"
            :options="classification_list"
            :props="{ expandTrigger: 'hover' , checkStrictly: true}"
            @change="pick_cate_change"></el-cascader>
          </div>
          <div class="button_type">
            <el-button type="primary" @click="pick_seach">搜索</el-button>
            <el-button type="primary" icon="el-icon-back" @click="back"
                >返回</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="examine2()"
              >添加商品</el-button
            >
            <el-button type="primary" @click="pick_delete1" v-show="multipleSelection1.length > 0">删除</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="fn2(1)">刷新</el-button>
          </div>
        </div>
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="goodsList"
              border
              :height="height"
              style="width: 100%"
              @selection-change="handleSelectionChange1"
              >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column label="序号" type="index" width="100">
              </el-table-column>
              <el-table-column 
                prop="name" 
                label="商品名称" 
                width="200"
              >
              </el-table-column>
              <el-table-column label="商品图片" width="180">
                <template slot-scope="scope">
                  <el-image
                    :src="scope.row.image"
                    style="width: 80px; height: 80px"
                    :preview-src-list="[scope.row.image]"
                    fit="cover"></el-image>
                </template>
              </el-table-column>
              
              <el-table-column 
                prop="price" 
                label="商品售价" 
              >
              </el-table-column>

              <el-table-column 
                prop="quantity" 
                label="商品库存" 
              >
              </el-table-column>
              <el-table-column 
                prop="store_name" 
                label="店铺名称" 
              >
              </el-table-column>
              <el-table-column 
                prop="fname" 
                label="一级分类名称" 
              >
              </el-table-column>
              <el-table-column 
                prop="cname" 
                label="二级分类名称" 
              >
              </el-table-column>
              <el-table-column 
                prop="tname" 
                label="三级分类名称" 
              >
              </el-table-column>

              <el-table-column label="排序" width="120">
                <template slot-scope="scope">
                  <el-input
                  v-model="scope.row.sort"
                  @blur="likai(scope.row)"
                  placeholder="请输入序号"
                  ></el-input>                  
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                  
                  <el-button
                      size="mini"
                      type="danger"
                      @click="deletes1(scope.row)"
                      >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        

        <!-- 分页 -->
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24" class="goodsindex-page-box">
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="queryInfo1.page"
              :page-sizes="[5, 10, 20, 30, 50]"
              :page-size="queryInfo1.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="queryInfo1.total"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <div v-show="listType == 3">
  <div class="seach"></div>
    <div class="seach_copy">
      <div class="seach_select">
        <el-input
          v-model="seach_value1"
          placeholder="请输入商品名称"
           @keyup.enter.native="pick_seach1"
        ></el-input>
        <el-cascader
          placeholder="请选择商品分类"
          v-model="classification_value1"
          style="line-height: 0;"
          :options="classification_list1"
          :props="{ expandTrigger: 'hover', checkStrictly: true }"
          @change="pick_cate_change1"
        ></el-cascader>
        <el-date-picker
          :clearable="false"
          v-model="time_value"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div class="button_type">
        <el-button type="primary" @click="pick_seach1">搜索</el-button>
        <el-button type="primary" icon="el-icon-back" @click="back1"
          >返回</el-button
        >
        <el-button size="mini" type="primary" @click="examines()"
          >添加商品</el-button
        >
        <el-button type="primary" icon="el-icon-refresh" @click="fn3(1)"
          >刷新</el-button
        >
        <el-button type="primary" @click="edit_ast()">修改限购</el-button>
        <el-button type="primary" @click="edit_time1()">修改特价时间</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="goodsList1"
          border
          :height="height"
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" width="100">
          </el-table-column>
          <el-table-column prop="name" label="商品名称" width="100">
          </el-table-column>

          <el-table-column prop="price" label="商品售价"> </el-table-column>
          <el-table-column prop="special_price" label="特价价格">
          </el-table-column>
          <el-table-column prop="special_inventory" label="特价库存">
          </el-table-column>
          <el-table-column prop="astrict" label="限购数量"> </el-table-column>
          <el-table-column prop="start_time" label="特价开始时间">
          </el-table-column>
          <el-table-column prop="end_time" label="特价结束时间">
          </el-table-column>
          <el-table-column prop="product_id" label="商品id"> </el-table-column>
          <el-table-column prop="time" label="特价时间（分钟）">
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="edit(scope.row)"
                >修改</el-button
              >

              <el-button size="mini" type="danger" @click="deletes2(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      :title="types == 1 ? '添加商品' : '修改商品'"
      :visible.sync="goods_ifShow"
    >
      <div style="float: left">
        <el-button size="mini" type="primary" @click="examine" style="margin-bottom:20px"
          >选择</el-button
        >
        
        <div class="divImg" v-if="goodsInfo.image != ''">
          <el-image :src="goodsInfo.image" style="width: 150px" fit="cover">
          </el-image>
          <i class="el-icon-delete icon" @click="closeIcon"></i>
        </div>
        
      </div>

      <div style="float: left; padding-left: 200px; padding-bottom: 30px">
        <h3 style="margin-top: 0">限购数量</h3>
        <el-input v-model="astrict" type="number" placeholder="请输入限购数量"></el-input>
      </div>
      <h3 class="clearfix" style="clear: both">商品信息设置</h3>
      <div class="tableDiv">
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="skuList"
              border
              style="width: 100%"
            >
              <el-table-column prop="properties" label="商品属性">
              </el-table-column>
              <el-table-column prop="price" label="原价"> </el-table-column>
              <el-table-column label="秒杀价格">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.special_price"
                    type="number"
                    placeholder="请输入价格"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="商品库存">
              </el-table-column>
              <el-table-column label="秒杀库存">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.special_inventory"
                    placeholder="请输入秒杀库存"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="property" label="规格值数组">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <h3>特价时间</h3>
      
      <el-date-picker
        v-model="time_value2"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="goods_ifShow = false">取 消</el-button>
        <div v-if="types == 1" style="display: inline-block">
          <el-button type="primary" @click="submit_saveChanges_level1"
            >增加</el-button
          >
        </div>

        <div v-else-if="types == 2" style="display: inline-block">
          <el-button type="primary" @click="submit_saveChanges_level1"
            >修改</el-button
          >
        </div>
      </div>
    </el-dialog>

    <!-- 添加商品弹窗 -->
    <el-dialog title="添加商品" :visible.sync="goods_examine_change_ifShow">
      <div class="seach"></div>
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="product_name2"
             @keyup.enter.native="pick_seach3"
            placeholder="商品ID/商品名称/店铺名称"
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach3">搜索</el-button>

          <el-button size="mini" type="primary" @click="add_pro2"
            >添加商品</el-button
          >
          
        </div>
      </div>
      <div class="box">
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="newGoodsLion"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange3"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column label="序号" type="index" width="100">
              </el-table-column>
              <el-table-column prop="product_id" label="商品ID"> </el-table-column>
              <el-table-column label="商品分类/运营分类">
                <template slot-scope="scope">
                  <!--  || scope.row.fname == '悦淘专区' -->
                  <div v-if="scope.row.is_colour == 1" style="color:#ee8f29">
                    {{ scope.row.fname }}
                    {{ scope.row.sname ? ">>" + scope.row.sname : "" }}
                    {{ scope.row.tname ? ">>" + scope.row.tname : "" }}
                  </div>
                  <div v-else-if="scope.row.is_colour == 2">
                    {{ scope.row.fname }}
                    {{ scope.row.sname ? ">>" + scope.row.sname : "" }}
                    {{ scope.row.tname ? ">>" + scope.row.tname : "" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="商品名称" width="200">
              </el-table-column>
              <el-table-column label="商品图片" width="180">
                <template slot-scope="scope">
                  <el-image :src="scope.row.image" style="width: 80px; height: 80px"
                    :preview-src-list="[scope.row.image]" fit="cover"></el-image>
                </template>
              </el-table-column>

              <el-table-column prop="price" label="商品售价"> </el-table-column>

              <el-table-column prop="quantity" label="商品库存">
              </el-table-column>
              <el-table-column prop="store_name" label="店铺名称">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <!-- 分页 -->
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24" class="goodsindex-page-box">
          <el-pagination
            @size-change="handleSizeChange3"
            @current-change="handleCurrentChange3"
            :current-page="queryInfo4.page"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="queryInfo4.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryInfo4.total"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
    <div class="block">
      <el-dialog title="修改限购数量" :visible.sync="set_astrict_ifShow">
        <el-input v-model="astrict1" style="width:300px"  type="number" placeholder="请输入限购数量"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="set_astrict_ifShow = false">取 消</el-button>
          <el-button type="primary" @click="edit_astrict">修改</el-button>
        </div>
      </el-dialog>
    </div>
    

    <el-dialog title="修改特价时间" :visible.sync="set_time_ifShow">
      <el-date-picker
        v-model="time_value1"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button @click="set_time_ifShow = false">取 消</el-button>
        <el-button type="primary" @click="edit_time">修改</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-row :gutter="20" class="goodsindex-list">
      <el-col :span="24" class="goodsindex-page-box">
        <el-pagination
          @size-change="handleSizeChange4"
          @current-change="handleCurrentChange4"
          :current-page="queryInfo3.page"
          :page-sizes="[5, 10, 20, 30, 50]"
          :page-size="queryInfo3.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryInfo3.total"
        >
        </el-pagination>
      </el-col>
    </el-row>
      </div>
    <!-- 添加商品弹窗 -->
        <el-dialog title="添加商品" :visible.sync="goods_examine_change_ifShow">
          <div class="seach">
          
          </div>
          <div class="seach_copy">
            <div class="seach_select">
              <el-input v-model="product_name" @keyup.enter.native="pick_seach2" placeholder="商品ID/商品名称/店铺名称"></el-input>
              <el-cascader
                placeholder="请选择商品分类"
                style="line-height:0;"
                v-model="classification_value2"
                :options="classification_list"
                :props="{ expandTrigger: 'hover', checkStrictly: true }"
                @change="pick_cate_change2"
              ></el-cascader>
            </div>
            <div class="button_type">
              <el-button type="primary" @click="pick_seach2">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="fn4(1)">刷新</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="add_pro()"
                >添加商品</el-button
              >
            </div>
          </div>
          <div class="box">
            <el-row :gutter="20" class="goodsindex-list" >
              <el-col :span="24">
                <el-table
                  v-loading="loading"
                  :data="newGoodsList"
                  ref="interfaceTable"
                  @row-click="rowClick"
                  border
                  height="500"
                  style="width: 100%"
                  @selection-change="handleSelectionChange2"
                  >
                  <el-table-column type="selection" width="55"> </el-table-column>
                  <el-table-column label="序号" type="index" width="100">
                  </el-table-column>
                  <el-table-column prop="product_id" label="商品ID"> </el-table-column>
                  <el-table-column label="商品分类/运营分类">
                    <template slot-scope="scope">
                      <!--  || scope.row.fname == '悦淘专区' -->
                      <div v-if="scope.row.is_colour == 1" style="color:#ee8f29">
                        {{ scope.row.fname }}
                        {{ scope.row.sname ? ">>" + scope.row.sname : "" }}
                        {{ scope.row.tname ? ">>" + scope.row.tname : "" }}
                      </div>
                      <div v-else-if="scope.row.is_colour == 2">
                        {{ scope.row.fname }}
                        {{ scope.row.sname ? ">>" + scope.row.sname : "" }}
                        {{ scope.row.tname ? ">>" + scope.row.tname : "" }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column 
                    prop="name" 
                    label="商品名称" 
                    width="200"
                  >
                  </el-table-column>
                  <el-table-column label="商品图片" width="180">
                    <template slot-scope="scope">
                      <el-image
                        :src="scope.row.image"
                        style="width: 80px; height: 80px"
                    :preview-src-list="[scope.row.image]"
                        fit="cover"></el-image>
                    </template>
                  </el-table-column>
                  
                  <el-table-column 
                    prop="price" 
                    label="商品售价" 
                  >
                  </el-table-column>

                  <el-table-column 
                    prop="quantity" 
                    label="商品库存" 
                  >
                  </el-table-column>
                  <el-table-column 
                    prop="store_name" 
                    label="店铺名称" 
                  >
                  </el-table-column>
                  
                </el-table>
              </el-col>
            </el-row>
          </div>
            
          <!-- 分页 -->
          <el-row :gutter="20" class="goodsindex-list">
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
import { categroup_list,get_tag_name,add_category,del_category,edit_category,market_product_list,del_product,goods_list,add_market_product,
  product_set_astrict,
  del_product2,
  update_product,
  add_product2,
  product_sort,
  choice_product,
  category_sort,
  goods_info_product,
  product_info1,
  upload_img,
  market_special_product,
  goods_get_cate,
  symbol,
  market_status,
  set_time,  } from "../../utils/axios";
export default {
  data() {
    return {
      product_name:"",
      newGoodsList:[],
      multipleSelection2:"",
      multipleSelection3:"",
      goods_examine_change_ifShow:false,
      classification_list :[], //商品分类列表
      classification_value:[],
      seach_value:"",
      store_name:"",
      opening_change_ifShow: false,
      broadId: "",
      extendList: [], //列表
      goodsList: [], //列表
      fn1: this.commonJs.Debounce(this.get_agent_list),
      fn2: this.commonJs.Debounce(this.get_goods_list),
      fn4: this.commonJs.Debounce(this.goodList),
      queryInfo: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      pageSize:20,
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
      level:"",
      levelList:[
        
      ],
      height:"",
      multipleSelection1:"",
      multipleSelection: [],
      form:{
        live_id:"",
        level:"",
        img_url:"",
      },
      formLabelWidth: "80px",
      //申請人姓名
      live_id: "",
      anchor_id: "",
      keywords: "",
      time_value: "",
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
      listType:1,
      type:1,
      loading: false,
      other_img_upload_err:false,
      seach_value1: "",
      goods_ifShow: false,
      goods_examine_change_ifShow: false,
      fn3: this.commonJs.Debounce(this.get_goods_list1),
      opening_change_ifShow: false,
      multipleSelection2: "",
      goodsList1: [],
      product_name: "",
      product_name2:"",
      newGoodsLion: [],
      queryInfo4: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      queryInfo3: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      set_astrict_ifShow: false,
      astrict: "",
      astrict1:"",
      skuList: [],
      types: 1,
      goodsInfo: {
        image: "",
      },
      commodity: {},
      broad: {
        id: "1",
        market_id: "12",
      },
      fid:"",
      classification_value1: [],
      classification_value2:[],
      classification_list1: [], //商品分类列表
      time_value: "",
      time_value1: "",
      market_id: "",
      set_time_ifShow: false,
      time_value2: "",
      
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
    };
  },
  watch:{
      opening_change_ifShow:{
          handler(newVal){
              console.log(newVal)
              if(!newVal){
                  this.form.live_id = ""
                  this.form.level = ""
                  this.form.img_url = ""
              }
          }
      },
      goods_ifShow:{
        handler(newVal){
          if(!newVal){
            this.goodsInfo = {
              image:""
            }
            this.skuList = []
            this.astrict = ''
            this.time_value2 = ''
          }
        }
      }
      // goodsInfo skuList astrict time_value2
  },
  created() {
    this.get_agent_list();
    this.getname()
    this.get_cate1(); //获取商品三级分类
    this.get_cate() //获取商品三级分类
    this.height = document.body.clientHeight - 250
    console.log(this.height)
  },
  methods: {
    rowClick(row, column, event){
      this.toggleSelection([this.newGoodsList[row.index]])
    },
    likai(row){
      if(row.sort >= 0){
        product_sort({
            id:row.id,
            sort:row.sort
        }).then((res) => {
            if (res.data.err_code == 0) {
              this.$message({
                  message: '排序成功',
                  type: 'success'
              });
              this.get_shop_list_page1(this.queryInfo1.page,this.queryInfo1.pageSize)
            } else {
                this.$message({
                    showClose: true,
                    message: res.data.err_msg,
                    type: "error",
                });
            }
        });
      }
      
    },
    likai1(row){
      category_sort({
        market_id:row.id,
        sort:row.sort
      }).then((res) => {
          if (res.data.err_code == 0) {
            this.$message({
                message: '排序成功',
                type: 'success'
            });
            this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
          } else {
              this.$message({
                  showClose: true,
                  message: res.data.err_msg,
                  type: "error",
              });
          }
      });
    },
    
    // this.$message({
    //     message: '停用成功',
    //     type: 'success'
    // });
    //修改
    modify(item) {
        this.opening_change_ifShow = true
        console.log(item)
        this.type = 2
        this.broadId = item.id
        this.form.live_id = item.name
        this.form.level = item.type_name
        this.form.img_url = item.image_url
    },
    pick_add(index) {
        this.opening_change_ifShow = true
        this.type = 1
    },
    submit_saveChanges_level(){
        if(this.form.live_id == '' || this.form.level == '') {
            this.$message({
                message: '请完整填写选项',
                type: 'warning'
            });
            return
        }
        if(this.type == 1){
            //增加
            add_category({
                name:this.form.live_id,
                market_type:this.form.level,
                image_url:this.form.img_url
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '增加成功',
                        type: 'success'
                    });
                    // this.get_agent_list();
                    this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                    this.opening_change_ifShow = false
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }else{
            //修改
            console.log(this.form)
            edit_category({
                market_id:this.broadId,
                name:this.form.live_id,
                // market_type:this.form.level,
                image_url:this.form.img_url
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    // this.get_agent_list();
                    this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                    this.opening_change_ifShow = false
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }
    },
    //查看
    see(item) {
      console.log(item)
        this.market_id = item.id
        // category_info
        this.listType = 2
        
        this.get_goods_list()
    },
    toT(item){
        //特价页
        this.market_id = item.id
        this.listType = 3
        this.get_goods_list1();
    },
    toM(item){
        //秒杀页
        this.$router.push({ path: "/marketing/spike",query:{id:item.id} });
        console.log(item.id)
    },
    //批量
    pick_delete() {
        this.$confirm('此操作将删除选中的多条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let str = ''
            this.multipleSelection.forEach((element) => {
                if(str == ''){
                    str += element.id
                }else{
                    str += "," + element.id
                }
            })
            console.log(str)
            del_category({
                market_ids:str
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '批量删除成功',
                        type: 'success'
                    });
                    // this.get_agent_list();
                    this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }).catch(() => {
          
        });
    },
    jinyong(row,index){
      console.log(index)
      let tex = ""
      if(index == 1){
        tex="禁用"
      }else if(index == 2){
        tex="启用"
      }
       this.$confirm('此操作将切换成' + tex + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            market_status({
                market_id:row.id
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '成功切换' + tex,
                        type: 'success'
                    });
                    this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }).catch(() => {
                    
        });
    },
    biaoshi(row,index){
      let tex = ""
      if(index == 1){
        tex="未"
      }else if(index == 2){
        tex="已"
      }
       this.$confirm('此操作将切换成' + tex + '标识, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            symbol({
                market_id:row.id
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '成功切换' + tex  ,
                        type: 'success'
                    });
                    this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }).catch(() => {
      
        });
    },
    //单个删
    deletes(row){
        this.$confirm('此操作将删除此条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            console.log(row.id)
            del_category({
                market_ids:row.id
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    // this.get_agent_list();
                    this.get_shop_list_page(this.queryInfo.page,this.queryInfo.pageSize)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }).catch(() => {
                    
        });
    },
    //批量
    pick_delete1() {
        this.$confirm('此操作将删除选中的多条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let str = ''
            this.multipleSelection1.forEach((element) => {
                if(str == ''){
                    str += element.id
                }else{
                    str += "," + element.id
                }
            })
            console.log(str)
            del_product({
                market_product_ids:str
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '批量删除成功',
                        type: 'success'
                    });
                    this.get_shop_list_page1(this.queryInfo1.page,this.queryInfo1.pageSize)
                    // this.get_goods_list()
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }).catch(() => {
                    
        });
    },
    //单个删
    deletes1(row){
        this.$confirm('此操作将删除此条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            console.log(row.id)
            del_product({
                market_product_ids:row.id
            }).then((res) => {
                if (res.data.err_code == 0) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.get_shop_list_page1(this.queryInfo1.page,this.queryInfo1.pageSize)
                    // this.get_goods_list()
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.err_msg,
                        type: "error",
                    });
                }
            });
        }).catch(() => {
                    
        });
    },
    
    getname(){
        
        get_tag_name({
       
        }).then((res) => {
            if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((element,i) => {
                let obj = {
                    value:i,
                    label:element
                }
                this.levelList.push(obj)
            })
            } else {
          
            this.$message({
                showClose: true,
                message: res.data.err_msg,
                type: "error",
            });
            }
        });
    },
    handleSelectionChange(val) {
      console.log("之前")
      console.log(this.multipleSelection)
      console.log("以后")
      console.log(val)
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
      console.log(this.multipleSelection1)
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
      
    },
    
    //每页显示条数改变
    handleSizeChange(val) {
      this.get_shop_list_page(1, val);
    },
    back(){
      this.listType = 1
      this.goodsList = []
    },
    //当前页
    handleCurrentChange(val) {
      this.get_shop_list_page(val, this.pageSize);
    },
    //分页
    
    get_shop_list_page(page, number) {
      let that = this;
      that.loading = true;

      categroup_list({
        page: page,
        page_size: number,
        anchor_id: that.anchor_id,
        live_id: that.live_id,
        keywords: that.keywords,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item,index) => {
              
              item.reward_time = this.commonJs.timestampToTime(
                item.reward_time
              );
              item.add_time = this.commonJs.timestampToTime(item.add_time);
            });
            this.extendList = res.data.err_msg.list;
            
            
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
          } else {
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.interfaceTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.interfaceTable.clearSelection();
      }
    },
    //加载第一页
    get_agent_list(index) {
      this.anchor_id = "";
      this.live_id = "";
      this.keywords = "";
      this.time_value = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      categroup_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item,index) => {
              
              item.reward_time = this.commonJs.timestampToTime(
                item.reward_time
              );
              item.add_time = this.commonJs.timestampToTime(item.add_time);
              if(item.index == 0 || item.index == 1 || item.index == 2){
                this.multipleSelection.push(item)
              }
            });
            
            this.extendList = res.data.err_msg.list;
            this.queryInfo.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo.page = parseInt(res.data.err_msg.page);
            this.queryInfo.total = parseInt(res.data.err_msg.total_number);
            if (index == 1) {
              that.O_message_c = {};
              that.$message({
                message: "刷新成功",
                type: "success",
              });
            }
          } else {
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
              that.form.img_url = res.data.err_msg.url;
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
    //获取营销分类商品列表
    get_goods_list (index) {
      let that = this
      that.classification_value = []
      this.store_name = ""
      that.seach_value = ''
      that.loading = true
      let request_form = {
        page : 1,
        page_size: 20,
        market_id:this.market_id
      }
      
      market_product_list(
        request_form
      )
        .then((res) => {
          if (res.data.err_code == 0) {
            that.loading = false
            if(res.data.err_msg.fid){
              this.fid = res.data.err_msg.fid
            }else{
              this.fid = ""
            }
            console.log("测试")
            console.log(this.classification_value2)
            that.goodsList = res.data.err_msg.list
            that.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo1.page = parseInt(res.data.err_msg.page)
            that.queryInfo1.total = parseInt(res.data.err_msg.total_number)
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
      this.classification_value = value
      console.log(this.classification_value)
    },

    //分页
    
    get_shop_list_page1 (page , number) {
      let that = this
      that.loading = true
      
      market_product_list(
        {
          page : page,
          page_size: number,
          market_id:this.market_id,
          keys : this.seach_value,//名称或id搜索
          store_name : this.store_name,//运营商名称
          category_fid : this.classification_value[0],//一级分类id
          category_id : this.classification_value[1],//二级分类id
          category_tid : this.classification_value[2],//三级分类id
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.goodsList = res.data.err_msg.list
            that.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo1.page = parseInt(res.data.err_msg.page)
            that.queryInfo1.total = parseInt(res.data.err_msg.total_number)
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
    handleSizeChange1(val) {
      console.log(val)
      this.get_shop_list_page1(1,val)
    },
    //当前页
    handleCurrentChange1(val) {
      this.get_shop_list_page1(val,this.pageSize)
    },


    //搜索
    pick_seach () {
      let that = this
      if(that.seach_value == '' && that.store_name == '' && that.classification_value.length == 0) {
        that.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      that.loading = true
      market_product_list(
        {
          page : 1,
          page_size: 20,
          market_id:this.market_id,
          keys : this.seach_value,//名称或id搜索
          store_name : this.store_name,//运营商名称
          category_fid : this.classification_value[0],//一级分类id
          category_id : this.classification_value[1],//二级分类id
          category_tid : this.classification_value[2],//三级分类id
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.loading = false
            that.goodsList = res.data.err_msg.list
            that.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size)
            that.queryInfo1.page = parseInt(res.data.err_msg.page)
            that.queryInfo1.total = parseInt(res.data.err_msg.total_number)
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

     //添加
    examine2 () {
      this.goods_examine_change_ifShow = true
      
      this.goodList()
    },
    goodList(tex){
      console.log(tex)
      console.log("goodList")
      this.product_name = ""
      this.classification_value2 = []
      this.loading = true
      
      let data = {
          page : 1,
          page_size: 20
      }
      
      if(this.fid > 0 && tex != 1){
        this.classification_value2[0] = this.fid+""
        data.fid = this.classification_value2[0]
      }
      console.log(this.fid)
      console.log(this.classification_value2)
      console.log(this.classification_value2[0])
      goods_list(
        data
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false
            // if(tex == "ses"){
            //   this.goodsList = res.data.err_msg.list
            // }else{
              res.data.err_msg.list.forEach((item,index) => {
                item.index = index
              });
              this.newGoodsList = res.data.err_msg.list
            // }
            
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size)
            this.queryInfo2.page = parseInt(res.data.err_msg.page)
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number)
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error);
        });
    },
    //分页
    get_shop_list_page2 (page , number) {
      this.loading = true
      
      goods_list(
        {
          page : page,
          page_size: number,
          keyword : this.product_name,//模糊搜索id或商品名称
          fid : this.classification_value2[0],//一级分类id
          sid : this.classification_value2[1],//二级分类id
          tid : this.classification_value2[2],//三级分类id
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false
            res.data.err_msg.list.forEach((item,index) => {
                item.index = index
              });
            this.newGoodsList = res.data.err_msg.list
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size)
            this.queryInfo2.page = parseInt(res.data.err_msg.page)
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number)
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error);
        });
    },

    //每页显示条数改变
    handleSizeChange2(val) {
      this.get_shop_list_page2(1,val)
    },

    //当前页
    handleCurrentChange2(val) {
      this.get_shop_list_page2(val,this.pageSize)
    },

    //搜索
    pick_seach2 () {
      let that = this
      if(this.product_name == '' && this.classification_value2.length == 0) {
        this.$message({
          message: '请选择任意一种搜索类型',
          type: 'warning'
        });
        return
      }
      this.loading = true
      goods_list(
        {
          page : 1,
          page_size: 20,
          keyword : this.product_name,//模糊搜索id或商品名称
          fid : this.classification_value2[0],//一级分类id
          sid : this.classification_value2[1],//二级分类id
          tid : this.classification_value2[2],//三级分类id
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false
            res.data.err_msg.list.forEach((item,index) => {
              item.index = index
            });
            this.newGoodsList = res.data.err_msg.list
            this.queryInfo2.pageSize = parseInt(res.data.err_msg.page_size)
            this.queryInfo2.page = parseInt(res.data.err_msg.page)
            this.queryInfo2.total = parseInt(res.data.err_msg.total_number)
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error);
        });
    },
    add_pro(){
      if(this.multipleSelection2.length == 0) {
        this.$message({
          message: '请选择一种商品',
          type: 'warning'
        });
        return
      }
      var str = ''
      this.multipleSelection2.forEach((element) => {
          if(str == ''){
              str += element.product_id
          }else{
              str += "," + element.product_id
          }
      })
      add_market_product({
          product_ids:str,
          market_id:this.market_id
      }).then((res) => {
          if (res.data.err_code == 0) {
              this.$message({
                  message: '批量添加成功',
                  type: 'success'
              });
              this.goods_examine_change_ifShow = false
              // this.get_goods_list()
              this.get_shop_list_page1(this.queryInfo1.page,this.queryInfo1.pageSize)
          } else {
              this.$message({
                  showClose: true,
                  message: res.data.err_msg,
                  type: "error",
              });
          }
      });
    },
    // 获取商品三级分类
    get_cate1() {
      let that = this;
      goods_get_cate().then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg.first.length > 0) {
            if (res.data.err_msg.second.length > 0) {
              //存在二级分类

              if (res.data.err_msg.third.length > 0) {
                //存在三级分类

                res.data.err_msg.first.forEach((element_first, first_index) => {
                  that.second_cate = [];
                  that.classification_list1.push({
                    value: element_first.cat_id,
                    label: element_first.cat_name,
                    cat_id: element_first.cat_id,
                  });

                  res.data.err_msg.second.forEach((element_second) => {
                    that.three_cate = [];
                    if (element_first.cat_id == element_second.cat_fid) {
                      //一级分类的ID等于二级分类的父级ID
                      that.second_cate.push({
                        value: element_second.cat_id,
                        label: element_second.cat_name,
                        cat_fid: element_second.cat_fid,
                        cat_id: element_second.cat_id,
                      });
                      that.classification_list1[first_index].children =
                        that.second_cate;

                      res.data.err_msg.third.forEach((element_third) => {
                        if (element_second.cat_id == element_third.cat_fid) {
                          that.three_cate.push({
                            value: element_third.cat_id,
                            label: element_third.cat_name,
                            cat_fid: element_third.cat_fid,
                            cat_id: element_third.cat_id,
                          });
                          let index =
                            that.classification_list1[first_index].children
                              .length - 1;
                          that.classification_list1[first_index].children[
                            index
                          ].children = that.three_cate;
                        }
                      });
                    }
                  });
                });
              } else {
                //不存在三级分类
                res.data.err_msg.first.forEach((element_first, first_index) => {
                  that.second_cate = [];
                  that.classification_list1.push({
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
                      that.classification_list1[first_index].children =
                        that.second_cate;
                    }
                  });
                });
              }
            } else {
              res.data.err_msg.first.forEach((element_first) => {
                that.classification_list1.push({
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
    //商品三级分类选择
    pick_cate_change1(value) {
      this.classification_value1 = value;
      console.log(this.classification_value1);
    },
    //商品三级分类选择
    pick_cate_change2(value) {
      
      this.classification_value2 = value;
    },
    //搜索
    pick_seach1() {
      let that = this;
      if (
        that.seach_value1 == "" &&
        that.time_value.length == 0 &&
        that.classification_value1.length == 0
      ) {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      var time1 = "";
      var time2 = "";
      console.log(this.time_value);
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      market_special_product({
        page: 1,
        page_size: 20,
        category_fid: this.classification_value1[0],
        category_id: this.classification_value1[1],
        category_tid: this.classification_value1[2],
        keys: this.seach_value1,
        start_time: time1,
        end_time: time2,
        market_id: this.market_id,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.activity_start_time = this.commonJs.timestampToTime(
                item.activity_start_time
              );
              item.activity_end_time = this.commonJs.timestampToTime(
                item.activity_end_time
              );
            });
            that.loading = false;
            that.goodsList1 = res.data.err_msg.list;
            that.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            that.queryInfo3.page = parseInt(res.data.err_msg.page);
            that.queryInfo3.total = parseInt(res.data.err_msg.total_number);
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

    //搜索
    pick_seach3() {
      if (this.product_name2 == "") {
        this.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      this.loading = true;
      goods_list({
        page: 1,
        page_size: 20,
        keyword: this.product_name2, //模糊搜索id或商品名称
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            this.newGoodsLion = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
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
    back1() {
      this.listType = 1;
      this.goodsList1 = [];
    },
    //添加秒杀商品
    examines() {
      this.goods_ifShow = true;
      this.types = 1;
    },
    //添加商品
    examine() {
      this.goods_examine_change_ifShow = true;
      this.goodList1();
    },
    get_goods_list1(index) {
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
        market_id: this.market_id,
      };
      market_special_product(request_form)
        .then((res) => {
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.start_time = this.commonJs.timestampToTime(item.start_time);
              item.end_time = this.commonJs.timestampToTime(item.end_time);
            });
            that.loading = false;
            that.goodsList1 = res.data.err_msg.list;
            that.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            that.queryInfo3.page = parseInt(res.data.err_msg.page);
            that.queryInfo3.total = parseInt(res.data.err_msg.total_number);
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

    //每页显示条数改变
    handleSizeChange4(val) {
      this.get_shop_list_page4(1, val);
    },

    //当前页
    handleCurrentChange4(val) {
      this.get_shop_list_page4(val, this.pageSize);
    },
    //分页
    
    get_shop_list_page4(page, number) {
      console.log(page)
      console.log(number)
      let that = this;
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      market_special_product({
        page: page,
        page_size: number,
        category_fid: this.classification_value1[0],
        category_id: this.classification_value1[1],
        category_tid: this.classification_value1[2],
        keys: this.seach_value1,
        start_time: time1,
        end_time: time2,
        market_id: this.market_id,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.activity_start_time = this.commonJs.timestampToTime(
                item.activity_start_time
              );
              item.activity_end_time = this.commonJs.timestampToTime(
                item.activity_end_time
              );
            });
            res.data.err_msg.list.forEach((item) => {
              item.start_time = this.commonJs.timestampToTime(item.start_time);
              item.end_time = this.commonJs.timestampToTime(item.end_time);
            });
            that.loading = false;
            that.goodsList1 = res.data.err_msg.list;
            that.queryInfo3.pageSize = parseInt(res.data.err_msg.page_size);
            that.queryInfo3.page = parseInt(res.data.err_msg.page);
            that.queryInfo3.total = parseInt(res.data.err_msg.total_number);
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
    handleSelectionChange3(val) {
      this.multipleSelection3 = val;
      console.log(val);
    },
    //当前页
    handleCurrentChange3(val) {
      this.get_shop_list_page3(val, this.pageSize);
    },
    //每页显示条数改变
    handleSizeChange3(val) {
      this.get_shop_list_page3(1, val);
    },
    //分页
    get_shop_list_page3(page, number) {
      this.loading = true;
      goods_list({
        page: page,
        page_size: number,
        keyword: this.product_name2, //模糊搜索id或商品名称
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            this.newGoodsLion = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
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
    edit_ast(item) {
      this.set_astrict_ifShow = true;
      // this.astrict = item.astrict
      // this.commodity = item
    },
    edit_time1(item) {
      this.set_time_ifShow = true;
      // this.astrict = item.astrict
    },
    edit_astrict() {
      if (this.astrict1 == "") {
        this.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      this.loading = true;
      product_set_astrict({
        market_id: this.market_id,
        astrict: this.astrict1,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.astrict1 = ''
          this.$message({
            message: "修改限购数量成功",
            type: "success",
          });
          // this.get_goods_list1();
          this.get_shop_list_page4(this.queryInfo3.page,this.queryInfo3.pageSize)
          this.set_astrict_ifShow = false;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    edit_time() {
      if (this.time_value1.length == 0) {
        this.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      var time1 = "";
      var time2 = "";
      if (this.time_value1 != "") {
        time1 = this.commonJs.dataTime(this.time_value1[0]);
        time2 = this.commonJs.dataTime(this.time_value1[1]);
      }
      set_time({
        market_id: this.market_id,
        start_time: time1,
        end_time: time2,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "修改特价时间成功",
            type: "success",
          });
          this.time_value1 = ""
          this.get_shop_list_page4(this.queryInfo3.page,this.queryInfo3.pageSize)
          this.set_time_ifShow = false;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    submit_saveChanges_level1() {
      if (
        this.astrict == "" ||
        this.goodsInfo.image == "" ||
        this.time_value2.length == 0
      ) {
        this.$message({
          message: "请完整填写选项",
          type: "warning",
        });
        return;
      }
      console.log(this.goodsInfo);
      if (this.types == 1) {
        // 增加
        let arr = JSON.stringify(this.skuList);
        var time1 = "";
        var time2 = "";
        if (this.time_value2 != "") {
          time1 = this.commonJs.newDataTime(this.time_value2[0]);
          time2 = this.commonJs.newDataTime(this.time_value2[1]);
        }
        let data = {
          market_id: this.market_id,
          product_id: this.multipleSelection3[0].product_id,
          astrict: this.astrict,
          sku_data: arr,
          start_time: time1,
          end_time: time2,
        };
        add_product2(data).then((res) => {
          if (res.data.err_code == 0) {
            this.$message({
              message: "秒杀商品添加成功",
              type: "success",
            });
            // this.get_goods_list1();
            this.get_shop_list_page4(this.queryInfo3.page,this.queryInfo3.pageSize)

            this.goods_ifShow = false;
          } else {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        });
      } else {
        let arr = JSON.stringify(this.skuList);
        //   that.time_value.length == 0
        var time1 = "";
        var time2 = "";
        if (this.time_value2 != "") {
          time1 = this.commonJs.newDataTime(this.time_value2[0]);
          time2 = this.commonJs.newDataTime(this.time_value2[1]);
        }
        let data = {
          market_id: this.market_id,
          product_id: this.goodsInfo.product_id,
          start_time: time1,
          end_time: time2,
          astrict: this.astrict,
          sku_data: arr,
        };
        // 修改
        update_product(data).then((res) => {
          if (res.data.err_code == 0) {
            this.$message({
              message: "秒杀商品修改成功",
              type: "success",
            });
            // this.get_goods_list1();
            this.get_shop_list_page4(this.queryInfo3.page,this.queryInfo3.pageSize)
            this.goods_ifShow = false;
          } else {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: "error",
            });
          }
        });
      }
    },
    goodList1() {
      this.loading = true;
      goods_list({
        page: 1,
        page_size: 20,
      })
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            this.loading = false;
            this.newGoodsLion = res.data.err_msg.list;
            this.queryInfo4.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo4.page = parseInt(res.data.err_msg.page);
            this.queryInfo4.total = parseInt(res.data.err_msg.total_number);
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
    add_pro2() {
      if (this.multipleSelection3.length == 0) {
        this.$message({
          message: "请选择一种商品",
          type: "warning",
        });
        return;
      }
      if (this.multipleSelection3.length > 1) {
        this.$message({
          message: "一次目前只能选择一种商品",
          type: "warning",
        });
        return;
      }

      choice_product({
        product_id: this.multipleSelection3[0].product_id,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.$message({
            message: "商品选择成功",
            type: "success",
          });
          this.goods_examine_change_ifShow = false;
          this.goodsInfo = res.data.err_msg.info;
          this.skuList = res.data.err_msg.info.sku;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
    closeIcon() {
      this.$confirm("此操作将清空此条商品数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.goodsInfo = {
            image: "",
          };
          this.skuList = [];
        })
        .catch(() => {});
    },
    deletes2(row) {
      console.log(row);
      this.$confirm("此操作将清空此条秒杀商品数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del_product2({
            market_id: this.market_id,
            product_id: row.product_id,
          }).then((res) => {
            if (res.data.err_code == 0) {
              this.$message({
                message: "删除秒杀商品成功",
                type: "success",
              });
              // this.get_goods_list1();
              this.get_shop_list_page4(this.queryInfo3.page,this.queryInfo3.pageSize)
            } else {
              this.$message({
                showClose: true,
                message: res.data.err_msg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {});
    },
    edit(item) {
      goods_info_product({
        product_id: item.product_id,
      }).then((res) => {
        console.log(res);
        if (res.data.err_code == 0) {
          this.goodsInfo = res.data.err_msg.list.product_info;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
      product_info1({
        market_id: this.market_id,
        product_id: item.product_id,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.goods_ifShow = true;
          this.skuList = res.data.err_msg.info.sku;
          let time1 = this.commonJs.timestampToTime(
            parseInt(res.data.err_msg.info.start_time)
          );

          let time2 = this.commonJs.timestampToTime(
            parseInt(res.data.err_msg.info.end_time)
          );
          time1 = time1.split(" ")[0];
          time2 = time2.split(" ")[0];
          //1628493804

          this.time_value2 = [time1, time2];
          //   this.time_value2 = [this.commonJs.newTimestampToTime(res.data.err_msg.info.start_time),this.commonJs.newTimestampToTime(res.data.err_msg.info.end_time)]
          //   console.log(this.time_value2)
          //   this.commonJs.dataTime(this.time_value2[0])
          this.types = 2;
          this.astrict = res.data.err_msg.info.astrict;
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">

.divImg {
  width: 150px;
  position: relative;
  .icon {
    position: absolute;
    top: 0;
    right: -25px;
    z-index: 10;
    color: #bbb;
    font-size: 20px;
    cursor: pointer;
  }
  .icon:hover {
    color: #409eff;
  }
}
.box{
  max-height: 500px;
  overflow-y: auto;
}
.page {
  padding: 15px 15px 0;
}
.seach {
  /deep/ .el-input {
    width: 200px;
    margin: 0 20px 0 10px;
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
/deep/ .teshu .el-dialog{
  width: 30%;
}
</style>
