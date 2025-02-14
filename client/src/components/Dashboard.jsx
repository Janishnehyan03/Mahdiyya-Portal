import {
  faBook,
  faBookOpen,
  faBookOpenReader,
  faChalkboardTeacher,
  faChalkboardUser,
  faCheckDouble,
  faCheckToSlot,
  faDownload,
  faFileArchive,
  faGraduationCap,
  faMarker,
  faPenAlt,
  faSchool,
  faToolbox,
  faTools,
  faUpload,
  faUser,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "../Axios";
import { UserAuthContext } from "../context/userContext";

function Dashboard() {
  const [details, setDetails] = useState();
  const { authData } = useContext(UserAuthContext);
  const [branch, setBranch] = useState({});
  const [admissionCount, setAdmissionCount] = useState([]);

  const getAdmissions = async () => {
    try {
      let { data } = await Axios.post(
        `student?branch=${authData?.branch?._id}&verified=false`
      );
      setAdmissionCount(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const getBranch = async () => {
    try {
      let { data } = await Axios.get("/study-centre/" + authData.branch?._id);
      setBranch(data);
      let response = await Axios.get(
        "/study-centre/details/" + authData.branch?._id
      );
      setDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const SuperAdminItems = [
    {
      text: "STUDY CENTERS",
      icon: faSchool,
      link: "/study-centre-section",
    },
    {
      text: "STUDENTS",
      icon: faGraduationCap,
      link: "/all-centre-students",
    },
    {
      text: "SUBJECTS",
      icon: faBookOpenReader,
      link: "/all-subjects",
    },
    {
      text: "ALL TEACHERS",
      icon: faChalkboardTeacher,
      link: "/all-mahdiyya-teachers",
    },

    {
      text: "ADMISSION REQUESTS",
      icon: faBook,
      link: "/admission-requests",
    },
    {
      text: "CPET COURSES",
      icon: faBook,
      link: "/courses",
    },
    {
      text: "CLASS MANAGEMENT ",
      icon: faToolbox,
      link: "/class-management",
    },
    {
      text: "EXAMS",
      icon: faCheckToSlot,
      link: "/create-exam",
    },
    {
      text: "FA MARKS",
      icon: faBookOpen,
      link: "/view-cce-mark",
    },
    {
      text: "RESULTS",
      icon: faMarker,
      link: "/result-section",
    },
    {
      text: "TIMETABLES",
      icon: faFileArchive,
      link: "/timetables",
    },
    {
      text: "DOWNLOADS",
      icon: faDownload,
      link: "/downloads",
    },
    {
      text: "Configurations",
      icon: faTools,
      link: "/configurations",
    },
    {
      text: "Admission Management",
      icon: faUserGraduate,
      link: "/admission-management",
    },
    {
      text: "Previous Results",
      icon: faCheckDouble,
      link: "/previous-results",
    },
  ];
  const AdminItems = [
    {
      text: "STUDENTS",
      icon: faGraduationCap,
      link: "/all-classes",
    },
    {
      text: "TEACHERS",
      icon: faChalkboardUser,
      link: "/all-teachers",
    },
    {
      text: "Uploads",
      icon: faUpload,
      link: "/my-uploads",
    },
    {
      text: "New Admissions",
      icon: faBook,
      link: "/new-admissions",
    },
    {
      text: "Mark Entry",
      icon: faPenAlt,
      link: "/mark-entry",
    },
    {
      text: "Hall Tickets",
      icon: faFileArchive,
      link: "/hall-tickets",
    },

    {
      text: "Exam Results",
      icon: faCheckDouble,
      link: "/result-view",
    },
    {
      text: "Profile",
      icon: faUser,
      link: "/study-centre-profile/",
    },
    {
      text: "Previous Results",
      icon: faCheckDouble,
      link: "/previous-results/admin",
    },
  ];

  useEffect(() => {
    authData?.role === "admin" && getBranch();
    authData?.role === "admin" && getAdmissions();
  }, [authData]);
  return (
    <div className="w-full">
      {authData ? (
        <>
          {authData?.role === "admin" && (
            <div className="bg-gray-900 py-10">
              <h1 className="text-white text-center font-extrabold text-4xl uppercase">
                {branch?.studyCentreName}
              </h1>
            </div>
          )}

          {authData.role === "superAdmin" ? (
            <div className="py-10 bg-gray-800">
              <h2 className="text-center text-3xl font-semibold text-gray-300 mb-6">
                Super Admin Dashboard
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {SuperAdminItems.map((item, key) => (
                  <Link
                    to={item.link}
                    key={key}
                    className="group flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                  >
                    <div className="bg-gray-600 p-4 rounded-full">
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="text-white text-2xl"
                      />
                    </div>
                    <h1 className="mt-4 text-lg font-bold text-gray-200 group-hover:text-white">
                      {item.text}
                    </h1>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {AdminItems.map((item, key) => (
                  <Link
                    to={item.link}
                    key={key}
                    className="relative group flex flex-col items-center justify-center p-6 bg-[#1a2a3a] rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out"
                  >
                    {item.text === "Admission Requests" && (
                      <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                        {admissionCount}
                      </div>
                    )}
                    <div className="bg-[#2d3b4c] p-4 rounded-full shadow-md group-hover:bg-[#3e4a5c] transition-colors">
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="text-white text-2xl"
                      />
                    </div>
                    <h1 className="mt-4 text-lg font-semibold text-white group-hover:text-gray-300">
                      {item.text}
                    </h1>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default Dashboard;
