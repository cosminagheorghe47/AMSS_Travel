import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";


const Expense = () => {
    const { groupId } = useParams();
    console.log("Group ID from URL:", groupId);
    const [groupDetails, setGroupDetails] = useState(null);
    const [expenses, setExpenses] = useState([]); 
    const [isFormOpen, setIsFormOpen] = useState(false);

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
      
    if (!groupDetails) return <p>Loading group details...</p>;
    
  
    return (
      <div>
        <h1>{groupDetails.name}</h1>
        <p><strong>Description:</strong> {groupDetails.description}</p>
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
  
        <ExpenseList expenses={expenses} />
      </div>
    );
  };

export default Expense;