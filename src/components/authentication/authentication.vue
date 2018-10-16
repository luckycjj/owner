<template>
    <div id="authentication">
      <div id="title" v-title data-title="认证"></div>
      <ul id="step">
        <li v-for="(item,index) in step" :class="nowStep == ( index + 1) ? 'stepNowColor' : nowStep > (index + 1) ? 'stepBeforeColor' : nowStep < (index + 1) ? 'stepAfterColor' : '' ">
          <div class="stepNumber">
            <div :class="nowStep == ( index + 1) ? 'stepNow' : nowStep > (index + 1) ? 'stepBefore' : nowStep < (index + 1) ? 'stepAfter' : '' " class="line" style="margin-left: 0.05rem;" :style="{opacity: index == 0 ? '0' : '1'}"></div>
            <div :class="nowStep == ( index + 1) ? 'stepNow' : nowStep > (index + 1) ? 'stepBefore' : nowStep < (index + 1) ? 'stepAfter' : '' " class="circle">{{ index + 1}}</div>
            <div :class="nowStep == ( index + 1) ? 'stepNow' : nowStep > (index + 1) ? 'stepBefore' : nowStep < (index + 1) ? 'stepAfter' : '' " class="line" :style="{opacity: index == step.length - 1 ? '0' : '1'}"></div>
            <div class="clearBoth"></div>
          </div>
            {{item}}
        </li>
        <div class="clearBoth"></div>
      </ul>
      <div id="stepF" v-if="nowStep == 1">
        <div class="stepFtop">
          <p>请上传公司授权函</p>
          <div class="fileup">
            <img src="../../images/addImg.png" v-if="message.first.authorization.bendi == ''">
            <input type="file" @change="fileImgUp($event,0)">
            <img class="fileImg" :src="message.first.authorization.bendi" v-if="message.first.authorization.bendi != ''">
            <h6 v-if="message.first.authorization.bendi == ''">点击拍照</h6>
          </div>
          <img src="../../images/SQHlook.png" class="YYZZLook">
          <div class="clearBoth"></div>
        </div>
        <div class="stepFbottom">
          <h5>
            授权函须知：<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;授权函必须包含授权人姓名、身份证号<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;授权函有效日期、公司公章
          </h5>
        </div>
      </div>
      <div id="stepS" v-if="nowStep == 2">
        <div class="stepStop">
          <p>请上传营业执照</p>
          <div class="fileup">
            <img src="../../images/addImg.png" v-if="message.second.businesslicense.bendi == ''">
            <input type="file" @change="fileImgUp($event,1)">
            <img class="fileImg" :src="message.second.businesslicense.bendi" v-if="message.second.businesslicense.bendi != ''">
            <h6 v-if="message.second.businesslicense.bendi == ''">点击拍照</h6>
          </div>
          <img src="../../images/YYZZLook.png" class="YYZZLook">
          <div class="clearBoth"></div>
        </div>
        <div class="stepSbottom">
           <ul>
             <li>
               <span>公司名称：</span>
               <input type="text" placeholder="请输入公司名称" v-model="message.second.companyName" maxlength="50"/>
               <div class="clearBoth"></div>
             </li>
             <li>
               <span>社会信用代码：</span>
               <input type="text" placeholder="请真实填写" v-model="message.second.creditcode" maxlength="18"/>
               <div class="clearBoth"></div>
             </li>
             <li>
               <span>公司地址：</span>
               <p id="X00" :class="message.second.companyCity != '' ? 'blackColor' : '' " v-html="message.second.companyCity == '' ? '选择省市区' : message.second.companyCity"></p>
               <div class="clearBoth"></div>
             </li>
             <li class="borderno">
               <span>详细地址：</span>
               <input type="text" placeholder="请输入街道门牌号" v-model="message.second.companyAddress" maxlength="100"/>
               <div class="clearBoth"></div>
             </li>
           </ul>
        </div>
      </div>
      <div id="stepT" v-if="nowStep == 3">
        <div class="stepTtop">
          <p>请拍摄五官清晰头像照</p>
          <div class="fileup3">
            <img src="../../images/addImg.png" v-if="message.third.people.bendi == ''">
            <input type="file" @change="fileImgUp($event,2)">
            <img class="fileImg3" :src="message.third.people.bendi" v-if="message.third.people.bendi != ''">
            <h6 v-if="message.third.people.bendi == ''">点击拍照</h6>
          </div>
          <img src="../../images/ALEX.png" class="SFZLook">
          <div class="clearBoth"></div>
        </div>
        <div class="stepTtop">
          <p>请拍摄本人身份证正面照</p>
          <div class="fileup2">
            <img src="../../images/addImg.png" v-if="message.third.idCardZ.bendi == ''">
            <input type="file" @change="fileImgUp($event,3)">
            <img class="fileImg2" :src="message.third.idCardZ.bendi" v-if="message.third.idCardZ.bendi != ''">
            <h6 v-if="message.third.idCardZ.bendi == ''">点击拍照</h6>
          </div>
          <img src="../../images/SFZZ.png" class="SFZFLook">
          <div class="clearBoth"></div>
        </div>
        <div class="stepTtop">
          <p>请拍摄本人身份证反面照</p>
          <div class="fileup2">
            <img src="../../images/addImg.png" v-if="message.third.idCardF.bendi == ''">
            <input type="file" @change="fileImgUp($event,4)">
            <img class="fileImg2" :src="message.third.idCardF.bendi" v-if="message.third.idCardF.bendi != ''">
            <h6 v-if="message.third.idCardF.bendi == ''">点击拍照</h6>
          </div>
          <img src="../../images/SFZF.png" class="SFZFLook">
          <div class="clearBoth"></div>
        </div>
        <div class="stepTbottom">
          <ul>
            <li>
              <span>姓名：</span>
              <input type="text" placeholder="请输入姓名" v-model="message.third.name" maxlength="50"/>
              <div class="clearBoth"></div>
            </li>
            <li class="borderno">
              <span>身份证号：</span>
              <input type="text" placeholder="请真实填写" v-model="message.third.idCode" maxlength="18"/>
              <div class="clearBoth"></div>
            </li>
          </ul>
        </div>
      </div>
      <h5 class="calltel">有问题请联系客服</h5>
      <button @click="goNext()" v-html="nowStep == 1 || nowStep == 2 ? '下一步': '提交'"></button>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import  {provinceCityArea} from "../../js/provinceCityArea"
    export default {
        name: "authentication",
        data(){
          return{
             step:["关系证明","公司信息","个人信息"],
             nowStep:1,
             message:{
                first:{
                  authorization : {
                     bendi:"",
                     http:"",
                  },
                },
               second:{
                 businesslicense : {
                   bendi:"",
                   http:"",
                 },
                 companyName:"",
                 creditcode:"",
                 companyCity:"",
                 companyAddress:"",
               },
               third:{
                  people:{
                    bendi:"",
                    http:"",
                  },
                 idCardZ:{
                   bendi:"",
                   http:"",
                 },
                 idCardF:{
                   bendi:"",
                   http:"",
                 },
                 name:"",
                 idCode:""
               }
             }
          }
        },
      mounted:function () {
        var _this = this;
        androidIos.bridge(_this);
      },
       methods:{
          go:function(){
             var _this = this;
             _this.$nextTick(function () {
                 _this.showBefore();
             })
          },
         showBefore:function () {
           var _this = this;
           if(_this.nowStep == 1){
             document.getElementById("authenticationTab").style.display = "none";
           }else{
             document.getElementById("authenticationTab").style.display = "block";
             document.getElementById("authenticationTab").onclick = function () {
               _this.nowStep --;
               _this.showBefore();
               if(_this.nowStep == 2){
                 _this.$nextTick(function () {
                   _this.area();
                 })
               }
             };
           }
         },
         goNext:function () {
           var _this = this;
           if(_this.nowStep == 1 && (_this.message.first.authorization.bendi == "" ||  _this.message.first.authorization.http == "")){
             bomb.first("请上传公司授权函");
             return false;
           }
           if(_this.nowStep == 2){
             if(_this.message.second.businesslicense.bendi == "" || _this.message.second.businesslicense.http == ""){
               bomb.first("请上传营业执照");
               return false;
             }
             if(_this.message.second.companyName == ""){
               bomb.first("请填写公司名称");
               return false;
             }
             if(!androidIos.CheckSocialCreditCode(_this.message.second.creditcode)){
               bomb.first("请填写正确的社会信用代码");
               return false;
             }
             if(_this.message.second.companyCity == ""){
               bomb.first("请选择公司地址");
               return false;
             }
             if(_this.message.second.companyAddress == ""){
               bomb.first("请填写详细地址");
               return false;
             }
           }
           if(_this.nowStep == 3){
             if(_this.message.third.people.bendi == "" || _this.message.third.people.http == ""){
               bomb.first("请拍摄头像照");
               return false;
             }
             if(_this.message.third.idCardZ.bendi == "" || _this.message.third.idCardZ.http == ""){
               bomb.first("请拍摄身份证正面");
               return false;
             }
             if(_this.message.third.idCardF.bendi == "" || _this.message.third.idCardF.http == ""){
               bomb.first("请拍摄身份证反面");
               return false;
             }
             if(_this.message.third.name == ""){
               bomb.first("请填写姓名");
               return false;
             }
             if(!androidIos.idCardCheck(_this.message.third.idCode)){
               bomb.first("请填写正确的身份证号");
               return false;
             }
           }
           if(_this.nowStep < 3){
             _this.nowStep ++ ;
             _this.showBefore();
           }
           if(_this.nowStep == 2){
              _this.$nextTick(function () {
                 _this.area();
              })
           }
         },
         area:function(){
          var _this = this;
         var x = 0,y = 0,z = 0;
         if(_this.message.second.companyCity != "") {
           for(var i = 0; i< provinceCityArea.length;i++){
             if(provinceCityArea[i].region == _this.message.second.companyCity.split("-")[0]){
               x = i;
               for(var a = 0; a < provinceCityArea[i].child.length;a++){
                 if( provinceCityArea[i].child[a].region == _this.message.second.companyCity.split("-")[1]){
                   y = a;
                   for(var b = 0; b < provinceCityArea[i].child[a].child.length;b++){
                     if( provinceCityArea[i].child[a].child[b].region == _this.message.second.companyCity.split("-")[2]){
                       z = b;
                     }
                   }
                 }
               }
             }
           }
         }
         var area = new LArea();
         area.init({
           'trigger': '#X00',
           'valueTo': '#X00',
           'keys': {
             id: 'id',
             name: 'name'
           },
           'type': 1,
           'data': provinceCityArea
         });
         area.value = [x,y,z];
         area.addPointer = function (name) {
           name = JSON.parse(name);
           _this.message.second.companyCity = name.firstVal + "-" + name.secondVal + "-" + name.thirdVal;
         }
       },
         fileImgUp:function (e,type) {
           var _this = this;
           for (var i = 0; i < e.target.files.length; i++) {
             _this.compress(_this.getObjectURL(e.target.files[i]),"1000","1000",type);
           }
           e.target.value = "";
         },
         getObjectURL:function(file) {
           var url = null;
           if (window.createObjectURL != undefined) { // basic
             url = window.createObjectURL(file);
           } else if (window.URL != undefined) { // mozilla(firefox)
             url = window.URL.createObjectURL(file);
           } else if (window.webkitURL != undefined) { // webkit or chrome
             url = window.webkitURL.createObjectURL(file);
           }
           return url;
         },
         compress:function(img, MaximgW, MaximgH,type) {
           var _this = this;
           var image = new Image();
           image.src = img ;
           var imageWidth =  "";
           var imageHeight = "";
           image.onload = function () {
             var canvas = document.createElement('canvas');
             if (image.width < MaximgW && image.height < MaximgH) {
               imageWidth = image.width;
               imageHeight = image.height;
             } else {
               if (image.width > image.height) {
                 imageWidth = MaximgW;
                 imageHeight = MaximgW * (image.height / image.width);
               } else if (image.width < image.height) {
                 imageHeight = MaximgH;
                 imageWidth = MaximgH * (image.width / image.height);
               } else {
                 imageWidth = MaximgW;
                 imageHeight = MaximgH;
               }
             }
             canvas.width = imageWidth;
             canvas.height = imageHeight;
             var con = canvas.getContext('2d');
             con.clearRect(0, 0, canvas.width, canvas.height);
             con.drawImage(image, 0, 0, imageWidth, imageHeight);
             var base64 = canvas.toDataURL('image/jpeg', 0.5).substr(0);
             androidIos.loading("正在上传");
             $.ajax({
               type: "POST",
               url: androidIos.ajaxHttp() + "/uploadFile",
               data:JSON.stringify({
                 type: type == 0 ? "SQH" : type == 1 ? "YY" : type == 2 ? "PP" : type == 3 ? "SFZZ" : type == 4 ? "SFZF": "",
                 name:"",
                 file: base64.substr(23),
                 userCode:sessionStorage.getItem("token"),
                 source:sessionStorage.getItem("source")
               }),
               contentType: "application/json;charset=utf-8",
               dataType: "json",
               timeout: 30000,
               success: function (json) {
                 if (json.success == "1") {
                   if(type == 0){
                     _this.message.first.authorization.bendi = base64;
                     _this.message.first.authorization.http = json.path;
                   }else if(type == 1){
                     _this.message.second.businesslicense.bendi = base64;
                     _this.message.second.businesslicense.http = json.path;
                   }else if(type == 2){
                     _this.message.third.people.bendi = base64;
                     _this.message.third.people.http = json.path;
                   }else if(type == 3){
                     _this.message.third.idCardZ.bendi = base64;
                     _this.message.third.idCardZ.http = json.path;
                   }else if(type == 4){
                     _this.message.third.idCardF.bendi = base64;
                     _this.message.third.idCardF.http = json.path;
                   }
                 } else{
                   androidIos.second(json.message);
                 }
               },
               complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                 $("#common-blackBox").remove();
                 if (status == 'timeout') { //超时,status还有success,error等值的情况
                   androidIos.second("当前状况下网络状态差，请检查网络！")
                 } else if (status == "error") {
                   androidIos.errorwife();
                 }
               }
             });
           }
         },
       }
    }
