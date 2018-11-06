<template>
     <div id="familiarCar" style="top:1.3rem;">
       <div id="title" v-title data-title="车源"></div>
       <div  style="top:0rem;" v-for="(item,index) in tab" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
         <ul :id="'dataList' + index" class="data-list">
           <li v-for="(items,indexs) in item.prolist">
             <div class="first">
               <img :src="items.driverPicture == null ? '' : items.driverPicture" :onerror="errorlogo">
             </div>
             <div class="second">
               <p>{{items.driverName}}</p>
               <h1>{{items.carno}}<span style="margin-left: 0.187rem"><span v-if="items.carLength != null && items.carLength != ''">{{items.carLength}}米</span><span v-if="items.carLength != null && items.carLength != '' && items.carModel != null && items.carModel != ''">/</span><span v-if="items.carModel != null && items.carModel != ''">{{items.carModel}}</span></span></h1>
               <h2 v-if="items.location != null && items.location != ''">{{items.heartbeatTime | timeCheck}}&nbsp;&nbsp;定位：{{items.heartbeatAddr}}&nbsp;&nbsp;离我&nbsp;&nbsp;{{items.distance*1 | distanceWidth}}</h2>
               <h3 v-else>暂无位置信息</h3>
             </div>
             <div class="third">
               <div class="imgcaozuo" @click="chooseDriver(items)"  :class="items.choose ? 'imgyes' : ''"></div>
               <div class="clearBoth"></div>
             </div>
             <div class="clearBoth"></div>
           </li>
         </ul>
       </div>
       <div id="messageSureListBox">
         <div class="imgcaozuo" :class="quanxuanList ? 'imgyes' : ''" @click="quanxuan()"></div>
         <p>全选</p>
         <h1>已选：{{sureList.length}}条</h1>
         <button @click="messageGo()">发送短信</button>
         <div class="clearBoth"></div>
       </div>
     </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import {provinceCityArea} from "../../js/provinceCityArea";
  import  {ConvertPinyin}  from "../../js/PINYING"
  import "../../js/navbarscroll";
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
    export default {
        name: "familiar-car",
      data(){
          return{
            tab:[{
              name:"熟车",
              number:0,
              prolist:[]
            }],
            maxlength:0,
            sureList:[],
            tabShow:0,
            quanxuanList:false,
            errorlogo: 'this.src="' + require('../../images/userImg.png') + '"',
          }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("familiarCar",2);
        var sendtextmessage = sessionStorage.getItem("sendtextmessage");
        if(sendtextmessage != undefined){
           _this.sureList = JSON.parse(sendtextmessage);
          sessionStorage.removeItem("sendtextmessage");
        }
        androidIos.bridge(_this);
      },
      methods:{
          go:function () {
            var _this = this;
            var mescrollArr=new Array(_this.tab.length);//4个菜单所对应的4个mescroll对象
            //初始化首页
            mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);
            _this.mescrollArrList = mescrollArr;
            /*初始化菜单*/
            $("#trackTab li").click(function(){
              var i=Number($(this).attr("i"));
              _this.tabShow = i;
              sessionStorage.setItem("haveCarTap",i);
              _this.searchList = {
                startAdd:"",
                endAdd:"",
                distance:"",
                distanceName:"",
                searchStartPro:"",
                carLength:"",
                carLengthName:"",
                searchEndPro:"",
              };
              if(_this.tabShow == 0){
                var SCREENROBBING = localStorage.getItem("SCREENROBBING");
                if(SCREENROBBING != null){
                  _this.searchList = JSON.parse(SCREENROBBING);
                }
              }else if(_this.tabShow == 1){
                var SCREENROBBING = localStorage.getItem("SCREENROBBING2");
                if(SCREENROBBING != null){
                  _this.searchList = JSON.parse(SCREENROBBING);
                }
              }
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
                  _this.mescrollArrList = mescrollArr;
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
              }else{
                $(".mescroll-totop").hide();
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
                    tip: "暂无车源", //提示
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
              var dataIndex=0; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
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
                _this.tab[dataIndex].prolist.push(pageData[i]);
              }
            }
            function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
              //延时一秒,模拟联网
              setTimeout(function () {
                /*  _this.geolocation();*/
                $.ajax({
                  type: "POST",
                  url: androidIos.ajaxHttp() + "/driver/findCarSourceCollect",
                  data:JSON.stringify({
                    page:pageNum,
                    size:1111111111,
                    carLength:"",
                    carModel: "",
                    startCity:"",
                    endCity:"",
                    phone:"",
                    carno:"",
                    location:"121.47,31.23",
                    userCode:sessionStorage.getItem("token"),
                    source:sessionStorage.getItem("source"),
                  }),
                  contentType: "application/json;charset=utf-8",
                  dataType: "json",
                  timeout: 30000,
                  success: function (loadInvoice) {
                    if (loadInvoice.success == "1") {
                      for(var i = 0;i < loadInvoice.list.length ; i++){
                        loadInvoice.list[i].choose = false;
                        for(var x = 0 ; x < _this.sureList.length;x++){
                           if(loadInvoice.list[i].pkCar == _this.sureList[x].pkCar){
                             loadInvoice.list[i].choose = true;
                           }
                        }
                      }
                      if( _this.sureList.length == loadInvoice.total){
                        _this.quanxuanList = true;
                      }else{
                        _this.quanxuanList = false;
                      }
                      _this.maxlength = loadInvoice.total;
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
                      /* androidIos.errorwife();*/
                      successCallback([]);
                    }
                  }
                });
              },100)
            }
          },
        quanxuan:function () {
          var _this = this;
          _this.quanxuanList = !_this.quanxuanList;
          if(_this.quanxuanList){
             for(var i = 0 ; i <_this.tab[0].prolist.length;i++){
               _this.tab[0].prolist[i].choose = true;
               _this.sureList.push(_this.tab[0].prolist[i]);
             }
          }else{
            for(var i = 0 ; i < _this.tab[0].prolist.length;i++){
              _this.tab[0].prolist[i].choose = false;
            }
            _this.sureList = [];
          }
        },
        chooseDriver:function (item) {
            var _this = this;
            item.choose = !item.choose;
            if(item.choose){
              _this.sureList.push(item);
              if(_this.sureList.length == _this.maxlength){
                _this.quanxuanList = true;
              }
            }else{
              _this.quanxuanList = false;
              for(var i = 0; i<_this.sureList.length;i++){
                if(item.pkCar = _this.sureList[i].pkCar){
                  _this.sureList.splice(i,1);
                  break;
                }
              }
            }
        },
        messageGo:function () {
          var _this = this;
          androidIos.addPageList();
          sessionStorage.setItem("sendtextmessage",JSON.stringify(_this.sureList));
          _this.$router.push({path:"/sendtextmessage",query:{driver:JSON.stringify(_this.sureList)}});
        }
      }
    }
