const AWS = require('aws-sdk');
const csv = require('csv-parser');


// Set your AWS credentials and region
AWS.config.update({
  accessKeyId: 
  secretAccessKey: 
  region: 'us-east-2'
});


// Create an S3 instance
const s3 = new AWS.S3();


// S3 URI
const s3Uri = "s3://dash-analytics-test/user345@email.com/project-ec16c1d8-d63a-4f68-9cce-10fec8631432/ec16c1d8-d63a-4f68-9cce-10fec8631432.csv"


// Parse S3 URI to get bucket name and object key
const uriParts = s3Uri.match(/^s3:\/\/([^\/]+)\/(.+)$/);
const bucketName = uriParts[1];
const objectKey = uriParts[2];


// Params for getObject
const params = {
  Bucket: bucketName,
  Key: objectKey
};


// Create an array to store the CSV data
const csvData = [];


// Get the object
const s3Stream = s3.getObject(params).createReadStream();


// Pipe the S3 stream through the csv-parser
s3Stream.pipe(csv())
  .on('data', (row) => {
    csvData.push(row);
  })
  .on('end', () => {
    console.log('CSV data:', csvData);
  })
  .on('error', (error) => {
    console.error('Error reading CSV:', error);
  });


console.log(csvData.slice(0, 100));

