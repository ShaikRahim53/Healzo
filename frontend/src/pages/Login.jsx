export default function Login() {
  return (
    <>
      <form className="form-container h-[100vh] flex flex-col justify-center items-center">
        <h2 className="heading-2 text-[20px] mb-3">Login</h2>
        <div className="main-container shadow-2xl w-[350px] h-[300px] border-none rounded-[12px]">
          <div className="email-container mb-4 ml-[30px] mt-8 ">
            <label className="email-label block mb-1 pl-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border outline-none border-[1px] w-[260px] border-gray-500 shadow:2xl rounded-[15px] p-1 pl-2 focus:border-[2px] focus:border-blue-500"
            ></input>
          </div>
          <div className="password-container mb-7 ml-[30px]">
            <label className="password-label block mb-1 pl-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="border outline-none border-[1px] w-[260px] border-gray-500  shadow:2xl rounded-[15px] p-1 pl-2 focus:border-[2px] focus:border-blue-500"
            ></input>
          </div>
          <div className="<button-container mb-4 ml-[20px]">
            <button className="button rounded-[15px] bg-blue-500 hover:bg-blue-600 p-1 px-3 w-[260px] ml-[10px] text-white">
              Login Up
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
