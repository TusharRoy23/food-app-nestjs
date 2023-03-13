import * as moment from "moment";
import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export const isTime = (property: string, validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isTime',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    return typeof value === 'string' && moment(value, 'HH:mm:ss', true).isValid();
                },
                defaultMessage(validationArguments?: ValidationArguments) {
                    return 'Not a valid time';
                },
            }
        })
    }
};

export const isValidNumber = (property: string, canBeEmpty: boolean = false, validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isValidNumber',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: number, args: ValidationArguments) {
                    if (canBeEmpty) return true;
                    const regex = /^[0-9]*(\.[0-9]{0,2})?$/;
                    return typeof value === 'number' && regex.test(value.toString());
                },
                defaultMessage(validationArguments?: ValidationArguments) {
                    return 'Max two decimal places allowed';
                },
            }
        })
    }
};

export const isValidDate = (property: string, canBeEmpty: boolean = false, validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isValidDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    if (canBeEmpty) return true;
                    return typeof value === 'string' && moment(value, 'YYYY-MM-DD HH:mm:ss', true).isValid();
                },
                defaultMessage(validationArguments?: ValidationArguments) {
                    return 'Not a valid date';
                },
            }
        })
    }
};

export const isValidDateRange = (property: string, canBeEmpty: boolean = false, validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isValidDateRange',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    if (canBeEmpty) return true;
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return moment(value, 'YYYY-MM-DD HH:mm:ss').isAfter(relatedValue);
                },
                defaultMessage(validationArguments?: ValidationArguments) {
                    return 'end date must be greater than start date';
                },
            }
        })
    }
};

export const isValidNumberRange = (property: string, canBeEmpty: boolean = false, validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isValidNumberRange',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: number, args: ValidationArguments) {
                    if (canBeEmpty) return true;
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return +value < +relatedValue;
                },
                defaultMessage(validationArguments?: ValidationArguments) {
                    return 'min value should not be greater than max value';
                }
            }
        });
    }
};

export const isValidEnum = (property: string, enumType: any, validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isValidEnum',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    return typeof value === 'string' && Object.values(enumType).includes(value);
                },
                defaultMessage(validationArguments?: ValidationArguments) {
                    return 'Not a valid string';
                },
            }
        });
    }
};

export const isRequired = (property: string, validationOptions?: ValidationOptions) => {
    console.log('property: ', property);
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isValidDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    console.log('value: ', value);
                    return value != null ? false : true;
                },
                defaultMessage(validationArguments?: ValidationArguments) {
                    return `${property} is required`;
                },
            }
        })
    }
}