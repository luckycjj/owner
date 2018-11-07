<template>
    <div id="haveCar" style="top:0rem;">
      <div id="title" v-title data-title="车源"></div>
      <div id="screen">
        <div class="screenAddre">
          <div class="startAddre">
            <div class="addresscheck" @click="checkAddress(0)" v-html="searchList.startAdd == '' ? '全国' : searchList.startAdd "></div>
          </div>
          <img src="../images/arrow.png">
          <div class="startAddre">
            <div class="addresscheck" @click="checkAddress(1)" v-html="searchList.endAdd == '' ? '全国' : searchList.endAdd "></div>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div class="screenCarLength">
          <div class="distanceLine"></div>
          <div class="dist">
            <p v-html="searchList.carLength == '' ? '车长' :searchList.carLength  + '米'"  @click="checkdistance(1)"></p>
          </div>
        </div>
        <div class="screenDistance">
          <div class="dist">
            <p v-html="searchList.distance == '' ? '选择车型' : searchList.distanceName" @click="checkdistance(2)"></p>
          </div>
        </div>
        <div class="screenGo">
          <div class="dist">
            <p @click="caozuoZ()">操作</p>
          </div>
        </div>
        <div class="clearBoth"></div>
      </div>
      <div class="wrapper" id="trackTab">
        <div class="scroller">
          <ul class="clearfix">
            <li  tapmode="" v-for="(item,index) in tab" :style="{width : 10 / tab.length + 'rem'}" :i="index"><a href="javascript:void(0)">{{item.name}}</a></li>
          </ul>
        </div>
      </div>
      <div id="searchInput">
         <input type="text" placeholder="通过车牌号、手机号搜索司机" @click="searchDriver()"/>
      </div>
      <div  style="top:3.73rem;" v-for="(item,index) in tab" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
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
               <div class="imgcaozuo" @click="caozuo(1,items.location)">
                 <img src="../images/haveCarDingwei.png">
                 <p>定位</p>
               </div>
              <div class="imgcaozuo" @click="caozuo(2,items.driverCode)">
                <img src="../images/haveCarTel.png">
                <p>电话</p>
              </div>
              <div v-if="tabShow == 0" class="imgcaozuo" @click="caozuo(3,items)">
                <img src="../images/haveCarMessage.png">
                <p>短信</p>
              </div>
              <div v-if="tabShow == 1" class="imgcaozuo" @click="caozuo(4,items.pkCar)">
                <img src="../images/haveCarYesCar.png">
                <p>熟车</p>
              </div>
              <div class="clearBoth"></div>
            </div>
            <div class="clearBoth"></div>
          </li>
        </ul>
      </div>
      <footComponent :idx='1'></footComponent>
      <transition name="slide-fade">
        <div id="screenDistanceBox" v-if="screenDistanceTrue">
          <div id="screenDistanceBody">
            <img src="../images/closed2.png" @click="screenDistanceTrueClick(false)">
            <p v-html="cartype == 2 ? '选择车型' : '选择车长'"></p>
            <ul>
              <li v-if="cartype == 2" v-for="(item,index) in distanceList" @click="distanceListChecked(index)" :class="item.checked ? 'distanceListcheckTrue': ''" :style="{marginRight : index % 4 != 3 ? '0.25rem' : '0'}">{{item.name}}</li>
              <li v-if="cartype == 1" v-for="(item,index) in carLengthList" @click="distanceListChecked(index)" :class="item.checked ? 'distanceListcheckTrue': ''" :style="{marginRight : index % 4 != 3 ? '0.25rem' : '0'}">{{item.name}}</li>
              <div class="clearBoth"></div>
            </ul>
            <div class="screenDistanceButton">
              <button @click="screenDistanceReset()">重置</button>
              <button @click="screenDistanceTrueClick(true)">确定</button>
              <div class="clearBoth"></div>
            </div>
          </div>
        </div>
        <div id="screenAddressBox" v-if="screenAddressTrue">
          <div id="screenAddressBody">
            <img src="../images/closed2.png"  @click="hotAddressListno()">
            <p>选择地址</p>
            <h6 v-if="normalCityList.length > 0" @click="normalCityGoback()">返回</h6>
            <div class="checkedAddress" v-if="normalCityList.length > 0">
              <h1>已选择</h1>
              <ul>
                <li v-html="addtype == 0 ? searchList.searchStartPro : searchList.searchEndPro"></li>
                <li v-html="addtype == 0 ? searchList.searchStartCity : searchList.searchEndCity"></li>
                <li><span style="color: #2c9cff;border-bottom: 1px solid #2c9cff;font-size:0.35rem;">请选择</span></li>
                <div class="clearBoth"></div>
              </ul>
            </div>
            <div class="hotAddress" v-if="normalCityList.length == 0">
              <h1>热门城市</h1>
              <ul>
                <li v-for="(item ,index) in hotAddressList"  :class="item.checked ? 'addCheckTrue' : ''" @click="hotAddressListChoose(item,0)">{{item.name}}</li>
                <div class="clearBoth"></div>
              </ul>
            </div>
            <div class="selectAddress" v-if="normalCityList.length == 0">
              <h1>选择省份/地区</h1>
              <ul>
                <li v-for="(item ,index) in normalAddressList" @click="chooseProvince(item,index)"><div class="shouzimu">{{item.PinyinFirst}}</div>{{item.region}}<div class="clearBoth"></div></li>
                <div class="clearBoth"></div>
              </ul>
            </div>
            <div class="selectcity" v-if="normalCityList.length > 0 && normalAreaList.length == 0">
              <h1>选择城市</h1>
              <ul id="selectcityUl">
                <li @click="hotAddressListChoose(addtype == 0 ?  searchList.searchStartPro : searchList.searchEndPro,2)"><div class="shouzimu"></div><h3 v-html="addtype == 0 ? '全' + searchList.searchStartPro : '全' + searchList.searchEndPro"></h3></li>
                <li v-for="(item ,index) in normalCityList" :class="item.checked ? 'addCheckTrue' : ''" @click="chooseCity(item,index)"><div class="shouzimu">{{item.PinyinFirst}}</div>{{item.region}}</li>
                <div class="clearBoth"></div>
              </ul>
            </div>
            <div class="selectarea" v-if="normalAreaList.length > 0">
              <h1>选择区/县</h1>
              <ul id="selectareaUl">
                <li @click="hotAddressListChoose(addtype == 0 ?  searchList.searchStartCity : searchList.searchEndCity,2)"><div class="shouzimu"></div><h3 v-html="addtype == 0 ? '全' + searchList.searchStartCity : '全' + searchList.searchEndCity"></h3></li>
                <li v-for="(item ,index) in normalAreaList" :class="item.checked ? 'addCheckTrue' : ''" @click="hotAddressListChoose(item,1)"><div class="shouzimu">{{item.PinyinFirst}}</div>{{item.region}}</li>
                <div class="clearBoth"></div>
              </ul>
            </div>
            <div class="scrollAZ" v-if="normalCityList.length  ==  0 && normalAreaList.length == 0">
                <ul>
                  <li @click="scrollAddress(index)" v-for="(item,index) in PinyinFirstList"> {{item.PinyinFirst}}</li>
                </ul>
            </div>
          </div>
        </div>
        <div id="operationBox" v-if="operationBoxTrue" @click="operationBoxFalse($event)">
          <div id="operation" style="top:1.35rem;">
            <ul>
              <li @click="operationListUrl(item.url)" v-if="(tabShow == 1 && index == 1)  || tabShow == 0" v-for="(item,index) in operationList" :style="{backgroundImage:'url('+item.icon+')',borderBottom:index != operationList.length - 1 ? '1px solid #F5F5F5' : ''}">{{item.name}}</li>
            </ul>
          </div>
        </div>
      </transition>
      <div id="container" style="display: none;"></div>
    </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
  import {provinceCityArea} from "../js/provinceCityArea";
  import  {ConvertPinyin}  from "../js/PINYING"
  import "../js/navbarscroll";
  import MeScroll from '../js/mescroll'
  import {iscroll} from '../js/iscroll'
  import AMap from 'AMap'
    export default {
        name: "have-car",
        data(){
          return{
            searchList:{
              startAdd:"",
              endAdd:"",
              distance:"",
              distanceName:"",
              searchStartPro:"",
              carLength:"",
              carLengthName:"",
              searchEndPro:"",
              searchStartCity:"",
              searchEndCity:"",
            },
            screenDistanceTrue:false,
            screenAddressTrue:false,
            operationBoxTrue:false,
            distanceList:[],
            carLengthList:[],
            hotAddressList:[{
              name:"全国",
              region:"",
              chescked:false,
            },{
              name:"北京市",
              region:"北京市",
              chescked:false,
            },{
              name:"上海市",
              region:"上海市",
              chescked:false,
            },{
              name:"广州市",
              region:"广州市",
              chescked:false,
            },{
              name:"深圳市",
              region:"深圳市",
              chescked:false,
            },{
              name:"杭州市",
              region:"杭州市",
              chescked:false,
            },{
              name:"南京市",
              region:"南京市",
              chescked:false,
            },{
              name:"苏州市",
              region:"苏州市",
              chescked:false,
            },{
              name:"天津市",
              region:"天津市",
              chescked:false,
            },{
              name:"武汉市",
              region:"武汉市",
              chescked:false,
            },{
              name:"长沙市",
              region:"长沙市",
              chescked:false,
            },{
              name:"重庆市",
              region:"重庆市",
              chescked:false,
            },{
              name:"成都市",
              region:"成都市",
              chescked:false,
            }],
            normalAddressList:[],
            normalCityList:[],
            normalAreaList:[],
            searchStartPro:"",
            searchEndPro:"",
            searchStartCity:"",
            searchEndCity:"",
            addtype:0,
            cartype:1,
            tabShow:0,
            tab:[{
              name:"熟车",
              number:0,
              prolist:[]
            },{
              name:"车源",
              number:0,
              prolist:[]
            }],
            errorlogo: 'this.src="' + require('../images/userImg.png') + '"',
            mescrollArrList:null,
            PinyinFirstList:[],
            operationList:[{
               name:"群发短信",
               icon:require("../images/xinxi.png"),
               url:"/familiarCar"
            },{
              name:"短信记录",
              icon:require("../images/xinxijilu.png"),
              url:"/sendtextmessage"
            }],
            map:"",

          }
        },
        mounted:function () {
           var _this = this;
           androidIos.judgeIphoneX("screen",0);
          androidIos.judgeIphoneX("mescroll",2);
          androidIos.judgeIphoneX("mescroll",1);
          _this.tabShow =  sessionStorage.getItem("haveCarTap") == null ? 0 : sessionStorage.getItem("haveCarTap");
          var SCREENROBBING;
          if(_this.tabShow == 0 ){
            SCREENROBBING = localStorage.getItem("SCREENROBBING");
          }else{
            SCREENROBBING = localStorage.getItem("SCREENROBBING2");
          }
          if(SCREENROBBING != null){
            _this.searchList = JSON.parse(SCREENROBBING);
          }

          _this.normalAddressList = provinceCityArea;
          var list = [];
          for(var i = 0 ; i < _this.normalAddressList.length ;i++){
            _this.normalAddressList[i].PinyinFirst = ConvertPinyin(_this.normalAddressList[i].region).substring(0,1).toUpperCase();
            list.push({
              PinyinFirst:ConvertPinyin(_this.normalAddressList[i].region).substring(0,1).toUpperCase(),
              scroll:0,
            });
          }
          _this.normalAddressList.sort(_this.compare("PinyinFirst"));
          _this.unique1(_this.normalAddressList);
          list.sort(_this.compare("PinyinFirst"));
          for(var i = 0 ; i < list.length ;i++){
            list[i].scroll = _this.countId(list);
          }
          var res = [list[0]];
          for(var i = 1; i < list.length; i++){
            if(list[i].PinyinFirst !== res[res.length - 1].PinyinFirst){
              res.push(list[i]);
            }
          }
          _this.PinyinFirstList = res;
          androidIos.bridge(_this);

        },
        methods:{
          operationListUrl:function (url) {
            var _this = this;
            androidIos.addPageList();
            _this.$router.push({path:url});
          },
          caozuoZ:function () {
            var _this = this;
            var messageList =  sessionStorage.getItem("ownerMessage");
            if(JSON.parse(messageList).status == "2"){
              _this.operationBoxTrue = true;
              _this.$nextTick(function () {
                androidIos.judgeIphoneX("operation",2);
              })
            }else{
              androidIos.second("请审核通过后再试！");
            }
          },
          operationBoxFalse:function (e) {
            var _this = this;
            if(e.target.id == "operationBox"){
              _this.operationBoxTrue = false;
            }
          },
          scrollAddress:function (index) {
            var _this = this;
            var scroll = 0;
            for(var i = 0 ; i <index;i++){
              scroll =  scroll + _this.PinyinFirstList[i].scroll[_this.PinyinFirstList[i].PinyinFirst];
            }
            var html = document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
            $(".selectAddress ul").animate({scrollTop: scroll*1.2*html}, 100);
          },
          countId:function(data){
            var count={};
            for(var i=0;i<data.length;i++){
              if(count[data[i].PinyinFirst]){
                count[data[i].PinyinFirst]++;;
                continue;
              }
              count[data[i].PinyinFirst]=1;
            }
            return count;
          },
          go:function () {
            var _this = this;
            $('.wrapper').navbarscroll({defaultSelect:_this.tabShow});
            var curNavIndex = _this.tabShow;//首页0; 奶粉1; 面膜2; 图书3;
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
                    icon: require("../images/nojilu.png"),
                    tip: "暂无车源", //提示
                  },
                  clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
                  toTop:{ //配置回到顶部按钮
                    src :require("../images/scrollTop.png"), //默认滚动到1000px显示,可配置offset修改
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
                _this.tab[dataIndex].prolist.push(pageData[i]);
              }
            }
            function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
              //延时一秒,模拟联网
              setTimeout(function () {
                var locationAMap = androidIos.getcookie("locationAMap");
                if(locationAMap == ""){
                  androidIos.loading("获取位置");
                  new AMap.Map('container', {
                    resizeEnable: true
                  });
                  AMap.plugin('AMap.Geolocation', function() {
                    var geolocation = new AMap.Geolocation({
                      zoomToAccuracy: false,   //定位成功后是否自动调整地图视野到定位点
                    });
                    geolocation.getCurrentPosition(function(status,result){
                      if(status=='complete'){
                        onComplete(result)
                      }else{
                        onError(result)
                      }
                    });
                  });
                  function onComplete(data) {
                    _this.map = data.position;
                    androidIos.setcookie("locationAMap",JSON.stringify(data.position),0.001);
                    $("#common-blackBox").remove();
                    _this.ajax(curNavIndex,pageNum,pageSize,successCallback,errorCallback);
                  }
                  //解析定位错误信息
                  function onError(data) {
                    androidIos.second("定位失败");
                  }
                }else{
                  _this.map = JSON.parse(locationAMap);
                  new AMap.Map('container', {
                    resizeEnable: true
                  });
                  AMap.plugin('AMap.Geolocation', function() {
                    var geolocation = new AMap.Geolocation({
                      zoomToAccuracy: false,   //定位成功后是否自动调整地图视野到定位点
                    });
                    geolocation.getCurrentPosition(function(status,result){
                      if(status=='complete'){
                        onComplete(result)
                      }else{
                        onError(result)
                      }
                    });
                  });
                  function onComplete(data) {
                    _this.map = data.position;
                    androidIos.setcookie("locationAMap",JSON.stringify(data.position),0.01);
                  }
                  //解析定位错误信息
                  function onError(data) {
                    androidIos.second("定位失败");
                  }
                  _this.ajax(curNavIndex,pageNum,pageSize,successCallback,errorCallback);
                }

              },100)
            }
          },
          ajax:function (curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
            var _this = this;
            var http = curNavIndex == 0 ? "/driver/findCarSourceCollect" : "/driver/findCarAndDriver";
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + http,
              data:JSON.stringify({
                page:pageNum,
                size:pageSize,
                carLength:_this.searchList.carLength,
                carModel:_this.searchList.distance == 0 ? "" : _this.searchList.distance,
                startCity:_this.searchList.startAdd,
                endCity:_this.searchList.endAdd,
                phone:"",
                carno:"",
                location:_this.map.lng + "," + _this.map.lat,
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source"),
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
                  /* androidIos.errorwife();*/
                  successCallback([]);
                }
              }
            });
          },
          caozuo:function (type,message) {
            var _this = this;
            var messageList =  sessionStorage.getItem("ownerMessage");
            if(JSON.parse(messageList).status == "2"){
              if(type == 1){
                if(message == "" || message == null){
                  androidIos.second("暂无司机位置信息");
                }else{
                  androidIos.addPageList();
                  _this.$router.push({path:"/driverMap",query:{location:message}})
                }
              }else if(type == 2){
                androidIos.telCall(message);
              }else if(type == 3){
                androidIos.addPageList();
                var list = [];
                list.push(message);
                _this.$router.push({path:"/sendtextmessage",query:{driver:JSON.stringify(list)}});
              }else if(type == 4){
                androidIos.first("确认添加为熟车吗?");
                $(".tanBox-yes").unbind('click').click(function(){
                  $(".tanBox-bigBox").remove();
                  $.ajax({
                    type: "POST",
                    url: androidIos.ajaxHttp() + "/driver/collectCarAndDriver",
                    data:JSON.stringify({
                      pk:message,
                      userCode:sessionStorage.getItem("token"),
                      source:sessionStorage.getItem("source"),
                    }),
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    timeout: 30000,
                    success: function (collectCarAndDriver) {
                      if (collectCarAndDriver.success == "1") {
                        _this.$cjj("添加成功");
                        if(_this.mescrollArrList[1-_this.tabShow] != null){
                          _this.mescrollArrList[1-_this.tabShow] = null;
                          _this.tab[1-_this.tabShow].prolist = [] ;
                          $("#mescroll" + (1-_this.tabShow)).find(".mescroll-downwarp").remove();
                          $("#mescroll" + (1-_this.tabShow)).find(".mescroll-upwarp").remove();
                        }
                      }else{
                        androidIos.second(collectCarAndDriver.message);
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
                });
              }
            }else{
               androidIos.second("请审核通过后再试！");
            }

          },
          compare : function(name){
            return function(a,b){
              var s1 = a[name];
              var s2 = b[name];
              return s1.localeCompare(s2);
            }
          },
          unique1:function(arr){
            for (var i = 0; i < arr.length; i++) {
              for(var j = i+1 ; j < arr.length;j++){
                if(arr[i].PinyinFirst == arr[j].PinyinFirst){
                  arr[j].PinyinFirst = "";
                }
              }
            }
            return arr;
          },
          checkAddress:function (type) {
            var _this = this;
            _this.screenAddressTrue = true;
            _this.addtype = type;
            _this.normalCityList = [];
            _this.normalAreaList = [];
            for(var i =0 ; i < _this.hotAddressList.length;i++){
              _this.hotAddressList[i].checked = false;
            }
            for(var i =0 ; i < _this.normalCityList.length;i++){
              _this.normalCityList[i].checked = false;
            }
           /* if(type == 0){
              _this.searchStartPro =  _this.searchList.searchStartPro;
              _this.searchStartCity = _this.searchList.searchStartCity;
              if(_this.searchList.startAdd != "" && _this.searchList.searchStartPro == ""){
                for(var i = 0; i < _this.hotAddressList.length;i++){
                  _this.hotAddressList[i].checked = false;
                  if(_this.hotAddressList[i].region == _this.searchList.startAdd){
                    _this.hotAddressList[i].checked = true;
                  }
                }
              }else if( _this.searchList.searchStartPro != ""){
                for(var i = 0 ; i < _this.normalAddressList.length ; i++){
                  if(_this.searchList.searchStartPro == _this.normalAddressList[i].region){
                    _this.normalCityList = _this.normalAddressList[i].child;
                    for(var x = 0 ; x < _this.normalCityList.length ;x++){
                      _this.normalCityList[x].PinyinFirst = ConvertPinyin(_this.normalCityList[x].region).substring(0,1).toUpperCase();
                    }
                    _this.normalCityList.sort(_this.compare("PinyinFirst"));
                    _this.unique1(_this.normalCityList);
                    for(var x = 0; x < _this.normalCityList.length ; x++){
                      if(_this.searchList.searchStartCity == _this.normalCityList[x].region){
                        _this.normalAreaList = _this.normalCityList[x].child;
                        for(var z = 0 ; z < _this.normalAreaList.length ;z++){
                          _this.normalAreaList[z].PinyinFirst = ConvertPinyin(_this.normalAreaList[z].region).substring(0,1).toUpperCase();
                        }
                        _this.normalAreaList.sort(_this.compare("PinyinFirst"));
                        _this.unique1(_this.normalAreaList);
                        _this.$nextTick(function () {
                          var scrolltopGo = _this.tabShow == 0 ? localStorage.getItem("getPageScroll0") :  localStorage.getItem("getPageScroll2");
                          scrolltopGo = scrolltopGo == null ? 0 : scrolltopGo;
                          $("#selectareaUl").animate({scrollTop: scrolltopGo}, 0);
                        });
                        break;
                      }
                    }
                  }
                }
                for(var i = 0 ; i < _this.normalAreaList.length ; i++){
                  _this.normalAreaList[i].checked = false;
                  if(_this.searchList.startAdd == _this.normalAreaList[i].region){
                    _this.normalAreaList[i].checked = true;
                  }
                }
              }
            }else if(type == 1){
              _this.searchEndPro =  _this.searchList.searchEndPro;
              _this.searchEndCity = _this.searchList.searchEndCity;
              if(_this.searchList.endAdd != "" && _this.searchList.searchEndPro == ""){
                for(var i = 0; i < _this.hotAddressList.length;i++){
                  _this.hotAddressList[i].checked = false;
                  if(_this.hotAddressList[i].region == _this.searchList.endAdd){
                    _this.hotAddressList[i].checked = true;
                  }
                }
              }else if( _this.searchList.searchEndPro != ""){
                for(var i = 0 ; i < _this.normalAddressList.length ; i++){
                  if(_this.searchList.searchEndPro == _this.normalAddressList[i].region){
                    _this.normalCityList = _this.normalAddressList[i].child;
                    for(var x = 0 ; x < _this.normalCityList.length ;x++){
                      _this.normalCityList[x].PinyinFirst = ConvertPinyin(_this.normalCityList[x].region).substring(0,1).toUpperCase();
                    }
                    _this.normalCityList.sort(_this.compare("PinyinFirst"));
                    _this.unique1(_this.normalCityList);
                    for(var x = 0; x < _this.normalCityList.length ; x++){
                      if(_this.searchList.searchEndCity == _this.normalCityList[x].region){
                         _this.normalAreaList = _this.normalCityList[x].child;
                        for(var z = 0 ; z< _this.normalAreaList.length ;z++){
                          _this.normalAreaList[z].PinyinFirst = ConvertPinyin(_this.normalAreaList[z].region).substring(0,1).toUpperCase();
                        }
                        _this.normalAreaList.sort(_this.compare("PinyinFirst"));
                        _this.unique1(_this.normalAreaList);
                        _this.$nextTick(function () {
                          var scrolltopGo = _this.tabShow == 0 ? localStorage.getItem("getPageScroll1") :  localStorage.getItem("getPageScroll3");
                          scrolltopGo = scrolltopGo == null ? 0 : scrolltopGo;
                          $("#selectareaUl").animate({scrollTop: scrolltopGo}, 0);
                        });
                      }
                    }
                  }
                }
                for(var i = 0 ; i < _this.normalAreaList.length ; i++){
                  _this.normalAreaList[i].checked = false;
                  if(_this.searchList.endAdd == _this.normalAreaList[i].region){
                    _this.normalAreaList[i].checked = true;
                  }
                }
              }
            }*/
          },
          hotAddressListno:function () {
            var _this = this;
            _this.screenAddressTrue = false;
            if(_this.addtype == 0){
              _this.searchList.searchStartPro = _this.searchStartPro;
              _this.searchList.searchStartCity = _this.searchStartCity;
            }else if(_this.addtype == 1){
              _this.searchList.searchEndPro = _this.searchEndPro;
              _this.searchList.searchEndCity = _this.searchEndCity;
            }
          },
          getPageScroll:function() {
            var  yScroll;
            yScroll = document.getElementById("selectareaUl").scrollTop;
            return yScroll;
          },
          chooseProvince:function (item,index) {
            var _this = this;
            for(var i = 0; i < _this.normalAddressList.length; i++){
              _this.normalAddressList[i].checked = false;
            }
            _this.normalAddressList[index].checked = true;
            _this.normalCityList = item.child;
            for(var i = 0 ; i < _this.normalCityList.length ;i++){
              _this.normalCityList[i].PinyinFirst = ConvertPinyin(_this.normalCityList[i].region).substring(0,1).toUpperCase();
            }
            _this.normalCityList.sort(_this.compare("PinyinFirst"));
            _this.unique1(_this.normalCityList);
            for(var i =0 ; i < _this.normalCityList.length;i++){
              _this.normalCityList[i].checked = false;
            }
            if(_this.addtype == 0){
              _this.searchList.searchStartPro = item.region;
            }else if(_this.addtype == 1){
              _this.searchList.searchEndPro = item.region;
            }
          },
          chooseCity:function (item,index) {
            var _this = this;
            for(var i = 0; i < _this.normalCityList.length; i++){
              _this.normalCityList[i].checked = false;
            }
            _this.normalCityList[index].checked = true;
            _this.normalAreaList = item.child;
            for(var i = 0 ; i < _this.normalAreaList.length ;i++){
              _this.normalAreaList[i].PinyinFirst = ConvertPinyin(_this.normalAreaList[i].region).substring(0,1).toUpperCase();
            }
            _this.normalAreaList.sort(_this.compare("PinyinFirst"));
            _this.unique1(_this.normalAreaList);
            for(var i =0 ; i < _this.normalAreaList.length;i++){
              _this.normalAreaList[i].checked = false;
            }
            if(_this.addtype == 0){
              _this.searchList.searchStartCity = item.region;
            }else if(_this.addtype == 1){
              _this.searchList.searchEndCity = item.region;
            }
          },
          normalCityGoback:function () {
            var _this = this;
            if(_this.normalAreaList.length > 0){
              for(var i = 0; i < _this.normalCityList.length; i++){
                _this.normalCityList[i].checked = false;
              }
              _this.normalAreaList = [];
              if(_this.addtype == 0){
                _this.searchList.searchStartCity = "";
              }else if(_this.addtype == 1){
                _this.searchList.searchEndCity = "";
              }
            }else if(_this.normalAreaList.length == 0){
              for(var i = 0; i < _this.normalAddressList.length; i++){
                _this.normalAddressList[i].checked = false;
              }
              _this.normalCityList = [];
              if(_this.addtype == 0){
                _this.searchList.searchStartPro = "";
              }else if(_this.addtype == 1){
                _this.searchList.searchEndPro = "";
              }
            }

          },
          hotAddressListChoose:function (item,type) {
            var _this = this;
            if(_this.addtype == 0){
              if(type == 0 || type == 1){
                _this.searchList.startAdd = item.region;
              }else if(type == 2){
                _this.searchList.startAdd = item;
              }

              if(type == 0){
                _this.searchList.searchStartPro = "";
              }
            }else if(_this.addtype == 1){
              if(type == 0 || type == 1){
                _this.searchList.endAdd = item.region;
              }else if(type == 2){
                _this.searchList.endAdd = item;
              }
              if(type == 0){
                _this.searchList.searchEndPro = "";
              }
            }
            if(_this.tabShow == 0){
              if(_this.addtype == 0 && type == 1 ){
                localStorage.setItem("getPageScroll0",_this.getPageScroll());
              }else if(_this.addtype == 1 && type == 1){
                localStorage.setItem("getPageScroll1",_this.getPageScroll());
              }
            }else if(_this.tabShow == 1){
              if(_this.addtype == 0 && type == 1 ){
                localStorage.setItem("getPageScroll2",_this.getPageScroll());
              }else if(_this.addtype == 1 && type == 1){
                localStorage.setItem("getPageScroll3",_this.getPageScroll());
              }
            }
            for(var i =0 ; i < _this.hotAddressList.length;i++){
              _this.hotAddressList[i].checked = false;
            }
            for(var i =0 ; i < _this.normalCityList.length;i++){
              _this.normalCityList[i].checked = false;
            }
            for(var i =0 ; i < _this.normalAreaList.length;i++){
              _this.normalAreaList[i].checked = false;
            }
            _this.normalAreaList = [];
            _this.normalCityList = [];
            _this.searchStartPro = "";
            _this.searchEndCity = "";
            _this.searchStartCity = "";
            _this.searchEndCity = "";
            _this.searchList.searchStartPro = "";
            _this.searchList.searchEndPro = "";
            _this.searchList.searchStartCity = "";
            _this.searchList.searchEndCity = "";
            if(type == 0 || type == 1){
              item.checked = true;
            }
            _this.screenAddressTrue = false;
            if(_this.tabShow == 0){
              localStorage.setItem("SCREENROBBING",JSON.stringify(_this.searchList));
            }else if(_this.tabShow == 1){
              localStorage.setItem("SCREENROBBING2",JSON.stringify(_this.searchList));
            }
            _this.mescrollArrList[_this.tabShow].resetUpScroll();
          },
          checkdistance:function (type) {
            var _this = this;
            _this.screenDistanceTrue = true;
            _this.cartype = type;
            if(_this.distanceList.length == 0 && type == 2){
              $.ajax({
                type: "GET",
                url: androidIos.ajaxHttp() + "/settings/getSysConfigList",
                data: {
                  str: "car_type",
                  userCode: sessionStorage.getItem("token"),
                  source: sessionStorage.getItem("source")
                },
                dataType: "json",
                timeout: 30000,
                async:false,
                success: function (getCarType) {
                  var list = [{
                    value:"",
                    name:"不限",
                    checked:false,
                  }];
                  for(var i = 0; i<getCarType.length;i++){
                    var json = {
                      value:getCarType[i].value,
                      name:getCarType[i].displayName,
                      checked:false,
                    }
                    list.push(json)
                  }
                  _this.distanceList = list;
                },
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                  if (status == 'timeout') {//超时,status还有success,error等值的情况
                    androidIos.second("网络请求超时");
                  } else if (status == 'error') {
                    androidIos.errorwife();
                  }
                }
              });
            }else if(_this.carLengthList.length == 0 && type == 1){
              $.ajax({
                type: "GET",
                url: androidIos.ajaxHttp() + "/settings/getSysConfigList",
                data: {
                  str: "car_length",
                  userCode: sessionStorage.getItem("token"),
                  source: sessionStorage.getItem("source")
                },
                dataType: "json",
                timeout: 30000,
                async:false,
                success: function (getCarType) {
                  var list = [{
                    value:"",
                    name:"不限",
                    checked:false,
                  }];
                  for(var i = 0; i<getCarType.length;i++){
                    var json = {
                      value:getCarType[i].value,
                      name:getCarType[i].displayName,
                      checked:false,
                    }
                    list.push(json)
                  }
                  _this.carLengthList = list;
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
            if(type == 2){
              for(var i = 0;i < _this.distanceList.length ; i++){
                if(_this.distanceList[i].value == _this.searchList.distance){
                  _this.distanceList[i].checked = true;
                }
              }
            }else if(type == 1){
              for(var i = 0;i < _this.carLengthList.length ; i++){
                if(_this.carLengthList[i].value == _this.searchList.carLength){
                  _this.carLengthList[i].checked = true;
                }
              }
            }
          },
          geolocation:function () {
            AMap.plugin('AMap.Geolocation', function() {
              var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
                buttonPosition:'RB',    //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

              });
              geolocation.getCurrentPosition(function(status,result){
                if(status=='complete'){
                  console.log(result)
                }else{
                   androidIos.second("定位失败");
                }
              });
            });
          },
          distanceListChecked:function (number) {
            var _this = this;
            if(_this.cartype == 2){
              for(var i = 0;i < _this.distanceList.length ; i++){
                _this.distanceList[i].checked = false;
              }
              _this.distanceList[number].checked = true;
            }else if(_this.cartype == 1){
              for(var i = 0;i < _this.carLengthList.length ; i++){
                _this.carLengthList[i].checked = false;
              }
              _this.carLengthList[number].checked = true;
            }
          },
          screenDistanceReset:function () {
            var _this = this;
            if(_this.cartype == 2){
              for(var i = 0;i < _this.distanceList.length ; i++){
                _this.distanceList[i].checked = false;
              }
            }else if(_this.cartype == 1){
              for(var i = 0;i < _this.carLengthList.length ; i++){
                _this.carLengthList[i].checked = false;
              }
            }
          },
          screenDistanceTrueClick:function (type) {
            var _this = this;
            _this.screenDistanceTrue = false;
            var list = [];
            var listName = [];
            if(_this.cartype == 2){
              for(var i = 0;i < _this.distanceList.length ; i++){
                if(_this.distanceList[i].checked){
                  list.push(_this.distanceList[i].value);
                  listName.push(_this.distanceList[i].name);
                  _this.distanceList[i].checked = false;
                }
              }
              if(type){
                _this.searchList.distance = list.join(",");
                _this.searchList.distanceName = listName.join(",");
                if(_this.tabShow == 0){
                  localStorage.setItem("SCREENROBBING",JSON.stringify(_this.searchList));
                }else if(_this.tabShow == 1){
                  localStorage.setItem("SCREENROBBING2",JSON.stringify(_this.searchList));
                }
                _this.mescrollArrList[_this.tabShow].resetUpScroll();
              }
            }else if(_this.cartype == 1){
              for(var i = 0;i < _this.carLengthList.length ; i++){
                if(_this.carLengthList[i].checked){
                  list.push(_this.carLengthList[i].value);
                  listName.push(_this.carLengthList[i].name);
                  _this.carLengthList[i].checked = false;
                }
              }
              if(type){
                _this.searchList.carLength = list.join(",");
                _this.searchList.carLengthName = listName.join(",");
                if(_this.tabShow == 0){
                  localStorage.setItem("SCREENROBBING",JSON.stringify(_this.searchList));
                }else if(_this.tabShow == 1){
                  localStorage.setItem("SCREENROBBING2",JSON.stringify(_this.searchList));
                }
                _this.mescrollArrList[_this.tabShow].resetUpScroll();
              }
            }

          },
          searchDriver:function () {
             var _this = this;
             androidIos.addPageList();
            _this.$router.push({path:"/searchDriver"});
          }
        }
    }
</script>
<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #haveCar .hide{
    display: none;
  }
</style>
<style scoped>
  .mescroll{
    position: absolute;
    top:2.53rem;
    bottom:1.3rem;
    height: auto!important;
  }
  .wrapper {
    position:relative;
    height: 1.16rem;
    width: 100%;
    margin:0 auto;
    background:white;
  }
  .wrapper .scroller {
    position:absolute;
  }
  .wrapper .scroller li {
    height:1.16rem;
    color:#373737;
    float: left;
    line-height: 1.16rem;
    font-size: .4rem;
    text-align: center;
    width:3.333333rem;
  }
  .wrapper .scroller li a{
    color:#999;
    display:block;
    font-size: 0.4rem;
    margin:0 0.1rem;
  }
  .wrapper .scroller li a span{
    color:#1D68A8;
    font-size: 0.3125rem;
  }
  .wrapper .scroller li.cur a{
    color:#1D68A8;
    border-bottom: 1px solid #1D68A8;
  }
#haveCar{
  position:absolute;
  top:0rem;
  bottom:0;
  height: auto;
  width:100%;
  background: #f6f6f6;
}
#screen{
  width:100%;
  height:1.37rem;
  background: -webkit-linear-gradient( #46B2E7 ,#1869A9); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#46B2E7, #1869A9); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#46B2E7, #1869A9); /* Firefox 3.6 - 15 */
  background: linear-gradient(#46B2E7 ,#1869A9); /* 标准的语法 */
}
.screenAddre{
  float: left;
  width:5rem;
}
.screenCarLength{
  float: left;
  width:1.3rem;
  line-height: 1.3rem;
  position: relative;
  padding-left: 0.24rem;
}
.screenCarLength p{
  display: inline-block;
  font-size:0.35rem ;
  max-width: 1.3rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  color:white;
}
.screenGo{
  float: right;
  width:1rem;
  line-height: 1.3rem;
  position: relative;
  margin-right: 0.2rem;
}
.screenGo p{
  display: inline-block;
  font-size:0.4rem ;
  max-width: 1.3rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  color:white;
}
.screenDistance{
  float: left;
  width:1.5rem;
  line-height: 1.3rem;
  position: relative;
  margin-left: 0.2rem;
}
.screenDistance p{
  display: inline-block;
  font-size:0.35rem ;
  max-width: 1.5rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  background-image: url("../images/dropDown.png");
  background-size:0.22rem ;
  background-repeat: no-repeat;
  background-position: 100% 50%;
  padding-right: 0.33rem;
  color:white;
}
.screenDistance h1{
  display: inline-block;
  font-size:0.4rem ;
  max-width: 1.5rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  color:white;
  position: absolute;
  left:0;
}
.dist{
  width:100%;
  float: left;
  line-height: 1.3rem;
  position: relative;
  font-size:0.4rem ;
  color:#333;
  text-align: center;
  display: inline-block;
}
#searchInput{
  width:100%;
  height:1.2rem;
  background: white;
  border-top:1px solid #ececec;
}
  #searchInput input{
    width:7.5rem;
    padding:0.15rem 0.9rem ;
    color:#333;
    font-size: 0.34rem;
    line-height: 0.36rem;
    border-radius: 0.33rem;
    margin: 0.27rem auto 0 auto;
    background-color: #F3F6FB;
    display: block;
    background-image: url("../images/sousuo2.png");
    background-position: 0.2rem 50%;
    background-repeat: no-repeat;
    background-size: 0.375rem;
  }
