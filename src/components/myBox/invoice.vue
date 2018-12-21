<template>
    <div id="invoice" style="top:1.3rem">
      <div id="title" v-title data-title="开具发票"></div>
      <p>请选择发票类型</p>
      <ul>
        <li v-for="(item,index) in both.invoiceList" @click="checkYes(index)" :style="{float:index % 2 == 0 ? 'left' : 'right'}" :class="item.check ? 'checked' : ''">
            {{item.name}}
        </li>
        <div class="clearBoth"></div>
        <h1>
            电子发票与纸质发票具有同等法律效力，可支持报销入账
        </h1>
      </ul>
      <p>发票详情</p>
      <div class="body">
        <div class="lable">
          <h2>发票抬头</h2>
          <input type="text" maxlength="20" placeholder="填写发票抬头" v-model="both.invoicerise"/>
          <div class="clearBoth"></div>
        </div>
        <div class="lable">
          <h2 class="w2">税号</h2>
          <input type="text" maxlength="20" placeholder="填写纳税人识别号" v-model="both.dutyparagraph"/>
          <div class="clearBoth"></div>
        </div>
        <div class="lable">
          <h2>发票内容</h2>
          <h3>{{both.content}}</h3>
          <div class="clearBoth"></div>
        </div>
        <div class="lable borderno">
          <h2>发票金额</h2>
          <h3><span>{{both.price}}</span>元</h3>
          <div class="clearBoth"></div>
        </div>
      </div>
      <div class="body" style="margin-top: 0.2rem;">
        <div class="lable borderno">
          <h2>更多信息</h2>
          <div @click="lookMore()" class="lookMore" :class="both.moremessage.memo + both.moremessage.address + both.moremessage.bank == '' ? 'font' : ''" v-html="both.moremessage.memo + both.moremessage.address + both.moremessage.bank == '' ? '填写备注，地址等(非必填)' : both.moremessageList.join(',') ">
          </div>
          <div class="clearBoth"></div>
        </div>
      </div>
      <div class="body" style="margin-top: 0.2rem;" v-if="both.invoiceList[0].check">
        <div class="lable borderno">
          <h2>电子邮箱</h2>
          <input maxlength="40" type="email" placeholder="填写邮箱信息" v-model="both.email"/>
          <div class="clearBoth"></div>
        </div>
      </div>
      <p  v-if="both.invoiceList[1].check">接收方式</p>
      <div class="body" v-if="both.invoiceList[1].check">
        <div class="lable">
          <h2 class="w3">收件人</h2>
          <input  maxlength="20" type="text" placeholder="填写收件人名字" v-model="both.addresseename"/>
          <div class="clearBoth"></div>
        </div>
        <div class="lable">
          <h2>联系电话</h2>
          <input type="tel" placeholder="填写收件人联系电话" maxlength="11" v-model="both.tel"/>
          <div class="clearBoth"></div>
        </div>
        <div class="lable borderno">
          <h2>详细地址</h2>
          <input   maxlength="40" type="text" placeholder="填写详细地址" v-model="both.address"/>
          <div class="clearBoth"></div>
        </div>
      </div>
      <p  v-if="both.invoiceList[1].check">邮寄纸质发票，需要支付邮费</p>
      <div class="body" v-if="both.invoiceList[1].check">
        <div class="lable borderno">
          <h4>货到付款</h4>
          <div class="circleBox" :class="both.check ? 'checked' : ''" @click="checkFalse()">
            <div class="circle" v-if="both.check"></div>
          </div>
          <div class="clearBoth"></div>
        </div>
      </div>
      <button @click="sendMessage()">提交</button>
      <transition name="slide-fade">
        <div id="sureyesBox" v-if="sureyes">
          <div id="sureyes">
            <img src="../../images/cha.png" @touchend.stop.prevent="sureyes = false">
            <p>确认发票信息</p>
            <div class="sureyesBody">
              <div class="lable">
                <h2>发票类型</h2>
                <h6>企业发票</h6>
                <div class="clearBoth"></div>
              </div>
              <div class="lable">
                <h2>发票抬头</h2>
                <h6>{{both.invoicerise}}</h6>
                <div class="clearBoth"></div>
              </div>
              <div class="lable">
                <h2 class="w2">税号</h2>
                <h6>{{both.dutyparagraph}}</h6>
                <div class="clearBoth"></div>
              </div>
              <div class="lable"  v-if="both.invoiceList[0].check">
                <h2>电子邮箱</h2>
                <h6>{{both.email}}</h6>
                <div class="clearBoth"></div>
              </div>
              <div class="lable"  v-if="both.invoiceList[1].check">
                <h2 class="w3">收件人</h2>
                <h6>{{both.addresseename}}</h6>
                <div class="clearBoth"></div>
              </div>
              <div class="lable"  v-if="both.invoiceList[1].check">
                <h2>联系电话</h2>
                <h6>{{both.tel}}</h6>
                <div class="clearBoth"></div>
              </div>
              <div class="lable"  v-if="both.invoiceList[1].check">
                <h2>详细地址</h2>
                <h6>{{both.address}}</h6>
                <div class="clearBoth"></div>
              </div>
            </div>
            <button @click="yesGo()">确认提交</button>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "invoice",
      data(){
         return{
           both:{
             invoiceList:[{
               name:"电子发票",
               value:0,
               check:true,
             },{
               name:"纸质发票",
               value:1,
               check:false
             }],
             invoicerise:"",
             dutyparagraph:"",
             content:"*服务费",
             price:"",
             moremessage:{
               memo:"",
               address:"",
               bank:""
             },
             moremessageList:[],
             addresseename:"",
             tel:"",
             address:"",
             email:"",
             check:true,
             scrollTop:""
           },
           sureyes:false,
         }
      },
      mounted:function () {
         var _this = this;
         _this.both.price = _this.$route.query.money;
         var invoiceMore = sessionStorage.getItem("invoiceMore");
        var invoiceBoth = sessionStorage.getItem("invoiceBoth");
        if(invoiceBoth != undefined){
          _this.both = JSON.parse(invoiceBoth);
          sessionStorage.removeItem("invoiceBoth");
          _this.$nextTick(function () {
            $("#invoice").animate({scrollTop: _this.both.scrollTop}, 0);
          })
        }else{
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/company/getElectronicBill",
            data:JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
              pk: ""
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (getElectronicBill) {
              if(getElectronicBill.success == "1"){
                _this.both.invoicerise = getElectronicBill.corpName;
                _this.both.dutyparagraph = getElectronicBill.taxNo;
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
         if(invoiceMore != undefined){
           invoiceMore = JSON.parse(invoiceMore);
           _this.both.moremessage = invoiceMore;
           _this.both.moremessageList = [];
           _this.both.moremessageList.push(_this.both.moremessage.memo);
           _this.both.moremessageList.push(_this.both.moremessage.address);
           _this.both.moremessageList.push(_this.both.moremessage.bank);
           sessionStorage.removeItem("invoiceMore");
         }

         androidIos.judgeIphoneX("invoice",2);
      },
      methods:{
        yesGo:function () {
          var _this = this;
          var _both = _this.both;
          var type = _this.getType();
          if(type == 1){
            var json = {
              corpName : _both.invoicerise,
              taxNo : _both.dutyparagraph,
              ifDefault:1,
              memo: _both.moremessageList.join(","),
              recipient : type == 1 ? _both.addresseename : undefined,
              recipientPhone : type == 1 ? _both.tel : undefined,
              recipientAddr : type == 1 ? _both.address : undefined,
              email : type == 0 ? _both.email : undefined,
              pk:_this.$route.query.pk,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/pay/billingApplication",
              data:JSON.stringify(json),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (orderConfirm) {
                if(orderConfirm.success == "1"){
                  _this.$cjj("提交成功");
                  setTimeout(function () {
                    androidIos.gobackFrom(_this);
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
          }else{
            androidIos.second("此功能正在开发");
          }

        },
        checkYes:function (index) {
          var _this = this;
          for(var i = 0 ; i < _this.both.invoiceList.length;i++){
            _this.both.invoiceList[i].check = false;
          }
          _this.both.invoiceList[index].check = true;
        },
        getPageScroll:function() {
          var  yScroll;
          yScroll = document.getElementById("invoice").scrollTop;
          return yScroll;
        },
        checkFalse:function () {
          var _this = this;
       /*   _this.both.check = !_this.both.check;*/
        },
        getType:function () {
          var _this = this;
          var type = 0;
          for(var i = 0;i < _this.both.invoiceList.length;i++){
            if(_this.both.invoiceList[i].check){
              type = _this.both.invoiceList[i].value;
             return type;
            }
          }
          return type;
        },
        sendMessage:function () {
          var _this  = this;
          var type = _this.getType();
          if(_this.both.invoicerise == ""){
            bomb.first("请填写开票抬头");
             return false;
          }
          if(_this.both.dutyparagraph == ""){
            bomb.first("请填写纳税人识别号");
            return false;
          }
         if(type == 0){
           var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
           if(_this.both.email == ""){
             bomb.first("请填写邮箱地址");
             return false;
           }
           if(!myreg.test(_this.both.email)){
             bomb.first("请输入正确的邮箱格式");
             return false;
           }
         }else if(type == 1){
           if(_this.both.addresseename == ""){
             bomb.first("请填写收件人名字");
             return false;
           }
           if(_this.both.tel == ""){
             bomb.first("请填写收件人联系电话");
             return false;
           }
           if(_this.both.address == ""){
             bomb.first("请填写详细地址");
             return false;
           }
           if(!androidIos.telCheck(_this.both.tel)){
             bomb.first("请填写正确的联系电话");
             return false;
           }
         }
         if(type == 1 && !_this.both.check){
           androidIos.addPageList();
           _this.both.scrollTop =  _this.getPageScroll();
           sessionStorage.setItem("invoiceBoth",JSON.stringify(_this.both));
           _this.$router.push({ path: '/money',query:{pk:_this.$route.query.pk,money:_this.$route.query.money}});
         }else{
           _this.sureyes = true;
           _this.$nextTick(function () {
             androidIos.judgeIphoneX("sureyes",1);
           });
         }

        },
        lookMore:function () {
          var _this = this;
          _this.both.scrollTop =  _this.getPageScroll();
          sessionStorage.setItem("invoiceBoth",JSON.stringify(_this.both));
          androidIos.addPageList();
          _this.$router.push({ path : "/invoiceMore"});
        }
      }
    }
</script>

<style scoped>
    #invoice{
      position: absolute;
      top:1.3rem;
      bottom:0;
      background: #f5f5f5;
      overflow: scroll;
      width:100%;
    }
  p{
    font-size: 0.3467rem;
    color:#999;
    width:90%;
    margin:0.25rem 0 0.1rem 5%;
  }
  ul{
    width:90%;
    padding: 0.32rem 5%;
    margin: 0 auto;
    background: white;
  }
  ul li{
    width:4.2rem;
    float: left;
    line-height:1.35rem ;
    color:#999;
    font-size:0.48rem ;
    text-align: center;
    border: 1px solid #999;
    background: white;
    border-radius: 0.15rem;
  }
    ul .checked{
      color:#1D68A8;
      border-color: #1D68A8;
  }
  ul h1{
    margin-top: 0.27rem;
    font-size:0.32rem ;
    color:#999;
  }
  .body{
    background: white;
  }
  .lable{
    width:95%;
    margin-left: 5%;
    border-bottom: 1px solid #f1f1f1;
    height: 1.52rem;
  }
  .lable h2{
     float: left;
     line-height: 1.52rem;
    margin-left: 0.1rem;
    font-size: 0.375rem;
    color:#373737;
    min-width: 2rem;
  }
    .w2{
      letter-spacing:2em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-2）/(2-1)=2em */
      margin-right:-2em; /*同上*/
    }
    .w3{
      letter-spacing:0.5em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-3）/(3-1)=0.5em */
      margin-right:-0.5em; /*同上*/
    }
  .lable input{
    float: right;
    width:5rem;
    margin-right: 2rem;
    font-size: 0.375rem;
    color:#373737;
    line-height: 0.6rem;
    margin-top: 0.46rem;
  }
    .lable h3{
      float: right;
      width:5rem;
      margin-right: 2rem;
      font-size: 0.375rem;
      color:#999;
      line-height: 0.6rem;
      margin-top: 0.46rem;
    }
    .lable h6{
      float: right;
      width:5rem;
      margin-right: 2rem;
      font-size: 0.375rem;
      color:#333;
      line-height: 0.6rem;
      margin-top: 0.46rem;
    }
    .lable h3 span{
      color:#FC4D17;
      font-size: 0.375rem;
      margin-right: 0.1rem;
    }
  .borderno{
    border: none;
  }
  .lookMore{
    float: right;
    width:6rem;
    padding-right: 1rem;
    font-size: 0.375rem;
    color:#333;
    line-height: 0.6rem;
    margin-top: 0.46rem;
    text-align: right;
    background-image: url("../../images/lookMore.png");
    background-position:95% 50% ;
    background-repeat: no-repeat;
    background-size: 0.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .font{
    color:#999;
  }
  .lable h4{
    float: left;
    line-height: 1.52rem;
    margin-left: 0.1rem;
    font-size: 0.375rem;
    color:#373737;
    padding-left:0.9rem ;
    background-image: url("../../images/moneycollect.png");
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size:0.6rem ;
  }
    .circleBox{
      width:0.56rem;
      height: 0.56rem;
      float: right;
      border: 1px solid #C8C8CE;
      margin-right:0.63rem ;
      border-radius: 50%;
      box-sizing: border-box;
      position: relative;
      margin-top: 0.5rem;
    }
    .checked{
      border-color: #1a6bac!important;
    }
    .circle{
      position: absolute;
      width:0.32rem;
      height:0.32rem;
      top:50%;
      left:50%;
      margin-left: -0.16rem;
      margin-top: -0.16rem;
      background: #1a6bac;
      border-radius: 50%;
    }
  button{
    width:94%;
    display: block;
    line-height: 1.3rem;
    background: #1a6bac;
    color:#fff;
    font-size: 0.4rem;
    margin: 0.5rem auto;
    border-radius: 0.1rem;
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
    #sureyesBox{
      position: fixed;
      width:100%;
      top:0;
      bottom:0;
      height: auto;
      z-index: 44;
      background: rgba(0,0,0,0.3);
    }
    #sureyes{
      width: 100%;
      background: white;
      position: absolute;
      bottom:0;
      padding-bottom: 0.5rem;
    }
    #sureyes button{
      width:90%;
      line-height: 1rem;
      background: #1D68A8;
      color:white;
      display: block;
      margin: 0.8rem auto 0.3rem auto;
      font-size: 0.375rem;
      border-radius: 0.2rem;
    }
    #sureyes p{
      text-align: center;
      font-size: 0.45rem;
      color:#333;
      line-height: 1.15rem;
    }
    #sureyes img{
      position: absolute;
      width:0.375rem;
      right:0.413rem;
      top:0.187rem;
      z-index: 1;
    }
</style>
