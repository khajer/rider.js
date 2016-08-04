# rider.js
fast way to create web-application (node + mongodb)

------------------

## Installation
npm install rider.js -g

## How to user

#### Create project 
``` 
rider create-app YOUAPP_NAME
```

#### Run Server
```
cd YOUAPP_NAME
```
```
node index.js
``` 

#### change config db (config/db.json)
```
{
  "db_name": "xx",   // <-- set you db name
  "db_type": "mongo",
  "host": "localhost",
  "username": "",
  "passwd": ""
}	
``` 

#### create model file 
``` 
rider create-model YOU_MODEL
```

#### generate controller , view with model
``` 
rider gen-model YOU_MODEL
``` 


#### run server again
``` 
node index.js
``` 

#### test url

http://localhost:3000/YOU_MODEL/index


### Powered by (expressjs)
created by itsara konsombut (khajer@yahoo.com)
