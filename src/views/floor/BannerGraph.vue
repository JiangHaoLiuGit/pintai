<template>
  <div class="renovation">

    <!-- 导航区 -->
    <div class="renovation_left">
      <el-card class="box-card">
        <div class="text item" @click="pick_target(1)">
          轮播
          <i class="el-icon-position"></i>
        </div>
        <div class="text item" @click="pick_target(2)">
          图文设置
          <i class="el-icon-position"></i>
        </div>
        <div class="text item" @click="pick_target(3)">
          功能区设置
          <i class="el-icon-position"></i>
        </div>
        <div class="text item" @click="pick_target(4)">
          公告设置
          <i class="el-icon-position"></i>
        </div>
        <div class="text item" @click="pick_target(5)">
          商品展示设置
          <i class="el-icon-position"></i>
        </div>
      </el-card>
    </div>

    <div class="renovation_s">
      <!-- 展示区 -->
      <div class="renovation_right">
        <div class="phone_top">
          <img src="../../assets/image/top.png" alt=" " />
        </div>
        <div class="phone_contant">
          <div class="phone_contant_left">
            <img src="../../assets/image/left.png" alt=" " />
          </div>
          <div class="renovation_center">

            <!-- 搜索 轮播模块 -->
            <div class="carouselMap">
              <div class="seach_">
                <img src="../../assets/image/seach.png" alt=" " />
                <el-input v-model="seach_value" placeholder="查找您想要买的商品"></el-input>
                <img src="../../assets/image/ring.png" alt=" " class="img_t" />
              </div>
              <div class="hotSearch">
                热搜 : 
                <span>四川粑粑柑</span>
                <span>花架</span>
                <span>卫衣</span>
                <span>零食</span>
              </div>
              <div class="lunbo" id="lunbo">
                <el-carousel height="140px">
                  <el-carousel-item v-for="(item,index) in img_list" :key="index">
                    <el-image
                      style="width: 350px; height: 140px;padding: 0 12px;"
                      :src="item"
                      fit="cover"></el-image>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>

            <!-- icon展示区 -->
            <div class="banner_view_box" v-loading="icon_loading_drag" id="icon_id">
              <!-- <swiper :options="swiperOption"> -->
                <div class="banner_view" v-for="(page,index) of pages" :key="index"> 
                  <!-- <swiper-slide> -->
                    <h5 style="margin:5px;">第{{index + 1}} 页</h5>
                    <draggable 
                      v-model:personInfo="pages[index]" 
                      group="site" 
                      animation="300" 
                      dragClass="dragClass" 
                      ghostClass="ghostClass" 
                      chosenClass="chosenClass" 
                      @end="drag_end"
                      @add="drag_add"
                    >
                        <transition-group style="display:flex;flex-wrap:wrap;padding-top:20px;">
                            <div v-for="element in page" :key="element.info_id" :style="element.banner_view_item" class="banner_view_item" >
                              <el-image
                                style="width: 50px; height: 45px;display:block;"
                                :src="element.image"
                                fit="cover"></el-image>
                              <span :style="element.font_color" style="display:inline-block;">{{element.text}}</span>
                              <div v-show="element.red_text" class="img_f">
                                <el-image
                                  style="width: 30px; height: 15px;"
                                  :src="element.red_text"
                                  fit="cover"></el-image>
                              </div>
                            </div>
                        </transition-group>
                    </draggable>
                    <div style="border-bottom:2px solid #ccc;" v-show="pages.length > 1"></div>
                </div>
              <!-- </swiper> -->
              <el-row style="text-align:right;">
                <el-button type="primary" icon="el-icon-edit" circle  @click="edit_icon"></el-button>
              </el-row>
              <p style="color:red;text-align:right;">备注 : 图文区、ICON位置可拖动调整</p>
            </div>

            <!-- 公告、活动展示区 -->
            <div class="notice_view_box">
              <draggable v-model="configure_"  chosenClass="chosen" forceFallback="true" group="people" animation="1000" @end="drag_notice_active_end">
                <transition-group>
                  <div v-for="element in configure_" :key="element.id" 
                      style="border:5px dotted #FB613A;margin-bottom:50px;padding :20px;" 
                      >
                      <!-- 活动区 -->
                      <div v-if="element.type == 1" id="active_"  class="active_k">

                        <div v-for="(item,index) in active_list" 
                            :key ='index' class="active_box" 
                            :style="(item.mould_type == '3' && item.category_name != '有品秒杀') ? aaa : '' "
                             >

                          <div v-show="item.category_name == '有品秒杀'" class="seckill">
                            <div class="active_header">
                              <h6>{{item.category_name}}</h6>
                              <span>更多惊喜></span>
                            </div>
                            <ul class="kkk">
                              <li v-for="(ele,ele_index) in item.img" :key="ele_index">
                                <el-image
                                  style="width:70px;height:90px;"
                                  :src="ele.img_url"
                                  fit="cover"></el-image>
                              </li>
                            </ul>
                          </div>

                          <!-- 大图滑动 -->
                          <div v-show="item.mould_type == '1' && item.category_name != '有品秒杀'" class="big_seckill">
                            <div class="active_header">
                              <h6>{{item.category_name}}</h6>
                              <el-image
                                v-show="item.icon_url != ''"
                                style="width:60px;height:15px;"
                                :src="item.icon_url"
                                fit="cover"></el-image>
                              <span>></span>
                            </div>
                            <ul class="kkk">
                              <li v-for="(ele,ele_index) in item.img" :key="ele_index">
                                <el-image
                                  style="width:220px;height:160px;"
                                  :src="ele.img_url"
                                  fit="cover"></el-image>
                              </li>
                            </ul>
                          </div>

                          <!-- 小图滑动 -->
                          <div v-show="item.mould_type == '2' && item.category_name != '有品秒杀'" class="small_seckill">
                            <div class="active_header">
                              <h6>{{item.category_name}}</h6>
                              <el-image
                                v-show="item.icon_url != ''"
                                style="width:60px;height:15px;"
                                :src="item.icon_url"
                                fit="cover"></el-image>
                              <span>></span>
                            </div>
                            <ul class="kkk">
                              <li v-for="(ele,ele_index) in item.img" :key="ele_index">
                                <el-image
                                  style="width:65px;height:90px;"
                                  :src="ele.img_url"
                                  fit="cover"></el-image>
                              </li>
                            </ul>
                          </div>

                          <!-- 双列小图显示 -->
                          <div v-show="item.mould_type == '3' && item.category_name != '有品秒杀'" class="double_s_seckill">
                            <div class="active_header">
                              <h6>{{item.category_name}}</h6>
                              <el-image
                                v-show="item.icon_url != ''"
                                style="width:60px;height:15px;"
                                :src="item.icon_url"
                                fit="cover"></el-image>
                              <span>></span>
                            </div>
                            <ul class="kkk">
                              <li >
                                <el-image
                                  style="width:50px;height:60px;"
                                  :src="item.img[0].img_url"
                                  fit="cover"></el-image>
                              </li>
                              <li >
                                <el-image
                                  style="width:50px;height:60px;"
                                  :src="item.img[1].img_url"
                                  fit="cover"></el-image>
                              </li>
                            </ul>
                          </div>

                          <!-- 四列显示 -->
                          <div v-show="item.mould_type == '4' && item.category_name != '有品秒杀'" class="four_seckill">
                            <div class="active_header">
                              <h6>{{item.category_name}}</h6>
                              <el-image
                                v-show="item.icon_url != ''"
                                style="width:60px;height:15px;"
                                :src="item.icon_url"
                                fit="cover"></el-image>
                              <span>></span>
                            </div>
                            <ul class="kkk">
                              <li v-for="(ele,ele_index) in item.img" :key="ele_index">
                                <el-image
                                  v-show="ele_index < 4"
                                  style="width:65px;height:90px;"
                                  :src="ele.img_url"
                                  fit="cover"></el-image>
                              </li>
                            </ul>
                          </div>

                          <!-- 双列大图显示 -->
                          <div v-show="item.mould_type == '5' && item.category_name != '有品秒杀'" class="double_big_seckill">
                            <div class="active_header">
                              <h6>{{item.category_name}}</h6>
                              <el-image
                                v-show="item.icon_url != ''"
                                style="width:60px;height:15px;"
                                :src="item.icon_url"
                                fit="cover"></el-image>
                              <span>></span>
                            </div>
                            <ul class="kkk">
                              <li v-for="(ele,ele_index) in item.img" :key="ele_index">
                                <el-image
                                  v-show="ele_index < 2"
                                  style="width:140px;height:90px;"
                                  :src="ele.img_url"
                                  fit="cover"></el-image>
                              </li>
                            </ul>
                          </div>

                        </div>
                        
                        <el-row style="text-align:right;">
                          <el-button type="primary" icon="el-icon-edit" circle @click="edit_active_"></el-button>
                        </el-row>
                        <p style="color:red;text-align:right;">备注 : {{element.text}}、活动可拖动换位置</p>
                      </div>
                      <!-- 公告区 -->
                      <div v-if="element.type == 2" id="notice_id">
                        <div>
                          <ul class="notice_play" v-show="can_use" :style="notice_style">
                            <li
                              v-for="(item, index) in notice_list"
                              :key="item.id"
                              :class="!index && notice_play ? 'toUp' : ''"
                            >
                            <el-image
                              style="width:19px;height:16px;vertical-align:middle;padding:6px;"
                              :src="notice_img"
                              fit="cover"></el-image>
                              {{ item.msg }}
                            </li>
                          </ul>
                        </div>
                        <el-row style="text-align:right;">
                          <el-button type="success" icon="el-icon-plus" circle @click="add_notice" v-show="!can_use"></el-button>
                          <el-button type="primary" icon="el-icon-edit" circle  @click="edit_notice" v-show="can_use"></el-button>
                          <el-button type="danger" icon="el-icon-delete" circle @click="delete_notice" v-show="can_use"></el-button>
                        </el-row>
                        <p style="color:red;text-align:right;">备注 : {{element.text}}(活动区和公告区可互换位置)</p>
                      </div>
                  </div>
                </transition-group>
              </draggable> 
            </div>

            <!-- 猜你喜欢列表  商品展示区 -->
            <div class="product_view_box" id="product_id">
              <ul class="product_ul" :style="product_ul">
                <li v-for="(item,index) in product_tag" :key ="index" :style="index > 1 ? product_style : '' " @click="pick_k(item)">
                  {{item.category_name}}
                </li>
              </ul>
              <!-- 大图样式 -->
              <div class="big_style">
                <div class="big_div" v-for="(item,index) in product_list" :key ="index"  v-show="item.mould_type == 1">
                  <img :src="item.img" alt="">
                  <h5 :style="item.name_colour" v-show="item.show_name == 1">{{item.name}}</h5>
                  <div class="big_contant">
                    <span v-show="item.show_purchase == 1">自购省钱</span>
                    <span v-show="item.show_share == 1">分享赚钱</span>
                    <span v-show="item.show_product_price == 1" :style="item.price_colour">￥158</span>
                    <span v-show="item.show_market_price == 1">￥299</span>
                  </div>
                </div>
              </div>

              <!-- 单列样式 -->
              <div class="only_style">
                <div class="only_div" v-for="(item,index) in product_list" :key ="index" v-show="item.mould_type == 2">
                  <img :src="item.img" alt="">
                  <div class="only_box">
                    <h5 :style="item.name_colour" v-show="item.show_name == 1">{{item.name}}</h5>
                    <div class="only_contant">
                      <div>
                        <span v-show="item.show_product_price == 1" :style="item.price_colour">￥158</span>
                        <span style="margin-left : 10px;text-decoration : line-through;" v-show="item.show_market_price == 1">￥299</span>
                      </div>
                      <div style="display:flex;margin-top:10px;">
                        <span class="span_o" v-show="item.show_purchase == 1">自购省钱</span>
                        <span class="span_t" v-show="item.show_share == 1">分享赚钱</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 双列显示 -->
              <div class="double_style">
                <div>
                  <div class="double_div" v-for="(item,index) in product_list" :key ="index" v-show="item.mould_type == 3">
                    <img :src="item.img" alt="">
                    <h5 :style="item.name_colour" v-show="item.show_name == 1">{{item.name}}</h5>
                    <div class="double_contant">
                      <div>
                        <span v-show="item.show_product_price == 1" :style="item.price_colour">￥158</span>
                        <span style="margin-left : 10px;text-decoration : line-through;" v-show="item.show_market_price == 1">￥299</span>
                      </div>
                      <div style="display:flex;margin-top:10px;">
                        <span class="span_o" v-show="item.show_purchase == 1">自购省钱</span>
                        <span class="span_t" v-show="item.show_share == 1">分享赚钱</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                    <div class="double_div" v-for="(item,index) in product_list_copy" :key ="index+9" v-show="item.mould_type == 3">
                    <img :src="item.img" alt="">
                    <h5 :style="item.name_colour" v-show="item.show_name == 1">{{item.name}}</h5>
                    <div class="double_contant">
                      <div>
                        <span v-show="item.show_product_price == 1" :style="item.price_colour">￥158</span>
                        <span style="margin-left : 10px;text-decoration : line-through;" v-show="item.show_market_price == 1">￥299</span>
                      </div>
                      <div style="display:flex;margin-top:10px;">
                        <span class="span_o" v-show="item.show_purchase == 1">自购省钱</span>
                        <span class="span_t" v-show="item.show_share == 1">分享赚钱</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 三列显示 -->
              <div class="three_style">
                <div class="three_div" v-for="(item,index) in product_list" :key ="index" v-show="item.mould_type == 4">
                  <img :src="item.img" alt="">
                  <h5 :style="item.name_colour" v-show="item.show_name == 1">{{item.name}}</h5>
                  <div class="three_contant">
                    <span v-show="item.show_product_price == 1" :style="item.price_colour">￥158</span>
                    <span v-show="item.show_market_price == 1">￥299</span>
                    <span v-show="item.show_purchase == 1">自购省钱</span>
                    <span v-show="item.show_share == 1">分享赚钱</span>
                  </div>
                </div>
              </div>

              <el-row style="text-align:right;">
                <el-button type="primary" icon="el-icon-edit" circle  @click="edit_product"></el-button>
              </el-row>
              <p style="color:red;text-align:right;">备注 : 猜你喜欢等列表  商品展示区</p>
            </div>

          </div>
          <div class="phone_contant_right">
            <img src="../../assets/image/right.png" alt=" " />
          </div>
        </div>
        <div class="phone_bottom">
          <img src="../../assets/image/bottom.png" alt=" " />
        </div>
      </div>

      <!-- 编辑区 -->
      <div class="renovation_edit">

        <!-- icon编辑区 -->
        <div class="icon_edit" v-show="icon_edit_show">
          <h3>图文编辑区</h3>
          <el-form ref="icon_form" :model="icon_form" label-width="120px">
            <el-form-item label="显示方式：">
              <el-radio-group v-model="icon_form.show_method">
                <el-radio label="1">单页显示</el-radio>
                <el-radio label="2">多页滑动显示</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="每行数量：">
              <el-radio-group v-model="icon_form.line_num">
                <el-radio label="4">4个</el-radio>
                <el-radio label="5">5个</el-radio>
                <el-radio label="6">6个</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="操作：">
              <el-button type="primary" @click="add_icon_">添加ICON</el-button>
              <el-button type="primary" @click="edit_icon_sure">保存更改</el-button>
              <el-button type="primary" @click="fn1(1)">刷新</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="20" class="goodsindex-list">
            <el-col :span="24">
              <el-table
                v-loading="icon_loading"
                ref="multipleTable"
                :data="iconList"
                border
                
                style="width: 100%"
              >
                <el-table-column 
                  label="序号"
                  type="index" 
                >
                </el-table-column>
                <el-table-column label="主图" width="150">
                  <template slot-scope="scope">
                    <el-image
                    :src="scope.row.image"
                    fit="cover"></el-image>
                  </template>
                </el-table-column>
                <el-table-column label="副图" width="150">
                  <template slot-scope="scope">
                    <el-image
                    :src="scope.row.red_text"
                    fit="cover"></el-image>
                  </template>
                </el-table-column>
                <el-table-column label="按钮文字">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.text" autocomplete="off"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="按钮文字颜色">
                  <template slot-scope="scope">
                    <el-color-picker 
                      v-model="scope.row.color" 
                      :predefine="predefineColors"
                    >
                    </el-color-picker>
                  </template>
                </el-table-column>
                <el-table-column label="营销分类">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.cate_name" placeholder="请选择营销分类">
                      <el-option
                        v-for="item in market_category_list"
                        :key="item.id"
                        :label="item.name"
                        :disabled="item.disabled"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="关联类型">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.type" placeholder="请选择关联类型">
                      <el-option
                        v-for="item in types_list"
                        :key="item.id"
                        :label="item.value"
                        :disabled="item.disabled"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="链接地址">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.link" autocomplete="off"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-upload
                      class="upload-demo"
                      action=""
                      :http-request="icon_upload_m"
                      :before-upload="icon_beforeUpload_m"
                      :show-file-list = "false"
                      list-type="picture">
                      <el-button size="small" type="primary" @click="upload_m(scope.$index)">上传主图</el-button>
                    </el-upload>
                    <el-upload
                      class="upload-demo"
                      action=""
                      :http-request="icon_upload_f"
                      :before-upload="icon_beforeUpload_f"
                      :show-file-list = "false"
                      style="margin-top:10px"
                      list-type="picture">
                      <el-button size="small" type="primary" @click="upload_f(scope.$index)">上传副图</el-button>
                    </el-upload>
                    <el-button
                      size="mini"
                      type="danger"
                      style="margin-top:10px"
                      @click="delete_icon(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>

        <!-- 公告编辑区 -->
        <div class="notice_edit" v-show="notice_edit_show">
          <h3>公告编辑区</h3>
          <el-form ref="notice_form" :model="notice_form" label-width="120px">
            <el-form-item label="背景颜色：">
              <el-color-picker 
                v-model="notice_form.bgColor" 
                :predefine="predefineColors"
              >
              </el-color-picker>
            </el-form-item>
            <el-form-item label="文字颜色：">
              <el-color-picker 
                v-model="notice_form.textColor" 
                :predefine="predefineColors"
              >
              </el-color-picker>
            </el-form-item>
            <el-form-item label="操作：">
              <el-upload
                class="upload-demo"
                action=""
                :http-request="notice_upload"
                :before-upload="notice_beforeUpload"
                :show-file-list = "false"
                list-type="picture">
                <el-button size="small" type="primary">上传公告图标</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="公告图标：">
              <el-image
                style="width:19px;height:16px;vertical-align:middle;padding:6px;"
                :src="notice_form.img"
                fit="cover"></el-image>
            </el-form-item>
            <el-form-item label="展示时间(单 S)：">
              <el-slider v-model="notice_form.sliding" :max="10" :min="1"></el-slider>
            </el-form-item>
            <el-form-item label="公告内容：">
              <el-radio-group v-model="notice_form.text">
                <el-radio label="1">读取平台公告</el-radio>
                <el-radio label="2">手动输入</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="读取数量：">
              <el-radio-group v-model="notice_form.num">
                <el-radio label="5">5条</el-radio>
                <el-radio label="10">10条</el-radio>
                <el-radio label="20">20条</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="notice_add_sure" v-show="notice_add_show">确 认</el-button>
              <el-button type="primary" @click="notice_save_sure" v-show="!notice_add_show">保 存</el-button>
              <el-button>取 消</el-button>
            </el-form-item>
            
          </el-form>
        </div>

        <!-- 猜你喜欢等列表  商品编辑区 -->
        <div class="product_edit" v-show="product_edit_show">
          <h3>商品展示区</h3>
          <el-form ref="product_form" :model="product_form" label-width="120px">
            <el-form-item label="背景颜色：">
              <el-color-picker 
                v-model="product_form.bg_color" 
                :predefine="predefineColors"
              >
              </el-color-picker>
            </el-form-item>
            <el-form-item label="文字颜色：">
              <el-color-picker 
                v-model="product_form.font_color" 
                :predefine="predefineColors"
              >
              </el-color-picker>
            </el-form-item>
            <el-form-item label="操作：">
              <el-button type="primary" @click="save_product_sure">保存</el-button>
            </el-form-item>
            <div style="border-bottom:2px solid #ccc;margin-bottom :20px;"></div>
          </el-form>
          <el-button type="primary" @click="add_product">添加</el-button>
          <el-row :gutter="20" class="goodsindex-list">
            <el-col :span="24">
              <el-table
                ref="multipleTable"
                :data="product_tag"
                border
                style="width: 100%"
              >
                <el-table-column 
                  label="序号"
                  type="index" 
                  width="80"
                >
                </el-table-column>
                <el-table-column label="营销活动" width="200" prop="category_name">
                </el-table-column>
                <el-table-column label="模板样式" width="200" prop="mould_name">
                </el-table-column>
                <el-table-column label="商品名称" width="200">
                  <template slot-scope="scope">
                    {{scope.row.show_product_name == 1 ? '显示' : '不显示'}}
                  </template>
                </el-table-column>
                <el-table-column label="销售价格" width="200">
                  <template slot-scope="scope">
                    {{scope.row.show_product_price == 1 ? '显示' : '不显示'}}
                  </template>
                </el-table-column>
                <el-table-column label="市场价" width="200">
                  <template slot-scope="scope">
                    {{scope.row.show_market_price == 1 ? '显示' : '不显示'}}
                  </template>
                </el-table-column>
                <el-table-column label="自购省钱" width="200">
                  <template slot-scope="scope">
                    {{scope.row.show_purchase == 1 ? '显示' : '不显示'}}
                  </template>
                </el-table-column>
                <el-table-column label="分享赚钱" width="200">
                  <template slot-scope="scope">
                    {{scope.row.show_share == 1 ? '显示' : '不显示'}}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="400">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-top"
                      v-show ="(scope.$index > 2) && (product_tag.length > 3)"
                      @click="product_up(scope.$index, scope.row)"
                      >上移</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-bottom"
                      v-show ="(scope.$index != product_tag.length-1) && (scope.$index > 1 ) && (product_tag.length > 3 ) "
                      @click="product_down(scope.$index, scope.row)"
                      >下移</el-button
                    >
                    <el-button
                      size="mini"
                      type="primary"
                      @click="edit_product_p(scope.$index, scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      
                      @click="delete_product(scope.$index, scope.row)"
                      >删除</el-button
                    >
                    <!-- v-show="scope.$index > 1" -->
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>

        <!-- 活动编辑区 -->
        <div class="active_edit" v-show="active_edit_show">
          <h3>活动编辑区</h3>
          <el-button type="primary" @click="add_active_">添加活动</el-button>
          <el-row :gutter="20" class="goodsindex-list">
            <el-col :span="24">
              <el-table
                ref="multipleTable"
                :data="active_list"
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
                  label="营销活动"
                  prop="category_name" 
                  width="120"
                >
                </el-table-column>
                <el-table-column 
                  label="活动标题"
                  prop="category_name" 
                  width="120"
                >
                </el-table-column>
                <el-table-column 
                  label="模板样式"
                  prop="mould_name" 
                  width="120"
                >
                </el-table-column>
                <el-table-column label="副图" width="200">
                  <template slot-scope="scope">
                    <el-image
                    style="width:50px;height:50px;"
                    :src="scope.row.icon_url"
                    fit="cover"></el-image>
                  </template>
                </el-table-column>
                <el-table-column 
                  label="链接地址"
                  prop="link_url" 
                  width="300"
                >
                </el-table-column>
                <el-table-column label="操作" width="400">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-top"
                      v-show ="(scope.$index != 0)"
                      @click="product_up_p(scope.$index, scope.row)"
                      >上移</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-bottom"
                      v-show ="(scope.$index != active_list.length-1)"
                      @click="product_down_p(scope.$index, scope.row)"
                      >下移</el-button
                    >
                    <el-button
                      size="mini"
                      type="primary"
                      @click="edit_active_p(scope.$index, scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="delete_active_(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>

      </div>
     </div>

     <!-- 添加/编辑猜你喜欢等列表 -->
     <el-dialog :title="product_title" :visible.sync="dialogFormVisible" class="dialogForm">
      <el-form :model="product_form_p">
        <el-form-item label="营销分类(原)：" :label-width="formLabelWidth" v-show="!product_form_p.ifAdd">
          <el-input v-model="product_form_p.category_name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="营销分类：" :label-width="formLabelWidth" v-show="(product_form_p.category_name!='猜你喜欢') && (product_form_p.category_name!='热销爆款') ">
          <el-select v-model="product_form_p.category_id" placeholder="请选择营销分类">
            <el-option
              v-for="item in market_category_list"
              :key="item.id"
              :label="item.name"
              :disabled="item.disabled"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址：" :label-width="formLabelWidth">
          <el-input v-model="product_form_p.link_url" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="模板样式：" :label-width="formLabelWidth">
          <el-radio v-model="product_form_p.mould_type" label="1">大图样式</el-radio>
          <el-radio v-model="product_form_p.mould_type" label="2">单列样式</el-radio>
          <el-radio v-model="product_form_p.mould_type" label="3">双列显示</el-radio>
          <el-radio v-model="product_form_p.mould_type" label="4">三列显示</el-radio>
        </el-form-item>
        <el-form-item label="商品名称：" :label-width="formLabelWidth">
          <el-radio v-model="product_form_p.show_product_name" label="1">显示</el-radio>
          <el-radio v-model="product_form_p.show_product_name" label="2">不显示</el-radio>
        </el-form-item>
        <el-form-item label="名称颜色：" :label-width="formLabelWidth">
          <el-color-picker 
            v-model="product_form_p.name_colour" 
            :predefine="predefineColors"
          >
          </el-color-picker>
        </el-form-item>
        <el-form-item label="销售价格：" :label-width="formLabelWidth" >
          <el-radio v-model="product_form_p.show_product_price" label="1">显示</el-radio>
          <el-radio v-model="product_form_p.show_product_price" label="2">不显示</el-radio>
        </el-form-item>
         <el-form-item label="价格颜色：" :label-width="formLabelWidth">
          <el-color-picker 
            v-model="product_form_p.price_colour" 
            :predefine="predefineColors"
          >
          </el-color-picker>
        </el-form-item>
        <el-form-item label="市场价：" :label-width="formLabelWidth">
          <el-radio v-model="product_form_p.show_market_price	" label="1">显示</el-radio>
          <el-radio v-model="product_form_p.show_market_price	" label="2">不显示</el-radio>
        </el-form-item>
        <el-form-item label="自购省钱：" :label-width="formLabelWidth">
          <el-radio v-model="product_form_p.show_purchase" label="1">显示</el-radio>
          <el-radio v-model="product_form_p.show_purchase" label="2">不显示</el-radio>
        </el-form-item>
        <el-form-item label="分享赚钱：" :label-width="formLabelWidth">
          <el-radio v-model="product_form_p.show_share" label="1">显示</el-radio>
          <el-radio v-model="product_form_p.show_share" label="2">不显示</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add_" v-show="product_form_p.ifAdd" >添 加</el-button>
        <el-button type="primary" @click="save_" v-show="!product_form_p.ifAdd" >保 存</el-button>
      </div>
    </el-dialog>

    <!-- 添加/编辑活动区 -->
    <el-dialog :title="active_title" :visible.sync="active_dialogFormVisible" class="dialogForm_active">
      <el-form :model="active_from">
        <el-form-item label="营销分类(原)：" :label-width="formLabelWidth" v-show="!active_from.ifAdd">
          <el-input v-model="active_from.category_name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="营销分类：" :label-width="formLabelWidth">
          <el-select v-model="active_from.category_id" placeholder="请选择营销分类" @change="change_active">
            <el-option
              v-for="item in market_category_list"
              :key="item.id"
              :label="item.name"
              :disabled="item.disabled"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动标题(原)：" :label-width="formLabelWidth" v-show="!active_from.ifAdd">
          <el-input v-model="active_from.category_name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="活动标题：" :label-width="formLabelWidth" v-show="active_from.ifAdd">
          <el-input v-model="active_from.title" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="链接地址：" :label-width="formLabelWidth">
          <el-input v-model="active_from.link_url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作：">
          <div style="display:flex;justify-content: space-between;">
            <el-upload
              class="upload-demo"
              action=""
              :http-request="img_upload"
              :before-upload="img_beforeUpload"
              :show-file-list = "false"
              list-type="picture">
              <el-button size="small" type="primary">上传副图</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="模板样式：" :label-width="formLabelWidth">
          <el-radio v-model="active_from.mould_type" label="1">大图滑动</el-radio>
          <el-radio v-model="active_from.mould_type" label="2">小图滑动</el-radio>
          <el-radio v-model="active_from.mould_type" label="3">双列小图显示</el-radio>
          <el-radio v-model="active_from.mould_type" label="4">四列显示</el-radio>
          <el-radio v-model="active_from.mould_type" label="5">双列大图显示</el-radio>
        </el-form-item>
        <el-form-item label="副图：" prop="image">
          <el-image
            style="width:100px;height:100px;"
            :src="active_from.image"
            fit="cover"></el-image>
        </el-form-item>
      </el-form>  
      <el-button size="small" type="primary" @click="add_table_img">添加图片</el-button>
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="active_from.diagram"
            border
            style="width: 100%"
          >
            <el-table-column 
              label="序号"
              type="index" 
              width="80"
            >
            </el-table-column>
            <el-table-column label="类型" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" placeholder="请选择">
                  <el-option
                    v-for="item in type_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
              </el-select>
              </template>
            </el-table-column>
            <el-table-column label="ID" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.id" autocomplete="off"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="图片" width="200">
              <template slot-scope="scope">
                <el-image
                style="width:100px;height:100px;"
                :src="scope.row.image"
                fit="cover"></el-image>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-upload
                  class="upload-demo"
                  action=""
                  :http-request="img_upload_active"
                  :before-upload="img_beforeUpload_active"
                  :show-file-list = "false"
                  list-type="picture">
                  <el-button size="small" type="primary" @click="add_active_img_(scope.$index, scope.row)">上传图片</el-button>
                </el-upload>
                <el-button
                  size="mini"
                  type="danger"
                  @click="delete_table_img_(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="active_dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="active_add_" v-show="active_from.ifAdd" >添 加</el-button>
        <el-button type="primary" @click="active_save_" v-show="!active_from.ifAdd" >保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { banner_list , icon_list , market_category , del_icon , upload_img , save_icon , sort_icon ,
  floor_middle_list , notice_add , notice_save , notice_del , floor_middle_add , floor_middle_save , floor_middle_del , floor_info , floor_sort ,
  guess_color_info , guess_color , guess_list , guess_add , guess_info , guess_save , guess_del , guess_sort 
} from "../../utils/axios";
import draggable from 'vuedraggable'
export default {
  components: {
    draggable,
  },
  data() {
    return {

      icon_edit_show : true,//icon编辑展示与否
      notice_edit_show : false,//公告编辑展示与否
      product_edit_show : false,//商品编辑展示与否
      active_edit_show : false,//活动区编辑展示与否


      // icon区域
      fn1: this.commonJs.Debounce(this.get_icon_list),
      img_list : [],//轮播图
      seach_value : '',
      icon_form : {
        show_method : '',//显示方式(1单页显示 2多页滑动显示)
        line_num : ''//每行显示数量
      },
      show_method_copy : '',
      line_num_copy : '',
      show_method_srue : true,
      myArray:[ //icon展示
      ],
      icon_loading : false,
      iconList : [ //icon列表
      ],
      pages_copy : [],//备份icon列表数据
      if_drag : false ,
      predefineColors: [ //常用颜色组
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        '#FA202C',
        '#eebb46',
        '#FF5C1B',
        '#58B850',
        '#5F84F1',
        '#444',
        '#767676',
        '#888',
        '#c3c3c3',
        '#FFF',
        '#F25C17',
        '#F3693B',
        '#FF855C',
        '#F6B64B',
        '#FA9645',
        '#FC8274',
        '#F23F38',
        '#73C8FE',
        '#54B1FD',
        '#A8ADFD',
        '#6F86F8',
        '#08D4BB',
        '#1AD6BF',
        '#FBE945',
        '#FDC72F',
        '#FBB11B',
        '#f87d54',
        '#f8f8f8'
      ],
      banner_pos_list : [],
      market_category_list : [],//营销分类列表
      icon_m_index : '',//icon主图下标
      icon_f_idnex : '',//icon副图下标
      icon_m_err : false,//校验icon主图
      icon_f_err : false,//校验icon副图
      icon_id : '',//icon记录id
      icon_loading_drag : false,

      // 公告区 - 活动区

      // 公告区
      configure_ : [
        {
          id : 999,
          text : '活动区',
          type : 1
        },
        {
          id : 2,
          text : '公告区',
          type : 2
        }
      ],//公告、活动id
      can_use : false,//公告区是否存在
      notice_list: [
        { msg: '这是第一条信息' },
        { msg: '这是第二条信息' },
        { msg: '这是第三条信息' },
        { msg: '这是第四条信息' },
        { msg: '这是第五条信息' },
        { msg: '这是第六条信息' },
        { msg: '这是第七条信息' },
        { msg: '这是第八条信息' },
        { msg: '这是第九条信息' },
        { msg: '这是第十条信息' }
      ],
      notice_play: false,
      notice_img : '',//公告图片
      notice_form : {
        bgColor : '',
        textColor : '',
        img : '',
        sliding : 1,
        text : '',
        num : ''
      },
      notice_m_err : false,
      notice_add_show : false,//添加icon 或者 编辑icon
      notice_timmer : null,//播放公告
      notice_style : '',//公告样式
      ggID : '',

      // 活动区
      active_list : [],//活动区列表
      active_title : '',
      active_dialogFormVisible : false,
      active_from : {
        ifAdd : false,
        category_name : '',
        category_id : '',
        title : '',
        link_url : '',
        mould_type : '',
        mould_name : '',
        image : '',
        diagram : []
      },
      types_list:[
        {
          id:1,
          value:"内部链接"
        },
        {
          id:"2",
          value:"外部链接"
        },
        {
          id:"3",
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
        },{
          id:7,
          value:"商品id"
        },{
          id:8,
          value:"乡村振兴"
        },{
          id:9,
          value:"悦淘"
        },
      ],
      active_img_err : false,
      active_table_err : false,
      active_table_index : -1,
      type_list : [
        {
          id : 1,
          name : '商品ID'
        },
        {
          id : 2,
          name : '主播ID'
        },
        {
          id : 3,
          name : '商品分类ID'
        },
      ],
      del_table_id : '',
      active_message_o : {},
      aaa  : {
        display : 'inline-block',
        marginLeft : '10px'
      },

      //猜你喜欢等列表  商品展示区
      product_tag : [],//猜你喜欢列表
      product_form : {
        bg_color : '#F2F2F2',
        font_color : '#767676'
      },
      product_style : '',
      product_ul : '',
      dialogFormVisible : false,
      formLabelWidth: '120px',
      product_title : '',
      product_form_p : {
        ifAdd : true,
        category_name : '',
        category_id : '',
        link_url : '',
        mould_type : '',
        show_product_name : '',
        name_colour : '',
        show_product_price : '',
        price_colour : '',
        show_market_price : '',
        show_purchase : '',
        show_share : '',
      },
      message_o : {},
      product_list : [
      //   {
      //     img : require('../../assets/image/1.png'),
      //     name : '测试名称测试名称测试名称测试名称测试名称测试名称测试名称',
      //     name_colour : '',
      //     show_product_price : '',
      //     price_colour : '',
      //     show_market_price : '',
      //     show_purchase : '',
      //     show_share : '',
      //     show_name : '',
      //   },
      //   {
      //     img : require('../../assets/image/2.png'),
      //     name : '测试名称测试名称测试名称测试名称测试名称测试名称测试名称测试名称',
      //     name_colour : '',
      //     show_product_price : '',
      //     price_colour : '',
      //     show_market_price : '',
      //     show_purchase : '',
      //     show_share : '',
      //     show_name : '',
      //   },
      //   {
      //     img : require('../../assets/image/1.png'),
      //     name : '测试名称测试名称测试名称测试名称测试名称测试名称测试名称测试名称',
      //     name_colour : '',
      //     show_product_price : '',
      //     price_colour : '',
      //     show_market_price : '',
      //     show_purchase : '',
      //     show_share : '',
      //     show_name : '',
      //   },
      //   {
      //     img : require('../../assets/image/2.png'),
      //     name : '测试名称测试名称测试名称测试名称',
      //     name_colour : '',
      //     show_product_price : '',
      //     price_colour : '',
      //     show_market_price : '',
      //     show_purchase : '',
      //     show_share : '',
      //     show_name : '',
      //   },
      //   {
      //     img : require('../../assets/image/1.png'),
      //     name : '测试名称',
      //     name_colour : '',
      //     show_product_price : '',
      //     price_colour : '',
      //     show_market_price : '',
      //     show_purchase : '',
      //     show_share : '',
      //     show_name : '',
      //   },
      // ],
      // product_list_copy : [
      //   {
      //     img : require('../../assets/image/2.png'),
      //     name : '测试',
      //     name_colour : '',
      //     show_product_price : '',
      //     price_colour : '',
      //     show_market_price : '',
      //     show_purchase : '',
      //     show_share : '',
      //     show_name : '',
      //   },
      //   {
      //     img : require('../../assets/image/1.png'),
      //     name : '测试名称测试名称',
      //     name_colour : '',
      //     show_product_price : '',
      //     price_colour : '',
      //     show_market_price : '',
      //     show_purchase : '',
      //     show_share : '',
      //     show_name : '',
      //   },
      //   {
      //     img : require('../../assets/image/2.png'),
      //     name : '测试名称测试名称测试名称测试名称测试名称测试名称测试名称测试名称',
      //     name_colour : '',
      //     show_product_price : '',
      //     price_colour : '',
      //     show_market_price : '',
      //     show_purchase : '',
      //     show_share : '',
      //     show_name : '',
      //   },
      //   {
      //     img : require('../../assets/image/1.png'),
      //     name : '测试名称测试名称测试名称测试名称',
      //     name_colour : '',
      //     show_product_price : '',
      //     price_colour : '',
      //     show_market_price : '',
      //     show_purchase : '',
      //     show_share : '',
      //     show_name : '',
      //   },
      //   {
      //     img : require('../../assets/image/2.png'),
      //     name : '测试名称测试名称测试名称测试名称测试名称测试名称测试名称测试名称',
      //     name_colour : '',
      //     show_product_price : '',
      //     price_colour : '',
      //     show_market_price : '',
      //     show_purchase : '',
      //     show_share : '',

      //   },
      ]

    };
  },

  computed:{
    pages () {
      // show_method_srue -- 是否保存了更改 (显示方式)
      // if_drag -- 拖拽完成
      let that = this
      const pages = []
      const pages_copy = []
      let array = []
      let leg = false
      let array_copy = []
      let array_copy_p = []
      if(that.icon_form.show_method == 2 && that.show_method_srue == true && that.if_drag == false ) {//多列显示 更改了或者第一次
        that.show_method_srue = false
        this.myArray.forEach( (item,index) => {
            const page = Math.floor(index / (that.icon_form.line_num * 2))
            if(!pages[page]){
              pages[page] = []
            }
            pages[page].push(item)
        });
        that.pages_copy = pages
        console.log(pages)
        return pages
      } else if (that.icon_form.show_method == 1 && that.show_method_srue == true && that.if_drag == false  ) {//单页显示 更改了或者第一次
        that.show_method_srue = false
        console.log(that.myArray)
        that.myArray.forEach( (item,index) => {
            const page = Math.floor(index / that.myArray.length)
            if(!pages[page]){
              pages[page] = []
            }
            pages[page].push(item)
        });
        that.pages_copy = pages
        console.log(pages)
        return pages
      } else if (that.icon_form.show_method == 1 && that.if_drag == true) {//单页排列  拖拽
        that.if_drag = false
        that.myArray.forEach( (item,index) => {
          const page = Math.floor(index / that.myArray.length)
          if(!pages[page]){
            pages[page] = []
          }
          pages[page].push(item)
        });
        that.pages_copy = pages
        console.log(pages)
        return pages
      } else if (that.show_method_srue == false && that.if_drag == false) { //无更改  无拖拽
        console.log(9999999999999999,that.icon_form)
        console.log(that.pages_copy)
        that.pages_copy.forEach(element_p => { //将保存数据转为一维数组
          element_p.forEach(element_k => {
            array_copy.push(element_k)
          })
        })
        console.log(77777777777,that.myArray)
        if(that.myArray.length != that.pages_copy.length) { //删除icon

          leg = true
        } else {
          that.myArray.forEach((element,index) => { //判断列表数据与保存数据是否一致
            if(element.info_id != '') {
              if(element.info_id != array_copy[index].info_id)  {
                leg = true
              }
            }
          })
        }

        if(leg == true) { //列表数据与保存数据不一致  取列表数据
          console.log(that.myArray,888888888888888)
          array_copy_p = []
          if(that.show_method_copy == 2) {
            that.myArray.forEach( (item,index) => {
                const page = Math.floor(index / (that.line_num_copy * 2))
                if(!array_copy_p[page]){
                  array_copy_p[page] = []
                }
                array_copy_p[page].push(item)
            });
          } else {
            that.myArray.forEach( (item,index) => {
                const page = Math.floor(index / that.myArray.length)
                if(!array_copy_p[page]){
                  array_copy_p[page] = []
                }
                array_copy_p[page].push(item)
            });
          }
        } else {
          array_copy_p = that.pages_copy
        }
        console.log(array_copy_p)

        array_copy_p.forEach(ele_k => { //更新icon布局
          console.log(ele_k)
          ele_k.forEach(ele => {
            ele.font_color = {
              color : ele.color,
              fontSize : '12px'
            }
            if(that.line_num_copy == 4) {
              ele.banner_view_item = {
                width : '25%'
              }
            } else if (that.line_num_copy == 5) {
              ele.banner_view_item = {
                width : '20%'
              }
            } else {
              ele.banner_view_item = {
                width : '16%'
              }
            }
          })
        })
        console.log(array_copy_p)
        array_copy_p.forEach(ele_f => {
          ele_f.forEach((ele_g,ele_gi) => {
            if(ele_g.text == '') {
              ele_f.splice(ele_gi,1)
            }
          })
        })
        array_copy_p.forEach(ele_f => {
          ele_f.forEach((ele_g,ele_gi) => {
            if(ele_g.info_id == '') {
              ele_g.info_id = that.myArray[that.myArray.length-1].info_id
            }
          })
        })

        that.pages_copy = array_copy_p
        console.log(that.pages_copy)
        return array_copy_p
      } else {
        that.if_drag = false
        array = []
        that.pages_copy.forEach(ele => {
          ele.forEach(ele_p => {
            array.push(ele_p)
          })
        })
        array.forEach( (item,index) => {
            const page = Math.floor(index / (that.icon_form.line_num * 2))
            if(!pages[page]){
              pages[page] = []
            }
            pages[page].push(item)
        });
        that.pages_copy = pages
        console.log(pages)
        return pages
      }
    } 

  },

  created() {
    this.get_market_category();//获取营销一级分类列表
    this.get_icon_list();//获取icon列表
    this.get_floor_middle_list();//获取公告和活动区信息
    this.get_guess_list ();//获取猜你喜欢等列表

    // this.get_banner_list(); //获取轮播图
    // this.get_guess_color_info();//获取猜你喜欢等列表 背景色 文字颜色
  },

  methods: {

    //跳转
    pick_target (index) {
      let that = this
      let ele = ''
      if(index == 1) {
        ele = document.getElementById('lunbo')
      } else if (index == 2) {
        ele = document.getElementById('icon_id')
      } else if (index == 3) {
        ele = document.getElementById('active_')
      } else if (index == 4) {
        ele = document.getElementById('notice_id')
      } else {
        ele = document.getElementById('product_id')
      }
      ele.scrollIntoView(true)

    },

    // icon区
    //----------------------------------------------------------

    //获取轮播图
    get_banner_list () {
      let that = this
      banner_list()
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.img_list = []
            res_s.data.err_msg.list.forEach(element => {
              if(element.image != '') {
                if(that.img_list.length < 4) {
                  that.img_list.push(element.image)
                }
              }
            });
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
    },

    //获取icon列表
    get_icon_list (params) {
      let that = this
      that.icon_loading = true
      let leg = false
      icon_list()
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.icon_loading = false
            that.icon_id = res_s.data.err_msg.id
            
            that.icon_form.show_method = res_s.data.err_msg.show_method
            that.icon_form.line_num = res_s.data.err_msg.line_num
            that.show_method_copy = res_s.data.err_msg.show_method
            that.line_num_copy = res_s.data.err_msg.line_num
            res_s.data.err_msg.icon.forEach(ele => {
              ele.font_color = {
                color : ele.color,
                fontSize : '12px'
              }
              if(that.icon_form.line_num == 4) {
                ele.banner_view_item = {
                  width : '25%'
                }
              } else if (that.icon_form.line_num == 5) {
                ele.banner_view_item = {
                  width : '20%'
                }
              } else {
                ele.banner_view_item = {
                  width : '16%'
                }
              }
              leg = false
              that.market_category_list.forEach(element => {
                if(ele.cate_id == element.id) {
                  leg = true
                  ele.cate_name = element.name
                }
              })
              if(leg == false ) {
                ele.cate_name = ''
              }
            })

            that.myArray = res_s.data.err_msg.icon
            res_s.data.err_msg.icon.forEach(item => {
              console.log(item.type)
              console.log(this.types_list)
              // for(let i = 0 ; i < this.types_list.length ; i++){
              //   if(this.types_list[type] == item.type){
              //     item.type =
              //   }
              // }
              this.types_list.forEach(comm => {
                if(item.type == comm.id){
                  item.type = comm.value
                }
              })
            })
            that.iconList = res_s.data.err_msg.icon
            if(params == 1) {
              that.$message({
                message: '刷新成功',
                type: 'success'
              });
            }
          } else {
            that.icon_loading = false
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.icon_loading = false
          console.log(error);
        });
    },

    //获取营销一级分类列表
    get_market_category () {
      let that = this
      market_category()
        .then((res_s) => {
          console.log(res_s.data.err_code);
          // res_s.data.err_msg.list[46] = {
          //   id: "1000",
          //   market_type: "0",
          //   name: "益智玩具",
          //   sort: "1000",
          // }
          if (res_s.data.err_code == 0) {
            res_s.data.err_msg.list.forEach(ele => {
              ele.disabled = false
            })
            that.market_category_list = res_s.data.err_msg.list
            console.log(that.market_category_list)
            that.get_banner_list(); //获取轮播图
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
    },

    //编辑icon区
    edit_icon () {
      this.product_edit_show = false
      this.notice_edit_show = false
      this.active_edit_show = false
      this.icon_edit_show = true
    },

    //添加icon
    add_icon_ () {
      let that = this
      that.iconList.push ({
        info_id : '',
        image : '',
        text : '',
        color : '',
        link : '',
        red_text : '',
        cate_id : '',
        cate_name : '',
        type:''
      })
      that.$message({
        message: '添加成功',
        type: 'success'
      });
    },

    //删除icon
    delete_icon (index , row) {
      let that = this
      if(row.info_id == '') {
        that.iconList.splice(index,1)
      } else {
        that.$confirm('此操作将删除名为' + row.text + '的ICON, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del_icon({
            id: row.info_id,
          })
            .then((res_s) => {
              console.log(res_s);
              if (res_s.data.err_code == 0) {
                that.$message({
                  message: '删除成功',
                  type: 'success'
                });
                that.$forceUpdate()
                that.get_icon_list();
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
      }
    },

    //上传icon主图
    upload_m (index) {
      this.icon_m_index = index
    },

    //上传icon主图
    icon_upload_m: function(item) {
      console.log(item)
      let that = this
      if (this.icon_m_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.iconList[that.icon_m_index].image = res.data.err_msg.url
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

    //上传icon主图之前
    icon_beforeUpload_m (file) {
      console.log(file)
      if(file.type != 'image/jpeg' && file.type != 'image/jpg' && 
          file.type != 'image/png' && file.type != 'image/gif' &&
          file.type != 'image/JPEG' && file.type != 'image/JPG' &&
          file.type != 'image/PNG' && file.type != 'image/GIF'
          ) {
          this.$message.error('请上传图片格式!');
          this.icon_m_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('图片大小不能超过 200MB!');
        this.icon_m_err = true
      }
    },

     //上传icon副图
    upload_f (index) {
      this.icon_f_idnex = index
    },

    //上传icon副图
    icon_upload_f: function(item) {
      console.log(item)
      let that = this
      if (this.icon_f_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.iconList[that.icon_f_idnex].red_text = res.data.err_msg.url
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

    //上传icon副图之前
    icon_beforeUpload_f (file) {
      console.log(file)
      if(file.type != 'image/jpeg' && file.type != 'image/jpg' && 
          file.type != 'image/png' && file.type != 'image/gif' &&
          file.type != 'image/JPEG' && file.type != 'image/JPG' &&
          file.type != 'image/PNG' && file.type != 'image/GIF'
          ) {
          this.$message.error('请上传图片格式!');
          this.icon_f_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('图片大小不能超过 200MB!');
        this.icon_f_err = true
      }
    },

    //更改icon
    edit_icon_sure () {
      let that = this
      let leg = false
      let timer = null
      if(that.icon_form.show_method == '' ) {
        that.$message({
          message: '请选择显示方式',
          type: 'warning'
        });
        return
      }
      if(that.icon_form.line_num == '' ) {
        that.$message({
          message: '请选择每行显示数量',
          type: 'warning'
        });
        return
      }
      console.log(that.iconList)
      that.iconList.forEach(ele => {
        console.log((ele.cate_name == '' && ele.cate_id != '' ) )
        if(ele.image == '' || ele.text == '' || ele.color == ''  || ele.type == '' || (ele.cate_name == undefined && ele.cate_id != '' )  || (ele.cate_name == '' && ele.cate_id == '' ) ) {
          leg = true
          return
        }
      })
      if(leg == true) {
        that.$message({
          message: '请将表格内容里的主图、按钮文字、按钮文字颜色、营销分类内容填写完整',
          type: 'warning'
        });
        return
      }
      let result = []
      that.iconList.forEach(element => {
        console.log(element)
        that.market_category_list.forEach(ele_p => {
          if(element.cate_name == ele_p.name) {
            element.cate_name = ele_p.id
          }
        })
        if(typeof element.type !== 'number'){
          this.types_list.forEach(ele_text => {
            if(ele_text.value == element.type){
              element.type = ele_text.id
            }
          })
        }
        result.push({
          info_id : element.info_id,
          image : element.image,
          text : element.text,
          color : element.color,
          link : element.link,
          red_text : element.red_text,
          cate_id : element.cate_name,
          type:element.type
        })
      })
      save_icon({
        id : that.icon_id,//记录id
        show_method : that.icon_form.show_method,//显示方式(1单页显示 2多页滑动显示)
        line_num : that.icon_form.line_num,//每行显示数量(3个 4个 5个)
        result : JSON.stringify(result)
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.show_method_srue = true
            that.$message({
              message: '编辑成功',
              type: 'success'
            });
            that.get_icon_list();
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

    },

    drag_add (e) {
      console.log(e)
    },

    //icon拖拽完成
    drag_end (e) {
      let that = this
      that.icon_loading_drag = true
      let id = ''
      console.log(that.myArray)
      let arr = that.myArray
      console.log(e)
      let timer = setTimeout(() => {
        that.if_drag = true
        clearTimeout(timer)
        console.log(that.pages_copy)
        if(that.show_method_copy == 1) {
          if(e.oldIndex > e.newIndex){
            arr.splice(e.newIndex,0,arr[e.oldIndex]);
            arr.splice(e.oldIndex+1,1)
          } else {
          //如果当前元素在拖动目标位置的上方(即把该元素向下拖)，
          //同样，给数组newIndex+1的地方新增一个和当前元素值一样的元素，
          //这时，将之前的那个拖动的元素删除掉，索引不变，还是oldIndex
            arr.splice(e.newIndex+1,0,arr[e.oldIndex]);
            arr.splice(e.oldIndex,1)
          }
          arr.forEach((ele_p,index) => {
            if(id == '') {
              id = ele_p.info_id
            } else {
              id = id + ',' + ele_p.info_id
            }
          })
        } else {
          if(that.pages_copy.length == 1) {
            if(e.oldIndex > e.newIndex){
              arr.splice(e.newIndex,0,arr[e.oldIndex]);
              arr.splice(e.oldIndex+1,1)
            } else {
            //如果当前元素在拖动目标位置的上方(即把该元素向下拖)，
            //同样，给数组newIndex+1的地方新增一个和当前元素值一样的元素，
            //这时，将之前的那个拖动的元素删除掉，索引不变，还是oldIndex
              arr.splice(e.newIndex+1,0,arr[e.oldIndex]);
              arr.splice(e.oldIndex,1)
            }
            arr.forEach((ele_p,index) => {
              if(id == '') {
                id = ele_p.info_id
              } else {
                id = id + ',' + ele_p.info_id
              }
            })
          } else {
            that.pages_copy.forEach((ele,index) => {
              ele.forEach(ele_p => {
                console.log(id)
                if(id == '') {
                  id = ele_p.info_id
                } else {
                  id = id + ',' + ele_p.info_id
                }
              })
            })
          }
        }
       
        console.log(id)
        sort_icon({
          id : id
        })
          .then((res_s) => {
            console.log(res_s.data.err_code);
            if (res_s.data.err_code == 0) {
              that.icon_loading_drag = false
              that.get_icon_list()
            } else {
              that.icon_loading_drag = false
              that.$message({
                showClose: true,
                message: res_s.data.err_msg,
                type: 'error'
              });
            }
          })
          .catch((error) => {
            that.icon_loading_drag = false
            console.log(error);
          });
      },500)
    },


    // 活动区和公告区
    //----------------------------------------------------------

    //获取公告和活动区信息
    get_floor_middle_list (params) {
      let that = this
      floor_middle_list()
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.active_list = []
            if(res_s.data.err_msg.list[0].type == 2) {
              that.configure_ = []
              that.configure_ = [
                {
                  id : res_s.data.err_msg.list[0].id,
                  text : '公告区',
                  type : 2
                },
                {
                  id : 999,
                  text : '活动区',
                  type : 1
                }
              ]//公告、活动id
            } else if (res_s.data.err_msg.list[res_s.data.err_msg.list.length -1].type == 2) {
              that.configure_ = []
              that.configure_ = [
                {
                  id : 999,
                  text : '活动区',
                  type : 1
                },
                {
                  id : res_s.data.err_msg.list[res_s.data.err_msg.list.length -1].id,
                  text : '公告区',
                  type : 2
                },
              ]//公告、活动id
            } else {
              that.configure_ = []
              that.configure_ = [
                {
                  id : 999,
                  text : '活动区',
                  type : 1
                },
                {
                  id : 998,
                  text : '公告区',
                  type : 2
                },
              ]//公告、活动id
            }
            console.log(that.configure_)
            res_s.data.err_msg.list.forEach(ele => {
              if(ele.type == 2) {
                that.ggID = ele.id
                that.can_use = true
                that.notice_form.bgColor = ele.background_colour
                that.notice_form.textColor = ele.notice_colour
                that.notice_img = ele.icon_url
                console.log(that.notice_img)
                that.notice_form.img = ele.icon_url
                that.notice_form.sliding = parseInt(ele.sliding)
                that.notice_form.text = ele.notice_type
                that.notice_form.num = ele.number
                that.notice_style = {
                  background : that.notice_form.bgColor,
                  color : that.notice_form.textColor
                  // background : '#F87D54',
                  // color : '#73C8FE'
                }
                if(that.notice_form.sliding == 0) {
                  that.notice_form.sliding = 1
                }
                clearInterval(that.notice_timmer)
                that.notice_timmer = setInterval(that.startPlay,(parseInt(that.notice_form.sliding) * 1000))
              } else {
                ele.category_name = ''
                ele.mould_name = ''
                that.market_category_list.forEach(element => {
                  if(ele.category_fid == element.id) {
                    ele.category_name = element.name
                  }
                })
                if(ele.mould_type == 1) {
                  ele.mould_name = '大图滑动'
                } else if(ele.mould_type == 2) {
                  ele.mould_name = '小图滑动'
                } else if(ele.mould_type == 3) {
                  ele.mould_name = '双列小图显示'
                } else if(ele.mould_type == 4) {
                  ele.mould_name = '四列显示'
                } else if(ele.mould_type == 5) {
                  ele.mould_name = '双列大图显示'
                }
                that.active_list.push(ele)
              }
            })
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
    },

    startPlay() {
      let that = this
      that.notice_play = true //开始播放
      let timer = setTimeout(() => {
        clearTimeout(timer)
        that.notice_list.push(that.notice_list[0]) //将第一条数据塞到最后一个
        that.notice_list.shift() //删除第一条数据
        that.notice_play = false //暂停播放
      }, 500)
    },

    //活动区和公告区拖拽完成
    drag_notice_active_end (e) {
      console.log(e,'公告区活动区拖拽')
      let that = this
      let id = ''
      if(that.configure_[0].id == 999) {
        this.active_list.forEach(ele => {
          if(id == '') {
            id = ele.id
          } else {
            id = id + ',' + ele.id
          }
        })
        id = id + ',' + that.configure_[1].id
      } else {
        this.active_list.forEach(ele => {
          if(id == '') {
            id = that.configure_[0].id + ',' + ele.id
          } else {
            id = id + ',' + ele.id
          }
        })
      }
      floor_sort({
        id: id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.get_floor_middle_list();
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
    },

    //公告区

    //添加公告
    add_notice () {
      let that = this
      that.notice_form.bgColor = ''
      that.notice_form.textColor = ''
      that.notice_form.img = ''
      that.notice_form.text = ''
      that.notice_form.num = '' 
      that.icon_edit_show = false
      that.product_edit_show = false
      that.active_edit_show = false
      that.notice_add_show =  true
      that.notice_edit_show = true
    },

    //上传公告图
    notice_upload: function(item) {
      console.log(item)
      let that = this
      if (this.notice_m_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.notice_form.img = res.data.err_msg.url
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

    //上传公告图之前
    notice_beforeUpload (file) {
      console.log(file)
      if(file.type != 'image/jpeg' && file.type != 'image/jpg' && 
          file.type != 'image/png' && file.type != 'image/gif' &&
          file.type != 'image/JPEG' && file.type != 'image/JPG' &&
          file.type != 'image/PNG' && file.type != 'image/GIF'
          ) {
          this.$message.error('请上传图片格式!');
          this.notice_m_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('图片大小不能超过 200MB!');
        this.notice_m_err = true
      }
    },

    //确认添加公告
    notice_add_sure () {
      let that = this
      if(that.notice_form.bgColor == '') {
        that.$message({
          message: '请设置公告背景色',
          type: 'warning'
        });
        return
      }
      if(that.notice_form.textColor == '') {
        that.$message({
          message: '请设置公告文字颜色',
          type: 'warning'
        });
        return
      }
      if(that.notice_form.img == '' ) {
        that.$message({
          message: '请上传公告图片',
          type: 'warning'
        });
        return
      }
      if(that.notice_form.text == '' ) {
        that.$message({
          message: '请公告内容读取方式',
          type: 'warning'
        });
        return
      }
      if(that.notice_form.num == '' ) {
        that.$message({
          message: '请公告读取数量',
          type: 'warning'
        });
        return
      }
      notice_add(
        {
          background_colour : that.notice_form.bgColor,//背景颜色
          notice_colour : that.notice_form.textColor,//公告字体颜色
          icon_url : that.notice_form.img ,//图标路径
          sliding : that.notice_form.sliding,//滑动速度（以秒为单位）
          notice_type : that.notice_form.text,//公告类型 1是读取平台公告 2是手动公告
          number : that.notice_form.num,//公告展示条数
          type : 2
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.can_use = true
            that.$message({
              message: '添加成功',
              type: 'success'
            });
            that.notice_add_show = false
            that.get_floor_middle_list();//获取公告和活动区信息
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

    //删除公告
    delete_notice () {
      let that = this
      that.$confirm('此操作将删除公告模块,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        notice_del({
          id: that.ggID,
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '删除成功',
                type: 'success'
              });
              that.can_use = false
              that.notice_add_show = true
              that.get_floor_middle_list();//获取公告和活动区信息
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

    //编辑公告
    edit_notice () {
      let that = this
      that.icon_edit_show = false
      that.notice_add_show =  false
      that.product_edit_show = false
      that.active_edit_show = false
      that.notice_edit_show = true
    },

    //确认编辑公告
    notice_save_sure () {
      let that = this
      if(that.notice_form.bgColor == '') {
        that.$message({
          message: '请设置公告背景色',
          type: 'warning'
        });
        return
      }
      if(that.notice_form.textColor == '') {
        that.$message({
          message: '请设置公告文字颜色',
          type: 'warning'
        });
        return
      }
      if(that.notice_form.img == '' ) {
        that.$message({
          message: '请上传公告图片',
          type: 'warning'
        });
        return
      }
      if(that.notice_form.text == '' ) {
        that.$message({
          message: '请公告内容读取方式',
          type: 'warning'
        });
        return
      }
      if(that.notice_form.num == '' ) {
        that.$message({
          message: '请公告读取数量',
          type: 'warning'
        });
        return
      }
      notice_save(
        {
          id : that.ggID,
          background_colour : that.notice_form.bgColor,//背景颜色
          notice_colour : that.notice_form.textColor,//公告字体颜色
          icon_url : that.notice_form.img ,//图标路径
          sliding : that.notice_form.sliding,//滑动速度（以秒为单位）
          notice_type : that.notice_form.text,//公告类型 1是读取平台公告 2是手动公告
          number : that.notice_form.num,//公告展示条数
          type : 2
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.can_use = true
            that.$message({
              message: '编辑成功',
              type: 'success'
            });
            that.get_floor_middle_list();//获取公告和活动区信息
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

    //活动区

    //活动区编辑
    edit_active_ () {
      let that = this
      that.icon_edit_show = false
      that.product_edit_show = false
      that.active_edit_show = true
      that.notice_edit_show = false
    },

    //删除活动区(单)
    delete_active_ (index , row) {
      let that = this
      that.$confirm('此操作将删除名为'+ row.category_name +'的营销活动,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        floor_middle_del({
          id: row.id,
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '删除成功',
                type: 'success'
              });
              that.get_floor_middle_list();//获取公告和活动区信息
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

    //添加活动区
    add_active_ () {
      let that = this
      that.del_table_id = ''
      that.active_title = '添加'
      that.active_from.category_name = ''
      that.active_from.category_id = ''
      that.active_from.title = ''
      that.active_from.link_url = ''
      that.active_from.mould_type = ''
      that.active_from.image = ''
      that.active_from.diagram = []
      that.active_from.ifAdd = true
      that.active_dialogFormVisible = true
    },

    //编辑活动区
    edit_active_p (index , row) {
      console.log(row)
      let that = this
      that.active_message_o = row
      that.del_table_id = ''
      that.active_title = '编辑'
      that.active_from.category_name = row.category_name
      that.active_from.category_id = ''
      that.active_from.title = row.category_name
      that.active_from.link_url = row.link_url
      that.active_from.mould_type = row.mould_type
      that.active_from.image = row.icon_url
      that.active_from.diagram = []
      row.img.forEach(ele => {
        if(ele.selects == 1) {
          ele.selects = '商品ID'
        } else if(ele.selects == 2) {
          ele.selects = '主播ID'
        } else if(ele.selects == 3) {
          ele.selects = '商品分类ID'
        }
      })
      row.img.forEach(ele => {
        that.active_from.diagram.push({
          type : ele.selects,
          id : ele.input,
          image : ele.img_url,
          img_id : ele.img_id
        })
      })
      console.log(that.active_from.diagram)
      that.active_from.ifAdd = false
      that.active_dialogFormVisible = true
    },

    //上传副图
    img_upload: function(item) {
      console.log(item)
      let that = this
      if (this.active_img_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.active_from.image = res.data.err_msg.url
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

    //上传副图之前
    img_beforeUpload (file) {
      console.log(file)
      if(file.type != 'image/jpeg' && file.type != 'image/jpg' && 
          file.type != 'image/png' && file.type != 'image/gif' &&
          file.type != 'image/JPEG' && file.type != 'image/JPG' &&
          file.type != 'image/PNG' && file.type != 'image/GIF'
          ) {
          this.$message.error('请上传图片格式!');
          this.active_img_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('图片大小不能超过 200MB!');
        this.active_img_err = true
      }
    },

    //添加图片
    add_table_img () {
      this.active_from.diagram.push({
        type : '',
        id : '',
        image : '',
        img_id : ''
      })
    },

    //删除
    delete_table_img_ (index , row) {
      if(row.img_id != '') {
        if(this.del_table_id !='') {
          this.active_from.diagram.splice(index , 1)
          this.del_table_id = this.del_table_id + ',' + row.img_id
        } else {
          this.active_from.diagram.splice(index , 1)
          this.del_table_id = row.img_id
        }
      } else {
        this.active_from.diagram.splice(index , 1)
      }
    },

    //表格上传图片
    add_active_img_ (index , row) {
      this.active_table_index = index
    },

    //上传图片
    img_upload_active: function(item) {
      console.log(item)
      let that = this
      if (this.active_table_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        console.log(fd.get("file"))
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
              that.active_from.diagram[that.active_table_index].image = res.data.err_msg.url
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
    img_beforeUpload_active (file) {
      console.log(file)
      if(file.type != 'image/jpeg' && file.type != 'image/jpg' && 
          file.type != 'image/png' && file.type != 'image/gif' &&
          file.type != 'image/JPEG' && file.type != 'image/JPG' &&
          file.type != 'image/PNG' && file.type != 'image/GIF'
          ) {
          this.$message.error('请上传图片格式!');
          this.active_table_err = true
      } else if ( file.size / 1024 / 1024 > 200) {
        this.$message.error('图片大小不能超过 200MB!');
        this.active_table_err = true
      }
    },

    change_active (e) {
      let that = this
      that.market_category_list.forEach(element => {
        if(e == element.id) {
          that.active_from.title = element.name
          that.active_from.category_name = element.name
          that.active_from.title = element.name
        }
      })
    },

    //添加活动
    active_add_ () {
      let that = this
      let leg = false
      let result = []
      if(that.active_from.category_id == '' ) {
        that.$message({
          message: '请选择营销分类',
          type: 'warning'
        });
        return
      }
      if(that.active_from.mould_type == '' ) {
        that.$message({
          message: '请选择模板样式',
          type: 'warning'
        });
        return
      }
      if(that.active_from.diagram.length < 2) {
        that.$message({
          message: '请至少上传两张图片',
          type: 'warning'
        });
        return
      }

      that.active_from.diagram.forEach(ele => {
        if(ele.type == '' || ele.id == '' || ele.image == '') {
          leg = true
        }
      })

      if(leg == true) {
        that.$message({
          message: '请将表格内容填写完整',
          type: 'warning'
        });
        return
      }

      that.active_from.diagram.forEach(ele => {
        result.push({
          img_url : ele.image,
          selects : ele.type,
          input : ele.id
        })
      })

      floor_middle_add(
        {
          category_fid : that.active_from.category_id,
          title : that.active_from.title,
          icon_url : that.active_from.image,
          link_url : that.active_from.link_url,
          mould_type : that.active_from.mould_type,
          result : JSON.stringify(result)
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.$message({
              message: '添加成功',
              type: 'success'
            });
            that.active_dialogFormVisible = false
            that.get_floor_middle_list()
          } else {
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.active_dialogFormVisible = false
          console.log(error);
        });

    },

    //编辑活动
    active_save_ () {
      let that = this
      let leg = false
      let result = []
      // if(that.active_from.category_id == '' ) {
      //   that.$message({
      //     message: '请选择营销分类',
      //     type: 'warning'
      //   });
      //   return
      // }
      if(that.active_from.mould_type == '' ) {
        that.$message({
          message: '请选择模板样式',
          type: 'warning'
        });
        return
      }
      if(that.active_from.diagram.length < 2) {
        that.$message({
          message: '请至少上传两张图片',
          type: 'warning'
        });
        return
      }
      that.active_from.diagram.forEach(ele => {
        if(ele.type == '' || ele.id == '' || ele.image == '') {
          leg = true
        }
      })
      if(leg == true) {
        that.$message({
          message: '请将表格内容填写完整',
          type: 'warning'
        });
        return
      }
      console.log(that.active_from.diagram)
      that.active_from.diagram.forEach(ele => {
        that.type_list.forEach(ele_p => {
          if(ele_p.name == ele.type || ele_p.id == ele.type) {
            ele.type = ele_p.id
          }
        })
        if(ele.img_id != '') {
          result.push({
            img_url : ele.image,
            selects : ele.type,
            input : ele.id
          })
        }
      })
      console.log(that.active_from)
      that.market_category_list.forEach(element => {
        //  || that.active_from.category_name ==  element.name
        if(that.active_from.category_id == element.id || that.active_from.category_name ==  element.show_product_name) {
          that.active_from.category_id = element.id
        }
      })
      let data = {
          id : that.active_message_o.id,
          del_id : that.del_table_id,
          category_fid : that.active_from.category_id,
          title : that.active_from.title,
          icon_url : that.active_from.image,
          link_url : that.active_from.link_url,
          mould_type : that.active_from.mould_type,
          result : JSON.stringify(result)
        }
        console.log(data)
        console.log(data.category_fid)

      floor_middle_save(
        data
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.$message({
              message: '编辑成功',
              type: 'success'
            });
            that.active_dialogFormVisible = false
            that.get_floor_middle_list()
          } else {
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            });
          }
        })
        .catch((error) => {
          that.active_dialogFormVisible = false
          console.log(error);
        });
    },

    //活动-上移
    product_up_p (index , row) {
      let that = this
      let arr = this.active_list;
      arr.splice(index - 1, 1, ...arr.splice(index, 1, arr[index - 1]));
      console.log(arr)
      console.log(this.active_list)
      let id = ''
      if(that.configure_[0].id == 999) {
        this.active_list.forEach(ele => {
          if(id == '') {
            id = ele.id
          } else {
            id = id + ',' + ele.id
          }
        })
        id = id + ',' + that.configure_[1].id
      } else {
        this.active_list.forEach(ele => {
          if(id == '') {
            id = that.configure_[0].id + ',' + ele.id
          } else {
            id = id + ',' + ele.id
          }
        })
      }
     
      floor_sort({
        id: id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.get_floor_middle_list();
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
    },

    //活动 - 下移
    product_down_p (index , row) {
      let that = this
      let arr = this.active_list;
      arr.splice(index, 1, ...arr.splice(index + 1, 1, arr[index]));
      console.log(arr)
      console.log(this.active_list)
      let id = ''
      if(that.configure_[0].id == 999) {
        this.active_list.forEach(ele => {
          if(id == '') {
            id = ele.id
          } else {
            id = id + ',' + ele.id
          }
        })
        id = id + ',' + that.configure_[1].id
      } else {
        this.active_list.forEach(ele => {
          if(id == '') {
            id = that.configure_[0].id + ',' + ele.id
          } else {
            id = id + ',' + ele.id
          }
        })
      }
      floor_sort({
        id: id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.get_floor_middle_list();
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
    },


    // 猜你喜欢等列表  商品展示区域
    //----------------------------------------------------------

    //获取猜你喜欢等列表
    get_guess_list () {
      let that = this
      guess_list()
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            res_s.data.err_msg.list.forEach(ele => {
              ele.category_name = ''
              console.log(that.market_category_list)
              that.market_category_list.forEach(ele_p => {
                if(ele_p.id == ele.category_id) {
                  ele.category_name = ele_p.name
                }
              })
              if(ele.mould_type == 1) {
                ele.mould_name = '大图样式'
              } else if(ele.mould_type == 2) {
                ele.mould_name = '单列显示'
              } else if(ele.mould_type == 3) {
                ele.mould_name = '双列显示'
              } else if(ele.mould_type == 4) {
                ele.mould_name = '三列显示'
              }
            })
            
            that.product_tag = res_s.data.err_msg.list
            that.pick_k(that.product_tag[0])//默认展示猜你喜欢
            that.get_guess_color_info();//获取猜你喜欢等列表 背景色 文字颜色
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
    },

    //获取猜你喜欢等列表 背景色 文字颜色
    get_guess_color_info () {
      let that = this
      guess_color_info()
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.product_form.bg_color = res_s.data.err_msg.bg_color
            that.product_form.font_color = res_s.data.err_msg.font_color
            that.product_style = {
              color : res_s.data.err_msg.font_color
            }
            that.product_ul = {
              background : res_s.data.err_msg.bg_color,
            }
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
    },

    //编辑商品展示区
    edit_product () {
      this.icon_edit_show = false
      this.notice_edit_show = false
      this.active_edit_show = false
      this.product_edit_show = true
    },

    //编辑猜你喜欢列表  商品展示区 背景色
    save_product_sure () {
      let that = this
      if(that.product_form.bg_color == '') {
        that.$message({
          message: '请设置背景色',
          type: 'warning'
        });
        return
      }
      if(that.product_form.font_color == '') {
        that.$message({
          message: '请设置文字颜色',
          type: 'warning'
        });
        return
      }
      guess_color({
        bg_color : that.product_form.bg_color,
        font_color : that.product_form.font_color
      })
        .then((res_s) => {
          console.log(res_s.data.err_code);
          if (res_s.data.err_code == 0) {
            that.$message({
              message: '编辑成功',
              type: 'success'
            });
            that.get_guess_color_info()
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
    },

    //删除猜你喜欢等列表
    delete_product (index , row) {
      let that = this
      that.$confirm('此操作将删除名为: '+ row.category_name + '的类别,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        guess_del({
          id: row.id,
        })
          .then((res_s) => {
            console.log(res_s);
            if (res_s.data.err_code == 0) {
              that.$message({
                message: '删除成功',
                type: 'success'
              });
              that.get_guess_list();//获取猜你喜欢等列表
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

    //添加猜你喜欢等列表
    add_product () {
      let that = this
      that.dialogFormVisible = true
      that.product_title = '添加'
      that.product_form_p.ifAdd = true
      that.product_form_p.category_name = ''
      that.product_form_p.category_id = ''
      that.product_form_p.mould_type = ''
      that.product_form_p.show_product_name = ''
      that.product_form_p.name_colour = ''
      that.product_form_p.show_product_price = ''
      that.product_form_p.price_colour = ''
      that.product_form_p.show_market_price = ''
      that.product_form_p.show_purchase = ''
      that.product_form_p.show_share = ''

    },

    //编辑猜你喜欢等列表
    edit_product_p (idnex , row) {
      console.log(row)
      let that = this
      that.message_o = row
      that.dialogFormVisible = true
      that.product_title = '编辑'
      that.product_form_p.ifAdd = false
      that.product_form_p.link_url = row.link_url
      that.product_form_p.category_name = row.category_name
      that.product_form_p.category_id = row.category_id
      that.product_form_p.mould_type = row.mould_type
      that.product_form_p.show_product_name = row.show_product_name
      that.product_form_p.name_colour = row.name_colour
      that.product_form_p.show_product_price = row.show_product_price
      that.product_form_p.price_colour = row.price_colour
      that.product_form_p.show_market_price = row.show_market_price
      that.product_form_p.show_purchase = row.show_purchase
      that.product_form_p.show_share = row.show_share
    },

    //猜你喜欢等列表排序-上移
    product_up (index , row) {
      let that = this
      let arr = this.product_tag;
      arr.splice(index - 1, 1, ...arr.splice(index, 1, arr[index - 1]));
      console.log(arr)
      console.log(this.product_tag)
      let id = ''
      this.product_tag.forEach(ele => {
        if(id == '') {
          id = ele.id
        } else {
          id = id + ',' + ele.id
        }
      })
      guess_sort({
        id: id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.get_guess_list();
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
    },

    //猜你喜欢等列表排序 - 下移
    product_down (index , row) {
      let that = this
      let arr = this.product_tag;
      arr.splice(index, 1, ...arr.splice(index + 1, 1, arr[index]));
      console.log(arr)
      console.log(this.product_tag)
      let id = ''
      this.product_tag.forEach(ele => {
        if(id == '') {
          id = ele.id
        } else {
          id = id + ',' + ele.id
        }
      })
      guess_sort({
        id: id,
      })
        .then((res_s) => {
          console.log(res_s);
          if (res_s.data.err_code == 0) {
            that.get_guess_list();
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
    },

    //添加猜你喜欢等列表
    add_ () {
      let that = this
      if(that.product_form_p.category_id == '') {
        that.$message({
          message: '请选择营销分类',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.mould_type == '' ) {
        that.$message({
          message: '请选择模板样式',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.show_product_name == '' ) {
        that.$message({
          message: '请选择商品名称显示与否',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.name_colour == '' ) {
        that.$message({
          message: '请选择名称颜色',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.show_product_price == '' ) {
        that.$message({
          message: '请选择销售价格显示与否',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.price_colour == '' ) {
        that.$message({
          message: '请选择价格颜色',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.show_market_price == '' ) {
        that.$message({
          message: '请选择市场价显示与否',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.show_purchase == '' ) {
        that.$message({
          message: '请选择自购省钱显示与否',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.show_share == '' ) {
        that.$message({
          message: '请选择分享赚钱显示与否',
          type: 'warning'
        });
        return
      }
      guess_add(
        {
          category_id : that.product_form_p.category_id,//分类id
          link_url : that.product_form_p.link_url,//链接路径
          mould_type : that.product_form_p.mould_type,
          show_product_name : that.product_form_p.show_product_name,
          name_colour : that.product_form_p.name_colour,
          show_product_price : that.product_form_p.show_product_price,
          price_colour : that.product_form_p.price_colour,
          show_market_price : that.product_form_p.show_market_price ,
          show_purchase : that.product_form_p.show_purchase,
          show_share : that.product_form_p.show_share ,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.dialogFormVisible = false
            that.$message({
              message: '添加成功',
              type: 'success'
            });
            that.get_guess_list();
          } else {
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
    },

    //编辑猜你喜欢等列表
    save_ () {
      let that = this
      console.log(that.product_form_p)
      if(that.product_form_p.category_id == '') {
        that.$message({
          message: '请选择营销分类',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.mould_type == '' ) {
        that.$message({
          message: '请选择模板样式',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.show_product_name == '' ) {
        that.$message({
          message: '请选择商品名称显示与否',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.name_colour == '' ) {
        that.$message({
          message: '请选择名称颜色',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.show_product_price == '' ) {
        that.$message({
          message: '请选择销售价格显示与否',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.price_colour == '' ) {
        that.$message({
          message: '请选择价格颜色',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.show_market_price == '' ) {
        that.$message({
          message: '请选择市场价显示与否',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.show_purchase == '' ) {
        that.$message({
          message: '请选择自购省钱显示与否',
          type: 'warning'
        });
        return
      }
      if(that.product_form_p.show_share == '' ) {
        that.$message({
          message: '请选择分享赚钱显示与否',
          type: 'warning'
        });
        return
      }
      guess_save(
        {
          id : that.message_o.id,
          category_id : that.product_form_p.category_id,//分类id
          link_url : that.product_form_p.link_url,//链接路径
          mould_type : that.product_form_p.mould_type,
          show_product_name : that.product_form_p.show_product_name,
          name_colour : that.product_form_p.name_colour,
          show_product_price : that.product_form_p.show_product_price,
          price_colour : that.product_form_p.price_colour,
          show_market_price : that.product_form_p.show_market_price ,
          show_purchase : that.product_form_p.show_purchase,
          show_share : that.product_form_p.show_share ,
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.err_code == 0) {
            that.dialogFormVisible = false
            that.$message({
              message: '编辑成功',
              type: 'success'
            });
            that.get_guess_list();
          } else {
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
    },

    //选择猜你喜欢等
    pick_k (item) {
      console.log(item)
      let that = this
      that.product_list.forEach(ele => {
        ele.show_name = item.show_product_name
        ele.mould_type = item.mould_type
        ele.show_product_price = item.show_product_price
        ele.show_market_price = item.show_market_price
        ele.show_purchase = item.show_purchase
        ele.show_share = item.show_share
        ele.name_colour = {
          color : item.name_colour
        }
        ele.price_colour = {
          color : item.price_colour
        }
      })

      that.product_list_copy.forEach(ele => {
        ele.show_name = item.show_product_name
        ele.mould_type = item.mould_type
        ele.show_product_price = item.show_product_price
        ele.show_market_price = item.show_market_price
        ele.show_purchase = item.show_purchase
        ele.show_share = item.show_share
        ele.name_colour = {
          color : item.name_colour
        }
        ele.price_colour = {
          color : item.price_colour
        }
      })
      
    }








    

  },
};
</script>

<style scoped lang="less">

  .dialogForm {
    /deep/ .el-dialog {
      width: 800px !important;
    }
    /deep/ .el-dialog__body {
      
      .el-form {
        display : flex;
        flex-wrap: wrap;
        .el-form-item {
          width : 49%;
          margin-right : 1%;
        }
      }
    }
  }

  .dialogForm_active {
    /deep/ .el-dialog {
      width: 900px !important;
      height : 700px ;
      overflow-y:auto;
    }
    /deep/ .el-dialog__body {
      // .goodsindex-list {
      //   height : 300px ;
      //   overflow-y:auto;
      // }
      
      .el-form {
        display : flex;
        flex-wrap: wrap;
        .el-form-item {
          width : 49%;
          margin-right : 1%;
        }
      }
    }
  }

  

  /deep/ .el-table td, .el-table th.is-leaf{
    border-top: 1px solid #717b90;
    border-bottom:0
  }

  /deep/ .el-table__body{
    border-bottom: 1px solid #EBEEF5;
  }

  /deep/ .el-date-editor {
    margin-left: 10px;
  }
  
  .renovation {
    // display: flex;
    // flex-wrap: wrap;
    .renovation_left {
      width: 100%;
      padding : 20px;
      .box-card {
        width : 100%;
        /deep/ .el-card__body {
          display: flex;
          .text {
            width : 8%;
            margin-right : 12%;
          }
        }
      }
    }

    .renovation_s {
      display: flex;
    }

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
    margin-top: 10px;
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

  /deep/ .upload-demo {
    display : inline-block;
  }

  .text {
    font-size: 14px;
    display: flex;
    justify-content: space-around;
  }

  .item {
    padding: 18px 0;
    cursor:pointer;
  }

  .box-card {
    width: 220px;
  }

  .renovation_right {
    width : 435px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    margin : 20px;
    height : 800px;
    .phone_top {
      padding-left :2px;
      img {
        width : 100%;
      }
    }
    .phone_bottom {
      padding-left :3px;
      img {
        width : 100%;
      }
    }
    .phone_contant {
      display: flex;
      .phone_contant_left {
        width :30px;
        height :667px;
        img {
          width : 100%;
          height: 100%;
        }
      }
      .phone_contant_right {
        width :30px;
        height :667px;
        img {
          width : 100%;
          height: 100%;
        }
      }
      .renovation_center {
        width : 375px;
        height: 667px;
      }
    }
  }

  .renovation_center {
    background: #F2F2F2;
    overflow-y:auto;

    //搜索 轮播模块
    .carouselMap {
      height : 200px;
      background-image: url('../../assets/image/bg.png');
      background-size: 100% 100%;
      .seach_ {
        display: flex;
        padding-top: 10px;
        padding-left : 12px;
        position: relative;
        .img_t {
          width : 20px;
          height : 20px;
          margin-top : 10px;
          margin-left : 4px;
        }
        img:nth-child(1) {
          width : 15px;
          height : 15px;
          position: absolute;
          top : 22px;
          left : 24px;
          z-index: 999;
        }
        .el-input {
          width : 322px;
          height : 34px;
          /deep/ .el-input__inner {
            border-radius: 20px !important;
            padding-left : 36px;
          }
        }
      }
      .hotSearch {
        color : #fff;
        font-size : 12px;
        margin : 15px;
        span {
          background: #FDB19D;
          opacity: 0.8;
          border-radius: 8px;
          margin-right : 8px;
          padding : 2px 11px;
        }
      }
      .lunbo {
        
      }
    }

    //icon展示区
    .banner_view_box {
      margin-top :50px;
      padding: 30px 12px;
      border:5px dotted #FB613A;
      // border-color:linear-gradient(toright,red,yellow,blue);
      .banner_view_item {
        padding-right: 5px;
        box-sizing: border-box;
        position: relative;
        margin-bottom :20px;
        .img_f {
          position:absolute;
          top:-5px;
          right :15px;
        }
      }
    }

    // 公告、活动展示区
    .notice_view_box {
      margin-top :50px;
      box-sizing: border-box;
      .toUp {
        margin-top: -30px;
        transition: all 0.5s;
      }
      .notice_play {
        box-sizing: border-box;
        list-style: none;
        width: 100%;
        overflow: hidden;
        height: 30px;
        line-height: 30px;
        margin: 10px;
        margin-left : -10px;
        font-size : 15px;
        color: #fff;
        background : #FB6C3D;
        border-radius: 5px;
        li {
          display: flex;
        }
        img {
          width : 19px;
          height : 16px;
          vertical-align:middle;
          padding:6px;
        }
      }

      //有品秒杀
      .active_k {
        // display: flex;
        // flex-wrap: wrap;
        .active_box {
          display: flex;
          flex-wrap: wrap;
          .seckill {
            width : 100%;
            background: #FEFEFE;
            border-radius: 20px;  
            margin : 20px 0;
            .active_header {
              display: flex;
              justify-content: space-between;
              height: 20px;
              margin : 12px 0;
              padding : 0 5px;
              h6 {
                color: #444444;
                font-size : 15px;
                height : 20px;
                margin : 0;
              }
              span {
                color: #888888;
                font-size : 12px;
              }
            }
            ul {
              display: flex;
              overflow-x:auto;
              cursor: pointer;
              margin-bottom :20px;
              padding : 0 5px;
              li {
                width :70px;
                height : 90px;
                margin-right :16px;
                img {
                  width :70px;
                  height : 90px;
                }
              }
            }
            //设置滚动条样式
            .kkk::-webkit-scrollbar {
              width: 4px;    
              height: 4px;
            }
            .kkk::-webkit-scrollbar-thumb {
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              background: rgba(0,0,0,0.2);
            }
            .kkk::-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              border-radius: 0;
              background: rgba(0,0,0,0.1);
            }

          }

          // 大图滑动
          .big_seckill {
            width : 100%;
            background: #FEFEFE;
            border-radius: 20px; 
            margin: 20px 0; 
            .active_header {
              display: flex;
              justify-content: space-between;
              height: 20px;
              margin : 12px 0;
              padding : 0 5px;
              h6 {
                color: #444444;
                font-size : 15px;
                height : 20px;
                margin : 0;
              }
              span {
                color: #888888;
                font-size : 12px;
              }
            }
            ul {
              display: flex;
              overflow-x:auto;
              cursor: pointer;
              margin-bottom :20px;
              padding : 0 5px;
              li {
                width :322px;
                height : 160px;
                margin-right :16px;
                img {
                  width :322px;
                  height : 322px;
                }
              }
            }
            //设置滚动条样式
            .kkk::-webkit-scrollbar {
              width: 4px;    
              height: 6px;
            }
            .kkk::-webkit-scrollbar-thumb {
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              background: rgba(0,0,0,0.2);
            }
            .kkk::-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              border-radius: 0;
              background: rgba(0,0,0,0.1);
            }
          }

          // 小图滑动
          .small_seckill {
            width : 100%;
            background: #FEFEFE;
            border-radius: 20px; 
            margin: 20px 0; 
            .active_header {
              display: flex;
              justify-content: space-between;
              height: 20px;
              margin : 12px 0;
              padding : 0 5px;
              h6 {
                color: #444444;
                font-size : 15px;
                height : 20px;
                margin : 0;
              }
              span {
                color: #888888;
                font-size : 12px;
              }
            }
            ul {
              display: flex;
              overflow-x:auto;
              cursor: pointer;
              margin-bottom :20px;
              padding : 0 5px;
              li {
                width :322px;
                height : 160px;
                margin-right :16px;
                img {
                  width :322px;
                  height : 322px;
                }
              }
            }
            //设置滚动条样式
            .kkk::-webkit-scrollbar {
              width: 4px;    
              height: 6px;
            }
            .kkk::-webkit-scrollbar-thumb {
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              background: rgba(0,0,0,0.2);
            }
            .kkk::-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              border-radius: 0;
              background: rgba(0,0,0,0.1);
            }
          }

          // 双列小图显示
          .double_s_seckill {
            // width : 48%;
            background: #FEFEFE;
            border-radius: 20px; 
            padding-top: 10px;
            .active_header {
              display: flex;
              justify-content: space-between;
              height: 20px;
              margin : 12px 0;
              padding : 0 5px;
              h6 {
                color: #444444;
                font-size : 15px;
                height : 20px;
                margin : 0;
              }
              span {
                color: #888888;
                font-size : 12px;
              }
            }
            ul {
              display: flex;
              // overflow-x:auto;
              cursor: pointer;
              margin-bottom :20px;
              padding : 0 5px;
              width: 140px;
              li {
                width :60px;
                height : 80px;
                margin-right :4px;
                img {
                  width :322px;
                  height : 322px;
                }
              }
            }
            //设置滚动条样式
            .kkk::-webkit-scrollbar {
              width: 4px;    
              height: 6px;
            }
            .kkk::-webkit-scrollbar-thumb {
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              background: rgba(0,0,0,0.2);
            }
            .kkk::-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              border-radius: 0;
              background: rgba(0,0,0,0.1);
            }
          }

          // 四列显示
          .four_seckill {
            width : 100%;
            background: #FEFEFE;
            border-radius: 20px;  
            .active_header {
              display: flex;
              justify-content: space-between;
              height: 20px;
              margin : 12px 0;
              padding : 0 5px;
              h6 {
                color: #444444;
                font-size : 15px;
                height : 20px;
                margin : 0;
              }
              span {
                color: #888888;
                font-size : 12px;
              }
            }
            ul {
              display: flex;
              // overflow-x:auto;
              cursor: pointer;
              margin-bottom :20px;
              padding : 0 5px;
              li {
                width :70px;
                height : 90px;
                margin-right :16px;
                img {
                  width :70px;
                  height : 90px;
                }
              }
            }
            //设置滚动条样式
            .kkk::-webkit-scrollbar {
              width: 4px;    
              height: 4px;
            }
            .kkk::-webkit-scrollbar-thumb {
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              background: rgba(0,0,0,0.2);
            }
            .kkk::-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              border-radius: 0;
              background: rgba(0,0,0,0.1);
            }

          }

           // 双列大图显示
          .double_big_seckill {
            width : 100%;
            background: #FEFEFE;
            border-radius: 20px;  
            margin : 20px 0;
            .active_header {
              display: flex;
              justify-content: space-between;
              height: 20px;
              margin : 12px 0;
              padding : 0 5px;
              h6 {
                color: #444444;
                font-size : 15px;
                height : 20px;
                margin : 0;
              }
              span {
                color: #888888;
                font-size : 12px;
              }
            }
            ul {
              display: flex;
              // overflow-x:auto;
              cursor: pointer;
              margin-bottom :20px;
              padding : 0 5px;
              li {
                width :140px;
                height : 90px;
                margin-right :16px;
                img {
                  width :70px;
                  height : 90px;
                }
              }
            }
            //设置滚动条样式
            .kkk::-webkit-scrollbar {
              width: 4px;    
              height: 4px;
            }
            .kkk::-webkit-scrollbar-thumb {
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              background: rgba(0,0,0,0.2);
            }
            .kkk::-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
              border-radius: 0;
              background: rgba(0,0,0,0.1);
            }

          }




        }
      }
    }

    //猜你喜欢列表  商品展示区
    .product_view_box {
      padding: 30px 12px;
      border:5px dotted #FB613A;
      margin-bottom :50px;

      // 列表
      ul {
        display: flex;
        overflow-x:auto;
        margin-bottom :20px;
        cursor: pointer;
        li {
          flex-shrink: 0;
          margin-right : 20px;
          color: #767676;
          font-size :15px;
          line-height :20px;
        }
        li:nth-child(1) {
          color: #444444;
          font-size : 18px;
        }
      }

      //大图样式
      .big_style {
        .big_div {
          background: #FEFEFE;
          font-size : 12px;
          color :#444;
          padding :10px;
          border-radius: 20px;
          margin-bottom : 10px;
          img {
            width : 320px;
            height : 130px;
          }
          h5 {
            font-weight: 600;
            margin : 11px 0;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .big_contant {
            span:nth-child(1) {
              width :140px;
              height :50px;
              background-image: url('../../assets/image/3.png');
              background-repeat: no-repeat;
              background-size: 100% 50px;
              color: #FFFFFF;
              font-size : 12px;
              padding-left :10px;
              padding-right :10px;
            }
            span:nth-child(2) {
              width :140px;
              height :50px;
              background-image: url('../../assets/image/4.png');
              background-repeat: no-repeat;
              background-size: 100% 50px;
              color: #FFFFFF;
              font-size : 12px;
              padding-left :10px;
              padding-right :10px;
              margin-right : 100px;
            }
            span:nth-child(4) {
              margin-left : 10px;
              text-decoration : line-through;
            }

          }
        }
      }  
      
      //单列样式  
      .only_style {
        .only_div {
          display : flex;
          background: #FEFEFE;
          border-radius: 20px;
          padding :10px;
          margin-bottom : 10px;
          font-size : 12px;
          img {
            width :130px;
            height : 130px;
            margin-right : 10px;
          }
          h5 {
            width : 180px;
            font-weight: 600;
            margin : 11px 0;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .only_contant {
            .span_o {
              width :54px;
              height :18px;
              background-image: url('../../assets/image/3.png');
              background-repeat: no-repeat;
              background-size: 100% 50px;
              color: #FFFFFF;
              font-size : 12px;
              padding-left :10px;
              padding-right :10px;
              display: inline-block;
            }
            .span_t {
              width :54px;
              height :18px;
              background-image: url('../../assets/image/4.png');
              background-repeat: no-repeat;
              background-size: 100% 50px;
              color: #FFFFFF;
              font-size : 12px;
              padding-left :10px;
              padding-right :10px;
              // margin-right : 100px;
              display: inline-block;
            }
          }
        }
      }

      //双列显示
      .double_style {
        font-size : 12px;
        color :#444;
        display: flex;
        .double_div {
          background: #FEFEFE;
          border-radius: 20px;
          margin-bottom : 10px;
          margin-right :10px;
        }
        img {
          width : 165px;
          height : 100%;
        }
        h5 {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 600;
          color: #444444;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          padding-left : 10px;
          margin : 10px 0;
        }
        .double_contant {
          padding-left : 10px;
          padding-bottom :10px;
          .span_o {
            width :56px;
            height :18px;
            background-image: url('../../assets/image/3.png');
            background-repeat: no-repeat;
            background-size: 100% 50px;
            color: #FFFFFF;
            font-size : 12px;
            padding-left :10px;
            padding-right :10px;
            display: inline-block;
          }
          .span_t {
            width :56px;
            height :18px;
            background-image: url('../../assets/image/4.png');
            background-repeat: no-repeat;
            background-size: 100% 50px;
            color: #FFFFFF;
            font-size : 12px;
            padding-left :10px;
            padding-right :10px;
            display: inline-block;
          }
        }
      }

      //三列显示  
      .three_style {
        display : flex;
        flex-wrap: wrap;
        background: #FEFEFE;
        .three_div {
          width : 87px;
          background: #FEFEFE;
          font-size : 12px;
          color :#444;
          padding :10px;
          border-radius: 20px;
          margin-bottom : 10px;
          margin-right : 4px;
          img {
            width : 87px;
            height : 111px;
          }
          h5 {
            font-weight: 600;
            margin : 11px 0;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .three_contant {
            display: flex;
            flex-wrap: wrap;
            span:nth-child(3) {
              margin-top: 5px;
              width :100px;
              height :30px;
              background-image: url('../../assets/image/3.png');
              background-repeat: no-repeat;
              background-size: 100% 30px;
              color: #FFFFFF;
              font-size : 12px;
              padding-left :10px;
              padding-right :10px;
            }
            span:nth-child(4) {
              width :100px;
              height :30px;
              background-image: url('../../assets/image/4.png');
              background-repeat: no-repeat;
              background-size: 100% 30px;
              color: #FFFFFF;
              font-size : 12px;
              padding-left :10px;
              padding-right :10px;
            }
            span:nth-child(2) {
              margin-left : 10px;
              text-decoration : line-through;
            }

          }
        }
      }  
    }
  }

  //设置滚动条样式
  .renovation_center::-webkit-scrollbar {
    width: 4px;    
    /*height: 4px;*/
  }
  .renovation_center::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .renovation_center::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }

  //设置滚动条样式
  .product_ul::-webkit-scrollbar {
    width: 4px;    
    height: 4px;
  }
  .product_ul::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .product_ull::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }

  .renovation_edit {
    flex-grow: 1;
    margin-top :50px;
    margin-right : 50px;
    padding: 20px 12px;
    border:5px dotted #FB613A;
    overflow-x:auto;
  }
</style>