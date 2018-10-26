<template>
  <div id="insuranceList">
    <div id="title" v-title data-title="保险"></div>
    <div id="full_feature" class="swipslider">
      <ul class="sw-slides">
        <li class="sw-slide" v-for="(item) in banner">
          <img :src="item.value"  :onerror="errorlogo" >
        </li>
      </ul>
    </div>
    <div class="wrapper" id="trackTab">
      <div class="scroller">
        <ul class="clearfix">
          <li v-for="(item,index) in tabList">
            <div class="imgscBox" :style="{backgroundImage:'url(' + item.icon + ')'}"></div>
            <a href="javascript:void(0)">{{item.name}}</a>
          </li>
        </ul>
      </div>
    </div>
    <div id="mescroll" class="mescroll"  style="top:7.6rem">
      <ul id="dataList" class="data-list">
        <li v-for="item in pdlist" class="insuranceLi">
          <div class="litop">
            <span class="name">{{item.name}}</span>
            <span class="number">{{item.number | toThousands}}人购买</span>
            <div class="clearBoth"></div>
          </div>
          <img :src="item.img" class="licenter">
          <div class="libottom">
            <p class="name">￥{{item.price | toThousands}}元起</p>
          </div>
        </li>
        <li v-if="total == pdlist.length" class="totalList">
          <p class="nodata">更多险种，敬请期待</p>
        </li>
      </ul>
    </div>
    <footComponent :idx='3'></footComponent>
  </div>
</template>

<script>
  import MeScroll from '../js/mescroll'
  import {iscroll} from '../js/iscroll'
  import {androidIos} from "../js/app";
  import "../js/swipeslider";
  import {shujvyuan} from "../js/shujv";
  var pdlist1 = shujvyuan.sixth();
  var thisthat;
  export default {
    name: "insuranceList",
    data(){
      return{
        pdlist:[],
        banner:[],
        total:-1,
        tabList:[{
          icon:require("../images/insurancsList1.png"),
          name:"客服理赔"
        },{
          icon:require("../images/insurancsList2.png"),
          name:"投保记录"
        },{
          icon:require("../images/insurancsList3.png"),
          name:"投保攻略"
        },{
          icon:require("../images/insurancsList4.png"),
          name:"快速投保"
        }],
        errorlogo: 'this.src="' + require('../images/timg.jpg') + '"',
      }
    },
    mounted:function () {
      var _this = this;
      thisthat = _this;
      androidIos.judgeIphoneX("mescroll",2);
      androidIos.judgeIphoneX("mescroll",1);
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var self = this;
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10,
            htmlNodata:""
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", "")
          }
        });
        $('.wrapper').navbarscroll({defaultSelect:1});
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/settings/getBanner",
          data:JSON.stringify({
            str:"1500",
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (getBanner) {
            if (getBanner.success == "1") {
              self.banner = getBanner.list;
              self.$nextTick(function () {
                $('#full_feature').swipeslider();
              })
            }else{
              androidIos.second(getBanner.message);
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
      },
      upCallback: function(page) {
        //联网加载数据
        var self = this;
        getListDataFromNet(page.num, page.size, function(curPageData) {
          //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

          //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if(page.num == 1) self.pdlist = [];

          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      chooseLine:function (item) {
        var _this = this;
        item = JSON.stringify(item);
        sessionStorage.setItem("insurance",item);
        androidIos.gobackFrom(_this);
      }
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      var data=pdlist1; // 模拟数据: ../res/pdlist1.js
      thisthat.total = data.length;
      var listData=[];//模拟分页数据
      for (var i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
        if(i==data.length) break;
        listData.push(data[i]);
      }
      successCallback&&successCallback(listData);//成功回调
    },10)
  }
</script>

<style >
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #insuranceList .mescroll{
    position: absolute;
    top:5.5rem;
    bottom: 1.3rem;
    height: auto;
    background: #f6f6f6;
  }
  #insuranceList .mescroll-upwarp{
    display: none!important;
  }
</style>
<style scoped>
  .wrapper {
    position:relative;
    height: 2rem;
    width: 100%;
    float: left;
    margin:0 auto;
    background:white;
  }
  .wrapper .scroller {
    position:absolute;
  }
  .wrapper .scroller li {
    height: 2rem;
    color:#373737;
    float: left;
    font-size: .4rem;
    text-align: center;
    width:2.5rem;
  }
  .wrapper .scroller li a{
    color:#373737;
    display:block;
    font-size: 0.35rem;
    margin:0 0.1rem;
  }
  .wrapper .scroller li a span{
    color:#1D68A8;
    font-size: 0.3125rem;
  }
  .swipslider{
    min-height: auto!important;
    height: 4.2rem;
  }
  .swipslider .sw-bullet{
    bottom:10px!important;
  }
  #dataList ul{
    width:100%;
    background: white;
    margin-top: 0.2rem;
  }
  #dataList li{
    background: white;
  }
  .imgscBox{
    width:0.93rem;
    height: 0.93rem;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 0.93rem;
    margin: 0.2rem auto;
  }
  #insuranceList .name{
    font-size: 0.35rem;
    line-height: 1rem;
    color:#333;
    margin-left: 3%;
  }
  #insuranceList .number{
    font-size: 0.35rem;
    line-height: 1rem;
    color:#333;
    float: right;
    margin-right:3%;
  }
  .nodata{
    width:3.5rem;
    display: block;
    margin: 0 auto;
    font-size: 0.375rem;
    color:#999;
    padding: 1.45rem 0 0 0;
    background-image: url("../images/qidai.png");
    background-size: 1.45rem;
    background-position: 50% 0rem;
    text-align: center;
    background-repeat: no-repeat;
  }
  .mescroll ul{
    margin-top: 0.2rem;
  }
  .insuranceLi{
    width:100%;
    margin: 0 auto 0.2rem auto;
    background: white;
    border-radius: 0.1rem;
  }
  .licenter{
     width:94%;
     margin: 0 auto;
     display: block;
  }
  .totalList{
     padding:0.9rem 0 ;
  }
</style>
