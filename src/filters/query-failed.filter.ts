import { STATUS_CODES } from 'node:http';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { MongoServerError } from 'mongodb'; // Mongoose duplicate key errors are of this type

import { constraintErrors } from './constraint-errors.ts';

@Catch(MongoServerError)
export class MongoErrorFilter implements ExceptionFilter<MongoServerError> {
  constructor(public reflector: Reflector) {}

  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | undefined = undefined;

    // Check for duplicate key error (error code 11000)
    if (exception.code === 11000) {
      status = HttpStatus.CONFLICT;
      // Extract the key name from the error (e.g., { email: 'already exists' })
      const key = exception.keyValue ? Object.keys(exception.keyValue)[0] : '';
      message = key
        ? constraintErrors[`UQ_${key}`] ||
          `Duplicate key error on field: ${key}`
        : exception.message;
    }

    response.status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message,
    });
  }
}
