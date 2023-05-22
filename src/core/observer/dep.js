/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
Dep 也是一个构造函数 可以把他理解为观察者模式里面的被观察者 
在 subs 里面收集 watcher 当数据变动的时候通知自身 subs 所有的 watcher 更新
Dep.target 是一个全局 Watcher 指向 初始状态是 null
 */
// dep和watcher是多对多的关系
// 每个属性都有自己的dep
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = [] // 这个是存放watcher的容器
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
/* 
  可见最初设计存放 watcher 的容器就是一个栈结构 
  因为整个 Vue 生命周期的过程中会存在很多的 watcher 比如渲染 watcher 计算 watcher 侦听 watcher 等 
  而每个 watcher 在调用了自身的 get 方法前后会分别调用 pushTarget 入栈和 popTarget 出栈 
  这样子当计算属性重新计算之后就立马会出栈 那么外层的 watcher 就会成为新的 Dep.target 
  我们使用 watcher.depend 方法让计算属性依赖的值收集一遍外层的渲染 watcher 
  这样子当计算属性依赖的值改变了既可以重新计算又可以刷新视图
*/
// 默认Dep.target为null
Dep.target = null
// 栈结构用来存watcher
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target // Dep.target指向当前watcher
}

export function popTarget () {
  targetStack.pop() // 当前watcher出栈 拿到上一个watcher
  Dep.target = targetStack[targetStack.length - 1]
}
