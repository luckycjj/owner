<template>
  <div id="settlement" style="top:1.3rem;">
    <div id="title" v-title data-title="结算中心"></div>
    <div id="showBox">
      <div class="wrapper" id="trackTab">
        <div class="scroller">
          <ul class="clearfix">
            <li v-for="(item,index) in list"  :i="index">
              <img :src="item.img">
              <a href="javascript:void(0)">{{item.name}}<span v-if="item.number*1 > 0">{{item.number}}</span></a>
            </li>
          </ul>
        </div>
      </div>
      <div v-for="(item,index) in list" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
        <ul :id="'dataList' + index" class="data-list">
          <li v-for="(items,indexs) in item.prolist" @click="lookTrackMore(items.pkInvoice)">
            <div class="startEndBox">
              <div class="startEnd"><div class="circleList"></div><span class="startEndSpan">{{items.deliAddr}}-{{items.arriAddr}}</span></div>
              <div class="triangle_border_right"></div>
              <div class="clearBoth"></div>
            </div>
            <h3>支付</h3>
            <div class="proBox">
              <h6 class="deliDateTime">{{items.deliDate}}</h6>
              <h6 class="arriDateTime">{{items.arriDate}}</h6>
              <h6 class="proBoxList" v-for="(pro,proIndex) in items.itemDaos">{{pro.goodsName}}/{{pro.num}}件<span v-if="pro.weight*1 > 0">/{{pro.weight*1}}吨</span><span v-if="pro.volume*1 > 0">/{{pro.volume*1}}立方米</span></h6>
              <h6 class="driver">{{items.deliContact}}</h6>
              <h5 class="remark">{{items.memo}}</h5>
              <div class="clearBoth"></div>
            </div>
            <h1>订单编号：{{items.vbillno}}</h1>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import "../../js/navbarscroll";
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  export default {
    name: "settlement",
    data(){
      return{
        list:[{
          name:"待付款",
          number:0,
          prolist:[],
          img:require("../../images/settlementNopay.png")
        },{
          name:"已付款",
          number:0,
          prolist:[],
          img:require("../../images/settlementYespay.png")
        }],
        tabShow:0,
        ajax1:null,
        settime:null,
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.judgeIphoneX("settlement",2);
      sessionStorage.removeItem("weh");
      sessionStorage.removeItem("nowOrderCartype");
      sessionStorage.removeItem("dataStart");
      sessionStorage.removeItem("dataEnd");
      sessionStorage.removeItem("orderPk");
      sessionStorage.removeItem("dispatchPK");
      sessionStorage.removeItem("carPKlistGo");
      sessionStorage.removeItem("driverPk");
      sessionStorage.removeItem("ORDERSCREEN");
      sessionStorage.removeItem("orderType");
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var _this = this;
        var settlementTap = 0;
        if(sessionStorage.getItem("settlementTap") != null){
          settlementTap = sessionStorage.getItem("settlementTap");
        }else{
          settlementTap = 0;
        }
        $("#trackTab li").eq(settlementTap).addClass("tableSure");
        _this.tabShow = settlementTap;
        var curNavIndex = _this.tabShow;//首页0; 奶粉1; 面膜2; 图书3;
        var mescrollArr=new Array(_this.list.length);//4个菜单所对应的4个mescroll对象
        //初始化首页
        mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);

        /*初始化菜单*/
        $("#trackTab li").on("touchend",function(){
          var i=Number($(this).attr("i"));
          sessionStorage.setItem("settlementTap",i);
          $("#trackTab li").removeClass("tableSure");
          $(this).addClass("tableSure");
          if(curNavIndex!=i) {
            //更改列表条件
            //隐藏当前列表和回到顶部按钮
            $("#mescroll"+curNavIndex).hide();
            mescrollArr[curNavIndex].hideTopBtn();
            //显示对应的列表
            $("#mescroll"+i).show();
            //取出菜单所对应的mescroll对象,如果未初始化则初始化
            if(mescrollArr[i]==null){
              mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
            }else{
              //检查是否需要显示回到到顶按钮
              var curMescroll=mescrollArr[i];
              var curScrollTop=curMescroll.getScrollTop();
              if(curScrollTop>=curMescroll.optUp.toTop.offset){
                curMescroll.showTopBtn();
              }else{
                curMescroll.hideTopBtn();
              }
            }
            //更新标记
            curNavIndex=i;
          }
        })

        /*创建MeScroll对象*/
        function initMescroll(mescrollId,clearEmptyId){
          //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
          var mescroll = new MeScroll(mescrollId, {
            //上拉加载的配置项
            up: {
              callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
              isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
              noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
              empty: {
                icon: require("../../images/nojilu.png"),
                tip: "暂无订单", //提示
              },
              clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
              toTop:{ //配置回到顶部按钮
                src :require("../../images/scrollTop.png"), //默认滚动到1000px显示,可配置offset修改
                //offset : 1000
              },
              lazyLoad: {
                use: true // 是否开启懒加载,默认false
              }
            }
          });
          return mescroll;
        }

        /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
        function getListData(page){
          //联网加载数据
          var dataIndex=curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
          getListDataFromNet(dataIndex, page.num, page.size, function(pageData){
            mescrollArr[dataIndex].endSuccess(pageData.length);
            setListData(pageData,dataIndex);
          }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescrollArr[dataIndex].endErr();
          });
        }
        function setListData(pageData,dataIndex){
          for (var i = 0; i < pageData.length; i++) {
            _this.list[dataIndex].prolist.push(pageData[i]);
          }
        }
        function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
          //延时一秒,模拟联网
          _this.settime = setTimeout(function () {
            _this.ajax1 = $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/pay/payList",
              data:JSON.stringify({
                page:pageNum,
                size:pageSize,
                type:curNavIndex + 1,
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (loadInvoice) {
                if (loadInvoice.success == "1") {
                  successCallback(loadInvoice.list);
                }else{
                  androidIos.second(loadInvoice.message);
                  successCallback([]);
                }
              },
              complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') { //超时,status还有success,error等值的情况
                  androidIos.second("当前状况下网络状态差，请检查网络！");
                  successCallback([]);
                } else if (status == "error") {
                  androidIos.errorwife();
                  successCallback([]);
                }
              }
            });
          },100)
        }
      },
      lookTrackMore:function (pk) {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/orderLogisticsMore3',query:{pk:pk,type:2}});
      },
    },
    beforeDestroy:function () {
      var _this = this;
      var body = document.getElementsByTagName("body")[0];
      var listDom=document.getElementsByClassName("mescroll-totop")[0];
      if(listDom != null){
        body.removeChild(listDom);
      }
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    },
    destroy:function () {
      var _this = this;
      var body = document.getElementsByTagName("body")[0];
      var listDom=document.getElementsByClassName("mescroll-totop")[0];
      if(listDom != null){
        body.removeChild(listDom);
      }
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    }
  }
