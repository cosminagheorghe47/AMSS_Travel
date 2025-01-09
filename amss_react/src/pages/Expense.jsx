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

    const handleDeleteExpense = (expenseId) => {
        setExpenses((prevExpenses) => prevExpenses.filter((exp) => exp.id !== expenseId));
    };

    if (!groupDetails) return <p>Loading group details...</p>;

    return (
        <div>
            <h1>{groupDetails.name}</h1>
            <p><strong>Start Date:</strong> {new Date(groupDetails.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(groupDetails.endDate).toLocaleDateString()}</p>

            <button onClick={() => setIsFormOpen(true)}>Add Expense</button>

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
                onClose={() => setIsModalOpen(false)}
                onDelete={(expenseId) => {
                  setExpenses((prevExpenses) => prevExpenses.filter((exp) => exp.id !== expenseId));
                }}
              />
            )}
        </div>
    );
};

export default Expense;