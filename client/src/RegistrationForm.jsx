import { useState } from "react";
import "./RegistrationForm.css";
const inputFields = [
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "age", label: "Age", type: "number" },
  { name: "phone", label: "Phone Number", type: "tel" },
  { name: "website", label: "Personal Website", type: "url" },
  { name: "dob", label: "Date of Birth", type: "date" },
  { name: "birthTime", label: "Time of Birth", type: "time" },
  { name: "birthMonth", label: "Birth Month", type: "month" },
  { name: "birthWeek", label: "Birth Week", type: "week" },
  {
    name: "gender",
    label: "Gender",
    type: "radio",
    options: ["Male", "Female", "Other"],
  },
  {
    name: "skills",
    label: "Skills",
    type: "checkbox",
    options: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    name: "course",
    label: "Course",
    type: "select",
    options: ["B.Tech", "B.Sc", "B.Com", "MBA"],
  },
  { name: "address", label: "Address", type: "textarea" },
  { name: "profilePic", label: "Profile Picture", type: "file" },
  { name: "satisfaction", label: "Satisfaction Level", type: "range" },
  { name: "favoriteColor", label: "Favorite Color", type: "color" },
  { name: "internalId", label: "", type: "hidden", value: "student-123" },
];

const RegistrationForm = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "checkbox") {
      const current = formData[name] || [];
      setFormData({
        ...formData,
        [name]: checked
          ? [...current, value]
          : current.filter((v) => v !== value),
      });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    // Optional: handle file upload separately
    if (formData.profilePic) {
      payload.profilePic = formData.profilePic.name;
    }

    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="registration-form">
      <form onSubmit={handleSubmit}>
        {inputFields.map((field) => {
          if (field.type === "hidden") {
            return (
              <input
                key={field.name}
                type="hidden"
                name={field.name}
                value={field.value}
              />
            );
          }

          return (
            <div key={field.name} className="form-group">
              {field.label && <label>{field.label}</label>}
              {field.type === "textarea" ? (
                <textarea name={field.name} onChange={handleChange} required />
              ) : field.type === "select" ? (
                <select name={field.name} onChange={handleChange} required>
                  <option value="">Select</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "radio" ? (
                <div className="radio-group">
                  {field.options.map((opt) => (
                    <div key={opt} className="radio-option">
                      <input
                        type="radio"
                        name={field.name}
                        value={opt}
                        onChange={handleChange}
                        required
                      />
                      <label>{opt}</label>
                    </div>
                  ))}
                </div>
              ) : field.type === "checkbox" ? (
                <div className="checkbox-group">
                  {field.options.map((opt) => (
                    <div key={opt} className="checkbox-option">
                      <input
                        type="checkbox"
                        name={field.name}
                        value={opt}
                        onChange={handleChange}
                      />
                      <label>{opt}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  onChange={handleChange}
                  required={field.type !== "file"}
                />
              )}
            </div>
          );
        })}
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
