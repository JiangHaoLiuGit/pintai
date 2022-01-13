<template>
  <div class="page">
    <!-- <div class="flex">
      <div class="item 1"></div>
      <div class="item 2"></div>
      <div class="item 3"></div>
    </div> -->
    <!-- <video
     src=""
      poster="../../assets/image/logo.png"
      controls="controls"
       autoplay="" height="421" width="700" muted="">
        您的浏览器不支持H5播放器
      </video> -->
    <!-- <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsline="false" :options="playerOptions"></video-player> -->
    <!-- <video 
      style="width:300px;height:300px;"
      controls="controls" poster="../../assets/image/logo.png"
      src=""
      >
      
          您的浏览器不支持H5播放器
      </video> -->
    <!-- <video
      style="width: 300px; height: 300px"
      controls="controls"
      poster="../../assets/image/logo.png"
      src="https://vd2.bdstatic.com/mda-kiv2xvcvysxruanr/sc/mda-kiv2xvcvysxruanr.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1631866331-0-0-6c1929f99b5bf5e620ea46ad627b538e&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest="
      id="video"
    >
      您的浏览器不支持H5播放器
    </video> -->
    <div v-if="activeName == 'first'">
      
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="anchor_id"
             @keyup.enter.native="pick_seach"
            type="number"
            placeholder="请输入主播id"
          ></el-input>
          <el-input
            v-model="live_id"
             @keyup.enter.native="pick_seach"
            type="number"
            placeholder="请输入直播间id"
          ></el-input>

          <el-date-picker
            :clearable="false"
            v-model="time_value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-select v-model="state" class="el-inpu" placeholder="请选择直播状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
            v-model="title"
            placeholder="请输入直播标题"
            @keyup.enter.native="pick_seach"
            clearable
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="fn1(1)"
            >刷新</el-button
          >
        </div>
      </div>
      <!-- 主播列表开始 -->
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="extendList"
            border
            :height="height"
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column
              prop="start_time"
              label="预计开始时间"
              width="140"
            ></el-table-column>
            <el-table-column
              prop="real_start_time"
              label="直播开始时间"
              width="140"
            ></el-table-column>
            <el-table-column
              prop="end_time"
              label="直播结束时间"
              width="140"
            ></el-table-column>
            <el-table-column
              prop="nickname"
              label="主播名称"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="anchor_id"
              label="主播id"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="title"
              label="直播间名称"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="id"
              label="直播间id"
              width="80"
            ></el-table-column>
            <el-table-column label="直播状态" width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.status == 0">未开始</div>
                <div v-else-if="scope.row.status == 1">进行中</div>
                <div v-else-if="scope.row.status == 2">已结束</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="view_num"
              label="观看真实人数"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="initial_view"
              label="观看总人数"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="initial_like"
              label="点赞数"
              width="80"
            ></el-table-column>
            <el-table-column label="录制情况" width="80">
              <template slot-scope="scope">
                <div v-if="scope.row.is_transcribe == 1">全部录制</div>
                <div v-else-if="scope.row.is_transcribe == 2">商品录制</div>
                <div v-else-if="scope.row.is_transcribe == 0">未录制</div>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  v-show="scope.row.is_transcribe == 2"
                  @click="handleClick(scope.row, 'third')"
                  >获取商品回放信息</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  v-show="scope.row.is_transcribe == 1"
                  @click="handleClick(scope.row, 'second')"
                  >获取全部回放信息</el-button
                >
                <el-button
                  size="mini"
                  type="warning"
                  @click="handleClick(scope.row, 'fourth')"
                  >查看中奖记录</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  style="margin-top: 20px"
                  @click="kans(scope.row)"
                  >设置基础观看人数</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  style="margin-top: 20px"
                  @click="zans(scope.row)"
                  >设置基础点赞数</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  v-if="scope.row.status == 1"
                  style="margin-top: 20px"
                  @click="end_lives(scope.row)"
                  >关闭直播</el-button
                >

                <el-button size="mini" type="danger" @click="deletes(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- 设置点赞数 -->
      <el-dialog title="设置基础点赞数" :visible.sync="opening_change_ifShow1">
        <el-input
          placeholder="请填写基础点赞数"
          type="number"
          max="999999999"
          maxlength="9"
          v-model="zan"
          clearable
        ></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="opening_change_ifShow1 = false">取 消</el-button>
          <el-button type="primary" @click="submit_saveChanges_level1"
            >保存</el-button
          >
        </div>
      </el-dialog>
      <!-- 设置点赞数 -->
      <el-dialog
        title="设置基础观看人数"
        :visible.sync="opening_change_ifShow2"
      >
        <el-input
          placeholder="请填写基础观看人数"
          v-model="kan"
          max="999999999"
          maxlength="9"
          clearable
        ></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="opening_change_ifShow2 = false">取 消</el-button>
          <el-button type="primary" @click="submit_saveChanges_level2"
            >保存</el-button
          >
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
    <div v-else-if="activeName == 'second'">
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="broadId"
            placeholder="请输入直播间id"
            clearable
             @keyup.enter.native="pick_seach3"
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach3">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="fn2(1)"
            >刷新</el-button
          >
          <el-button
            type="primary"
            @click="back1"
            >返回</el-button
          >
        </div>
      </div>
      <!-- 全部录制列表 -->
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="extendList2"
            border
            style="width: 100%"
          >
            <el-table-column label="序号1" type="index" width="100">
            </el-table-column>
            <el-table-column
              prop="id"
              label="回放列表id"
              width="130"
            ></el-table-column>
            <el-table-column label="录制视频状态" width="120">
              <template slot-scope="scope1">
                <div v-if="scope1.row.status == 0">录制中</div>
                <div v-else-if="scope1.row.status == 1">录制完成</div>
                <div v-else-if="scope1.row.status == 2">录制失败</div>
              </template>
            </el-table-column>
            <el-table-column label="录制视频">
              <template slot-scope="scope">
                <div v-if="scope.row.filesrc">
                  <!-- <video
                    class="video-js vjs-default-skin"
                    style="width: 300px; height: 300px"
                    controls="controls"
                    poster="../../assets/image/logo.png"
                    :src="scope.row.filesrc"
                    id="singleVideo"
                  >
                    您的浏览器不支持H5播放器
                  </video> -->
                  <video
                    id="my-video1"
                    class="video-js vjs-default-skin"
                    controls
                    preload="auto"
                    width="500px"
                  >
                      <source :src="scope.row.filesrc" type="application/x-mpegURL" />
                  </video>
                </div>
                <div v-else>未录制视频</div>
                <!-- <el-image
                  :src="scope.row.filesrc"
                  fit="cover"></el-image> -->
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div v-else-if="activeName == 'third'">
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="broadId"
            placeholder="请输入直播间id"
            clearable
            @keyup.enter.native="pick_seach4"
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach4">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="fn3(1)"
            >刷新</el-button
          >
          <el-button
            type="primary"
            @click="back1"
            >返回</el-button
          >
        </div>
      </div>
      <!-- 请求列表商品录制 -->
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="extendList3"
            border
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="100">
            </el-table-column>
            <el-table-column
              prop="id"
              label="回放列表id"
              width="130"
            ></el-table-column>
            <el-table-column label="录制视频状态" width="120">
              <template slot-scope="scope1">
                <div v-if="scope1.row.status == 0">录制中</div>
                <div v-else-if="scope1.row.status == 1">录制完成</div>
                <div v-else-if="scope1.row.status == 2">录制失败</div>
              </template>
            </el-table-column>
            <el-table-column label="录制视频">
              <template slot-scope="scope">
                <div v-if="scope.row.filesrc">
                  <!-- <video
                    class="video-js vjs-default-skin"
                    style="width: 300px; height: 300px"
                    controls="controls"
                    poster="../../assets/image/logo.png"
                    :src="scope.row.filesrc"
                    id="singleVideo"
                  >
                    您的浏览器不支持H5播放器
                  </video> -->
                  <video
                    id="my-video"
                    class="video-js vjs-default-skin"
                    controls
                    preload="auto"
                    width="500px"
                  >
                      <source :src="scope.row.filesrc" type="application/x-mpegURL" />
                  </video>
                </div>
                <div v-else>未录制视频</div>
                <!-- <el-image
                  :src="scope.row.filesrc"
                  fit="cover"></el-image> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="product_id"
              label="商品id"
              width="130"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="商品名称"
              width="130"
            ></el-table-column>
            <el-table-column label="商品主图">
              <template slot-scope="scope">
                <el-image
                  :src="scope.row.image"
                  fit="cover"></el-image>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div v-else-if="activeName == 'fourth'">
      <div class="seach_copy">
        <div class="seach_select">
          <el-input
            v-model="anchor_id1"
            placeholder="请输入主播id"
            clearable
            @keyup.enter.native="pick_seach1"
          ></el-input>
          <el-input
            v-model="broadId"
            placeholder="请输入直播间id"
            @keyup.enter.native="pick_seach1"
            clearable
          ></el-input>
        </div>
        <div class="button_type">
          <el-button type="primary" @click="pick_seach1">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="fn4(1)"
            >刷新</el-button
          >
          <el-button type="primary" @click="back">返回</el-button>
        </div>
      </div>

      <!-- 直播列表中奖记录 -->
      <el-row :gutter="20" class="goodsindex-list">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="extendList1"
            border
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="100">
            </el-table-column>
            <el-table-column
              prop="id"
              label="中奖记录id"
              width="130"
            ></el-table-column>

            <el-table-column
              prop="prize_name"
              label="奖品名称"
              width="130"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="收货人姓名"
              width="130"
            ></el-table-column>
            <el-table-column
              prop="tel"
              label="收货人电话"
              width="130"
            ></el-table-column>
            <el-table-column label="收货人地址">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.province_name }} {{ scope.row.city_name }}
                  {{ scope.row.area_name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="收货人详细地址"
              width="130"
            ></el-table-column>
            <el-table-column
              prop="create_time"
              label="中奖时间"
              width="130"
            ></el-table-column>
            <el-table-column label="是否接受" width="100">
              <template slot-scope="scope1">
                <div v-if="scope1.row.is_receive == 1">接受</div>
                <div v-else>不接受</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="receive_time"
              label="领取时间"
              width="140"
            ></el-table-column>
            <el-table-column
              prop="nickname"
              label="主播名称"
              width="140"
            ></el-table-column>
            <el-table-column
              prop="title"
              label="直播房间标题"
              width="130"
            ></el-table-column>
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
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import videojs from 'video.js';
import 'videojs-contrib-hls'
import {
  anchor_live_list, //请求列表
  video_live_list, //请求全部录制列表
  playback_video_list, //请求列表商品录制
  win_live_list, //中奖记录
  initial_live_list, //设置基础观看人数
  like_live_list, //设置基础点赞数
  delete_video_live, //删除直播间
  end_live
} from "../../utils/axios";
export default {
  name: 'Video',
  data() {
    return {
      // playerOptions: {
      //   playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
      //   autoplay: false, // 如果true,浏览器准备好时开始回放。
      //   muted: false, // 默认情况下将会消除任何音频。
      //   loop: false, // 导致视频一结束就重新开始。
      //   preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
      //   language: 'zh-CN',
      //   aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
      //   fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      //   sources: [{
      //     type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
      //     src: 'https://vd2.bdstatic.com/mda-kiv2xvcvysxruanr/sc/mda-kiv2xvcvysxruanr.mp4' // url地址
      //   }],
      //   poster: '../../assets/image/logo.png', // 你的封面地址
      //   width: "300px", // 播放器宽度
      //   notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      //   controlBar: {
      //     timeDivider: true,
      //     durationDisplay: true,
      //     remainingTimeDisplay: false,
      //     fullscreenToggle: true // 全屏按钮
      //   }
      // },
      playerOptions: {
        height: 400,
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/m3u8", // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: 'http://1301661021.vod2.myqcloud.com/df04def7vodcq1301661021/bf0b6e605285890806840758798/playlist.m3u8' // url地址
            // require("@/assets/vedio.mp4")
          }
        ],
        poster: "../../assets/image/logo.png", // 你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
      height:"",
      opening_change_ifShow1: false,
      opening_change_ifShow2: false,
      kan: "",
      zan: "",
      broadId: "",
      live_id: "",
      activeName: "first",
      extendList: [], //主播列表
      extendList1: [], //中奖记录
      extendList2: [], //全部录制列表
      extendList3: [], //列表商品录制
      fn1: this.commonJs.Debounce(this.get_agent_list),
      fn2: this.commonJs.Debounce(this.pick_seach1),
      fn3: this.commonJs.Debounce(this.pick_seach3),
      fn4: this.commonJs.Debounce(this.pick_seach4),
      options: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "未开始",
        },
        {
          value: 2,
          label: "已结束",
        },
        {
          value: 3,
          label: "进行中",
        },
      ],
      queryInfo: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      queryInfo1: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
      pageSize:20,
      state: "",
      //申請人姓名
      title: "",
      anchor_id: "",
      live_id:"",
      anchor_id1: "",
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
    };
  },
  created() {
    console.log("测试数据");
    if (this.$route.query.ids) {
      this.anchor_id = this.$route.query.ids;
      this.pick_seach();
    } else {
      this.get_agent_list();
    }
    this.height = document.body.clientHeight - 240
  },
  methods: {
    zans(row) {
      this.live_id = row.id;
      this.opening_change_ifShow1 = true;
    },
    //基础点赞
    submit_saveChanges_level1() {
      if (this.zan == "") {
        this.$message({
          message: "请选择基础点赞人数",
          type: "warning",
        });
      } else {
        like_live_list({
          number: this.zan,
          live_id: this.live_id,
        }).then((res_s) => {
          if (res_s.data.err_code == 0) {
            this.opening_change_ifShow1 = false;
            this.zan = "";
            that.$message({
              message: "设置基础点赞人数成功",
              type: "success",
            });
            that.get_agent_list();
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        });
      }
    },

    kans(row) {
      this.live_id = row.id;
      this.opening_change_ifShow2 = true;
    },
    end_lives(row){
      this.$confirm(
        "此操作将删除" + row.nickname + "主播的直播间<" + row.title +">,是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        end_live({
          live_id: row.id,
        }).then((res_s) => {
          if (res_s.data.err_code == 0) {
            this.$message({
              message: "关闭直播成功",
              type: "success",
            });
            this.get_agent_list();
          } else {
            this.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        });

      });
    },
    //基础观看
    submit_saveChanges_level2() {
      if (this.kan == "") {
        this.$message({
          message: "请选择基础观看人数",
          type: "warning",
        });
      } else {
        initial_live_list({
          number: this.kan,
          live_id: this.live_id,
        }).then((res_s) => {
          if (res_s.data.err_code == 0) {
            this.opening_change_ifShow2 = false;
            this.kan = "";
            this.$message({
              message: "设置基础观看人数成功",
              type: "success",
            });
            this.get_agent_list();
          } else {
            this.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        });
      }
    },

    //tab切换 点击查看主播管理员列表
    handleClick(row, status) {
      //主播id
      this.anchor_id1 = row.anchor_id;
      //直播间id
      this.broadId = row.id;
      this.activeName = status;
      if (status == "second") {
        // console.log("全部录制接口调用");
        this.pick_seach3()
      } else if (status == "third") {
        this.pick_seach4()
        console.log("商品录制接口调用");
      } else if (status == "fourth") {
        this.pick_seach1();
      }
    },
    //删除直播间
    deletes(row) {
      let that = this;
      this.$confirm(
        "此操作将删除" + row.nickname + "主播的直播间,是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        delete_video_live({
          live_id: row.id,
        }).then((res_s) => {
          if (res_s.data.err_code == 0) {
            that.$message({
              message: "删除成功",
              type: "success",
            });
            that.get_agent_list();
          } else {
            that.$message({
              showClose: true,
              message: res_s.data.err_msg,
              type: "error",
            });
          }
        });
      });
    },
    //主页搜索
    pick_seach(index) {
      let that = this;
      if (
        that.anchor_id == "" &&
        that.live_id == "" &&
        that.title == "" &&
        that.state === "" &&
        that.time_value == ""
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
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }
      let request_form = {
        page: 1,
        page_size: 20,
        anchor_id: that.anchor_id,
        live_id:that.live_id,
        title: that.title,
        status: that.state,
        start_time: time1,
        end_time: time2,
      };
      //主页搜索axios
      anchor_live_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.start_time = this.commonJs.timestampToTime(item.start_time);
              item.end_time = this.commonJs.timestampToTime(item.end_time);
              item.real_start_time = this.commonJs.timestampToTime(
                item.real_start_time
              );
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
    //副页搜索
    pick_seach1(index) {
      let that = this;
      if (that.broadId == "" && that.anchor_id1 == "") {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }

      that.loading = true;
      //主页搜索axios
      win_live_list({
        page: 1,
        page_size: 20,
        live_id: that.broadId,
        anchor_id: that.anchor_id1,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
              item.receive_time = this.commonJs.timestampToTime(
                item.receive_time
              );
            });
            this.extendList1 = res.data.err_msg.list;
            this.queryInfo1.pageSize = parseInt(res.data.err_msg.page_size);
            this.queryInfo1.page = parseInt(res.data.err_msg.page);
            this.queryInfo1.total = parseInt(res.data.err_msg.total_number);
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
    back() {
      this.activeName = "first";
      this.broadId = "";
      this.anchor_id1 = "";
    },
    back1() {
      this.activeName = 'first'
      this.broadId = ''
    },
    
    pick_seach3(index) {
      let that = this;
      if (that.broadId == "") {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }
      that.loading = true;
      //全部
      video_live_list({
        live_id: that.broadId,
      })
        .then((res) => {
          console.log(res)
          that.loading = false;
          if (res.data.err_code == 0) {
            this.extendList2 = [res.data.err_msg.info];
            this.$nextTick(()=>{
              setTimeout(() => {
                // let singlePlayer = videojs("singleVideo", {
                //   autoplay: true,//自动播放
                //   controls: true,//控件显示
                //   width: "440",//视频框宽度
                //   height: "264",//视频框高度
                // });
                let ress = res.data.err_msg.info.filesrc
                // if (ress) {
                //   singlePlayer.src({ src: "http://1301661021.vod2.myqcloud.com/df04def7vodcq1301661021/447640bf3701925925430635460/playlist.m3u8", type: "application/x-mpegURL" });
                // }
                //http://1301661021.vod2.myqcloud.com/df04def7vodcq1301661021/1619b4033701925925229043339/playlist.m3u8
                //http://1301661021.vod2.myqcloud.com/df04def7vodcq1301661021/447640bf3701925925430635460/playlist.m3u8

                // videojs(
                //   "my-video",
                //   {
                //       bigPlayButton: false,
                //       textTrackDisplay: false,
                //       posterImage: true,
                //       errorDisplay: false,
                //       controlBar: true
                //   },
                //   function() {
                //       this.play();
                //   }
                // );
                console.log(ress)
                if (ress) {
                  var myPlayer = videojs("my-video1");
                  console.log(myPlayer)
                  myPlayer.src([
                      {
                          type: "application/x-mpegURL",
                          src: ress //CCTV3频道
                      }
                  ]);
                  myPlayer.play();
                }
              }, 300);
            })
              console.log(this.extendList2)
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
    pick_seach4(index) {
      let that = this;
      if (that.broadId == "") {
        that.$message({
          message: "请选择任意一种搜索类型",
          type: "warning",
        });
        return;
      }

      that.loading = true;
      //全部
      playback_video_list({
        live_id: that.broadId,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            this.extendList3 = res.data.err_msg.list;
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

    //主页每页显示条数改变
    handleSizeChange(val) {
      this.get_shop_list_page(1, val);
    },

    //主页当前页
    handleCurrentChange(val) {
      this.get_shop_list_page(val, this.queryInfo.pageSize);
    },

    //主页分页
    get_shop_list_page(page, number) {
      let that = this;
      that.loading = true;
      var time1 = "";
      var time2 = "";
      if (this.time_value != "") {
        time1 = this.commonJs.dataTime(this.time_value[0]);
        time2 = this.commonJs.dataTime(this.time_value[1]);
      }

      anchor_live_list({
        page: page,
        page_size: number,
        anchor_id: that.anchor_id,
        live_id:that.live_id,
        title: that.title,
        state: that.state,
        start_time: time1,
        end_time: time2,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.start_time = this.commonJs.timestampToTime(item.start_time);
              item.end_time = this.commonJs.timestampToTime(item.end_time);
              item.real_start_time = this.commonJs.timestampToTime(
                item.real_start_time
              );
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

    //副页显示条数改变
    handleSizeChange1(val) {
      this.get_shop_list_page1(1, val);
    },

    //副页当前页
    handleCurrentChange1(val) {
      this.get_shop_list_page1(val, this.queryInfo.pageSize);
    },

    //副页分页
    get_shop_list_page1(page, number) {
      let that = this;
      that.loading = true;
      win_live_list({
        page: page,
        page_size: number,
        live_id: that.broadId,
        anchor_id: that.anchor_id1,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.create_time = this.commonJs.timestampToTime(
                item.create_time
              );
              item.receive_time = this.commonJs.timestampToTime(
                item.receive_time
              );
            });
            this.extendList1 = res.data.err_msg.list;
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

    //加载第一页
    get_agent_list(index) {
      this.anchor_id = "";
      this.live_id = '';
      this.title = "";
      this.state = "";
      this.time_value = "";
      let that = this;
      that.loading = true;
      let request_form = {
        page: 1,
        page_size: 20,
      };
      anchor_live_list(request_form)
        .then((res) => {
          that.loading = false;
          if (res.data.err_code == 0) {
            res.data.err_msg.list.forEach((item) => {
              item.start_time = this.commonJs.timestampToTime(item.start_time);
              item.end_time = this.commonJs.timestampToTime(item.end_time);
              item.real_start_time = this.commonJs.timestampToTime(
                item.real_start_time
              );
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
  },
};
</script>

<style scoped lang="less">
.page {
  padding: 15px 15px 0;
}
.seach {
  display: flex;
  /deep/ .el-input {
    width: 200px;
    margin: 0 20px 0 10px;
  }
}
.seach_copy {
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
    span {
      font-size: 22px;
      font-weight: bold;
    }
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
  margin: 5px 10px 0;
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
.video-js .vjs-icon-placeholder {
    width: 80%;
    height: 80%;
    display: block;
  }
  .item1{
    width: 100px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;

  }
  /* .video-player {
    width: 50%;
  } */
</style>
