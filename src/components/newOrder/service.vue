<template>
    <div id="service">
      <div id="title" v-title data-title="增值服务"></div>
      <ul>
         <li v-for="(item,index) in serviceList" :class="index == serviceList.length - 1 ? 'borderno': ''">
           <span>{{item.displayName}}</span>
           <div class="circleBox" @touchend="readChoose(index)" :class="item.check ? 'circletrue' : ''"> <div class="quanquan" v-if="item.check "></div></div>
           <div class="clearBoth"></div>
         </li>
      </ul>
      <h1>如需纸质回单或拍照回单，签收时纸质签名，电子签名请务必清晰</h1>
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
         androidIos.bridge(_this);
      },
      methods:{
          go:function () {

          },
        readChoose:function (index) {
          var _this = this;
          _this.serviceList[index].check =  !_this.serviceList[index].check;
          var list=[];
          for(var i = 0 ; i <  _this.serviceList.length;i++){
            if(_this.serviceList[i].check){
               list.push(_this.serviceList[i].displayName);
            }
          }
          sessionStorage.setItem("serviceBox",list.join(","));
        },
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
</style>
