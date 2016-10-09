/// <reference types="express" />
/// <reference types="mongoose" />
/// <reference types="node" />

import * as express from 'express';
import * as mongoose from 'mongoose';

export type IBruceDefinitionProprtyType = 'String' | 'Select';

export interface IBruceDefinitionProperty {
  type: IBruceDefinitionProprtyType;
  label?: string;
  displayColumn?: boolean;
}

export interface IBruceDefinition {
  [properties: string]: IBruceDefinitionProperty;
}

export interface IBruceModelInitialData {
  [properties: string]: string | number | string[];
}

export interface IBruceModel {
  name: string;
  singleton?: boolean;
  disableDelete?: boolean;
  disableCreate?: boolean;
  definition?: IBruceDefinition;
  initialData?: IBruceModelInitialData;
}

export interface IBruceParameters {
  name?: string;
  mongoose?: any;
  express?: express.Application;
  rootRoute?: string;
  models: IBruceModel[],
  initialUsers?: IBruceInitialUsers
}

export type IBruceUserRole = 'admin';
export type IBruceUserProvider = 'local';

export interface IBruceUser {
  name: string;
  email: string;
  password: string;
  provider?: IBruceUserProvider;
  role?: IBruceUserRole
}

export interface IBruceInitialUsers {
  clean: boolean;
  data?: IBruceUser[]
}

export interface IBruceModelInstance {
  getModel(): mongoose.Model<any>;
}

export interface IBruceInstance {
  getModel(name: string): IBruceModelInstance;
  getModels(): IBruceModelInstance[];
}

export interface IBruceStatic {
  (parameters: IBruceParameters): Promise<IBruceInstance>;
}

export function Bruce(parameters: IBruceParameters): Promise<IBruceInstance>;
