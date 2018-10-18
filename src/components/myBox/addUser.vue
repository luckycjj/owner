<template>
   <div id="addUser">
     <div id="title" v-title data-title="添加账号"></div>
     <div id="addUserBox">
       <div class="label border">
         <span>添加姓名</span>
         <input type="text" placeholder="请输入被添加人的姓名" v-model="name"/>
       </div>
       <div class="label border">
         <span>添加账号</span>
         <input type="tel" placeholder="请输入被添加人的手机号码" v-model="tel" maxlength="11"/>
       </div>
       <div class="label">
         <span>设置密码</span>
         <input type="password" placeholder="请设置密码" maxlength="25" v-model="password"/>
       </div>
     </div>
     <div id="zhiwuBox">
       <div class="label">
         <span>添加职务</span>
          <ul>
            <li v-for="(item,index) in jobList" :class="item.check ? 'liCheck' : ''" @click="jobChoose(index)">
                {{item.name}}
            </li>
            <div class="clearBoth"></div>
          </ul>
       </div>

     </div>
     <button @click="letGo()">确定</button>
   </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
    export default {
        name: "add-user",
      data(){
          return{
             name:"",
            tel:"",
            password:"",
            jobList:[{
                name:"业务员",
                value:"cust_operator",
                check:false
            },{
              name:"订单审核员",
              value:"cust_auditor",
              check:false
            }]
          }
      },
      mounted:function () {
        var _this = this;
        androidIos.bridge(_this);
      },
      methods:{
          go:function () {

          },
        jobChoose:function (number) {
          var _this = this;
          if(_this.jobList[number].check){
            _this.jobList[number].check = false;
          }else{
            for(var i = 0; i< _this.jobList.length;i++){
              _this.jobList[i].check = false;
            }
            _this.jobList[number].check = true;
          }
        },
        letGo:function () {
          var _this = this;
          if(_this.name == ""){
             bomb.first("请输入被添加人的姓名");
             return false;
          }
          if(!androidIos.telCheck(_this.tel)){
            bomb.first("请输入正确的被添加人的手机号码");
            return false;
          }
          if(_this.password.length < 6){
            bomb.first("密码不得小于6位");
            return false;
          }
          var list = [];
          for(var i = 0; i< _this.jobList.length;i++){
            if( _this.jobList[i].check){
               list.push(_this.jobList[i].value);
            }
          }
          if(list.length == 0){
            bomb.first("请添加职务");
            return false;
          }
          androidIos.loading("正在添加");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/associatedMember",
            data:JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
              userPhone:_this.tel,
              password:_this.password,
              userRole:list.join(","),
              userName:_this.name
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (associatedMember) {
              if (associatedMember.success == "1") {
                  _this.$cjj("添加成功");
                  setTimeout(function () {
                     androidIos.gobackFrom(_this);
                  },500)
              }else{
                androidIos.second(associatedMember.message);
              }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
              $("#common-blackBox").remove();
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
  #addUser{
     position: absolute;
    top:1.3rem;
    bottom:0;
    height:auto;
    width:100%;
    background: #f6f6f6;
  }
  #addUserBox,#zhiwuBox{
    width:100%;
    background: white;
    margin-top: 0.25rem;
  }
  .label{
     width:92%;
    padding:0.46rem 4%;
  }
  .label span{
    font-size: 0.4rem;
    color:#373737;
    line-height: 0.4rem;
    margin-right:0.7rem ;
  }
  .label input{
    height: 0.4rem;
    width:6rem;
    font-size: 0.375rem;
    color:#373737;
  }
  .border{
    border-bottom: 1px solid #e5e5e5;
  }
  button{
    width:9.1rem;
    background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
    color:white;
    display: block;
    margin: 0 auto;
    line-height: 1.2rem;
    font-size: 0.4rem;
    border-radius: 0.2rem;
    margin-top: 0.8rem;
  }
  ul{
    width:100%;
    margin-top: 0.76rem;
    margin-bottom: 0.1rem;
  }
  ul li {
     font-size: 0.35rem;
     color:#2c9cff;
     border: 1px solid #2c9cff;
     float: left;
     padding: 0.1rem 0.3rem;
     border-radius:0.3rem;
    margin-left: 0.67rem;
  }
  .liCheck{
    background: #2c9cff;
    color:#fff!important;
  }
</style>
