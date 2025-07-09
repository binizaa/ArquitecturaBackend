import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Hola, usted ha visitado la pagina ${req.session.counter} veces`);
  } else {
    req.session.counter = 1;
    res.send('Bienvenido');
  }
});

// Login
// router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login'}), async (req, res) => {
//   try {

//     console.log("User found to login")
//     const user = req.user

//     const access_token = generateJWToken(user) 

//     res.send({ status: "success", payload: access_token});

//   } catch (err) { 
//     console.error("Error en login:", err);
//     const errorMessage = err instanceof Error ? err.message : String(err);
//     res.status(500).json({ status: "error", message: "Error interno del servidor", error: errorMessage });
//   }
// });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    console.log("Usuario encontrado para login:");
    console.log(user);

    if (!user) {
      console.warn("User doesn't exist with email: " + email);
      return res.status(204).send({
        error: "Not found",
        message: "Usuario no encontrado con email: " + email
      });
    }

    if (!isValidPassword(user, password)) {
      console.warn("Invalid credentials for user: " + email);
      return res.status(401).send({
        status: "error",
        error: "El usuario y la contraseña no coinciden"
      });
    }

    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role
    };

    const access_token = generateJWTToken(tokenUser);
    console.log(access_token);

    // Creamos la cookie y almacenamos el access_token en la cookie
    req.cookie('jwtCookieToken', access_token, {
      maxAge: 60000,
      httpOnly: true //No se expone la cookie
      //httpOnly: false // Se expone la cookie
    })

    return res.send({
      status: "success",
      payload: access_token
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Register
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register'}),async (req, res) => {
  res.send({status: "success", message: "Usuario creado con exito con ID:"})
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error al destruir la sesión:", err);
      return res.status(500).json({ status: "error", message: "Error al cerrar la sesión" });
    }
    res.status(200).send("Sesión cerrada correctamente");
  });
});

// Protected route
router.get('/private', auth, (req, res) => {
  console.log(req.session);
  res.send("Si estás viendo esto es porque eres admin");
});

function auth(req, res, next) {
  // This authentication function needs to be more robust for a real environment
  // For example, verify a user role from the req.session.user object
  if (req.session.user && req.session.user.email === "pepe" && req.session.user.isAdmin === true) { // Assuming 'pepe' is the email and you have an 'isAdmin' property
    return next();
  }
  return res.status(401).json({ status: "error", message: "No autorizado" });
}

router.get("/fail-register", (req, res) => {
    res.status(401).send({error: "Failed to process register!"})
})

router.get("/fail-login", (req, res) => {
    console.log("LOGIN OK, req.user:", req.user);
    res.status(401).send({error: "Failed to process login"})
})

export default router;
