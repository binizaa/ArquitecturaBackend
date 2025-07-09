import express from 'express';
import FileStore from 'session-file-store'; 
import mongoose from 'mongoose';
import usersRoutes from './routes/users.router.js';
import viewsRouter from './routes/view.routes.js';
import sessionRouter from './routes/sessions.router.js';
import usersViewsRouter from './routes/users.views.router.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import path from 'path';
import passport from 'passport';
import { fileURLToPath } from 'url'; 
import inicializePassport from './config/passport.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const SERVER_PORT = 8080;
const MONGO_URL = 'mongodb+srv://binizarz:vUopdTEx4e7MK4f5@cluster0.oqbmpew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure Handlebars as the view engine
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars'); 

// Configure session middleware with MongoStore
app.use(session({
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    ttl: 10 
  }),
  secret: "your-secret-key", 
  resave: true, 
  saveUninitialized: true 
}));

// Middleware Paasport
inicializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Route Middlewares
app.use('/api/users', usersRoutes); 
app.use('/', viewsRouter); 
app.use('/users', usersViewsRouter); 
app.use('/api/sessions', sessionRouter); 

// Function to connect to MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Conectado con éxito a la BD de Mongo');
  } catch (error) {
    console.error('No se pudo conectar a la BD usando Mongoose: ' + error);
    process.exit(1); 
  }
};

connectMongoDB();

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port: ${SERVER_PORT}`);
});
