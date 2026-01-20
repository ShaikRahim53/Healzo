import { useState } from "react";
export default function SignUp() {
  //step -1 : create state variables for holding form data
  const [formData, setformData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [submitted, setSubmitted] = useState(false);

  //step-2 : create state variables for holding errors and to display them
  const [errors, setErrors] = useState({});

  //step-3 : handling event like changing inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setformData({
      ...formData,
      [name]: value,
    });
  };

  //step-4 : validating form
  const validateForm = () => {
    const newErrors = {};
    const regex = /\S+@\S+\.\S+/;
    if (!formData.email) {
      newErrors.email = "Pleae enter the email";
    } else if (!regex.test(formData.email)) {
      newErrors.email = "email is not a valid one. Check once";
    } else {
      newErrors.email = "";
    }
    if (!formData.username) {
      newErrors.username = "Please enter the username";
    } else if (formData.username.length < 6) {
      newErrors.username = "Username is not valid. Check once";
    }
    if (!formData.password) {
      newErrors.password = "Please enter the password";
    } else if (!formData.password.length < 6 || formData.password.length > 15) {
      newErrors.passwordlength1 = "password must have atleast 6 characters";
      newErrors.passwordlength2 = "password does not exceed 15 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please enter the confirm password";
    } else if (
      !formData.confirmPassword.length < 6 ||
      formData.confirmPassword.length > 15
    ) {
      newErrors.confirmPassword = "Confirm password is not valid. Check once";
    } else if (formData.confirmPassword !== formData.confirmPassword) {
      newErrors.confirmPassword =
        "Password and Confirm Password are not same. Check once";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //step-5 : handling event like submitting form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted succesfully...");
      setSubmitted(true);
    } else {
      console.log("Values are not valid. Please type valid inputs...");
    }
  };

  return (
    <div>
      {submitted ? (
        <div className="login-successful">SignUp Successful</div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center h-[100vh]"
        >
          <h2 className="heading-2 mb-3 text-2xl">Sign Up</h2>
          <div className="SignUp-Container shadow-2xl flex h-[80vh] justify-center items-center flex-col gap-3 w-[400px]">
            <div>
              <label className="label block mb-2">Email</label>
              <input
                className={`SignUp-Input shadow-md border ${errors.email ? "border-red-500" : "border-gray-500"} focus:outline-none focus:border-blue-500 focus:text-black rounded-3xl p-2 w-[300px] text-black`}
                placeholder="Enter your email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              ></input>
              {errors.email && (
                <div className="error text-red-500 ml-2 text-[14px]">
                  {errors.email}
                </div>
              )}
            </div>
            <div>
              <label className="label block mb-2">Username</label>
              <input
                className={`Username-Input shadow-md border ${errors.username ? "border-red-500" : "border-gray-500"} focus:outline-none focus:border-blue-500 focus:text-black rounded-3xl p-2 w-[300px] text-black`}
                placeholder="Create a username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              ></input>
              {errors.username && (
                <div className="error text-red-500 ml-2 text-[14px]">
                  {errors.username}
                </div>
              )}
            </div>
            <div>
              <label className="label block mb-2">Password</label>
              <input
                className={`Password-Input shadow-md border ${errors.password ? "border-red-500" : "border-gray-500"} focus:outline-none focus:border-blue-500 focus:text-black rounded-3xl p-2 w-[300px] text-black`}
                placeholder="Enter your password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              ></input>
              {errors.password && (
                <div className="error text-red-500 ml-2 text-[14px]">
                  {errors.password}
                </div>
              )}
              {errors.passwordlength1 && errors.passwordlength2 && (
                <div className="error ml-6">
                  <ol className="order-list list-disc">
                    <li className="list-item text-red-500 text-[14px]">
                      {errors.passwordlength1}
                    </li>
                    <li className="list-item text-red-500 text-[14px]">
                      {errors.passwordlength2}
                    </li>
                  </ol>
                </div>
              )}
            </div>
            <div>
              <label className="label block mb-2">Confirm Password</label>
              <input
                className={`ConfirmPassword-Input shadow-md border ${errors.confirmPassword ? "border-red-500" : "border-gray-500"} focus:outline-none focus:border-blue-500 focus:text-black rounded-3xl p-2 w-[300px] text-black`}
                placeholder="Confirm your password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              ></input>
              {errors.confirmPassword && (
                <div className="error text-red-500 ml-2 text-[14px]">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            <div>
              <button
                className="button bg-blue-500 w-[300px] text-white shadow-md hover:bg-blue-700 rounded-3xl p-2 mt-4"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
