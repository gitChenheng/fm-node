export function Method(target, descriptor) {
    // descriptor.prototype.method = method;
    console.log('target',target)
    console.log('descriptor',descriptor)
}

export function Others(target, descriptor) {
    console.log(target,typeof target)
    console.log(descriptor,typeof descriptor)
    console.log(target[descriptor])
    // descriptor.method = "GET";
    // return descriptor;

    // return function (target: any, propertyKey: string, descriptor) {
    //
    // }
}


