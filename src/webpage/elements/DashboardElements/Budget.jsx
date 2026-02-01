import React, { useState, useEffect } from "react";
import * as Facade from "../Facade.js"; // adjust the path if needed

export default function Budget({ spent, budget, username, accountName, onBudgetUpdate }) {
  const [currentBudget, setCurrentBudget] = useState(budget);
  const [showModal, setShowModal] = useState(false);
  const [tempBudget, setTempBudget] = useState(currentBudget);

  // Sync with budget prop changes
  useEffect(() => {
    setCurrentBudget(budget);
    setTempBudget(budget);
  }, [budget]);

  // Determine background color
  let bgColor = "border-green-400";
  const percent = spent / currentBudget;
  if (percent >= 1) bgColor = "border-red-400";
  else if (percent >= 0.75) bgColor = "border-yellow-400";

  // Handle save from modal
  const handleSave = async () => {
    if (!isNaN(tempBudget) && Number(tempBudget) >= 0) {
      try {
        // Update backend
        await Facade.setBudget(username, accountName, Number(tempBudget));

        // Update local state
        setCurrentBudget(Number(tempBudget));
        setShowModal(false);

        // Notify parent Dashboard to update budget state
        if (onBudgetUpdate) onBudgetUpdate(Number(tempBudget));
      } catch (error) {
        console.error("Error updating budget:", error);
      }
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border ${bgColor} shadow-md`}
      style={{ backgroundColor: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }}
    >
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Monthly Budget</h2>

      <p className="text-2xl font-bold text-gray-900">${spent?.toLocaleString() ?? 0}</p>
      <p className="text-sm text-gray-700 mb-4">of ${budget?.toLocaleString() ?? "0"} budget</p>

      <button onClick={() => setShowModal(true)} className="btn-green">
        Change Budget Amount for {accountName}
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Change Budget</h3>
            <input
              type="number"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="input-field w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="btn-purple">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-green">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
