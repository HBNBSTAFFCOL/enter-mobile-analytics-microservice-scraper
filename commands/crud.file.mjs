import fs from 'fs/promises' ;
//const fs = require('fs').promises;

export class JsonFileStorage {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async create(data) {
        try {
            const existingData = await this.read();
            existingData.push(data);
            await this.write(existingData);
            return true; // Success
        } catch (error) {
            console.error("Error creating data:", error);
            return false; // Failure
        }
    }

    async read() {
        try {
            const fileData = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(fileData);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []; // File doesn't exist, return empty array
            }
            console.error("Error reading data:", error);
            throw error;
        }
    }

    async update(data) {
        try {
            let existingData = await this.read();
            const index = existingData.findIndex(item => item.id === data.id);
            if (index !== -1) {
                existingData[index] = data;
                await this.write(existingData);
                return true; // Success
            } else {
                console.error("Data not found for updating");
                return false; // Failure
            }
        } catch (error) {
            console.error("Error updating data:", error);
            return false; // Failure
        }
    }

    async delete(id) {
        try {
            let existingData = await this.read();
            const newData = existingData.filter(item => item.id !== id);
            await this.write(newData);
            return true; // Success
        } catch (error) {
            console.error("Error deleting data:", error);
            return false; // Failure
        }
    }

    async write(data) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.error("Error writing data:", error);
            throw error;
        }
    }
}

