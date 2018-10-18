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
              <div :id="'star_grade' + index" class="star_grade"></div>
              <h2> 驾驶证等级：{{item.licType}}</h2>
              <h1>驾龄：{{item.year}}年 </h1>
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
                grade:self.pdlist[i].score==null ? 0 : self.pdlist[i].source * 1,
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
      goDriver:function (pk) {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({path:"/bestDriverMore",query:{pk:pk}});
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
  #bestDriverList .set_image_all {
    cursor: pointer;
    position: relative;
  }
  #bestDriverList .set_image_top div{
    position: relative;
  }
  #bestDriverList .star_grade{
    margin-top: 0.25rem;
  }
  #bestDriverList .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:0.4rem!important;
  }
  #bestDriverList .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #bestDriverList .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 13;
  }

  #bestDriverList .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #bestDriverList .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #bestDriverList .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
    display: none!important;
  }
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
    background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
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
    padding:0.36rem 0.76rem 0.36rem 0.42rem;
    background: white;
  }
  #bestDriverList #peopleMessage .peopleImg{
    width:100%;
  }
  #bestDriverList #peopleMessage .peoplemessage{
    float: left;
    margin-left: 0.44rem;
    width:7rem;
  }
  #bestDriverList #peopleMessage .peoplemessage p{
    font-size: 0.375rem;
    line-height: 0.375rem;
    color:#333;
  }
  #bestDriverList #peopleMessage .peoplemessage h1{
    font-size: 0.32rem;
    line-height: 0.32rem;
    margin-top: 0.2rem;
    color:#373737;
    float: right;
  }
  #bestDriverList #peopleMessage .peoplemessage h2{
    font-size: 0.32rem;
    line-height: 0.32rem;
    margin-top: 0.2rem;
    color:#373737;
    float: left;
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
    width:1.68rem;
    height:1.68rem;
    overflow: hidden;
    float: left;
    border-radius: 50%;
    line-height: 1.2rem
  }
  #bestDriverList .imgBoxOverFllow img{
    display: inline-block;
    vertical-align: middle;
    width:1.68rem;
    height:1.68rem;
  }
</style>
