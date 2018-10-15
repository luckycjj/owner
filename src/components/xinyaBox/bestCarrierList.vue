<template>
  <div id="bestCarrierList">
    <div id="title" v-title data-title="优秀承运商"></div>
    <div id="mescroll" class="mescroll" :style="{bottom : manage && productPk == ''?'1.2rem':0}">
      <ul id="dataList" class="data-list">
        <li v-for="(item,index) in pdlist" @click="goCarrier(item.pkCarrier)">
          <div id="peopleMessage">
            <div class="imgBoxOverFllow">
              <img :src="item.carrierImg" :onerror="errorlogo" class="peopleImg">
            </div>
            <div class="peoplemessage">
              <p>{{item.corpName}}</p>
              <div :id="'star_grade' + index" class="star_grade"></div>
              <h2> {{item.tranType}}</h2>
              <h1 v-html="item.addtime < 1 ? '小于1年' : Math.floor(item.addtime) + '年'"></h1>
              <div class="clearBoth"></div>
            </div>
            <div class="clearBoth"></div>
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
    name: "bestCarrierList",
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
          self.$nextTick(function () {
            var num = page.num;
            var size = page.size;
            for(var i = 0 ; i < self.pdlist.length ;i ++){
              $("#star_grade"+(i*1+(num-1)*size)).html("");
              $("#star_grade"+(i*1+(num-1)*size)).markingSystem({
                num: 5,
                havePoint: true,
                haveGrade: true,
                backgroundImageInitial:require('../../images/star_hollow.png'),
                backgroundImageOver:require('../../images/star_solid.png'),
                unit: '星',
                grade:self.pdlist[i].score==null ? 0 : self.pdlist[i].score * 1,
                height: 0.4* $("html").css("font-size").replace("px", ""),
                width: 0.4* $("html").css("font-size").replace("px", ""),
              });
            }

          })

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      goCarrier:function (pk) {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({path:"/bestCarrierMore",query:{pk:pk}});
      },
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/carrier/getCarrierPage",
        data: JSON.stringify({
          pk: "",
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
            for(var i = 0 ; i < getCarrierPage.list.length ; i ++ ){
               var time =  getCarrierPage.list[i].createDate.replace(/-/g,'/');
               var addtime = (new Date()).getTime() - (new Date(time)).getTime();
               getCarrierPage.list[i].addtime = addtime/1000/60/60/24/365;
            }
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
  #bestCarrierList .set_image_all {
    cursor: pointer;
    position: relative;
  }
  #bestCarrierList .set_image_top div{
    position: relative;
  }
  #bestCarrierList .star_grade{
    margin-top: 0.25rem;
  }
  #bestCarrierList .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:0.4rem!important;
  }
  #bestCarrierList .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #bestCarrierList .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 13;
  }

  #bestCarrierList .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #bestCarrierList .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #bestCarrierList .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
    display: none!important;
  }
</style>
<style scoped>
  #bestCarrierList{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  #bestCarrierList ul{
    width:100%;
    background: white;
    margin-top: 0.2rem;
  }
  #bestCarrierList #newCar{
    width:100%;
    height: 1.2rem;
    color:white;
    background-image: url("../../images/backgroundJB.png");
    background-repeat:repeat-y;
    background-size:10rem;
    position: fixed;
    bottom:0;
    left:0;
    font-size: 0.4rem;
  }
  #bestCarrierList li{
    width: 100%;
    border-bottom: 1px solid #dadada;
  }
  #bestCarrierList #peopleMessage{
    width:94%;
    padding:0.36rem 0.76rem 0.36rem 0.42rem;
    background: white;
  }
  #bestCarrierList #peopleMessage .peopleImg{
    width:100%;
  }
  #bestCarrierList #peopleMessage .peoplemessage{
    float: left;
    margin-left: 0.44rem;
    width:7rem;
  }
  #bestCarrierList #peopleMessage .peoplemessage p{
    font-size: 0.375rem;
    line-height: 0.375rem;
    color:#333;
  }
  #bestCarrierList #peopleMessage .peoplemessage h1{
    font-size: 0.32rem;
    line-height: 0.4rem;
    margin-top: 0.19rem;
    color:#373737;
    float: left;
    margin-left: 0.2rem;
  }
  #bestCarrierList #peopleMessage .peoplemessage h2{
    font-size: 0.32rem;
    line-height: 0.4rem;
    margin-top: 0.19rem;
    color:#373737;
    float: left;
    max-width: 5.6rem;
  }
  #bestCarrierList  #peopleMessage .tel{
    width:1.2rem;
    float: right;
    margin-top: 0.3rem;
  }
  #bestCarrierList #peopleMessage .tel img{
    display: block;
    margin: 0 auto;
    width:0.6rem;
  }
  #bestCarrierList .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 0;
    height: auto;
  }
  #bestCarrierList .imgBoxOverFllow{
    width:1.68rem;
    height:1.68rem;
    overflow: hidden;
    float: left;
    border-radius: 50%;
    line-height: 1.2rem
  }
  #bestCarrierList .imgBoxOverFllow img{
    display: inline-block;
    vertical-align: middle;
    width:1.68rem;
    height:1.68rem;
  }
</style>