.distanceLine{
  position: absolute;
  width:1px;
  background-color: #fff;
  height:0.82rem;
  left:0;
  top:39%;
  margin-top: -0.41rem;
}
.startAddre{
  width:46.6%;
  float: left;
  line-height: 1.3rem;
  position: relative;
  font-size:0.4rem ;
  color:#333;
  text-align: center;
  display: inline-block;
}
.addresscheck{
  display: inline-block;
  font-size:0.35rem ;
  max-width: 2rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  background-image: url("../images/dropDown.png");
  background-size:0.22rem ;
  background-repeat: no-repeat;
  background-position: 100% 50%;
  padding-right: 0.33rem;
  color:white;
}
.screenAddre img{
  width:6.8%;
  float: left;
  margin-top: 0.573rem;
}
#screenDistanceBox,#screenAddressBox{
  position: fixed;
  top:0;
  bottom: 0;
  left:0;
  right:0;
  height:auto;
  width:auto;
  background-color: rgba(0,0,0,0.3);
}
#screenDistanceBody{
  position: absolute;
  top:2.6rem;
  width:98%;
  left:1%;
  border-radius:0.4rem ;
  min-height: 2rem;
  background: white;
}
#screenAddressBody{
  position: absolute;
  bottom:0rem;
  width:98%;
  left:1%;
  border-top-left-radius:0.4rem ;
  border-top-right-radius:0.4rem ;
  min-height: 2rem;
  background: white;
}
#screenDistanceBody img,#screenAddressBody img{
  position: absolute;
  width:0.3rem;
  top:0.4rem;
  right:0.4rem;
}
#screenAddressBody h6{
  position: absolute;
  font-size: 0.35rem;
  top:0.25rem;
  left:0.4rem;
  color:#999;
}
#screenDistanceBody p,#screenAddressBody p{
  text-align: center;
  font-size: 0.43rem;
  color:#333;
  margin-top:0.15rem ;
}
#screenDistanceBody p span, #screenAddressBody p span{
  font-size: 0.43rem;
  color:#999;
}
#screenDistanceBody ul{
  width:9rem;
  margin: 0.5rem  auto 0 auto;
  border-bottom: 1px solid #e6e6e6;
}
#screenDistanceBody li{
  float: left;
  width:2rem;
  border: 1px solid #e6e6e6;
  text-align: center;
  line-height: 0.7rem;
  border-radius: 0.1rem;
  color:#333;
  font-size: 0.35rem;
  margin-bottom: 0.35rem;
}
.marginRight{
  margin-right: 0.25rem;
}
.screenDistanceCheck{
  width:9rem;
  margin: 0.4rem  auto 0 auto;
  border-top: 1px solid white;
}
.screenDistanceCheck h6{
  float: left;
  font-size: 0.375rem;
  color:#333;
  line-height: 0.375rem;
}
.distanceListcheckTrue{
  border:1px solid #2c9cff!important;
  background-image: url("../images/checkdistance.png");
  background-position: 102% 102%;
  background-size: 0.4rem;
  background-repeat: no-repeat;
}
.screenDistanceCheckFalse{
  width:0.42rem;
  height: 0.42rem;
  border-radius: 0.22rem;
  border:1px solid #999;
  margin-top: -0.06rem;
  float: right;
}
.screenDistanceButton{
  width:9rem;
  margin: 0.96rem  auto 0.3334rem auto;
}
.screenDistanceButton button:nth-child(1){
  width:2.32rem;
  height:1.1rem;
  border: 1px solid #2c9cff;
  color:#2c9cff;
  border-radius: 0.15rem;
  background-color: transparent;
  font-size: 0.45rem;
  float: left;
}
.addCheckTrue{
  color:#2c9cff!important;
}
.screenDistanceButton button:nth-child(2){
  width:6.46rem;
  height:1.1rem;
  border: 1px solid #2c9cff;
  color:#fff;
  border-radius: 0.15rem;
  background-color: #2c9cff;
  font-size: 0.45rem;
  float: right;
}
.screenDistanceCheckTrue{
  border: 1px solid #2c9cff!important;
  background-image: url("../images/screenDistanceCheckFalse.png");
  background-repeat: no-repeat;
  background-size:0.25rem;
  background-position: 50% 50%;
  background-color: #2c9cff;
}
.hotAddress,.checkedAddress,.selectAddress,.selectcity,.selectarea{
  width:9rem;
  margin: 0.3rem  auto 0.3334rem auto;
}
.hotAddress h1,.checkedAddress h1,.selectAddress h1,.selectcity h1,.selectarea h1{
  font-size: 0.3125rem;
  color:#999;
  margin-bottom: 0.15rem;
}
.hotAddress ul{
  width:100%;
  max-height: 7.5rem;
  overflow: scroll;
}
.selectAddress ul,.selectcity ul,.selectarea ul{
  width:100%;
  max-height: 7.5rem;
  overflow: scroll;
}
.checkedAddress ul{
  width:100%;
  max-height: 7.5rem;
  overflow: scroll;
  background-color: #FAFAFA;
}
.checkedAddress li{
  min-width:20%;
  margin-left:2.5%;
  float: left;
  font-size: 0.35rem;
  line-height: 1.2rem;
  text-align: center;
}
.hotAddress li{
  float: left;
  width:20%;
  margin: 0 2.5%;
  text-align: center;
  font-size: 0.35rem;
  line-height: 1.2rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.shouzimu{
  font-size: 0.375rem;
  color:#999;
  display: block;
  float: left;
  margin-right:0.5rem;
  width:0.375rem;
  min-width: 0.375rem;
  height:1.2rem;
}
.selectAddress li,.selectcity li,.selectarea li{
  width:80%;
  /*margin: 0 auto;*/
  text-align: left;
  font-size: 0.375rem;
  line-height: 1.2rem;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.scrollAZ{
  position: absolute;
  right:0.52rem;
  bottom:0.6rem;
}
.scrollAZ li{
   color:#999;
  font-size: 0.3125rem;
  width: 1rem;
  text-align: right;
}
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(0.13rem);
  opacity: 0;
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
    background-image: url("../images/haveCarDingweixiao.png");
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
    top:0.15rem;
    position: absolute;
  }
  .third .imgcaozuo{
    width:0.67rem;
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
  #operationBox{
    position: fixed;
    top:0;
    bottom: 1.3rem;
    width:100%;
    background: rgba(255,255,255,0);
  }
  #operation{
    width:4.44rem;
  /*  background-color: white;*/
    position: absolute;
    top:1.3rem;
    right:0.3rem;
    /*border-radius: 0.2rem;*/
  /*  box-shadow:0px 0px 4px 0px rgba(0,0,0,0.12);*/
    background-image: url("../images/sanjiaoxing.png");
    background-repeat: no-repeat;
    background-size: 4.44rem;
    background-position: 0% 0%;
  }
  #operation ul {
    padding-top: 0.14rem;
  }
  #operation li{
     width:3rem;
    padding-left: 1.44rem;
    background-position:0.57rem 50% ;
    background-repeat: no-repeat;
    background-size:0.427rem ;
    line-height: 0.96rem;
    font-size: 0.32rem;
    color:#373737;
  }
</style>
