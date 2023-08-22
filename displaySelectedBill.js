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
          
    exports.displaySelectedBill = async (req, res) => {
        function replaceAll(string, search, replace) {
            return string.split(search).join(replace);
        }

        console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
        let tag = req.body.fulfillmentInfo.tag;
        console.log('Tag: ' + tag);
        console.log('Session Info Parameters: ' + JSON.stringify(req.body.sessionInfo.parameters));

        if (tag === 'display_bill'){
            let current_month = 'Jun_23';
            // let bill_month = req.body.sessionInfo.parameters['bill-month'];
            // let bill_year = req.body.sessionInfo.parameters['bill-year'];
            // let bill = bill_month + bill_year;
            
            // The COLLECTION_NAME is what you named the collection in Firestore.
            const COLLECTION_NAME = current_month;
            console.log(COLLECTION_NAME);
            
            let answer = "";
            const bills = firestore.collection(COLLECTION_NAME);
            const getBills = await bills.get();
            
            
            // let totalString = "";
            // console.log(getBills);
            
            getBills.forEach(doc => {
                if(doc.id != 'Total'){
                    // console.log(doc.id, doc.data().name, doc.data().Details, doc.data().amount);
                    // console.log(doc.data());
                    answer += "\n";
                    
                    let billInfo = doc.data();
                    console.log("billInfo : " + billInfo);
                    let billInfoString = `${doc.id} ${billInfo.amount}.`;
                    
                    answer += billInfoString;
                }
            })
            
            let totalString = "";
            const total = firestore.collection(COLLECTION_NAME);
            const getTotal = await total.get();
            // console.log('Total: ' + getTotal.data());
            let billDue = 'June 30';

            getTotal.forEach(doc => {
                if(doc.id === 'Total'){
                    totalString += "\n";

                    let totalInfo = doc.data();
                    console.log("totalInfo: " + totalInfo);
                    let totalInfoString = `\nThe total of your bill is ${totalInfo.Amount_Due}.`;
                    let billDueDate = '\nThe due date for your bill is ' + billDue + '. ';

                    totalString += totalInfoString;
                    totalString += billDueDate;
                    console.log(totalInfoString);
                }
            })


            return res.status(200).send({
                fulfillmentResponse: {
                  messages: [{
                    text: {
                      text: [answer + totalString]
                    }
                   }],
                
                }
               });
      
      
            } else {
              res.status(200).send({});
            }
      };
