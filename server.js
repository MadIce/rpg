const express = require('express');
const {ObjectId} = require('mongodb');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const {mongoose} = require('./database/db');
const socketIO = require('socket.io');
const http = require('http');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcryptjs');
const saltRounds = 10;
var shuffle = require('shuffle-array');
var moment = require('moment');
var uuid4 = require('uuid4');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var H = require('just-handlebars-helpers');

// App
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper("equal", require("handlebars-helper-equal"));
H.registerHelpers(hbs);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static('./public/'));
app.set('view options', { layout: '/layouts/main-layout'});
app.use(cookieParser());
app.use(session({
    secret: 'ianevutytsuinliv',
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
      })
  }));

// Player
const {User} = require('./models/user');

// Market
const {Item} = require('./models/item');
const {BoughtItem} = require('./models/bought-item');

// Fights
const {Fight} = require('./models/fight');
const {LostFight} = require('./models/lost');

// Chatroom
const {Message} = require('./models/message');

// Temporary Fight
const {TempFight} = require('./models/tempfight');

// Revives
const {Revive} = require('./models/revive');


const port = process.env.PORT || 5000;


// Routes
app.get('/', (req, res) => {
    if(!req.session.userId) {
        res.render('index', {layout: false});
       } else {
        User.findById(req.session.userId).then((user) => {

          BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
            Fight.find().sort('-createdAt').limit(26).then((fights) => {
                LostFight.find().sort('-createdAt').limit(70).then((lostFights) => {
                  BoughtItem.find({username: user.username}).then((userItems) => {
                    Message.find().sort('-createdAt').limit(20).then((messages) => {
                        Revive.findOne({username: user.username}).then((revive) => {
                res.render('game', {user, userItems, liveitems, fights, lostFights, messages, revive});
                    });
                   });
                  });
               });
           });
         });
        });
       }
});

app.get('/rules', (req, res) => {
    return res.render('rules', {layout: false});
});

app.get('/revive/:id', (req, res) => {
    if(!req.session.userId) {
       return res.render('index', {errMsg: 'You must be logged in to access game page.', layout: false});
    } else {

      User.findById(req.session.userId).then((user) => {

        Revive.findOne({username: user.username}).then((userRevive) => {
            if(userRevive && userRevive.count < 3) {
                if(user.health < 100) {
                    user.health = 100;
                    user.save();
     
                    Revive.findOneAndUpdate({username: user.username}, {$inc: {count: 1}}).then(() =>{});
     
                    return res.redirect('/');
                 } else {
                     return res.redirect('/');
                 }                
            } else if(userRevive && userRevive.count === 3) {
                return res.redirect('/');
            }
            else {

                if(user.health < 100) {
                    user.health = 100;
                    user.save();

                var newRevive = Revive({
                    username: user.username,
                    
                   });
    
                   newRevive.count = 1;
                   newRevive.save();
                   return res.redirect('/');
                } else {
                    return res.redirect('/');
                }
            }
        });

        });
    }
});

app.get('/signup', (req, res) => {
    if(!req.session.userId) {
        res.render('signup', {layout: false});
       } else {
        res.redirect('game');
       }
});

app.post('/login', (req, res) => {

    req.body.username = req.body.username.charAt(0).toUpperCase() + req.body.username.slice(1);

    User.findOne({username: req.body.username}).then((user) => {
        if(!user) {
            res.render('index', {errMsg: 'Player with provided username is not found.', layout: false});
        }
        bcrypt.compare(req.body.password, user.password).then(function(result) {
            if(result === true) {
               req.session.userId = user._id;
               user.last_login = moment().format('YYYY-MM-DD HH:mm:ss');
               user.save();
               res.redirect('/game');
            }
            else {
                res.render('index', {errMsg: `Player ${user.username} password is incorrect.`, layout: false});
            }
        });        
    });
});

