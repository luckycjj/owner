// 引入子路由
import forgetPassword from '@/components/loginBox/forgetPassword'
import register from '@/components/loginBox/register'
import aboutUs from '@/components/myBox/aboutUs'
import setup from '@/components/myBox/setup'
import suggestion from '@/components/myBox/suggestion'
import settlement from '@/components/myBox/settlement'
import changePassword from '@/components/myBox/changePassword'
import statusNow from '@/components/myBox/statusNow'
import login from '../pages/login'
import user from '../pages/user'
import trackList from '../pages/trackList'
import newOrder from '../pages/newOrder'
import calculator from '../pages/calculator'
import orderLogistics from '../pages/orderLogistics'
import uploadData from '../pages/uploadData'
import insuranceList from '../pages/insuranceList'
import signIn from  '../pages/signIn'
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
import  orderLogisticsF from '@/components/orderLogistics/orderLogisticsMore'
import  orderLogisticsS from '@/components/orderLogistics/map'
import  orderScreen from '@/components/orderLogistics/orderScreen'
import uploadDataF from '@/components/uploadData/pdf'
Vue.use(Router);

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
    document.getElementById('title').innerText = document.title
  }
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

export default new Router({
  routes: [
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
        {path:"needKnow",component:newOrder12}
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
