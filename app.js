const express = require('express');
const bodyParser = require('body-parser');
const node_https = require('node:https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
  const firstName = req.body.name1;
  const sirName = req.body.name2;
  const email = req.body.email;
  console.log("User's First name is " + firstName + ", Sir Name is " + sirName + " And email is " + email );
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FIRSTNAME: firstName,
          SIRNAME: sirName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/5ea20de7c4";
  const options = {
    method: "POST",
    auth: "phoenitic:a453d91e85738623ef6bca502108229c-us8"
  }

  const request_https = node_https.request(url, options, function (response) {

    if(response.statusCode === 20){
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    })
  })

  request_https.write(jsonData);
  request_https.end();

})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
})



// Api Keys

// List Id
//
