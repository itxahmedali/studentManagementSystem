import React, { useState, useEffect } from "react";
import Web3Modal from "web3Modal";
import { ethers } from "ethers";
import errorHandler from "../reusableComponents/ErrorHandler";
import { studentAddress, studentABI } from "./constants";
import axios from "axios";
import { showToast } from "../reusableComponents/Toaster";
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(studentAddress, studentABI, signerOrProvider);
export const AppContext = React.createContext();
export const AppProvider = ({ children }) => {
  const [studentAdd, setStudentAdd] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [studentById, setStudentById] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState(null);
  const [coursesList, setCoursesList] = useState([]);
  const [coursesListAdd, setCoursesListAdd] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [routes, setRoutes] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [teacherInfo, setTeacherInfo] = useState(null);
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
      getMyData(localToken);
    }
  }, [token]);
  useEffect(() => {
    if (token) {
      getStudents();
    }
  }, [studentAdd]);
  useEffect(() => {
    if (token) {
      getCourses();
    }
  }, [coursesList]);

  const errorMap = {
    "invalid BigNumber string":
      "Oops! The number you entered is not valid. Please enter a valid number and try again.",
    "invalid BigNumber value":
      "Oops! You didn't enter any number. Please enter a valid number and try again.",
    "cannot estimate gas; transaction may fail":
      "Oops! There was a problem estimating the gas required for the transaction. Please try again later or contact support for assistance.",
    "reverted with reason string":
      "Oops! The transaction was rejected. The reason given was: ",
    default:
      "Oops! An unknown error occurred. Please try again or contact support for assistance.",
  };
  useEffect(() => {
    if (error) {
      showToast(error, "error");
      setError(null);
    }
  }, [error]);

  const handleSignUp = async (name) => {
    const firstName = name?.split(" ")?.[0];
    axios
      .post("/api/signup", {
        name: firstName,
        role: "student",
      })
      .then(function (response) {
        console.log(response);
        setStudentInfo(response?.data);
      })
      .catch(function (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled");
        } else {
          console.log(error);
        }
      });
  };
  const getMyData = async (token) => {
    await axios
      .post("/api/mydata", { token: token })
      .then((res) => {
        setRoutes(res?.data?.routes);
        setUserName(res?.data?.name);
        if (currentAccount[0]) {
          getStudents();
          getCourses();
        }
        else{
          connectWallet();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // conntecting metamask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts) {
          setCurrentAccount(accounts[0]);
        } else {
          console.log("connect metamask Account");
        }
      } catch (error) {
        console.log(error);
        if (errorHandler(errorMap, error)) {
          setError(errorHandler(errorMap, error));
        }
      }
    }
  };
  const addStudent = async (data) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const createList = await contract.addStudent(
        data.name,
        data.studentaddress,
        data.age,
        data.number
      );
      createList.wait();
      if (createList) {
        setStudentAdd(true);
        handleSignUp(data.name);
      }
    } catch (error) {
      if (errorHandler(errorMap, error)) {
        setError(errorHandler(errorMap, error));
      }
      console.log(error);
    }
  };
  const getStudents = async () => {
    console.log("hello")
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const getAllAddress = await contract.getAllStudents();
      setStudentAdd(false);
      setStudentsList(getAllAddress);
    } catch (error) {
      console.log(error, "errors");
      if (errorHandler(errorMap, error)) {
        setError(errorHandler(errorMap, error));
      }
    }
  };
  const getStudent = async (id) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const student = await contract.getStudent(id);
      setStudentById(student);
    } catch (error) {
      console.log(error, "errors");
      if (errorHandler(errorMap, error)) {
        setError(errorHandler(errorMap, error));
      }
    }
  };
  const assignCourse = async (data) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const createList = await contract.assignCourse(data.id, data.course);
      createList.wait();
      if (createList) {
        // getStudents();
        getAssignCourses();
      }
    } catch (error) {
      console.log(error);
      if (errorHandler(errorMap, error)) {
        setError(errorHandler(errorMap, error));
      }
    }
  };
  const addGradeToCourse = async (data) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const createList = await contract.addGrades(
        data.id,
        data.grade,
        data.courseIndex
      );
      createList.wait();
      if (createList) {
        // getStudents();
      }
    } catch (error) {
      console.log(error);
      if (errorHandler(errorMap, error)) {
        setError(errorHandler(errorMap, error));
      }
    }
  };
  const markAttendanceToAssignedCourses = async (data) => {
    console.log(data);
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const createList = await contract.markAttendance(
        data.id,
        data.attendance,
        data.courseIndex
      );
      createList.wait();
      if (createList) {
        // getStudents();
      }
    } catch (error) {
      console.log(error);
      if (errorHandler(errorMap, error)) {
        setError(errorHandler(errorMap, error));
      }
    }
  };
  const getAssignCourses = async (id) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const courses = await contract.getAssignedCourses(id);
      setAssignedCourses(courses);
    } catch (error) {
      console.log(error, "errors");
      if (errorHandler(errorMap, error)) {
        setError(errorHandler(errorMap, error));
      }
    }
  };
  const addCourses = async (data) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const createList = await contract.addCourse(
        data.courseName,
        data.courseFee
      );
      createList.wait();
      if (createList) {
        getCourses();
        showToast("Course list updated", "success");
      }
    } catch (error) {
      console.log(error.message);
      if (errorHandler(errorMap, error)) {
        setError(errorHandler(errorMap, error));
      }
    }
  };
  const getCourses = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const courses = await contract.viewCourses();
      if (courses) {
        setCoursesList(courses);
      }
    } catch (error) {
      console.log(error, "errors");
      if (errorHandler(errorMap, error)) {
        setError(errorHandler(errorMap, error));
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        setToken,
        token,
        connectWallet,
        addStudent,
        currentAccount,
        studentsList,
        studentAdd,
        getStudent,
        getStudents,
        studentById,
        assignCourse,
        getAssignCourses,
        assignedCourses,
        setAssignedCourses,
        addGradeToCourse,
        markAttendanceToAssignedCourses,
        coursesList,
        addCourses,
        getCourses,
        error,
        setError,
        userName,
        setUserName,
        routes,
        setRoutes,
        studentInfo,
        teacherInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const ToDoListApp = () => {
  return <div>ToDoListApp</div>;
};

export default ToDoListApp;
