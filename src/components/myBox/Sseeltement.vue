<template>
  <div id="Sseeltement" style="top:0rem;">
    <div id="title"  v-title data-title="结算中心"></div>
    <div id="showBox">
      <div class="wrapper" id="trackTab">
        <div class="carTitleback" @touchend="goback()" ></div>
        <div class="scroller">
          <ul class="clearfix">
            <li  tapmode="" :class="index == tabShow ? 'cur' : ''" v-for="(item,index) in list" :style="{width : 4.2 / list.length + 'rem'}" :i="index">
              <p>{{item.name}}<span style="margin-left: 0.1rem" v-if="item.number*1 > 0">({{item.number}})</span></p>
            </li>
          </ul>
        </div>
        <div id="floatRight">
          <div class="lianxikefu" @click="telphone('021-50929122')">
          </div>
        </div>
      </div>
      <div v-for="(item,index) in list" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
        <ul :id="'dataList' + index" class="data-list">
          <li v-for="(items,indexs) in item.prolist" @click.stop="lookTrackMore(items.pkInvoice,index)">
            <h1>订单编号：{{items.orderNo}}</h1>
            <h3 v-html="tabShow == 0 ? '待付款' : '已付款'"></h3>
            <div class="proBox">
              <div class="proBoxList" >{{items.type}}/{{items.goods}}/{{items.num}}件<span v-if="items.weight*1 > 0" v-html="items.weight / 1000 < 1 ? '/' + items.weight + '千克' :  '/' + items.weight / 1000 + '吨'"></span><span v-if="items.volume*1 > 0">/{{items.volume*1}}立方米</span></div>
              <div class="lookMorePrice" @click.stop="items.lookMore = !items.lookMore" v-if="items.costs.length > 0">
                费用明细
                <img src="../../images/icon-return1.png" :class="items.lookMore ? 'xuanzhuan' : ''">
              </div>
              <div class="tranPrice">
                运输费用<span><span>￥</span>500</span>
              </div>
              <div class="otherPrice" v-if="items.lookMore">
                <label v-for="price in items.costs">空时费 <span>¥100</span></label>
                <div class="clearBoth"></div>
              </div>
            </div>
            <div class="button">
              <p>合计 <span><span>￥</span>{{items.zongmoney}}</span></p>
              <button class="zhifu" v-if="tabShow == 0" @click.stop="zhifu(items.orderNo,items.zongmoney)">支付</button>
              <button v-if="tabShow == 1" @click.stop="kaipiao(items.orderNo,items.zongmoney)">申请开票</button>
              <button v-if="tabShow == 0" @click.stop="again(items.pk)">再来一单</button>
              <div class="clearBoth"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import "../../js/navbarscroll";
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  export default {
    name: "Sseeltement",
    data(){
      return{
        list:[{
          name:"待付款",
          number:0,
          prolist:[]
        },{
          name:"已付款",
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
      androidIos.judgeIphoneX("Sseeltement",2);
      androidIos.bridge(_this);
    },
    methods:{
      zhifu:function (pk,money) {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/money',query:{pk:pk,money:money}});
      },
      kaipiao:function (pk,money) {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/invoice',query:{pk:pk,money:money}});
      },
      again:function (pk) {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/newOrder',query:{pk:pk,type:2}});
      },
      telphone:function(tel){
        androidIos.telCall(tel);
      },
      goback:function () {
        var _this = this;
        androidIos.gobackFrom(_this);
      },
      go:function () {
        var _this = this;
        var trackTap = sessionStorage.getItem("SseeltementListTap");
        if(trackTap != undefined){
          _this.tabShow = trackTap*1;
        }
        var curNavIndex = _this.tabShow;//首页0; 奶粉1; 面膜2; 图书3;
        var mescrollArr=new Array(_this.list.length);//4个菜单所对应的4个mescroll对象
        //初始化首页
        mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);

        /*初始化菜单*/
        $("#trackTab li").on("click",function(){
          var i=Number($(this).attr("i"));
          _this.tabShow = i;
          sessionStorage.setItem("SseeltementListTap",i);
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
                icon: require("../../images/nojilu.png"),
                tip: "暂无订单", //提示
              },
              clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
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
            _this.ajax1 = $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/pay/payList",
              data:JSON.stringify({
                page:pageNum,
                size:pageSize,
                type:curNavIndex + 1,
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (loadInvoice) {
                if (loadInvoice.success == "1") {
                  for(var i = 0 ; i < loadInvoice.list.length ; i++){
                    loadInvoice.list[i].lookMore = false;
                    loadInvoice.list[i].zongmoney = 2000;
                  }
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
      lookTrackMore:function (pk) {
      /*  var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/orderLogisticsMore3',query:{pk:pk,type:2}});*/
      },
    },
    beforeDestroy:function () {
      var _this = this;
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    },
    destroy:function () {
      var _this = this;
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    }
  }
</script>
<style>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #Sseeltement .hide{
    display: none;
  }
</style>
<style scoped>
  .carTitleback{
    position: absolute;
    left:0;
    top:0;
    bottom: 0;
    height: auto;
    width: 1.5rem;
    background-image: url("../../images/titlejian.png");
    background-position: 35% 50%;
    background-repeat: no-repeat;
    background-size: 0.2rem 0.3714rem;
  }
  #Sseeltement{
    position:absolute;
    top:0rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  .mescroll{
    position: absolute;
    top:1.3rem;
    bottom:0rem;
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
    height: 1.3rem;
    width: 100%;
    margin:0 auto;
    background:white;
    border-top: 1px solid white;
  }
  .wrapper .scroller {
    width:4.2rem;
    border: 1px solid #1D68A8;
    line-height: 0.67rem;
    margin:0.315rem auto ;
    border-radius: 0.335rem;
    overflow: hidden;
  }
  .wrapper .scroller li {
    color:#373737;
    float: left;
    line-height: 0.67rem;
    font-size: .4rem;
    text-align: center;
    overflow: hidden;
  }
  .wrapper .scroller li p{
    color:#1D68A8;
    display:block;
    font-size: 0.35rem;
    margin:0 auto;
  }
  .wrapper .scroller li p span{
    color:#999;
    font-size: 0.3125rem;
  }
  .wrapper .scroller li.cur p{
    color:white;
    background: #1a6bac;
  }
  .wrapper .scroller li.cur p span{
    color:#1D68A8;
  }
  .data-list{
    width:100%;
  }
  .data-list li{
    width:91%;
    margin: 0.26rem auto 0.08rem;
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
    background-image: url("../../images/tranremark.png");
  }
  .data-list li h1{
    font-size:0.375rem ;
    color:#333;
    padding-top: 0.2rem;
    margin-left: 0.5rem;
    padding-bottom: 0.1rem;
  }
  .data-list li h3{
    position: absolute;
    width:1.4rem;
    font-size: 0.32rem;
    color:#1a6bac;
    right:0;
    top:0.36rem;
    line-height: 0.48rem;
    background-size: 0.48rem;
    background-repeat: no-repeat;
    background-position: 0 50%;
    padding-left: 0.6rem;
  }
  .deliDateTime{
    background-image: url("../../images/time.png");
  }
  .proBox{
    width:8.26rem;
    margin: 0.2rem auto;
    padding: 0.26rem 0.42rem;
    border-top: 1px solid #F2F2F2;
    border-bottom: 1px solid #F2F2F2;
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
    width:85%;
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
  #floatRight{
    position: absolute;
    right:0.1rem;
    top:0rem;
  }
  .lianxikefu{
    background-image: url("../../images/trackMore2kefu.png");
    background-repeat: no-repeat;
    background-size:0.45rem ;
    background-position: 50% 50%;
    font-size: 0.267rem;
    color:#999;
    height:1.3rem;
    width:1rem;
    float: left;
    margin-left:0.32rem ;
  }
  .button{
    width:100%;
    height: 0.74rem;
  }
  .button p {
    float: left;
    color:#373737;
    line-height: 0.74rem;
    font-size:0.347rem ;
    margin-left:0.427rem ;
  }
  .button p span{
    font-size: 0.48rem;
    line-height: 0.74rem;
    color:#FC4D17;
  }
  .button p span span{
   font-size: 0.347rem;
    margin-right: 0.1rem;
    margin-left: 0.05rem;
  }
  .button button{
    width:1.8rem;
    margin-right:0.22rem ;
    line-height: 0.74rem;
    border: 1px solid #979797;
    color:#979797;
    border-radius:0.16rem ;
    background: transparent;
    font-size:0.32rem ;
    float: right;
  }
  .button .zhifu{
    background:#1a6bac ;
    color:white;
    border-color: #1a6bac;
  }
  .lookMorePrice{
     position: absolute;
    right:0.42rem;
    top:0.26rem;
    padding-right:0.53rem;
    font-size: 0.32rem;
    color:#999999;
  }
  .lookMorePrice img{
    width:0.35rem;
    position: absolute;
    right:0;
    top:0.15rem;
  }
  .tranPrice{
     font-size: 0.375rem;
     color:#373737;
    line-height: 0.82rem;
  }
  .tranPrice span{
    font-size: 0.48rem;
    color:#373737;
    line-height: 0.82rem;
  }
  .tranPrice span span{
      font-size:0.347rem ;
    line-height: 0.82rem;
    margin-left:0.1rem ;
    margin-right: 0.05rem;
  }
  .otherPrice{
    width:100%;
  }
  .otherPrice label{
    color:#666666;
    font-size: 0.347rem;
    min-width:33%;
    float: left;
  }
  .otherPrice label span{
    color:#666666;
    font-size: 0.347rem;
    margin-left: 0.1rem;
  }
  .xuanzhuan{
    -moz-transform:rotate(180deg);
    -webkit-transform:rotate(180deg);
    transform:rotate(180deg);
    filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=2);
  }
</style>
