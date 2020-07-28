// export function RouteHandler(app, controllers: any) {
//     find(controllers)
//     //app.use('/', (req, res, next) => 。。。。。。
// }
// function find(controllers: any) {
//     //controllers本质上是一个对象，类似：{host:{},home:{},site:{}}。那我们这里的key就是controller的名字，value就是controller实列了。
//     var _reg_controller_names = Object.getOwnPropertyNames(controllers)//对象上所有成员，就是我们所有的controller名称集合。
//     for (var index = 0; index < _reg_controller_names.length; index++) {
//         var _reg_controller_name = _reg_controller_names[index];//controller的名称，比如：home
//         var _reg_controller_Desc = Object.getOwnPropertyDescriptor(controllers, _reg_controller_name) as PropertyDescriptor//controller的描述对象
//         if (_reg_controller_name === '__esModule') continue;
//
//         var cType = _reg_controller_Desc.value;//controller的类型，比如：Homecontroller
//         var cName = cType.name;//controller的class名称。比如"HomeController"；
//
//         var aNames = Object.getOwnPropertyNames(cType.prototype)//controller所有成员，也就是我们的action
//         for (var index2 = 0; index2 < aNames.length; index2++) {
//             var aName = aNames[index2];
//             if (aName === 'constructor') continue;
//             var aType = (Object.getOwnPropertyDescriptor(cType.prototype, aName) as PropertyDescriptor).value//具体的每一个action函数
//             SetActionDescriptor(cName, aName, undefined, undefined, _reg_controller_name, cType, aType)//加入缓存
//             //第三个参数[httpMethod] 请求方法类型。默认给undefined，后续再通过扫描action上面的特性标签增加进来
//             //第四个参数 [actionName] 路由action名字。默认给undefined，后续再通过扫描action上面的特性标签增加进来
//         }
//     }
// }
// /**
//  *
//  *
//  * @export
//  * @param {string} controllerTypeName 控制器类型名字
//  * @param {string} actionTypeName 方法类型名字
//  * @param {string} [httpMethod] 请求方法类型
//  * @param {string} [actionName] 路由action名字
//  * @param {string} [controllerName] 路由控制器名字
//  * @param {*} [controllerType] 控制器对象
//  * @param {*} [actionType] action 对象
//  * @returns {ActionDescriptor}
//  */
// export function SetActionDescriptor(controllerTypeName: string, actionTypeName: string, httpMethod?: string, actionName?: string, controllerName?: string, controllerType?: any, actionType?: any, isAuth?: boolean): ActionDescriptor {
//
//     var _actions = _dic_override.get(controllerTypeName)
//     if (!_actions) {
//         _actions = new Map<string, ActionDescriptor>();
//         _dic_override.set(controllerTypeName, _actions)
//     }
//     var _action = _actions.get(actionTypeName);
//     if (!_action) {
//         _action = new ActionDescriptor();
//         _actions.set(actionTypeName, _action)
//     }
//     _action.ControllerTypeName = controllerTypeName;
//     _action.ActionTypeName = actionTypeName;
//
//     if (!_action.ActionName)
//         _action.ActionName = actionTypeName
//
//     if (httpMethod)
//         _action.HttpMethod = httpMethod.toUpperCase();
//
//     if (controllerType)
//         _action.ControllerType = controllerType;
//     if (controllerName)
//         _action.ControllerName = controllerName;
//
//     if (actionName)
//         _action.ActionName = actionName;
//     if (actionType)
//         _action.ActionType = actionType
//
//     if (isAuth === true || isAuth === false)
//         _action.isAuth = isAuth;
//
//     _action.Id = _action.ActionName + (_action.HttpMethod ? ('_' + _action.HttpMethod) : '')
//
//     return _action
// }
