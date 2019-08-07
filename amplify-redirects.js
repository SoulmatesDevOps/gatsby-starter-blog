const Amplify = require('aws-sdk/clients/amplify')

async function updateAmplifyRedirects (redirects) {
  const amplify = new Amplify({
    apiVersion: '2017-07-25',
    region: 'us-west-2', /* required */
  })
  
  const params = {
    appId: 'd5qrcr2gpang3', /* required */
    customRules: redirects
  };
  
  try {
    const app = await amplify.updateApp(params).promise();
    console.log(app)
  } catch (err) {
    console.error(err, err.stack)
  }
  
  // console.log('This would setup the redirects in the AWS Amplify console')
  
  /*
   * Pull down the redirects from Contentful
   * Call the AWS API to set Amplify's customRules
   */  
}

module.exports = updateAmplifyRedirects
