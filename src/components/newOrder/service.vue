<template>
    <div id="service">
      <div id="title" v-title data-title="增值服务"></div>
      <ul>
         <li v-for="(item,index) in serviceList" :class="index == serviceList.length - 1 ? 'borderno': ''">
           <span>{{item.displayName}}</span>
           <div class="circleBox" @touchend="readChoose(index)" :class="(item.check && index != 2 )|| (index == 2 && item.check && message.company != '' && message.shuihao != '' ) ? 'circletrue' : ''"> <div class="quanquan" v-if="(item.check && index != 2 )|| (index == 2 && item.check && message.company != '' && message.shuihao != '' )"></div></div>
           <div class="clearBoth"></div>
         </li>
      </ul>
      <div id="tabLook" v-if=" serviceList[2].check && message.company != '' && message.shuihao != ''">
        <div class="tab" style="margin-top: 0.3rem;">
          <p>公司名称</p>
          <h3>{{message.company}}</h3>
          <div class="clearBoth"></div>
        </div>
        <div class="tab" style="margin-top: 1px">
          <p class="w2">税号</p>
          <h3>{{message.shuihao}}</h3>
          <div class="clearBoth"></div>
        </div>
        <div class="tab" style="margin-top: 0.2rem;">
          <p>开户银行名称</p>
          <h3>{{message.bank}}</h3>
          <div class="clearBoth"></div>
        </div>
        <div class="tab" style="margin-top: 1px">
          <p>开户银行账号</p>
          <h3>{{message.bankNumber}}</h3>
          <div class="clearBoth"></div>
        </div>
      </div>
      <h1>如需纸质回单或拍照回单，签收时纸质签名，电子签名请务必清晰</h1>
      <transition name="slide-fade">
        <div id="fapiao" style="top:0rem" v-if="fapiao">
          <div id="fapiaoTop">
              <img src="../../images/closed2.png" id="imgClosed" style="top:0.4625rem;" @click="fapiaoFalse()">
              发票管理
          </div>
          <div class="tab" style="margin-top: 0.3rem;">
            <p>公司名称</p>
            <input type="text" placeholder="请输入公司名称" v-model="message.company"/>
            <div class="clearBoth"></div>
          </div>
          <div class="tab" style="margin-top: 1px">
            <p class="w2">税号</p>
            <input type="text" placeholder="请输入税号" maxlength="20" v-model="message.shuihao"/>
            <div class="clearBoth"></div>
          </div>
          <div class="tab" style="margin-top: 0.2rem;">
            <p>开户银行名称</p>
            <input type="text" placeholder="请输入开户银行名称" v-model="message.bank"/>
            <div class="clearBoth"></div>
          </div>
          <div class="tab" style="margin-top: 1px">
            <p>开户银行账号</p>
            <input type="tel" placeholder="请输入开户银行账号" maxlength="20" v-model="message.bankNumber"/>
            <div class="clearBoth"></div>
          </div>
          <button @click="saveFa()">保存发票信息</button>
        </div>
      </transition>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "service",
       data(){
          return{
             serviceList:[{
                value:"1",
                displayName:"拍照回单（免费）",
                check:false,
             },{
               value:"2",
               displayName:"纸质回单（免费）",
               check:false,
             },{
               value:"3",
               displayName:"开具电子发票",
               check:false,
             }],
            message:{
              company:"",
              shuihao:"",
              bank:"",
              bankNumber:"",
            },
            fapiao:false
          }
       },
      watch:{
        message:{
          handler:function(val,oldval){
            var _this = this;
            _this.message.company = _this.message.company.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\-]/g,'');
            _this.message.shuihao = _this.message.shuihao.replace(/[^\a-\z\A-\Z0-9]/g,'');
            _this.message.bank = _this.message.bank.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\-]/g,'');
            _this.message.bankNumber = _this.message.bankNumber.replace(/[^\0-9]/g,'');
          },
          deep:true
        }
      },
      mounted:function () {
         var _this = this;
         var newOrder = sessionStorage.getItem("newOrder");
         if(newOrder != undefined){
            var list = JSON.parse(newOrder).service.split(",");
            for(var i = 0 ; i < list.length ; i++){
               for(var x = 0 ; x < _this.serviceList.length;x++){
                  if(list[i] == _this.serviceList[x].displayName){
                    _this.serviceList[x].check = true;
                    break;
                  }
               }
            }
         }
        var fapiaoXinxi = sessionStorage.getItem("fapiaoXinxi");
        if(fapiaoXinxi != undefined){
          _this.message = JSON.parse(fapiaoXinxi);
        }
         androidIos.bridge(_this);
      },
      methods:{
          go:function () {

          },
        fapiaoFalse:function () {
          var _this = this;
          _this.message = {
              company:"",
              shuihao:"",
              bank:"",
              bankNumber:"",
          }
          _this.serviceList[2].check = false;
          var fapiaoXinxi = sessionStorage.getItem("fapiaoXinxi");
          if(fapiaoXinxi != undefined){
            _this.serviceList[2].check = true;
            _this.message = JSON.parse(fapiaoXinxi);
          }
          _this.fapiao = false;
          _this.chooseServiceBox();
        },
        readChoose:function (index) {
          var _this = this;
          _this.serviceList[index].check =  !_this.serviceList[index].check;
          _this.chooseServiceBox();
          if(index == 2 && _this.serviceList[index].check){
              _this.fapiao = true;
              var fapiaoXinxi = sessionStorage.getItem("fapiaoXinxi");
              if(fapiaoXinxi != undefined){
                _this.message = JSON.parse(fapiaoXinxi);
              }
              _this.$nextTick(function () {
                androidIos.judgeIphoneX("fapiaoTop",0);
                androidIos.judgeIphoneX("imgClosed",2);
              })
          }
        },
        chooseServiceBox:function () {
            var _this = this;
            var list=[];
            for(var i = 0 ; i <  _this.serviceList.length;i++){
              if(_this.serviceList[i].check){
                list.push(_this.serviceList[i].displayName);
              }
            }
            sessionStorage.setItem("serviceBox",list.join(","));
        },
        saveFa:function () {
          var _this = this;
          if(_this.message.company == ""){
            bomb.first("请填写公司名称");
            return false;
          }
          if(_this.message.shuihao == ""){
            bomb.first("请填写税号");
            return false;
          }
          sessionStorage.setItem("fapiaoXinxi",JSON.stringify(_this.message));
          _this.fapiao = false;
        }
      }
    }
