<template>
    <div id="searchDriver" style="top:1.3rem;">
      <div id="title" v-title data-title="搜索司机"></div>
      <div id="telphone">
        <div class="tabtitle">
          <p>手<br>机<br>号</p>
        </div>
        <div class="telBox">
            <div class="telBoxTop">
              <input type="tel" placeholder="请输入司机手机号" maxlength="11" v-model="tel" />
              <button @touchend="searchDriverList(1)">搜索</button>
              <div class="clearBoth"></div>
            </div>
          <div class="telBoxBottom">
            <p>从手机通讯录导入</p>
          </div>
        </div>
      </div>
      <div id="carno">
        <div class="tabtitle">
          <p>车<br>牌<br>号</p>
        </div>
        <div class="telBox">
          <div class="telBoxTop">
            <h6 @touchend="plateametrue()" >{{plateName}}</h6>
            <div id="carNumberBox" @touchend="keyboardshow()" :class="carNo.length == 7 ? 'carGreen' : carNo.length == 6 ?'carBrown' : ''" :style="{color:carNo == '' ? '#BCBCBC' : '#373737'}" v-html="carNo == '' ? '请输入司机车牌号' : carNo"></div>
            <button @touchend="searchDriverList(2)">搜索</button>
            <div class="clearBoth"></div>
          </div>
          <div class="telBoxBottom">
            <h1>搜索未注册欣阳物流的司机师傅时，他会收到我们的注册邀请，注册成功后他的车辆会直接加入熟车管理</h1>
          </div>
        </div>
      </div>
      <ul class="data-list">
        <li v-for="(items,indexs) in prolist" @click="lookCarmessage(items.carno)">
          <div class="first">
            <img :src="items.driverPicture == null ? '' : items.driverPicture" :onerror="errorlogo">
          </div>
          <div class="second">
            <p>{{items.driverName}}</p>
            <h1>{{items.carno}}<span style="margin-left: 0.187rem"><span v-if="items.carLength != null && items.carLength != ''">{{items.carLength}}米</span><span v-if="items.carLength != null && items.carLength != '' && items.carModel != null && items.carModel != ''">/</span><span v-if="items.carModel != null && items.carModel != ''">{{items.carModel}}</span></span></h1>
            <h2 v-if="items.location != null && items.location != ''">{{items.heartbeatTime | timeCheck}}&nbsp;&nbsp;定位：{{items.heartbeatAddr}}&nbsp;&nbsp;离我&nbsp;&nbsp;{{items.distance*1 | distanceWidth}}</h2>
            <h3 v-else>暂无位置信息</h3>
          </div>
          <div class="third">
            <div class="imgcaozuo" @click.stop="caozuo(1,items.location)">
              <img src="../../images/haveCarDingwei.png">
              <p>定位</p>
            </div>
            <div class="imgcaozuo" @click.stop="caozuo(2,items.driverCode)">
              <img src="../../images/haveCarTel.png">
              <p>电话</p>
            </div>
          </div>
          <div class="clearBoth"></div>
        </li>
      </ul>
      <transition name="slide-fade">
        <div v-if="carList" id="carListBox" @touchend="carListHideAgain($event)">
          <div id="carList">
            <p v-for="(item,index) in carTypeList" @touchend="carClick(index,item.region)" :class="item.code==2?'carCode':''">{{item.region}}</p>
            <button @touchend="carList=false"> 完成</button>
          </div>
        </div>
        <div v-if="keyboard" id="keyboardBox" @touchend="keyboardHideAgain($event)">
          <div id="keyboard">
            <p v-for="item in keyboardNumber" @touchend="carkeyboard(item.name)">{{item.name}}</p>
            <div class="clearBoth"></div>
            <p v-for="item in keyboardLetter.first" @touchend="carkeyboard(item.name)">{{item.name}}</p>
            <div class="clearBoth"></div>
            <div style="margin-left:0.500115rem" ><p v-for="item in keyboardLetter.second"   @touchend="carkeyboard(item.name)">{{item.name}}</p></div>
            <div class="clearBoth"></div>
            <div style="margin-left:1.500345rem" ><p v-for="item in keyboardLetter.third"   @touchend="carkeyboard(item.name)">{{item.name}}</p></div>
            <p class="keyRemove" @touchend="keyremove()"></p>
            <div class="clearBoth"></div>
            <p class="keyBlack"></p>
            <p class="keyBlack"></p>
            <p class="keySpace">space</p>
            <p class="keyOk" @touchend="keyboard=false">down</p>
          </div>
        </div>
        <div v-if="InvitationDriver" id="InvitationDriverBox">
             <div id="InvitationDriver">
               <p>温馨提示</p>
               <div class='InvitationDriver-class'>
                 <h3>暂无车辆司机</h3>
                 <!--<input type="tel" placeholder="司机联系方式" maxlength="11" v-model="drivertel"/>-->
                 <div class='clearBoth'></div>
               </div>
               <div class='InvitationDriver-button'>
                 <button class='InvitationDriver-close' @touchend="InvitationDriver = false;">取消</button>
                 <div class='InvitationDriver-shuxian'></div>
                 <button id='InvitationDriver-yes' class='InvitationDriver-yes InvitationDriver-yesGo' @touchend="InvitationDriverTrue()">确定</button>
               </div>
             </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import {shujvyuan} from '../../js/shujv'
    export default {
      name: "search-driver",
      data(){
          return{
            tel:"",
            drivertel:"",
            carNo:"",
            plateName:"沪",
            carTypeList:[],
            keyboardNumber:[],
            keyboardLetter:{
              first:[],
              second:[],
              third:[]
            },
            prolist:[],
            keyboard:false,
            carList:false,
            InvitationDriver:false,
            errorlogo: 'this.src="' + require('../../images/userImg.png') + '"',
          }
      },
      mounted:function () {
         var _this = this;
         androidIos.judgeIphoneX("searchDriver",2);
        _this.carTypeList = shujvyuan.first();
        _this.keyboardNumber = shujvyuan.forth();
        _this.keyboardLetter.first = shujvyuan.fifth().first;
        _this.keyboardLetter.second = shujvyuan.fifth().second;
        _this.keyboardLetter.third = shujvyuan.fifth().third;
        var carSearchList = sessionStorage.getItem("carSearchList");
        if(carSearchList != undefined){
          carSearchList = JSON.parse(carSearchList);
             _this.tel = carSearchList.tel;
            _this.drivertel = carSearchList.drivertel;
            _this.carNo = carSearchList.carNo;
            _this.plateName =carSearchList.plateName;
            _this.prolist = carSearchList.prolist;
          sessionStorage.removeItem("carSearchList");
        }
        androidIos.bridge(_this);
      },
      methods:{
        plateametrue:function () {
          var _this = this;
          _this.carList = true;
          for(var i=0;i<_this.carTypeList.length;i++){
            if( _this.plateName ==  _this.carTypeList[i].region){
              _this.carTypeList[i].code=2;
            }else{
              _this.carTypeList[i].code=1;
            }
          }
        },
        go:function () {
          $(document).unbind("touchstart").on("touchstart","#keyboardBox p",function () {
            $(this).css("background","#abb4bd");
            $(this).css("color","white");
          })
          $(document).unbind("touchend").on("touchend","#keyboardBox p",function () {
            $(this).css("background","white");
            $(this).css("color","#333");
          })
        },
        carClick:function (number,carname) {
          var _this = this;
          _this.plateName = carname;
          for(var i=0;i<_this.carTypeList.length;i++){
            _this.carTypeList[i].code=1;
          }
          _this.carTypeList[number].code=2;
        },
        lookCarmessage:function (carno) {
          var _this = this;
          if(JSON.parse(sessionStorage.getItem("ownerMessage")).status == 2){
            var json = {
              tel:_this.tel,
              drivertel:_this.drivertel,
              carNo:_this.carNo,
              plateName:_this.plateName,
              prolist:_this.prolist,
            }
            sessionStorage.setItem("carSearchList",JSON.stringify(json));
            androidIos.addPageList();
            _this.$router.push({path:"/carMessageMore",query:{carno:carno}});
          }else{
            androidIos.second("请认证通过后再试");
          }
        },
        caozuo:function (type,message) {
          var _this = this;
          var messageList =  sessionStorage.getItem("ownerMessage");
          if(JSON.parse(messageList).status == "2"){
            if(type == 1){
              if(message == "" || message == null){
                androidIos.second("暂无司机位置信息");
              }else{
                androidIos.addPageList();
                _this.$router.push({path:"/driverMap",query:{location:message}})
              }
            }else if(type == 2){
              androidIos.telCall(message);
            }else if(type == 3){
              androidIos.addPageList();
              var list = [];
              list.push(message);
              _this.$router.push({path:"/sendtextmessage",query:{driver:JSON.stringify(list)}});
            }else if(type == 4){
              androidIos.first("确认添加为熟车吗?");
              $(".tanBox-yes").unbind('click').click(function(){
                $(".tanBox-bigBox").remove();
                $.ajax({
                  type: "POST",
                  url: androidIos.ajaxHttp() + "/driver/collectCarAndDriver",
                  data:JSON.stringify({
                    pk:message,
                    userCode:sessionStorage.getItem("token"),
                    source:sessionStorage.getItem("source"),
                  }),
                  contentType: "application/json;charset=utf-8",
                  dataType: "json",
                  timeout: 30000,
                  success: function (collectCarAndDriver) {
                    if (collectCarAndDriver.success == "1") {
                      _this.$cjj("添加成功");
                      if(_this.mescrollArrList[1-_this.tabShow] != null){
                        _this.mescrollArrList[1-_this.tabShow] = null;
                        _this.tab[1-_this.tabShow].prolist = [] ;
                        $("#mescroll" + (1-_this.tabShow)).find(".mescroll-downwarp").remove();
                        $("#mescroll" + (1-_this.tabShow)).find(".mescroll-upwarp").remove();
                      }
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
            }
          }else{
            androidIos.second("请认证通过后再试！");
          }

        },
        carListHideAgain:function (even) {
          var el = even.target.id;
          if(el=="carListBox"){
            this.carList = false;
          }
        },
        keyboardshow:function () {
          var _this = this;
          _this.keyboard = true;
        },
        keyboardHideAgain:function (even) {
          var el = even.target.id;
          if(el=="keyboardBox"){
            this.keyboard = false;
          }
        },
        carkeyboard:function (name) {
          var _this = this;
          if(_this.carNo.length<7){
            _this.carNo = _this.carNo+name;
          }
        },
        keyremove:function () {
          var _this = this;
          if(_this.carNo!=""){
            var lenth = _this.carNo.length;
            if(lenth>0){
              _this.carNo = _this.carNo.substr(0,lenth-1);
            }
            if(_this.carNo.length==0){
              _this.carNo="";
            }
          }
        },
        searchDriverList:function (type) {
          var _this = this;
          if(type == 1){
            var reg = /^1([3|5|8][0-9]|4[5|7|9]|66|7[0|1|3|5|6|7|8]|9[8|9])[0-9]{8}$/;
            if(!reg.test(_this.tel)){
              bomb.first("手机号码格式不对");
              return false;
            }

          }else{
             if(_this.carNo.length < 6){
               bomb.first("请输入正确的车牌号");
               return false;
             }
          }
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/driver/accurateFindCarnoAndPhone",
            data:JSON.stringify({
              phone:type == 1 ?_this.tel : "",
              carno:type == 2 ? _this.plateName + _this.carNo : "",
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (accurateFindCarnoAndPhone) {
              if (accurateFindCarnoAndPhone.success == "1") {
                if(accurateFindCarnoAndPhone.list.length == 0){
                   androidIos.second("暂无车辆");
                 /*   _this.drivertel = type == 1 ? _this.tel : "";*/
                }else{
                   _this.prolist = accurateFindCarnoAndPhone.list;
                }
              }else{
                androidIos.second(accurateFindCarnoAndPhone.message);
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
        InvitationDriverTrue:function () {
          var _this = this;
          var reg = /^1([3|5|8][0-9]|4[5|7|9]|66|7[0|1|3|5|6|7|8]|9[8|9])[0-9]{8}$/;
          if(_this.drivertel == ""){
            bomb.first("请输入手机号码");
            return false;
          }
          if(!reg.test(_this.drivertel)){
            bomb.first("手机号码格式不对");
            return false;
          }
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/driver/inviteJoin",
            data:JSON.stringify({
              phone:_this.drivertel,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (inviteJoin) {
              if (inviteJoin.success == "1") {
                _this.InvitationDriver = false;
                _this.$cjj("邀请成功");
              }else{
                androidIos.second(inviteJoin.message);
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
        }
      }
    }
</script>

<style scoped>
   #searchDriver{
     position: absolute;
     top:1.3rem;
     bottom:0rem;
     width:100%;
     height: auto!important;
     background:#F5F5F5 ;
   }
   #telphone,#carno{
     width:9.48rem;
     background: white;
     margin: 0.28rem auto;
     position: relative;
   }
   .tabtitle{
     position: absolute;
     background: #46B2E7;
     width:1.17rem;
     top:0;
     bottom:0;
     height: auto;
   }
   .tabtitle p{
     position: absolute;
     width:1.17rem;
     text-align: center;
     color:white;
     font-size: 0.375rem;
     line-height:0.48rem ;
     background: #46B2E7;
     top:50%;
     margin-top:-0.72rem ;
   }
   #messageBody .tabtitle p{
     margin-top:-0.96rem ;
   }
  .telBox{
    width:8.31rem;
    margin-left: 1.17rem;
  }
  .telBoxTop{
    border-bottom: 1px solid #D8D8D8;
    padding-top:0.49rem;
    padding-bottom: 0.11rem;
  }
   .telBoxTop input{
     width:4rem;
     font-size: 0.4rem;
     color:#373737;
     padding-left: 0.26rem;
     float: left;
     line-height: 0.68rem;
   }
   #carNumberBox{
     width:4rem;
     font-size: 0.4rem;
     padding-left: 0.26rem;
     float: left;
     line-height: 0.68rem;
   }
   .telBoxTop button{
     width:1.47rem;
     font-size: 0.36rem;
     color:white;
     background: #46B2E7;
     float: right;
     margin-right:0.57rem ;
     line-height: 0.68rem;
     border-radius: 0.1rem;
   }
  .telBoxBottom{
    width:100%;
  }
  .telBoxBottom p{
     padding-left: 0.26rem;
    color:#46B2E7;
    font-size: 0.4rem;
    line-height: 1.31rem;
    width:3.7rem;
    background-image: url("../../images/tongxunlu-3.png");
    background-position: 100% 50%;
    background-size: 0.375rem;
    background-repeat: no-repeat;
  }
  .telBoxBottom h1{
    padding:0.2rem 0.26rem 0.427rem 0.26rem;
    color:#999;
    font-size: 0.4rem;
    line-height: 0.5rem;
  }
   #carListBox,#keyboardBox,#InvitationDriverBox{
     position: fixed;
     bottom:0;
     width:100%;
     top:0;
     height:auto;
     background: rgba(0,0,0,0);
     z-index: 10;
   }
   #InvitationDriverBox{
     background: rgba(0,0,0,0.3);
   }
   #carList,#keyboard{
     position: fixed;
     bottom:0;
     width:100%;
     height:5.2rem;
     overflow: hidden;
     background:#d4d9dc ;
     border-top: 1px solid #e9ebea;
   }
   #keyboard{
     height: 6.5rem;
   }
   #carList p,#keyboard p{
     float: left;
     width:0.87rem;
     height: 1.0687rem;
     text-align: center;
     line-height: 1.0687rem;
     background: white;
     box-shadow: 0 0.03125rem 0rem #999;
     margin: 0.1832rem 0.065rem 0 0.065rem;
     font-size: 0.375rem;
     border-radius: 0.18rem;
     color:#333;
   }
   #carList button{
     width: 2.8rem;
     height:1.1rem;
     margin: 0.1832rem 0.065rem 0 0.065rem;
     float: right;
     border-radius: 0.18rem;
     color:white;
     background: #3399FF;
     font-size: 0.375rem;
     letter-spacing: 0.0625rem;
   }
   .carCode{
     background: #3399FF!important;
     color:white!important;
   }
   .carnumber{
     color:#d2d2d2;
   }
   .carGreen{
     color:#5ad85a!important;
   }
   .carBrown{
     color:brown!important;
   }
   .keyRemove{
     background-color:#abb4bd!important;
     width: 1.0687rem!important;
     height: 1.0687rem!important;
     float: right!important;
     background-image: url("../../images/clone.png")!important;
     background-size:0.62977rem  0.458rem!important;
     background-repeat: no-repeat!important;
     background-position: 45% 50%!important;
   }
   .keyBlack{
     background:#abb4bd!important;
     width: 1.0687rem!important;
     height: 1.0687rem!important;
     line-height: 1.0687rem!important;
   }
   .keySpace{
     width: 4.86641rem!important;
     height: 1.0687rem!important;
     line-height: 1.0687rem!important;
   }
   .keyOk{
     background:#abb4bd!important;
     width: 2.309rem!important;
     height: 1.0687rem!important;
     line-height: 1.0687rem!important;
   }
   .addColor{
     background: red!important;
   }
   .telBoxTop h6{
     float: left;
     font-size: 0.375rem;
     padding-left: 0.5rem;
     background-image: url("../../images/addCar.png");
     background-size: 0.375rem 0.375rem;
     background-repeat: no-repeat;
     background-position: 0 50%;
     line-height: 0.68rem;
     margin-left: 0.26rem;
   }
   .slide-fade-enter-active {
     transition: all .2s ease;
   }
   .slide-fade-leave-active {
     transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
   }
   .slide-fade-enter, .slide-fade-leave-to
     /* .slide-fade-leave-active for below version 2.1.8 */ {
     transform: translateY(0.13rem);
     opacity: 0;
   }
  #InvitationDriver{
    width:7.1875rem;
    position: absolute;
    left:50%;
    margin-left: -3.59375rem;
    background: white;
    border: 0.03125rem solid #b1b1b1;
    border-radius: 0.25rem;
    top:30%;
    overflow: hidden;
  }
   #InvitationDriver p{
     width: 100%;
     line-height: 1rem;
     border-bottom: 0.03125rem solid #e0e0e0;
     font-size: 0.451rem;
     color:#333;
     text-align: center;
     letter-spacing: 0.03125rem;
   }
   .InvitationDriver-button{
     width:100%;
     height: 1.0625rem;
     border-top: 0.03125rem solid #e0e0e0;
   }
   .InvitationDriver-shuxian{
     width: 0.03125rem;
     height: 1.0625rem;
     float: left;
     background: #e0e0e0;
   }
   .InvitationDriver-button button,.InvitationDriver-buttonS button{
     height: 1.0625rem;
     width:3.578125rem;
     background: white;
     font-size: 0.44rem;
   }
   .InvitationDriver-close{
     color:#999999;
     float: left;
   }
   .InvitationDriver-yes{
     color:#1D68A8;
     float: right;
   }
   .InvitationDriver-class h3{
     text-align: center;
     font-size: 0.4rem;
     color:#666;
     width: 80%;
     margin-left: 10%;
     line-height: 0.6rem;
     padding: 0.3rem 0 0.5rem 0;
   }
  .InvitationDriver-class input{
     width:60%;
    display: block;
    margin: 0 auto;
    font-size: 0.4rem;
    color:#373737;
    text-align: center;
    line-height: 0.45rem;
    margin-bottom: 0.3rem;
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 0.2rem;
  }
   .data-list{
     position: absolute;
     bottom: 0;
     top:7rem;
     height: auto;
     overflow: scroll;
     width:100%;
   }
   .data-list li {
     background: white;
     border-top: 1px solid white;
     border-bottom: 1px solid #ececec;
     margin-top: 2px;
     position: relative;
   }
   .first{
     width:1rem;
     height: 1rem;
     overflow: hidden;
     border-radius: 50%;
     margin:0.45rem 0 0 0.347rem ;
     border-top: 1px solid white;
     float: left;
   }
   .first img{
     width:1rem;
     height:1rem;
   }
   .second{
     float: left;
     margin-left: 0.213rem;
     margin-top: 0.2rem;
   }
   .second p{
     font-size:0.4rem ;
     color:#373737;
     line-height:0.4rem ;
   }
   .second h1{
     font-size:0.347rem ;
     color:#373737;
     line-height:0.347rem ;
     margin-top: 0.15rem;
   }
   .second h2{
     font-size:0.3125rem ;
     color:#999;
     line-height:0.7rem ;
     background-image: url("../../images/haveCarDingweixiao.png");
     background-position: 0 50%;
     background-repeat: no-repeat;
     background-size: 0.25rem;
     padding-left: 0.4rem;
   }
   .second h3{
     font-size:0.3125rem ;
     color:#999;
     line-height:0.7rem ;
   }
   .second h1 span{
     font-size:0.347rem ;
     color:#1D68A8;
     line-height:0.347rem ;
   }
   .third{
     right:0;
     top:0.15rem;
     position: absolute;
   }
   .third .imgcaozuo{
     width:0.67rem;
     float: left;
     margin-right: 0.33rem;
   }
   .third img{
     width:0.67rem;
   }
   .third p{
     font-size: 0.3125rem;
     text-align: center;
     color:#1D68A8;
     margin-top:0.06rem ;
   }
</style>
