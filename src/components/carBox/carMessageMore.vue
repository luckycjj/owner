<template>
    <div id="carMessageMore" style="top:1.3rem;">
      <div id="title" v-title data-title="找车详情"></div>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "car-message-more",
        data(){
          return{

          }
        },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("carMessageMore",2);
      }
    }
</script>

<style scoped>
      #carMessageMore{
        position: absolute;
        top:1.3rem;
        bottom:0rem;
        width:100%;
        height: auto!important;
        background:#F5F5F5 ;
      }
</style>
