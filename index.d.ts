/// <reference types="express" />
/// <reference types="mongoose" />
/// <reference types="node" />

import * as express from 'express';
import * as mongoose from 'mongoose';

export type ICmeasyDefinitionProprtyType = 'String' | 'Select';

export interface ICmeasyDefinitionProperty {
  type: ICmeasyDefinitionProprtyType;
  label?: string;
  displayColumn?: boolean;
}

export interface ICmeasyDefinition {
  [properties: string]: ICmeasyDefinitionProperty;
}

export interface ICmeasyModel {
  name: string;
  singleton?: boolean;
  disableDelete?: boolean;
  disableCreate?: boolean;
  definition?: ICmeasyDefinition;
}

export interface ICmeasyParameters {
  name: string;
  mongoose?: any;
  express?: express.Application;
  rootRoute?: string;
  models: ICmeasyModel[]
}

export interface ICmeasyModelInstance {
  getModel(): mongoose.Model<any>;
}

export interface ICmeasyInstance {
  getModel(name: string): ICmeasyModelInstance;
  getModels(): ICmeasyModelInstance[];
}

export interface ICmeasyStatic {
  (parameters: ICmeasyParameters): Promise<ICmeasyInstance>;
}

export function cmeasy(parameters: ICmeasyParameters): Promise<ICmeasyInstance>;
