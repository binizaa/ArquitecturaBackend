import passport from 'passport';
import passportLocal from 'passport-local';
import { userModel } from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/password.js';
import { PRIVATE_KEY } from '../utils/jsonwebtoken.js';
import jwtStrategy from 'passport-jwt';

const LocalStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy
// Extrae el token JWT de las cookies
const ExtractJwt = jwtStrategy.ExtractJwt;

// Cookie extractor para JWT
const cookieExtractor = req => {
    let token = null;
    console.log("Entrando a Cookie Extractor");

    if (req && req.cookies) {
        console.log("Cookies presentes: ", req.cookies);
        token = req.cookies['jwtCookieToken'];
        console.log("Token obtenido desde Cookie: ", token);
    }

    return token;
};

/** Inicializa estrategias de Passport */
const inicializePassport = () => {

    // Todo:: OJO si usamos Passort-JWT lo reemplazaremos por login(LocalStrategy)
    /* ==================================
            Jwt Strategy
    ==================================*/
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        },
        async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT");
            try {
                console.log("JWT obtenido del Payload: ", jwt_payload);
                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
        }
    ));

    /**
     * Estrategia Local - Registro
     */
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            console.log("Datos de registro recibidos:", req.body);

            try {
                const userExists = await userModel.findOne({ email });
                if (userExists) {
                    console.log("El usuario ya existe");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                };

                const result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error registrando el usuario: " + error);
            }
        }
    ));

    /**
     * Estrategia Local - Login
     */
    passport.use('login', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });

                console.warn("Usuario encontrado para login: ", user);
                if (!user) {
                    console.warn("Usuario no existe con username: " + username);
                    return done(null, false);
                }

                if (!isValidPassword(user, password)) {
                    console.warn("Credenciales inválidas para: " + username);
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    /**
     * Serialización y deserialización de sesión
     */
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.log("Error deserializando el usuario: " + error);
            done(error, null);
        }
    });
};

export default inicializePassport;
