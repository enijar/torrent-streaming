import React from "react";

type FormElement = HTMLInputElement | HTMLTextAreaElement;

type UseForm = {
  onSubmit: (event: React.FormEvent) => void;
  onChange: (event: React.ChangeEvent<FormElement>) => void;
};

type FormData = {
  [name: string]: string;
};

export default function useForm(onSubmit: (formData: FormData) => void) {
  const formData = React.useMemo<FormData>(() => {
    return {};
  }, []);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      onSubmit(formData);
    },
    [onSubmit, formData],
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<FormElement>) => {
      const { name, value } = event.currentTarget;
      formData[name] = value;
    },
    [formData],
  );

  return React.useMemo<UseForm>(() => {
    return {
      onSubmit: handleSubmit,
      onChange: handleChange,
    };
  }, [handleSubmit, handleChange]);
}
