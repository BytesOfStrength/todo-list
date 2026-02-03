import React, { forwardRef } from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
  white-space: nowrap;
  display: block;
  cursor: pointer;
`;

const StyledInput = styled.input`
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border: 0.125rem solid var(--border);
  border-radius: 0.5rem;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 0.25rem rgba(157, 92, 99, 0.2);
  }
`;

const StyledInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  { elementId, labelText, onChange, value },
  ref
) {
  return (
    <StyledInputContainer>
      <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </StyledInputContainer>
  );
});

export default TextInputWithLabel;
