const classRegistry: { [key: string]: any } = { }

export function RegisterClass(target: any) {
    classRegistry[target.name] = target;
}

/**
 * Serializes an object to a JSON string, handling circular references by storing reference Ids.
 * @param obj The object to serialize.
 * @returns The serialized JSON string.
 */
export function serialize(obj: any): string {
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            value.__type = value.constructor.name;
        }

        return value;
    });
}

/**
 * Deserializes a JSON string to an object, handling circular references by using stored reference Ids.
 * @param serialized The serialized JSON string.
 * @returns The deserialized object.
 */
export function deserialize(serialized: string): any {
    console.log(classRegistry);

    const plain: any = JSON.parse(serialized, (key, value) => {
        // If it has a reference id, store it in the cache.
        if (typeof value === "object" && value !== null){
            // If the type is registered, create an instance of the class.
            const objectType = value.__type;
            if (objectType && classRegistry[objectType]) {
                const classType = classRegistry[objectType];
                const instance = Object.create(classType.prototype);
                delete value.__type;

                Object.assign(instance, value);

                value = instance;
            }
        }

        return value;
    });

    return plain;
}