<template>
  <div id="invoiceMore" style="top:1.3rem">
    <div id="title" v-title data-title="更多信息"></div>
    <div class="body" style="margin-top: 0.3rem">
      <div class="lable">
        <h2>备注说明</h2>
        <input type="text" maxlength="40" placeholder="填写备注说明" v-model="both.memo"/>
        <div class="clearBoth"></div>
      </div>
      <div class="lable">
        <h2 >地址和电话</h2>
        <input type="text" maxlength="40" placeholder="填写地址和电话" v-model="both.address"/>
        <div class="clearBoth"></div>
      </div>
      <div class="lable">
        <h2>开户行和账号</h2>
        <input type="text" maxlength="40" placeholder="填写开户行和账号" v-model="both.bank"/>
        <div class="clearBoth"></div>
      </div>
    </div>
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
            memo:"",
            address:"",
            bank:""
          }
      }
    },
    watch:{
      both:{
        handler:function(val,oldval){
          var _this = this;
          sessionStorage.setItem("invoiceMore",JSON.stringify(_this.both));
        },
        deep:true
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.judgeIphoneX("invoiceMore",2);
      var message = sessionStorage.getItem("invoiceBoth");
      if(message != undefined){
        message = JSON.parse(message);
        _this.both = message.moremessage;
      }
    },
    methods:{

    }
  }
</script>

<style scoped>
  #invoiceMore{
    position: absolute;
    top:1.3rem;
    bottom:0;
    background: #f5f5f5;
    overflow: scroll;
    width:100%;
  }
  p{
    font-size: 0.35rem;
    color:#666;
    width:90%;
    margin-left:5%;
    line-height: 1.333rem;
  }
  ul{
    width:90%;
    margin: 0 auto;
  }
  ul li{
    width:4.2rem;
    float: left;
    line-height:1.62rem ;
    color:#333;
    font-size:0.4rem ;
    text-align: center;
    border: 1px solid #e5e5e8;
    background: white;
  }
  ul .checked{
    color:#3f51b5;
    border-color: #3f51b5;
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
    height: 1.3rem;
  }
  .lable h2{
    float: left;
    line-height: 1.3rem;
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
    width:6rem;
    margin-right: 1rem;
    font-size: 0.375rem;
    color:#373737;
    line-height: 0.6rem;
    margin-top: 0.35rem;
  }
  .lable h3{
    float: right;
    width:5rem;
    margin-right: 2rem;
    font-size: 0.375rem;
    color:#999;
    line-height: 0.6rem;
    margin-top: 0.35rem;
  }
  .lable h3 span{
    color:#e51c23;
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
    margin-top: 0.35rem;
    text-align: right;
    background-image: url("../../images/lookMore.png");
    background-position:95% 50% ;
    background-repeat: no-repeat;
    background-size: 0.2rem;
  }
  .font{
    color:#999;
  }
  .lable h4{
    float: left;
    line-height: 1.3rem;
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
    margin-top: 0.37rem;
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
</style>
