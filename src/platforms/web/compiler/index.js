/* @flow */

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }

// export function compileToFunctions(template) {
//   let code = generate(ast);
//   // 使用with语法改变作用域为this  之后调用render函数可以使用call改变this 方便code里面的变量取值 比如 name值就变成了this.name
//   let renderFn = new Function(`with(this){return ${code}}`);
//   return renderFn;
// }
