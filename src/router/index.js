// 引入子路由
import forgetPassword from '@/components/loginBox/forgetPassword'
import register from '@/components/loginBox/register'
import aboutUs from '@/components/myBox/aboutUs'
import addUser from '@/components/myBox/addUser'
import setup from '@/components/myBox/setup'
import suggestion from '@/components/myBox/suggestion'
import settlement from '@/components/myBox/settlement'
import changePassword from '@/components/myBox/changePassword'
import statusNow from '@/components/myBox/statusNow'
import bestDriverList from '@/components/xinyaBox/bestDriverList'
import bestDriverMore from '@/components/xinyaBox/bestDriverMore'
import bestCarrierMore from '@/components/xinyaBox/bestCarrierMore'
import bestCarrierList from '@/components/xinyaBox/bestCarrierList'
import authentication from '@/components/authentication/authentication'
import login from '../pages/login'
import user from '../pages/user'
import newProlist from '../pages/newProlist'
import message from '../pages/message'
import haveCar from '../pages/haveCar'
import trackList from '../pages/trackList'
import newOrder from '../pages/newOrder'
import calculator from '../pages/calculator'
import orderLogistics from '../pages/orderLogistics'
import uploadData from '../pages/uploadData'
import insuranceList from '../pages/insuranceList'
import signIn from  '../pages/signIn'
import xinYaIndex from  '../pages/xinYaIndex'
import Vue from 'vue'
import Router from 'vue-router'
import  newOrderF from '@/components/newOrder/newOrder'
import  newOrderS from '@/components/newOrder/chooseStart'
import  newOrderT from '@/components/newOrder/remark'
import  newOrderFo from '@/components/newOrder/histroyAddress'
import  newOrderSi from '@/components/newOrder/goodsType'
import  newOrderSe from '@/components/newOrder/goods'
import  newOrderEg from '@/components/newOrder/appoint'
import  newOrderNi from '@/components/newOrder/insurance'
import  newOrder11 from '@/components/newOrder/addressMessage'
import  newOrder12 from '@/components/newOrder/needKnow'
import  newOrder13 from '@/components/newOrder/inquiry'
import  orderLogisticsF from '@/components/orderLogistics/orderLogisticsMore'
import  orderLogisticsS from '@/components/orderLogistics/map'
import  orderScreen from '@/components/orderLogistics/orderScreen'
import uploadDataF from '@/components/uploadData/pdf'
import driverMap from '@/components/carBox/map'
import familiarCar from '@/components/carBox/familiarCar'
import sendtextmessage from '@/components/carBox/sendtextmessage'
Vue.use(Router);

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
    document.getElementById('title').innerText = document.title
  }
});
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。

  inserted: function (el) {
    // 聚焦元素
    el.focus()
  },
  //也可以用update,update就是当页面有操作的时候就触发，比如点击按钮，输入框输入都算。
  //有一个要注意的就是，就是你页面有几个input,比如一个input绑定了v-focus,一个没有绑定。你在没绑定v-focus的input输入时，绑定了v-focus的input就是自动获取焦点，这是个bug.
  //update: function (el) {
  //el.focus()
  //}
});
Vue.filter('companyTypeName', function(value) {
  value = value*1;
  var valueTypeName  ="";
  switch (value)
  {
    case 0:
      valueTypeName="";
      break;
    case 1:
      valueTypeName="待审核";
      break;
    case 2:
      valueTypeName="已审核";
      break;
    case 3:
      valueTypeName="已驳回";
      break;
    case 4:
      valueTypeName="已禁用";
      break;
  }
  return valueTypeName
});
Vue.filter('toThousands',function (num) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
})
Vue.filter('orderTypeName', function(value) {
  value = value*1;
  var valueTypeName  ="";
  switch (value)
  {
    case 0:
      valueTypeName = "待确认";
      break;
    case 10:
      valueTypeName = "已确认";
      break;
    case 20:
      valueTypeName = "司机出发";
      break;
    case 31:
      valueTypeName = "提货到达";
      break;
    case 32:
      valueTypeName = "开始装货";
      break;
    case 33:
      valueTypeName = "装货完毕";
      break;
    case 41:
      valueTypeName = "运输到达";
      break;
    case 42:
      valueTypeName = "开始卸货";
      break;
    case 43:
      valueTypeName = "卸货完毕";
      break;
    case 50:
      valueTypeName = "已签收";
      break;
    case 60:
      valueTypeName = "退单";
      break;
  }
  return valueTypeName
});
Vue.filter('time',function (time) {
  var list0 = time.split(" ");
  var list1 = list0[0].split("-");
  var list2 = list0[1].split(":");
  list1.splice(0,1);
  list2.splice(2,1);
  return list1.join("-") + " " + list2.join(":")
})
Vue.filter('distanceWidth',function (address) {
  if(address >= 1000){
    address = (address/1000).toFixed(3)*1 + "公里";
  }else{
    address = address.toFixed(3)*1 + "米";
  }
  return address
})
Vue.filter('timeCheck',function (timeCheck) {
  var timeCheckDate;
  if(timeCheck == ""){
    timeCheckDate = (new Date()).getTime();
  }else{
    timeCheckDate = (new Date(timeCheck.replace(/-/g,"/"))).getTime();
  }
  var nowDate = (new Date()).getTime();
  var time = (nowDate - timeCheckDate)/1000/60/60;
  if( time > 2){
    timeCheck = timeCheck;
  }else{
    if( time > 1){
      timeCheck = Math.floor(time) + "小时前";
    }else{
       var min  = (nowDate - timeCheckDate)/1000/60;
       if(min > 1){
         timeCheck = Math.floor(min) + "分钟前";
       }else{
         var sec = (nowDate - timeCheckDate)/1000;
         if(sec > 1){
           timeCheck = Math.floor(sec) + "秒钟前";
         }else{
           timeCheck = "刚刚";
         }
       }
    }
  }
  return timeCheck
})
export default new Router({
  routes: [
    {
      path:'/driverMap',
      name:'driverMap',
      component:driverMap,
    },
    {
      path:'/familiarCar',
      name:'familiarCar',
      component:familiarCar,
    },
    {
      path:'/sendtextmessage',
      name:'sendtextmessage',
      component:sendtextmessage,
    },
    {
      path:'/newProlist',
      name:'newProlist',
      component:newProlist,
    },
    {
      path:'/message',
      name:'message',
      component:message,
    },
    {
      path:'/haveCar',
      name:'haveCar',
      component:haveCar,
    },
    {
      path:'/authentication',
      name:'authentication',
      component:authentication,
    },
    {
      path:'/bestCarrierMore',
      name:'bestCarrierMore',
      component:bestCarrierMore,
    },
    {
      path:'/bestCarrierList',
      name:'bestCarrierList',
      component:bestCarrierList,
    },
    {
      path:'/bestDriverMore',
      name:'bestDriverMore',
      component:bestDriverMore,
    },
    {
      path:'/bestDriverList',
      name:'bestDriverList',
      component:bestDriverList,
    },
    {
      path:'/xinYaIndex',
      name:'xinYaIndex',
      component:xinYaIndex,
    },
    {
      path:'/addUser',
      name:'addUser',
      component:addUser,
    },
    {
      path:'/settlement',
      name:'settlement',
      component:settlement,
    },
    {
      path:'/orderScreen',
      name:'orderScreen',
      component:orderScreen,
    },
    {
      path:'/insuranceList',
      name:'insuranceList',
      component:insuranceList,
    },
    {
      path:'/forgetPassword',
      name:'forgetPassword',
      component:forgetPassword,
    },
    {
      path:'/trackList',
      name:'trackList',
      component:trackList,
    },
    {
      path:'/register',
      name:'register',
      component:register,
    },
    {
      path:'/changePassword',
      name:'changePassword',
      component:changePassword,
    },
    {
      path:'/suggestion',
      name:'suggestion',
      component:suggestion,
    },
    {
      path:'/statusNow',
      name:'statusNow',
      component:statusNow,
    },
    {
      path:'/aboutUs',
      name:'aboutUs',
      component:aboutUs,
    },
    {
      path:'/setup',
      name:'setup',
      component:setup,
    },
    {
      path:'/login',
      name:'login',
      component:login,
    },
    {
      path:'/user',
      name:'user',
      component:user,
    },
    {
      path: '/uploadData',
      name: 'uploadData',
      component: uploadData,
      children: [
        {path: 'pdf',component:uploadDataF}
      ]
    },
    {
      path:'/signIn',
      name:'signIn',
      component:signIn,
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: calculator
    },
    {
      path:'/newOrder',
      name:'newOrder',
      component:newOrder,
      children: [
        {path: '/', component: newOrderF},
        {path: 'chooseStart', component: newOrderS},
        {path:'remark',component:newOrderT},
        {path: 'histroyAddress', component: newOrderFo},
        {path: 'goodsType', component: newOrderSi},
        {path: 'goods', component: newOrderSe},
        {path: 'appoint', component: newOrderEg},
        {path: 'insurance', component: newOrderNi},
        {path:"addressMessage",component:newOrder11},
        {path:"needKnow",component:newOrder12},
        {path:"inquiry",component:newOrder13}
      ]
    },
    {
      path: '/orderLogistics',
      name: 'orderLogistics',
      component: orderLogistics,
      children: [
        {path: 'orderLogisticsMore',
          component: orderLogisticsF,
          children:[{
            path:"/",
            component:orderLogisticsS
          }]
        },
        {path: 'map', component:orderLogisticsS},
      ]
    }
  ]
})
