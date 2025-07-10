import { Router } from 'express';
import { createHash } from '../utils/password.js';
import { userModel } from '../models/user.model.js';

const router = Router();

// --- GET ---
router.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    console.log(users);
    res.send({ result: "Success", payload: users });
  } catch (error) {
    console.error("No se pudo obtener usuarios con Mongoose: " + error);
    res.status(500).send({ error: "No se pudo obtener usuarios con Mongoose", message: error });
  }
});

// --- POST ---
router.post("/", async (req, res) => {
  
  try {
    const { first_name, last_name, email, age, city, password } = req.body;
     //TODO: Validar mlo que viene en el req.body

    const newUser = new userModel({
      first_name,
      last_name,
      email,
      age,
      city,
      password: createHash(password)
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();
    res.status(201).send({ result: "Success", payload: newUser._id });
  } catch (error) {
    console.error("Error al crear usuario: " + error);
    res.status(500).send({ error: "No se pudo crear el usuario", message: error });
  }
});

// --- PUT ---
router.put("/:id", async (req, res) => {
  try {
    const userUpdate  = req.body;
    const user = await userModel.findByIdAndUpdate({_id: req.params.id}, userUpdate, { new: true });

    res.status(202).send(user);
  } catch (error) {
    console.error("Error al actualizar usuario: " + error);
    res.status(500).send({ error: "No se pudo actualizar el usuario", message: error });
  }
});

// --- DELETE ---
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);

    // Cambia 'result' por 'deletedUser'
    res.status(202).send({ status: "success", payload: deletedUser });
  } catch (error) {
    console.error("Error al eliminar usuario: " + error);
    res.status(500).send({ error: "No se pudo eliminar el usuario", message: error });
  }
});

// ====================================
//           2da parte
// ====================================

//Contador de visitas

export default router;
 
