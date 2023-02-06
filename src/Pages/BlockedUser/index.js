import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { MdMoreVert } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import axios from "axios";
import { useEffect } from "react";
import Pagination from "../../Components/Pagination";
import { useMemo } from "react";
import { useCallback } from "react";
import Sidebar from "../../Components/Sidebar";
import { collection, onSnapshot } from "firebase/firestore"
import db from "./../../firebase"

let PageSize = 10;

function BlockedUser() {
  const [active, setActive] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentDataOfUser, setCurrentDataOfUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [blockedUser, setBlockedUser] = useState([]);
  const [posts, setPosts] = useState([]);


  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return blockedUser.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, blockedUser]);

  const fetchData = useCallback(() => {
    const config = {
      headers: {
        Accept: "application/json",
      },
    };
    const response = axios
      .get(
        `https://sociallink-ab726-default-rtdb.firebaseio.com/users/${
          JSON.parse(localStorage.getItem("user")).uid
        }.json`,

        config
      )
      .then((res) => {
        setCurrentDataOfUser(res?.data);
      })
      .catch((err) => console.log(err));

    return response;
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  useEffect(() => {
    onSnapshot(collection(db, "blockedUser"), (snapshot) => {
      setBlockedUser(snapshot.docs.map((doc) => doc.data()))
    });
    
  }, []);

  function getBlockedBy(attributeId) {
    let result = JSON.parse(localStorage.getItem("allUsers")).find((x) => {
      return x.uid === attributeId;
    });
    if (result) {
      return result["displayName"];
    } else {
      return "";
    }
  }

  function getBlockedTo(attributeId) {
    let result = JSON.parse(localStorage.getItem("allUsers")).find((x) => {
      return x.uid === attributeId;
    });
    if (result) {
      return result["displayName"];
    } else {
      return "";
    }
  }



  return (
    <div className="dashboard-container">
      <Sidebar
        currentDataOfUser={currentDataOfUser}
        active={active}
        open={open}
      />
      <div className="home_content container-table">
        <div className="nav-container">
          <div className="list-icon" onClick={() => setActive(!active)}>
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
            <div style={{ top: "-4%" }} className="world-icon">
              <TbWorld />
            </div>
            <div className="table-details">
              <table className="content-table table">
                <thead>
                  <tr>
                    <th className="text-left">Blocked By</th>
                    <th className="text-left">Blocked To</th>
                    <th className="text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {blockedUser?.map((user) => (
                    <tr key={user.id}>
                      <td className="text-left" data-title="Name">
                    {getBlockedBy(user.blockedBy)}
                      </td>

                      <td className="text-left" data-title="Email">
                      {getBlockedTo(user.blockedTo)}
                      </td>
                    
                      <td className="text-left" data-title="Date">
                       
                          {new Date(user.timestamp * 1000).toLocaleDateString(
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

              {currentTableData.length > 10 && (
                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={data.length}
                  pageSize={PageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockedUser;
