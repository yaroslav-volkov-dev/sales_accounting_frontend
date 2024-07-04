import Select from 'react-select';

export const SelectInput = ({ options, ...props }) => {
  return (
    <Select
      {...props}
      options={options}
    />
  );
};