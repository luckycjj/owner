<template>
    <div id="xinYaIndex">
      <div id="title" v-title data-title="首页"></div>
      <div id="xinYaIndexBox" style="top:0rem;">
         <div class="top">
            <div class="topLeft">
              <input type="text" @keyup="keywordUp()"  @blur="keywordblur()" placeholder="请输入订单号" v-model="keyWord"/>
            </div>
            <div class="topRight">
              <div class="topRightF">
                <p>{{todayOrder | toThousands}}<br><span>今日订单量</span></p>
              </div>
              <div class="topRightF">
                <p>￥{{todayPrice | toThousands}}<br><span>今日运输费用</span></p>
              </div>
              <div class="clearBoth"></div>
            </div>
         </div>
         <div class="center">
           <div class="title"> 我的订单<div class="clearBoth"></div></div>
           <ul>
             <li v-for="(item,index) in iconList" @click="lookTrackList(index)">
                 <div class="iconListImg" :style="{backgroundImage :'url(' + item.icon +')'}">
                   <div class="Indexcorner" v-if="item.number > 0"  :style="{marginRight:item.marginRight}">{{item.number}}</div>
                 </div>
                 {{item.name}}
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
             time :  (new Date()).getFullYear() + "/" + ((new Date()).getMonth() + 1) + "/" + (new Date()).getDate(),
             todayOrder :  0,
             todayPrice : 0,
             keyWord:"",
             iconList:[{
                name:"运输中",
                number:0,
                icon:require("../images/trackList1.png"),
                marginRight:0,
             },{
               name:"已完成",
               number:0,
               icon:require("../images/trackList2.png"),
               marginRight:0,
             },{
               name:"对账单",
               number:0,
               icon:require("../images/trackList3.png"),
               marginRight:0,
             },{
               name:"异常单",
               number:0,
               icon:require("../images/trackList4.png"),
               marginRight:0,
             }]
           }
        },
      mounted:function () {
          var _this = this;
          androidIos.judgeIphoneX("top",0);
          androidIos.judgeIphoneX("xinYaIndexBox",1);
          sessionStorage.removeItem("NEWORDERTRANTYPE");
          _this.keyWord = sessionStorage.getItem("indexKeyword") == undefined ? "" : sessionStorage.getItem("indexKeyword");
          if(sessionStorage.getItem("indexCorner") != undefined){
            _this.iconList = JSON.parse(sessionStorage.getItem("indexCorner"));
          }
          sessionStorage.removeItem("indexKeyword");
          sessionStorage.removeItem("trackTap");
          sessionStorage.removeItem("settlementTap");
          androidIos.noviceguidance(1);
          androidIos.bridge(_this);
      },
      methods:{
        go:function () {
            var _this = this;
            _this.marginWidth();
            _this.corner();
            var INDEXSCROLLTOP = sessionStorage.getItem("INDEXSCROLLTOP");
            if(INDEXSCROLLTOP != null){
              $("#xinYaIndexBox").animate({scrollTop: INDEXSCROLLTOP}, 0);
              sessionStorage.removeItem("INDEXSCROLLTOP");
            }
          },
        keywordUp:function () {
          var _this = this;
          _this.keyWord = _this.keyWord.replace(/[^\a-\z\A-\Z0-9\-]/g,'');
        },
        keywordblur:function () {
          var _this = this;
          if(_this.keyWord != ""){
             androidIos.addPageList();
             sessionStorage.setItem("indexKeyword",_this.keyWord);
             _this.$router.push({path:"/orderScreen",query:{keyword:_this.keyWord}});
          }
        },
        corner:function () {
          var _this = this;
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/order/getPayCount",
            data:JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (getPayCount) {
              if (getPayCount.success == "1") {
                _this.iconList[2].number = getPayCount.paied*1;
                _this.$nextTick(function () {
                  _this.marginWidth();
                })
              }else{
                androidIos.second(getPayCount.message);
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
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/order/getOrderCount",
            data:JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (carrOrderListHeaderIcon) {
              if (carrOrderListHeaderIcon.success == "1") {
                _this.iconList[0].number = carrOrderListHeaderIcon.onTheWayCount*1 + carrOrderListHeaderIcon.arrivedCount*1;
                _this.iconList[1].number = carrOrderListHeaderIcon.completedCount*1;
                sessionStorage.setItem("indexCorner",JSON.stringify(_this.iconList));
                _this.$nextTick(function () {
                  _this.marginWidth();
                })
              }else{
                androidIos.second(carrOrderListHeaderIcon.message);
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
        },
        lookTrackList:function (type) {
          var _this = this;
          if(type ==0 || type == 1){
            androidIos.addPageList();
            sessionStorage.setItem("trackTap",type + 1);
            _this.$router.push({path:"/trackList"});
          }else if(type == 2){
            androidIos.addPageList();
            sessionStorage.setItem("settlementTap",1);
            _this.$router.push({path:"/settlement"});
          }
        },
        getPageScroll:function() {
          var  yScroll;
          yScroll = document.getElementById("xinYaIndexBox").scrollTop;
          sessionStorage.setItem("INDEXSCROLLTOP",yScroll);
        },
        marginWidth:function () {
          var _this = this;
          var corner = document.getElementsByClassName("Indexcorner");
          for(var i = 0; i< corner.length;i++){
            var width = corner[i].scrollWidth;
            _this.iconList[i].marginRight = - width / (2*(_this.htmlSize())) + 0.05+ "rem";
            corner[i].style.marginRight = - width / (2*(_this.htmlSize())) + 0.05+ "rem";
          }
        },
        htmlSize:function () {
          return document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
        }
      }
    }
</script>

<style scoped>
  #xinYaIndexBox{
    position: absolute;
    top:0rem;
    bottom:1.3rem;
    background: #f6f6f6;
    height: auto;
    width:100%;
    overflow: scroll;
    padding-bottom: 0.2rem;
  }
  .top{
    width:100%;
    padding:0.27rem 0;
    background: -webkit-linear-gradient( #47b2e8 , #1e72b2); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#47b2e8, #1e72b2); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#47b2e8, #1e72b2); /* Firefox 3.6 - 15 */
    background: linear-gradient(#47b2e8 , #1e72b2); /* 标准的语法 */
  }
  .topLeft{
    width:100%;
    padding-top: 1px;
  }
  .topLeft input{
    font-size: 0.375rem;
    color:#373737;
    line-height: 0.375rem;
    text-align: left;
    padding:0.2rem 0.8rem;
    width:4.77rem;
    height: 0.4rem;
    margin: 0.7rem auto;
    display: block;
    border-radius: 0.4rem;
    background-image: url("../images/sousuo2.png");
    background-position: 0.2rem 50%;
    background-repeat: no-repeat;
    background-size: 0.375rem;
  }
  .topRight{
    width:100%;
    padding-top: 0.3rem;
  }
  .topRightF:nth-child(1){
    float: left;
    width:50%;
  }
  .topRightF:nth-child(2){
    float: left;
    width:50%;
  }
  .topRightF p{
    font-size: 0.7rem;
    color:#fff;
    line-height: 0.7rem;
    text-align: center;
  }
  .topRightF p span{
    font-size: 0.35rem;
    color:#fff;
    line-height: 1rem;
  }
  .center{
    width:96%;
    margin:0.32rem auto 0 auto ;
    background: white;
    border-radius: 0.2rem;
  }
  .center .title{
    font-size: 0.375rem;
    line-height: 1.04rem;
    color:#373737;
    width:86%;
    padding: 0 7%;
    border-bottom: 1px solid #dadada;
  }
  .center .title span{
    float: right;
    font-size: 0.32rem;
    line-height: 1.04rem;
    color:#999;
    padding-right:0.35rem ;
    background-image: url("../images/lookMore.png");
    background-size:0.18rem ;
    background-repeat: no-repeat;
    background-position: 100% 50%;
  }
  .center ul {
    width:100%;
    padding: 1px 0 0.5rem 0;
    overflow: hidden;
  }
  .center ul li{
    width:50%;
    float: left;
    text-align: center;
    font-size: 0.32rem;
    color:#373737;
    margin-top:0.6rem ;
  }
  .center ul li .iconListImg{
    width:1rem;
    height: 1rem;
    background-repeat: no-repeat;
    background-size: 1rem;
    background-position: 50% 50%;
    margin: 0 auto 0.175rem auto;
    position: relative;
  }
  .iconListImg img{
    width:100%;
  }
  .iconListImg p {
     position: absolute;
  }
  .Indexcorner{
    background: white;
    font-size: 0.3125rem;
    color:#1d68a9;
    position: absolute;
    top:0;
    right:0;
    padding: 0.01rem 0.16rem;
    border-radius: 0.3rem;
    margin-top: -0.2rem;
    margin-right:-0.17667rem ;
    border: 1px solid #1d68a9;
  }
</style>
