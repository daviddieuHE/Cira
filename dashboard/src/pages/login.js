import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useHistory } from "react-router-dom";
import { useState } from "react";

function Login() {
  const history = useHistory();

  const [err, setErr] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
      })
      .then(() => history.push("/dashboard"))
      .catch(() => {
        setErr(true);
      });
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form className="w-96 gap-4 flex flex-col" onSubmit={handleSubmit}>
        <div className="text-3xl font-bold mb-4">Login</div>
        <Input name="username" placeholder="Username" />
        <Input name="password" placeholder="Password" type="password" />
        {err && <span>Invalid credentials</span>}
        <Button className="mt-4" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
