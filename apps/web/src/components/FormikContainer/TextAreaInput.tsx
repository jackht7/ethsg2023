import React, { useEffect, useState } from 'react';
import {
  FormHelperText,
  InputLabel,
  Stack,
  TextareaAutosize,
} from '@mui/material';
import { styled } from '@mui/system';

const TextAreaInput = (props) => {
  const { label, name, formik, placeholder, description, ...others } = props;
  const [value, setValue] = useState('');

  useEffect(() => setValue(description), [description]);

  // StyledTextarea
  const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  };

  const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
  };

  const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 100%;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 24px ${
      theme.palette.mode === 'dark' ? blue[900] : blue[100]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === 'dark' ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

  // use sx prop because styled from '@mui/system' caused the problem of TextareaAutosize lossing focused
  return (
    <Stack spacing={1}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <TextareaAutosize
        id={label}
        name={name}
        value={value}
        onBlur={formik.handleBlur}
        onChange={(e) => {
          const newValue = e.target.value;
          formik.setFieldValue(name, newValue);
          setValue(newValue);
        }}
        placeholder={placeholder}
        minRows={4}
        style={{
          padding: '12px',
          borderRadius: '8px 8px 0 8px',
          border: '1px solid #d9d9d9',
        }}
      />
      {formik.touched[name] && formik.errors[name] && (
        <FormHelperText error id={label}>
          {formik.errors[name]}
        </FormHelperText>
      )}
    </Stack>
  );
};

export default TextAreaInput;
