export const getEnv = (key: string): string => {
    const value = process.env[key];
    if(!value){
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const getEnvNumber = (key: string): number => {
    const value = getEnv(key);
    const num = Number(value);
    if(isNaN(num)){
        throw new Error(`Env variable ${key} must be a number`)
    }
    return num;
};

const BOOLEAN_VALUES = ["true","false","1","0"]

export const getEnvBool = (key: string): boolean => {
    const value = getEnv(key).toLowerCase();
    if(BOOLEAN_VALUES.includes(value)){
        return value === "true" || value === "1"
    } else {
        throw new Error(`Env variable ${key} must be a boolean`)
    }  
}