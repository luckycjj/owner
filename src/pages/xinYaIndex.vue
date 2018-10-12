<template>
    <div id="xinYaIndex">
      <div id="title" v-title data-title="欣阳物流"></div>
      <div id="xinYaIndexBox">
        <div id="full_feature" class="swipslider">
          <ul class="sw-slides">
            <li class="sw-slide" v-for="(item,index) in banner">
              <img :src="item.value"  :onerror="errorlogo" >
            </li>
          </ul>
        </div>
      </div>
      <footComponent :idx='0'></footComponent>
    </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
  import "../js/swipeslider";
    export default {
        name: "xin-ya-index",
        data(){
           return{
             banner:[],
             errorlogo: 'this.src="' + require('../images/timg.jpg') + '"',
           }
        },
      mounted:function () {
          var _this = this;
          androidIos.bridge(_this);
      },
      methods:{
          go:function () {
            var _this = this;
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/settings/getBanner",
              data:JSON.stringify({
                str:"1500",
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (getBanner) {
                if (getBanner.success == "1") {
                    _this.banner = getBanner.list;
                    _this.$nextTick(function () {
                      $('#full_feature').swipeslider();
                    })
                }else{
                  androidIos.second(getBanner.message);
                }
              },
              complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') { //超时,status还有success,error等值的情况
                  androidIos.second("当前状况下网络状态差，请检查网络！");
                } else if (status == "error") {
                  androidIos.errorwife();
                }
              }
            });
          }
      }
    }
</script>

<style scoped>
.swipslider{
  min-height: auto!important;
  height: 4.3rem;
}
.swipslider .sw-bullet{
   bottom:10px!important;
}
  #xinYaIndexBox{
    position: absolute;
    top:1.3rem;
    bottom:1.3rem;
    background: #f6f6f6;
    height: auto;
    width:100%;
  }
</style>
<style>
  #xinYaIndex .swipslider .sw-bullet{
    bottom:0.2rem!important;
  }
</style>
