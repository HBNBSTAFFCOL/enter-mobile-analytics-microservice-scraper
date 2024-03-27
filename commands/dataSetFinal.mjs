import { Command } from "./index.mjs";
import { JsonFileStorage } from './crud.file.mjs';
import { config } from "./config.mjs";
const dataBaseFinalStorage = new JsonFileStorage('DataBaseFinal.json');
import { v4 as uuidv4 } from 'uuid';


export class DataBaseCommand extends Command {
    
    async execute(source) {

        const dataSpec = await config.specStorage.read();

        // Transform data
        const transformedData = await transformAllData(dataSpec);

        // Function to transform all objects
        function transformAllData(originalData) {
            return  Array.from(originalData).map(transformData);
        }

        // Function to transform an object
        function transformData(originalObject) {
            const platform = originalObject.spec.find(item => item.headTable === "PLATFORM");
            const memory = originalObject.spec.find(item => item.headTable === "MEMORY");
            const battery = originalObject.spec.find(item => item.headTable === "BATTERY");
            const display = originalObject.spec.find(item => item.headTable === "DISPLAY");
            const selfieCamera = originalObject.spec.find(item => item.headTable === "SELFIE CAMERA");
            const mainCamera = originalObject.spec.find(item => item.headTable === "MAIN CAMERA");
            const misc = originalObject.spec.find(item => item.headTable === "MISC");
            const network = originalObject.spec.find(item => item.headTable === "NETWORK");
            const body = originalObject.spec.find(item => item.headTable === "BODY");
            const features = originalObject.spec.find(item => item.headTable === "FEATURES");

            // Function to extract the numerical value from a string
            function extractNumericValue(str) {
                const numericValue = str.match(/\d+/); // Regular expression to extract only the digits
                return numericValue ? parseFloat(numericValue[0]) : null; // Convert to number if a numeric value is found
            }

            // Multiply the price by 4000 for the dollar divisa
            const originalPrice = misc?.attributes.find(attr => attr.attributes === "Price")?.characteristics;
            const multipliedPrice = originalPrice ? extractNumericValue(originalPrice) * 4000 : null;

            return {
                id: uuidv4(),
                name: originalObject.reference,
                brand: originalObject.brand,
                processor: platform?.attributes.find(attr => attr.attributes === "CPU")?.characteristics,
                ram: memory?.attributes.find(attr => attr.attributes === "Internal")?.characteristics?.split(',')[1]?.trim(),
                storage: memory?.attributes.find(attr => attr.attributes === "Internal")?.characteristics?.split(',')[0]?.trim(),
                battery: battery?.attributes.find(attr => attr.attributes === "Type")?.characteristics,
                screenSize: display?.attributes.find(attr => attr.attributes === "Size")?.characteristics,
                screenResolution: display?.attributes.find(attr => attr.attributes === "Resolution")?.characteristics,
                os: platform?.attributes.find(attr => attr.attributes === "OS")?.characteristics,
                frontCamera: selfieCamera?.attributes.find(attr => attr.attributes === "Single")?.characteristics?.split(',')[0]?.trim(),
                rearCamera: mainCamera?.attributes.find(attr => attr.attributes === "Triple")?.characteristics?.split('\n')[0]?.trim(),
                price: multipliedPrice,
                screenType: display?.attributes.find(attr => attr.attributes === "Type")?.characteristics,
                connectivity: network?.attributes.find(attr => attr.attributes === "Technology")?.characteristics?.split(',')[0]?.trim(),
                dimensions: body?.attributes.find(attr => attr.attributes === "Dimensions")?.characteristics?.split(',')[0]?.trim(),
                weight: body?.attributes.find(attr => attr.attributes === "Weight")?.characteristics?.split(',')[0]?.trim(),
                colors: misc?.attributes.find(attr => attr.attributes === "Colors")?.characteristics?.split(',')[0]?.trim(),
                simCapacity: body?.attributes.find(attr => attr.attributes === "SIM")?.characteristics?.split(',')[0]?.trim(),
                image: originalObject.image,
                sensors: features?.attributes.find(attr => attr.attributes === "Sensors")?.characteristics?.split(',')[0]?.trim()
            };
        }
        console.log(transformedData);

        //Storage in a new JSON file
        for (const data of transformedData){
            await dataBaseFinalStorage.create(data);
        }
    }
    get usage() {
        return "<dataSet>"
    }
    get description() {
        return "Execute a shell dataSet"
    }
}