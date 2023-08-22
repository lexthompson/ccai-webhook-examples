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

exports.displayExplanation = async (req, res) => {

    // function replaceAll(string, search, replace) {
    //     return string.split(search).join(replace);
    // }

    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    let tag = req.body.fulfillmentInfo.tag;
    console.log('Tag: ' + tag);
    console.log('Session Info Parameters: ' + JSON.stringify(req.body.sessionInfo.parameters));

    if (tag === 'displayExplanation') {

        let bill_month = req.body.sessionInfo.parameters['bill-month'];
        let bill_year = req.body.sessionInfo.parameters['bill-year'];
        let bill = bill_month + bill_year;
        console.log('Bill: ' + bill);

        const COLLECTION_NAME = bill;

        let Charge_Code = req.body.sessionInfo.parameters['selected-charge'];

        const explanation = firestore.collection(COLLECTION_NAME).doc(Charge_Code);
        const chargeExplanation = await explanation.get();

        const data = {
            Bill: bill,
            Charge_Code: Charge_Code,
            Charge_Explanation: chargeExplanation
        };

        console.log(JSON.stringify(data));

        return firestore.collection(COLLECTION_NAME)
        .doc(Charge_Code)
        .get()
        .then(doc => {
            var answer = 'The charge ' + doc.data().Charge_Code + ' on the bill for ' + doc.data().bill + ' is as follows: ' + doc.data().chargeExplanation + '.';
            return res.status(200).send({
                fulfillmentResponse: {
                    messages: [{
                        text: {
                            text: [answer]
                        }
                    }]
                }
            });
        }).catch(err => {
            console.error(err);
            return res.status(400).send({error: 'unable to retrieve', err});
        })

    }
};

