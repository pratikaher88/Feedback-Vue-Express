import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import ShowFeedback from '@/components/ShowFeedback'

Vue.use(Router)

// const Route1 = { template: '<div style = "border-radius:20px;background-color:cyan;width:200px;height:50px;margin:10px;font-size:25px;padding:10px;">This is router 1</div>' };


export default new Router({
    mode: 'history',
  routes: [
    {
      path: '/',
      name: 'App',
      component: App,
    },
    {
        path: '/showallfeedback',
        name: 'Home',
        component: ShowFeedback
    }
  ]
})