app.post('/signup', (req, res) => {

    if(req.body.username.length < 3) {
        return res.render('signup', {errMsg: 'Username is too short. Min 3 chars.', layout: false});
    }


    if(req.body.username.length > 12) {
        return res.render('signup', {errMsg: 'Username is too long. Max 12 chars.', layout: false});
    }

    if(req.body.password.length < 6) {
        return res.render('signup', {errMsg: 'Password is too short. Min 6 chars.', layout: false});
    }

    if(req.body.username && req.body.password && req.body.charSkin && req.body.type) {
        User.findOne({username: req.body.username}).then((user) => {
            if(user) {
                return res.render('signup', {errMsg: 'Username already exist.', layout: false});
            }
        });
        var newUser = User({
            username: req.body.username,
            password: req.body.password,
            type: req.body.type,
            skin: req.body.charSkin,
            strength: 0,
            dexterity: 0,
            vitality: 0,
            intellect: 0,
            items_dexterity: 0,
            items_intellect: 0,
            items_strength: 0,
            items_vitality: 0,
            fights_lost: 0,
            fights_win: 0,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            last_login: moment().format('YYYY-MM-DD HH:mm:ss'),
            first_login: 0
        });

        newUser.username = newUser.username.charAt(0).toUpperCase() + newUser.username.slice(1);

      if(newUser['type'] === "Melee") {
          newUser['strength'] = 30;
          newUser['dexterity'] = 15;
          newUser['vitality'] = 15;
          newUser['intellect'] = 5;
      }  

      if(newUser['type'] === "Magic") {
        newUser['strength'] = 5;
        newUser['dexterity'] = 15;
        newUser['vitality'] = 15;
        newUser['intellect'] = 30;
    }  

    if(newUser['type'] === "Ranged") {
        newUser['strength'] = 15;
        newUser['dexterity'] = 30;
        newUser['vitality'] = 15;
        newUser['intellect'] = 5;
    }  


    var newBoughtItem = BoughtItem({
        item_id: "5bb124cfc36e3d0dd25b0128",
        item_title: "Ressurect From Graveyard",
        item_price: 140,
        item_img: "/img/market/potions/silvercross.png",
        item_power: 100,
        item_type: "Health",
        username: newUser['username'],
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
    });
    newBoughtItem.save();

        bcrypt.hash(newUser['password'], saltRounds, function(err, hash) {
            newUser['password'] = hash;
            newUser.save().then((user) => {
                req.session.userId = user._id;
                res.redirect('/game');
            });
        });
    } else {
        return res.render('signup', {errMsg: 'All fields are required.', layout: false});
    }
});

app.get('/game', (req, res) => {
    if(!req.session.userId) {
        res.render('index', {errMsg: 'You must be logged in to access game page.', layout: false});
    } else {
    User.findById(req.session.userId).then((user) => {
      BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
          Fight.find().sort('-createdAt').limit(26).then((fights) => {
              LostFight.find().sort('-createdAt').limit(70).then((lostFights) => {
        BoughtItem.find({username: user.username}).then((userItems) => {
            Message.find().sort('-createdAt').limit(20).then((messages) => {
                Revive.findOne({username: user.username}).then((revive) => {
            res.render('game', {user, userItems, liveitems, fights, lostFights, messages, revive});
            });
        });
    });
});
});
      });
});
  }  
});

app.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });

app.get('/leaderboard', (req, res) => {
    if(!req.session.userId) {
        res.render('index', {errMsg: 'You must be logged in to access game page.', layout: false});
    } else {
        User.findById(req.session.userId).then((user) => {
    User.find().sort({current_exp: -1, level: -1, fights_win: -1, fights_lost: -1}).then((users) => {
        BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
            BoughtItem.find({username: user.username}).then((userItems) => {
            Fight.find().sort('-createdAt').limit(26).then((fights) => {
                LostFight.find().sort('-createdAt').limit(70).then((lostFights) => { 
                    Message.find().sort('-createdAt').limit(20).then((messages) => {  
                        Revive.findOne({username: user.username}).then((revive) => {         
        res.render('leaderboard', {user, users, userItems, liveitems, fights, lostFights, messages, revive});
                });
            });
        });
    });
});
        });
        });
    });
  }      
});

app.get('/market', (req, res) => {
    if(!req.session.userId) {
        res.render('index', {errMsg: 'You must be logged in to access game page.', layout: false});
    } else {
    User.findById(req.session.userId).then((user) => {
        BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
            Fight.find().sort('-createdAt').limit(26).then((fights) => {
                LostFight.find().sort('-createdAt').limit(70).then((lostFights) => {     
                    Message.find().sort('-createdAt').limit(20).then((messages) => { 
                        Revive.findOne({username: user.username}).then((revive) => {      
        res.render(__dirname + '/views/market/market', {user, revive, liveitems, fights, lostFights, messages});
                });
    });
});
            });
        });
    });
  }  
});

app.get('/market/strength', (req, res) => {
    if(!req.session.userId) {
        res.render('index', {errMsg: 'You must be logged in to access game page.', layout: false});
    } else {
    User.findById(req.session.userId).then((user) => {
        Item.find({type: "Strength"}).sort('price').then((items) => {
            BoughtItem.find({username: user.username}).then((userItems) => {
                Message.find().sort('-createdAt').limit(20).then((messages) => {
                    BoughtItem.find().sort('-createdAt').limit(20).then((liveitems) => {
                        Fight.find().sort('-createdAt').limit(26).then((fights) => {
                            LostFight.find().sort('-createdAt').limit(50).then((lostFights) => {  
                                Revive.findOne({username: user.username}).then((revive) => {
            res.render(__dirname + '/views/market/strength', {user, items, revive, userItems, messages, liveitems, lostFights, fights});
                            });                    
        });                    
        });        
        });
            });
        });
        });
    });
  }      
});

