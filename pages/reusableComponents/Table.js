import React from "react";
import {
  faEye,
  faEdit,
  faBook,
  faClipboardUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MDBDataTable } from "mdbreact";
import { useRouter } from "next/router";
import { Tooltip as ReactTooltip } from "react-tooltip";
const Table = ({
  list,
  setId,
  setShowModal,
  getAssignCourses,
  setModalType,
  type
}) => {
  const router = useRouter();
  const Action = (id, type) => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            cursor: "pointer",
            color: "#fff",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          // onClick={() => history.push(`/students/student/${id}`)}
        >
          {
            type== 'addCourse' ?
            null
          //   <FontAwesomeIcon
          //   id={"courses"+id}
            // data-tooltip-content="Click to edit course"
          //   icon={faEdit}
          //   onClick={() => {
          //     getAssignCourses(id);
          //     setModalType("editCourse");
          //     setShowModal(true), setId(id);
          //   }}
          //   className="me-3"
          // />
            : 
            <>
          <FontAwesomeIcon
            id={"courses"+id}
            data-tooltip-content="Click to add courses"
            icon={faBook}
            onClick={() => {
              getAssignCourses(id);
              setModalType("courses");
              setShowModal(true), setId(id);
            }}
            className="me-3"
          />
          <FontAwesomeIcon
            id={"grades"+id}
            data-tooltip-content="Click to add grades"
            icon={faClipboardUser}
            className="me-3"
            onClick={() => {
              getAssignCourses(id);
              setModalType("grades");
              setShowModal(true), setId(id);
            }}
          />
          <FontAwesomeIcon
            id={"attendance"+id}
            data-tooltip-content="Click to mark attendance"
            icon={faEdit}
            className="me-3"
            onClick={() => {
              getAssignCourses(id);
              setModalType("attendance");
              setShowModal(true), setId(id);
            }}
          />
          <FontAwesomeIcon
            id={"profile"+id}
            data-tooltip-content="Click to view profile"
            onClick={() =>
              router.push({ pathname: "/students/student", query: { id: id } })
            }
            icon={faEye}
          />
            </>
          }
          <ReactTooltip anchorId={"attendance"+id} />
          <ReactTooltip anchorId={"profile"+id} />
          <ReactTooltip anchorId={"grades"+id} />
          <ReactTooltip anchorId={"courses"+id} />
        </div>
      </div>
    );
  };
  var data
  if(type == "addCourse"){
    data = {
      columns: [
        {
          label: "Id",
          field: "id",
          sort: "asc",
          width: 150,
        },
        {
          label: "Course Name",
          field: "courseName",
          sort: "asc",
          width: 150,
        },
        {
          label: "Fees",
          field: "fees",
          sort: "asc",
          width: 100,
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
          width: 100,
        },
      ],
      rows: [],
    };
    list?.map((e, index) => {
      data.rows?.push({
        id: e?.id?.toString(),
        courseName: e?.name,
        fees: e?.fee?.toString(),
        actions: Action(e?.id?.toString(),'addCourse'),
      });
    });
  }
  else{
    data = {
      columns: [
        {
          label: "Id",
          field: "id",
          sort: "asc",
          width: 150,
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
          width: 150,
        },
        {
          label: "Address",
          field: "address",
          sort: "asc",
          width: 270,
        },
        {
          label: "Age",
          field: "age",
          sort: "asc",
          width: 200,
        },
        {
          label: "Number",
          field: "number",
          sort: "asc",
          width: 100,
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
          width: 100,
        },
      ],
      rows: [],
    };
    list?.map((e, index) => {
      data.rows?.push({
        id: e?.id?.toString(),
        name: e?.name,
        address: e?.studentaddress,
        age: e?.age?.toString(),
        number: e?.number?.toString(),
        actions: Action(e?.id?.toString(),null),
      });
    });
  }

  

  return (
    <div className="table-responsive">
      <MDBDataTable noBottomColumns={true} responsive bordered data={data} />
    </div>
  );
};

export default Table;
