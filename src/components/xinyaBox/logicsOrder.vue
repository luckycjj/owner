<template>
  <div id="logicsOrder" style="top:1.3rem;">
    <div id="title" v-title data-title="运单物流"></div>
    <div id="mescroll" class="mescroll" :style="{bottom : manage && productPk == ''?'1.2rem':0}">
      <ul id="dataList" class="data-list">
        <li v-for="(item,index) in pdlist" @click="lookMessage(item.pkInv)">
          <p :style="{paddingLeft: item.haveRead == 0 ? '0.2rem' : '0rem'}"><span class="noread" v-if="item.haveRead == 0"></span>{{item.taskStatusMemo}}</p>
          <h6>{{item.time}}</h6>
          <div class="clearBoth"></div>
          <div class="orderBox">
            <h1>订单号：{{item.taskNo}}</h1>
            <h2>{{item.startCity}}-{{item.endCity}}</h2>
            <h3 v-for="(items,indexs) in item.item">
              <span>{{items.goodsCode}}-{{items.goodsName}}</span>
              <span>{{items.num}}件</span>
              <span v-if=" items.weight*1 > 0 " v-html="items.weight*1 < 1 ? items.weight*1000 + '千克' : items.weight*1 + '吨'"></span>
              <span v-if=" items.volume*1 > 0 " v-html="items.volume*1 < 1 ? items.volume*1000 + '升' : items.volume*1 + '立方米'"></span>
            </h3>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import bridge from '../../js/bridge';
  import {bomb} from "../../js/zujian";
  import  "../../js/markingSystem";
  var thisThat;
  export default {
    name: "logicsOrder",
    data(){
      return{
        pdlist:[],
        carPeoplePk:"",
        carpk:"",
        productPk:"",
        size:"",
        number:"",
        manage:false,
        errorlogo: 'this.src="' + require('../../images/userImg.png') + '"'
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.judgeIphoneX("logicsOrder",2);
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var self = this;
        thisThat = this;
        self.carPeoplePk = self.$route.query.driverPk==undefined?"":self.$route.query.driverPk;
        self.productPk = sessionStorage.getItem("dispatchPK")==undefined?"":sessionStorage.getItem("dispatchPK");
        self.carpk =  self.$route.query.carPk==undefined?"":self.$route.query.carPk;
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            page: {
              size: 10, //每页数据的数量
            },
            empty:{
              warpId:'mescroll',
              icon:require('../../images/nojilu.png'),
              tip:"暂无承运商~"
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", ""),
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
          self.number = page.num;
          self.size = page.size;
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      lookMessage:function (pk) {
        var _this = this;
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/order/messageRead",
          data: JSON.stringify({
            pk:pk,
            userCode: sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (messageRead) {
            if(messageRead.success == "1" ){
              androidIos.addPageList();
              _this.$router.push({ path: '/orderLogistics/orderLogisticsMore',query:{pk:pk,type:1}});
            }else{
              androidIos.second(messageRead.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        })
      }
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/order/messageList",
        data: JSON.stringify({
          page:pageNum,
          size:pageSize,
          userCode: sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source")
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function (getCarrierPage) {
          var listData = [];
          if(getCarrierPage.success == "1" || getCarrierPage.success == ""){
            listData = getCarrierPage.list;
            successCallback&&successCallback(listData);//成功回调
          }else{
            androidIos.second(getCarrierPage.message);
            successCallback&&successCallback(listData);//成功回调
          }
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
          var listData = thisThat.pdlist;
          if(status=='timeout'){//超时,status还有success,error等值的情况
            androidIos.second("网络请求超时");
            successCallback&&successCallback(listData);//成功回调
          }else if(status=='error'){
            androidIos.errorwife();
            successCallback&&successCallback(listData);//成功回调
          }
        }
      })
    },500)
  }
</script>
<style>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
</style>
<style scoped>
  #logicsOrder{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  #logicsOrder ul{
    width:100%;
  }
  #logicsOrder li{
    width: 88%;
    margin: 0.33rem auto 0 auto;
    padding:0.33rem 0.24rem;
    background: white;
    border-radius: 0.2rem;
  }
  #logicsOrder li p{
     font-size:0.375rem ;
     float: left;
     color:#2c2c2c;
    position: relative;
  }
  #logicsOrder li h6{
    font-size:0.3125rem ;
    float: right;
    color:#999;
  }
  .orderBox{
     width:94%;
    margin-top:0.34rem ;
    background: #F9F9F9;
    border-radius: 0.2rem;
    padding: 0.2rem 3%;
  }
  .orderBox h1,.orderBox h2,.orderBox h3 span{
    color:#2C2C2C;
    font-size: 0.345rem;
    margin-bottom: 0.1rem;
  }
.noread{
  position: absolute;
  width:0.18rem;
  height: 0.18rem;
  border-radius: 50%;
  background: #E1473C;
  top:50%;
  margin-top:-0.09rem;
  left:0;
}
</style>