app.get('/market/intellect', (req, res) => {
    if(!req.session.userId) {
        res.render('index', {errMsg: 'You must be logged in to access game page.', layout: false});
    } else {
    User.findById(req.session.userId).then((user) => {
        Item.find({type: "Intellect"}).sort('price').then((items) => {
            BoughtItem.find({username: user.username}).then((userItems) => {
                Message.find().sort('-createdAt').limit(20).then((messages) => {
                    BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
                        Fight.find().sort('-createdAt').limit(26).then((fights) => {
                            LostFight.find().sort('-createdAt').limit(70).then((lostFights) => {                       
                                Revive.findOne({username: user.username}).then((revive) => {   
                             res.render(__dirname + '/views/market/intellect', {user, revive, items, userItems, messages, fights, lostFights, liveitems});
                            });
                        });
        });     
    });
        });  
          });
        });
    });
  }      
});

app.get('/market/vitality', (req, res) => {
    if(!req.session.userId) {
        res.render('index', {errMsg: 'You must be logged in to access game page.', layout: false});
    } else {
    User.findById(req.session.userId).then((user) => {
        Item.find({type: "Vitality"}).sort('price').then((items) => {
            BoughtItem.find({username: user.username}).then((userItems) => {
                Message.find().sort('-createdAt').limit(20).then((messages) => {
                    BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
                        Fight.find().sort('-createdAt').limit(26).then((fights) => {
                            LostFight.find().sort('-createdAt').limit(70).then((lostFights) => {
                                Revive.findOne({username: user.username}).then((revive) => {                       
            res.render(__dirname + '/views/market/vitality', {user, revive, items, userItems, messages, liveitems, fights, lostFights});
                });
            });
        });
    });
});
        });
        });
    });
  }      
});

app.get('/market/dexterity', (req, res) => {
    if(!req.session.userId) {
        res.render('index', {errMsg: 'You must be logged in to access game page.', layout: false});
    } else {
    User.findById(req.session.userId).then((user) => {
        Item.find({type: "Dexterity"}).sort('price').then((items) => {
            BoughtItem.find({username: user.username}).then((userItems) => {
                Message.find().sort('-createdAt').limit(20).then((messages) => {
                    BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
                        Fight.find().sort('-createdAt').limit(26).then((fights) => {
                            LostFight.find().sort('-createdAt').limit(70).then((lostFights) => {
                                Revive.findOne({username: user.username}).then((revive) => {                       
            res.render(__dirname + '/views/market/dexterity', {user, items, revive, userItems, messages, liveitems, fights, lostFights});
                });
            });
        });
    });
    });
            });
        });
    });
  }      
});

app.get('/market/potions', (req, res) => {
    if(!req.session.userId) {
        res.render('index', {errMsg: 'You must be logged in to access game page.', layout: false});
    } else {
    User.findById(req.session.userId).then((user) => {
        Item.find({type: "Health"}).sort('price').then((items) => {
            BoughtItem.find({username: user.username}).then((userItems) => {
                Message.find().sort('-createdAt').limit(20).then((messages) => {
                    BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
                        Fight.find().sort('-createdAt').limit(26).then((fights) => {
                            LostFight.find().sort('-createdAt').limit(70).then((lostFights) => {
                                Revive.findOne({username: user.username}).then((revive) => {                       
            res.render(__dirname + '/views/market/potions', {user, items, revive, userItems, messages, liveitems, fights, lostFights});
                });
            });
        });
    });
    });
        });
        });
    });
  }      
});

app.get('/arena', (req, res) => {
    if(req.session.userId) {
      User.findById(req.session.userId).then((user) => {
        if(user.health < 1) {
          return res.redirect('/');
        } 
            User.aggregate([
		{ "$match": { "_id": { "$ne": mongoose.Types.ObjectId(req.session.userId) }}},
		    {$lookup: {
                    from: "boughtitems", // collection name in db
                    localField: "username",
                    foreignField: "username",
                    as: "boughtitems"
                }
            }]).then((users) => { 
                users = shuffle(users);

            User.findById(req.session.userId).then((user) => {
                BoughtItem.find({username: user.username}).then((userItems) => {
            BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
                Fight.find().sort('-createdAt').limit(26).then((fights) => {
                    LostFight.find().sort('-createdAt').limit(70).then((lostFights) => {
                        Message.find().sort('-createdAt').limit(20).then((messages) => {    
                            Revive.findOne({username: user.username}).then((revive) => {
            res.render(__dirname + '/views/arena/index', {user, users, userItems, revive, messages, liveitems, fights, lostFights});
        });
      });
    });
    });
});
});
});
});
      });

    } else {
        res.redirect('/');
    }
});

