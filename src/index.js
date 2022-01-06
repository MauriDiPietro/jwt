const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

let bd = [];

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

const generateToken = (user) => {
    const token = jwt.sign({data: user}, process.env.PRIVATE_KEY, {expiresIn: '24h'});
    return token
};

const validateToken = (req, res, next)=>{
    const authHeader = req.headers.authorization
    console.log(authHeader)
    if(!authHeader){
        res.status(401).json({error: 'No estás autenticado'})
        res.redirect('/signup')
    }

const token = authHeader.split(" ")[1]

    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded)=>{
        if(err){
            return res.status(401).json({error: 'No estás autorizado'})
        }
        req.user = decoded.data
    })
    next()
}

let user = {
    id: Math.random(),
    name:'User1',
    password: '123456'
};

// console.log(generateToken(user))

app.get('/all', (req, res)=>{
    res.json({data: bd})
});

app.post('/login', (req, res)=>{
    const {username, password} = req.body;
    const user = bd.find(x => {return x.username === username})
    if (user){
        const access_token = generateToken(user)
        return res.json({message: 'User OK!', token: access_token})
    }
   return res.json('Usuario y/o contraseña incorrectos')
});

app.post('/signup', (req, res)=>{
    const {username, password} = req.body;
    const newUser = bd.find(x => {return x.username === username})
    if(newUser){
        return res.send('El usuario ya existe!')
    }
    let user2 = {
        id: Math.random(),
        username,
        password
    }
    bd.push(user2)
    return res.send('Usuario registrado OK')
});

app.get('/profile', validateToken, (req, res)=>{
    res.send('Ingresaste a la Ruta protegida')
})

app.listen(8008, ()=>{
    console.log('Server OK!, puerto 8008')
});