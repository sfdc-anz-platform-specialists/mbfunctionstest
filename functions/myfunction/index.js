import { readFileSync} from "fs";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import * as PDFDocument from 'pdfkit';

import getStream from 'get-stream';

const sampleData = JSON.parse(
  readFileSync(new URL("./data/sample-data.json", import.meta.url))
);

//image attachment
const imageData = readFileSync('./data/logo.jpg', {encoding:'base64'});

//pdf attachment
//const pdfData = readFileSync('./data/Datasheet.pdf', {encoding:'base64'});

/**
 * From a large JSON payload calculates the distance between a supplied
 * point of origin cordinate and the data, sorts it, and returns the nearest x results.
 *
 * The exported method is the entry point for your code when the function is invoked.
 *
 * Following parameters are pre-configured and provided to your function on execution:
 * @param event: represents the data associated with the occurrence of an event, and
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.
 */
export default async function (event, context, logger) {
  

  const data = event.data || {};
  
  logger.info(
    `Invoking Mikes MyFunctions-myfunction with payload ${JSON.stringify(data)}`
  );


  
  // validate the payload params
  if (!data.latitude || !data.longitude) {
    throw new Error(`Please provide latitude and longitude`);
  }

  // Sets 5 if length is not provided, also accepts length = 0
  const length = data.length ?? 5;

const datasetsize=sampleData.schools.length;

  // Iterate through the schools in the file and calculate the distance using the distance function below
  const schools = sampleData.schools
    .map((school) => {
      return Object.assign({}, school, {
        distance: distance(
          data.latitude,
          data.longitude,
          school.latitude,
          school.longitude
        )
      });
    })
    // Sort schools by distance distance from the provided location
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  // Assign the nearest x schools to the results constant based on the length property provided in the payload
  const results = schools.slice(0, length);
  logger.info('Before pdfdoc');



logger.info('After pdfdoc');
logger.info('Storing run details and attachments in SFDC objects using Unit-of-Work');

// Create a Unit nof Work to store Fucntion Log and Attachment
const uow = context.org.dataApi.newUnitOfWork();

//just for fun generate a random string
let randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey

const functionRunlogId = uow.registerCreate({
  type: "FunctionRunLog__c",
  fields: { 
    LogText__c: `Node.js function returned random string: [${randomName}]. Plotted ${length} closest schools from the sample dataset of ${datasetsize} records`,
    LogDateTime__c:`${Date.now()}`    
  }
});

const attachmentId = uow.registerCreate({
  type: "Attachment",
  fields: { 
    ParentId:functionRunlogId,
    ContentType: "image/jpeg",
    Name:"logo.jpg",
    Body:imageData
       
  }
});
const pdfId = uow.registerCreate({
  type: "Attachment",
  fields: { 
    ParentId:functionRunlogId,
    ContentType: "application/pdf",
    Name:"Datasheet.pdf",
    Body:createPdf('xx')
      
  }
});

  // Commit the Unit of Work with all the previous registered operations
  try {
  const response = await context.org.dataApi.commitUnitOfWork(uow);

  // Construct the result by getting the Id from the successful inserts
  const result = {
    functionRunLogId: response.get(functionRunlogId).id,
    attachmentId: response.get(attachmentId).id,
    pdfId:response.get(pdfId).id
    
  };
  logger.info(
    `Invoking returned result ${JSON.stringify(result)}`
  );
} catch (err) {
  const errorMessage = `Failed to insert record. Root Cause : ${err.message}`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
}
 
  return { schools: results };
}

/**
 * Calculate distance between two geographical points
 *
 * @param {string} latitudeSt:  represents the latitude of the origin point
 * @param {string} longitudeSt:  represents the longitude of the origin point
 * @param {string} latitudeSch:  represents the latitude of the school
 * @param {string} longitudeSch:  represents the longitude of the school
 * ....
 * @returns {number} distance between point a and b
 */
function distance(latitudeSt, longitudeSt, latitudeSch, longitudeSch) {
  if (latitudeSt == latitudeSch && longitudeSt == longitudeSch) {
    return 0;
  } else {
    const radLatitudeSf = (Math.PI * latitudeSt) / 180;
    const radLatitudeSch = (Math.PI * latitudeSch) / 180;
    const theta = longitudeSt - longitudeSch;
    const radTheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radLatitudeSf) * Math.sin(radLatitudeSch) +
      Math.cos(radLatitudeSf) * Math.cos(radLatitudeSch) * Math.cos(radTheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344 ;
    return dist;
  }
}


   async function createPdf(text){
    
    const doc = new PDFDocument;
    doc.fontSize(10).text(text, 50, 50);
    doc.end();

    const data = await getStream.buffer(doc);
    let b64 = Buffer.from(data).toString('base64');

    return b64;
  }

