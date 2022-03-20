import React from 'react'
import Select from 'react-select'
import {components} from 'react-select'
import Image from 'next/image'

const SelectTag = ({handleSelectChange, options, selectedValue, disabled}) => {
  const {SingleValue, Option} = components
  const IconSingleValue = (props) => (
    <SingleValue {...props}>
      <Image
        className='select_img'
        src={props.data.image}
        height={25}
        width={25}
      />
      {props.data.label}
    </SingleValue>
  )

  const IconOption = (props) => (
    <Option {...props}>
      <Image
        className='select_img'
        src={props.data.image}
        height={25}
        width={25}
      />
      {props.data.label}
    </Option>
  )
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#ef7200' : '#fafafa',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      color: state.isSelected ? '#000' : '#000',
    }),
    dropdownIndicator: () => ({
      //   display: 'none',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    control: () => ({
      border: '1px solid #fafafa',
      borderRadius: '0',
      cursor: 'pointer',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
      width: 'max-content',
    }),

    singleValue: (provided) => ({
      ...provided,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      fontSize: '15px',
    }),

    menu: (provided, state) => ({
      ...provided,
      backgroundColor: '#fafafa',
      width: 'max-content',
    }),
  }
  return (
    <Select
      styles={customStyles}
      components={{SingleValue: IconSingleValue, Option: IconOption}}
      options={options}
      isSearchable={false}
      onChange={handleSelectChange}
      value={options.filter((option) => {
        return option.value === selectedValue
      })}
      isOptionDisabled={(option) => option.value === disabled} // disable an option
    />
  )
}

export default SelectTag
