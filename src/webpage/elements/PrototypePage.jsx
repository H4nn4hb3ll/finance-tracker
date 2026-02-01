import { useState, useEffect } from "react";
import TransactionTable from "./DashboardElements/TransactionTable.jsx";
import AccountBox from "./DashboardElements/AccountBox.jsx";
import Chart from "./DashboardElements/Chart.jsx";

export default function Page() {
  let accessToken;
  let [accounts, setAccounts] = useState(null);
  let [groupedAccounts, setGroupedAccounts] = useState([]);
  let [renderAccSelector, setRenderAccSelector] = useState(false);
  let [accountIndex, setAccountIndex] = useState(0);
  let serverAddress = "http://localhost:3333";
  let [chartData, setChartData] = useState();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

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
    if (!accounts || !accounts.accounts) return;
    console.log(accounts);
    setGroupedAccounts(
      // for each account map the data into an array
      accounts.accounts.map((acc) => ({
        ...acc,
        transactions: [
          //add the whole category, just filter out anything that doesnt match the current id
          ...(accounts.transactions?.filter(
            (t) => t.account_id === acc.account_id
          ) ?? []),
        ],
      }))
    );
  }, [accounts]);

  async function linkToken() {
    //fetch blank link token data and parse into a json
    const response = await fetch(serverAddress + "/create_link_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_name: "user", //Add your client's name here
      }),
    });
    const data = await response.json();
    const linkToken = data.link_token;

    //if the link token is null, end function and show error
    if (!linkToken) {
      alert("Error creating link token");
      console.error("No link_token returned from backend:", data);
      return;
    }

    //make the link window and handle it
    const LinkHandler = Plaid.create({
      token: linkToken,

      onSuccess: async function (dirtyToken, metadata) {
        //send the dirty token and wait for the response
        const res = await fetch(serverAddress + "/get_access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicToken: dirtyToken,
          }),
        });

        //store the access token as a json
        const success = await res.json();
        accessToken = success.accessToken;

        //store the account data
        const response = await fetch(serverAddress + "/get_transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: accessToken,
          }),
        });
        const data = await response.json();
        setAccounts(data);
      },

      //if link wasnt finished, log the error
      onExit: function (err, metadata) {
        if (err) {
          console.error("Error:", err);
        }
      },
    });

    LinkHandler.open(); //Actually open the Plaid Link window
  }

  //gets the transactions for the user from plaid again
  async function refreshTransactions() {
    const response = await fetch(serverAddress + "/get_transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: accessToken,
      }),
    });
    const data = await response.json();
    setAccounts(data);
  }

  return (
    <>
      <div>
        <button
          onClick={() => setRenderAccSelector(true)}
          type="button"
          id="SelectAccount"
        >
          Select an Account
        </button>
        <button onClick={linkToken} type="button" id="createLinkToken">
          Create Link Token
        </button>
        <button
          onClick={refreshTransactions}
          type="button"
          id="refreshTransactions"
        >
          Refresh transactions
        </button>
      </div>

      {renderAccSelector == true ? (
        <AccountBox
          accounts={groupedAccounts}
          setIndex={(index) => setAccountIndex(index)}
          terminate={() => setRenderAccSelector(false)}
        />
      ) : null}

      <div>
        {chartData?.length > 0 ? <Chart chartData={chartData} /> : null}
      </div>

      {groupedAccounts?.length > 0 ? (
        <TransactionTable account={groupedAccounts[accountIndex]} />
      ) : (
        <p>nothing to display yet</p>
      )}
    </>
  );
}
