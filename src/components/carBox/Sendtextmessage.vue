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
        <textarea @input="inputText()" placeholder="请输入短信内容" maxlength="50" v-model="messageBody"></textarea>
        <div class="messageoperation">
          <span @click="shortMessageTrueYes()">常用短语</span>
          <span @click="shortMessageClear()">清空</span>
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
    <button id="fasong" @click="fasong()">发送</button>
    <transition name="slide-fade">
      <div id="shortMessageBox" v-if="shortMessageTrue" @click="bodyquxiao($event)">
        <div id="shortMessage">
            <ul>
              <li>常用短语</li>
              <li @click="shortMessagego(index)" v-for="(item,index) in shortMessageList">{{item.displayName}}</li>
              <li @click="quxiaoshortmessage()">取消</li>
            </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "sendtextmessage",
      data(){
          return{
             peopleList:[],
            shortMessageList:[],
            shortMessageTrue:false,
            messageBody:"",
          }
      },
      mounted:function () {
        var _this = this;
        _this.peopleList = _this.$route.query.driver != undefined ?  JSON.parse(_this.$route.query.driver) : [];
        androidIos.judgeIphoneX("sendtextmessage",2);
      },
      methods:{
        shortMessageClear:function () {
          var _this = this;
          _this.messageBody = "";
        },
        inputText:function () {
          var _this = this;
          _this.messageBody = _this.messageBody.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\(\)\-]/g,'');
        },
        shortMessageTrueYes:function () {
          var _this = this;
          _this.shortMessageTrue = true;
          if(_this.shortMessageList.length == 0){
            $.ajax({
              type: "GET",
              url: androidIos.ajaxHttp() + "/settings/getSysConfigList",
              data: {
                str: "shortmessage",
                userCode: sessionStorage.getItem("token"),
                source: sessionStorage.getItem("source")
              },
              dataType: "json",
              timeout: 30000,
              success: function (getCarType) {
                _this.shortMessageList = getCarType;
              },
              complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                } else if (status == 'error') {
                  androidIos.errorwife();
                }
              }
            });
          }
        },
        quxiaoshortmessage:function () {
          var _this = this;
          _this.shortMessageTrue = false;
        },
        bodyquxiao:function (e) {
          var _this = this;
          if(e.target.id == "shortMessageBox"){
            _this.shortMessageTrue = false;
          }
        },
        shortMessagego:function (index) {
          var _this = this;
          if(_this.messageBody.length > 0){
              if(_this.messageBody[_this.messageBody.length - 1] == "," || _this.messageBody[_this.messageBody.length - 1] == "，" ){
                _this.messageBody = _this.messageBody + _this.shortMessageList[index].displayName;
              }else{
                _this.messageBody = _this.messageBody + ","+_this.shortMessageList[index].displayName;
              }
          }else{
            _this.messageBody = _this.messageBody + _this.shortMessageList[index].displayName;
          }
          _this.shortMessageTrue = false;
        },
        fasong:function () {
          var _this = this;
          if(_this.messageBody == ""){
            bomb.first("请填写短信内容");
            return false;
          }
          var list = [];
          for(var i = 0 ;i < _this.peopleList.length;i++){
            list.push(_this.peopleList[i].carno);
          }
          var json = {
            carno:list.join(","),
            content : _this.messageBody,
            userCode: sessionStorage.getItem("token"),
            source: sessionStorage.getItem("source")
          }
          androidIos.loading("正在发送");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "driver/sendMess",
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (sendMess) {
              if (sendMess.success == "1") {
               _this.$cjj("发送成功");
              }else{
                androidIos.second(sendMess.message);
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
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(0.13rem);
    opacity: 0;
  }
  #shortMessageBox{
    position: fixed;
    bottom: 0;
    width:100%;
    height: auto;
    top:0;
    background: rgba(0,0,0,0.3);
  }
  #shortMessage{
    position: absolute;
    background: white;
    width:100%;
    bottom: 0;
  }
  #shortMessage li{
    color:#373737;
    text-align: center;
    line-height: 1.3rem;
    font-size: 0.4rem;
    border-bottom: 1px solid #D8D8D8;
  }
  #fasong{
    width:9rem;
    margin:1.13rem auto 0 auto;
    display: block;
    background:#1D68A8 ;
    color:white;
    font-size: 0.4rem;
    line-height:1.067rem ;
    border-radius: 0.1rem;
  }
</style>
