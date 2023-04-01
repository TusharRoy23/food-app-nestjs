import * as moment from 'moment';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const isTime = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return (
            typeof value === 'string' &&
            moment(value, 'HH:mm:ss', true).isValid()
          );
        },
        defaultMessage() {
          return 'Not a valid time';
        },
      },
    });
  };
};

export const isValidNumber = (
  property: string,
  canBeEmpty = false,
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isValidNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: number) {
          if (canBeEmpty) return true;
          const regex = /^[0-9]*(\.[0-9]{0,2})?$/;
          return typeof value === 'number' && regex.test(value.toString());
        },
        defaultMessage() {
          return 'Max two decimal places allowed';
        },
      },
    });
  };
};

export const isValidDate = (
  property: string,
  canBeEmpty = false,
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (canBeEmpty) return true;
          return (
            typeof value === 'string' &&
            moment(value, 'YYYY-MM-DD HH:mm:ss', true).isValid()
          );
        },
        defaultMessage() {
          return 'Not a valid date';
        },
      },
    });
  };
};

export const isValidDateRange = (
  property: string,
  canBeEmpty = false,
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
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
        defaultMessage() {
          return 'end date must be greater than start date';
        },
      },
    });
  };
};

export const isValidNumberRange = (
  property: string,
  canBeEmpty = false,
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
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
        defaultMessage() {
          return 'min value should not be greater than max value';
        },
      },
    });
  };
};

export const isValidEnum = (
  property: string,
  enumType: any,
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isValidEnum',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return (
            typeof value === 'string' && Object.values(enumType).includes(value)
          );
        },
        defaultMessage() {
          return 'Not a valid string';
        },
      },
    });
  };
};
