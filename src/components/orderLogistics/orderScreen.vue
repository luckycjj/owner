<template>
  <div id="orderScreen" style="top:0rem;">
    <div id="title" v-title data-title="发货地址"></div>
    <div id="carTitleBox"   @click="event($event)">
      <div class="carTitleBox">
        <div class="carTitleback" @click="goback()"></div>
        <input @keyup="inputKeyup()" type="text" placeholder="请输入订单号"  id="carNumber" v-model="address"  @focus="aaa()">
        <p @click="sousuo()" id="sousuo">搜索</p>
      </div>
    </div>
    <div id="mescroll" class="mescroll" style="top:1.3rem;">
      <ul id="dataList" class="data-list">
        <li v-for="(items,indexs) in pdlist" @click="lookTrackMore(items.pkInvoice)">
          <div class="startEndBox">
            <div class="startEnd"><div class="circleList"></div><span class="startEndSpan">{{items.deliAddr}}-{{items.arriAddr}}</span></div>
            <div class="triangle_border_right"></div>
            <div class="clearBoth"></div>
          </div>
          <img v-if="items.ifUrgent == 'Y'" class="jinjiOrder" src="../../images/jiaji.png">
          <h3 v-html="items.status == -1 ? '已驳回' :items.status == 0 ? '待确认': items.status == 1 ? '待调度' :items.status == 2 ? '待提货': items.status == 3 ? '待到达': items.status == 4 ? '待付款' : ''"></h3>
          <div class="proBox">
            <h6 class="deliDateTime">{{items.deliDate}}</h6>
            <h6 class="arriDateTime">{{items.arriDate}}</h6>
            <h6 class="proBoxList" v-for="(pro,proIndex) in items.itemDaos">{{pro.goodsCode}}/{{pro.goodsName}}/{{pro.num}}件<span v-if="pro.weight*1 > 0">/{{pro.weight*1}}吨</span><span v-if="pro.volume*1 > 0">/{{pro.volume*1}}立方米</span></h6>
            <h6 class="driver">{{items.deliContact}}</h6>
            <h5 class="remark">{{items.memo}}</h5>
            <div class="clearBoth"></div>
          </div>
          <h1>订单编号：{{items.vbillno}}</h1>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  var thisthatsecond;
  export default {
    name: "orderScreen",
    data(){
      return{
        pdlist:[],
        address:"",
        pk:"",
        size:"",
        number:"",
        manage:false,
        addressType:"",
        total:100,
      }
    },
    mounted:function () {
      var _this = this;
      _this.addressType = _this.$route.query.type;
      androidIos.judgeIphoneX("orderScreen",2);
      androidIos.judgeIphoneX("mescroll",2);
      var keyword = _this.$route.query.keyword;
      if(keyword != undefined){
         _this.address = keyword;
      }
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var self = this;
        thisthatsecond = self;
        var ORDERSCREEN = sessionStorage.getItem("ORDERSCREEN");
        if( ORDERSCREEN != null){
          self.address = ORDERSCREEN;
        }
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            empty:{
              warpId:'mescroll',
              icon:require('../../images/nojilu.png'),
              tip:""
            },
            page: {
              num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
              size: 10, //每页数据的数量
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", ""),
          }
        });
      },
      aaa:function(){
        $("#orderScreen #carTitleBox").css("z-index","100");
        document.getElementById("sousuo").innerText = "搜索";
      },
      event:function (e) {
        var _this = this;
        if($("#orderScreen #carTitleBox").css("z-index")=="100"){
          if(e.target.id=="carTitleBox"){
            $("#orderScreen #carTitleBox").css("z-index","0");
            _this.pdlist = [];
            _this.mescroll.resetUpScroll();
          }
        }
      },
      sousuo:function(){
        var _this = this;
        $("#orderScreen #carTitleBox").css("z-index","0");
        _this.pdlist = [];
        _this.mescroll.resetUpScroll();
      },
      inputKeyup:function () {
        var _this = this;
        _this.address = _this.address.replace(/[^\a-\z\A-\Z0-9\-]/g,'');
      },
      upCallback: function(page) {
        //联网加载数据
        var self = this;
        getListDataFromNet(page.num, page.size, function(curPageData) {
          //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

          //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if(page.num == 1) self.pdlist = [];
          self.number = page.num;
          self.size = page.size;
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);
          self.$nextTick(function () {
            $("#addressMessage .secondBox").css("height","50%");
          })

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      goback:function () {
        androidIos.gobackFrom(this);
      },
      lookTrackMore:function (pk) {
        var _this = this;
        sessionStorage.setItem("ORDERSCREEN",_this.address);
        androidIos.addPageList();
        _this.$router.push({ path: '/orderLogistics/orderLogisticsMore',query:{pk:pk,type:1}});
      },
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/order/loadInvoice",
        data:JSON.stringify({
          page:pageNum,
          size:pageSize,
          type:"2",
          state:"",
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
          keyword:thisthatsecond.address == "" ? "HDSDDD" : androidIos.checkText(thisthatsecond.address),
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function (loadEntrust) {
          if (loadEntrust.success == "1") {
            successCallback(loadEntrust.list);
          }else{
            androidIos.second(loadEntrust.message);
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
    },500)
  }
</script>

<style >
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #orderScreen .carTitleBox{
    width: 100%;
    position: absolute;
    top: 0;
    height: 1.3rem;
    background: white;
  }
  #orderScreen .carTitleback{
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
  #orderScreen #carTitleBox{
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background: rgba(0,0,0,0.2);
    width:auto;
    height: auto;
    z-index:0;
  }
  #orderScreen .carTitleBox p {
    position: absolute;
    right:0;
    top:0;
    line-height: 1.3rem;
    color:#333;
    margin-right: 2%;
    font-size: 0.35rem;
  }
  #orderScreen .carTitleBox input{
    display: block;
    width:50%;
    background-color: #f2f2f2;
    border:1px solid #eaeaea;
    color:#333;
    padding: 0.15rem 0;
    margin-top:0.225rem;
    margin-left:2rem;
    font-size: 0.36rem;
    border-radius: 0.45rem;
    text-align: left;
    padding-left: 10%;
    background-image: url("../../images/sousuo.png");
    background-position: 6% 50%;
    background-repeat: no-repeat;
    background-size: 0.4133rem 0.4rem;
  }
  #orderScreen .mescroll{
    position: fixed;
    top:1.3rem;
    bottom:0rem;
    height: auto;
    background-color: rgb(245, 245, 249)!important;
  }
