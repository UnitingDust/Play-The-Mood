An Alexa Skill that plays weather depending on the current weather at your current location. Developed at PrincetonHacks Fall 2018. 

Used Alexa Developer Platform and AWS Lamda (Both used Node.js). First the user voice input is received on the Alexa and processed over to Lamda. Lamda uses this information to begin gathering the user's zip code through an AmazonService API call. The weather is then obtained by sending the zip code over to OpenWeather's API. Afterwards the correct song is selected and relayed back to Alexa to begin playing. 
