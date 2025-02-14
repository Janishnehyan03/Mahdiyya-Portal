import React, { useState, useEffect, useCallback, useContext } from "react";
import Axios from "../../../Axios";
import { UserAuthContext } from "../../../context/userContext";
import Loading from "../../../components/Loading";
import { ExamContext } from "../../../context/examContext";
import { ClassContext } from "../../../context/classContext";
import * as XLSX from "xlsx"; // Import XLSX

function ResultView() {
  const { exams, getExams } = useContext(ExamContext);
  const { classes, getClasses } = useContext(ClassContext);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const [classId, setClassId] = useState(null);
  const [examId, setExamId] = useState(null);
  const [studyCentreId, setStudyCentreId] = useState(null);

  const [results, setResults] = useState([]);

  const { authData } = useContext(UserAuthContext);

  const getBranches = async () => {
    try {
      let { data } = await Axios.get(`/study-centre?sort=studyCentreName`);
      setBranches(data.docs);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getResults = useCallback(async () => {
    try {
      setLoading(true);
      let { data } = await Axios.get(
        `/cce?examId=${examId}&classId=${classId}&studyCentreId=${
          authData.role === "superAdmin" ? studyCentreId : authData.branch._id
        }`
      );
      setResults(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setResults([]);
      console.log(error.response);
    }
  }, [examId, classId, studyCentreId, authData?.branch?._id, authData.role]);

  useEffect(() => {
    getClasses();
    getBranches();
    getExams(true);
  }, []);

  useEffect(() => {
    if (examId && classId && (studyCentreId || authData.branch._id)) {
      getResults();
    }
  }, [examId, classId, studyCentreId, authData?.branch?._id, getResults]);

  const subjectNames = new Set();
  results.forEach((result) => {
    result.subjectResults.forEach((subjectResult) => {
      subjectNames.add(subjectResult.subject.subjectName);
    });
  });

  // Function to download results as Excel
  const downloadExcel = (branchName, className) => {
    const data = results.map((result) => {
      const row = {
        registerNo: result.student?.registerNo || "N/A",
        studentName: result.student?.studentName || "N/A",
      };

      subjectNames.forEach((subjectName) => {
        const subjectResult = result.subjectResults.find(
          (sr) => sr.subject.subjectName === subjectName
        );
        row[subjectName] = subjectResult ? subjectResult.cceMark : "-";
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, `${branchName}(${className}).xlsx`);
  };


  return (
    <div>
      <h1 className="text-3xl my-4 font-bold text-center">FA Results</h1>
      <div className="m-4">
        <select
          className="bg-gray-900 border border-gray-300 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block lg:w-1/2 w-full mx-auto my-2 p-2.5"
          onChange={(e) => setClassId(e.target.value)}
        >
          <option hidden>select class</option>
          {classes.map((item, key) => (
            <option key={key} value={item._id}>
              {item.className}
            </option>
          ))}
        </select>
        {authData.role === "superAdmin" && (
          <select
            className="bg-gray-900 border border-gray-300 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block lg:w-1/2 w-full mx-auto my-2 p-2.5"
            onChange={(e) => setStudyCentreId(e.target.value)}
          >
            <option hidden>select study centre</option>
            {branches.map((item, key) => (
              <option key={key} value={item._id}>
                {item.studyCentreName}
              </option>
            ))}
          </select>
        )}
        <select
          className="bg-gray-900 border border-gray-300 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block lg:w-1/2 w-full mx-auto my-2 p-2.5"
          onChange={(e) => setExamId(e.target.value)}
        >
          <option hidden>select exam</option>
          {exams.map((item, key) => (
            <option key={key} value={item._id}>
              {item.examName}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto m-10">
          {results.length > 0 && (
            <button
              onClick={() =>
                downloadExcel(
                  results[0].student?.branch?.studyCentreName,
                  results[0].student?.class?.className
                )
              }
              className="mb-4 bg-blue-600 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Download Excel
            </button>
          )}
          <table className="table-auto text-left w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Register No</th>
                <th>Student</th>
                {Array.from(subjectNames).map((subjectName) => (
                  <th key={subjectName}>{subjectName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {authData.role === "superAdmin"
                ? results
                    .filter((result) => result.student.branch._id === studyCentreId)
                    .map((result, index) => (
                      <ResultTableRow
                        key={index}
                        result={result}
                        index={index}
                        subjectNames={subjectNames}
                      />
                    ))
                : results
                    .filter(
                      (result) => result.student.branch._id === authData.branch._id
                    )
                    .map((result, key) => (
                      <ResultTableRow
                        key={key}
                        result={result}
                        index={key}
                        subjectNames={subjectNames}
                      />
                    ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ResultTableRow({ result, index, subjectNames }) {
  return (
    <tr key={index} className="border-b text-left border-neutral-200">
      <td className="text-sm">{index + 1}</td>
      <td className="text-sm">{result.student?.registerNo || ""}</td>
      <td className="text-sm">{result.student?.studentName}</td>
      {Array.from(subjectNames).map((subjectName) => {
        const subjectResult = result.subjectResults.find((sr) => {
          return sr.subject.subjectName === subjectName;
        });
        return (
          <td
            className={`whitespace-nowrap text-sm text-left px-6 py-4 ${
              subjectResult?.cceMark !== 1 ? "" : "bg-red-800"
            }`}
            key={subjectName}
          >
            {subjectResult ? `${subjectResult?.cceMark} ` : "-"}
          </td>
        );
      })}
    </tr>
  );
}

export default ResultView;
