import { S3 } from 'aws-sdk';

const client = new S3();

const Bucket: string = process.env.BUCKET_NAME || '';

const domain: string = process.env.DOMAIN || '';

module.exports.handler = async (event: any): Promise<any> => {
  console.log('Shortener event received: %j', event);

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ msg: 'invalid request payload' })
    }
  }

  const body = JSON.parse(event.body);

  if (!body.Key) {
    return {
      statusCode: 400,
      body: JSON.stringify({ msg: 'Key must be provided' })
    }
  }

  if (!body.WebsiteRedirectLocation) {
    return {
      statusCode: 400,
      body: JSON.stringify({ msg: 'WebsiteRedirectLocation must be provided' })
    }
  }

  const { Key, WebsiteRedirectLocation } = body;

  let Expires = new Date();

  Expires.setDate(Expires.getDate() + 1)

  const params: S3.Types.PutObjectRequest = {
    ACL: 'public-read',
    Bucket,
    Key,
    WebsiteRedirectLocation,
    Expires
  }

  await client.putObject(params).promise();

  const url = `${domain}/${Key}`;
  
  const expiry = Expires;

  return {
    statusCode: 200,
    body: JSON.stringify({ url, expiry })
  }
}
