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
import Swal from "sweetalert2";
import { collection, onSnapshot, deleteDoc, doc, Firestore } from "firebase/firestore"
import db from "./../../firebase"

let PageSize = 10;

function ReportedPosts() {
  const [active, setActive] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentDataOfUser, setCurrentDataOfUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPosts, setReportsPost] = useState([]);
  const [posts, setPosts] = useState([]);


  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return reportsPosts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, reportsPosts]);

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
    onSnapshot(collection(db, "reportedPost"), (snapshot) => {
      setReportsPost(snapshot.docs.map((doc) => doc.data()))
    });
    
  }, []);



  useEffect(() => {
    onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(snapshot.docs.map((doc) => doc.data()))
    });
  }, []);

  function getItemNameById(attributeId) {
    let result = JSON.parse(localStorage.getItem("allUsers")).find((x) => {
      return x.uid === attributeId;
    });
    if (result) {
      return result["displayName"];
    } else {
      return "";
    }
  }

  const onDeleteExpenseHandler = async (firebase_id) => {
    await Swal.fire({
      title: "",
      text: "Are you sure you want to Delete?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        const filteredExpense = reportsPosts?.filter(
          (item) => item.id !== firebase_id
        );
        setReportsPost(filteredExpense);
        deleteDoc(doc(db, "reportedPost", `${firebase_id}`));
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  function getStoryById(attributeId) {
    let result = posts.find((x) => {
      return x.id === attributeId;
    });
    if (result) {
      return result["description"];
    } else {
      return "";
    }
  }

  function getAuthorStoryById(attributeId) {
    let result = posts.find((x) => {
      return x.id === attributeId;
    });
    if (result) {
      let newResult = JSON.parse(localStorage.getItem("allUsers")).find((x) => {
        return x.uid === result["uid"];
      });
      return newResult["displayName"];
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
                    <th>UserName</th>
                    <th>Post</th>
                    <th>Author</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsPosts?.map((user) => (
                    <tr key={user.id}>
                      <td data-title="Name">
                        <p>{getItemNameById(user.uid)}</p>
                      </td>

                      <td data-title="Email">
                        <p>{getStoryById(user.postId)}</p>
                      </td>
                      <td data-title="Type">
                        <p>{getAuthorStoryById(user.postId)}</p>
                      </td>
                      <td data-title="Phone">
                        <p>{user.content}</p>
                      </td>
                      <td data-title="Address">
                        <p>
                          {" "}
                          {new Date(user.timestamp * 1000).toLocaleDateString(
                            "en-us",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </td>
                      <td data-title="Actions">
                        <div
                          className="close-icon"
                          onClick={() => {
                            onDeleteExpenseHandler(user.id);
                          }}
                        >
                          <AiOutlineClose />
                        </div>
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

export default ReportedPosts;
