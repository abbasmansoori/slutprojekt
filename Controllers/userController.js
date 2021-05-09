const { InvalidBody, UserNotFound } = require("../Errors");
const User = require("../Models/userModel");
const Task = require("../Models/taskModel");

module.exports = {
  //added login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await User.authenticate(email, password);
      res.json({ token, email });
    } catch (error) {
      next(error);
    }
  },

  //can be updated further with password change
  async updateUserProfile(req, res, next) {
    try {
      const id = req.user.id;
      const { name, email } = req.body;
      const fields = {};
      if (name) fields.name = name;
      if (email) fields.email = email;

      const user = await User.findOne({ where: { id } });
      console.log(user);

      await User.update(fields, { where: { id } });
      res.json({ message: "User info updated" });
    } catch (error) {
      next(error);
    }
  },

  me(req, res, next) {
    const user = req.user;
    res.json({ user });
  },

  async getOneUser(req, res, next) {
    const { id } = req.params;
    // const id = req.body.id
    console.log(id);
    const user = await User.findOne({ where: { id } });
    console.log(user);
    if (!user) {
      throw new UserNotFound();
    }
    res.json({ user });
  },

  async getUserByName(req, res, next) {
    try {
      const { name } = req.query;
      if (!name) {
        throw new InvalidBody(["name"]);
      }
      const user = await User.findAll({
        where: { name: name },
        attributes: { exclude: ["password", "id", "createdAt", "updatedAt"] },
      });
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },

  //Admin endpoints

  async register(req, res, next) {
    try {
      const { email, name, password, role } = req.body;
      if (!email || !name || !password || !role) {
        throw new InvalidBody(["email", "name", "password", "role"]);
      }
      const user = await User.create({ email, name, password, role });
      res.json({ message: "User registered" });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { email, name, role } = req.body;
      const fields = {};
      if (email) fields.email = email;
      if (name) fields.name = name;
      if (role) fields.role = role;

      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new UserNotFound();
      }
      await User.update(fields, { where: { id } });
      res.json({ message: "User updated" });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id } });

      console.log(user);
      await user.destroy();
      res.json({ message: "Wasted!" });
    } catch (error) {
      next(error);
    }
  },




  async createTask(req, res, next) {
    try {
      const { done } = req.body;
      if (!done) {
        throw new InvalidBody(["done"]);
      }
      await Task.create({ done });
      res.json({ message: "Task registered" });
    } catch (error) {
      next(error);
    }
  },
};

// async getUserByName(req, res, next) {
//   try {
//     const { page } = req.params;
//     const { name } = req.query;
//     if (page && !name) {
//       let user = await User.findAll({ limit: 5, offset: (page - 1) * 5 });
//       res.json(user);
//     } else if (page && name) {
//       let user = await User.findAll({ where: { name: name } });
//       res.json(user);
//     }
//   } catch (error) {
//     // res.json(message);
//     next(error);
//   }
// },
