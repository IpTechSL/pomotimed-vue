import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (to, from) => {
        if(to.params.user) {
          router.push('/');
        } else true
      }
    },
    {
      path: '/signup',
      name: 'sign up',
      component: () => import('../views/SignUpView.vue'),
      beforeEnter: (to, from) => {
        if(to.params.user) {
          router.push('/');
        } else true
      }
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
    },
    {
      path: '/projects',
      name: 'projects',
      params: {
        msg: '',
        error: false
      },
      component: () => import('../views/ProjectsView.vue'),
      beforeEnter: (to, from) => {
        if(!to.params.user) {
          router.push('/');
        } else true
      }
    },
    {
      path: '/projects/new',
      name: 'projects new',
      component: () => import('../views/NewProjectView.vue'),
      beforeEnter: (to, from) => {
        if(!to.params.user) {
          router.push('/');
        } else true
      }
    },
    {
      path: '/validate',
      name: 'accept invite',
      component: () => import('../views/AcceptInviteView.vue'),
    }
  ]

})

async function getUser() {
  const token = sessionStorage.getItem('token');
  const jwt = localStorage.getItem('jwt');
  let user;
  if(jwt) {
    await axios({
      method: "POST",
      url: "https://drupal.pomotimed.com/pomotimed/token-validation",
      headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'Authorization': `Bearer ${jwt}`
      },
      data: {
        
      }
    })
    .then(response => {
        if(response.status === 200) {
          user = response.data.data;
        } else {
          user = false;
        }
    })
  } else { user = false; }
  
  return user;
}

router.currentRoute.value.params.user = getUser();

router.beforeEach(async (to, from) => {
  const user = await getUser();
  to.params.user = user;
})


export default router
