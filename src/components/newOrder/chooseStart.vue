<template>
  <div id="chooseStart">
    <div id="title" v-title data-title="添加提货地址" v-if="addressType == 1 && pk == ''"></div>
    <div id="title" v-title data-title="添加收货地址" v-if="addressType == 3 && pk == ''"></div>
    <div id="title" v-title data-title="编辑提货地址" v-if="addressType == 1 && pk != ''"></div>
    <div id="title" v-title data-title="编辑收货地址" v-if="addressType == 3 && pk !== ''"></div>
    <div id="inputKeyup">
      <div class="company inputUp">
        <input @input="filterInput()" type="text" maxlength="20" placeholder="请输入姓名" v-model="start.name"/>
        <img src="../../images/icondianhuapu.png">
      </div>
      <div class="company inputUp">
        <input @keyup="filterInput()" type="tel" maxlength="11" placeholder="请输入手机号码" v-model="start.phone"/>
      </div>
      <!--<div class="company inputUp">
        <input @input="filterInput()" type="text" maxlength="40" placeholder="请输入公司名" v-model="start.company"/>
      </div>-->
      <div class="company inputUp">
        <p id="X00" :class="start.province!=''?'blackColor':''" v-html="start.province == '' ? '选择省市区':start.province+'-'+start.city+'-'+start.area"></p>
      </div>
      <div class="address inputUp">
        <input @input="filterInput()" type="text" maxlength="40" placeholder="详细地址"  v-model="start.address"/>
      </div>
      <div class="address inputUp" style=" color:#666;line-height:1.3rem;font-size: 0.35rem;margin-top: 0.2rem" v-if="addressType == 1">
        设置默认地址
        <div class="morenBox" :class="start.moren == 1 ? 'morenBoxTrue' : ''" @touchend="morenClick()">
          <div class="moren" :class="start.moren == 1 ? 'morenTrue' : ''"></div>
        </div>
      </div>
      <div class="address inputUp" @touchend="shanchu()" v-html="addressType == 1 ? ' 删除提货地址': '删除收货地址'" style=" color:#CE4346;line-height:1.3rem;font-size: 0.35rem;border: none;" v-if="pk != ''">
      </div>
    </div>

  </div>
</template>

