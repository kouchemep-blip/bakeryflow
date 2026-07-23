"use client";

import React, { useState } from "react";

export default function FormulaireConnexion() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
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
      email: "",
      password: "",
    });
  };

  return (
    <>
      <style>{`
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
          background-color: #090909ee;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100%;
        }

        .form-container {
          background-color: rgba(252, 250, 250, 0.144);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0px 0px 15px rgba(250, 249, 248, 0.806);
          width: 520px;
          text-align: center;
        }

        .form-container h2 {
          color: #fff;
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
          color: #fff;
          font-size: 18px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.5);
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
          width: 100%;
        }

        .submit-btn:hover {
          background: linear-gradient(90deg, #00ff80, #00ffff);
          box-shadow: 0 5px 15px #00ffff80;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="form-container">
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <h2>Connexion</h2>

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
                Connexion
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
