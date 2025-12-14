import { useState, useEffect } from "react";

export default function TransactionsTable({ account }) {
  //this expects a single account
  let [transactions, setTransactions] = useState([]);

  //extract all the transactions from the account
  useEffect(() => {
    console.log(account);
    if (!account?.transactions) return;

    const today = new Date();
    const sixMonthsAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 6,
      today.getDate()
    );

    const recentTransactions = account.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= sixMonthsAgo && transactionDate <= today;
    });

    setTransactions(recentTransactions);
  }, [account]);

  return (

    <div className="table-container">
      <h2 className="table-header">{account.name}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Transaction Code</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, idx) => (
            <tr key={idx}>
              <td>{t.merchant_name || t.name}</td>
              <td>{t.name}</td>
              <td>{t.transaction_type}</td>
              <td>{t.category?.join(", ") || "N/A"}</td>
              <td
                className={
                  t.amount >= 0 ? "amount-positive" : "amount-negative"
                }
              >
                {t.amount.toFixed(2)}
              </td>
              <td>{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}
