<template>
  <div id="trackList" style="top:1.3rem;">
    <div id="title" v-if="type != null" v-title data-title="我的订单"></div>
    <div id="title" v-else v-title data-title="运单"></div>
    <div id="showBox">
      <div class="wrapper" id="trackTab">
        <div class="scroller">
          <ul class="clearfix">
            <li  tapmode="" v-for="(item,index) in list" :style="{width : 10 / list.length + 'rem'}" :i="index">
              <p>{{item.name}}<span style="margin-left: 0.1rem" v-if="item.number*1 > 0">({{item.number}})</span></p>
            </li>
          </ul>
        </div>
      </div>
      <div v-for="(item,index) in list" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
        <ul :id="'dataList' + index" class="data-list">
          <li v-for="(items,indexs) in item.prolist" @click="lookTrackMore(items.pkInvoice,index)">
            <h1>订单编号：{{items.vbillno}}</h1>
            <h3 :class="'trackList'+ items.status" v-html="items.status == -1 ? '已驳回' :items.status == 0 ? '新建': items.status == 1 ? '待调度' :items.status == 2 ? '待提货': items.status == 3 ? '待到达': items.status == 4 ? '已到货': items.status == 5 ? '已签收': items.status == 6 ? '已失效' : ''"></h3>
            <div class="proBox">
              <img v-if="items.ifUrgent == 'Y'" class="jinjiOrder" src="../images/jiaji.png">
              <img v-if="items.expFlag == 'Y'" class="yichangOrder" src="../images/yichang.png">
              <p class="startEnd"><span class="startEndSpan">{{items.deliAddr}}<img src="../images/addressImg.png">{{items.arriAddr}}</span><div class="clearBoth"></div></p>
              <div class="proBoxList" v-for="(pro,proIndex) in items.itemDaos">{{items.transType}}/{{pro.goodsName}}/{{pro.num}}件<span v-if="pro.weight*1 > 0">/{{pro.weight*1}}吨</span><span v-if="pro.volume*1 > 0">/{{pro.volume*1}}立方米</span></div>
            </div>
            <h6 class="deliDateTime">{{items.deliDate}} - {{items.arriDate}}</h6>
            <h5 class="remark" v-html="items.memo == '' ? '暂无备注' : items.memo"></h5>
          </li>
        </ul>
      </div>
    </div>
    <footComponent v-if="type == 1"  ref="footcomponent" :idx='1'></footComponent>
  </div>
</template>

