

export default function (type) {
    // descriptor.method = types;
    // descriptor.types = "GET";
    return (target) => {
        target.type = type;
    }
}
