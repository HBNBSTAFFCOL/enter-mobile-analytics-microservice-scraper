import { MyCLI } from './commands/index.mjs';
import { BrandCommand } from './commands/brands.mjs';
import { ReferencesCommand } from './commands/references.mjs';
import { SpecCommand } from './commands/spec.mjs';
import { DataBaseCommand } from './commands/dataSetFinal.mjs';

// Start CLI application with commands
new MyCLI({
    brand: new BrandCommand(),
    reference: new ReferencesCommand(),
    spec: new SpecCommand(),
    dataSet: new DataBaseCommand(),
});