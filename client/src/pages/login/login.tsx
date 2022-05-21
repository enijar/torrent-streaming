import React from "react";
import { LoginWrapper } from "@/pages/login/login.styles";
import { Message, Error } from "@/styles/elements";
import useForm from "@/hooks/use-form";
import { Messages, Errors } from "@/types";
import api from "@/services/api";

export default function Login() {
  const [messages, setMessages] = React.useState<Messages>({});
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);

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
