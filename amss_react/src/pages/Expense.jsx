import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseDetails from "../components/ExpenseDetails";

const Expense = () => {
    const { groupId } = useParams();
    const [groupDetails, setGroupDetails] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isIndividualReportOpen, setIsIndividualReportOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchGroupInfo = async () => {
            try {
                const groupResponse = await fetch(`/api/groups/${groupId}`);
                const groupData = await groupResponse.json();
                setGroupDetails(groupData);

                const expensesResponse = await fetch(`/api/expenses/group/${groupId}`);
                const expensesData = await expensesResponse.json();
                console.log("expensesData ", expensesData);
                
                setExpenses(expensesData);
            } catch (error) {
                console.error("Error fetching group details or expenses:", error);
            }
        };

        fetchGroupInfo();
    }, [groupId]);

    const handleAddExpense = (newExpense) => {
        setExpenses((prev) => [...prev, newExpense]);
        setIsFormOpen(false);
    };

    const handleCloseModal = (updatedExpense) => {
        setIsModalOpen(false);
      
        if (updatedExpense) {
          setExpenses((prevExpenses) =>
            prevExpenses.map((exp) =>
              exp.id === updatedExpense.id ? updatedExpense : exp
            )
          );
        }
      };
      

    const handleDeleteExpense = (expenseId) => {
        setExpenses((prevExpenses) => prevExpenses.filter((exp) => exp.id !== expenseId));
    };

    const calculateTotalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
    };

    const calculateIndividualExpenses = () => {
        return expenses
            .filter((expense) => expense.type === "INDIVIDUAL")
            .reduce((total, expense) => total + expense.amount, 0)
            .toFixed(2);
    };

    if (!groupDetails) return <p>Loading group details...</p>;

    return (
        <div>
            <h1>{groupDetails.name}</h1>
            <p><strong>Description:</strong> {groupDetails.description}</p>
            <p><strong>Start Date:</strong> {new Date(groupDetails.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(groupDetails.endDate).toLocaleDateString()}</p>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setIsFormOpen(true)}>Add Expense</button>
                <button onClick={() => setIsReportOpen(true)}>View Total Expenses</button>
                <button onClick={() => setIsIndividualReportOpen(true)}>View Individual Expenses</button>
            </div>

            {isFormOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <ExpenseForm
                            groupDetails={groupDetails}
                            onClose={() => setIsFormOpen(false)}
                            onAddExpense={handleAddExpense}
                        />
                    </div>
                </div>
            )}

            {isReportOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Total Expenses Report</h3>
                        <p><strong>Total Amount Spent:</strong> {calculateTotalExpenses()} RON</p>
                        <button onClick={() => setIsReportOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            {isIndividualReportOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Individual Expenses Report</h3>
                        <p><strong>Total Amount Spent on Individual Expenses:</strong> {calculateIndividualExpenses()} RON</p>
                        <button onClick={() => setIsIndividualReportOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            <ExpenseList 
                expenses={expenses} 
                onExpenseClick={(expense) => {
                    setSelectedExpense(expense);
                    setIsModalOpen(true);
                }} 
                onDeleteExpense={handleDeleteExpense}
            />

            {isModalOpen && selectedExpense && (
                <ExpenseDetails
                    expense={selectedExpense}
                    onClose={(updatedExpense) => handleCloseModal(updatedExpense)}
                    onDelete={(expenseId) => {
                        setExpenses((prevExpenses) => prevExpenses.filter((exp) => exp.id !== expenseId));
                    }}
                />
            )}
        </div>
    );
};

export default Expense;
