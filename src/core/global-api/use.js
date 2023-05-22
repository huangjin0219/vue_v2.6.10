/* @flow */

import { toArray } from '../util/index'

// Vue.use 主要用于插件的注册 调用插件的 install 方法 并且把自身 Vue 传到插件的 install 方法 这样可以避免第三方插件强依赖 Vue
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      // 如果安装过这个插件直接返回
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1) // 获取参数
    args.unshift(this) //在参数中增加Vue构造函数
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args) // 执行install方法
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args) // 没有install方法直接把传入的插件执行
    }
    // 记录安装的插件
    installedPlugins.push(plugin)
    return this
  }
}
