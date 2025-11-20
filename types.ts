export enum Category {
  POPULATION = 'Population',
  LABOR = 'Labor Market',
  EDUCATION = 'Education',
  HEALTH = 'Health',
  INCOME = 'Income & Tax',
  BUSINESS = 'Business',
  HOUSING = 'Housing'
}

export interface Variable {
  name: string;
  description: string;
  type?: string; // e.g., Numeric, String
  period?: string; // e.g., 1980-2023
}

export interface Paper {
  title: string;
  authors: string;
  journal?: string;
  year?: string;
  url: string;
  snippet?: string;
}

export interface Registry {
  id: string;
  code: string; // e.g., BEF, IND, IDAN
  name: string;
  category: Category;
  description: string;
  documentationUrl: string;
  keyVariables: Variable[];
  papers: Paper[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AiResponse {
  text: string;
  sources: GroundingSource[];
}