<script>
   import "../js/navbarscroll";
   import {androidIos} from "../js/app";
   import {bomb} from "../js/zujian";
   import bridge from '../js/bridge';
   import MeScroll from '../js/mescroll'
   import {iscroll} from '../js/iscroll'
    export default {
        name: "track-list",
       data(){
          return{
             list:[{
                name:"全部",
                number:0,
                prolist:[]
             },{
               name:"待运输",
               number:0,
               prolist:[]
             },{
               name:"运输中",
               number:0,
               prolist:[]
             },{
               name:"已完成",
               number:0,
               prolist:[]
             }],
            tabShow:0,
            type:null,
            ajax1:null,
            settime:null,
          }
       },
        beforeMount:function () {
          var _this = this;
          var type = _this.$route.query.type;
          if(type != undefined) {
            _this.type = type;
          }
        },
       mounted:function () {
         var _this = this;
         sessionStorage.removeItem("weh");
         sessionStorage.removeItem("nowOrderCartype");
         sessionStorage.removeItem("dataStart");
         sessionStorage.removeItem("dataEnd");
         sessionStorage.removeItem("orderPk");
         sessionStorage.removeItem("dispatchPK");
         sessionStorage.removeItem("carPKlistGo");
         sessionStorage.removeItem("driverPk");
         sessionStorage.removeItem("ORDERSCREEN");
         sessionStorage.removeItem("orderType");
         androidIos.judgeIphoneX("trackList",2);
         androidIos.judgeIphoneX("mescroll",1);
         var type = _this.$route.query.type;
         if(type != undefined){
           _this.type = type;
           var json = {
               name:"待运输",
               number:0,
               prolist:[]
             }
           _this.list.splice(1,1);
           _this.list.splice(1,0,json);
         }else{
           _this.list.splice(1,1);
         }
         androidIos.bridge(_this);
         androidIos.noviceguidance(2);
       },
       methods:{
         go:function () {
             var _this = this;
             var trackTap = sessionStorage.getItem("trackListTap");
             if(trackTap != undefined){
               _this.tabShow = trackTap*1;
             }
            $('.wrapper').navbarscroll({defaultSelect:_this.tabShow});
             var curNavIndex = _this.tabShow;//首页0; 奶粉1; 面膜2; 图书3;
             var mescrollArr=new Array(_this.list.length);//4个菜单所对应的4个mescroll对象
             //初始化首页
             mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);

             /*初始化菜单*/
             $("#trackTab li").on("click",function(){
               var i=Number($(this).attr("i"));
               sessionStorage.setItem("trackListTap",i);
               if(curNavIndex!=i) {
                 //更改列表条件
                 //隐藏当前列表和回到顶部按钮
                 $("#mescroll"+curNavIndex).hide();
                 mescrollArr[curNavIndex].hideTopBtn();
                 //显示对应的列表
                 $("#mescroll"+i).show();
                 //取出菜单所对应的mescroll对象,如果未初始化则初始化
                 if(mescrollArr[i]==null){
                   mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
                 }else{
                   //检查是否需要显示回到到顶按钮
                   var curMescroll=mescrollArr[i];
                   var curScrollTop=curMescroll.getScrollTop();
                   if(curScrollTop>=curMescroll.optUp.toTop.offset){
                     curMescroll.showTopBtn();
                   }else{
                     curMescroll.hideTopBtn();
                   }
                 }
                 //更新标记
                 curNavIndex=i;
               }else{
                 $(".mescroll-totop").hide();
               }
             })

             /*创建MeScroll对象*/
             function initMescroll(mescrollId,clearEmptyId){
               //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
               var mescroll = new MeScroll(mescrollId, {
                 //上拉加载的配置项
                 up: {
                   callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                   isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
                   noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                   empty: {
                     icon: require("../images/nojilu.png"),
                     tip: "暂无订单", //提示
                   },
                   clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
                   toTop:{ //配置回到顶部按钮
                     src :require("../images/scrollTop.png"), //默认滚动到1000px显示,可配置offset修改
                     //offset : 1000
                   },
                   lazyLoad: {
                     use: true // 是否开启懒加载,默认false
                   }
                 }
               });
               return mescroll;
             }

             /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
             function getListData(page){
               //联网加载数据
               var dataIndex=curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
               getListDataFromNet(dataIndex, page.num, page.size, function(pageData){
                mescrollArr[dataIndex].endSuccess(pageData.length);
                 setListData(pageData,dataIndex);
               }, function(){
                 //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                 mescrollArr[dataIndex].endErr();
               });
             }
             function setListData(pageData,dataIndex){
               for (var i = 0; i < pageData.length; i++) {
                 _this.list[dataIndex].prolist.push(pageData[i]);
               }
             }
             function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
               //延时一秒,模拟联网
               _this.settime = setTimeout(function () {
                 _this.corner();
                 _this.ajax1 = $.ajax({
                   type: "POST",
                   url: androidIos.ajaxHttp() + "/order/loadInvoice",
                   data:JSON.stringify({
                     page:pageNum,
                     size:pageSize,
                     type:2,
                     state:curNavIndex == 0 && _this.type == null ? 10 : curNavIndex == 0  &&  _this.type != null ? ""  : curNavIndex == 1 && _this.type == null ? 7 : curNavIndex == 1 && _this.type != null ? 16 : curNavIndex == 2  && _this.type == null  ? 8: curNavIndex == 2  && _this.type != null  ? 7 :  curNavIndex == 3  && _this.type != null  ? 8 :"",
                     userCode:sessionStorage.getItem("token"),
                     source:sessionStorage.getItem("source"),
                     today:_this.$route.query.today != undefined ? 1 : 0,
                   }),
                   contentType: "application/json;charset=utf-8",
                   dataType: "json",
                   timeout: 30000,
                   success: function (loadInvoice) {
                     if (loadInvoice.success == "1") {
                       successCallback(loadInvoice.list);
                     }else{
                       androidIos.second(loadInvoice.message);
                       successCallback([]);
                     }
                   },
                   complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                     if (status == 'timeout') { //超时,status还有success,error等值的情况
                       androidIos.second("当前状况下网络状态差，请检查网络！");
                       successCallback([]);
                     } else if (status == "error") {
                       androidIos.errorwife();
                       successCallback([]);
                     }
                   }
                 });
               },100)
             }
           },
         lookTrackMore:function (pk,index) {
            var _this = this;
           androidIos.addPageList();
           _this.$router.push({ path: '/orderLogisticsMore3',query:{pk:pk,type:1}});
         },
         corner:function () {
           var _this = this;
           var list0 = 0 ,list1 = 0 , list2 = 0,list3 = 0 ;
           var ajax1 = $.ajax({
             type: "POST",
             url: androidIos.ajaxHttp() + "/order/getOrderCount",
             data:JSON.stringify({
               userCode:sessionStorage.getItem("token"),
               source:sessionStorage.getItem("source"),
             }),
             contentType: "application/json;charset=utf-8",
             dataType: "json",
             timeout: 30000,
             success: function (carrOrderListHeaderIcon) {
               if (carrOrderListHeaderIcon.success == "1") {
                 if(_this.type == null){
                   list0 =  carrOrderListHeaderIcon.onTheWayCount*1 +carrOrderListHeaderIcon.completedCount*1;
                   list1 = carrOrderListHeaderIcon.onTheWayCount*1;
                   list2 = carrOrderListHeaderIcon.completedCount*1;
                 }else{
                   list0 = carrOrderListHeaderIcon.myTotalCount*1;
                   list1 =  carrOrderListHeaderIcon.waitTransport*1;
                   list2 = carrOrderListHeaderIcon.onTheWayCount*1;
                   list3 = carrOrderListHeaderIcon.completedCount*1;
                 }
               }else{
                 androidIos.second(carrOrderListHeaderIcon.message);
               }
             },
             complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
               if (status == 'timeout') { //超时,status还有success,error等值的情况
                 androidIos.second("当前状况下网络状态差，请检查网络！");
               } else if (status == "error") {
                 androidIos.errorwife();
               }
             }
           });
           Promise.all([ajax1]).then(function(values) {
             if(_this.type == null){
               _this.list[0].number = list0;
               _this.list[1].number = list1;
               _this.list[2].number = list2;
             }else{
               _this.list[0].number = list0;
               _this.list[1].number = list1;
               _this.list[2].number = list2;
               _this.list[3].number = list3;
             }
           })
         },
       },
      beforeDestroy:function () {
        var _this = this;
        var body = document.getElementsByTagName("body")[0];
        var listDom=document.getElementsByClassName("mescroll-totop")[0];
        if(listDom != null){
          body.removeChild(listDom);
        }
        clearTimeout(_this.settime);
        if(_this.ajax1 != null){
          _this.ajax1.abort();
        }
      },
      destroy:function () {
        var _this = this;
        var body = document.getElementsByTagName("body")[0];
        var listDom=document.getElementsByClassName("mescroll-totop")[0];
        if(listDom != null){
          body.removeChild(listDom);
        }
        clearTimeout(_this.settime);
        if(_this.ajax1 != null){
          _this.ajax1.abort();
        }
      }
    }
