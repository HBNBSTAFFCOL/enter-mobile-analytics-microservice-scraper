import { JsonFileStorage } from './crud.file.mjs';
export const config = {
    baseURL: 'https://www.gsmarena.com/',
    brandsStorage:  new JsonFileStorage('brands.json'),
    referencesStorage: new JsonFileStorage('references.json'),
};
