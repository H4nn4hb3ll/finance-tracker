import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "random bytes key"

export const createUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const prisma = req.prisma

        if (!username || !password) {
            return res.status(400).json({status: 0, message: "Username and password are required"})
        }

        const existingUser = await prisma.users.findUnique({where: {username} })

        if (existingUser) {
            return res.status(409).json({status: 0, message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.users.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        res.status(201).json({status: 1, message: "User created successfully", userID: newUser.userID})

    } catch (err) {
        console.error(err)
        res.status(500).json({status: 0, message: "Error creating user"})
    }
}

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const prisma = req.prisma

        const user = await prisma.users.findUnique({ where: { username } })

        if (!user) {
            return res.status(404).json({ status: 0, message: "User not found"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({status: 0, message: "Invalid password"})
        }

        const token = jwt.sign(
            {userID: user.userID, username: user.username},
            JWT_SECRET,
            {expiresIn: "2h"}    
        )

        await prisma.users.update({
            where: {userID: user.userID},
            data: {sessionStatus: true}
        })

        res.json({
            status: 1, 
            message: "Login success", 
            token,
            userID: user.userID,
            username: user.username
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({status: 0, message: "Login error"})
    }
}

export const logoutUser = async (req, res) => {
    try {
        const { userID } = req.body
        const prisma = req.prisma

        await prisma.users.update({
            where: {userID: Number(userID)},
            data: {sessionStatus: false}
        })

        res.json({status: 1, message: "Logout success"})

    } catch (err) {
        console.error(err)
        res.status(500).json({status: 0, message: "Logout error"})
    }
}

export const getUsers = async (req, res) => {
    try {
        const prisma = req.prisma
        const users = await prisma.users.findMany()
        res.json(users)
    } catch (err) {
        console.error(err);
        res.status(500).json({status: 0, message: "Database error"})
    }
}

export const getBudget = async (req, res) => {
    try {
        const prisma = req.prisma
        const userID = await prisma.users.findUnique({
            where: {username: req.body.userName}, 
            select: { userID: true }
        })
        const accountName = req.body.accountName

        if (!userID) {
            return res.status(404).json({ message: "User not found" })
        }

        const budget = await prisma.budgets.findUnique({ 
            where: { 
                userID_accountName:{
                    userID: userID.userID,
                    accountName:  accountName
                }
            },
            select: {budget: true} 
        })
        res.json(budget)
    } catch (err) {
        console.error(err);
        res.status(500).json({status: 0, message: "Database error"})
    }
}

export const setBudget = async (req, res) => {
    try {
        console.log("setBudget req.body:", req.body); //test
        const prisma = req.prisma
        const userID = await prisma.users.findUnique({
            where: {username: req.body.userName}, 
            select: { userID: true }
        })
        const accountName = req.body.accountName
        const budget = req.body.budget

        if (!userID) {
            return res.status(404).json({ message: "User not found" })
        }

        //check if budget exists
        const budgetExists = await prisma.budgets.findUnique({
            where: {
                userID_accountName:{
                    userID: userID.userID,
                    accountName: accountName
                }
            }
        })

        //if budget exists, change the table, else make an entry
        if(budgetExists){
            const updatedBudget = await prisma.budgets.update({
                where: {
                    userID_accountName: {
                        userID: userID.userID,
                        accountName: accountName
                    }
                },
                data: {
                    budget: budget
                }
            })
        } else {
            const newBudget = await prisma.budgets.create({
                data: {
                    userID: userID.userID,
                    accountName,
                    budget
                }
            })
        }

        res.json({ status: 1, budget: budget });

    } catch (err) {
        console.error("setBudget error:", err);
        res.status(500).json({status: 0, message: "Database error"})
    }
}

export const getExistingToken = async (req, res) => {
    try {
        const prisma = req.prisma
        const userID = await prisma.users.findUnique({
            where: {username: req.body.userName}, 
            select: { userID: true }
        })

        if (!userID) {
            return res.status(404).json({ message: "User not found" })
        }

        // Find token for this user and account
        const token = await prisma.tokens.findMany({ 
            where: { 
                userID: userID.userID,
            },
            select: { token: true }
        })
        
        res.json(token)
    } catch (err) {
        console.error(err);
        res.status(500).json({status: 0, message: "Database error"})
    }
}

export const addToken = async (req, res) => {
    try {
        const token = req.body.accessToken
        const prisma = req.prisma
        const user = await prisma.users.findUnique({
            where: {username: req.body.userName}, 
            select: { userID: true }
        })

        if (!user || !token) {
            return res.status(400).json({status: 0, message: "Username and password are required"})
        }

        const newToken = await prisma.tokens.create({
            data: {
                userID: user.userID,
                token: token
            }
        })

        res.status(201).json({status: 1, message: "token created successfully", userID: newToken.userID})

    } catch (err) {
        console.error(err)
        res.status(500).json({status: 0, message: "Error creating user"})
    }
}