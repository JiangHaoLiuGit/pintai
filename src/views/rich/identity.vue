<template>
  <div class="page">
    <div class="pageItem">
      <div class="topHead clearfix">
        <s class="lt"></s>
        <span class="lt">身份变更管理</span>
      </div>
      <div class="textItem">
        <div class="clearfix" style="margin-bottom: 20px">
          <el-input
            class="lt marginRight"
            style="width: 250px"
            placeholder="请输入账号/ID/昵称"
            prefix-icon="el-icon-search"
            @keyup.enter.native="pick_seach"
            v-model="seachVale"
          >
          </el-input>

          <el-input
            class="lt marginRight"
            style="width: 250px"
            placeholder="请输入身份"
            prefix-icon="el-icon-search"
            @keyup.enter.native="pick_seach"
            v-model="seachVale1"
          >
          </el-input>

          <el-select
            v-model="shen_status"
            class="marginRight lt"
            placeholder="请选择审核状态"
          >
            <el-option
              v-for="item in shen_status_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>

          <el-select
            v-model="type_status"
            class="marginRight lt"
            placeholder="请选择申请身份"
          >
            <el-option
              v-for="item in type_status_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>

          <el-date-picker
            :clearable="false"
            class="marginRight"
            v-model="time_value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-button type="primary" class="rt" @click="pick_seach"
            >搜索</el-button
          >
          <el-button
            type="primary"
            class="rt"
            style="margin-right: 10px"
            @click="fn1(1)"
            >刷新</el-button
          >
        </div>
        <el-row :gutter="20" class="goodsindex-list">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="extendList"
              border
              :height="height"
              style="width: 100%"
            >
              <el-table-column label="序号" type="index" width="80">
              </el-table-column>
              <el-table-column prop="create_time" label="提交申请时间">
              </el-table-column>
              <el-table-column prop="nickname" label="申请人昵称">
              </el-table-column>
              <el-table-column prop="account" label="申请人账号">
              </el-table-column>
              <el-table-column prop="uid" label="UID"> </el-table-column>
              <el-table-column prop="name" label="申请人姓名">
              </el-table-column>
              <el-table-column prop="id_card" label="身份证号码">
              </el-table-column>
              <el-table-column label="申请身份">
                <template slot-scope="scope">
                  <div>{{ scope.row.region }}合伙人</div>
                </template>
              </el-table-column>
              <el-table-column label="是否收益">
                <template slot-scope="scope">
                  <div v-if="scope.row.is_profit == 1">是</div>
                  <div v-else-if="scope.row.is_profit == 2">否</div>
                  <div v-else>未知</div>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.state == 1" style="color: #f00f0f">
                    审核中
                  </div>
                  <div v-else-if="scope.row.state == 2">审核成功</div>
                  <div v-else-if="scope.row.state == 3" style="color: #ee0dc6">
                    审核拒绝
                  </div>
                  <div v-else-if="scope.row.state == 4" style="color: #ee8f29">
                    候补中
                  </div>
                  <div v-else-if="scope.row.state == 5">被取消</div>
                  <div v-else>未知</div>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="warning"
                    @click="edits(scope.$index, scope.row)"
                    v-if="scope.row.state == 4"
                    >更换区域</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="shens(scope.$index, scope.row)"
                    v-else-if="scope.row.state == 1"
                    >审核</el-button
                  >
                  <el-button
                    size="mini"
                    style="color: #ee0dc6"
                    @click="infos(scope.$index, scope.row, 2)"
                    v-else-if="scope.row.state == 5 || scope.row.state == 3"
                    >详情
                  </el-button>
                  <el-button
                    size="mini"
                    @click="infos(scope.$index, scope.row, 1)"
                    v-else
                    >详情</el-button
                  >
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
        <!-- 审核 -->
        <el-dialog
          width="60%"
          class="remarks_box"
          :visible.sync="shen_tan"
          append-to-body
        >
          <div class="info" v-if="types == 1">
            <s class="s"></s>{{ shen_wen.title }}
          </div>
          <div class="info" v-else-if="types == 2">
            <s class="s"></s>更换区域
          </div>
          <div class="info" v-else-if="types == 3 || types == 4">
            <s class="s"></s>详情
          </div>
          <div style="padding: 0 10px 30px 10px">
            <div class="blockBox divs">
              <el-form :model="shen_wen" class="form por clearfix">
                <div class="clearfix">
                  <div class="lt yiban">
                    <h2>用户信息(默认使用实名认证信息)</h2>
                    <el-form-item label="姓名:" :label-width="formLabelWidth1">
                      <el-input
                        type="text"
                        placeholder="请输入姓名"
                        v-model="shen_wen.real_name"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="身份证号码:"
                      :label-width="formLabelWidth1"
                    >
                      <el-input
                        type="text"
                        placeholder="请输入身份证"
                        v-model="shen_wen.id_card"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="电话:" :label-width="formLabelWidth1">
                      <el-input
                        type="text"
                        placeholder="请输入电话"
                        v-model="shen_wen.phone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="rt yiban">
                    <h2>银行卡信息(请务必真实填写，用以收益打款)</h2>
                    <el-form-item
                      label="账户姓名:"
                      :label-width="formLabelWidth1"
                    >
                      <el-input
                        type="text"
                        placeholder="请输入账户姓名"
                        v-model="shen_wen.bank_card_user"
                      ></el-input>
                    </el-form-item>

                    <el-form-item
                      label="银行卡号:"
                      :label-width="formLabelWidth1"
                    >
                      <el-input
                        type="number"
                        placeholder="请输入银行卡号"
                        v-model="shen_wen.bank_card"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="开户银行:"
                      :label-width="formLabelWidth1"
                    >
                      <el-input
                        type="text"
                        placeholder="请输入开户银行"
                        v-model="shen_wen.opening_bank"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="clearfix">
                  <div class="lt yiban">
                    <h2>辅助信息(可填写便于联系的电话)</h2>
                    <el-form-item
                      label="联系地址:"
                      class="por"
                      :label-width="formLabelWidth1"
                    >
                      <el-select
                        style="width: 30%"
                        v-model="shen_wen.contact_province"
                        placeholder="请选择省份"
                      >
                        <el-option
                          v-for="item in provinceList"
                          :key="item.province_id"
                          :label="item.name"
                          :value="item.province_id"
                        >
                        </el-option>
                      </el-select>
                      <el-select
                        v-model="shen_wen.contact_city"
                        placeholder="请选择市"
                        v-show="city_ifShow"
                        style="margin-left: 10px; width: 30%"
                      >
                        <el-option
                          v-for="item in cityList"
                          :key="item.city_id"
                          :label="item.name"
                          :value="item.city_id"
                        >
                        </el-option>
                      </el-select>

                      <el-select
                        v-model="shen_wen.contact_area"
                        placeholder="请选择区"
                        v-show="area_ifShow"
                        style="margin-left: 10px; width: 30%"
                      >
                        <el-option
                          v-for="item in areaList"
                          :key="item.area_id"
                          :label="item.name"
                          :value="item.area_id"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      label="详细地址:"
                      :label-width="formLabelWidth1"
                    >
                      <el-input
                        type="text"
                        placeholder="请输入详细地址"
                        v-model="shen_wen.contact_address"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="联系电话:"
                      :label-width="formLabelWidth1"
                    >
                      <el-input
                        type="number"
                        placeholder="请输入联系电话"
                        v-model="shen_wen.contact_phone"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="rt yiban" v-if="types == 1">
                    <h2>申请成为联合创始人</h2>
                    <el-form-item
                      label="申请数量:"
                      :label-width="formLabelWidth1"
                    >
                      <el-input
                        type="text"
                        style="width: calc(100% - 30px)"
                        placeholder="请输入问题"
                        value="1"
                        disabled
                      ></el-input>
                      <span class="rt">席</span>
                    </el-form-item>
                  </div>
                  <div
                    class="rt yiban"
                    v-else-if="
                      (types == 2 || types == 3 || types == 4) &&
                      shen_wen.agent_type != 3
                    "
                  >
                    <h2>选择省级区域</h2>
                    <el-form-item
                      label="联系地址:"
                      class="por"
                      :label-width="formLabelWidth1"
                    >
                      <el-select
                        style="width: 45%"
                        placeholder="请选择省份"
                        v-model="code.province_code"
                        clearable
                      >
                        <el-option
                          v-for="item in provinceList1"
                          :key="item.province_id"
                          :label="item.name"
                          :value="item.province_id"
                        >
                        </el-option>
                      </el-select>

                      <el-select
                        placeholder="请选择市"
                        v-show="city_ifShow1"
                        v-model="code.city_code"
                        style="margin-left: 10px; width: 45%"
                        clearable
                      >
                        <el-option
                          v-for="item in cityList1"
                          :key="item.city_id"
                          :label="item.name"
                          :value="item.city_id"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <!--  -->
                <div
                  class="clearfix"
                  v-if="
                    (types == 4 || types == 3) &&
                    shen_wen.certificate.length > 0
                  "
                >
                  <div class="lt yiban">
                    <h2>打款凭证</h2>
                    <el-carousel
                      height="150px"
                      style="width: 100%"
                      :autoplay="false"
                    >
                      <el-carousel-item
                        v-for="item in shen_wen.certificate"
                        :key="item"
                      >
                        <el-image
                          :src="item"
                          fit="cover"
                          style="width: 100%; height: 150px"
                          :preview-src-list="shen_wen.certificate"
                        ></el-image>
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </div>

                <div class="clearfix" v-if="types == 1">
                  <div class="lt yiban">
                    <h2>打款凭证</h2>
                    <el-carousel
                      height="150px"
                      style="width: 100%"
                      :autoplay="false"
                    >
                      <el-carousel-item
                        v-for="item in shen_wen.certificate"
                        :key="item"
                      >
                        <el-image
                          :src="item"
                          fit="cover"
                          style="width: 100%; height: 150px"
                          :preview-src-list="shen_wen.certificate"
                        ></el-image>
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                  <div
                    class="rt yiban"
                    style="margin-top: 20px"
                    v-if="types == 1"
                  >
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 5, maxRows: 10 }"
                      placeholder="请拒绝原因"
                      v-model="shenValue"
                    >
                    </el-input>
                    <div
                      slot="footer"
                      class="dialog-footer clearfix"
                      style="padding: 10px 40px 10px 30px; margin-top: 20px"
                    >
                      <el-button
                        type="success"
                        class="rt"
                        @click="wen('1')"
                        style="margin-left: 15px"
                        >同 意</el-button
                      >
                      <el-button type="danger" class="rt" @click="wen('2')"
                        >拒 绝</el-button
                      >
                    </div>
                  </div>
                </div>
                <div
                  v-else-if="types == 2"
                  class="dialog-footer clearfix"
                  style="padding: 10px 40px 10px 30px; margin-top: 20px"
                >
                  <el-button
                    type="success"
                    class="rt"
                    @click="wen('3')"
                    style="margin-left: 15px"
                    >保 存</el-button
                  >
                  <el-button type="danger" class="rt" @click="shen_tan = false"
                    >取 消</el-button
                  >
                </div>
                <div
                  v-if="types == 3 || types == 4"
                  class="dialog-footer clearfix"
                  style="padding: 10px 40px 10px 30px; margin-top: 20px"
                >
                  <span class="lf" style="color: #ff980f" v-if="types == 4">
                    被拒绝原因:{{ shen_wen.reason }}
                  </span>
                  <el-button
                    type="success"
                    class="rt"
                    @click="wen('4')"
                    style="margin-left: 15px"
                    >确定</el-button
                  >
                </div>
                
              </el-form>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {
  agent_list,
  agent_info,
  get_area,
  get_city,
  get_province,
  agent_update,
  get_province1,
  get_city1,
} from "../../utils/axios";
export default {
  data() {
    return {
      queryInfo: {
        page: 1,
        pageSize: 10,
        total: 1,
      },
      pageSize: 20,
      formLabelWidth1: "100px",
      shen_wen: {
        title: "标题",
        certificate: [],
      },
      shen_tan: false,
      fn1: this.commonJs.Debounce(this.get_agent_list),
      extendList: [],
      seachVale: "",
      seachVale1: "",
      loading: false,
      shenValue: "",
      types: 3,
      provinceList: [], //省
      cityList: [], //市
      city_ifShow: false,
      areaList: [], //区
      area_ifShow: false,
      code: {
        province_code: "",
        city_code: "",
      },
      provinceList1: [], //省
      cityList1: [], //市
      city_ifShow1: false,
      form_adderess: {
        provinceValue: "",
        cityValue: "",
        areaValue: "",
      },
      infoItem: {},
      shen_status: "",
      shen_status_list: [
        {
          id: "1",
          name: "审核中",
        },
        {
          id: "2",
          name: "审核成功",
        },
        {
          id: "3",
          name: "审核拒绝",
        },
        {
          id: "4",
          name: "候补中",
        },
        {
          id: "5",
          name: "取消或被降级",
        },
      ],
      type_status: "",
      type_status_list: [
        {
          id: "1",
          name: "市级合伙人",
        },
        {
          id: "2",
          name: "省级合伙人",
        },
        {
          id: "3",
          name: "联创合伙人",
        },
      ],
      time_value: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  watch: {
    // shen_wen.contact_area
    "code.province_code": {
      handler: function (news, olds) {
        console.log("来了");
        console.log(news);
        if (news) {
          this.city_ifShow1 = true;
          this.get_city1(news);
          this.code.city_code = "";
        } else {
          this.city_ifShow1 = false;
          this.code.city_code = "";
        }
      },
    },
    "shen_wen.contact_province": {
      handler: function (news, olds) {
        if (news) {
          this.city_ifShow = true;
          if (this.shen_wen.contact_city) {
          } else {
            this.shen_wen.contact_city = "";
            this.shen_wen.contact_area = "";
            this.area_ifShow = false;
          }

          this.get_city(news);
        } else {
          this.city_ifShow = false;
          this.shen_wen.contact_city = "";
          this.shen_wen.contact_area = "";
          this.area_ifShow = false;
        }
      },
    },

    "shen_wen.contact_city": {
      handler: function (news, olds) {
        if (news) {
          this.area_ifShow = true;
          if (this.shen_wen.contact_area) {
          } else {
            this.shen_wen.contact_area = "";
          }

          this.get_area(news);
        } else {
          this.area_ifShow = false;
        }
      },
    },
  },
  created() {
    this.get_agent_list(); //获取推广列表
    this.height = document.body.clientHeight - 320;
    this.get_province(); //获取省份
    this.get_province1(); //获取省份
  },
  methods: {
    wen(type) {
      // <!--shen_wen.        -->
      if (
        this.shen_wen.bank_card_user == "" ||
        this.shen_wen.bank_card == "" ||
        this.shen_wen.opening_bank == "" ||
        this.shen_wen.contact_province == "" ||
        this.shen_wen.contact_city == "" ||
        this.shen_wen.contact_area == "" ||
        this.shen_wen.contact_address == "" ||
        this.shen_wen.contact_phone == ""
      ) {
        this.$message({
          showClose: true,
          message: "所有内容必填",
          type: "error",
        });
        return;
      }
      if (this.shen_wen.agent_type != 3) {
        if (this.code.province_code == "") {
          this.$message({
            showClose: true,
            message: "所有内容必填",
            type: "error",
          });
          return;
        }
      }
      let data = {
        agent_id: this.infoItem.id,
        // uid:this.infoItem.uid,
        bank_card_user: this.shen_wen.bank_card_user,
        bank_card: this.shen_wen.bank_card,
        opening_bank: this.shen_wen.opening_bank,
        contact_province: this.shen_wen.contact_province,
        contact_city: this.shen_wen.contact_city,
        contact_area: this.shen_wen.contact_area,
        contact_address: this.shen_wen.contact_address,
        contact_phone: this.shen_wen.contact_phone,
        province_code: this.code.province_code,
        city_code: this.code.city_code,
      };
      if (type == 1 || type == 2) {
        if (type == 1) {
          data.state = 2;
        } else if (type == 2) {
          //审核拒绝
          if (this.shenValue == "") {
            this.$message({
              showClose: true,
              message: "拒绝原因必填",
              type: "error",
            });
            return;
          }
          data.state = 3;
          data.reason = this.shenValue;
        }
      } else if (type == 3) {
        //审核同意
        conosle.log("限制区域必填");
        console.log("更换区域");
      } else if (type == 4) {
        //详情编辑
        console.log("详情编辑");
      }

      // let province = this.contact(this.shen_wen.contact_province,this.provinceList,'shen')
      // let city = this.contact(this.shen_wen.contact_city,this.cityList,'shi')
      // let area = this.contact(this.shen_wen.contact_area,this.areaList,'qu')

      console.log(data);
      agent_update(data).then((res) => {
        if (res.data.err_code == 0) {
          this.shen_tan = false;
          if ((this.types = 1)) {
            this.shenValue = "";
            this.$message({
              message: "审核成功",
              type: "success",
            });
          } else {
            this.$message({
              message: "修改身份成功",
              type: "success",
            });
          }

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
    contact(value, list, text) {
      console.log(value);
      console.log(list);
      list.forEach((item) => {
        if (text == "shen") {
          if (item.province_id == value) {
            console.log(item.name);
            return item.name;
          }
        } else if (text == "shi") {
          if (item.city_id == value) {
            return item.name;
          }
        } else if (text == "qu") {
          if (item.area_id == value) {
            return item.name;
          }
        }
      });
      for (let i = 0; i < list.length; i++) {
        if (text == "shen") {
          if (list[i].province_id == value) {
            return list[i].name;
          }
        } else if (text == "shi") {
          if (list[i].city_id == value) {
            return list[i].name;
          }
        } else if (text == "qu") {
          if (list[i].area_id == value) {
            return list[i].name;
          }
        }
      }
    },
    infos(index, item, info) {
      this.types = 3;
      if (info == 2) {
        console.log("被降级");
        this.types = 4;
      }
      this.agent_infos(item, 3);
      this.shen_tan = true;
    },
    shens(index, item) {
      this.types = 1;
      this.shen_tan = true;
      this.agent_infos(item, 1);
    },
    edits(index, item) {
      this.types = 2;
      this.agent_infos(item, 2);
      this.shen_tan = true;
    },
    //编辑省市区
    quEdit(type) {
      console.log("编辑" + type);
    },
    agent_infos(item, type) {
      this.infoItem = item;
      agent_info({
        agent_id: item.id,
      }).then((res) => {
        if (res.data.err_code == 0) {
          this.shen_wen = res.data.err_msg.info;
          if (this.shen_wen.certificate.indexOf(",") != -1) {
            this.shen_wen.certificate = this.shen_wen.certificate.split(",");
          } else {
            this.shen_wen.certificate = [this.shen_wen.certificate];
          }
          if (this.shen_wen.certificate[0]) {
          } else {
            this.shen_wen.certificate = [];
          }
          if (this.shen_wen.contact_city) {
            this.city_ifShow = true;
          }
          if (this.shen_wen.contact_area) {
            this.area_ifShow = true;
          }
          if (type == 1) {
            this.shen_wen.title = item.region + "合伙人申请审核";
            // this.shen_wen.certificate = "http://rcjujiao.oss-cn-hangzhou.aliyuncs.com/image/1640333674718/%E7%BE%8E%E5%A5%B31.jfif"
          }
          // this.shen_wen.contact_province = ""
          console.log(this.shen_wen);

          if (res.data.err_msg.info.city == 0) {
            res.data.err_msg.info.city = "";
          }
          if (res.data.err_msg.info.province == 0) {
            res.data.err_msg.info.province = "";
          }
          this.code = {
            province_code: res.data.err_msg.info.province,
            city_code: res.data.err_msg.info.city,
          };
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
    },

    //获取推广列表
    get_agent_list(index) {
      this.seachVale = "";
      this.seachVale1 = "";
      this.time_value = "";
      this.type_status = "";
      this.shen_status = "";
      this.loading = true;
      let request_form = {
        page: 1,
        page_size: this.pageSize,
      };
      agent_list(request_form)
        .then((res) => {
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
      var time1 = "";
      var time2 = "";
      console.log(this.time_value);
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      this.loading = true;
      agent_list({
        page: page,
        page_size: number,
        user_search: this.seachVale,
        region: this.seachVale1,
        state: this.shen_status,
        agent_type: this.type_status,
        start_time: time1,
        end_time: time2,
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
      if (
        this.seachVale == "" &&
        this.seachVale1 == "" &&
        this.time_value == "" &&
        this.type_status == "" &&
        this.shen_status == ""
      ) {
        this.$message({
          message: "请填写搜索内容",
          type: "warning",
        });
        return;
      }
      var time1 = "";
      var time2 = "";
      console.log(this.time_value);
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      this.loading = true;
      agent_list({
        page: 1,
        page_size: this.pageSize,
        user_search: this.seachVale,
        region: this.seachVale1,
        state: this.shen_status,
        agent_type: this.type_status,
        start_time: time1,
        end_time: time2,
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
    // 获取省
    get_province() {
      let that = this;
      get_province().then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg) {
            for (let i in res.data.err_msg) {
              that.provinceList.push({
                province_id: i,
                name: res.data.err_msg[i],
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
    // 获取省
    get_province1() {
      let that = this;
      get_province1().then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg.list.length > 0) {
            res.data.err_msg.list.forEach((item) => {
              that.provinceList1.push({
                province_id: item.code,
                name: item.name,
              });
            });
            console.log(that.provinceList1);
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

    // 获取市
    get_city(province_id) {
      let that = this;
      this.cityList = [];
      get_city({ province_id: province_id }).then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg) {
            for (let i in res.data.err_msg) {
              that.cityList.push({
                city_id: i,
                name: res.data.err_msg[i],
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
    // 获取市
    get_city1(province_id) {
      let that = this;
      this.cityList1 = [];
      get_city1({ code: province_id }).then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg.list.length > 0) {
            res.data.err_msg.list.forEach((item) => {
              that.cityList1.push({
                city_id: item.code,
                name: item.name,
              });
            });
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
    // 获取区
    get_area(city_id) {
      let that = this;
      this.areaList = [];
      get_area({ city_id: city_id }).then((res) => {
        if (res.data.err_code == 0) {
          if (res.data.err_msg) {
            for (let i in res.data.err_msg) {
              that.areaList.push({
                area_id: i,
                name: res.data.err_msg[i],
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
  },
};
</script>
<style scoped lang="less">
.page {
  position: relative;
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
  .s {
    background: #fff;
    width: 3px;
    height: 20px;
    position: relative;
    display: inline-block;
    top: 3px;
    margin-right: 10px;
  }
}
.box {
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
/deep/ .el-carousel__button {
  background: #000 !important;
  opacity: 0.28;
}
.remarks_box {
  .el-form-item {
    margin: 0;
  }
  .blockBox {
    padding: 0 15px;
    .yiban {
      box-sizing: border-box;
    }
    .yiban.lt {
      padding-right: 50px;
    }
    .yiban.rt {
      padding-left: 50px;
    }
  }
  h2 {
    margin-bottom: 15px;
    margin-top: 20px;
    font-size: 18px;
  }
}
</style>