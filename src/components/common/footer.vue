<template>
  <div id="footer">
    <ul>
      <li v-for='(item,index) of items' :class='[{on:index === idx} ]' @click="$router.push(item.push)">
        <div class="imgBox"  :class='[ item.cls , {imgSure:index === idx} ]'><div :style="{marginRight:item.marginRight}" class="corner" v-show=" item.number > 0">{{item.number}}</div></div>
        {{item.name}}
      </li>
      <div class="clearBoth"></div>
    </ul>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "footer",
        data() {
          return {
            items: [{
                number:0,
                marginRight:0,
                cls: "hall",
                name: "大厅",
                push: "/hall"
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
                push: "/user"
              }
            ]
          }
        },
        props: ['idx'],
        mounted:function () {
          var _this = this;
          var driverBottomIcon = sessionStorage.getItem("driverBottomIcon");
          if(driverBottomIcon != undefined){
            _this.items = JSON.parse(driverBottomIcon);
          }
          androidIos.bridge(_this);

        },
      methods:{
          go:function () {
            var _this = this;
            var cookie = androidIos.getcookie("MESSAGEDRIVER");
            if(cookie != "") {
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
     #footer ul{
       width:100%;
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
      width:25%;
      text-align: center;
      height: 1.3rem;
      color:#999;
      font-size: 0.3125rem;
      background: white;
    }
</style>
