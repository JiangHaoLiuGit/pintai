# power
vue后台管理系统模板
见文章: https://juejin.im/post/5e670edde51d4527110a9b40
## 预览地址: 
http://cgq666.gitee.io/admin-vue
## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```
edg ad
fpx 上单
rng 
## Excel 导出
```javascript
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [  // Excel表头
           '姓名',
           '电话'
        ]
        const dataVal = [  // 对应的数据数组的字段名
          'username',
          'phone'
        ]
        excel.export_json_to_excel2(tHeader, '这里是需要导入的数据', dataVal, '导出后的文件名称')
```
## SVG
### 安装
```bash
npm i -D vue-svg-loader vue-template-compiler
```
### 修改配置
```javascript
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
 
    svgRule.uses.clear();
 
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
}
```
### 使用
```javascript
<script>
import daiban from '@/assets/icon/daiban.svg'
export default {
    components:{
        daiban
    }
}
</script>
```
### 修该颜色
```css
// 删除SVG文件中的 fill 
.index-head-centent-right-list-icon-is{
    color: #F515EA !important;
    width: 20px;
    height: 22px;
    fill: currentColor;   //重点
}
```

```axios
add_chat_record({
        
      }).then((res) => {
        if (res.data.err_code == 0) {
          //this.XX = res.data.err_msg.list
        } else {
          this.$message({
            showClose: true,
            message: res.data.err_msg,
            type: "error",
          });
        }
      });
```
<!-- 
首先:刚认识的时候你一直给她汇钱,她处于良心的驱使下,对你热情,让你感觉付出都是值得的,但你一认真了,说了不该说的话,比如,你是我初恋呀,除了命我都可以给你,
这时候她感受到鱼饵上钩了.开始对你忽冷忽热了.缺钱的时候找你,说到借钱
说这个月要早点回去,和我借6000给爸妈买点衣服,回家再买点七七八八的东西,然后过几天到了约定借钱的日子,开始对你不耐烦了,怎么还不给钱,最后说着急要这6000,要给客户拿过去消费,
这点我俩意见产生分歧,她态度不是很好,感觉这女孩脾气很差,非常差,你可以回头听听她说话的语气,不是说这6000要回去花吗?自从发生了这件事,慢慢的我开始怀疑她喜欢说谎,说话不着调,从以下几方面可以看出来
1.第一次认识三个小时就说信用卡要逾期,和我借了4000,很可疑?(给我看了一张信用卡还款日将至的照片说要信用卡逾期了,综上所述刚谈恋爱说信用卡逾期这套路很老,但是你却上当了,唉,我也不知道说你什么好.
刚认识几小时,你知道人家00后,还挺主动的,你就上钩了.你这是太好色了,活该上当,不值得可怜,还口口声声戒色.戒到什么程度你心里清楚)(4000)
2.认识第三天,说给客服打电话,1.1w的信用卡咨询注销的事情.卡已经注销了,然后要还1.1w,如果不还就算逾期,主要对征信不好?你都没有还钱,人家凭什么给你注销?把我耍的团团转,我承认我智商当时没在线,
如果当初冷静下来,就不会被她戏耍,(15000)
3.就是上面说的6000,这加起来就是2.1w了.综上所述,这借6000的时候你也是被戏耍的团团转,通过这件事你就应该看出来了她,这个女孩的人品,当初借钱是要回家里用的,现在借钱是要给客户过生日的,
(客户男的女的,你不知道吧,相信你问你也问不出来这是男的女的,她这种职业就注定她的人际关系很乱,万一她交往的客户大部分都是男性呢,这女孩性格水性杨花呢,你承受的起吗?刘江浩?)其实分析到这里,这女孩
就根本不适合你(21000)
4.12月22日主动找你你聊起了家里找你要5000块钱,你爷爷住院的事,她安慰完了你,说要借3000,她说回去给爷爷奶奶买东西,上次是说给爸妈买东西,表哥结婚还要钱,我说我给不了她,我这次死心了,最后晚上12点你
问她借到没有,她说没有,最后你还是给他了3000,而且这3000你是取出的三个月公积金给她的(24000)
5.1月7日,说她爸住院了.花了6000,然后双方产生了写分歧,小吵了一会儿,坚定爸住院了没有骗我(这个我猜应该是没骗我的),自己身上没钱了.想申请5000额度信用卡,然后说凑整,借了6000
说了三遍最后一次找我借钱了.(30000)
6.1月17日她说要花钱,理由我问了,她不想说,说她想说的时候会跟我讲,想要借6000,最后我追问了半天,说要给爸过生日,还要给爸妈买衣服,要6000(我感觉这理由有点牵强),我也抱怨了半天我没钱了,我的贷款已经很多
这次沟通了很长时间,但最后我只给了3000,她说这是最后一次,我也表明这是最后一次借她钱,(33000)
7.2月8日说表哥结婚需要一千,还有来杭州的车费,然后我主动说2000够吗,然后我就转账了(35000)
8.2月21日说自己腿受伤了.然后给我看了视频和图片,然后说没钱了,要不是上一次我给的2000她都没钱看病,现在身上又没钱了.
 -->

// this.$message({
    //     message: '停用成功',
    //     type: 'success'
    // });
