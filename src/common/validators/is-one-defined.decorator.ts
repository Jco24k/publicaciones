import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsOneDefined(
  groupName: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsOneDefined',
      target: object.constructor,
      propertyName,
      options: {
        message: `Expected only one of the following properties to be defined: ${groupName.join(
          ', ',
        )}`,
        ...validationOptions,
      },
      validator: {
        validate(_: any, args: ValidationArguments) {
          const object = args.object as any;
          const definedProperties = groupName.filter(
            (property) => object[property] !== undefined,
          );
          return definedProperties.length < 2;
        },
      },
    });
  };
}
