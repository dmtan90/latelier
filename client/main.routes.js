import { isBasicAuth } from '../imports/modules/check-auth'
import Auth from '../imports//ui/layout/Auth.vue'
import Login from '../imports/ui/pages/Auth/Login.vue'
import Register from '../imports/ui/pages/Auth/Register.vue'
import ForgotPassword from '../imports/ui/pages/Auth/ForgotPassword.vue'
import ResetPassword from '../imports/ui/pages/Auth/ResetPassword.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: '/imports/ui/Home.vue',
    beforeEnter: (to, from, next) => {
      if (Meteor.userId()) {
        next({
          name: 'projects-page'
        })
      } else {
        next();
      }
    }
  },
  {
    path: '/login',
    component: Auth,
    redirect: { name: 'login' },
    children: [
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/register',
        name: 'register',
        component: Register
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPassword
      },
      {
        path: '/reset-password/:token',
        name: 'reset-password',
        component: ResetPassword
      }
    ]
  },  
  {
    path: '/projects',
    name: 'projects-page',
    beforeEnter: isBasicAuth,
    component: '/imports/ui/projects/ProjectsPage.vue',
    props: true,
  },
  {
    path: '/timeline',
    name: 'projects-timeline',
    beforeEnter: isBasicAuth,
    component: '/imports/ui/projects/ProjectsTimeline.vue',
    props: true
  },
  {
    path: '/projects/:projectId',
    name: 'project',
    beforeEnter: isBasicAuth,
    component: '/imports/ui/projects/Project.vue',
    props: true
  },
  {
    path: '/projects/:projectId/settings',
    name: 'project-settings',
    beforeEnter: isBasicAuth,
    component: '/imports/ui/projects/ProjectSettings.vue',
    props: true
  },
  {
    path: '/admin',
    name: 'admin',
    beforeEnter: isBasicAuth,
    component: '/imports/ui/admin/Admin.vue',
    props: true
  },
];