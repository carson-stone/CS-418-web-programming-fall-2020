import React, { useState } from 'react';

export default function useFormFields(initialValues) {
  const [formValues, setValues] = useState(initialValues);

  const setFormValues = (e) => {
    setValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return [formValues, setFormValues];
}
