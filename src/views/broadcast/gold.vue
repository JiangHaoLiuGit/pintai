<template>
  <div class="page">
    
    <div class="item clearfix">
      <h4><span class="strong">*</span>椒点充值档位</h4>
      <span>基础比例按照1元充值</span>
      <input class="input" type="number" placeholder="数字" v-model="input1" oninput="if(value.length>3)value=value.slice(0,3)"/>
      <span>椒点</span>
    </div>
    <div class="item clearfix">
      <h4><span class="strong">*</span>椒点兑换比例</h4>
      <input class="input" type="number" placeholder="数字" v-model="input2" oninput="if(value.length>3)value=value.slice(0,3)"/>
      <span>椒点兑换</span>
      <input class="input" type="number" placeholder="数字" v-model="input3" oninput="if(value.length>3)value=value.slice(0,3)"/>
    </div>
    <div class="item clearfix">
      <h4><span class="strong">*</span>主播打赏分成比例</h4>
      <input class="input" type="number" placeholder="数字" v-model="input4" oninput="if(value.length>2)value=value.slice(0,2)"/>
      <span>打赏100 椒点的礼物，主播账号增加{{input4}}椒点</span>
    </div>
    <div class="item clearfix">
      <h4>礼物设置</h4>
      <el-button type="primary" @click="add" size="small" class="button">
        增加
      </el-button>
      
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
          <el-table-column
            label="展示类型"
            width="180"
            
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.type" class="el-inpu" placeholder="请选择展示类型">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
            </el-select>
            </template>
          </el-table-column>

          <el-table-column
            label="礼物包图片"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <div class="itemImg" @click="beforeUpload(scope.$index)">
                <div class="itemDiv">
                  <el-upload
                  class="upload-demo"
                  action=""
                  :http-request="img_upload1"
                  :show-file-list = "false"
                  list-type="picture">
                  <el-button slot="trigger" class="btn" size="small" ></el-button>
                  </el-upload>
                </div>
                <el-image
                class="img"
                :src="scope.row.image"
                fit="cover">
                  <div slot="error" class="image-slot imgSlot" style="width:100px;height:100px;text-align:center;line-height: 114px;">
                    <i class="el-icon-plus" style="font-size: 38px;"></i>
                  </div>
                </el-image>
                <span class="deleSpan" v-show="scope.row.image != ''" @click="scope.row.image = ''">
                  <i class="el-icon-delete icon"></i>
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="评论区展示图"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <div class="itemImg" @click="beforeUpload(scope.$index)">
                <div class="itemDiv">
                  <el-upload
                  class="upload-demo"
                  action=""
                  :http-request="img_upload2"
                  :show-file-list = "false"
                  list-type="picture">
                  <el-button slot="trigger" class="btn" size="small" ></el-button>
                  </el-upload>
                </div>
                <el-image
                class="img"
                :src="scope.row.comment_image"
                fit="cover">
                  <div slot="error" class="image-slot imgSlot" style="width:100px;height:100px;text-align:center;line-height: 114px;">
                    <i class="el-icon-plus" style="font-size: 38px;"></i>
                  </div>
                </el-image>
                <span class="deleSpan" v-show="scope.row.comment_image != ''" @click="scope.row.comment_image = ''">
                  <i class="el-icon-delete icon"></i>
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="中心展示文件"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <div class="itemImg" @click="beforeUpload(scope.$index)">
                <div class="itemDiv">
                  <el-upload
                  class="upload-demo"
                  action=""
                  :http-request="img_upload3"
                  :show-file-list = "false"
                  list-type="picture">
                  <el-button slot="trigger" class="btn" size="small" ></el-button>
                  </el-upload>
                </div>
                <div v-if="scope.row.center_image != '' && scope.row.center_image.slice(scope.row.center_image.length-4) == 'svga'">
                  <div class="image-slot imgSlot" style="width:100px;height:100px;text-align:center;line-height: 114px;">
                    <i class="el-icon-plus" style="font-size: 38px;"></i>
                  </div>
                  <div v-show="isShow" :id="'demoCanvas' + scope.$index" class="svga" ref="canvas"></div>
                </div>
                <div v-else>
                  <el-image
                  class="img"
                  :src="scope.row.center_image"
                  fit="cover">
                    <div slot="error" class="image-slot imgSlot" style="width:100px;height:100px;text-align:center;line-height: 114px;">
                      <i class="el-icon-plus" style="font-size: 38px;"></i>
                    </div>
                  </el-image>
                </div>
                <span class="deleSpan" v-show="scope.row.center_image != ''" @click="scope.row.center_image = ''">
                  <i class="el-icon-delete icon"></i>
                </span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column
            label="名称"
            width="180"
          >
            <template slot-scope="scope">
              <el-input
                placeholder="名称"
                v-model="scope.row.name"
                >
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="价格"
            width="250"
          >
            <template slot-scope="scope">
              <el-input
                placeholder="价格"
                v-model="scope.row.gold_coin"
                type="number"
                max="999"
                style="width:75%"
                >
              </el-input>
              椒点
            </template>
          </el-table-column>
           <el-table-column
            label="排序"
            width="180"
          >
            <template slot-scope="scope">
              <el-input
                placeholder="排序"
                v-model="scope.row.sort"
                type="number"
                >
              </el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="deletes(scope.$index,scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-button type="primary" size="big" class="btn1" @click="handleNext()">保存</el-button>
      
  </div>
