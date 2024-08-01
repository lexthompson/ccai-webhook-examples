# please know this Py code only works for finding training phrases and their intents for JSON DFCX exported agents
import os
import json
import pandas as pd

# Function to get training phrases only from that have training phrases
def getTrainingPhrases (intentName: str) -> list[str]:
    training_phrases = []
    trainingPhraseDirectory = "trainingPhrases"
    # create path to intentName
    newRoot = os.path.join(root_dir, intentName, trainingPhraseDirectory)
    
    for dirpath, dirnames, filenames in os.walk(newRoot) :
        for filename in filenames : 

            # checks if .json file exists in directory
            if filename.endswith('.json') :

                # set new directory path for json file to open later
                file_path = os.path.join(newRoot, filename)
                
                # open and read directory json
                with open(file_path, 'r') as f :
                    json_data = json.load(f)

                    # get training phrase objs
                    for partObj in json_data['trainingPhrases'] :

                        # get all training phrases
                        for parts in partObj['parts'] :
                            
                            # append to training phrases array
                            training_phrases.append(parts['text'])
                            
    return training_phrases


try:
    # Please right click your directory and select "Copy as path" and paste into terminal
    # Root path should point to directory with Json files you need o look into, usually something like "<path>/exported_agent/intents"
    input_root_path = input('Root Path: ').replace('"','')

    # Define the root directory
    root_dir = r'{}'.format(input_root_path)

    # Initialize an empty list to store the data
    data = []

    # Walk through the directories
    for dirpath, dirnames, filenames in os.walk(root_dir):
        intent_name = ""
        training_phrases = []

        for dirname in dirnames:        
            # Get name of Intent
            intent_name = str(dirname)

            # Get path of Intent Name directory
            dir_path = os.path.join(dirpath, dirname)

            # Parse Training Phrases of Intent into list using function getTrainingPhrases
            training_phrases = getTrainingPhrases(dirname)

            # Append the data to the main list
            data.append([intent_name, training_phrases])

        # Uncomment for print verification
        # print(str(data))

        # not sure why...but this break is needed to ensure no other files are populated
        break

    # Convert the list to a DataFrame where there is a column for "Intent" and the list of "training phrases" for them
    df = pd.DataFrame(data, columns=['Intent', 'Training Phrase'])

    # Write the DataFrame to an Excel file : change name "output" to your choosing
    # note: will create in path that Py script is run, otherwise, please add path if you want to change : example : "toExcel/example.xlsx"
    df.to_excel('output.xlsx', index=False)

    print('conversion complete')
except Exception as e:
    print(e)