
export class CopyCommand extends Command {
    execute(source, destination) {
        fs.copyFile(source, destination, (err) => {
            if (err) {
                console.error('Error al copiar el archivo:', err);
            } else {
                console.log('Archivo copiado exitosamente.');
            }
        });
    }
}