</script>

<style scoped>
#authentication{
  position: absolute;
  top:1.3rem;
  bottom:0;
  background: #f6f6f6;
  height: auto;
  width:100%;
  overflow-y: scroll;
}
  #step{
    width:9.12rem;
    margin:0.56rem auto 0.48rem auto;
  }
#step li{
   width:3.04rem;
   float: left;
  text-align: center;
  color:#999;
  font-size: 0.35rem;
}
.stepNumber{
  margin-bottom: 0.467rem;
}
  #step .line{
     width:1.12rem;
     height:0.05rem;
     background: #e7e6e7;
     float: left;
     margin-top: 0.225rem;
  }
#step .circle{
  width:0.5rem;
  height:0.5rem;
  line-height: 0.5rem;
  background: #e7e6e7;
  color:white;
  border-radius: 50%;
  float: left;
  margin:0 0.1rem;
}
  .stepNow{
     background: #2c9cff!important;
  }
  .stepBefore{
    background: #90caf6!important;
  }
  .stepAfter{
    background: #e7e6e7!important;
  }
.stepNowColor{
  color: #2c9cff!important;
}
.stepBeforeColor{
  color: #90caf6!important;
}
.stepAfterColor{
  color: #999!important;
}
  .stepFtop,.stepFbottom,.stepStop,.stepTtop{
    width:76%;
    padding: 0.5rem 12%;
    background: white;
  }
