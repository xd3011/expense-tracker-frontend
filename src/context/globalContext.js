import React, { useContext, useState } from "react";
import axios from 'axios';
import AuthService from "../services/auth.service";

const BASE_URL = "http://localhost:5000/api/v1/";
const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const currentUser = AuthService.getCurrentUser();
    const accessToken = AuthService.getAccessToken();
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    console.log(currentUser);
    // calculate incomes
    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${BASE_URL}${currentUser}/add-income`, income, {
                headers: {
                    'token': accessToken
                }
            });
            // In ra phản hồi từ máy chủ
            console.log(response);
    
            getIncomes();
        } catch (err) {
            setError(err.response.data.message);
        }
    }

    const getIncomes = async () => {
        const response = await axios.get(`${BASE_URL}${currentUser}/get-incomes`, {
            headers: {
                'token': accessToken
            }
        });
        setIncomes(response.data);
        console.log(response.data);
    }

    const deleteIncome = async (id) => {
        const res = await axios.delete(`${BASE_URL}${currentUser}/delete-income/${id}`, {
            headers: {
                'token': accessToken
            }
        });
        getIncomes();
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) => {
            totalIncome = totalIncome + income.amount;
        })

        return totalIncome;
    }

    // calculate expenses
    const addExpense = async (expense) => {
        const response = await axios.post(`${BASE_URL}${currentUser}/add-expense`, expense, {
            headers: {
                'token': accessToken
            }
        }).catch((err) => {
            setError(err.response.data.message);
        });
        getExpenses();
    }

    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL}${currentUser}/get-expenses`, {
            headers: {
                'token': accessToken
            }
        });
        setExpenses(response.data);
        console.log(response.data);
    }

    const deleteExpense = async (id) => {
        const res = await axios.delete(`${BASE_URL}${currentUser}/delete-expense/${id}`, {
            headers: {
                'token': accessToken
            }
        });
        getExpenses();
    }

    const totalExpenses = () => {
        let totalExpense = 0;
        expenses.forEach((expense) => {
            totalExpense = totalExpense + expense.amount;
        })

        return totalExpense;
    }

    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        })

        return history.slice(0, 3);
    }

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}
