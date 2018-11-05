<template>
  <div id="carBoxmap">
    <div id="title" v-title data-title="地图"></div>
    <div id="container" style="top:1.3rem;"></div>
    <div id="panel"></div>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import {androidIos} from "../../js/app";
  export default {
    data(){
      return{
        navShow:false,
        peopleJ:"",
        peopleW:"",
        json:{
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
          pk:sessionStorage.getItem("driverPk"),
        }
      }
    },
    mounted: function () {
      var _this = this;
      androidIos.judgeIphoneX("container",2);
      _this.peopleJ = _this.$route.query.location.split(",")[0];
      _this.peopleW = _this.$route.query.location.split(",")[1];
      androidIos.bridge(_this);
    },
    methods: {
      go:function () {
        var _this = this;
        var map = new AMap.Map("container", {
          resizeEnable: true,
          center: [_this.peopleJ, _this.peopleW],//地图中心点
          zoom: 13 //地图显示的缩放级别
        });
        AMap.plugin(['AMap.Scale'],
          function(){
            map.addControl(new AMap.Scale());
          });
        var marker;
        if (marker) {
          marker.setMap(null);
        }
        marker = new AMap.Marker({
          icon:require('../../images/start1.png'),
          position: [_this.peopleJ, _this.peopleW]
        });
        marker.setMap(map);
      }
    },
  }
</script>
<style scoped>
  #panel {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none!important;
  }
  #container{
    top:1.3rem;
  }
</style>
<style>
  #carBoxmap .amap-logo{
    display: none!important;
  }
  #carBoxmap .amap-copyright{
    display: none!important;
  }
  #carBoxmap .amap-scalecontrol{
    bottom: 0.3rem !important;
  }
  #carBoxmap .amap-zoomcontrol{
    display: none!important;
  }
  #carBoxmap .amap-icon{
    width:19px;
  }
  #carBoxmap .amap-controls{
    display: none!important;
  }
</style>
