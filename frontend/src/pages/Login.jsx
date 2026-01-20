import { useState } from "react";
export default function Login() {
  //step -1 : create state variables for holding form data
  const [formData, setformData] = useState({
    email: "",
    password: "",
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
      newErrors.email = "Please enter the email";
    } else if (!regex.test(formData.email)) {
      newErrors.email = "email is not a valid one. Check once";
    } else {
      newErrors.email = "";
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
        <div className="login-successful">Login Successful</div>
      ) : (
        <form
          className="form-container h-[100vh] flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <h2 className="heading-2 text-[20px] mb-3">Login</h2>
          <div className="main-container shadow-2xl w-[330px] h-[360px] flex flex-col border-none rounded-[12px]">
            <div className="email-container mb-4 ml-[30px] mt-16">
              <label className="email-label block mb-1 pl-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`border outline-none border-[1px] w-[260px] ${errors.email ? "border-red-500" : "border-gray-500"} shadow:2xl rounded-[15px] p-1 pl-2 focus:border-[2px] focus:border-blue-500`}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              ></input>
              {errors.email && (
                <div className="error text-red-500 ml-2 text-[14px]">
                  {errors.email}
                </div>
              )}
            </div>
            <div className="password-container mb-7 ml-[30px]">
              <label className="password-label block mb-1 pl-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className={`border outline-none border-[1px] w-[260px] ${errors.password ? "border-red-500" : "border-gray-500"} shadow:2xl rounded-[15px] p-1 pl-2 focus:border-[2px] focus:border-blue-500`}
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
            <div className="<button-container mb-4 ml-[20px]">
              <button
                className="button rounded-[15px] bg-blue-500 hover:bg-blue-600 p-1 px-3 w-[260px] ml-[10px] text-white"
                type="submit"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
