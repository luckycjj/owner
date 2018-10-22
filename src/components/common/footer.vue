<template>
  <div id="footer">
    <ul>
      <li v-for='(item,index) of items' :class='[{on:index === idx} ]' @click="urlGoshow(item.push)" :style="{marginLeft:index == 2 ? '20%':''}">
        <div class="imgBox"  :class='[ item.cls , {imgSure:index === idx} ]'><div :style="{marginRight:item.marginRight}" class="corner" v-show=" item.number > 0">{{item.number}}</div></div>
        <div id="footerUserTX" v-if="index == 3" :style="{display: item.show ? 'block' : 'none'}"></div>
        {{item.name}}
      </li>
      <div class="clearBoth"></div>
    </ul>
    <div id="newOrderGo" @click="gonewOrder()">
      <div class="shuxian"></div>
      <div class="hengxian"></div>
    </div>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "footer",
        data() {
          return {
            cookie:"",
            items: [{
                number:0,
                marginRight:0,
                cls: "hall",
                name: "大厅",
                push: "/xinYaIndex"
              },
              {
                number:0,
                marginRight:0,
                cls: "track",
                name: "订单",
                push: "/trackList"
              },
              {
                number:0,
                marginRight:0,
                cls: "insurance",
                name: "保险",
                push: "/insuranceList"
              },
              {
                number:0,
                marginRight:0,
                cls: "user",
                name: "我的",
                push: "/user",
                show:false,
              }
            ]
          }
        },
        props: ['idx'],
        mounted:function () {
          var _this = this;
          var driverBottomIcon = sessionStorage.getItem("driverBottomIcon");
          sessionStorage.removeItem("NEWORDERTRANTYPE");
          _this.cookie = androidIos.getcookie("MESSAGEDRIVER");
          if(driverBottomIcon != undefined){
            _this.items = JSON.parse(driverBottomIcon);
          }
          androidIos.bridge(_this);
        },
      methods:{
          go:function () {
            var _this = this;
            if(sessionStorage.getItem("token")!= undefined) {
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/getUserInfo",
                data: JSON.stringify({
                  userCode: sessionStorage.getItem("token"),
                  source: sessionStorage.getItem("source")
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                success: function (getUserInfo) {
                  if (getUserInfo.success == "1") {
                    sessionStorage.setItem("ownerMessage", JSON.stringify({
                      licType: getUserInfo.licType,
                      name: getUserInfo.name,
                      photo: getUserInfo.photo,
                      status: getUserInfo.status,
                      corpName: getUserInfo.corpName,
                      role: getUserInfo.role
                    }));
                  } else {
                    androidIos.second(getUserInfo.message);
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
                url: androidIos.ajaxHttp() + "/order/messageCount",
                data: JSON.stringify({
                  userCode: sessionStorage.getItem("token"),
                  source: sessionStorage.getItem("source")
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                success: function (driverBottomIcon) {
                  if (driverBottomIcon.success == "1") {
                    _this.items[1].number = driverBottomIcon.orderCount * 1;
                    if(driverBottomIcon.myFlag == 1){
                       _this.items[3].show = true;
                    }else{
                      _this.items[3].show = false;
                    }
                    sessionStorage.setItem("messageCount", driverBottomIcon.count * 1);
                    _this.$nextTick(function () {
                      _this.marginWidth();
                      sessionStorage.setItem("driverBottomIcon", JSON.stringify(_this.items));
                    })
                  } else {
                    androidIos.second(driverBottomIcon.message);
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
          },
        urlGoshow:function (url) {
            var _this = this;
            if(_this.cookie != ""){
              if(_this.idx == 0){
                var yScroll = document.getElementById("xinYaIndexBox").scrollTop;
                sessionStorage.setItem("INDEXSCROLLTOP",yScroll);
              }
              _this.$router.push({path:url});
            }else if(_this.cookie == ""){
              androidIos.first("尚未登录,请登录！");
              $(".tanBox-yes").unbind('click').click(function(){
                $(".tanBox-bigBox").remove();
                _this.$router.push({path:"/login"});
              });
            }
        },
        gonewOrder:function () {
          var _this = this;
          if(_this.cookie != ""){
            var owner = sessionStorage.getItem("ownerMessage");
            if(owner != undefined){
              var status = JSON.parse(owner);
              if(status.status == 1){
                androidIos.second("正在审核中，请耐心等待！");
              }else if(status.status == 0){
                androidIos.second("尚未认证，请认证上传资料！");
              }else if(status.status == 3){
                androidIos.second("资料已驳回，请重新上传资料！");
              }else if(status.status == 4){
                androidIos.second("账户已禁用！");
              }else if(status.status == 2){
                androidIos.addPageList();
                _this.$router.push({path:"/newOrder",query:{newordertrantype:0}});
              }
            }
          }else if(_this.cookie == ""){
            androidIos.first("尚未登录,请登录！");
            $(".tanBox-yes").unbind('click').click(function(){
              $(".tanBox-bigBox").remove();
              _this.$router.push({path:"/login"});
            });
          }
        },
        marginWidth:function () {
          var _this = this;
          var corner = document.getElementsByClassName("corner");
          for(var i = 0; i< corner.length;i++){
            var width = corner[i].scrollWidth;
            _this.items[i].marginRight = - width / (2*(_this.htmlSize())) + 0.05+ "rem";
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
     #footer{
       position:fixed;
       bottom: 0;
       left:0;
       width:100%;
     }
     #newOrderGo{
       position: absolute;
       width:1.6rem;
       height: 1.6rem;
       background: #2c9cff;
       border-top-left-radius: 0.2rem;
       border-top-right-radius: 0.2rem;
       left:50%;
       margin-left: -0.8rem;
       bottom: 0;
     }
     .shuxian{
       width:0.067rem;
       height:0.5067rem;
       background: white;
       position: absolute;
       top:50%;
       left:50%;
       margin-top: -0.25335rem;
       margin-left: -0.0335rem;
     }
     .hengxian{
       height:0.067rem;
       width:0.5067rem;
       background: white;
       position: absolute;
       top:50%;
       left:50%;
       margin-left: -0.25335rem;
       margin-top: -0.0335rem;
     }
     #footer ul{
       width:100%;
       background: white;
     }
     .imgBox{
       width:0.67rem;
       height: 0.67rem;
       margin: 0.12rem  auto 0 auto;
       background-position: 0 0;
       background-size: 0.67rem 1.34rem;
       background-repeat: no-repeat;
       position: relative;
     }
     .corner{
       background: #fc4243;
       font-size: 0.3125rem;
       color:white;
       position: absolute;
       top:0;
       right:0rem;
       padding: 0.01rem 0.2rem;
       border-radius: 0.3rem;
     }
     .hall{
       background-image: url("../../images/findcarBottom.png");
     }
     .track{
       background-image: url("../../images/orderBottom.png");
     }
     .insurance{
       background-image: url("../../images/InsuranceBottom.png");
     }
     .user{
       background-image: url("../../images/userBottom.png");
     }
     .imgSure{
       background-position: 0 100%!important;
     }
     .on{
       color:#333!important;
     }
    #footer ul li {
      float: left;
      width:20%;
      text-align: center;
      height: 1.3rem;
      color:#999;
      font-size: 0.3125rem;
      background: white;
      position: relative;
    }
   #footerUserTX{
     position: absolute;
     width:0.18rem;
     height: 0.18rem;
     border-radius: 50%;
     background: #E1473C;
     top:0.2rem;
     right:40%;
   }
</style>
