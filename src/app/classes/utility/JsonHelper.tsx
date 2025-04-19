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
    const cache = new Set();
    let refId = 0;

    return JSON.stringify(obj, (key, value) => {
        if (cache.has(value)) {
            return `$ref:${value.__refId}`;
        } else if (typeof value === "object" && value !== null) {
            value.__refId = refId++;
            value.__type = value.constructor.name;
            cache.add(value);
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
    const cache: { [key: string]: any } = {};

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

            cache[value.__refId] = value;
            delete value.__refId;
        }

        return value;
    });

    // Iterate through the plain object and replace reference ids with the actual objects.
    replaceReferences(plain, cache);

    return plain;
}

/**
 * Iterates through an object and replaces reference ids with the actual objects from the cache.
 * @param obj The object to iterate through.
 * @param cache The cache of objects to replace references with.
 * @returns The object with references replaced.
 */
function replaceReferences(obj: any, cache: { [key: string]: any }): void {
    if (typeof obj === "object" && obj !== null) {
        for (const key in obj) {
            if (typeof obj[key] === "string" && obj[key].startsWith("$ref:")) {
                const refId = obj[key].slice(5);
                obj[key] = cache[refId];
            }
            else{
                // Recursively replace references in nested objects.
                replaceReferences(obj[key], cache);
            }
        }
    }
}