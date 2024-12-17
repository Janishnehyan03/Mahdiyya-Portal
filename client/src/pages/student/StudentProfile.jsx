import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "../../Axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { UserAuthContext } from "../../context/userContext";

function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { authData } = useContext(UserAuthContext);

  const getStudent = async () => {
    try {
      let { data } = await Axios.get("/student/" + id);
      setStudent(data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res = await Axios.post("/student/admission/verify/" + id);
      if (res.status === 200) {
        setLoading(false);
        toast.success("Student Verified Successfully", {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        });
        navigate(-1);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong", {
        autoClose: 2000,
        position: toast.POSITION.TOP_CENTER,
      });
      console.log(error.response);
    }
  };
  const handleDelete = async (e, studentId) => {
    e.preventDefault();
    if (window.confirm("Do you want to delete the student")) {
      try {
        let res = await Axios.delete("/student/" + studentId);
        if (res.status === 200) {
          setLoading(false);
          toast.success("Student Deleted Successfully", {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          });
          navigate(-1);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong", {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        });
        console.log(error.response);
      }
    }
  };
  useEffect(() => {
    getStudent();
  }, []);
  return (
    <>
      <div className="w-full bg-gray-100">
        {showAlert && ConfirmAlert()}

        <section className="p-6">
          <div className="container mx-auto bg-white shadow-md rounded-md p-6">
            <header className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-800 uppercase">
                Student Profile
              </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Details */}
              <div className="bg-gray-50 p-4 shadow-sm rounded-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Details
                </h2>
                <div className="space-y-3">
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Student Name:
                    </span>
                    <span className="text-gray-800">{student.studentName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Register No:
                    </span>
                    <span className="text-gray-800">{student.registerNo}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Academic Year:
                    </span>
                    <span className="text-gray-800">
                      {student?.academicYear?.year}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      House Name:
                    </span>
                    <span className="text-gray-800">{student.houseName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Father's Name:
                    </span>
                    <span className="text-gray-800">{student.fatherName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">Phone:</span>
                    <span className="text-gray-800">+91 {student.phone}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Date of Birth:
                    </span>
                    <span className="text-gray-800">
                      {moment(student.dob).format("DD-MM-YYYY")}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">Place:</span>
                    <span className="text-gray-800">{student.place}</span>
                  </p>
                </div>
              </div>

              {/* Address Details */}
              <div className="bg-gray-50 p-4 shadow-sm rounded-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Address
                </h2>
                <div className="space-y-3">
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Post Office:
                    </span>
                    <span className="text-gray-800">{student.postOffice}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">Pincode:</span>
                    <span className="text-gray-800">{student.pinCode}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">District:</span>
                    <span className="text-gray-800">{student.district}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">State:</span>
                    <span className="text-gray-800">{student.state}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Study Center:
                    </span>
                    <span className="text-gray-800">
                      {student?.branch?.studyCentreName}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">Class:</span>
                    <span className="text-gray-800">
                      {student.class?.className}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="mt-6 bg-gray-50 p-4 shadow-sm rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-700">
                  Status:
                </span>
                {student?.verified ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                    Active
                  </span>
                ) : (
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAlert(true);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                  >
                    Not Verified
                  </span>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={(e) => handleDelete(e, student._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete Student
                </button>
              </div>
            </div>

            {authData?.role === "superAdmin" && (
              <footer className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Transfer Student
                </h3>
                <Link to={`/transfer-student/${student._id}`}>
                  <button className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition">
                    Go To Transfer Page
                    <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                  </button>
                </Link>
              </footer>
            )}
          </div>
        </section>
      </div>
    </>
  );

  function ConfirmAlert() {
    return (
      <div className="bg-gray-200 w-1/4 h-32  top-2 right-1/4 fixed">
        <div
          className="outline-none overflow-x-hidden overflow-y-auto"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog  w-auto pointer-events-none">
            <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-clip-padding rounded-md outline-none text-current">
              <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                <h5
                  className="text-xl font-medium leading-normal text-gray-800"
                  id="exampleModalLabel"
                >
                  Do you want to verify this student?
                </h5>
              </div>
              <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                <button
                  type="button"
                  className="inline-block px-6 py-2.5 bg-orange-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-orange-700 hover:shadow-lg focus:bg-orange-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-orange-800 active:shadow-lg transition duration-150 ease-in-out"
                  data-bs-dismiss="modal"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAlert(false);
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  className="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StudentProfile;
