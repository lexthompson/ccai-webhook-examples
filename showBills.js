/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
// exports.helloWorld = (req, res) => {
//   let message = req.query.message || req.body.message || 'Hello World!';
//   res.status(200).send(message);
// };
const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'ccai-billing-demo';
const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true,
});

exports.showBills = async (req, res) => {

  function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }

  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  let tag = req.body.fulfillmentInfo.tag;
  console.log('Tag: ' + tag);

  if (tag === 'get_avail_bills') {
    console.log('Page Info Parameters: ' + JSON.stringify(req.body.pageInfo.formInfo.parameterInfo));
    console.log('Session Info Parameters: ' + JSON.stringify(req.body.sessionInfo.parameters));

    let answer="The bills we have on file for you are: \n\n";
    let mar="";
    let jan="";
    let feb="";
    console.log("BEFORE") //added await
    await firestore.listCollections().then(collections => {
      console.log("IN ARROW FUNCTION")
      for (let collection of collections) {
        console.log("IN LOOP")
        console.log(`Found collection with id: ${collection.id}`);
        if(collection.id==='UserInfo'){
          answer+="";
        }
        else if(collection.id==='Apr_23'){
          answer+="";
        }
        else if(collection.id==='Mar_23'){
          mar="March 2023. \n\n";
        }
        else{
          if(collection.id==='Jan_23'){
            jan=`January 2023. \n\n`;
          }
          else if(collection.id==='Feb_23'){
            feb=`February 2023. \n\n`;
          }
          //answer+=`${collection.id} \n\n`
        }
      
      }

      answer+=jan+feb+mar;


    });
    return res.status(200).send({
      fulfillmentResponse: {
        messages: [{
          text: {
            text: [answer]
          }
        }]
      }
    })
  }
}; 
