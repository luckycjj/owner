<template>
  <div id="orderLogisticsMore">
    <div id="title" v-title data-title="订单详情"></div>
    <div id="titleText"  style="top:0.72rem">
      <div id="titleGoback"  @click="goback()" ></div>
      <p v-html="orderSource == 2 ? (type == '10000' ? '待支付' : '已支付') : pdlist[0].orderTypeName"></p>
      <div class="callUs" @click="telCall('021-50929122')"><div class="callUsLine"></div>物流客服</div>
    </div>
    <div id="container"></div>
    <div id="panel"></div>
    <li id="messageBigBox" :class="moveSure ? 'move' : ''" v-for="item in pdlist">
          <div class="message">
            <div class="goodsmessage">
              <p :data-start="item.pickMessage.address" :data-end="item.endMessage.address" class="startEnd"><span style="float: left;font-size: 0.42rem;color:#373737;">{{item.goodsmessage.startAddress}}<img style="display: inline-block;margin:0rem 0.3rem 0.13rem 0.3rem;width:0.41rem;" src="../../images/addressImg.png">{{item.goodsmessage.endAddress}}</span><div class="clearBoth"></div></p>
              <h1>{{item.goodsmessage.tranType}}</h1>
              <h4>{{item.goodsmessage.money}}元</h4>
              <div class="clearBoth"></div>
              <div v-for="itemS in item.goodsmessage.productList ">
                <h2>{{itemS.goods}}</h2>
                <h3>{{itemS.number}}件<span v-if="itemS.weight.replace(/[^0-9]/g,'')*1 > 0">/{{itemS.weight}}</span><span v-if="(itemS.volume).replace(/[^0-9]/g,'')*1 > 0">/{{itemS.volume}}</span></h3>
                <div class="clearBoth"></div>
              </div>
              <div class="clearBoth"></div>
              <h5 >{{item.goodsmessage.startTime}} - {{item.goodsmessage.endTime}}</h5>
              <h6>订单编号：{{item.number}}</h6>
            </div>
          </div>
          <ul id="logisticsBox" class="logisticsBox logisticsBoxDown"  v-if="item.logistics.length > 0">
            <li v-for="(cjj,index) in item.logistics">
              <div class="logisticsLL" :style="{color:index==0 ? '#373737' : '#999'}">
                {{cjj.time | time}}
              </div>
              <div class="logisticsL">
                <div class="logisticsCircle" :class="index==0?'logisticsCircleFull':''"></div>
                <div class="logisticsShuxian"></div>
              </div>
              <div class="logisticsR" :style="{color:index==0 ? '#373737' : '#999'}">
                {{cjj.type}}
              </div>
              <div class="clearBoth"></div>
            </li>
          </ul>
          <div id="sure">
            <div class="go" v-if="type=='10000' && orderSource == 2 " >
              <button  @click="payOrder()" class="zhifu">支付</button>
              <div class="clearBoth"></div>
            </div>
            <div class="go" v-else-if="type*1 < 10 && type*1 > 0  && orderSource == 1">
              <button @click="closedOrder(1)">关闭订单</button>
              <button @click="orderAgain(3)" class="zhifu">修改订单</button>
              <div class="clearBoth"></div>
            </div>
            <div class="go" v-else-if="type == '10' && orderSource == 1">
              <button  class="zhifu"   @click="closedOrder(1)">取消订单</button>
              <button @click="shengcheng()">生成委托</button>
              <div class="clearBoth"></div>
            </div>
            <div class="go" v-else-if=" type == '0' && orderSource == 1">
              <button class="zhifu" @click="shenhe()">确认</button>
              <button @click="closedOrder(2)">驳回</button>
              <div class="clearBoth"></div>
            </div>
            <div class="go" v-else-if="type=='1000' && orderSource == 1 ">
              <button class="zhifu"  @click="orderAgain(2)">再下一单</button>
              <button @click="scoreYes(1)">评价</button>
              <div class="clearBoth"></div>
            </div>
            <div class="go" v-else-if="(type=='1001' && orderSource == 1) || (type=='100' && orderSource == 1) || orderSource == 3">
              <button class="zhifu" @click="orderAgain(2)">再下一单</button>
              <div class="clearBoth"></div>
            </div>
            <div class="go" v-else>
              <button style="border-color:white;"></button>
              <div class="clearBoth"></div>
            </div>
          </div>
        </li>
    <div id="lookOrderMore" v-if="moveSure"  @click="mapLookS()">
       查看
    </div>
    <div id="scoreBox"v-show="scoreBox">
      <div id="score">
        <div id="scoreTitle">
          <img src="../../images/closed.png" @click="scoreClosed()">
          <p>评价</p>
        </div>
        <ul>
          <li v-for="(item,index) in scoreList">
            <p>{{item.name}}</p>
            <div :id="'star_grade00'+index" class="star_grade scorelistscore"></div>
            <div class="clearBoth"></div>
          </li>
          <textarea placeholder="详细描述"  @keyup="filterInput()" v-model="scorereason" style="width:95%;height:2rem;border: 1px solid #dcdcdc;margin: 0.1rem auto;padding: 0.1rem 2.5%;font-size: 0.375rem;color:#333;"></textarea>
        </ul>
        <button @click="scoreChange()" id="gogogo" class="gogogo">提交</button>
      </div>
    </div>
    <div id="cancelReasonBox" v-if="cancelReasonBox">
      <div id="cancelReason">
        <div id="cancelReasonTitle">
          <img src="../../images/closed.png" @click="cancelReasonClosed()">
          <p v-html="closedType ==  1 ? '选择关闭订单的理由': '选择驳回理由'"></p>
        </div>
        <ul class="errorUl">
          <li v-for="(item,index) in cancelReason" :class="index%2==0?'errorAbnormalLeft':'errorAbnormalRight'" @click="cancelReasonClick($event)">
            {{item.displayName}}
          </li>
          <div class="clearBoth"></div>
          <input type="text"  @input="filterInput()" maxlength="30" placeholder="其他原因" v-model="cancelreason">
        </ul>
        <button @click="cancelReasonChange()" id="gogogo" class="gogogo">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import  "../../js/markingSystem";
  import "../../js/swipeslider";
  import AMap from 'AMap'
  export default {
    name: "robbingMore",
    data(){
      return{
        orderSource:1,
        payStatus:"",
        type:"",
        pick:true,
        logisticsOk:false,
        pdlist:[{
          "orderType":"",
          "orderTypeName":"",
          "logistics":[],
          "evaluate":{
            "grade":0
          },
          "goodsmessage":{
            "startAddress":"",
            "endAddress":"",
            "distance":"0",
            "tranType":"",
            "productList":[],
            "money":0,
            "startTime":"",
            "endTime":""
          },
          "pickMessage":{
            "name":"",
            "tel":"",
            "company":"",
            "address":""
          },
          "endMessage":{
            "name":"",
            "tel":"",
            "company":"",
            "address":""
          },
          "insurance": {
            "name":"",
            "price":""
          },
          "pickPay":{
            "people":"",
            "type":"",
            "remark":null
          },
          "carPeople":{
            "logo":"",
            "year":"",
            "grade":"",
            "name":"",
            "tel":"",
            "yes":false
          },
          "carrier":{
            "logo":"",
            "company":"",
            "tranType":"",
            "year":"",
            "grade":0,
            "phone":"",
            "pkCarrier":""
          },
          "tranNumber":"",
          "fabu":"",
          "number":"",
          "time":""
        }],
        cancelReasonBox:false,
        scoreBox:false,
        cancelReason:[],
        scoreList:"",
        scorereason:"",
        cancelreason:"",
        httpurl:"",
        closedType:1,
        carList:[],
        startJ :0,
        startW :0,
        endJ:0,
        endW:0,
        moveSure:false,
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.judgeIphoneX("titleText",2);
      var ajax =  _this.ajaxorder();

    },
    methods:{
      telCall:function (tel) {
        androidIos.telCall(tel);
      },
      ajaxorder:function () {
        var _this = this;
        var ajax = $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/order/invoiceDetail",
          data:JSON.stringify({pk:_this.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
          dataType: "json",
          contentType: "application/json;charset=utf-8",
          timeout: 10000,
          success: function (invoiceDetail) {
            if(invoiceDetail.success == "" || invoiceDetail.success == "1"){
              var list=[];
              for(var i =0;i<invoiceDetail.invPackDao.length;i++){
                var weight = invoiceDetail.invPackDao[i].weigthUnit==3?invoiceDetail.invPackDao[i].weight*1000:invoiceDetail.invPackDao[i].weight*1;
                var listJson = {
                  goods:invoiceDetail.invPackDao[i].goodsName+"-"+invoiceDetail.invPackDao[i].goodsTypeName,
                  number:invoiceDetail.invPackDao[i].num,
                  weight : weight/1000 - 1 <0 ? weight + "千克" : weight/1000 + "吨",
                  volume:invoiceDetail.invPackDao[i].volume*1 - 1 < 0 ? invoiceDetail.invPackDao[i].volume*1000 + "升" : invoiceDetail.invPackDao[i].volume*1 + "立方米",
                }
                list.push(listJson);
              }
              var tracking=[];
              for(var i =0 ;i<invoiceDetail.tracking.length;i++){
                var trackingJson = {
                  type:invoiceDetail.tracking[i].tackingStatus == invoiceDetail.tracking[i].tackingMemo ? invoiceDetail.tracking[i].tackingStatus : invoiceDetail.tracking[i].tackingStatus + " " +invoiceDetail.tracking[i].tackingMemo,
                  time:invoiceDetail.tracking[i].tackingTime,
                }
                tracking.push(trackingJson);
              }
              // 新建=0 已确认=10 司机发车=20 部分提货=30 已提货=40 部分到货=50 已到货=60 部分签收=70 已签收=80 已回单=90 关闭=100
              // $route.query.type 1发货方2付款3收货方
              var trackingStatusValue = "";
              if(_this.$route.query.type == "1"  || _this.$route.query.type == "3"){
                if(invoiceDetail.trackingStatusValue == "80" && invoiceDetail.ifAppraise == "N"){
                  trackingStatusValue = 1000;
                }else if(invoiceDetail.trackingStatusValue == "80" && invoiceDetail.ifAppraise == "Y"){
                  trackingStatusValue = 1001;
                }else{
                  trackingStatusValue = invoiceDetail.trackingStatusValue;
                }
              }else if(_this.$route.query.type == "2"){
                if(invoiceDetail.payStatus != "30"){
                  trackingStatusValue = 10000;
                }else{
                  trackingStatusValue = 10001;
                }
              }
              _this.type = trackingStatusValue;
              sessionStorage.setItem("dataStart",invoiceDetail.delivery.addressLatAndLon);
              sessionStorage.setItem("dataEnd",invoiceDetail.arrival.addressLatAndLon);
              _this.payStatus = invoiceDetail.payStatus;
              var tranTypeBoth = invoiceDetail.transType;
              if(invoiceDetail.carLength !=  "" && invoiceDetail.carLength !=  null){
                tranTypeBoth = tranTypeBoth + "(" + invoiceDetail.carLength + "米)";
              }
              if(invoiceDetail.carModel != ""  && invoiceDetail.carModel !=  null){
                tranTypeBoth = tranTypeBoth + "(" + invoiceDetail.carModel + ")";
              }
              var startTime = invoiceDetail.deliDate.split(":");
              startTime.splice(2,1);
              var endTime = invoiceDetail.arriDate.split(":");
              endTime.splice(2,1);
              var pdlist = [{
                orderType:trackingStatusValue,
                ordertypeType:invoiceDetail.trackingStatusValue,
                orderTypeName:invoiceDetail.trackingStatus,
                logistics:tracking,
                evaluate:{
                  grade:invoiceDetail.appraiseScore==""?0:invoiceDetail.appraiseScore
                },
                goodsmessage:{
                  startAddress:invoiceDetail.delivery != null ? invoiceDetail.delivery.area:"",
                  endAddress:invoiceDetail.arrival != null ? invoiceDetail.arrival.area:"",
                  distance:"0",
                  tranType:tranTypeBoth,
                  productList:list,
                  money:invoiceDetail.price*1,
                  startTime:startTime.join(":"),
                  endTime:endTime.join(":")
                },
                pickMessage:{
                  name:invoiceDetail.delivery!=null?invoiceDetail.delivery.contact:"",
                  tel:invoiceDetail.delivery!=null?invoiceDetail.delivery.mobile:"",
                  company:invoiceDetail.delivery!=null?invoiceDetail.delivery.addrName:"",
                  address:invoiceDetail.delivery!=null?invoiceDetail.delivery.province+invoiceDetail.delivery.area+invoiceDetail.delivery.detailAddr:"",
                },
                endMessage:{
                  name:invoiceDetail.arrival!=null?invoiceDetail.arrival.contact:"",
                  tel:invoiceDetail.arrival!=null?invoiceDetail.arrival.mobile:"",
                  company:invoiceDetail.arrival!=null?invoiceDetail.arrival.addrName:"",
                  address:invoiceDetail.arrival!=null?invoiceDetail.arrival.province+invoiceDetail.arrival.area+invoiceDetail.arrival.detailAddr:"",
                },
                insurance:{
                  name:"",
                  price:"200"
                },
                pickPay:{
                  people:"发货方",
                  type:invoiceDetail.balatype == null?"":invoiceDetail.balatype,
                  remark:invoiceDetail.remark
                },
                carPeople:{
                  logo:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?invoiceDetail.driverDto[0].driverImg:"",
                  year:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?(invoiceDetail.driverDto[0].driverAge*1 < 1 ?"小于一年":invoiceDetail.driverDto[0].driverAge*1+'年'):"",
                  grade:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?invoiceDetail.driverDto[0].score*1:"",
                  name:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?invoiceDetail.driverDto[0].driverName:"",
                  tel:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?invoiceDetail.driverDto[0].mobile:"",
                  yes:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?true:false,
                },
                carrier:{
                  logo:invoiceDetail.carrierDto!=null?invoiceDetail.carrierDto.carrierImg:"",
                  company:invoiceDetail.carrierDto!=null?invoiceDetail.carrierDto.carrierName:"",
                  tranType: invoiceDetail.carrierDto!=null ? (invoiceDetail.carrierDto.tranType == "" ||  invoiceDetail.carrierDto.tranType == null ? "陆运" : invoiceDetail.carrierDto.tranType):"",
                  year:invoiceDetail.carrierDto!=null?((((new Date()).getTime()-(new Date(invoiceDetail.carrierDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 -0.5)<0?"不到半年":androidIos.fixed(((new Date()).getTime()-(new Date(invoiceDetail.carrierDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 ,1)+"年"):"",
                  grade:invoiceDetail.carrierDto!=null?(invoiceDetail.carrierDto.score == null || invoiceDetail.carrierDto.score == "" ? 0:invoiceDetail.carrierDto.score*1):"0",
                  phone:invoiceDetail.carrierDto!=null?invoiceDetail.carrierDto.mobile:"",
                  pkCarrier:invoiceDetail.carrierDto!=null?invoiceDetail.carrierDto.pkCarrier:"",
                },
                tranNumber:"123321334343",
                fabu:invoiceDetail.userRole,
                number:invoiceDetail.orderNo,
                time:invoiceDetail.createTime,
              }]
              // fabu 1业务员 2审核员 3管理员
              if(invoiceDetail.driverDto != null && invoiceDetail.driverDto.length != 0){
                sessionStorage.setItem("driverPk",invoiceDetail.driverDto[0].pkDriver);
              }
              _this.carList = [];
              _this.startJ  = invoiceDetail.delivery.addressLatAndLon == ""||invoiceDetail.delivery.addressLatAndLon == null ? "" :invoiceDetail.delivery.addressLatAndLon.split(",")[0];
              _this.startW  = invoiceDetail.delivery.addressLatAndLon == ""||invoiceDetail.delivery.addressLatAndLon == null ? "" :invoiceDetail.delivery.addressLatAndLon.split(",")[1];
              _this.endJ = invoiceDetail.arrival.addressLatAndLon == "" ||invoiceDetail.arrival.addressLatAndLon == null ? "" :invoiceDetail.arrival.addressLatAndLon.split(",")[0];
              _this.endW = invoiceDetail.arrival.addressLatAndLon == "" ||invoiceDetail.arrival.addressLatAndLon == null ? "" :invoiceDetail.arrival.addressLatAndLon.split(",")[1];
              for(var i = 0; i < invoiceDetail.driverDto.length ; i++ ){
                var json = {
                  logo:invoiceDetail.driverDto[i].driverImg,
                  name:invoiceDetail.driverDto[i].driverName,
                  year:invoiceDetail.driverDto[i].driverAge*1 < 1 ? "小于1" : invoiceDetail.driverDto[i].driverAge,
                  tel:invoiceDetail.driverDto[i].mobile,
                  startJ :invoiceDetail.delivery.addressLatAndLon == ""||invoiceDetail.delivery.addressLatAndLon == null ? "" :invoiceDetail.delivery.addressLatAndLon.split(",")[0],
                  startW : invoiceDetail.delivery.addressLatAndLon == ""||invoiceDetail.delivery.addressLatAndLon == null ? "" :invoiceDetail.delivery.addressLatAndLon.split(",")[1],
                  endJ:invoiceDetail.arrival.addressLatAndLon == "" ||invoiceDetail.arrival.addressLatAndLon == null ? "" :invoiceDetail.arrival.addressLatAndLon.split(",")[0],
                  endW:invoiceDetail.arrival.addressLatAndLon == "" ||invoiceDetail.arrival.addressLatAndLon == null ? "" :invoiceDetail.arrival.addressLatAndLon.split(",")[1],
                  pkDriver:invoiceDetail.driverDto[i].pkDriver,
                  peopleJ:invoiceDetail.driverDto[i].driverPosition.split(",")[0],
                  peopleW:invoiceDetail.driverDto[i].driverPosition.split(",")[1],
                  ordertype:invoiceDetail.trackingStatusValue*1,
                  price:invoiceDetail.driverDto[i].score*1,
                  length:"",
                }
                _this.carList.push(json);
              }
              var data=pdlist;
              var listData=data;//模拟分页数据
              _this.pdlist = listData;
            }else{
              androidIos.second(invoiceDetail.message);
            }

          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            _this.carloading = false;
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        });
        Promise.all([ajax]).then(function(values) {
          androidIos.bridge(_this);
        })
      },
      shenhe:function () {
        var _this = this;
        if(_this.payStatus != 30 && _this.pdlist[0].pickPay.type == '现结'){
          _this.payOrder();
        }else{
          androidIos.loading("正在确认");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/orderConfirm",
            data:JSON.stringify({
              pk:_this.$route.query.pk,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            async:false,
            success: function (orderConfirm) {
              if(orderConfirm.success == "1"){
                _this.$cjj("确认成功");
                setTimeout(function () {
                  _this.ajaxorder();
                },500)
              }else{
                androidIos.second(orderConfirm.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              $("#common-blackBox").remove();
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }

      },
      mapLook:function () {
        var _this = this;
        _this.moveSure = true;
      },
      mapLookS:function () {
        var _this = this;
        _this.moveSure = !_this.moveSure;
      },
      filterInput:function () {
        var _this = this;
        _this.cancelreason = _this.cancelreason.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
        _this.scorereason = _this.scorereason.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
      },
      go:function () {
        var self = this;
        self.orderSource = self.$route.query.type;
        /*var centerJ = self.pdlist[0].ordertypeType ==*/
        var map = new AMap.Map("container", {
          resizeEnable: true,
          center: [self.startJ,  self.startW],//地图中心点
          zoom: 13 //地图显示的缩放级别
        });
        map.on("click",function () {
          self.mapLook();
        })
        AMap.plugin(['AMap.Scale'],
          function(){
            map.addControl(new AMap.Scale());
          });
        //构造路线导航类
        var driving = new AMap.Driving({
          map: map,
          panel: "panel"
        });
        driving.search([self.startJ, self.startW],[self.endJ,self.endW], function(status, result) {});
        for(var i = 0 ; i < self.carList.length;i++){
          var marker;
          marker = new AMap.Marker({
            icon:require('../../images/start1.png'),
            position: [self.carList[i].peopleJ,self.carList[i].peopleW],
          });
          marker.setMap(map);
        }
        self.$nextTick(function () {
          $(document).unbind("click").on("click",".scorelistscore .set_image_item",function () {
            var idname = $(this).parents(".scorelistscore").attr("id");
            var x = $(this).index("#"+idname+"  .set_image_item");
            $("#"+idname).html("");
            $("#"+idname).markingSystem({
              num: 5,
              havePoint: true,
              haveGrade: true,
              backgroundImageInitial:require('../../images/star_hollow.png'),
              backgroundImageOver:require('../../images/star_solid.png'),
              unit: '星',
              grade:x*1+1,
              height: 0.6* $("html").css("font-size").replace("px", ""),
              width: 0.6* $("html").css("font-size").replace("px", ""),
            });
            $("#"+idname+" .set_image_top").css("z-index",10);
          })
        })
      },
      compareDistanc: function(lnglat,dd) {
        var _this = this;
        var myDistance = lnglat.distance([_this.carList[dd].peopleJ, _this.carList[dd].peopleW]);//这里测量距离
        _this.carList[dd].length = (myDistance/1000).toFixed(3);
      },
      closedOrder:function (type) {
        var self = this;
        self.cancelReasonBox = true;
        if(self.cancelReason.length == 0 || self.closedType*1 != type ){
          self.closedType = type;
          var orderClosed = self.closedType == "1" ? "order_closed" : "reject_order";
          $.ajax({
            type: "GET",
            url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
            data:{str:orderClosed,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
            dataType: "json",
            timeout: 10000,
            success: function (getSysConfigList) {
              self.cancelReason = getSysConfigList;
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
        $("#errorwifeBox").remove();
      },
      pickMessage:function (m) {
        var _this = this;
        if(m != (_this.pick).toString()){
          _this.pick = !_this.pick;
        }
      },
      shengcheng:function () {
         var _this = this ;
          androidIos.second("此功能正在开发,敬请期待");
      },
      logisticsBoxDown:function () {
        var _this = this;
        _this.logisticsOk = !_this.logisticsOk;
      },
      errorAbnormalChangeImg:function () {
        if(bomb.hasClass("errorAbnormalChangeImg","gray")){
           bomb.removeClass("errorAbnormalChangeImg","gray");
        }else{
           bomb.addClass("errorAbnormalChangeImg","gray");
        }
      },
      cancelReasonClosed:function(){
        var _this = this;
        _this.cancelReasonBox = false;
        $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
      },
      scoreYes:function(type){
        var _this = this;
          _this.scoreList = [{
            name:"货物",
            score:"0"
          },{
            name:"司机",
            score:"0"
          },{
            name:"承运商",
            score:"0"
          }]
        _this.$nextTick(function () {
            _this.scoreBox = true;
            _this.scorereason = "";
            for(var i =0 ;i<_this.scoreList.length;i++){
              $("#star_grade00"+i).html("");
              $("#star_grade00"+i).markingSystem({
                num: 5,
                havePoint: false,
                haveGrade: false,
                backgroundImageInitial:require('../../images/star_hollow.png'),
                backgroundImageOver:require('../../images/star_solid.png'),
                unit: '星',
                grade:0,
                height: 0.6* $("html").css("font-size").replace("px", ""),
                width: 0.6* $("html").css("font-size").replace("px", ""),
              });
              $("#star_grade00"+i+" .set_image_top").css("z-index",10);
            }
        })
      },
      scoreClosed:function(){
        var _this = this;
        _this.scoreBox = false;
        _this.cancelreason = "";
      },
      cancelReasonClick:function(e){
        if(!this.hasClass(e.target,"errorPriceBoxLi")){
          $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
          this.addClass(e.target,"errorPriceBoxLi");
        }else{
          $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
        }
      },
      cancelReasonChange:function(){
        var _this = this;
        if(bomb.hasClass("gogogo","gogogo")){
          var list =[];
          for(var i =0;i<$("#cancelReasonBox .errorUl li").length;i++){
            if($("#cancelReasonBox .errorUl li").eq(i).hasClass("errorPriceBoxLi")){
              list.push({
                displayName:_this.cancelReason[i].displayName,
                value:_this.cancelReason[i].value
              });
            }
          }
          if(list.length == 0 && _this.cancelreason == ""){
            bomb.first("请选择关闭订单的理由！");
            return false;
          }
          bomb.removeClass("gogogo","gogogo");
          var closedtype = _this.closedType;
          var httpajax = closedtype == 1 ? "/order/closeOrder" : "/order/orderTurnDown";
          var json = closedtype == 1 ? {
            reason:list[0].value,
            cancelreason:_this.cancelreason,
            pk:_this.$route.query.pk,
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }:{
            mome:list[0].displayName + "," + _this.cancelreason,
            pk:_this.$route.query.pk,
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          };
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + httpajax,
            data:JSON.stringify(json),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            timeout: 10000,
            success: function (closeOrder) {
              bomb.addClass("gogogo","gogogo");
              if(closeOrder.success == "1"){
                _this.cancelReasonBox = false;
                $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
                _this.cancelreason = "";
                var orderMessage = _this.closedType == 1 ? "关闭成功" : "驳回成功";
                _this.$cjj(orderMessage);
                setTimeout(function () {
                   _this.ajaxorder();
                },500);
              }else{
                androidIos.second(closeOrder.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo","gogogo");
              if(status=='timeout'){//超时,status还有success,error等值的情况
                _this.cancelReasonBox = false;
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                _this.cancelReasonBox = false;
                androidIos.errorwife();
              }
            }
          })
        }else{
          bomb.first("请不要频繁点击");
        }

      },
      scoreChange:function(){
        var _this = this;
        if(bomb.hasClass("gogogo","gogogo")){
          var list = [];
          var zongNumber = 0;
          for(var i =0;i<_this.scoreList.length;i++){
            var json = {
              name:_this.scoreList[i].name,
              score: $("#star_grade00"+i).find(".grade").text().replace("分","")
            }
            zongNumber = zongNumber + json.score*1
            list.push(json)
          }
          var cjJson ={
            scoreList:JSON.stringify(list),
            average:(zongNumber/_this.scoreList.length).toFixed(1),
            scorereason:_this.scorereason,
            pk:_this.$route.query.pk,
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp()+"/order/clientAppraisal",
              data:JSON.stringify(cjJson),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 10000,
              success: function (clientAppraisal) {
                bomb.addClass("gogogo","gogogo");
                if(clientAppraisal.success == "1"){
                  _this.scoreBox = false;
                  _this.ajaxorder();
                }else{
                  androidIos.second(clientAppraisal.message);
                }
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                _this.cancelReasonBox = false;
                bomb.addClass("gogogo","gogogo");
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                }else if(status=='error'){
                  androidIos.errorwife();
                }
              }
            })

        }else{
          bomb.first("请不要频繁点击");
        }

      },
      telphone:function(tel){
        androidIos.telCall(tel);
      },
      payOrder:function () {
        var _this = this;
        bridge.invoke('payOrder',_this.$route.query.pk);
      },
      changeOrder:function(){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/newOrder',query:{pk:_this.$route.query.pk,type:1}});
      },
      orderAgain:function(type){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/newOrder',query:{pk:_this.$route.query.pk,type:type}});
      },
      addClass:function(obj,cls){//增加class
        var idJson = obj.className.split(" ");
        for(var i=0;i<idJson.length;i++){
          if(idJson[i]==cls){
            return false;
          }
        }
        idJson.push(cls);
        obj.className = idJson.join(" ");
        return true;
      },
      hasClass:function(obj,cls){//判断是不是有这个class
        var idJson = obj.className.split(" ");
        for(var i=0;i<idJson.length;i++){
          if(idJson[i]==cls){
            return true;
          }
        }
        return false;
      },
      goback:function () {
        var _this = this;
        androidIos.gobackFrom(_this);
      },
    }
  }
</script>

<style scoped>
  #orderLogisticsMore #dataList{
    width:100%;
  }
  .top{
    width:100%;
    min-height:1.8rem;
  }
  .top span{
    font-size: 0.45rem;
    color: white;
    position: absolute;
    top: 0.5rem;
    left: 1rem;
  }
  .top img{
    width:100%;
  }
  .message{
    width:94%;
    margin: 0.2rem auto 0 auto;
  }
  .goodsmessage{
    width:80%;
    padding: 0.4rem 10%;
    background: white;
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    margin-top: 0.4rem;
  }
  #robbingMore .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 1.2rem;
    height: auto;
  }
  .goodsmessage p{
    width:100%;
    font-size: 0.375rem;
    line-height:0.8rem ;
    color:#333;
  }
  .goodsmessage p span{
    font-size: 0.35rem;
    line-height: 0.8rem;
    color:#333;
    float: right;
  }
  .goodsmessage h1,.goodsmessage h2,.goodsmessage h3,.goodsmessage h4{
    width: 42%;
    padding-left: 8%;
    font-size: 0.375rem;
    min-height: 0.7rem;
    float: left;
    margin-top: 0.2rem;
    background-repeat: no-repeat;
    background-size: 0.375rem;
    background-position: 0 0.08rem;
    color:#666;
  }
  .goodsmessage h3 span{
    font-size: 0.375rem;
    color:#666;
  }
  .goodsmessage h1{
    background-image: url("../../images/trantype.png");
  }
  .goodsmessage h2{
    background-image: url("../../images/product.png");
  }
  .goodsmessage h3{
    background-image: url("../../images/weight.png");
  }
  .goodsmessage h4{
    background-image: url("../../images/price.png");
  }
  .goodsmessage h5{
    width:93%;
    padding:0.1rem 0 0.1rem 7%;
    font-size: 0.375rem;
    color:#666;
    line-height: 0.8rem;
    background-image: url("../../images/time.png");
    background-repeat: no-repeat;
    background-size: 0.375rem 0.375rem;
    background-position: 0 50%;
  }
  .goodsmessage h6{
    width:100%;
    padding:0.1rem 0;
    font-size: 0.32rem;
    color:#666;
  }
  .peoplemessage{
    width:100%;
    margin-top: 0.25rem;
    position: relative;

  }
  .peoplemessage p{
    width:100%;
    line-height: 0.8rem;
  }
  .peoplemessage h1{
    color:#333;
    font-size: 0.3125rem;
    line-height: 0.5rem;
  }
  .messageBox{
    float: left;
    width:80%;
    margin-bottom: 0.2rem;
  }
  .peoplemessage p span{
    color:#999;
    font-size: 0.35rem;
    margin-right: 0.5rem;
    font-weight: bold;
   /* padding: 0 0.2rem 0.1rem 0.2rem;
    margin-left: 0.2rem;*/
  }
  .colorFull{
    color:#2c9cff!important;
    border-bottom: 2px solid #2c9cff;
  }
  .insurance{
    width:90%;
    margin:0.4rem auto 0 auto;
    padding: 0.2rem 2%;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    border-radius: 0.2rem;
    background: white;
  }
  .insurance p{
    font-size: 0.35rem;
    color:#999;
    line-height: 0.8rem;
    float: left;
  }
  .insurance h1{
    font-size: 0.35rem;
    line-height: 0.8rem;
    color:#666;
    float: right;
  }
  .insurance h1 span{
    font-size: 0.35rem;
    color:#ff4e18;
    margin-left: 0.2rem;
  }
  .company,.carrier{
    width: 90%;
    padding: 0.2rem 2%;
    margin: 0.4rem auto 0 auto;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    border-radius: 0.2rem;
    background: white;
    position: relative;
  }
  .firstBox{
    float: left;
    position: absolute;
    top: 50%;
    margin-top: -0.9rem;
    width:1.8rem;
    height:1.8rem;
    overflow: hidden;
    border-radius: 50%;
    line-height: 1.8rem;
  }
  .firstBox img{
    width:100%;
    display: inline-block;
    vertical-align: middle;
  }
  .secondBox{
    width:50%;
    float: left;
    margin-top: 0.25rem;
    margin-left: 25%;
  }
  .thirdBox {
    width: 20%;
    float: right;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.56rem;
  }
  .carrier .thirdBox{
    margin-top: -0.75rem!important;
  }
  .thirdBox h6{
    height:1.12rem;
    font-size: 0.3125rem;
    color:#333;
    text-align: center;
    background-image: url("../../images/tel.png");
    background-repeat: no-repeat;
    background-size: 1.12rem 1.12rem;
    background-position: 50% 0%;
  }
  .secondBox p{
    font-size: 0.375rem;
    color:#333;
  }
  .secondBox p span{
    font-size: 0.375rem;
    color:#333;
  }
  .secondBox h1{
    font-size: 0.35rem;
    color:#333;
  }
  .secondBox h2,  .secondBox span{
    font-size: 0.35rem;
    color:#333;
    line-height: 0.7rem;
  }
  .secondBox h2 span{
    margin-left: 0.2rem;
  }
  .number{
    width:94%;
    margin: 0.6rem auto 0.4rem auto;
    font-size: 0.34rem;
    color:#999;
    line-height: 0.71rem;
  }
  #sure .go{
    margin-top: 0.2rem;
    padding-bottom: 1rem;
    padding-top: 1rem;
    background: white;
  }
  #sure button{
    width:1.86rem;
    background:transparent;
    border:1px solid #999999;
    margin-right: 0.53333rem;
    color:white;
    font-size: 0.32rem;
    color:#999;
    line-height: 0.73rem;
    border-radius: 0.2rem;
    float: right;
    min-height: 0rem;
  }
  .noYes{
    width:50%!important;
    float: left;
  }
  .colorBottom{
    background: #88c4ff!important;
  }
  .logisticsBox{
    background: white;
    margin: 0.3rem auto -1rem auto;
    padding-top: 0.3rem;
    width: 94%;
    border-radius: 0.12rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    overflow: scroll;
    height: auto!important;
    position: relative;
    z-index: 22;
  }
  .logisticsBoxDown{
    max-height: 7rem!important;
  }
  .logisticsBox li{
    width: 97%;
    margin-left: 3%;
    position: relative;
    min-height: 0.9rem;
  }
  .logisticsBox li .logisticsL{
     float: left;
     width:10%;
    position: absolute;
    height: 100%;
    left:15%;
  }
  .logisticsLL{
    float: left;
    width:15%;
    font-size: 0.3125rem;
    color:#999;
    line-height: 0.35rem;
    text-align: center;
  }
  .logisticsR{
    float: left;
    min-width:44%;
    max-width: 70%;
    margin-left: 10%;
    font-size: 0.3125rem;
    color:#999;
    line-height: 0.35rem;
  }
  .logisticsBox li img{
     width:0.35rem;
    float: left;
    margin:0.1rem 0 0 0.1rem!important;
  }
  .logisticsCircle{
    width:0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    margin:0 auto;
    background: rgba(228, 228, 228, 1);
  }
  .logisticsShuxian{
    width:1px;
    min-height:0.6rem;
    margin:0 auto;
    position: absolute;
    top:0.3rem;
    bottom: 0;
    height: auto;
    left: 50%;
    margin-left: -0.5px;
    background: rgba(228, 228, 228, 1);
  }
  .logisticsCircleFull{
    background: #3399FF!important;
  }
  .logisticsImg{
    -webkit-transform:scaleY(-1);
    transform:scaleY(-1);
  }
  .error{
    width: 96%;
    padding: 0.2rem 2%;
    margin-top: 0.2rem;
    background: white;
  }
  .errorFirst{
    width:48%;
    float: left;
    line-height: 1.5rem;
    font-size: 0.375rem;
    color:#333;
    text-align: center;
    background-image: url("../../images/error.png");
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 22% 50%;
  }
  .errorSecond{
    width:48%;
    float: right;
    line-height: 1.5rem;
    font-size: 0.375rem;
    color:#333;
    text-align: center;
    background-image: url("../../images/error.png");
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 22% 50%;
  }
  .errorLine{
    width:4%;
    height:1.5rem;
    float: left;
  }
  .errorLine div{
    width:1px;
    height:0.75rem;
    background: #dbdbdb;
    margin: 0.375rem auto;
  }
#scoreBox,#cancelReasonBox{
     width:100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    z-index:188;
    background-color:rgba(0,0,0,0.5);
  }
#score,#cancelReason{
    position: absolute;
    bottom:0;
    background: white;
    width:100%;
  }
  #scoreTitle p,#cancelReasonTitle p{
    width:100%;
    text-align: center;
    line-height: 1rem;
    font-size: 0.375rem;
    color:#999;
    position: relative;
  }
  #scoreTitle img,#cancelReasonTitle img{
    position: absolute;
    width:1rem;
    z-index: 1;
  }
  #errorAbnormal ul,.errorUl{
    width:90%;
    margin: 0.3rem auto;
    border-bottom: 1px solid #dbdbdb;
  }
  #errorAbnormal ul li,.errorUl li{
    width:48%;
    font-size: 0.3125rem;
    color:#666;
    text-align: center;
    line-height: 0.8rem;
    border: 1px solid #666;
    margin-top: 0.15rem;
    border-radius: 0.2rem;

  }
  #orderLogistics #mescroll{
    position: absolute;
    top:0;
    bottom:0;
    height: auto;
    width:100%;
    overflow: scroll;
  }
  .meBottom{
    bottom: 1.2rem!important;
  }
  #errorAbnormal ul input,.errorUl input{
    width:96%;
    padding: 0 2%;
    background: rgba(242, 242, 242, 1);
    line-height: 0.8rem;
    font-size: 0.3125rem;
    border-radius: 0.2rem;
    margin: 0.2rem 0;
  }
  #errorAbnormalChange,#errorPriceChange{
    width:90%;
    margin: 0.1rem auto;
  }
  #errorAbnormalChange span,#errorPriceChange span{
    font-size: 0.03125rem;
    color:#666;
    line-height: 0.8rem;
  }
  #errorAbnormalChange img,#errorPriceChange img{
     width:0.6rem;
    float: right;
    margin-top: 0.1rem;
  }
  #score button,#cancelReason button{
    width:96%;
    margin-left: 2%;
    border-radius: 0.3rem;
    background: #3399FF;
    color:white;
    font-size: 0.375rem;
    letter-spacing: 0.0625rem;
    line-height: 1rem;
    margin-bottom: 0.1rem;
  }
  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);

    filter: grayscale(100%);

    filter: gray;
  }
  .errorPriceBoxLi{
    border-color:#3399FF!important;
    color:#3399FF!important;
  }
  #carPeopleMessage{
    padding:0.2rem 3%;
    background: white;
    width: 94%;
    margin: 0 auto;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    position: relative;
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
  }
  #carPeopleMessage .imgBoxOverFllow{
    width:1.2rem;
    height:1.2rem;
    overflow: hidden;
    float: left;
    border-radius: 50%;
    line-height: 1.2rem;
    margin-top: 0.2rem;
  }
  #carPeopleMessage .imgBoxOverFllow img{
    display: inline-block;
    vertical-align: middle;
  }
  #carPeopleMessage .carPeopleMessage{
    float: left;
    margin-left: 0.3rem;
    margin-top: 0.1rem;
    position: relative;
    width:70%;
  }
  #carPeopleMessage .carPeopleMessage p{
    font-size: 0.3125rem;
    color:#333;
  }
  #carPeopleMessage .carPeopleMessage h1{
    font-size: 0.3125rem;
    color:#999;
  }
  #carPeopleMessage .tel{
    width: 1.5rem;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.56rem;
  }
  .containerImport{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  .panelImport {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none!important;
  }
  #carPeopleMessage .tel p{
    font-size: 0.3125rem;
    color:#333;
    text-align: center;
  }
  #carPeopleMessage .tel img{
    display: block;
    margin: 0 auto;
    width:1.12rem;
  }
  #evaluate{
    width:94%;
    background: white;
    margin: 0.4rem auto;
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
  }
  #evaluate span{
     line-height: 1.5rem;
     font-size: 0.35rem;
    margin-left: 0.3rem;
     color:#333;
    float: left;
  }
 .carPeopleMessage h2{
    font-size: 0.3125rem;
    color:#999;
    position: absolute;
    right:0;
    top:0;
  }
  .carPeopleMessage h2 span{
    font-size: 0.3125rem;
    color:#999;
  }
  #full_feature {
    padding-top: 0!important;
    width: 94%;
    margin: 0.4rem auto 0 auto!important;
  }
  #star_gradeS{
    float: left;
    margin-left: 0.3rem;
    margin-top: 0.55rem;
  }
  #evaluate img{
    float: right;
    width:0.25rem;
    margin-right: 0.3rem;
    margin-top: 0.524038rem;
  }
  #score ul{
     width:94%;
    padding: 0.2rem 3%;
  }
  #score ul p{
    float: left;
    width:1.3rem;
    line-height: 1rem;
    font-size: 0.37rem;
    color:#333;
  }
  #score ul .star_grade{
     margin: 0.2rem 0 00.2rem;
    float: left;
  }
  .errorAbnormalLeft{
    float:left;
  }
  .errorAbnormalRight{
    float: right;
  }
  .carPeopleMessageTitle{
     margin-top: 0.4rem!important;
    border-radius: 0.2rem;
  }
  .zhifu{
    display: block!important;
    background: #1D68A8!important;
    border-color: #1d68a8!important;
    color:white!important;
  }
  #titleText{
    position: absolute;
    width:66%;
    padding: 0 15%;
    line-height: 1.33rem;
    left:2%;
    top:0.72rem;
    background: white;
    font-size: 0.43rem;
    color:#666;
    border-radius: 0.3rem;
    z-index:99;
  }
  #titleText p{
    font-size: 0.43rem;
    color:#666;
  }
  #titleGoback{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    height: auto;
    width: 1.5rem;
    background-image: url("../../images/titlejian.png");
    background-position: 35% 50%;
    background-repeat: no-repeat;
    background-size: 0.2rem 0.3714rem;
  }
  #panel {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none!important;
  }
  #messageBigBox{
    position: absolute;
    bottom:0rem;
    width:100%;
    -webkit-transition: all 0.5s ease-in;
    -moz-transition: all 0.5s ease-in;
    transition: all 0.5s ease-in;
    opacity:1
  }
  .move {
    bottom: -15rem !important;
    opacity: 0 !important;
    -webkit-transition: all 1.5s ease-out !important;
    -moz-transition: all 1.5s ease-out !important;
    transition: all 1.5s ease-out !important;
  }
 #lookOrderMore{
   position: fixed;
   width: 1.5rem;
   height: 1.5rem;
   background-color: rgba(29,104,168,0.8);
   color: white;
   font-size: 0.35rem;
   border-radius: 50%;
   bottom: 15%;
   right: 5%;
   text-align: center;
   line-height: 1.5rem;
   letter-spacing: 2px;
   z-index: 100;
 }
  .callUs{
    position: absolute;
    top:0.2rem;
    right:0.4rem;
    color:#999;
    font-size: 0.3125rem;
    background-image: url("../../images/kefuicon.png");
    background-repeat: no-repeat;
    background-size:0.48rem ;
    background-position: 50% 0;
    line-height: 0.3125rem;
    padding: 0.6rem 0.4rem 0 0.4rem;
  }
  .callUsLine{
    position: absolute;
    left:0;
    top:50%;
    width:1px;
    height:0.6rem;
    margin-top: -0.3rem;
    background: #D8D8D8;
  }
</style>
