import Vue from 'vue'
import VueRouter from 'vue-router'
import Navbar from '../components/NavigationBar.vue'
import Login from '../views/LoginPage.vue'
import Home from '../views/HomePage.vue'
import UserManagement from '../views/Admin/UserManagement.vue'
import TaskManagement from '../views/Admin/TaskManagement.vue'
import Tugas from '../views/Pegawai/TugasPage.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Navbar,
        children: [
            {
                path: '/home',
                name: 'home',
                component: Home,
                meta: {
                    requiresAuth: true,
                    roles: ['Admin','Pegawai']
                }
            },
            {
                path: '/usermanagement',
                name: 'user management',
                component: UserManagement,
                meta: {
                    requiresAuth: true,
                    roles: ['Admin']
                }
            },
            {
                path: '/taskmanagement',
                name: 'task management',
                component: TaskManagement,
                meta: {
                    requiresAuth: true,
                    roles: ['Admin']
                }
            },
            {
                path: '/tugas',
                name: 'tugas',
                component: Tugas,
                meta: {
                    requiresAuth: true,
                    roles: ['Pegawai']
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: '*',
        redirect: '/'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if(localStorage.getItem('token')){
            next()
        }
        else {
            router.replace('/login')
        }
    }
    else {
        next()
    }
})

export default router;