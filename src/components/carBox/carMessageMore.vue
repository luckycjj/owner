<template>
    <div id="carMessageMore" style="top:1.3rem;">
      <div id="title" v-title data-title="找车详情"></div>
      <div class="carmessage">
          <img :src="driverMessage.driverImage" :onerror="errorlogo">
         <div class="carMessageBox">
           <p>{{driverMessage.driverName}}</p>
           <h1>{{driverMessage.carno}}<span style="margin-left:0.19rem; "><span v-if="driverMessage.carLen != ''">{{driverMessage.carLen}}米</span><span v-if="driverMessage.carLen != '' && driverMessage.carModel != ''">/</span><span v-if="driverMessage.carModel != ''">{{driverMessage.carModel}}</span><span v-if="driverMessage.carModel == ''">/</span><span v-if="driverMessage.carWeight != '' && driverMessage.carModel != ''">/</span><span v-if="driverMessage.carWeight != ''">{{driverMessage.carWeight*1}}吨</span></span></h1>
           <h2>已注册 {{driverMessage.createTime}}</h2>
         </div>
      </div>
      <div class="carChengjiao">
        <div class="carChengjiaonumber">{{driverMessage.carOrderNum*1  | toThousands}}<h1>成交数</h1></div>
        <div class="carChengjiaonumber">{{driverMessage.carMileage*1  | toThousands}}<h1>交易里程数（公里）</h1></div>
        <div class="clearBoth"></div>
      </div>
      <div id="container" style="top:4.4rem;bottom: 50px;"></div>
      <div id="panel"></div>
      <div class="caozuoButton" id="caozuoButton">
        <button @touchend="telphoneMessageDriver()">发送短信</button>
        <button @touchend="telphoneCallDriver(driverMessage.driverCode)">联系司机</button>
        <div class="clearBoth"></div>
      </div>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import AMap from 'AMap';
    export default {
        name: "car-message-more",
        data(){
          return{
             driverMessage:{
               carLen: "",
               carMileage: "",
               carModel: "",
               carOrderNum: "",
               carWeight: "",
               carno: "",
               createTime: "",
               driverCode: "",
               driverImage: "",
               driverName: "",
               errorCode: "",
               message: "操作成功",
               responseTime: "",
               success: "",
               usedCar: "",
               location:""
             },
            errorlogo: 'this.src="' + require('../../images/userImg.png') + '"',
          }
        },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("carMessageMore",2);
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/driver/getCarDetail",
          data:JSON.stringify({
            pk:_this.$route.query.carno,
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          async:false,
          success: function (loadInvoice) {
            if (loadInvoice.success == "1") {
              _this.driverMessage = loadInvoice;
              loadInvoice.carModel =  loadInvoice.carModel == null ? "" : loadInvoice.carModel;
              loadInvoice.carLen =  loadInvoice.carLen == null ? "" : loadInvoice.carLen;
              loadInvoice.carWeight =  loadInvoice.carWeight == null ? "" : loadInvoice.carWeight;
              var time =   Math.floor(((new Date()).getTime() -  (new Date(_this.driverMessage.createTime.replace(/-/g , '/'))).getTime())/1000/60/60/24/365);
              _this.driverMessage.createTime = time < 1 ? "不到1年" : time + "年";
            }else{
              androidIos.second(loadInvoice.message);
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
        androidIos.bridge(_this);
      },
      methods:{
         go:function () {
           var _this = this;
           var message = _this.driverMessage.usedCar == 1 ? "取消熟车" : "加为熟车";
           $("#addshucheYes span").text(message);
           $("#addshucheYes span").unbind("click").click(function () {
               var messageGo = $(this).text();
                androidIos.first("确定" + messageGo + "吗？");
             $(".tanBox-yes").unbind('click').click(function(){
               $(".tanBox-bigBox").remove();
               var http = messageGo == "取消熟车" ? "/driver/cancelCollect" : "/driver/collectCarAndDriver";
               var pk = messageGo == "取消熟车" ? _this.driverMessage.carno : _this.driverMessage.pkCar;
               $.ajax({
                 type: "POST",
                 url: androidIos.ajaxHttp() + http,
                 data:JSON.stringify({
                   pk : pk,
                   userCode:sessionStorage.getItem("token"),
                   source:sessionStorage.getItem("source"),
                 }),
                 contentType: "application/json;charset=utf-8",
                 dataType: "json",
                 timeout: 30000,
                 success: function (collectCarAndDriver) {
                   if (collectCarAndDriver.success == "1") {
                     _this.$cjj( messageGo == "取消熟车" ? "取消成功" : "添加成功");
                     $("#addshucheYes span").text( messageGo == "取消熟车" ? "加为熟车" : "取消熟车");
                   }else{
                     androidIos.second(collectCarAndDriver.message);
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
             });
           });
           var location =  _this.driverMessage.location.indexOf(null) != -1 ? "121.4,31.2" : _this.driverMessage.location;
           var map = new AMap.Map("container", {
             resizeEnable: true,
             center: [location.split(",")[0], location.split(",")[1]],//地图中心点
             zoom: 13 //地图显示的缩放级别
           });
           AMap.plugin(['AMap.Scale'],
             function(){
               map.addControl(new AMap.Scale());
             });
           if(_this.driverMessage.location.indexOf(null) == -1 ){
             var marker;
             if (marker) {
               marker.setMap(null);
             }
             marker = new AMap.Marker({
               icon:require('../../images/start1.png'),
               position: [_this.driverMessage.location.split(",")[0], _this.driverMessage.location.split(",")[1]]
             });
             marker.setMap(map);
           }else{
             androidIos.second("暂无定位");
           }
         },
          telphoneCallDriver:function (tel) {
             androidIos.telCall(tel);
          },
        telphoneMessageDriver:function () {
             var _this = this;
          androidIos.addPageList();
          var list = [];
          list.push(_this.driverMessage);
          _this.$router.push({path:"/sendtextmessage",query:{driver:JSON.stringify(list)}});
        },
      }
    }
</script>

<style scoped>
  #container{
    top:1.3rem;
  }
      #carMessageMore{
        position: absolute;
        top:1.3rem;
        bottom:0rem;
        width:100%;
        height: auto!important;
        background:#F5F5F5 ;
      }
      .carmessage{
        width:100%;
        margin-top:0.3rem ;
        background: white;
        position: relative;
      }
      .carmessage img{
          width:1.2rem;
          height: 1.2rem;
          border-radius: 50%;
         position: absolute;
        top:50%;
        margin-top: -0.6rem;
        left:0.347rem;
      }
      .carMessageBox{
        width:8.2rem;
        margin-left: 1.8rem;
        border-top: 1px solid white;
        padding: 0.1rem 0 0.2rem 0;
      }
      .carMessageBox p {
        font-size: 0.4rem;
        color:#373737;
      }
      .carMessageBox h1 {
        font-size: 0.346rem;
        color:#373737;
      }
      .carMessageBox h1 span{
        font-size: 0.346rem;
        color:#1D68A8;
      }
      .carMessageBox h2 {
        font-size: 0.3125rem;
        color:#999;
        padding-left:0.42rem ;
        background-image: url("../../images/time.png");
        background-repeat: no-repeat;
        background-size:0.28rem;
        background-position: 0 50%;
      }
  .carChengjiao{
     width:80%;
    padding: 0.2rem 10% 0.4rem 10%;
    margin-top: 0.03125rem;
    background: white;
  }
      .carChengjiao .carChengjiaonumber{
        width:4rem;
        float: left;
        font-size: 0.8rem;
        line-height:0.8rem ;
        text-align: center;
        color: #373737;
        margin-top: 0.38rem;
      }
      .carChengjiaonumber h1{
        font-size:0.32rem;
        line-height:0.32rem ;
        margin-top: 0.2rem;
      }
  .caozuoButton{
    position: fixed;
    bottom:0;
    height: 2.82rem;
    background: white;
    width:100%;
  }
      .caozuoButton button{
        width:4rem;
        font-size: 0.4rem;
        line-height:1.067rem ;
        border-radius: 0.107rem;
        margin-top: 0.653rem;
      }
      .caozuoButton button:nth-child(1){
           background: white;
        float: left;
        margin-left: 0.733rem;
        color:#999999;
        border: 1px solid #999999;
      }
      .caozuoButton button:nth-child(2){
        background: #1D68A8;
        float: right;
        margin-right: 0.733rem;
        color:#fff;
        border: 1px solid #1D68A8;
      }
</style>
<style>
  #carMessageMore .amap-logo{
    display: none!important;
  }
  #carMessageMore .amap-copyright{
    display: none!important;
  }
  #carMessageMore .amap-scalecontrol{
    bottom: 0.3rem !important;
  }
  #carMessageMore .amap-zoomcontrol{
    display: none!important;
  }
  #carMessageMore .amap-icon{
    width:19px;
  }
  #carMessageMore .amap-controls{
    display: none!important;
  }
</style>
