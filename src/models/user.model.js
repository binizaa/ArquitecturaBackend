// src/models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: [true, "Correo es requerido"]
  },
  age: Number,
  city: String,
  password:String,
  role: {
    type:String,
    default: 'user',
    enum: [ 'user', 'admin', 'premium']
  }
}, {
  versionKey: 'version' // Deshabilita el parámetro "__v"
});

export const userModel = mongoose.model('usuarios', userSchema);
