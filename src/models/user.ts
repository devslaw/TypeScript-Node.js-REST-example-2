import * as Sequelize from 'sequelize'
import { sequelize } from '../config/sequelize'

export interface UserAddModel {
    id?: any
    email?: string
    phone?: string
    name?: string
    password?: string
    refreshToken?: string
    resetToken?: string
}

export interface UserModel extends Sequelize.Model<UserModel, UserAddModel> {
    id: number
    email: string
    name: string
    phone: string
    password: string
    refreshToken: string
    resetToken: string
    createdAt: string
    updatedAt: string
}



export const User = sequelize.define<UserModel, UserAddModel>('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    password: Sequelize.STRING,
    refreshToken: Sequelize.STRING,
    resetToken: Sequelize.STRING,
});