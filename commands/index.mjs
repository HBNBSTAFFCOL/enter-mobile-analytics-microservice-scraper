
// Defines an interface for commands
export class Command {
    execute() {
        throw new Error('Método execute no implementado');
    }
    get usage() {
        throw new Error('Método execute no implementado');
    }
    get description() {
        throw new Error('Método execute no implementado');
    }
}


export class MyCLI {
    constructor(commands) {
        this.commands = commands;

        // Get command line arguments
        const [, , command, ...args] = process.argv;

        // Check if a valid command was provided
        if (this.commands.hasOwnProperty(command)) {
            this.commands[command].execute(...args);
        } else {
            console.log('Comando no válido.');
            this.printHelp();
        }
    }

    printHelp() {
        console.log('Uso:');
        for (const [commandName, { execute, usage, description }] of Object.entries(this.commands)) {
            console.log(`node mycli.js ${commandName} ${usage}`);
            console.log(`\t${description}`);
        }
    }
}