</script>

<style scoped>
  #service{

    width:100%;
  }
  #service p{
    font-size: 0.4rem;
    color:#373737;
    margin-bottom: 0.2rem;
  }
  ul{
    width:100%;
    margin:0.267rem 0 ;
    background: white;
  }
  ul li {
     width:100%;
     border-bottom:1px solid #F5F5F5;
    position: relative;
  }
  li span{
    font-size: 0.3467rem;
    line-height: 1.32rem;
    margin-left: 0.3rem;
    color:#373737;
    float: left;
  }
  .borderno{
    border: none;
  }
  h1{
    width:9.28rem;
    margin-left: 0.36rem;
    font-size: 0.32rem;
    color:#999;
    margin-top: 0.1rem;
  }
 .circleBox{
    width:0.48rem;
    height: 0.48rem;
    border: 2px solid #ECECEC;
    position: absolute;
   top:50%;
   margin-top: -0.24rem;
   right:0.413rem;
   border-radius: 50%;
  }
  .circletrue{
    border: 2px solid #1869A9!important;
  }
  .quanquan{
     width:0.22rem;
    height: 0.22rem;
    border-radius: 50%;
    background: #1869A9;
    position: absolute;
    top:50%;
    left:50%;
    margin-top: -0.11rem;
    margin-left: -0.10rem;
    box-sizing: border-box;
  }
  #fapiao{
    position:fixed;
    top:0;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
    z-index: 11;
  }
  #fapiaoTop{
    width:100%;
    height: 1.3rem;
    background: white;
    text-align: center;
    line-height: 1.3rem;
    font-size: 0.426667rem;
    letter-spacing: 0.0133rem;
    color: #333;
    position: relative;
  }
  #fapiaoTop img{
    position: absolute;
    width:0.375rem;
    left:0.43rem;
    top:0.4625rem;

  }
  .tab{
    width: 94%;
    padding:0.4rem 3% ;
    background: white;
  }
  .tab p{
    float: left;
    font-size:0.35rem !important;
    line-height: 0.4rem;
    color:#373737;
    margin-bottom: 0!important;
  }
  .w2{
    letter-spacing:2em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-2）/(2-1)=2em */
    margin-right:-2em;
  }
  .tab input{
    float: left;
    margin-left: 0.4rem;
    height: 0.4rem;
    font-size: 0.35rem;
    width:6rem;
  }
  .tab h3{
    float: left;
    margin-left: 0.4rem;
    font-size:0.35rem ;
    line-height: 0.4rem;
    color:#373737;
  }
  #fapiao button{
    width:8.5rem;
    line-height:1.2rem ;
    background: #1D68A8;
    margin: 1.4rem auto 0 auto;
    display: block;
    color:#fafafa;
    border-radius:0.16rem ;
    font-size: 0.48rem;
  }
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(0.13rem);
    opacity: 0;
  }
</style>
