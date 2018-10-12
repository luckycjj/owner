<template>
  <div id="bestDriverList">
    <div id="title" v-title data-title="优秀司机"></div>
    <div id="mescroll" class="mescroll" :style="{bottom : manage && productPk == ''?'1.2rem':0}">
      <ul id="dataList" class="data-list">
        <li v-for="(item,index) in pdlist">
          <div id="peopleMessage">
            <div class="imgBoxOverFllow">
              <img :src="item.pic" :onerror="errorlogo" class="peopleImg">
            </div>
            <div class="peoplemessage">
              <p>{{item.name}}</p>
              <h1>驾龄：{{item.year}}年 </h1>
              <h1> 驾驶证等级：{{item.licType}}</h1>
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
  var thisThat;
  export default {
    name: "bestDriverList",
    data(){
      return{
        pdlist:[],
        carPeoplePk:"",
        carpk:"",
        productPk:"",
        size:"",
        number:"",
        manage:false,
        errorlogo: 'this.src="' + require('../../images/carpeople.png') + '"'
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
              size: 12, //每页数据的数量
            },
            empty:{
              warpId:'mescroll',
              icon:require('../../images/nojilu.png'),
              tip:"暂无司机~"
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

    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/driver/getDriverPage",
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
        success: function (getDriverPage) {
          var listData = [];
          if(getDriverPage.success == "1" || getDriverPage.success == ""){
            for(var i = 0 ; i < getDriverPage.list.length ; i++){
              var list = getDriverPage.list[i];
              if(list.pkDriver == thisThat.$route.query.driverZ ){
                continue;
              }
              var pkTrue = false;
              if(list.pkDriver == thisThat.$route.query.driverPk){
                pkTrue = true;
              }
              var json = {
                pkTrue:pkTrue,
                carPeoplePk:list.pkDriver,
                tel:list.mobile,
                name:list.driverName,
                licType:list.licType == "" || list.licType == undefined || list.licType == null ? "暂无" : list.licType + "级别",
                year:list.driverAge*1<1?"小于1":list.driverAge*1,
                pic:list.driverImg,
              }
              listData.push(json)
            }
            successCallback&&successCallback(listData);//成功回调
          }else{
            androidIos.second(getDriverPage.message);
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
  #bestDriverList{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  #bestDriverList ul{
    width:100%;
    background: white;
    margin-top: 0.2rem;
  }
  #bestDriverList #newCar{
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
  #bestDriverList li{
    width: 100%;
    border-bottom: 1px solid #dadada;
  }
  #bestDriverList #peopleMessage{
    width:94%;
    padding:0.2rem 3%;
    background: white;
    margin-top: 0.2rem;
  }
  #bestDriverList #peopleMessage .peopleImg{
    width:100%;
  }
  #bestDriverList #peopleMessage .peoplemessage{
    float: left;
    margin-left: 0.3rem;
    margin-top: 0.1rem;
  }
  #bestDriverList #peopleMessage .peoplemessage p{
    font-size: 0.3125rem;
    color:#333;
  }
  #bestDriverList #peopleMessage .peoplemessage h1{
    font-size: 0.3125rem;
    color:#999;
  }
  #bestDriverList  #peopleMessage .tel{
    width:1.2rem;
    float: right;
    margin-top: 0.3rem;
  }
  #bestDriverList #peopleMessage .tel img{
    display: block;
    margin: 0 auto;
    width:0.6rem;
  }
  #bestDriverList .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 0;
    height: auto;
  }
  #bestDriverList .imgBoxOverFllow{
    width:1.2rem;
    height:1.2rem;
    overflow: hidden;
    float: left;
    border-radius: 50%;
    line-height: 1.2rem
  }
  #bestDriverList .imgBoxOverFllow img{
    display: inline-block;
    vertical-align: middle;
  }
</style>
