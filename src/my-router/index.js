let Vue

export default class VueRouter {
  constructor(options) {
    this.$options = options
    this.routeMap = {}
    this.vm = new Vue({
      data() {
        return {
          currentPath: '/'
        }
      }
    })
  }

  init() {
    // 监听hash值变换
    this.bindEvent()
    // 创建路由映射表
    this.createRouteMap()
    // 初始化路由组件 router-link和router-view
    this.initRouteComponent()
  }

  bindEvent() {
    // 监听DOM加载完毕事件
    window.addEventListener('DOMContentLoaded', this.handleHashChange.bind(this))
    // 监听哈希变换事件
    window.addEventListener('hashchange', this.handleHashChange.bind(this))
  }

  getHashValue() {
    return window.location.hash.slice(1) || '/'
  }

  handleHashChange() {
    const hash = this.getHashValue()
    this.vm.currentPath = hash
  }

  // 创建路由映射表，即将路由配置数组转换成对象，便于访问
  createRouteMap() {
    this.$options.routes.forEach(item => {
      this.routeMap[item.path] = item
    })
  }

  // 初始化路由组件 router-link和router-view
  initRouteComponent() {
    Vue.component('router-link', {
      props: {
        to: {
          type: String,
          default: ''
        }
      },
      render(h) {
        return h('a', {
          attrs: {
            href: '#' + this.to
          }
        }, this.$slots.default)
      }
    })
    Vue.component('router-view', {
      render: h => {
        // 通过当前路径拿到该路径对应的组件
        const component = this.routeMap[this.vm.currentPath]?.component

        return h(component)
      }
    })
  }

  static install(_Vue) {
    // 保存到全局，供其它地方使用
    Vue = _Vue
    Vue.mixin({
      beforeCreate() {
        // 如果router存在，说明是Vue的根实例
        if (this.$options.router) {
          // 执行VueRouter实例的init方法
          this.$options.router.init()
        }
      }
    })
  }
}