<template>
    <div id="money" style="top:1.3rem;">
      <div id="title" v-title data-title="支付"></div>
      <div class="tab">
        <p>订单编号</p>
        <h1>{{fhd}}</h1>
        <div class="clearBoth"></div>
      </div>
      <div class="tab">
        <p>支付金额</p>
        <h2>{{price}}元</h2>
        <div class="clearBoth"></div>
      </div>
      <ul>
        <li v-for="(item,index) in payList" :style="{borderColor:index == payList.length - 1 ? 'white' : '#EBE9E9'}" @click="checkPay(index)">
          <p :class="'payList'+index">{{item.name}}</p>
          <div class="circleBox" :class="item.check ? 'checked' : ''">
            <div class="circle" v-if="item.check"></div>
          </div>
          <div class="clearBoth"></div>
        </li>
      </ul>
      <button id="payOk" @click="payok()">确认支付</button>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "money",
        data(){
           return{
             fhd:"",
             price:0,
             payList:[{
               icon:require("../../images/zhifubao.png"),
               name:"支付宝",
               value:0,
               check:true,
             },{
               icon:require("../../images/weixin.png"),
               name:"微信",
               value:1,
               check:false,
             },{
               icon:require("../../images/yinhang-yinlian-.png"),
               name:"银联支付",
               value:2,
               check:false,
             }]
           }
        },
      mounted:function () {
        var _this = this;
        _this.fhd = _this.$route.query.pk;
        _this.price = _this.$route.query.money;
        androidIos.judgeIphoneX("money",2);
      },
      methods:{
        checkPay:function (index) {
          var _this = this;
          if(_this.payList[index].check){
            _this.payList[index].check = false;
          }else{
            for(var i = 0 ; i < _this.payList.length ; i++){
                 if(_this.payList[i].check){
                   _this.payList[i].check = false;
                   break;
                 }
            }
            _this.payList[index].check = true;
          }
        },
        payok:function () {
          var _this = this;
          var list = [];
          for(var i = 0 ; i < _this.payList.length ; i++){
            if(_this.payList[i].check){
              list.push(_this.payList[i].value);
              break;
            }
          }
          if(list.length == 0){
            bomb.first("请选择支付方式");
            return false;
          }
          androidIos.second("功能正在开发");
        },
      }
    }
</script>

<style scoped>
    #money{
      position: absolute;
      top:1.3rem;
      bottom:0;
      background: #f5f5f5;
      overflow: scroll;
      width:100%;
    }
  .tab{
    width:8.86rem;
    padding: 0 0.57rem;
    background: white;
    height:1.33rem;
    margin-top:0.6rem ;
  }
    .tab p{
      float: left;
      line-height: 1.33rem;
      color:#373737;
      font-size:0.375rem ;
    }
    .tab h1{
      float: right;
      line-height: 1.33rem;
      color:#373737;
      font-size:0.375rem ;
    }
    .tab h2{
      float: right;
      line-height: 1.33rem;
      color:#FC4D17;
      font-size:0.375rem ;
    }
  ul{
    width:9.43rem;
    padding: 0 0 0 0.57rem;
    background: white;
    margin-top:0.6rem ;
  }
  ul li{
    height:1.52rem;
    border-bottom: 1px solid #EBE9E9;
  }
    ul li p {
       padding-left:1.62rem ;
      line-height: 1.52rem;
      color:#373737;
      font-size: 0.375rem;
      float: left;
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
    margin-top: 0.48rem;
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
  .payList0{
    background-size: 0.82rem;
    background-repeat: no-repeat;
    background-position: 0.13rem 50%;
    background-image: url("../../images/zhifubao.png");
  }
    .payList1{
      background-size: 0.67rem;
      background-repeat: no-repeat;
      background-position: 0.213rem 50%;
      background-image: url("../../images/weixin.png");
    }
    .payList2{
      background-size: 0.947rem;
      background-repeat: no-repeat;
      background-position: 0.053rem 50%;
      background-image: url("../../images/yinhang-yinlian-.png");
    }
  #payOk{
    width:9rem;
    height:1.33rem;
    background: #1a6bac;
    display: block;
    margin: 2.18rem auto 0.3rem auto;
    font-size: 0.375rem;
    letter-spacing: 1px ;
    color:white;
    border-radius:0.13rem ;
  }
</style>
