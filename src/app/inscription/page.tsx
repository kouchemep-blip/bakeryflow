"use client";

import React, { useState } from "react";

export default function FormulaireAdhesion() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("../api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    console.log(data);
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  return (
    <>
      <head><style>{`
        @font-face {
          font-family: "Merienda";
          src: url(/Merienda/Merienda-VariableFont_wght.ttf) format(truetype);
        }

        .page-wrapper * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Courier New", Courier, monospace;
        }

        .page-wrapper {
          background-color: #07191E;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100%;
        }

        .form-container {
          background-color: #07191E;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0px 0px 15px #02F5A1;
          width: 520px;
          text-align: center;
        }

        .form-container h2 {
          color: #02F5A1;
          margin-bottom: 20px;
          font-family: "Merienda", sans-serif;
          letter-spacing: 2px;
          font-size: 1.85rem;
        }

        .input-box {
          position: relative;
          margin: 25px 0;
        }

        .input-box input {
          width: 100%;
          padding: 12px 15px;
          background: none;
          border: none;
          outline: none;
          color: #02F5A1;
          font-size: 18px;
          border-bottom: 2px solid #02F5A1;
          transition: 0.4s;
        }

        .input-box input:focus {
          border-color: #00ffff;
          box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
        }

        .input-box span {
          position: absolute;
          top: 50%;
          left: 15px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 16px;
          letter-spacing: 2px;
          font-family: "Courier New", Courier, monospace;
          pointer-events: none;
          transition: 0.4s;
          transform: translateY(-50%);
        }

        .input-box input:focus + span,
        .input-box input:not(:placeholder-shown) + span {
          top: 1px;
          font-size: 12px;
          color: #022b2bdd;
          font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
          letter-spacing: 2px;
          padding: 2px 6.5px;
          background-color: #00ffff89;
          border-radius: 50px;
        }

        .btn-container {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 10px;
        }

        .submit-btn {
          background: linear-gradient(90deg, #00ffff, #00ff80);
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          color: #000;
          font-weight: bold;
          cursor: pointer;
          transition: 0.4s;
        }

        .submit-btn:hover {
          background: linear-gradient(90deg, #00ff80, #00ffff);
          box-shadow: 0 5px 15px #00ffff80;
        }
      `}</style></head>

      <div className="page-wrapper">
        <div className="form-container">
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <h2>Adhésion</h2>

            <div className="input-box">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder=" "
              />
              <span>Prénom</span>
            </div>

            <div className="input-box">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder=" "
              />
              <span>Nom</span>
            </div>

            <div className="input-box">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
              />
              <span>Mail</span>
            </div>

            <div className="input-box">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=" "
              />
              <span>Numéro de téléphone</span>
            </div>

            <div className="input-box">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
              />
              <span>Mot de passe</span>
            </div>

            <div className="btn-container">
              <button type="submit" className="submit-btn">
                Envoyer
              </button>
              <button type="reset" className="submit-btn">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
