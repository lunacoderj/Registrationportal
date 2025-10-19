import { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/register");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d)) return "";
    return d.toLocaleDateString();
  };

  const formatSkills = (skills) => {
    if (!skills) return "";
    return Array.isArray(skills) ? skills.join(", ") : String(skills);
  };

  const display = (v) => {
    // show 0, false, etc. but hide undefined/null/empty-string
    if (v === 0 || v === false) return v;
    return v ? v : "";
  };

  // Calculate statistics
  const calculateStats = () => {
    if (students.length === 0) {
      return {
        total: 0,
        averageAge: 0,
        popularCourse: "",
        averageSatisfaction: 0,
      };
    }

    // Calculate average age
    const totalAge = students.reduce(
      (acc, s) => acc + (parseInt(s.age) || 0),
      0
    );
    const averageAge = Math.round(totalAge / students.length);

    // Calculate most popular course
    const courseCounts = students.reduce((acc, s) => {
      const course = s.course || "";
      if (!course) return acc;
      acc[course] = (acc[course] || 0) + 1;
      return acc;
    }, {});
    const popularCourse =
      Object.entries(courseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    // Calculate average satisfaction
    const totalSatisfaction = students.reduce(
      (acc, s) => acc + (parseInt(s.satisfaction) || 0),
      0
    );
    const averageSatisfaction = Math.round(totalSatisfaction / students.length);

    return {
      total: students.length,
      averageAge,
      popularCourse,
      averageSatisfaction,
    };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard">
      <h2>📋 Registered Students</h2>
      {loading ? (
        <p className="status">Loading...</p>
      ) : students.length === 0 ? (
        <p className="status">No registrations yet.</p>
      ) : (
        <>
          {/* Student Details Modal */}
          {selectedStudent && (
            <div
              className="modal-overlay"
              onClick={() => setSelectedStudent(null)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Student Details</h3>
                  <button
                    className="close-button"
                    onClick={() => setSelectedStudent(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="student-details">
                  <div className="detail-section">
                    <h4>Personal Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Full Name:</label>
                        <span>{display(selectedStudent.fullName)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Email:</label>
                        <span>{display(selectedStudent.email)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Password:</label>
                        <span className="password-field">
                          {selectedStudent.password ? "••••••••" : ""}
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Age:</label>
                        <span>{display(selectedStudent.age)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Gender:</label>
                        <span>{display(selectedStudent.gender)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Phone:</label>
                        <span>{display(selectedStudent.phone)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Birth Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Date of Birth:</label>
                        <span>{formatDate(selectedStudent.dob)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Time of Birth:</label>
                        <span>{display(selectedStudent.birthTime)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Birth Month:</label>
                        <span>{display(selectedStudent.birthMonth)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Birth Week:</label>
                        <span>{display(selectedStudent.birthWeek)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Education & Skills</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Course:</label>
                        <span>{display(selectedStudent.course)}</span>
                      </div>
                      <div className="detail-item full-width">
                        <label>Skills:</label>
                        <span>{formatSkills(selectedStudent.skills)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Additional Information</h4>
                    <div className="detail-grid">
                      {selectedStudent.website ? (
                        <div className="detail-item full-width">
                          <label>Personal Website:</label>
                          <span>
                            <a
                              href={selectedStudent.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {selectedStudent.website}
                            </a>
                          </span>
                        </div>
                      ) : null}

                      <div className="detail-item full-width">
                        <label>Address:</label>
                        <span>{display(selectedStudent.address)}</span>
                      </div>

                      {selectedStudent.profilePic ? (
                        <div className="detail-item">
                          <label>Profile Picture:</label>
                          <span>
                            <img
                              src={selectedStudent.profilePic}
                              alt="Profile"
                              className="profile-pic"
                            />
                          </span>
                        </div>
                      ) : null}

                      <div className="detail-item">
                        <label>Satisfaction Level:</label>
                        <span>
                          {selectedStudent.satisfaction !== undefined &&
                          selectedStudent.satisfaction !== null
                            ? `${selectedStudent.satisfaction}/100`
                            : ""}
                        </span>
                      </div>

                      <div className="detail-item">
                        <label>Favorite Color:</label>
                        <span className="color-with-swatch">
                          {selectedStudent.favoriteColor ? (
                            <>
                              <span
                                className="color-swatch-large"
                                style={{
                                  backgroundColor:
                                    selectedStudent.favoriteColor,
                                }}
                              ></span>
                              {selectedStudent.favoriteColor}
                            </>
                          ) : (
                            ""
                          )}
                        </span>
                      </div>

                      <div className="detail-item">
                        <label>Internal ID:</label>
                        <span>{display(selectedStudent.internalId)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Table View */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Course</th>
                  <th>Skills</th>
                  <th>DOB</th>
                  <th>Website</th>
                  <th>Satisfaction</th>
                  <th>Favorite Color</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const sat = Number(s.satisfaction) || 0;
                  return (
                    <tr key={s._id} className="student-row">
                      <td className="student-name">{display(s.fullName)}</td>
                      <td className="student-email">{display(s.email)}</td>
                      <td className="student-age">{display(s.age)}</td>
                      <td className="student-phone">{display(s.phone)}</td>
                      <td className="student-gender">{display(s.gender)}</td>
                      <td className="student-course">{display(s.course)}</td>
                      <td className="student-skills">
                        {formatSkills(s.skills)}
                      </td>
                      <td className="student-dob">{formatDate(s.dob)}</td>
                      <td className="student-website">
                        {s.website ? (
                          <a
                            href={s.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit
                          </a>
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="student-satisfaction">
                        <div className="satisfaction-bar">
                          <div
                            className="satisfaction-fill"
                            style={{ width: `${sat}%` }}
                          ></div>
                          <span>
                            {s.satisfaction !== undefined &&
                            s.satisfaction !== null
                              ? `${s.satisfaction}%`
                              : ""}
                          </span>
                        </div>
                      </td>
                      <td className="student-color">
                        {s.favoriteColor ? (
                          <span
                            className="color-swatch"
                            style={{ backgroundColor: s.favoriteColor }}
                            title={s.favoriteColor}
                          ></span>
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="student-actions">
                        <button
                          className="view-details-btn"
                          onClick={() => setSelectedStudent(s)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Students</h3>
              <span className="stat-number">{stats.total}</span>
            </div>
            <div className="stat-card">
              <h3>Average Age</h3>
              <span className="stat-number">{stats.averageAge}</span>
            </div>
            <div className="stat-card">
              <h3>Most Popular Course</h3>
              <span className="stat-number">{stats.popularCourse}</span>
            </div>
            <div className="stat-card">
              <h3>Average Satisfaction</h3>
              <span className="stat-number">{stats.averageSatisfaction}%</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
