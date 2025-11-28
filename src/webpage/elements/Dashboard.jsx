import React, {useState, useEffect} from "react";
import * as Facade from "./Facade.js";
import TransactionsTable from "./DashboardElements/TransactionTable.jsx";
import AccountBox from "./DashboardElements/AccountBox.jsx";
import Chart from "./DashboardElements/Chart.jsx";

export default function Dashboard({ username }) {
  let [accessToken, setAccessToken] = useState([]);
  let [accounts, setAccounts] = useState([]);
  let [groupedAccounts, setGroupedAccounts] = useState([]);
  let [renderAccSelector, setRenderAccSelector] = useState(false);
  let [accountIndex, setAccountIndex] = useState(0);
  let serverAddress = "http://localhost:3333";
  let [chartData, setChartData] = useState();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  //on render, try to get the access tokens
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
            const tokenResponse = await Facade.getExistingToken(username);
            if(!tokenResponse){
              return;
            }
            const tokenStrings = tokenResponse.map(t => t.token);
            setAccessToken(tokenStrings);
            
            //get all of the transactions for each token!
            for(let i = 0; i < tokenStrings.length; i++){
              const transactions = await Facade.getTransactions(tokenStrings[i]);
              setAccounts(prev => [...prev, transactions])
            }

          } catch (error) {
            console.error("Error fetching tokens on init:", error)
          }
    }
    fetchAccessToken();
  } ,[])

  //every time a new account is selected or if the accounts change, update the chart data
  useEffect(() => {
    if (!groupedAccounts || groupedAccounts.length == 0) return;
    setChartData(
      months.map((monthName, monthIdx) => {
        let income = groupedAccounts[accountIndex].transactions
          .filter(
            (t) => t.amount > 0 && new Date(t.date).getMonth() == monthIdx
          )
          .reduce((sum, t) => sum + t.amount, 0);
        let expenses = groupedAccounts[accountIndex].transactions
          .filter(
            (t) => t.amount < 0 && new Date(t.date).getMonth() == monthIdx
          )
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return {
          month: monthName,
          income,
          expenses,
        };
      })
    );
  }, [accountIndex, groupedAccounts]);

  //whenever the accounts change, group them for easier parsing dispaly
  useEffect(() => {
    if (!accounts || accounts.length === 0) return;

    const allGrouped = [];

    accounts.forEach((accountData) => {
      if (!accountData || !accountData.accounts) return;
      
        const grouped = accountData.accounts.map((acc) => ({
          ...acc,
          transactions: [
            ...(accountData.transactions?.filter(
              (t) => t.account_id === acc.account_id
            ) ?? []),
          ],
        }));
        
        allGrouped.push(...grouped);
      });
  
    setGroupedAccounts(allGrouped);
  }, [accounts]);

  async function linkToken() {
    try {
      const data = await Facade.createLinkToken(username);
      const linkToken = data.link_token;

      if (!linkToken) {
        alert("Error creating link token");
        console.error("No link_token returned from backend:", data);
        return;
      }

      const LinkHandler = Plaid.create({
        token: linkToken,
        onSuccess: async function (publicToken, metadata) {
          try {
            const tokenResponse = await Facade.getAccessToken(publicToken);
            console.log("Access token response:", tokenResponse);

            const accessToken = tokenResponse.accessToken;
            
            if (!accessToken) {
              alert("No access token received from backend!");
              console.error("Unexptedted access token response");
              return;
            }

            //store the token in the db
            await Facade.addToken(username, accessToken);

            //add the token to the list
            setAccessToken(prev => [...prev, accessToken]);
            //get the transactions for this token and add it to the list
            const transactions = await Facade.getTransactions(accessToken);
            setAccounts(prev => [...prev, transactions])

            alert("Link was successful!")
            console.log("Access token:", accessToken);
          } catch (error) {
            console.error("Error fetching transactions:", error)
          }
          
        },
        onExit: function (err, metadata) {
          if (err) console.error("Plaid link error:", err);
        },
      });

      LinkHandler.open();
    } catch (error) {
      console.error("Error linking account:", error);
    }
  }

  async function refreshTransactions() {
    if (!accessToken) {
      alert("Please link an account first.");
      return;
    }
    const data = await Facade.getTransactions(accessToken[0]);
    setAccounts(data);
  }

  return (
    <div className="bg-gradient">
      <div className="frosted-box">

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, {username}!</h1>
        <p className="mb-6 text-black/80">You are now logged in.</p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={linkToken}
            className="btn-purple"
          >
            Link Bank Account
          </button>
          <button
            onClick={() => setRenderAccSelector(true)}
            className="btn-purple"
          >
            Select Account
          </button>
          <button
            onClick={refreshTransactions}
            className="btn-purple"
          >
            Refresh Transactions
          </button>
        </div>

        {/* Account Selector */}
        {renderAccSelector && (
          <AccountBox
            accounts={groupedAccounts}
            setIndex={setAccountIndex}
            terminate={() => setRenderAccSelector(false)}
          />
        )}

        {/* Chart */}
        {chartData && chartData.length > 0 && <Chart chartData={chartData} />}

        {/* Transaction Table */}
        {groupedAccounts.length > 0 ? (
          <TransactionsTable account={groupedAccounts[accountIndex]} />
        ) : (
          <p>Nothing to display yet</p>
        )}
      </div>
    </div>
  );
}