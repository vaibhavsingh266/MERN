const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const jwtoken = require('jsonwebtoken');
// sequelize objects
const {Sequelize} = require('sequelize');
// define express instance
const instance = express();
// configure middlewares with express
// for cors and bosyParser
instance.use(bodyParser.json());
//instance.use(bodyParser.urlencoded({ extended: false }));
instance.use(cors());

// Student Model
instance.use(bodyParser.json());
instance.use(bodyParser.urlencoded({ extended: false }));
instance.use(cors());

const jwtObject = {
    'jwtSecret': 'xyzprq00700qrpzyx'
}

// define a varible that will contains the Token on server
// globally
let globalTokan;

const sequelize = new Sequelize("records", "root", "password", {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        min: 0,
        max: 5,
        idle: 1000
    },
    define: {
        timestamps: false // omit the createdAt and updatedAt columns
    }
});

let students = sequelize.import('./../models/Student');
let users = sequelize.import('./../models/users');


instance.post('/users/uniqueId', (request, response)=> {
    sequelize.sync({force: false})
    .then(() => 
        users.findByPk(request.body.Username)
    )
    .then((result) => {
        if(result === null) {
            response.json({
                statusCode: 404,
                data: `User Not Found`
            });
            response.end();
        }
        else {
            response.json({
                statusCode: 200,
                data: `User Found`
            });
            response.end();
        }
    })
    .catch((error) => {
        response.send({
            statusCode: 500,
            data: `Error Occured ${error}`
        });
        response.end();
    });
})
instance.set('jwtSecret', jwtObject.jwtSecret);
// 2. Authorize the user and generate token
instance.post('/users/authuser', (request, response) => {
    const authValue = {
        Username: request.body.Username,
        Password: request.body.Password
    };
        sequelize.sync({ force: false })
        .then(() => users.findByPk(authValue.Username))
        .then((result) => {
            console.log(JSON.stringify(result));
            // 2a. if user not found response the UnAuthorized
            if (result === null) {
                response.json({ statusCode: 401, data: `User Not Found` });
                response.end();
            } else {
                if (result.Password !== authValue.Password) {
                    response.json({ statusCode: 401, data: `Un-Authenticated response Password Does not match` });
                    response.end();
                } else {
                    // 2b. Logic for issuing the token
                    let accessToken = jwtoken.sign(result.toJSON(), instance.get('jwtSecret'), {
                        expiresIn: 3600 // token will expire in 3600 seconds
                    });
                    globalTokan = accessToken;
                    console.log(`Access Token ${accessToken}`);
                    // 2c. respond token to client
                    response.send({
                        statusCode: 200,
                        authenticated: true,
                        data: accessToken
                    });
                    response.end();
                }
            }

        }).catch((error) => {
            response.json({ statusCode: 401, data: `User Not Found ${error}` });
            response.end();
        });
});

function verifyToken(request)  {
    let token = request.headers.authorization.split(' ')[1];
    
    return new Promise((r,e) => {
        jwtoken.verify(token, instance.get('jwtSecret'), (err, decoded) => {
                // 3d. request failed because token verification failed
                console.log(decoded);
                if (err) {
                    e(err)
                } else {
                    r(decoded);
                }
        })
    });
}


// post method to create user
instance.post('/users/register', (request, response) => {
    sequelize.sync({ force: false })
        .then(() =>              
            users.create({
            Username: request.body.Username,
            Password: request.body.Password
        }))
        .then((result) => {            
            response.json({
                statusCode: 200,
                data: `User Created Successfully ${JSON.stringify(result.toJSON())}`
            });
            response.end();
        })
        .catch((error) => {
            response.send({
                statusCode: 500,
                data: `Error Occured ${error}`
            });
            response.end();
        });
});

// CREATE Student
instance.route('/create-student').post((request, response) => {
    let header = request.headers.authorization;
    // 3b read the token value
    let token = header.split(' ')[1];
    console.log(token);
    if (token !== globalTokan) {
        response.send({ statusCode: 401, data: 'Request UnAuthorized' });
        response.end();
    } else
    {
        // 3c. Varify the token based on issuer using the secret key stored
        // in express object
        verifyToken(request)
        .then((result) => {
                request.decoded = result;
    const student = {
        StudentId: parseInt(request.body.StudentId),
        StudentName: request.body.StudentName,
        University: request.body.University,
        Course: request.body.Course,
        Year: request.body.Year,
        Fees: parseInt(request.body.Fees)
    };
  sequelize.sync({ force: false })
      .then(() => students.create(student))
      .then((result) => {
          if (result !== null) {
              response.json({ statusCode: 200, data: JSON.stringify(result.toJSON()) });
              response.end();
          } else {
              response.json({ statusCode: 200, data: `Record is not Created` });
              response.end();
          }
      }).catch((error) => {
          response.send({ statusCode: 500, data: error });
      })
    })
    .catch((err) => {
        response.send({ statusCode: 401, data: `Token Verification failed ${err}` });
        response.end();
    });
}
});

