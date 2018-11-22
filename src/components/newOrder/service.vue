<template>
    <div id="service">
      <div id="title" v-title data-title="增值服务"></div>
      <p>增值服务</p>
      <ul>
         <li v-for="(item,index) in serviceList" :class="index == serviceList.length - 1 ? 'borderno': ''">
           <span>{{item.displayName}}</span>
           <div class="clearBoth"></div>
         </li>
      </ul>
      <p>回单须知</p>
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

      }
    }
</script>

<style scoped>
  #service{

    background: white;
    width:92%;
    padding: 0.3rem 4%;
  }
  #service p{
    font-size: 0.4rem;
    color:#373737;
    margin-bottom: 0.2rem;
  }
  ul{
    width:100%;
    margin:0.2rem 0 ;
    border: 1px solid #dcdcdc;
  }
  ul li {
     width:100%;
     border-bottom:1px solid #dcdcdc;

  }
  li span{
    font-size: 0.375rem;
    line-height: 1rem;
    margin-left: 0.3rem;
    color:#666;
    float: left;
  }
  .borderno{
    border: none;
  }
  h1{
    font-size: 0.35rem;
    color:#666;
  }
</style>