</script>
<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #trackList .hide{
    display: none;
  }
</style>
<style scoped>
  #trackList{
     position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  .mescroll{
    position: absolute;
    top:1.2rem;
    bottom:1.3rem;
    height: auto!important;
  }
  #showBox{
    position: absolute;
    top:0;
    bottom: 0rem;
    height: auto;
    width:100%;
  }
  .wrapper {
    position:relative;
    height: 1rem;
    width: 100%;
    margin:0 auto;
    background:white;
    border-top: 2px solid #E5E5E5;
  }
  .wrapper .scroller {
    position:absolute;
  }
  .wrapper .scroller li {
    height: 1rem;
    color:#373737;
    float: left;
    line-height: 1rem;
    font-size: .4rem;
    text-align: center;
    width:3.333333rem;
  }
  .wrapper .scroller li p{
    color:#999999;
    display:block;
    font-size: 0.35rem;
    margin:0 auto;
    width: fit-content;
    text-align: center;
    white-space: pre;
    padding: 0 0.2rem;
  }
  .wrapper .scroller li p span{
    color:#999;
    font-size: 0.3125rem;
  }
  .wrapper .scroller li.cur p{
    color:#1D68A8;
    border-bottom: 1px solid #1D68A8;
  }
  .wrapper .scroller li.cur p span{
    color:#1D68A8;
  }
