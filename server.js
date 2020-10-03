var express = require('express');

const PropertiesReader = require('properties-reader'),
  props = PropertiesReader('./api/config/app.properties');

app = express(),
  cors = require('cors'),
  port = process.env.PORT || props.get('server.port'),
  bodyParser = require('body-parser'),
  fileUpload=require('express-fileupload');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload())
//Enabling the CORS
app.use(cors());

// Setting the max emmitters to 30 for logger objects
require('events').EventEmitter.defaultMaxListeners = 30;

// Syncing the Database
const db = require("./api/models/sequelize");
db.sequelize.sync();

// importing router
var routes = require('./api/routes/vendorRoutes'),
  // importing the winston logger
logger = require('./api/config/winston_Logger');

// Registering the app with router
routes(app);

// Passing the module to the router
logger = logger(module);

// Assigning the port to the server
app.listen(port);

logger.debug("Node API server started on port: '" + port)