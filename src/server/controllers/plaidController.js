import plaid from 'plaid'
import dotenv from 'dotenv';

//Initialize Plaid client
dotenv.config()
const client = new plaid.PlaidApi(
    new plaid.Configuration({
        basePath: plaid.PlaidEnvironments['sandbox'],
        baseOptions: {
            headers: {
                "PLAID-CLIENT-ID": process.env.PLAID_CLIENT-ID,
                "PLAID-SECRET": process.env.PLAID_SECRET,
                "Plaid-Version": "2020-09-14"
            }
        }
    })
)

export const createLinkToken = async (req, res) => {
    try {
        console.log("req recieved")

        //get information from the client
        const clientName = req.body.client_name;

        //request the link token from plaid
        const response = await client.linkTokenCreate({
            user: {
                client_user_id: 'SEUNF'
            },
            products: ['transactions'],
            required_if_supported_products: ['auth'],
            country_codes: ['us'],
            language: "en",
            client_name: clientName
        })

        // Send the response data as JSON
        res.json(response.data)

    } catch (error) {
        console.error("there was an error")

        // Send error message as JSON
        res.json({
            error: error.message
        })
    }
}

export const getAccessToken = async (req, res) => {
    try {
        const publicToken = req.body.publicToken

        const response = await client.itemPublicTokenExchange({
        public_token: publicToken
        })

        // Send the access token as JSON
        res.json({ accessToken: response.data.access_token })
    } catch (error) {
        console.error('Error', error)

        // Send error message as JSON
        res.json({
            error: error.message
        })
    }
}

export const getTransactions = async (req, res) => {
    try {
        //need to add date selections
        const response = await client.transactionsGet({
            access_token: req.body.token,
            start_date: '2025-01-01',
            end_date: '2025-12-31',
            options: {
                offset: 0
            }
        })

        // Send the transactions data as JSON
        res.json(response.data)
        console.log(res)
        console.log("end response log")
    } catch (error) {
        console.error('Error', error)
        console.log(req.body.token)
        console.log("end error log")

        // Send error message as JSON
        res.json({
            error: error.message
        })
    }
}