<script>
   import {myScroll} from "../../js/myScroll"
   import  {provinceCityArea} from "../../js/provinceCityArea"
   import {androidIos} from "../../js/app";
   import {bomb} from "../../js/zujian";
    export default {
        name: "chooseStart",
      data () {
        return {
          start:{
            name:"",
            phone:"",
            company:"",
            address:"",
            province:"",
            city:"",
            area:"",
            provinceCode:"",
            cityCode:"",
            areaCode:"",
            checked:"",
            moren:0,
          },
          addressType:"",
          pk:""
        }
      },
      beforeMount:function () {
        var _this = this;
        _this.addressType = _this.$route.query.type;
        _this.pk = _this.$route.query.pk == undefined ? '' : _this.$route.query.pk;
      },
      mounted:function () {
          var _this = this;
          _this.addressType = _this.$route.query.type;
          androidIos.bridge(_this);
      },
      methods:{
          go:function () {
            var _this = this;
            var x = 0,y = 0,z = 0;
            var addresspk = sessionStorage.getItem("addresspk");
            if(addresspk!=undefined){
              addresspk = JSON.parse(addresspk);
              _this.start.name = addresspk.contact;
              _this.start.phone = addresspk.mobile;
              _this.start.company = "";//addresspk.addrName
              _this.start.address = addresspk.detailAddr;
              _this.start.province = addresspk.province;
              _this.start.city = addresspk.city;
              _this.start.area = addresspk.area;
              _this.start.checked = addresspk.checked*1;
              _this.start.moren = addresspk.ifDefault*1;
              sessionStorage.removeItem("addresspk");
              for(var i = 0; i< provinceCityArea.length;i++){
                if(provinceCityArea[i].region == _this.start.province){
                  x = i;
                  for(var a = 0; a < provinceCityArea[i].child.length;a++){
                    if( provinceCityArea[i].child[a].region == _this.start.city){
                      y = a;
                      for(var b = 0; b < provinceCityArea[i].child[a].child.length;b++){
                        if( provinceCityArea[i].child[a].child[b].region == _this.start.area){
                          z = b;
                        }
                      }
                    }
                  }
                }
              }
            }
            var area = new LArea();
            area.init({
              'trigger': '#X00',
              'valueTo': '#X00',
              'keys': {
                id: 'id',
                name: 'name'
              },
              'type': 1,
              'data': provinceCityArea
            });
            area.value = [x,y,z];
            area.addPointer = function (name) {
              name = JSON.parse(name);
              _this.start.province = name.firstVal;
              _this.start.provinceCode = name.firstCode;
              _this.start.city = name.secondVal;
              _this.start.cityCode = name.secondCode;
              _this.start.area = name.thirdVal;
              _this.start.areaCode = name.thirdCode;
            }
            $("#sendAddress span").unbind("click").click(function () {
              _this.save();
            });
          },
        shanchu:function () {
          var _this = this;
          androidIos.first("确定删除吗？");
          $("#tanBox-yes").unbind("click").click(function () {
            $(".tanBox-bigBox").remove();
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp()+"/address/deleteAddres",
              data:JSON.stringify({
                pk:_this.pk,
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source"),
                type:_this.$route.query.type
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 10000,
              async:false,
              success: function (deleteAddres) {
                if(deleteAddres.success=="1"){
                  _this.$cjj("删除成功");
                  setTimeout(function () {
                     androidIos.gobackFrom(_this);
                  },500)
                }else{
                  androidIos.second(getAddres.message)
                }
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                }else if(status=='error'){
                  androidIos.errorwife();
                }
              }
            });
          })
        },
        filterInput:function () {
          var _this = this;
          _this.start.name =  _this.start.name.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
          _this.start.phone =  _this.start.phone.replace(/[^\0-9]/g,'');
          _this.start.company =  _this.start.company.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
          _this.start.address =  _this.start.address.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
        },
        morenClick:function () {
            var _this = this;
            if(_this.start.moren == 0){
              _this.start.moren = 1;
            }else{
              _this.start.moren = 0;
            }
        },
          save:function () {
             var _this = this;
               var pk = _this.$route.query.pk;
               if(_this.start.name == '' || _this.start.phone ==''  || _this.start.address =='' || _this.start.province == ''){
                 bomb.first("请填写完整相关信息");
                 return false;
               }
               if(_this.start.phone.length < 11){
                  bomb.first("手机号码不足11位");
                  return false;
               }
               var reg = /^1([3|5|8][0-9]|4[5|7|9]|66|7[0|1|3|5|6|7|8]|9[8|9])[0-9]{8}$/;
               if(!reg.test(_this.start.phone)){
                 bomb.first("手机号码格式不对");
                 return false;
               }
               if(pk == undefined){
                 var json ={
                   addrName:"",
                   mobile:_this.start.phone,
                   detailAddr:_this.start.address,
                   userCode:sessionStorage.getItem("token"),
                   province:_this.start.province,
                   city:_this.start.city,
                   area:_this.start.area,
                   contact:_this.start.name,
                   source:sessionStorage.getItem("source"),
                   addrType:_this.$route.query.type,
                   ifDefault:_this.start.moren,
                 }
                 $.ajax({
                   type: "POST",
                   url: androidIos.ajaxHttp()+"/address/addAddres",
                   data:JSON.stringify(json),
                   contentType: "application/json;charset=utf-8",
                   dataType: "json",
                   timeout: 10000,
                   success: function (addAddress) {
                     $("#common-blackBox").remove();
                     if(addAddress.success=="1"){
                       _this.$cjj("新增成功");
                       setTimeout(function () {
                         androidIos.gobackFrom(_this);
                       },500)
                     }else{
                       androidIos.second(addAddress.message);
                     }
                   },
                   complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                     $("#common-blackBox").remove();
                     if(status=='timeout'){//超时,status还有success,error等值的情况
                       androidIos.second("网络请求超时");
                     }else if(status=='error'){
                       androidIos.errorwife();
                     }
                   }
                 })
               }else{
                 var json ={
                   pkAddress:pk,
                   addrName:"",
                   mobile:_this.start.phone,
                   detailAddr:_this.start.address,
                   province:_this.start.province,
                   city:_this.start.city,
                   area:_this.start.area,
                   contact:_this.start.name,
                   checked:_this.start.checked,
                   userCode:sessionStorage.getItem("token"),
                   source:sessionStorage.getItem("source"),
                   type:_this.$route.query.type,
                   ifDefault:_this.start.moren,
                 }
                 $.ajax({
                   type: "POST",
                   url: androidIos.ajaxHttp()+"/address/updateAddres",
                   data:JSON.stringify(json),
                   contentType: "application/json;charset=utf-8",
                   dataType: "json",
                   timeout: 10000,
                   success: function (addAddress) {
                     $("#common-blackBox").remove();
                     if(addAddress.success=="1"){
                       _this.$cjj("修改成功");
                       setTimeout(function () {
                         androidIos.gobackFrom(_this);
                       },500)
                     }else{
                       androidIos.second(addAddress.message);
                     }
                   },
                   complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                     $("#common-blackBox").remove();
                     if(status=='timeout'){//超时,status还有success,error等值的情况
                       androidIos.second("网络请求超时");
                     }else if(status=='error'){
                       androidIos.errorwife();
                     }
                   }
                 })
               }


          }
      }
    }
