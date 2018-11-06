<template>
  <div id="sendtextmessage" style="top:1.3rem;">
    <div id="title" v-title data-title="发送短信"></div>
    <div id="people">
        <div class="tabtitle">
          <p>接<br>收<br>人</p>
        </div>
        <ul>
          <li v-for="item in peopleList">{{item.carno}}</li>
          <div class="clearBoth"></div>
        </ul>
    </div>
    <div id="messageBody">
      <div class="tabtitle">
        <p>编<br>辑<br>短<br>信</p>
      </div>
      <div class="message">
        <textarea placeholder="请输入短信内容"></textarea>
        <div class="messageoperation">
          <span>常用短语</span>
          <span>清空</span>
          <div class="clearBoth"></div>
        </div>
        <div class="messageLook">
          <p>短信预览</p>
          <h6>
            【欣阳物流】沪DR5659的朋友, 上海欣雅供应链管理有限公司, 联系人：李婷 13526736803,回复TD退订
          </h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "sendtextmessage",
      data(){
          return{
             peopleList:[]
          }
      },
      mounted:function () {
        var _this = this;
        _this.peopleList = _this.$route.query.driver != undefined ?  JSON.parse(_this.$route.query.driver) : [];
        androidIos.judgeIphoneX("sendtextmessage",2);
      }
    }
</script>

<style scoped>
  #sendtextmessage{
     position: absolute;
    width:100%;
    top:1.3rem;
    bottom:0;
    height: auto;
    background:#F5F5F5 ;
  }
  #people,#messageBody{
     width:9.48rem;
    background: white;
    margin: 0.28rem auto;
    position: relative;
  }
  .tabtitle{
    position: absolute;
    background: #46B2E7;
    width:1.17rem;
    top:0;
    bottom:0;
    height: auto;
  }
  .tabtitle p{
    position: absolute;
    width:1.17rem;
    text-align: center;
    color:white;
    font-size: 0.375rem;
    line-height:0.48rem ;
    background: #46B2E7;
    top:50%;
    margin-top:-0.72rem ;
  }
  #messageBody .tabtitle p{
    margin-top:-0.96rem ;
  }
  #people ul{
      width:7.93rem;
      margin-left: 1.55rem;
      padding:0.653rem 0;
  }
  .message{
    width:8.31rem;
    margin-left: 1.17rem;
  }
  #people ul li {
      font-size: 0.4rem;
    color:#373737;
    line-height: 0.5rem;
    margin-right:0.41rem ;
    float: left;
  }
  textarea{
    width:94%;
    padding: 0.13rem 3% ;
    display: block;
    height: 2.5rem;
    font-size: 0.4rem;
    color:#373737;
    resize:none;
  }
  .messageoperation{
    width:100%;
    border-bottom: 1px solid #D8D8D8;
  }
  .messageoperation span{
    font-size: 0.4rem;
    color:#1D68A8;
    float: left;
    margin-left: 3%;
    line-height: 0.7rem;
  }
  .messageoperation span:nth-child(2){
     float: right;
    margin-right: 3%;
  }
  .messageLook{
    width:94%;
    padding: 0.13rem 3% ;
  }
  .messageLook p,.messageLook h6{
    font-size: 0.35rem;
    color:#999;
    margin-bottom: 0.2rem;
  }
</style>
