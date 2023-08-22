const Firestore = require('@google-cloud/firestore');
    const PROJECTID = 'ccai-billing-demo';
    const firestore = new Firestore({
      projectId: PROJECTID,
      timestampsInSnapshots: true,
    });

exports.validateAcct = async (req, res) => {
  function replaceAll(string, search, replace) 
   {
     return string.split(search).join(replace);
   }

  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  let tag = req.body.fulfillmentInfo.tag;
  console.log('Tag: ' + tag);
  console.log('Session Info Parameters: ' + JSON.stringify(req.body.sessionInfo.parameters));

  if (tag === 'validateAcct1') 
  {
    let Account_Number = replaceAll(JSON.stringify(req.body.sessionInfo.parameters['acct_number']), '"', '');

    const user = firestore.collection('UserInfo').doc(Account_Number);
    const userInfo = await user.get();

    const isValid = userInfo.exists ? true : false;

    if(isValid == true)
    {
      var answer = 'Hello ' + userInfo.data().Name + '!';
    }

    if(isValid == false)
    {
      var answer = '';
    }

    return res.status(200).send({
      sessionInfo: {
        parameters: {
          valid: isValid
        }
      },
      fulfillmentResponse: {
            messages: [{
              text: {
                text: [answer]
              }
             }]
           }
    });
  }
};