// READ Students
instance.route('/').get((request, response) => {
    let token = request.headers.authorization.split(' ')[1];
    console.log(`Global token: ${globalTokan}`);
    
    if (token !== globalTokan) {
        
        response.send({ statusCode: 401, data: 'Request UnAuthorized' });
        response.end();
    } else {

        verifyToken(request)
        .then((result) => {
            request.decoded = result;
            sequelize.sync({ force: false })
                .then(() => students.findAll()) // --> the select * from Students
                .then((result) => {
                    response.json({ statusCode: 200, rowCount: result.length, data: result });
                    response.end();
                }).catch((error) => {
                    response.send({ statusCode: 500, data: error });
                });
        })
        .catch((error)=> {
            response.send({ statusCode: 500, data: `Token not verified ${error}` });
            response.end();
        })
}
});



// // Get Single Student
// instance.route('/edit-student/:id').get((request, response) => {
//   // read the parameter
//   let id = parseInt(request.params.id);
//   // do not overwrite the models
//   sequelize.sync({ force: false })
//       .then(() => students.findOne({ where: { rollno: id } })) 
//       .then((result) => {
//           if (result !== null) {
//               response.json({ statusCode: 200, data: result });
//               response.end();
//           } else {
//               response.json({ statusCode: 200, data: `Record not found` });
//               response.end();
//           }
//       }).catch((error) => {
//        console.log(error);
//           response.send({ statusCode: 500, data: error });
//       })
// });

// Update Student
instance.route('/update-student/:id').put((request, response) => {
    let header = request.headers.authorization;
    // 3b read the token value
    let token = header.split(' ')[1];
    console.log(token);
    if (token !== globalTokan) {
        response.send({ statusCode: 401, data: 'Request UnAuthorized' });
        response.end();
    } else
    {
        // 3c. Varify the token based on issuer using the secret key stored
        // in express object
        verifyToken(request)
        .then((result) => {
            request.decoded = result;
                let id = request.params.id;
                const student = {
                    Username: request.body.Username,
                    StudentName: request.body.StudentName,
                    University: request.body.University,
                    Course: request.body.Course,
                    Year: request.body.Year,
                    Fees: parseInt(request.body.Fees)
                };
                sequelize.sync({ force: false })
                    .then(() => students.update(student, { where: { Username: id } }))
                    .then((result) => {
                        if (result !== 0) {
                            response.json({ statusCode: 200, data: result.length });
                            response.end();
                        } else {
                            response.json({ statusCode: 200, data: `Record is not Updated` });
                            response.end();
                        }
                    }).catch((error) => {
                        response.send({ statusCode: 500, data: error });
                    })
        })
    }
});

// Delete Student
instance.route('/delete-student/:id').delete((request, response) => {
  // do not overwrite the models
  let header = request.headers.authorization;
    // 3b read the token value
    let token = header.split(' ')[1];
    
    if (token !== globalTokan) {
        response.send({ statusCode: 401, data: 'Request UnAuthorized' });
        response.end();
    } else
    {

    verifyToken(request)
    .then((result) => {
        request.decoded = result;
        // read the parameter
        let id = request.params.id;
        // do not overwrite the models
        console.log(id);
        sequelize.sync({ force: false })
            .then(() => students.destroy({ where: { StudentId: id }})) // --> the select * from Students where StudentId=id
            .then((result) => {                
                if (result === 0) {
                    response.json({ statusCode: 210, data: 'No Record deleted' });
                    response.end();
                } else {
                    response.json({ statusCode: 200, data: result });
                    response.end();
                }
            }).catch((error) => {
                response.send({ statusCode: 500, data: error });
            })
    })
    .catch((err) => {
        response.send({ statusCode: 401, data: `Token Verification failed ${err}` });
        response.end();
    });
    }
});

instance.listen(4000, () => {
  console.log('Server is listening on port 4000');
})