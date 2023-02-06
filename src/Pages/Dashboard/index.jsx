import React from "react";
import { useState } from "react";
import "./style.css";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { MdMoreVert } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { useEffect } from "react";
import Pagination from "../../Components/Pagination";
import { useMemo } from "react";
import Sidebar from "../../Components/Sidebar";
import { collection, onSnapshot } from "firebase/firestore"
import db from "./../../firebase"

let PageSize = 10;

function Dashboard() {
  const [active, setActive] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);


  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, data]);


  useEffect(() => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      setData(snapshot.docs.map((doc) => doc.data()))
      localStorage.setItem("allUsers", JSON.stringify(snapshot.docs.map((doc) => doc.data())));
    });
    
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar
        active={active}
        open={open}
      />
      <div className="home_content container-table">
        <div className="nav-container">
          <div
            className="list-icon"
            onClick={() => {
              setActive(!active);
            }}
          >
            <MdMoreVert />
          </div>
          <span>Dashboard</span>
          <div className="menu-mobile" onClick={() => setOpen(!open)}>
            {!open && <AiOutlineMenu />}
            {open && <AiOutlineClose />}
          </div>
        </div>

        <div className="table-container">
          <div className="icon-container">
            <div className="world-icon">
              <TbWorld />
            </div>
            <div className="table-details">
              <table className="content-table table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData.map((user) => (
                    <tr key={user.uid}>
                      <td data-title="Name">{user.displayName}</td>

                      <td data-title="Email">{user.email}</td>
                      <td data-title="Type">{user.userType}</td>
                      <td data-title="Phone">{user.phone}</td>
                      <td data-title="Address">{user.address}</td>
                      <td data-title="Address">
                        {new Date(user.createdAt * 1000).toLocaleDateString(
                          "en-us",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={data.length}
                pageSize={PageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