</script>

<style scoped>
  .chooseNormal{
     width:94%;
    padding: 0 3%;
    font-size: 0.35rem;
    line-height: 1rem;
    background-image: url("../../images/lookMore.png");
    background-size: 0.22rem  0.4rem;
    background-position: 96% 50%;
    background-repeat: no-repeat;
    background-color:white;
    margin-top: 0.3rem;
    color:#333;
  }
  #inputKeyup{
    margin-top: 0.25rem;
  }
  .lineBox{
    width:4%;
    float:left;
  }
  .line{
    width:1px;
    margin: 0.25rem auto;
     height: 0.5rem;
    background: #dadada;
  }
  .name,.address,.company{
    width:94%;
    padding: 0.0625rem 3%;
    border-bottom:1px solid #F5F5F5;
    background: white;
    position: relative;
  }
  .company img{
    position: absolute;
    right:0.4rem;
    top:50%;
    width:0.45rem;
    margin-top: -0.2647rem;
  }
  .name input{
    width:48%;
    height: 0.37rem;
    padding: 0.478rem 0;
    font-size: 0.346rem;
    float: left;
    color:#333;
  }
  .inputUp input{
    width:100%;
    height: 0.37rem;
    padding: 0.478rem 0;
    font-size: 0.346rem;
    color:#333;
  }
  #X00{
    width:100%;
    height: 0.37rem;
    padding: 0.478rem 0;
    font-size: 0.346rem;
    color:#bcbcbc;
    background-image: url("../../images/lookMore.png");
    background-size: 0.187rem;
    background-repeat: no-repeat;
    background-position: 95% 50%;
  }
  .blackColor{
    color:#333!important;
  }
  button{
    width:96%;
    color:white;
    background: #999;
    display: block;
    margin: 0.3rem auto;
    font-size: 0.4rem;
    line-height: 1.2rem;
    border-radius: 0.2rem;
    letter-spacing: 0.03125rem;
  }
  .colorful{
    background:#1D68A8!important;
  }
  .morenBox{
     float: right;
    height: 0.8rem;
    margin-top: 0.25rem;
    border-radius: 0.4rem;
    width:1.213rem;
    background: #f1f1f1;
    border: 1px solid #e0e0e0;
  }
  .morenBoxTrue{
    background:#6AD56C!important;
  }
  .moren{
    float: left;
    height: 0.76rem;
    margin-left: -0.03125rem;
    border-radius: 0.4rem;
    width:0.76rem;
    background: white;
    border:1px solid #e0e0e0;
  }
  .morenTrue{
     float:right!important;
    margin-right: -0.0625rem;
    background: white!important;
    margin-left: 0!important;
  }
</style>