.data-list{
  width:100%;
}
  .data-list li{
    width:94%;
    margin: 0.2rem auto 0.08rem;
    background: white;
    border-radius:0.16rem;
    padding:0.1rem 0 0.21rem 0;
    position: relative;
  }
  .data-list li h6{
    font-size:0.375rem ;
    color:#999;
    margin-left: 0.4rem;
    margin-bottom: 0.01rem;
    padding-left: 0.5rem;
    background-repeat: no-repeat;
    background-size:0.375rem 0.375rem ;
    background-position: 0 50%;
  }
  .data-list li h5{
    font-size:0.375rem ;
    color:#999;
    margin-left: 0.4rem;
    margin-bottom: 0.01rem;
    padding-left: 0.5rem;
    background-repeat: no-repeat;
    background-size:0.375rem 0.375rem ;
    background-position: 0 0.13rem;
    margin-top: 0.2rem;
    width:8.2rem;
    min-height: 0.5rem;
    background-image: url("../images/tranremark.png");
  }
  .data-list li h1{
    font-size:0.33rem ;
    color:#666;
    padding-top: 0.2rem;
    margin-left: 0.5rem;
    padding-bottom: 0.1rem;
  }
  .data-list li h3{
    position: absolute;
    width:1.5rem;
    font-size: 0.375rem;
    right:0;
    top:0.3rem;
    line-height: 0.48rem;
    background-size: 0.48rem;
    background-repeat: no-repeat;
    background-position: 0 50%;
    padding-left: 0.6rem;
  }
  .trackList6{
    background-image: url("../images/trackList4.png");
    color:#4681B4;
  }
  .trackList5{
    background-image: url("../images/trackList5.png");
    color:#C3D94D;
  }
  .trackList4{
    background-image: url("../images/trackList3.png");
    color:#38A2FF;
  }
  .trackList3{
    background-image: url("../images/trackList7.png");
    color:#38A2FF;
  }
  .trackList2{
    background-image: url("../images/trackList6.png");
    color:#49C661;
  }
  .trackList1{
    background-image: url("../images/trackList2.png");
    color:#557DE0;
  }
  .trackList0{
    background-image: url("../images/trackList0.png");
    color:#3094E3;
  }
  .trackList-1{
    background-image: url("../images/trackList-1.png");
    color:#719CED;
  }
  .deliDateTime{
    background-image: url("../images/time.png");
  }
  .proBox{
    width:85%;
    padding: 0.3rem 0.45rem;
    margin: 0.2rem auto;
    border-radius: 0.1rem;
    box-shadow: 0 0 0.13rem #e2e2e2;
    border: 1px solid white;
    position: relative;
  }
  .startEndSpan{
    float: left;
    font-size: 0.44rem;
    font-weight:bold;
    line-height: 0.56rem;
    color:#333;
    margin-bottom: 0.2rem;

  }
  .startEnd img{
    display: inline-block;
    margin:0rem 0.3rem 0.13rem 0.3rem;
    width:0.45rem;
  }
  .proBoxList{
     color:#999;
    font-size:0.35rem ;
  }
  .proBoxList span{
    color:#999;
    font-size:0.35rem ;
  }
  .jinjiOrder{
    position: absolute;
    font-size: 0.3125rem;
    right:0rem;
    top:0rem;
    width:0.75rem;
  }
  .yichangOrder{
    position: absolute;
    font-size: 0.3125rem;
    right:0.44rem;
    top:0.65rem;
    width:0.667rem;
  }
</style>
