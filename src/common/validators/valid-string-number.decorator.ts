import { ValidationOptions, registerDecorator } from 'class-validator';
export function IsValidStringNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidStringNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be one of the following values: [true,false,1,0]`,
        ...validationOptions,
      },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, validationArguments) {
          const allowedValues = ['true', 'false', '1', '0'];
          return value ? allowedValues.includes(String(value)) : true;
        },
      },
    });
  };
}