</template>

<script>
import SVGA from 'svgaplayerweb'
import {
  upload_img,
  gift_config,
  post_config
} from "../../utils/axios";
export default {
  data() {
    return {
      input1:'',
      input2:'',
      input3:'',
      input4:'',
      options: [
        {
          value: "评论区",
          label: "评论区",
        },
        {
          value: "中心gif",
          label: "中心gif",
        },
        {
          value: "中心svga",
          label: "中心svga",
        }
      ],
      loading:false,
      extendList:[
        {
          type:"评论区",
          image:"",
          comment_image:"",
          center_image:"",
          name:"",
          gold_coin:"",
          sort:"1",
        }
      ],
      index:"",
      other_img_upload_err:false,
      isShow:false,
      height:"",
    };
  },
  created() {
   this.height = document.body.clientHeight - 380
  },
  mounted(){
    this.creat()
    // var player = new SVGA.Player("#svga3");
    // var parser = new SVGA.Parser("#svga3");
    // parser.load(arrss[3], function(videoItem) {
    //     player.setVideoItem(videoItem);
    //     player.startAnimation();
    // });
    // var player1 = new SVGA.Player("#svga4");
    // var parser1 = new SVGA.Parser("#svga4");
    // parser1.load(arrss[2], function(videoItem) {
    //   player.setVideoItem(videoItem);
    //     player1.setVideoItem(videoItem);
    //     player1.startAnimation();
    // });
  },
  methods: {
    creat(){
      gift_config({

      }).then((res) => {
        console.log(res);
        if (res.data.err_code == 0) {
            this.extendList = res.data.err_msg.info.gift_list
            this.input1 = res.data.err_msg.info.dh_ratio.recharge_coin
            this.input2 = res.data.err_msg.info.dh_ratio.use_gold_coin
            this.input3 = res.data.err_msg.info.dh_ratio.get_money
            this.input4 = res.data.err_msg.info.dh_ratio.reward_ratio
            this.isShow = true
            let that = this
            for(let i = 0 ; i < that.extendList.length ; i ++){
              if(that.extendList[i].center_image != '' && that.extendList[i].center_image.slice(that.extendList[i].center_image.length-4) == 'svga'){
                  setTimeout(()=>{
                    let id = "#demoCanvas" + i
                    console.log(id)
                    var player = new SVGA.Player(id);
                    var parser = new SVGA.Parser(id);
                    parser.load(that.extendList[i].center_image, function(videoItem) {
                        player.setVideoItem(videoItem);
                        player.startAnimation();
                    });
                  },(i+1)*100)
                  
              }
            }
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
    handleNext(){
      if(this.input1 == '' || this.input2 == '' || this.input3 == '' || this.input4 == '') {
        this.$message({
          message: '上面的三项必填',
          type: 'warning'
        });
        return
      }
      let arr = this.extendList
      let newArr = []
      arr.forEach((item) => {
        var arrs = {
          name:item.name,
          type:item.type,
          gold_coin:item.gold_coin,
          sort:item.sort,
          image:item.image,
          comment_image:item.comment_image,
          center_image:item.center_image
        }
        newArr.push(arrs)
      })
      console.log(newArr)
      newArr = JSON.stringify(newArr)
      post_config({
        recharge_coin:this.input1,
        reward_ratio:this.input4,
        use_gold_coin:this.input2,
        get_money:this.input3,
        gift:newArr
      }).then((res_s) => {
        if (res_s.data.err_code == 0) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.creat()
        } else {
          this.$message({
            showClose: true,
            message: res_s.data.err_msg,
            type: "error",
          });
        }
      })
    },
   files(id,me){
     console.log(id)
     console.log(me)
   },
    add(){
      let sort = parseInt(this.extendList[this.extendList.length-1].sort)
      let obj = {
        type:"评论区",
        image:"",
        comment_image:"",
        center_image:"",
        name:"",
        gold_coin:"",
        sort:sort+1,
      }
      this.extendList.push(obj)
    },
    deletes(id,row){
      console.log("删掉")
      if(this.extendList.length > 1){
        this.extendList.splice(id,1)
      }else{
        this.$message({
          showClose: true,
          message: "都就剩一条了.删个屁啊",
          type: 'error'
        });
      }
      
    },
    beforeUpload(a){
      console.log(a)
      this.index = a
    },
    //上传图片
    img_upload1(item) {
      console.log(item)
      let that = this
      //这个if是判断图片格式的if
      if (this.other_img_upload_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
                this.extendList[this.index].image = res.data.err_msg.url
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
      for(var i = 0 ; i < 5 ; i++){
        console.log(i)
      }
      for(let i = 0 ; i < 5 ; i++){
        console.log(i)
      }
    },
    //上传图片
    img_upload2(item) {
      console.log(item)
      let that = this
      //这个if是判断图片格式的if
      if (this.other_img_upload_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            console.log(this.index)
            if (res.data.err_code == 0) {
                this.extendList[this.index].comment_image = res.data.err_msg.url
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
    //上传图片
    img_upload3(item) {
      console.log(item)
      //这个if是判断图片格式的if
      if (this.other_img_upload_err == false) {
        let fd = new FormData()
        fd.append('file', item.file)
        upload_img(
          fd
        )
          .then((res) => {
            console.log(res);
            if (res.data.err_code == 0) {
                this.extendList[this.index].center_image = res.data.err_msg.url
                if(res.data.err_msg.url.slice(res.data.err_msg.url.length - 4) == "svga"){
                  setTimeout(()=>{
                    let id = "#demoCanvas" + this.index
                    var player = new SVGA.Player(id);
                    var parser = new SVGA.Parser(id);
                    parser.load(this.extendList[this.index].center_image, function(videoItem) {
                        player.setVideoItem(videoItem);
                        player.startAnimation();
                    });
                  },(i+1)*100)
                }
            } else {
              this.$message({
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
  }
};
</script>

<style scoped lang="less">

.btn1{
  width: 100px;
  margin: 30px auto 10px;
  display: block;

}

.svga{
  position: absolute;
  left: 0;
    top: 0;
    z-index: 9;
    width: @width;
    height: @height;
}
.file{
  opacity: 0;
}
.svgas{
  width: @width;
  height: @height;
  display: block;
}
@width:100px;
@height:100px!important;
.itemImg{
  width: @width;
  height: @height;
  position: relative;
  margin: 0 auto;
  .itemDiv{
    position: absolute;
    left: 0;
    top: 0;
    
    width: @width;
    height: @height;
    z-index: 10;
    background: transparent;
    .upload-demo{
      width: @width;
      height: @height;
      .btn{
        width: @width;
        height: @height;
        background: transparent;
      }
    }
  }
  .img{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: @width;
    height: @height;
    
  }
  .deleSpan{
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 30rpx;
    display: block;
    border-radius: 50%;
    background: #c3c3c3;
    text-align: center;
    line-height: 30px;
    z-index: 20;
    cursor: pointer;
    .icon{
      font-size: 15px;
      color: #000;
    }
  }
}

@padding:10px;
.page {
  padding: 15px 15px 0;
}
.item{
  margin: 10px 0;
  h4{
    width: 150px;
    margin: 0;
  }
  >*{
    float:left;
    line-height: 40px;
  }
  .input{
    padding: 0 @padding*0.8;
    width: 50px;
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    margin: 0 10px;
    -moz-appearance: textfield;
  }
  .input::-webkit-outer-spin-button,
  .input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
  .button{
    margin-top: 7px;
    line-height: 9px;
  }
}
// .el-row .cell{
//   text-align: center!important;
// }

</style>
