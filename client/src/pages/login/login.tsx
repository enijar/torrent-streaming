import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginWrapper } from "@/pages/login/login.styles";
import { Message, Error } from "@/styles/elements";
import useForm from "@/hooks/use-form";
import { Messages, Errors } from "@/types";
import api from "@/services/api";
import Loading from "@/components/loading/loading";

export default function Login() {
  const [messages, setMessages] = React.useState<Messages>({});
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const [authenticating, setAuthenticating] = React.useState(true);

  const navigate = useNavigate();

  React.useEffect(() => {
    api
      .get("/api/user")
      .then((res) => {
        if (res.status !== 200) {
          return setAuthenticating(false);
        }
        navigate("/streams");
      })
      .catch(() => {
        setAuthenticating(false);
      });
  }, [navigate]);

  const form = useForm(async (formData) => {
    if (submitting) return;
    setSubmitting(true);

    const errors: Errors = {};

    // Sanitise
    const email = String(formData.email ?? "").trim();

    // Validate
    if (email.length === 0) {
      errors.email = "Enter your email";
    }
    if (!email.includes("@") || !email.match(/\..*$/)) {
      errors.email = "Enter a valid email";
    }

    if (Object.keys(errors).length > 0) {
      setMessages({});
      setErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post("/api/login", { email });
      setMessages(res.messages);
      setErrors(res.errors);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  });

  if (authenticating) return <Loading />;

  return (
    <LoginWrapper>
      <h1>Login</h1>

      <form onSubmit={form.onSubmit} noValidate>
        {messages.server && <Message>{messages.server}</Message>}
        {errors.server && <Error>{errors.server}</Error>}
        {errors.email && <Error>{errors.email}</Error>}

        <input type="email" name="email" onChange={form.onChange} />
        <button>{submitting ? "Logging in..." : "Login"}</button>
      </form>
    </LoginWrapper>
  );
}
