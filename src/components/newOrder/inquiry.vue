<template>
    <div id="inquiry">
      <div id="title" v-title data-title="询价"></div>
      <div class="tab">
        <div class="lableBigbox">
          <div class="lablebox">
            <span class="required">出发地</span>
            <div class="unit" :class="message.dAddress != '' ? 'sure' : ''" id="X00" v-html="message.dAddress == '' ? '请选择出发地' : message.dAddress"></div>
            <div class="clearBoth"></div>
          </div>
          <div class="lablebox borderno">
            <span class="required">目的地</span>
            <div class="unit" id="X01" :class="message.aAddress != '' ? 'sure' : ''" v-html="message.aAddress == '' ? '请选择目的地' : message.aAddress"></div>
            <div class="clearBoth"></div>
          </div>
        </div>
      </div>
      <div class="tab">
        <div class="lableBigbox">
          <div class="lablebox imgno">
            <span class="required">货品名称</span>
            <div class="inputBox">
               <input type="text" maxlength="30" @blur="problur()" @input="prokeyup()" @focus="profocus()" v-model="message.pro" placeholder="请填写货品名称"/>
               <ul v-if="listShow && (message.prolist.length > 0 || message.historylist.length > 0)">
                 <li v-for="(item,index) in message.historylist" @click="clicklist(item.name,$event)" >{{item.name}}<div @click="closedHis(index)" class="closed" ></div></li>
                 <li v-for="(item,index) in message.prolist" @click="clicklist(item.displayName,$event)" >{{item.displayName}}</li>
               </ul>
            </div>
            <div class="clearBoth"></div>
          </div>
          <div class="lablebox imgno">
            <span class="required">运输方式</span>
            <ul class="tranUl">
              <li :class="item.check ? 'checked' : ''" v-for="(item,index) in message.trantypeList" @click="trantypeList(index)">{{item.name}}</li>
              <div class="clearBoth"></div>
            </ul>
            <div class="clearBoth"></div>
          </div>
          <div class="lablebox imgno borderno" style="height: auto">
            <span class="required">货物重量/体积<span style="float: none;font-size: 0.3125rem;color:#999;line-height: 1.54rem;margin-left: 0.3rem">(请至少填写一项)</span></span>
            <div class="clearBoth"></div>
            <div class="inputWBox" style="border:none;">
               <input type="text" maxlength="10" v-model="message.weight" placeholder="填写重量">吨
            </div>
            <div class="inputWBox">
              <input type="text" maxlength="20" v-model="message.volume" placeholder="填写体积">立方米
            </div>
            <div class="clearBoth"></div>
          </div>
        </div>
      </div>
      <div class="tab">
        <p>费用 <span v-if="message.price != ''">￥{{message.price}}</span></p>
      </div>
      <button id="inquiryGet" @click="inquiryGet()">提交</button>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import Debounce from '../../js/Debounce.js'
  import {provinceCityArea} from "../../js/provinceCityArea";
  export default {
        name: "inquiry",
       data(){
          return{
            message:{
               dAddress:"",
               aAddress:"",
               pro:"",
               weight:"",
               volume:"",
               price:"",
               histroyLength:5,
               prolist:[],
               historylist:[],
               trantypeList:[{
                  name : "整车",
                  value:"5fda0edc8df34b4d8c1ed44a6f1f866e",
                  check:false,
               },{
                 name : "零担",
                 value:"e5e602a22c5a4689b8d151c76a4d1179",
                 check:false,
               }]
            },
            suremend: new Debounce(this.prolist, 10),
            listShow:false,
          }
       },
    watch:{
      message:{
        handler:function(val,oldval){
          var _this = this;
          _this.message.weight=(_this.message.weight.toString().match(/\d+(\.\d{0,3})?/)||[''])[0];
          _this.message.volume=(_this.message.volume.toString().match(/\d+(\.\d{0,3})?/)||[''])[0];
        },
        deep:true
      }
    },
      mounted:function () {
        var _this = this;
        androidIos.bridge(_this);
      },
      methods:{
          go:function () {
            var _this = this;
            var unitWight = new LArea();
            $(document).on('click','input',function () {
              var $Val = $.trim($(this).val());
              $(this).val('').focus().val($Val);
            })
            unitWight.init({
              'trigger': '#X00',
              'valueTo': '#X00',
              'keys': {
                id: 'id',
                name: 'name'
              },
              'type': 1,
              'data':provinceCityArea
            });
            unitWight.value = [0,0,0];
            unitWight.addPointer = function (name) {
              name = JSON.parse(name);
              _this.message.dAddress = name.firstVal + "-" + name.secondVal + "-"  + name.thirdVal;
            }
            var unitWight1 = new LArea();
            unitWight1.init({
              'trigger': '#X01',
              'valueTo': '#X01',
              'keys': {
                id: 'id',
                name: 'name'
              },
              'type': 1,
              'data':provinceCityArea
            });
            unitWight1.value = [0,0,0];
            unitWight1.addPointer = function (name) {
              name = JSON.parse(name);
              _this.message.aAddress = name.firstVal + "-" + name.secondVal + "-"  + name.thirdVal;
            }
          },
          clicklist:function (name,e) {
            var _this = this;
            if(e.target.classList[0] != "closed"){
              _this.message.pro = name;
              _this.listShow = false;
            }

          },
          trantypeList:function (index) {
            var _this = this;
            if( _this.message.trantypeList[index].check){
              _this.message.trantypeList[index].check = false;
            }else{
              for(var i = 0 ;i < _this.message.trantypeList.length;i++){
                _this.message.trantypeList[i].check = false;
              }
              _this.message.trantypeList[index].check = true;
            }
          },
        prokeyup:function () {
          var _this = this;
          _this.message.historylist = [];
          _this.message.pro = _this.message.pro.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\-\,\，\.\、\.\。]/g,'');
          _this.listShow = true;
          _this.suremend();
        },
        profocus:function () {
          var _this = this;
          _this.listShow = true;
          if(_this.message.pro != ""){
            _this.message.historylist = [];
            _this.suremend();
          }else{
            var HISTROYPROLIST = localStorage.getItem("HISTROYPROLIST");
            if(HISTROYPROLIST != undefined){
              HISTROYPROLIST = JSON.parse(HISTROYPROLIST);
              var pushList = [];
              for(var i = 0 ; i < HISTROYPROLIST.length ; i++){
                if( i < _this.message.histroyLength){
                  pushList.push(HISTROYPROLIST[i]);
                }
              }
              _this.message.historylist = pushList;
            }
          }
        },
        closedHis:function (index) {
          var _this = this;
          _this.message.historylist.splice(index,1);
          var HISTROYPROLIST = localStorage.getItem("HISTROYPROLIST");
          if(HISTROYPROLIST != undefined){
            HISTROYPROLIST = JSON.parse(HISTROYPROLIST);
            HISTROYPROLIST.splice(index,1);
            localStorage.setItem("HISTROYPROLIST",JSON.stringify(HISTROYPROLIST));
          }
        },
        prolist:function () {
          var _this = this;
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/settings/getGoodsTypeByName",
            data:{
               name:_this.message.pro
            },
            dataType: "json",
            timeout: 10000,
            async:false,
            success: function (getGoodsTypeByName) {
              if(getGoodsTypeByName.success=="1"){
                _this.message.prolist = getGoodsTypeByName.list;
              }else if(getGoodsTypeByName.success=="-1"){
                androidIos.second(getGoodsTypeByName.message)
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })

        },
        inquiryGet:function () {
          var _this = this.message;
          if(_this.dAddress == ""){
             bomb.first("请选择出发地");
             return false;
          }
          if(_this.aAddress == ""){
            bomb.first("请选择目的地");
            return false;
          }
          if(_this.pro == ""){
            bomb.first("请填写货物名称");
            return false;
          }
          if(_this.weight*1 <= 0 && _this.volume*1 <= 0){
            bomb.first("请填写重量或者体积");
            return false;
          }
          var list=[];
          for(var i = 0 ; i < _this.trantypeList.length ; i++ ){
            if(_this.trantypeList[i].check){
              list.push(_this.trantypeList[i].value);
            }
          }
          if(list.length == 0){
            bomb.first("请选择运输类别");
            return false;
          }

          var HISTROYPROLIST = localStorage.getItem("HISTROYPROLIST");
          var data = {
              name : _this.pro
          }
          if(HISTROYPROLIST != undefined){
            HISTROYPROLIST = JSON.parse(HISTROYPROLIST);
          }else{
            HISTROYPROLIST = [];
          }
          HISTROYPROLIST.unshift(data);
          HISTROYPROLIST = androidIos.uniq(HISTROYPROLIST);
          localStorage.setItem("HISTROYPROLIST",JSON.stringify(HISTROYPROLIST));
          var json = {
            startCity:_this.dAddress.split("-")[1].replace("市",""),
            endCity:_this.aAddress.split("-")[1].replace("市",""),
            carLength:list[0] == "5fda0edc8df34b4d8c1ed44a6f1f866e" ? "9.6" : "",
            weight:_this.weight,
            volume:_this.volume,
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/checkPrice",
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            async:false,
            success: function (checkPrice) {
              if(checkPrice.success=="1"){
                _this.price = checkPrice.message;
              }else if(checkPrice.success=="-1"){
                androidIos.second(checkPrice.message)
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        },
        problur:function (e) {
          var _this = this;
          _this.listShow = false;
        },
      }
    }
</script>

<style scoped>
  .lableBigbox{
       background: white;
  }
  .tab{
    width:94%;
    margin:0.47rem auto 0 auto ;
    border-radius: 0.2rem;
  }
  .lableBigbox{
    border-radius: 0.2rem;
  }
  .tab p{
      margin-left: 5%;
      font-size: 0.4rem;
      line-height: 1rem;
      margin-top: 0.2rem;
    }
  .tab p span{
    margin-left: 0.2rem;
    font-size: 0.4rem;
    color:#2c9cff;
  }
  .lablebox{
    width:90%;
    margin: 0 5%;
    height: 1.54rem;
    line-height: 1.54rem;
    border-bottom: 1px solid #dadada;
    background-image: url("../../images/lookMore.png");
    background-size: 0.187rem;
    background-repeat: no-repeat;
    background-position: 95% 50%;
  }
  .lablebox span{
    line-height: 1.54rem;
    font-size: 0.4rem;
    color:#333;
    padding-left: 0.3rem;
    margin-left: -0.3rem;
    float: left;
  }
  .unit,.inputBox,.tranUl{
    line-height: 0.6rem;
    height: 0.6rem;
    font-size: 0.375rem;
    color: #BCBCBC;
    float: right;
    text-align: right;
    width: 60%;
    padding-right: 10%;
    margin-top:0.48rem;
    position: relative;
  }
  .tranUl{
    padding-right: 0%;
    margin-top:0.4rem;
  }
  .unit{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .inputBox input{
    width:100%;
    height:0.6rem;
    font-size: 0.375rem;
    text-align: right;
  }
  .inputBox ul{
    position: absolute;
    right:-0.47rem;
    top:1.1rem;
    width: 9.4rem;
    background: white;
    max-height: 10rem;
    overflow-y: scroll;
    z-index: 33;
    border-bottom-right-radius: 0.2rem;
    border-bottom-left-radius: 0.2rem;
  }
  .inputBox ul li{
     width:90%;
     padding: 2% 0;
    margin: 0 5%;
     color:#333;
     border-bottom:1px solid #dadada ;
    position: relative;
    font-size: 0.4rem;
    text-align: left;
    line-height: 1.54rem;
  }
  .borderno{
    border: none!important;
  }
  .sure{
    color:#333;
  }
  .imgno{
    background-image: none!important;
  }
  .inputWBox{
    float: left;
    width:48%;
    padding-left: 2%;
    line-height: 0.8rem;
    font-size: 0.375rem;
    color:#373737;
    box-sizing: border-box;
    border-left: 1px solid #dadada;
    margin-bottom: 0.3rem;
  }
  .inputWBox input{
     width:60%;
    height:0.6rem;
    font-size: 0.375rem;
    margin-right: 0.3rem;
    text-align: right;
  }
  .tranUl li{
    float: left;
    width:1.87rem;
    height:0.73rem;
    margin-left: 0.3rem;
    font-size: 0.35rem;
    line-height: 0.73rem;
    border: 1px solid #999;
    text-align: center;
    color:#999;
    float:right;
    border-radius: 0.2rem;
  }
  .checked{
    border: 1px solid #1D68A8!important;
    background-color: #1D68A8;
    color:white!important;
  }
  #inquiryGet{
    width:8.5rem;
    margin:1.04rem auto 0 auto ;
    display: block;
    background:#1D68A8;
    color:white;
    font-size: 0.48rem;
    letter-spacing: 2px;
    height: 1.3rem;
    border-radius: 0.2rem;
  }
  .closed{
    position: absolute;
    width:1rem;
    height: auto;
    right:0;
    top:0;
    bottom:0;
    background-image: url("../../images/closed.png");
    background-size: 0.6rem;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }
</style>
