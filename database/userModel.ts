import { DataTypes } from "sequelize";
import sequelize from "./database";

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^[a-zA-Z0-9\u0600-\u06FF ]+$/,
          msg: "Username can only contain letters, numbers, and spaces.",
        },
        len: {
          args: [3, 25],
          msg: "Username must be between 3 and 25 characters long.",
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 30],
          msg: "Password must be between 8 and 30 characters long.",
        }
      }
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("active", "blocked"),
      defaultValue: "active",
    }
  },
  {
    timestamps: false,
  }
);

export default User;
