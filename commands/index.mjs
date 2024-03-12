//const fs = require('fs');
//const { exec } = require('child_process');

// Define una interfaz para los comandos
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

        // Obtener los argumentos de la línea de comandos
        const [, , command, ...args] = process.argv;

        // Verificar si se proporcionó un comando válido
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