app.get('/arena/fight/user/:username', async (req, res) => {
    const user = await User.findById(req.session.userId);
        if(req.params.username === user.username) {
            return res.redirect('/arena');
        }


    const target = await User.findOne({username: req.params.username});
    const fights = await TempFight.find({$and:[{user: user.username}, {target: target.username}]});
    if(fights.length > 0) {
       return res.redirect('/arena');
    } else {
       const battleId = uuid4();
       const newtempFight = TempFight({
          target: target.username,
          user: user.username,
          code: battleId
       });
       await newtempFight.save();
    }
    
 
    if(req.session.userId) {        
        User.findOne({username: req.params.username}).then((enemy) => {
            if(enemy){
            User.findById(req.session.userId).then((user) => {
                BoughtItem.find({username: user.username}).then((userItems) => {
                    BoughtItem.find({username: enemy.username}).then((enemyItems) => {
                        BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
                            Fight.find().sort('-createdAt').limit(26).then((fights) => {
                                LostFight.find().sort('-createdAt').limit(70).then((lostFights) => {                        
                                Message.find().sort('-createdAt').limit(20).then((messages) => {
                                    Revive.findOne({username: user.username}).then((revive) => {
                                    res.render(__dirname + '/views/arena/battle', {messages, revive, user, enemy, userItems, enemyItems, liveitems, fights, lostFights});
                    });
                });
            });
                });
            });
        });
    });
            });
        } else {
           return res.redirect('/');
        }
        });
    } else {
        return res.redirect('/');
    }
});

app.get('/character/:username', (req, res) => {
    if(!req.session.userId) {
        res.render('index', {errMsg: 'You must be logged in to access game page.', layout: false});
    } else {
    User.findOne({username: req.params.username}).then((userProfile) => {
        if(userProfile){
        User.findById(req.session.userId).then((user) => {
            BoughtItem.find({username: userProfile.username}).then((items) => {
            BoughtItem.find({username: user.username}).then((userItems) => {
                Message.find().sort('-createdAt').limit(20).then((messages) => {
                    BoughtItem.find().sort('-createdAt').limit(23).then((liveitems) => {
                        Fight.find().sort('-createdAt').limit(26).then((fights) => {
                            LostFight.find().sort('-createdAt').limit(70).then((lostFights) => { 
                                Revive.findOne({username: user.username}).then((revive) => {                      
            res.render('profile', {userProfile, user, items, userItems, messages, liveitems, revive, fights, lostFights});
                });
            });
        });
    });
        });
    });
});
        });
    }else {
        res.redirect('/');
    }
        });
  }      
});

