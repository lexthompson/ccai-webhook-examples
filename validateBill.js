/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const Firestore = require('@google-cloud/firestore');
    const PROJECTID = 'ccai-billing-demo';
    const firestore = new Firestore({
      projectId: PROJECTID,
      timestampsInSnapshots: true,
    });
          
    exports.checkValidBill = async (req, res) => {
        function replaceAll(string, search, replace) {
            return string.split(search).join(replace);
        }

        console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
        let tag = req.body.fulfillmentInfo.tag;
        console.log('Tag: ' + tag);
        console.log('Session Info Parameters: ' + JSON.stringify(req.body.sessionInfo.parameters));

        if (tag === 'validate_bill'){
            let bill_month = req.body.sessionInfo.parameters['compare-bill-month'];
            let bill_year = req.body.sessionInfo.parameters['compare-bill-year'];
            let bill = bill_month + bill_year;
        
            // The COLLECTION_NAME is what you named the collection in Firestore.
            const COLLECTION_NAME = bill;
            console.log(COLLECTION_NAME);
            
            let isValid=false;

            console.log("BEFORE") //added await
            await firestore.listCollections().then(collections => {
                console.log("IN ARROW FUNCTION")
                for (let collection of collections) {
                    console.log("IN LOOP")
                    console.log(`Found collection with id: ${collection.id}`);
                    if(collection.id===bill){
                        console.log("VALID FROM FUNCTION");
                        isValid=true;
                    }
                    
                
                }
            });

        
            // const bills = firestore.collection(COLLECTION_NAME);
            // const getBills = await bills.get();
            // let isValid = true;

            // // console.log(getBills);
            // getBills.forEach(doc => {
            //     if(bill === doc){
            //         console.log('valid');
            //         isValid = true;
            //     }
            //     else{
            //         console.log('not valid');
            //     }
            // });
            
            
            return res.status(200).send({
                sessionInfo: {
                    parameters: {
                    valid: isValid
                    }
                }
            });
      }
    };