</script>
<style>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #settlement .hide{
    display: none;
  }
  #settlement .tableSure a{
    color:#373737!important;
  }
</style>
<style scoped>
  .payBoth{
    float: right;
    margin-right:4.4%;
    font-size: 0.35rem;
    color:#373737;
    line-height: 0.7rem;
    margin-top: 0.2rem;
  }
  .payBoth button{
    width:1.65rem;
    background-color: #2c9cff;
    color:white;
    line-height:0.7rem ;
    margin-left: 0.35rem;
    border-radius:0.1rem;
    font-size: 0.3125rem;
  }
  #settlement{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  .mescroll{
    position: absolute;
    top:2.46rem;
    bottom:0rem;
    height: auto!important;
    overflow: scroll;
  }
  #showBox{
    position: absolute;
    top:0rem;
    bottom: 0;
    height: auto;
    width:100%;
  }
  .wrapper {
    position:relative;
    height: 2.16rem;
    width: 100%;
    margin:0 auto;
    background:white;
    margin-top: 0.25rem;
  }
  .wrapper .scroller li {
    height: 2.16rem;
    color:#999;
    float: left;
    font-size: .4rem;
    text-align: center;
    width:5rem;
  }
  .wrapper .scroller li img{
    width:1.18rem;
    margin:0.253rem auto 0 auto ;
  }
  .wrapper .scroller li a{
    color:#999;
    display:block;
    font-size: 0.35rem;
    margin:0 0.1rem;
  }
  .wrapper .scroller li a span{
    color:#2c9cff;
    font-size: 0.3125rem;
  }
  .wrapper .scroller li.cur a{
    color:#2c9cff;
    border-bottom: 1px solid #2c9cff;
  }
  .data-list{
    width:100%;
  }
  .data-list li{
    width:94%;
    margin: 0.2rem auto 0.08rem;
    background: white;
    border-radius:0.16rem;
    padding:0.1rem 0 0.21rem 0;
    position: relative;
  }
  .data-list li h6{
    font-size:0.32rem ;
    color:#373737;
    margin-bottom: 0.01rem;
    padding-left: 5%;
    margin-left: 2%;
    background-repeat: no-repeat;
    background-size:0.27rem ;
    background-position: 0 50%;
    width:43%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    float: left;
    line-height: 0.44rem;
    height: 0.44rem;
    margin-bottom: 0.21rem;
  }
  .data-list li h5{
    font-size:0.32rem ;
    color:#373737;
    margin-bottom: 0.01rem;
    padding-left: 5%;
    margin-left: 2%;
    background-repeat: no-repeat;
    background-size:0.27rem ;
    background-position: 0 50%;
    width:88%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    float: left;
    line-height: 0.44rem;
    height: 0.44rem;
  }
  .data-list li h1{
    font-size:0.34rem ;
    color:#999;
    padding-top: 0.25rem;
    margin-left: 0.5rem;
  }
  .data-list li h3{
    position: absolute;
    width:1.2rem;
    font-size: 0.375rem;
    right:0.3rem;
    bottom:0.21rem;
    background-size: 0.48rem;
    background-repeat: no-repeat;
    background-position: 0 50%;
    padding-left: 0.6rem;
    color:#fff;
    background: #1D68A8;
    line-height: 0.8rem;
    border-radius: 0.2rem;
  }
  .jinjiOrder{
    position: absolute;
    font-size: 0.3125rem;
    right:0.3rem;
    top:0.15rem;
    color:#1D68A8;
    width:1rem;
  }
  .deliDateTime{
    background-image: url("../../images/cc.png");
  }
  .arriDateTime{
    background-image: url("../../images/cc.png");
  }
  .proBoxList{
    background-image: url("../../images/tranprotype.png");
  }
  .driver{
    background-image: url("../../images/trandriver.png");
  }
  .remark{
    background-image: url("../../images/tranremark.png");
  }
  .proBox{
    width:94%;
    margin: 0.2rem auto;
    border-radius: 0.1rem;
    border: 1px solid white;
  }
  .startEnd{
    background:#1D68A8 ;
    padding: 0 0.92rem 0 0.7rem;
    float: left;
    position: relative;
    max-width: 5.5rem;
  }
  .startEndSpan{
    font-size: 0.375rem;
    line-height: 0.6rem;
    color:#fff;

  }
  .circleList{
    width:0.22rem;
    height: 0.22rem;
    background: white;
    position: absolute;
    border-radius: 50%;
    top:50%;
    margin-top: -0.11rem;
    left:0.29rem;
  }
  .triangle_border_right{
    width:0;
    height:0;
    border-width:0.29rem 0rem 0.29rem 0.29rem;
    border-style:solid;
    border-color:transparent transparent transparent #1D68A8;/*透明 透明 透明 灰*/
    position:relative;
    float: left;
  }

</style>
