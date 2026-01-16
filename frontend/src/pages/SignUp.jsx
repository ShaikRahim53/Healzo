export default function SignUp() {
  const handleSubmit = () => {
    console.log("handled form");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row justify-center items-center bg-red-500 h-[100vh]"
      >
        <div className="SignUp-Container flex h-[70vh] justify-center items-center flex-col gap-3 bg-yellow-500 w-[400px]">
          <div>
            <label className="label block mb-2">Email</label>
            <input
              className="SignUp-Input shadow-md border border-gray-100 focus:outline-none focus:border-blue-500 focus:text-black rounded-3xl p-2 w-[300px] text-gray-300"
              placeholder="Enter your email"
              name="emain"
              type="email"
            ></input>
          </div>
          <div>
            <label className="label block mb-2">Username</label>
            <input
              className="Username-Input shadow-md border border-gray-100 focus:outline-none focus:border-blue-500 focus:text-black rounded-3xl p-2 w-[300px] text-gray-300"
              placeholder="Create a username"
              type="text"
            ></input>
          </div>
          <div>
            <label className="label block mb-2">Password</label>
            <input
              className="Password-Input shadow-md border border-gray-100 focus:outline-none focus:border-blue-500 focus:text-black rounded-3xl p-2 w-[300px] text-gray-300"
              placeholder="Enter your password"
              type="text"
            ></input>
          </div>
          <div>
            <label className="label block mb-2">Confirm Password</label>
            <input
              className="ConfirmPassword-Input shadow-md border border-gray-100 focus:outline-none focus:border-blue-500 focus:text-black rounded-3xl p-2 w-[300px] text-gray-300"
              placeholder="Confirm your password"
              type="text"
            ></input>
          </div>
          <div>
            <button
              className="button bg-blue-500 w-[300px] text-white shadow-md hover:bg-blue-700 rounded-3xl p-2 p-2"
              type="button"
              onChange={() => {}}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
