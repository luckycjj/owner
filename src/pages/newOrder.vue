<template>
  <div id="newOrderBox">
  <router-view/>
  </div>
</template>

<script>
  import {androidIos} from "../js/app";
  export default {
        name: "newOrder",
      data(){
          return{

          }
      },
      mounted:function () {
         var _this = this;
        _this.$nextTick(function () {
          var html = location.href;
          if(html.indexOf("newOrder/histroyAddress")!=-1||html.indexOf("/newOrder/appoint")!=-1||html.indexOf("/newOrder/addressMessage")!=-1){
            $("#newOrderBox").css("top","0rem");
            $("#appBox").hide();
          }else{
            $("#newOrderBox").css("top","1.3rem");
            $("#appBox").show();
          }
          androidIos.judgeIphoneX("newOrderBox",2);
        })
      },
      updated:function () {
        var _this = this;
        _this.$nextTick(function () {
          var html = location.href;
          if(html.indexOf("newOrder/histroyAddress")!=-1||html.indexOf("/newOrder/appoint")!=-1||html.indexOf("/newOrder/addressMessage")!=-1){
            $("#newOrderBox").css("top","0rem");
            $("#appBox").hide();
          }else{
            $("#newOrderBox").css("top","1.3rem");
            $("#appBox").show();
          }
          androidIos.judgeIphoneX("newOrderBox",2);
        })
      }
    }
</script>

<style scoped>
    #newOrderBox{
      width:100%;
      height:auto;
      top:1.3rem;
      bottom:0;
      position: absolute;
      overflow: scroll;
      margin-top: 0.03125rem;
      background: #f6f6f6;
    }
</style>
