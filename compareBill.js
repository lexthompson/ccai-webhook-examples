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
          
    exports.compareBill = async (req, res) => {
        function replaceAll(string, search, replace) {
            return string.split(search).join(replace);
        }

        console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
        let tag = req.body.fulfillmentInfo.tag;
        console.log('Tag: ' + tag);
        console.log('Session Info Parameters: ' + JSON.stringify(req.body.sessionInfo.parameters));

        if (tag === 'compare_bill'){
            let default_month = 'Jun_23';
            let defualt_month_string='June 2023';
            let compare_bill_month = req.body.sessionInfo.parameters['compare-bill-month'];
            let compare_bill_year = req.body.sessionInfo.parameters['compare-bill-year'];
            let compare_bill = compare_bill_month + compare_bill_year;
            let compare_bill_string="";
            if(compare_bill==='Jan_23'){
                compare_bill_string="January 2023";
            }
            if(compare_bill==='Feb_23'){
                compare_bill_string="February 2023";
            }
            if(compare_bill==='Mar_23'){
                compare_bill_string="March 2023";
            }
            if(compare_bill==='May_23'){
              compare_bill_string="May 2023";
            }
            
            // The COLLECTION_NAME is what you named the collection in Firestore.
            // const COLLECTION_NAME = bill;
            // console.log(COLLECTION_NAME);
            
            const defaultMonthBill = firestore.collection(default_month);
            const getDefaultMonthBill = await defaultMonthBill.get();
            let introString=`Here is a comparison of your current bill and your bill from ${compare_bill_string}.\n\n`
            let answer = "";
            let defaultMonthString = "Here is your bill for " + defualt_month_string + ":\n";
            
            getDefaultMonthBill.forEach(doc => {
              if(doc.id != 'Total'){
                console.log(doc.id, doc.data().name, doc.data().Details, doc.data().amount);
                answer += "\n";
                
                let defaultBillInfo = doc.data();
                let defaultBillInfoString = `${doc.id} ${defaultBillInfo.amount}.`;
                
                answer += defaultBillInfoString;
              }
            })
            
            let defaultMonthTotalString = "";
            let defaultMonthTotal = firestore.collection(default_month);
            const getDefaultMonthTotal = await defaultMonthTotal.get();

            getDefaultMonthTotal.forEach(doc => {
              if(doc.id === 'Total'){
                defaultMonthTotalString += "\n";

                let defaultTotal = doc.data();
                let defaultTotalString = `\nThe total of your bill is ${defaultTotal.Amount_Due}.\n`;

                defaultMonthTotalString += defaultTotalString;
                console.log(defaultMonthTotalString);
              }
            })

            const compareMonthBill = firestore.collection(compare_bill);
            const getCompareMonthBill = await compareMonthBill.get();
            let answer2 = "";
            let compareMonthString = "\nHere is your bill for " + compare_bill_string + ":\n";
                        
            getCompareMonthBill.forEach(doc => {
                if(doc.id != 'Total'){
                    console.log(doc.id, doc.data().name, doc.data().Details, doc.data().amount);
                    answer2 += "\n";

                    let compareBillInfo = doc.data();
                    let compareBillInfoString = `${doc.id} ${compareBillInfo.amount}.`;

                    answer2 += compareBillInfoString;
                }
            })

            let compareMonthTotalString = "";
            let compareMonthTotal = firestore.collection(compare_bill);
            const getCompareMonthTotal = await compareMonthTotal.get();

            getCompareMonthTotal.forEach(doc => {
              if(doc.id === 'Total'){
                compareMonthTotalString += "\n";

                let compareTotal = doc.data();
                console.log("conpareTotal: " + compareTotal);
                let compareTotalString = `\nThe total of your bill is ${compareTotal.Amount_Due}.`;

                compareMonthTotalString += compareTotalString;
                console.log(compareMonthTotalString);
              }
            })

            console.log(answer);
            console.log(answer2);

            return res.status(200).send({
                fulfillmentResponse: {
                  messages: [{
                    text: {
                      text: [introString + defaultMonthString + answer + defaultMonthTotalString + compareMonthString + answer2 + compareMonthTotalString]
                    }
                   }],
                 }
               });
      
      
            } else {
              res.status(200).send({});
            }
      };
