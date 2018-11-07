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
              <button @click="searchDriverList(1)">搜索</button>
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
            <h6 @click="carList=true" >{{plateName}}</h6>
            <div id="carNumberBox" @click="keyboardshow()" :class="carNo.length == 7 ? 'carGreen' : carNo.length == 6 ?'carBrown' : ''" :style="{color:carNo == '' ? '#BCBCBC' : '#373737'}" v-html="carNo == '' ? '请输入司机车牌号' : carNo"></div>
            <button @click="searchDriverList(2)">搜索</button>
            <div class="clearBoth"></div>
          </div>
          <div class="telBoxBottom">
            <h1>搜索未注册欣阳物流的司机师傅时，他会收到我们的注册邀请，注册成功后他的车辆会直接加入熟车管理</h1>
          </div>
        </div>
      </div>
      <div v-if="carList" id="carListBox" @click="carListHideAgain($event)">
        <div id="carList">
          <p v-for="(item,index) in carTypeList" @click="carClick(index,item.region)" :class="item.code==2?'carCode':''">{{item.region}}</p>
          <button @click="carList=false"> 完成</button>
        </div>
      </div>
      <div v-if="keyboard" id="keyboardBox" @click="keyboardHideAgain($event)">
        <div id="keyboard">
          <p v-for="item in keyboardNumber" @click="carkeyboard(item.name)">{{item.name}}</p>
          <div class="clearBoth"></div>
          <p v-for="item in keyboardLetter.first" @click="carkeyboard(item.name)">{{item.name}}</p>
          <div class="clearBoth"></div>
          <div style="margin-left:0.500115rem" ><p v-for="item in keyboardLetter.second"   @click="carkeyboard(item.name)">{{item.name}}</p></div>
          <div class="clearBoth"></div>
          <div style="margin-left:1.500345rem" ><p v-for="item in keyboardLetter.third"   @click="carkeyboard(item.name)">{{item.name}}</p></div>
          <p class="keyRemove" @click="keyremove()"></p>
          <div class="clearBoth"></div>
          <p class="keyBlack"></p>
          <p class="keyBlack"></p>
          <p class="keySpace">space</p>
          <p class="keyOk" @click="keyboard=false">down</p>
        </div>
      </div>
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
            carNo:"",
            plateName:"沪",
            carTypeList:[],
            keyboardNumber:[],
            keyboardLetter:{
              first:[],
              second:[],
              third:[]
            },
            keyboard:false,
            carList:false,
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
        androidIos.bridge(_this);
      },
      methods:{
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
            if(!reg.test(tel)){
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
                console.log(accurateFindCarnoAndPhone)
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
  }
  .telBoxBottom h1{
    padding:0.2rem 0.26rem 0.427rem 0.26rem;
    color:#999;
    font-size: 0.4rem;
    line-height: 0.5rem;
  }
   #carListBox,#keyboardBox{
     position: fixed;
     bottom:0;
     width:100%;
     top:0;
     height:auto;
     background: rgba(0,0,0,0);
     z-index: 10;
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
</style>
