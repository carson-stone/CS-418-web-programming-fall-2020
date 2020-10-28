import React, { useState } from 'react';

// from https://www.cssscript.com/remove-html-tags-prevent-xss/
function removeHtmlTags(a) {
  return a.replace(/(<([^>]+)>)/gi, '');
}

export default function useFormFields(initialValues) {
  const [formValues, setValues] = useState(initialValues);

  const setFormValues = (e) => {
    typeof e.target.value === 'string'
      ? setValues({
          ...formValues,
          [e.target.name]: removeHtmlTags(e.target.value),
        })
      : setValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return [formValues, setFormValues];
}