.stepFbottom {
  margin-top: 0.0625rem;
  min-height: 5.3rem;
}
  .stepFtop p,.stepFbottom  h5,.stepStop p,.stepTtop p{
    color:#999999;
    font-size:0.4rem ;
  }
  .fileup,.fileup2,.fileup3{
    width:2.53rem;
    height:3.67rem ;
    background:#F4F5F6 ;
    margin-top: 0.467rem;
    border:1px solid #fff;
    float: left;
    position: relative;
  }
  .fileImg{
    width:2.53rem!important;
    height:3.67rem ;
    position: relative;
    margin: 0 !important;
  }
  .fileImg3{
    width:2.53rem!important;
    height:2.53rem!important ;
    position: relative;
    margin: 0 !important;
  }
  .fileImg2{
    width:4.14rem!important;
    height:2.53rem!important ;
    position: relative;
    margin: 0 !important;
  }
.fileup input,.fileup2 input,.fileup3 input{
  position: absolute;
  width:100%;
  height: 100%;
  opacity: 0;
  top:0;
  left:0;
  z-index: 11;
}
  .fileup2{
    width:4.14rem;
    height:2.53rem ;
  }
.fileup3{
  width:2.53rem;
  height:2.53rem ;
}
.borderno{
  border:none!important;
}
.fileup img{
  width:1.17rem;
  margin:1.25rem auto 0 auto;
}
.fileup2 img,.fileup3 img{
  width:1.17rem;
  margin:0.6rem auto 0 auto;
}
.fileup h6{
  text-align: center;
  color:#999;
  font-size:0.3125rem ;
  margin-top: 0.47rem;
}
.fileup2 h6,.fileup3 h6{
  text-align: center;
  color:#999;
  font-size:0.3125rem ;
  margin-top: 0.21rem;
}
  .YYZZLook{
     float: left;
     width:2rem;
     margin-left: 0.56rem;
     margin-top:1.28rem;
  }
  .SFZLook{
    float: left;
    width:2rem;
    margin-left: 0.56rem;
    margin-top:1.28rem;
  }
  .SFZFLook{
    float: left;
    width:2.84rem;
    margin-left: 0.56rem;
    margin-top:1.28rem;
  }
  .calltel{
    font-size: 0.3125rem;
    text-align: center;
    color:#546C98;
    width: 2.7rem;
    padding-right: 0.5rem;
    display: block;
    margin: 0.21rem auto 0 auto;
    background-repeat: no-repeat;
    background-size: 0.4rem 0.4rem;
    background-position: 100% 50%;
    background-image: url("../../images/kefuicon.png");
    line-height: 0.5rem;
  }
  button{
    width:9.1rem;
    display: block;
    color:white;
    border-radius: 0.2rem;
    margin:0.4rem auto;
    background-image: url("../../images/backgroundJB.png");
    background-repeat: repeat-y;
    background-size: 9.1rem;
    font-size: 0.427rem;
    line-height: 1.08rem;
  }
.stepSbottom,.stepTbottom{
   width:100%;
  background: white;
  margin-top: 0.24rem;
}
  .stepSbottom ul,.stepTbottom ul{
     width:100%;
  }
.stepSbottom ul li,.stepTbottom ul li{
    height: 1.33rem;
   width:100%;
  border-bottom: 1px solid #e5e5e5;
}
.stepSbottom ul li span,.stepTbottom ul li span{
  float: left;
  line-height: 1.33rem;
   font-size:0.426rem ;
  color:#333;
  margin-left: 0.56rem;
}
.stepSbottom ul li input,.stepTbottom ul li input{
  float: right;
  line-height: 0.45rem;
  margin-top:0.44rem ;
  font-size:0.426rem ;
  color:#333;
  width:6.15rem;
  margin-right: 0.2rem;
}
  #X00{
    float: right;
    line-height: 0.45rem;
    margin-top:0.44rem ;
    font-size:0.426rem ;
    color:#BCBCBC;
    width:6.15rem;
    margin-right: 0.2rem;
  }
  .blackColor{
    color: #333333!important;
  }
</style>
