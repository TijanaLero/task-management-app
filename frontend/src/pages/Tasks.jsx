import { useEffect, useState } from "react";
import api from "../api/axios";
import { Filter } from "lucide-react";
import ItemCard from "../components/ItemCard";
import ModalForm from "../components/ModalForm";
import { useSearchParams } from "react-router-dom";
import "../App.css";
import usePaginatedFetch from "../hooks/usePaginatedFetch";

export default function Tasks() {
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);                                                        
  const [searchParams] = useSearchParams();
  const [lists, setLists] = useState([]);
  const [categories, setCategories] = useState([]);
  const {
  data: tasks,
  currentPage,
  lastPage,
  fetchData,
} = usePaginatedFetch();

  const listId = searchParams.get("list_id");

  const fetchTasks = (page = 1) => {
  let url = listId
    ? `/task-lists/${listId}/tasks`
    : `/tasks/search`;

  if (!listId) {
    if (status !== "all") url += `?status=${status}`;
    if (priority !== "all") url += `${url.includes("?") ? "&" : "?"}priority=${priority}`;
  }

  fetchData(url, page, (res) => res.data.data);
};

  useEffect(() => {
  }, [listId, status, priority]);

  useEffect(() => {
    api.get("/task-lists").then((res) => setLists(res.data.data));
    api.get("/task-categories").then((res) => setCategories(res.data.data));
  }, []);




 const handleCreateOrUpdate = (data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged-in for this actions");
    return;
  }

const formattedData = {
  ...data,
  title: data.title?.trim() || "",
  description: data.description?.trim() || "",
  priority: data.priority || null,
  status: data.status || null,
  deadline: data.deadline ? new Date(data.deadline).toISOString().split("T")[0] : null,
  estimated_hours: data.estimated_hours ? Number(data.estimated_hours) : null,
  category_id: data.category_id ? Number(data.category_id) : null,
                                                                  //iz URLa
  task_list_id: data.task_list_id ? Number(data.task_list_id) : (listId ? Number(listId) : null),
};

console.log(" Šaljem na backend:", formattedData);

const req = editTask
  ? api.put(`/tasks/${editTask.id}`, formattedData)
  : api.post("/tasks", formattedData);


  req
    .then(() => { 
      fetchTasks(currentPage);
      setShowModal(false);
      setEditTask(null);
    })
    .catch((err) => {
      if (err.response?.status === 401) {
        alert("You must be logged in!");
        localStorage.removeItem("token");
        window.location.href = "/login"; 
      } else {
        console.error("Error occured:", err);
      }
    });
};


  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    await api.delete(`/tasks/${id}`);
    fetchTasks(currentPage);
  } catch (err) {
    if (err.response?.status === 401) {
      alert("You must be logged!");
    } else {
      console.error("Error:", err);
    }
  }
};


const handleExport = async () => {
  try {
    const response = await api.get("/tasks/export", {
      responseType: "blob", 
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tasks_export.csv");
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(" Greška pri izvozu:", error);
    alert("Error occured during export!");
  }
};


  // --- Render ---
  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="font-bold text-white mb-6" style={{ fontSize: "2rem" }}>
          {listId ? "Tasks in list" : "All tasks"}
        </h1>

        {/* Filteri */}
        <div className="filters">
          <div className="filter-group">
            <Filter size={16} color="#ff8fa3" />

            <select
              className="filter-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All status</option>
              <option value="started">Started</option>
              <option value="in progress">In Progress</option>
              <option value="finished">Finished</option>
            </select>

            <select
              className="filter-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          
        </div>

        {/* Dugme za dodavanje zadatka */}
        <button className="pink-btn" onClick={() => setShowModal(true)}>
          + Add task
        </button>
      </div>

      {/* Lista zadataka */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>There is no tasks to show.</p>
        ) : (
          tasks.map((task) => (
            <ItemCard
              key={task.id}
              title={task.title}
              subtitle={
                <>
                  Priority:{" "}
                  <span
                    className={`task-priority ${
                      task.priority === "emergency" ? "emergency" : ""
                    }`}
                  >
                    {task.priority
                      ? task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)
                      : "N/A"}
                  </span>{" "}
                  | Status: {task.status || "N/A"}
                </>
              }
              description={`Deadline: ${task.deadline || "There`s no deadline"}`}
              onEdit={() => {
  const taskData = {
    ...task,
    category_id: task.category_id || task.category?.id || "",
    task_list_id: task.task_list_id || task.taskList?.id || "",
    deadline: task.deadline ? task.deadline.split("T")[0] : "",
  };

  console.log(" Edit modal data:", taskData); 
  setEditTask(taskData);
  setShowModal(true);
}}

              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}
      </div>
{/*  Dugme za izvoz CSV-a */}
<div className="export-btn-container">
  <button className="pink-btn" onClick={handleExport}>
    📤 Get CSV
  </button>
</div>



      {/* Paginacija */}
      
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchTasks(currentPage - 1)}
          >
            ←
          </button>
          {[...Array(lastPage)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => fetchTasks(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === lastPage}
            onClick={() => fetchTasks(currentPage + 1)}
          >
            →
          </button>
        </div>
      

      {/* Modal za kreiranje/izmenu zadatka */}
      {showModal && (
        <ModalForm
          title={editTask ? "Edit task" : "New task"}
          fields={[
            {
              name: "title",
              label: "Title",
              type: "text",
              placeholder: "Title",
            },
            {
              name: "description",
              label: "Description",
              type: "text",
              placeholder: "Description",
            },
            {
              name: "priority",
              label: "Priority",
              type: "select",
              options: ["low", "medium", "high", "emergency"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["started", "in progress", "finished"],
            },
            { name: "deadline", label: "Deadline", type: "date" },
            {
              name: "estimated_hours",
              label: "Estimated hours",
              type: "number",
              placeholder: "example: 5",
            },
            {
  name: "category_id",
  label: "Category",
  type: "select",
  options: categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })),
},

    {
  name: "task_list_id",
  label: "List",
  type: "select",
  options: lists.map((list) => ({
    value: list.id,
    label: list.name || list.title || `Lista ${list.id}`,
  })),
initialValue: editTask?.task_list_id || "",

},

 ]}
          initialData={editTask || {}}
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
          }}
        />
  

      )}

      
    </div>
    
  );

}