import { Injectable } from '@angular/core';
import { PayloadValidator, PayloadValidationFunction } from 'fsm-shell';
import * as Ajv from 'ajv';

@Injectable()
export class ShellPayloadValidationService implements PayloadValidator {
  private ajv = new Ajv();

  public getValidationFunction(schema: object): PayloadValidationFunction {
    const validationFunction = this.ajv.compile(schema);
    return (data: any) => {
      const isValid = validationFunction(data);
      if (!!isValid) {
        return { isValid: true };
      }
      return {
        isValid: false,
        error: validationFunction.errors
      };
    };
  }

}
