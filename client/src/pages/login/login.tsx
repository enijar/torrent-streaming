import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { LoginWrapper } from "@/pages/login/login.styles";
import { Error, Message } from "@/styles/elements";
import useForm from "@/hooks/use-form";
import { Errors, Messages, Request } from "@/types";
import api from "@/services/api";
import Loading from "@/components/loading/loading";
import QrLogin from "@/components/qr-login/qr-login";
import config from "@/config";

const socket = io(config.apiUrl);

export default function Login() {
  const { uuid } = useParams<{ uuid?: string }>();
  const [messages, setMessages] = React.useState<Messages>({});
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const [authenticating, setAuthenticating] = React.useState(true);

  const navigate = useNavigate();

  const requestRef = React.useRef<Request>(null);

  React.useEffect(() => {
    if (requestRef.current !== null) {
      requestRef.current.abort();
    }
    const req = api.get(`/api/user?uuid=${uuid ?? ""}`);
    requestRef.current = req;
    req.send().then((res) => {
      if (res.status !== 200) {
        return setAuthenticating(false);
      }
      navigate("/streams");
    });
  }, [navigate, uuid]);

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
      const req = await api.post("/api/login", { email, uuid: uuid ?? "" });
      const res = await req.send();
      setMessages(res.messages);
      setErrors(res.errors);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  });

  const [socketId, setSocketId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSocketId(socket.id ?? null);

    function onConnect() {
      setSocketId(socket.id ?? null);
    }

    function onAuthToken(authToken: string) {
      if (requestRef.current !== null) {
        requestRef.current.abort();
      }
      const req = api.post("/api/login-with-auth-token", { authToken });
      requestRef.current = req;
      req.send().then((res) => {
        if (res.status !== 200) return;
        navigate("/streams");
      });
    }

    socket.on("connect", onConnect);
    socket.on("authToken", onAuthToken);
    return () => {
      socket.off("connect", onConnect);
      socket.off("authToken", onAuthToken);
    };
  }, []);

  if (authenticating) return <Loading />;

  return (
    <LoginWrapper>
      <h1>Login</h1>

      <form onSubmit={form.onSubmit} noValidate>
        {messages.server && <Message>{messages.server}</Message>}
        {errors.server && <Error>{errors.server}</Error>}
        {errors.email && <Error>{errors.email}</Error>}
        {uuid === undefined && <QrLogin socketId={socketId} />}

        <input type="email" name="email" onChange={form.onChange} />
        <button>{submitting ? "Logging in..." : "Login"}</button>
      </form>
    </LoginWrapper>
  );
}
