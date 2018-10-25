<template>
    <div id="haveCar" style="top:1.3rem;">
      <div id="title" v-title data-title="车源"></div>
      <footComponent :idx='1'></footComponent>
    </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
    export default {
        name: "have-car",
        data(){
          return{

          }
        },
        mounted:function () {
           var _this = this;
           androidIos.judgeIphoneX("haveCar",2);
        },
        methods:{
            go:function () {

            }
        }
    }
</script>

<style scoped>
#haveCar{
  position:absolute;
  top:1.3rem;
  bottom:0;
  height: auto;
  width:100%;
  background: #f6f6f6;
}
</style>
