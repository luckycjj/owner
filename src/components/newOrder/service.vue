<template>
    <div id="service">
      <div id="title" v-title data-title="增值服务"></div>
      <ul>
        <!-- @click.stop="biaodan(index,$event)" -->
         <li v-for="(item,index) in serviceList" :class="index == serviceList.length - 1 ? 'borderno': ''">
           <span>{{item.displayName}}</span>
           <div class="circleBox" @click="readChoose(index)" :class="(item.check && index != 2 )|| (index == 2 && item.check && message.company != '' && message.shuihao != '' ) ? 'circletrue' : ''"> <div class="quanquan" v-if="(item.check && index != 2 )|| (index == 2 && item.check && message.company != '' && message.shuihao != '' )"></div></div>
           <div class="clearBoth"></div>
         </li>
      </ul>
     <!-- <div id="tabLook" v-if=" serviceList[2].check && message.company != '' && message.shuihao != ''">
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
          <p>公司地址</p>
          <h3>{{message.address}}</h3>
          <div class="clearBoth"></div>
        </div>
        <div class="tab" style="margin-top: 1px">
          <p>电话号码</p>
          <h3>{{message.phone}}</h3>
          <div class="clearBoth"></div>
        </div>
        <div class="tab" style="margin-top: 0.2rem;">
          <p>开户银行</p>
          <h3>{{message.bank}}</h3>
          <div class="clearBoth"></div>
        </div>
        <div class="tab" style="margin-top: 1px">
          <p>银行账号</p>
          <h3>{{message.bankNumber}}</h3>
          <div class="clearBoth"></div>
        </div>
        <div class="tab" style="margin-top: 0.2rem;">
          <p>联系电话</p>
          <h3>{{message.moblie}}</h3>
          <div class="clearBoth"></div>
        </div>
        <div class="tab" style="margin-top: 1px">
          <p>电子邮箱</p>
          <h3>{{message.email}}</h3>
          <div class="clearBoth"></div>
        </div>
      </div>-->
      <h1>如需纸质回单或拍照回单，签收时纸质签名，电子签名请务必清晰</h1>
      <transition name="slide-fade">
        <div id="fapiao" style="top:0rem" v-if="fapiao">
          <div id="fapiaoTop">
              <img src="../../images/closed2.png" id="imgClosed" style="top:0.4625rem;" @click="fapiaoFalse()">
              发票管理
          </div>
          <div class="tab" style="margin-top: 0.3rem;">
            <p>公司名称</p>
            <input type="text" maxlength="20" placeholder="请输入公司名称" v-model="message.company"/>
            <div class="clearBoth"></div>
          </div>
          <div class="tab" style="margin-top: 1px">
            <p class="w2">税号</p>
            <input type="text" placeholder="请输入税号" maxlength="20" v-model="message.shuihao"/>
            <div class="clearBoth"></div>
          </div>
          <div class="tab" style="margin-top: 0.2rem;">
            <p>公司地址</p>
            <input type="text" maxlength="20" placeholder="请输入公司地址(选填)" v-model="message.address"/>
            <div class="clearBoth"></div>
          </div>
          <div class="tab" style="margin-top: 1px">
            <p>电话号码</p>
            <input type="tel" placeholder="请输入电话号码(选填)" maxlength="11" v-model="message.phone"/>
            <div class="clearBoth"></div>
          </div>
          <div class="tab" style="margin-top: 0.2rem;">
            <p>开户银行</p>
            <input type="text" maxlength="20" placeholder="请输入开户银行名称(选填)" v-model="message.bank"/>
            <div class="clearBoth"></div>
          </div>
          <div class="tab" style="margin-top: 1px">
            <p>银行账号</p>
            <input type="tel" placeholder="请输入开户银行账号(选填)" maxlength="20" v-model="message.bankNumber"/>
            <div class="clearBoth"></div>
          </div>
          <div class="tab" style="margin-top: 0.2rem;">
            <p>联系电话</p>
            <input type="tel" placeholder="请输入您的联系电话(选填)" maxlength="11" v-model="message.moblie"/>
            <div class="clearBoth"></div>
          </div>
          <div class="tab" style="margin-top: 1px">
            <p>电子邮箱</p>
            <input type="email" maxlength="40" placeholder="请输入电子邮箱账号(选填)" v-model="message.email"/>
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
              address:"",
              phone:"",
              moblie:"",
              email:"",
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
            var _this = this;
               _this.getFa();
          },
        fapiaoFalse:function () {
          var _this = this;
          _this.fapiao = false;
          _this.chooseServiceBox();
        },
        readChoose:function (index) {
          var _this = this;
          _this.serviceList[index].check =  !_this.serviceList[index].check;
          _this.chooseServiceBox();
          /*if(index == 2 && _this.serviceList[index].check){
              _this.fapiao = true;
              _this.getFa();
              var fapiaoXinxi = sessionStorage.getItem("fapiaoXinxi");
              if(fapiaoXinxi != undefined){
                _this.message = JSON.parse(fapiaoXinxi);
              }
              _this.$nextTick(function () {
                androidIos.judgeIphoneX("fapiaoTop",0);
                androidIos.judgeIphoneX("imgClosed",2);
              })
          }*/
        },
        biaodan:function (index,e) {
            var _this = this;
           if(e.target.className.indexOf("circleBox") == -1 && e.target.className.indexOf("quanquan") == -1){
             if(index == 2){
               _this.fapiao = true;
               _this.getFa();
               var fapiaoXinxi = sessionStorage.getItem("fapiaoXinxi");
               if(fapiaoXinxi != undefined){
                 _this.message = JSON.parse(fapiaoXinxi);
               }
               _this.$nextTick(function () {
                 androidIos.judgeIphoneX("fapiaoTop",0);
                 androidIos.judgeIphoneX("imgClosed",2);
               })
             }
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
          if(_this.message.moblie != ""){
             if(!androidIos.telCheck(_this.message.moblie)){
               bomb.first("联系电话有误");
               return false;
             }
          }
          if(_this.message.phone != ""){
            if(!androidIos.telCheck(_this.message.phone)){
              bomb.first("电话号码有误");
              return false;
            }
          }
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/company/electronicBill",
            data:JSON.stringify({
              corpName:_this.message.company,
              taxNo:_this.message.shuihao,
              ifDefault:1,
              corpAddr:_this.message.address,
              phone:_this.message.phone,
              mobile:_this.message.moblie,
              email:_this.message.email,
              bank:_this.message.bank,
              bankAccount:_this.message.bankNumber,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (orderConfirm) {
              if(orderConfirm.success == "1"){
                _this.$cjj("保存成功");
                sessionStorage.setItem("servicePk",orderConfirm.errorCode);
                _this.fapiao = false;
                _this.serviceList[ _this.serviceList.length - 1].check = true;
                _this.getFa();
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
        },
        getFa:function () {
            var _this = this;
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/company/getElectronicBill",
            data:JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
              pk:sessionStorage.getItem("servicePk") != undefined ? sessionStorage.getItem("servicePk") : ""
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (getElectronicBill) {
              if(getElectronicBill.success == "1"){
                _this.message = {
                    company:getElectronicBill.corpName == undefined ? "" : getElectronicBill.corpName,
                    shuihao:getElectronicBill.taxNo == undefined ? "" : getElectronicBill.taxNo,
                    address:getElectronicBill.corpAddr == undefined ? "" : getElectronicBill.corpAddr,
                    phone:getElectronicBill.phone == undefined ? "" : getElectronicBill.phone,
                    moblie:getElectronicBill.mobile == undefined ? "" : getElectronicBill.mobile,
                    email:getElectronicBill.email == undefined ? "" : getElectronicBill.email,
                    bank:getElectronicBill.bank == undefined ? "" : getElectronicBill.bank,
                    bankNumber:getElectronicBill.bankAccount == undefined ? "" : getElectronicBill.bankAccount,
                }
              }else{
                androidIos.second(getElectronicBill.message);
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