var users = 0
io.on('connection', (socket) => {
    
    users = users + 1;
    io.emit('online-users', {
        users: users
    });

     socket.on('upgrade-str', (data) => {
       User.findById(data.userid).then((user) => {
           if(user && user.upgradePoints > 0){
            user.strength = user.strength + 1;
            user.upgradePoints = user.upgradePoints - 1;
            user.save();
           } else {
              console.log('Cheating');
            }
        });
     });
  
     socket.on('upgrade-dex', (data) => {
        User.findById(data.userid).then((user) => {
            if(user && user.upgradePoints > 0){
             user.dexterity = user.dexterity + 1;
             user.upgradePoints = user.upgradePoints - 1;
             user.save();
            }else {
                console.log('Cheating');
             }
         });
      });

      socket.on('upgrade-vit', (data) => {
        User.findById(data.userid).then((user) => {
            if(user && user.upgradePoints > 0){
             user.vitality = user.vitality + 1;
             user.upgradePoints = user.upgradePoints - 1;
             user.save();
            } else {
                console.log('Cheating');
            }
         });
      });

      socket.on('upgrade-int', (data) => {
        User.findById(data.userid).then((user) => {
            if(user && user.upgradePoints > 0){
             user.intellect = user.intellect + 1;
             user.upgradePoints = user.upgradePoints - 1;
             user.save();
            } else {
                console.log('Cheating');
            }
         });
      });

      socket.on('item-bought-str', (data) => {
        if(!ObjectId.isValid(data.itemId)){
            return console.log('Item not found.');
        }
        User.findById(data.userId).then((user) => {
            if(user.items_strength === 100) {
                return console.log('Your strength is already maximum.');
            }            
            User.findOne({username: user.username}).then((realUser) => {
            Item.findById(data.itemId).then((item) => {
                if(item){
                if(user.gold > item.price || user.gold === item.price){
                    var newBoughtItem = BoughtItem({
                        item_id: item._id,
                        item_title: item.title,
                        item_price: item.price,
                        //item_description: data.item_description,
                        item_img: item.img,
                        item_power: item.power,
                        item_type: "Strength",
                        username: data.username,
                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
                    });
                    newBoughtItem.save();
                    user.gold = user.gold - item.price;
                    user.items_strength = user.items_strength + item.power;
                   // user.strength = user.strength + item.power;
                    if(user.strength > 100) {
                        user.strength = 100;
                    }
                    if(user.items_strength > 100) {
                        user.items_strength = 100;
                    }                    
                    user.save(); 


                    io.emit('item-bought-str', ({
                        item_title: data.item_title,
                        item_img: data.item_img,
                        item_price: data.item_price,
                        username: realUser.username, 
                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
                    }));
                    console.log('Item bought successfully');
                } else {
                    console.log('Not enough gold');
                }
            }else {
                console.log('Item not found.');
            }
          });

        });
    });
      });

      socket.on('item-bought-intel', (data) => {
        if(!ObjectId.isValid(data.itemId)){
            return console.log('Item not found.');
        }
          User.findById(data.userId).then((user) => {
            if(user.items_intellect === 100) {
                return console.log('Your intellect is already maximum.');
            }
           
              User.findOne({username: user.username}).then((realUser) => {
              Item.findById(data.itemId).then((item) => {
                if(item){
            if(user.gold > item.price || user.gold === item.price){
                var newBoughtItem = BoughtItem({
                    item_id: item._id,
                    item_title: item.title,
                    item_price: item.price,
                    //item_description: data.item_description,
                    item_img: item.img,
                    item_power: item.power,
                    item_type: "Intellect",
                    username: data.username,
                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
                });
                newBoughtItem.save();  
                user.gold = user.gold - item.price;
                user.items_intellect = user.items_intellect + item.power;
                //user.intellect = user.intellect + item.power;
                if(user.intellect > 100) {
                    user.intellect = 100;
                }
                if(user.items_intellect > 100) {
                    user.items_intellect = 100;
                }                
                user.save();
                           

                io.emit('item-bought-intel', ({
                    item_title: data.item_title,
                    item_img: data.item_img,
                    item_price: data.item_price,
                    username: realUser.username, 
                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
                }));  
                console.log('Item bought successfully');

            } else {
                console.log('Not enough gold');
            }
        } else {
            console.log('Item not found');
        }
          });
        });
    });
      });

      socket.on('item-bought-vit', (data) => {
        if(!ObjectId.isValid(data.itemId)){
            return console.log('Item not found.');
        }
        User.findById(data.userId).then((user) => {
            if(user.items_vitality === 100) {
                return console.log('Your vitality is already maximum.');
            }

            User.findOne({username: user.username}).then((realUser) => {
            Item.findById(data.itemId).then((item) => {
                if(item){
              if(user.gold > item.price || user.gold === item.price){
        
        var newBoughtItem = BoughtItem({
            item_id: item._id,
            item_title: item.title,
            item_price: item.price,
            //item_description: data.item_description,
            item_img: item.img,
            item_power: item.power,
            item_type: "Vitality",
            username: realUser.username,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        newBoughtItem.save();
        user.gold = user.gold - item.price;
        user.items_vitality = user.items_vitality + item.power;
       // user.vitality = user.vitality + item.power;
        if(user.vitality > 100) {
            user.vitality = 100;
        }
        if(user.items_vitality > 100) {
            user.items_vitality = 100;
        }        
        user.save();


        io.emit('item-bought-vit', ({
            item_title: data.item_title,
            item_img: data.item_img,
            item_price: data.item_price,
            username: realUser.username, 
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        })); 
    } else {
        console.log('Not enough gold');
    } 
}else {
    console.log('Item not found');
}
    });     
      });
    });
    });

      socket.on('item-bought-dex', (data) => {
        if(!ObjectId.isValid(data.itemId)){
            return console.log('Item not found.');
        }
        User.findById(data.userId).then((user) => {
            if(user.items_dexterity === 100) {
                return console.log('Your dexterity is already maximum.');
            }
            User.findOne({username: user.username}).then((realUser) => {
            Item.findById(data.itemId).then((item) => {
                if(item){
              if(user.gold > item.price || user.gold === item.price){

        var newBoughtItem = BoughtItem({
            item_id: item._id,
            item_title: item.title,
            item_price: item.price,
            //item_description: data.item_description,
            item_img: item.img,
            item_power: item.power,
            item_type: "Dexterity",
            username: realUser.username,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        newBoughtItem.save();
        user.gold = user.gold - item.price;
        user.items_dexterity = user.items_dexterity + item.power;
        //user.dexterity = user.dexterity + user.items_dexterity;
        if(user.dexterity > 100) {
            user.dexterity = 100;
        }
        if(user.items_dexterity > 100) {
            user.items_dexterity = 100;
        }        
        user.save();

        io.emit('item-bought-dex', ({
            item_title: data.item_title,
            item_img: data.item_img,
            item_price: data.item_price,
            username: realUser.username, 
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        }));  
    } else {
        console.log('Not enough gold');
    }
} else {
    console.log('Item not found');
}
    });      
    });
      });  
    }); 
      
      socket.on('item-bought-pot', (data) => {
        if(!ObjectId.isValid(data.itemId)){
            return console.log('Item not found.');
        }

        User.findById(data.userId).then((user) => {
            User.findOne({username: user.username}).then((realUser) => {
            Item.findById(data.itemId).then((item) => {
                if(item){
              if(user.gold > item.price || user.gold === item.price){

        var newBoughtItem = BoughtItem({
            item_id: item._id,
            item_title: item.title,
            item_price: item.price,
            //item_description: data.item_description,
            item_img: item.img,
            item_power: item.power,
            item_type: "Health",
            username: realUser.username,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        newBoughtItem.save();
        user.gold = user.gold - item.price;
        user.save();
        var item = Item.findById(data.itemId).then((item) => {
            var user = User.findOne({username: data.username}).then((user) => {
                user.gold = user.gold - item.price;
                user.save();
            });
        });
        io.emit('item-bought-pot', ({
            item_title: data.item_title,
            item_img: data.item_img,
            item_price: data.item_price,
            username: realUser.username, 
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        }));       
    } else {
        console.log('Not enough gold');
    }   
} else {
    console.log('Item not found');
}  
      }); 
    });
});
});       

      socket.on('eat-it', (data) => {
        if(!ObjectId.isValid(data.itemId)){
            return console.log('Item not found.');
        }
    User.findOne({username: data.username}).then((user) => {
        if(user.health === 100) {
            return console.log('Your health is full.');
        }
    });
        BoughtItem.findByIdAndRemove(data.itemId).then((item) => {
            if(item){
            User.findOne({username: item.username}).then((user) => {
                user.health = user.health + item.item_power;
                if(user.health > 100) {
                    user.health = 100;
                    user.save();
                }
                user.save();
            });
        }else {
            console.log('Item not found');
        }
        });
      });

      socket.on('sell-item', (data) => {
        if(!ObjectId.isValid(data.itemId)){
            return console.log('Item not found.');
        }
        BoughtItem.findByIdAndRemove(data.itemId).then((item) => {
            if(item){
            User.findOne({username: item.username}).then((user) => {
                
                user.gold = user.gold + item.item_price;
                if(item.item_type === "Dexterity") {
                    
                   /* var dex = user.dexterity - item.item_power;
                        if(dex < 0 || dex === 0) {
                            user.dexterity = 1;
                        } else {
                            BoughtItem.find({$and: [{username: user.username}, {item_type: "Dexterity"}]}).then((usersItems) => {
                               var power = usersItems.reduce((total, item) => total + item.item_power, 0)                           
                               console.log(power);
                               console.log(usersItems.length);
                               if(usersItems.length === "" || usersItems.length === 0 ) {
                                   user.dexterity = 0;
                                   user.save();
                               } else {
                               user.dexterity = power;
                               }
                               user.save();
                            });
                       }
                       user.items_dexterity = user.items_dexterity - item.item_power;
                     //  user.dexterity = itemDex + user.dexterity;
                       user.save();*/
                       user.items_dexterity = user.items_dexterity - item.item_power;
                       BoughtItem.find({$and: [{username: user.username}, {item_type: "Dexterity"}]}).then((userItems) => {
                        var power = userItems.reduce((total, item) => total + item.item_power, 0)                           
                        user.items_dexterity = power;
                        console.log(power);
                        user.save();
                            socket.emit('currentItemDex', {
                                currentItemDex: power
                            });
                       });
                      // user.save();
                }

                if(item.item_type === "Strength") {
                    /*var str = user.strength - item.item_power;
                        if(str < 0 || str === 0) {
                            user.strength = 1;
                        } else {
                            user.strength = user.strength - item.item_power;
                        }*/
                        user.items_strength = user.items_strength - item.item_power;
                        BoughtItem.find({$and: [{username: user.username}, {item_type: "Strength"}]}).then((userItems) => {
                            var power = userItems.reduce((total, item) => total + item.item_power, 0)                           
                            user.items_strength = power;
                            console.log(power);
                            user.save();
                                socket.emit('currentItemStr', {
                                    currentItemStr: power
                                });
                           });
                }
                if(item.item_type === "Vitality") {
                   /* var vit = user.vitality - item.item_power;
                        if(vit < 0 || vit === 0) {
                            user.vitality = 1;
                        } else {
                       
                        }*/
                        user.items_vitality = user.items_vitality - item.item_power;
                        BoughtItem.find({$and: [{username: user.username}, {item_type: "Vitality"}]}).then((userItems) => {
                            var power = userItems.reduce((total, item) => total + item.item_power, 0)                           
                            user.items_vitality = power;
                            console.log(power);
                            user.save();
                                socket.emit('currentItemVit', {
                                    currentItemVit: power
                                });
                           });                        
                }
                if(item.item_type === "Intellect") {
                   /* var intel = user.intellect - item.item_power;
                        if(intel < 0 || intel === 0) {
                            user.intellect = 1;
                        } else {
                            user.intellect = user.intellect - item.item_power;
                        }*/
                        user.items_intellect = user.items_intellect - item.item_power;
                        BoughtItem.find({$and: [{username: user.username}, {item_type: "Intellect"}]}).then((userItems) => {
                            var power = userItems.reduce((total, item) => total + item.item_power, 0)                           
                            user.items_intellect = power;
                            console.log(power);
                            user.save();
                                socket.emit('currentItemInt', {
                                    currentItemInt: power
                                });
                           });
                }                
               // user.save();
                console.log('Sold');
            });
        
        }else {
            console.log('Item not found');
        }
  
        });

      });

      socket.on('fight-lost', (data) => {
        User.findOne({username: data.username}).then((user) => {
            if(user) {
            user.health = 0;
            user.fights_lost = user.fights_lost + 1;
            user.save();
            }else {
                return console.log('user not found');
            }
        });
      });

    socket.on('lost-fight', (data) => {
        User.findOne({username: data.username}).then((user) => {
            User.findOne({username: data.enemyname}).then((enemy) => {
            if(user&&enemy){

                TempFight.findOneAndRemove({user: user.username}).then((f, e) => {
                    if(e){
                       return console.log(e);
                    }
                });

            newLostFight = LostFight({
                username: data.username,
                enemyname: data.enemyname,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
            });
            newLostFight.save();
        } else {
            return console.log('user not found');
        }
    });
        });
        io.emit('lost-fight', {
            username: data.username,
            enemyname: data.enemyname,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')            
        });
    });    

      socket.on('escaped-fight', (data) => {
        User.findOne({username: data.username}).then((user) => {
            TempFight.findOneAndRemove({user: user.username}).then((fight, err) => {
                if(err) {
                    console.log(err);
                }
            });
            if(user){
            user.health = data.health;
            user.save();
            } else {
                return console.log('User not found');
            }
        });
      });

      
      socket.on('message-sent', (data) => {

        User.findOne({username: data.username}).then((user) => {
            if(user) {
          if(data.message.length < 3) {
              return console.log('Message is too short');
          }
          if(data.message.length >= 3) {
           var message = Message({

            username: data.username,
            message: data.message,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        message.save();
            io.emit('message-sent', {
                username: data.username,
                message: data.message,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss')                
            });
    } else {
        console.log('Your message is too complicated for server. Please stop.');
    }
} else {
    console.log('Stop doing stupid things already.');
}
      });
    });

    
    var enemyHealth = 100;
    
    var isFightFinished = false;

    var requestCount = 0;

    var maxCalls = require('events').EventEmitter.defaultMaxListeners = 30;

    let fiveSeconds = Date.now() + 5000;

        socket.on('attack', (data) => {

            TempFight.findOne({user: data.username}).then((fight) => {
                User.findOne({username: fight.target}).then((target) => {
                    if(fight&&target) {
    
                        requestCount++;
                        console.log(requestCount++);
            
                          if (requestCount > maxCalls && Date.now() <= fiveSeconds) {
                          
                           return console.log('Stop spamming');
                          }
                User.findOne({username: data.username}).then((user) => {
                    if(user) {
                        var userHealth = user.health;

                        var userType = user.type;

                        var userItemStr = user.items_strength;
                        var userItemDex = user.items_dexterity;
                        var userItemVit = user.items_vitality;
                        var userItemInt = user.items_intellect;

                        var userStr = user.strength + userItemStr;
                        var userDex = user.dexterity + userItemDex;
                        var userVit = user.vitality + userItemVit;
                        var userInt = user.intellect + userItemInt;
                        var userLevel = user.level;

                        
                        var enemyType = target.type;

                        var enemyItemStr = target.items_strength;
                        var enemyItemDex = target.items_dexterity;
                        var enemyItemVit = target.items_vitality;
                        var enemyItemInt = target.items_intellect;

                        var enemyStr = target.strength + enemyItemStr;
                        var enemyDex = target.dexterity + enemyItemDex;
                        var enemyVit = target.vitality + enemyItemVit;
                        var enemyInt = target.intellect + enemyItemInt;
                        var enemyLevel = target.level;
                
       	if(userType === 'Magic' && enemyType === 'Ranged'){

      	var userPower = ((userDex + userInt) / 2) + userStr / 4;
      	var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userDex/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));

      	var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
      	var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyDex/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
          }
          

      	if(userType === 'Magic' && enemyType === 'Melee'){

            var userPower = ((userDex + userInt) / 2) + userStr / 4;
            var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userDex/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
  
            var enemyPower = ((userDex + userStr) / 2) + userInt / 4;
            var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyDex/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
        }

        if(userType === 'Magic' && enemyType === 'Magic'){

            var userPower = ((userDex + userInt) / 2) + userStr / 4;
            var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userDex/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
  
            var enemyPower = ((userDex + userInt) / 2) + userStr / 4;
            var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyDex/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
        }


        if(userType === 'Ranged' && enemyType === 'Magic'){

            var userPower = ((userDex + userStr) / 2) + userInt / 4;
            var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userDex/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
  
            var enemyPower = ((enemyDex + enemyInt) / 2) + enemyStr / 4;
            var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyDex/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
        }


        if(userType === 'Ranged' && enemyType === 'Melee'){

            var userPower = ((userDex + userStr) / 2) + userInt / 4;
            var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userDex/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
  
            var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
            var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyDex/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
        }


        if(userType === 'Ranged' && enemyType === 'Ranged'){

            var userPower = ((userDex + userStr) / 2) + userInt / 4;
            var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userDex/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
  
            var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
            var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyDex/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
        }


        if(userType === 'Melee' && enemyType === 'Magic'){

            var userPower = ((userDex + userStr) / 2) + userInt / 4;
            var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userDex/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
  
            var enemyPower = ((enemyDex + enemyInt) / 2) + enemyStr / 4;
            var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyDex/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
        }        


        
      	if(userType === 'Melee' && enemyType === 'Ranged'){

      	var userPower = ((userDex + userStr) / 2) + userInt / 4;
      	var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userDex/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));

		var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
      	var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyDex/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
      	}


      	if(userType === 'Melee' && enemyType === 'Melee'){

      	var userPower = ((userDex + userStr) / 2) + userInt / 4;
      	var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userDex/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));

		var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
      	var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyDex/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
      	}

                        var userDmg = userDamage;
                        var enemyDmg = enemyDamage;
                        var minimum = 0;
                            
                        if(userDmg > 100) {
                            userDmg = 100;
                        }

                        if(enemyDmg > 100) {
                            enemyDmg = 100;
                        }

                        userHealth = userHealth - enemyDmg;
                        enemyHealth = enemyHealth - userDmg;
                      
                        User.findOneAndUpdate({username: data.username}, {$set: {health: userHealth}}).then(() => {});
                
                        socket.emit('attack-result', {
                            userDmg: userDmg,
                            enemyDmg: enemyDmg,
                        });

                    } else {
                        return console.log('User not found');
                    }
                });

                            socket.on('win-fight', (data) => {
                               
                          /*  TempFight.findOne({code: fight.code}).then((fightRemoved) => {
                                if(fightRemoved) {
                                    console.log('Fight removed');
                                }
                            });*/

                            if(isFightFinished === false && (enemyHealth <= 0 || userHealth <= 0)) {  
                                isFightFinished = true;
                
                            var gold = Math.floor(Math.random() * 10) + 1;
                            var exp = Math.floor(Math.random() * 20) + 10;
                            User.findOne({username: data.username}).then((user) => {
                                User.findOne({username: data.enemyname}).then((enemy) => {
                                if(user&&enemy){
                    
                                    if(user.level > 5 && enemy.level < 5) {
                                        gold = 3;
                                        exp = 10;
                                    } 


                                    if(user.level < 5 && enemy.level >= 5 && enemy.level < 25) {
                                        exp = exp * 2;
                                        gold = gold * 2;
                                    }
                            
                                    if(user.level < 12 && enemy.level >= 25 && enemy.level < 40) {
                                        exp = exp * 3;
                                        gold = gold * 3;
                                    }
                            
                                    if(user.level < 25 && enemy.level >= 40 && enemy.level < 80) {
                                        exp = exp * 5;
                                        gold = gold * 5;
                                    }
                            
                                    if(user.level < 40 && enemy.level >= 80 && enemy.level < 100) {
                                        exp = exp * 9;
                                        gold = gold * 9;
                                    }
                            
                                    if(user.level < 40 && enemy.level === 100) {
                                        exp = exp * 12;
                                        gold = gold * 12;
                                    }
                    
                    
                                   currentXP = user.current_exp;
                                    if(currentXP + exp > user.exp + 400 && user.level < 100) {
                                        user.exp = user.exp + 400;
                                        user.level = user.level + 1;
                                        user.gold = user.gold + 50;
                                        user.exp = user.exp + exp;
                                        user.upgradePoints = user.upgradePoints + 5;
                                    }
                                    if(currentXP + exp > user.exp + 400 && user.level === 100) {
                                        user.exp = user.exp + 400;
                                        user.exp = user.exp + exp;
                                        //user.upgradePoints = user.upgradePoints + 10;
                                        user.gold = user.gold + 50;
                                    }
                    
                                    user.fights_win = user.fights_win + 1;
                                    user.current_exp = user.current_exp + exp;
                                    user.gold = user.gold + gold;
                                    user.health = 100;
                                    user.save();
                    
                                    var newFight = Fight({
                                        username: user.username,
                                        enemyname: enemy.username,
                                        gold: gold,
                                        exp: exp,
                                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        ended: 1
                                    });
                                        newFight.save();
                    
                                } else {
                                    return console.log('User not found');
                                }
                                
                          
                                io.emit('fight-win', {
                                    username: user.username,
                                    enemyname: enemy.username,
                                    gold: gold,
                                    exp: exp,
                                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
                                });

                                socket.emit('battle-win', {
                                    username: user.username,
                                    enemyname: enemy.username,
                                    gold: gold,
                                    exp: exp,
                                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
                                });

                          });
                        });
                
                    } else {
                       return console.log('fight ended');
                    }
                    });
                
                   

                    } else {
                        return console.log('Fight not found');
                    }
                });
            });
            
 
    
       
    
        });

        socket.on('tutFinish', (data) => {
            User.findById(data.userId).then((user) => {
                if(user) {
                user.first_login = 1;
                user.save();
                } else {
                    console.log('User is not found');
                }
            });
        });

      socket.on('disconnect', () => {
        users = users - 1;
            io.emit('user-disconnected', {
                user: users
            });
      });
});

app.get('*', function(req, res){
    res.redirect("/");
  });

server.listen(port, () => {
    console.log('Server is runing on port 3000');
});