</style>
<style scoped>
  #orderScreen{
    position:absolute;
    top:0rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  .mescroll{
    position: absolute;
    top:1.2rem;
    bottom:0rem;
    height: auto!important;
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
    font-size:0.32rem ;
    color:#373737;
    margin-bottom: 0.01rem;
    padding-left: 5%;
    margin-left: 2%;
    background-repeat: no-repeat;
    background-size:0.27rem ;
    background-position: 0 50%;
    width:43%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    float: left;
    line-height: 0.44rem;
    height: 0.44rem;
    margin-bottom: 0.21rem;
  }
  .data-list li h5{
    font-size:0.32rem ;
    color:#373737;
    margin-bottom: 0.01rem;
    padding-left: 5%;
    margin-left: 2%;
    background-repeat: no-repeat;
    background-size:0.27rem ;
    background-position: 0 50%;
    width:88%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    float: left;
    line-height: 0.44rem;
    height: 0.44rem;
  }
  .data-list li h1{
    font-size:0.34rem ;
    color:#999;
    padding-top: 0.25rem;
    margin-left: 0.5rem;
  }
  .data-list li h3{
    position: absolute;
    width:2rem;
    font-size: 0.375rem;
    right:0;
    bottom:0.21rem;
    line-height: 0.48rem;
    background-size: 0.48rem;
    background-repeat: no-repeat;
    background-position: 0 50%;
    padding-left: 0.6rem;
    color:#373737;
  }
  .jinjiOrder{
    position: absolute;
    font-size: 0.3125rem;
    right:0.3rem;
    top:0.15rem;
    color:#1D68A8;
    width:1rem;
  }
  .deliDateTime{
    background-image: url("../../images/cc.png");
  }
  .arriDateTime{
    background-image: url("../../images/cc.png");
  }
  .proBoxList{
    background-image: url("../../images/tranprotype.png");
  }
  .driver{
    background-image: url("../../images/trandriver.png");
  }
  .remark{
    background-image: url("../../images/tranremark.png");
  }
  .proBox{
    width:94%;
    margin: 0.2rem auto;
    border-radius: 0.1rem;
    border: 1px solid white;
  }
  .startEnd{
    background:#1D68A8 ;
    padding: 0 0.92rem 0 0.7rem;
    float: left;
    position: relative;
    max-width: 5.5rem;
  }
  .startEndSpan{
    font-size: 0.375rem;
    line-height: 0.6rem;
    color:#fff;

  }
  .circleList{
    width:0.22rem;
    height: 0.22rem;
    background: white;
    position: absolute;
    border-radius: 50%;
    top:50%;
    margin-top: -0.11rem;
    left:0.29rem;
  }
  .triangle_border_right{
    width:0;
    height:0;
    border-width:0.29rem 0rem 0.29rem 0.29rem;
    border-style:solid;
    border-color:transparent transparent transparent #1D68A8;/*透明 透明 透明 灰*/
    position:relative;
    float: left;
  }
</style>