</script>
<style>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #familiarCar .hide{
    display: none;
  }
</style>
<style scoped>
  #familiarCar{
    position: absolute;
    top:1.3rem;
    bottom:0rem;
    width:100%;
    height: auto!important;
    background:#F5F5F5 ;
  }
  .mescroll{
    position: absolute;
    top:0rem;
    bottom:1.3rem;
    height: auto!important;
  }
  .data-list li {
    background: white;
    border-top: 1px solid white;
    border-bottom: 1px solid #ececec;
    margin-top: 2px;
    position: relative;
  }
  .first{
    width:1rem;
    height: 1rem;
    overflow: hidden;
    border-radius: 50%;
    margin:0.45rem 0 0 0.347rem ;
    border-top: 1px solid white;
    float: left;
  }
  .first img{
    width:1rem;
    height:1rem;
  }
  .second{
    float: left;
    margin-left: 0.213rem;
    margin-top: 0.2rem;
  }
  .second p{
    font-size:0.4rem ;
    color:#373737;
    line-height:0.4rem ;
  }
  .second h1{
    font-size:0.347rem ;
    color:#373737;
    line-height:0.347rem ;
    margin-top: 0.15rem;
  }
  .second h2{
    font-size:0.3125rem ;
    color:#999;
    line-height:0.7rem ;
    background-image: url("../../images/haveCarDingweixiao.png");
    background-position: 0 50%;
    background-repeat: no-repeat;
    background-size: 0.25rem;
    padding-left: 0.4rem;
  }
  .second h3{
    font-size:0.3125rem ;
    color:#999;
    line-height:0.7rem ;
  }
  .second h1 span{
    font-size:0.347rem ;
    color:#1D68A8;
    line-height:0.347rem ;
  }
  .third{
    right:0;
    top:50%;
    margin-top: -0.25rem;
    position: absolute;
  }
  .third .imgcaozuo{
    width:0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    border: 1px solid #999999;
    float: left;
    margin-right: 0.33rem;
  }
  .third img{
    width:0.67rem;
  }
  .third p{
    font-size: 0.3125rem;
    text-align: center;
    color:#1D68A8;
    margin-top:0.06rem ;
  }
  #messageSureListBox{
    position: absolute;
    bottom:0;
    width:100%;
    height: 1.3rem;
    background: white;
    box-shadow:0px 2px 4px 0px rgba(0,0,0,0.5);
  }
  #messageSureListBox .imgcaozuo{
    width:0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    border: 1px solid #999999;
    float: left;
    margin-top:0.425rem ;
    margin-left:0.3rem ;
  }
  #messageSureListBox p{
    float: left;
    line-height: 1.3rem;
    color:#999;
    font-size: 0.4rem;
    margin-left:0.28rem ;
  }
  #messageSureListBox h1{
    float: left;
    line-height: 0.5rem;
    margin-top: 0.4rem;
    color:#1D68A8;
    font-size: 0.375rem;
    margin-left:0.3rem ;
    padding-left: 0.3rem;
    border-left: 1px solid #D8D8D8;
  }
  #messageSureListBox button{
    float: right;
    width:2.42rem;
    height: 1.06rem;
    margin-top: 0.12rem;
    color:#fff;
    font-size: 0.4rem;
    margin-right:0.4rem ;
    background-color: #1D68A8;
    border-radius: 0.2rem;
  }
  .imgyes{
    background-image: url("../../images/iconChoose.png");
    background-size: cover;
    background-repeat: no-repeat;
    border-color: #1D68A8!important;
    background-color: #1D68A8;
  }
</style>
