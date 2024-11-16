import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminWrapper } from "@/pages/admin/admin.styles";
import { Error, Message } from "@/styles/elements";
import useForm from "@/hooks/use-form";
import { Errors, Messages, Request } from "@/types";
import api from "@/services/api";
import Loading from "@/components/loading/loading";

export default function Admin() {
  const [messages, setMessages] = React.useState<Messages>({});
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const [authenticating, setAuthenticating] = React.useState(true);

  const navigate = useNavigate();

  const requestRef = React.useRef<Request | null>(null);

  React.useEffect(() => {
    if (requestRef.current !== null) {
      requestRef.current.abort();
    }
    const req = api.get("/api/user");
    requestRef.current = req;
    req.send().then((res) => {
      if (res.status !== 200) {
        return setAuthenticating(false);
      }
      navigate("/streams");
    });
  }, [navigate]);

  const form = useForm(async (formData) => {
    if (submitting) return;
    setSubmitting(true);

    const errors: Errors = {};

    // Sanitise
    const email = String(formData.email ?? "").trim();
    const password = String(formData.password ?? "").trim();

    // Validate
    if (email.length === 0) {
      errors.email = "Enter your email";
    }
    if (!email.includes("@") || !email.match(/\..*$/)) {
      errors.email = "Enter a valid email";
    }
    if (password.length === 0) {
      errors.password = "Enter your password";
    }

    if (Object.keys(errors).length > 0) {
      setMessages({});
      setErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      const req = await api.post("/api/login/admin", { email, password });
      const res = await req.send();
      setMessages(res.messages);
      setErrors(res.errors);
      if (res.status === 200) {
        navigate("/streams");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  });

  if (authenticating) return <Loading />;

  return (
    <AdminWrapper>
      <h1>Admin Login</h1>

      <form onSubmit={form.onSubmit} noValidate>
        {messages.server && <Message>{messages.server}</Message>}
        {errors.server && <Error>{errors.server}</Error>}
        {errors.email && <Error>{errors.email}</Error>}
        {errors.password && <Error>{errors.password}</Error>}

        <input type="email" name="email" onChange={form.onChange} />
        <input type="password" name="password" onChange={form.onChange} />
        <button>{submitting ? "Logging in..." : "Login"}</button>
      </form>
    </AdminWrapper>
  );
}
